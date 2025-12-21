#!/usr/bin/env bash
set -euo pipefail

# ============================================================
# Arch install for michaelmonetized/config
# Assumes repo lives at: ~/Projects/config
#
# What it does:
# - Installs core packages via pacman
# - Installs yay (optional) + AUR packages (Noto Nerd Font + optional extras)
# - Installs Ghostty via pacman (official repo)
# - Installs zinit at ~/.local/share/zinit/zinit.git (matches your zsh/zinit file)
# - Sets zsh as your login shell
# - Symlinks repo config folders into ~/.config
# - Writes a small ~/.zshrc "glue" that sources your repo zsh files
#
# Flags:
#   --dry-run    Print actions without changing anything
#   --no-aur     Don't install yay or any AUR packages
#   --mac        Also symlink macOS-only folders (usually not desired on Arch)
# ============================================================

WITH_AUR=true
DRY_RUN=false
LINK_MAC=false

for arg in "$@"; do
  case "$arg" in
    --no-aur) WITH_AUR=false ;;
    --dry-run) DRY_RUN=true ;;
    --mac) LINK_MAC=true ;;
    *) echo "Unknown arg: $arg" >&2; exit 1 ;;
  esac
done

log()  { printf "\n\033[1m==>\033[0m %s\n" "$*"; }
warn() { printf "\n\033[33m[warn]\033[0m %s\n" "$*"; }
die()  { printf "\n\033[31m[err]\033[0m %s\n" "$*"; exit 1; }

run() {
  if $DRY_RUN; then
    echo "+ $*"
  else
    eval "$@"
  fi
}

need() { command -v "$1" >/dev/null 2>&1; }
is_arch() { [[ -f /etc/pacman.conf || -f /etc/arch-release ]]; }

# Your fixed dotfiles location while you iterate
REPO_ROOT="$HOME/Projects/config"

backup_if_exists() {
  local path="$1"
  if [[ -e "$path" || -L "$path" ]]; then
    local bak="${path}.bak.$(date +%Y%m%d%H%M%S)"
    warn "Backing up existing: $path -> $bak"
    run "mv '$path' '$bak'"
  fi
}

symlink() {
  local src="$1"
  local dst="$2"

  [[ -e "$src" ]] || { warn "Missing in repo, skipping: $src"; return 0; }

  # Already correct symlink?
  if [[ -L "$dst" ]] && [[ "$(readlink "$dst")" == "$src" ]]; then
    return 0
  fi

  # Backup existing destination
  if [[ -e "$dst" || -L "$dst" ]]; then
    backup_if_exists "$dst"
  fi

  run "mkdir -p \"$(dirname "$dst")\""
  run "ln -s '$src' '$dst'"
}

pac_install() {
  local pkgs=("$@")
  run "sudo pacman -S --needed --noconfirm ${pkgs[*]}"
}

install_yay_if_needed() {
  if need yay; then return 0; fi
  $WITH_AUR || die "yay not installed and --no-aur was set (can't install AUR packages)."

  log "Installing yay (AUR helper)"
  pac_install base-devel git

  local tmp
  tmp="$(mktemp -d)"
  run "git clone https://aur.archlinux.org/yay.git '$tmp/yay'"
  run "cd '$tmp/yay' && makepkg -si --noconfirm"
  run "rm -rf '$tmp'"
}

aur_install() {
  install_yay_if_needed
  run "yay -S --needed --noconfirm $*"
}

install_packages() {
  log "Updating pacman database"
  run "sudo pacman -Sy --noconfirm"

  log "Installing core packages"
  pac_install \
    git curl wget unzip \
    neovim tmux \
    ripgrep fd fzf \
    bat eza jq \
    zoxide \
    git-delta \
    openssh ca-certificates \
    zsh \
    ghostty

  # Optional goodies if available
  pac_install htop || true
  pac_install neofetch || true

  # atuin/thefuck: try pacman first, fallback to AUR if missing
  if ! pac_install atuin 2>/dev/null; then
    warn "atuin not available via pacman; trying AUR"
    $WITH_AUR && aur_install atuin || true
  fi
  if ! pac_install thefuck 2>/dev/null; then
    warn "thefuck not available via pacman; trying AUR"
    $WITH_AUR && aur_install thefuck || true
  fi
}

install_fonts() {
  log "Installing Noto Sans Mono Nerd Font (patched; p10k icons)"
  if $WITH_AUR; then
    # Correct AUR package name for Noto Sans Mono Nerd Font
    aur_install nerd-fonts-noto-sans-mono
  else
    warn "Needs AUR: yay -S nerd-fonts-noto-sans-mono"
  fi
}

install_zinit_repo_style() {
  # Your repo zsh/zinit expects this exact location:
  local zinit_home="${XDG_DATA_HOME:-$HOME/.local/share}/zinit/zinit.git"

  if [[ -f "$zinit_home/zinit.zsh" ]]; then
    log "zinit already installed at: $zinit_home"
    return 0
  fi

  log "Installing zinit at: $zinit_home"
  run "mkdir -p \"$(dirname "$zinit_home")\""
  run "git clone https://github.com/zdharma-continuum/zinit.git '$zinit_home'"
}

ensure_zsh_login_shell() {
  log "Setting zsh as default shell"

  local zsh_path
  zsh_path="$(command -v zsh || true)"
  [[ -n "$zsh_path" ]] || die "zsh not found after install?"

  if ! grep -qE "^${zsh_path}$" /etc/shells; then
    run "echo '$zsh_path' | sudo tee -a /etc/shells >/dev/null"
  fi

  if [[ "${SHELL:-}" != "$zsh_path" ]]; then
    # chsh prompts for your user password
    run "chsh -s '$zsh_path' || true"
  fi
}

link_repo_configs() {
  log "Symlinking repo configs into ~/.config"
  run "mkdir -p '$HOME/.config' '$HOME/.local/bin'"

  # Repo-managed config dirs (Linux-friendly)
  # Only symlink if the folder exists in the repo.
  for d in \
    nvim tmux-powerline gh atuin htop micro neofetch task thefuck configstore gtk-2.0
  do
    [[ -d "$REPO_ROOT/$d" ]] && symlink "$REPO_ROOT/$d" "$HOME/.config/$d"
  done

  # Optional terminal configs you have in repo
  [[ -d "$REPO_ROOT/alacritty" ]] && symlink "$REPO_ROOT/alacritty" "$HOME/.config/alacritty"
  [[ -d "$REPO_ROOT/wezterm" ]] && symlink "$REPO_ROOT/wezterm" "$HOME/.config/wezterm"

  # Helper script
  [[ -f "$REPO_ROOT/tmux-start.sh" ]] && symlink "$REPO_ROOT/tmux-start.sh" "$HOME/.local/bin/tmux-start"

  if $LINK_MAC; then
    warn "Linking macOS-only folders too (--mac enabled)"
    for d in aerospace borders iterm2 karabiner raycast sketchybar skhdrc sounds yabai; do
      [[ -d "$REPO_ROOT/$d" ]] && symlink "$REPO_ROOT/$d" "$HOME/.config/$d"
    done
  fi
}

setup_ghostty_config() {
  log "Ghostty config"

  local repo_cfg="$REPO_ROOT/ghostty"
  local user_cfg="$HOME/.config/ghostty"

  # If you add ghostty/ to the repo, we’ll manage it via symlink.
  if [[ -d "$repo_cfg" ]]; then
    log "Linking Ghostty config from repo"
    symlink "$repo_cfg" "$user_cfg"
  else
    warn "No $repo_cfg found in repo yet — leaving your existing Ghostty config alone"
  fi
}

write_zshrc_glue() {
  log "Writing ~/.zshrc glue to source repo zsh files"

  local zsh_dir="$REPO_ROOT/zsh"
  [[ -d "$zsh_dir" ]] || die "Expected zsh dir not found: $zsh_dir"

  # Provide ~/.p10k.zsh symlink if repo has p10k file
  if [[ -f "$zsh_dir/p10k" ]]; then
    symlink "$zsh_dir/p10k" "$HOME/.p10k.zsh"
  fi

  # Backup existing ~/.zshrc unless it's a symlink (you can keep your own if you want)
  if [[ -e "$HOME/.zshrc" && ! -L "$HOME/.zshrc" ]]; then
    backup_if_exists "$HOME/.zshrc"
  fi

  if $DRY_RUN; then
    echo "+ write $HOME/.zshrc (sources $zsh_dir/rc, $zsh_dir/zinit, ~/.p10k.zsh)"
    return 0
  fi

  cat > "$HOME/.zshrc" <<EOF
# Auto-generated by ~/Projects/config/install.sh (Arch glue)
# Repo: $REPO_ROOT

export PATH="\$HOME/.local/bin:\$HOME/bin:\$PATH"

# Your main zsh config
[[ -f "$zsh_dir/rc" ]] && source "$zsh_dir/rc"

# zinit (repo style)
ZINIT_HOME="\${XDG_DATA_HOME:-\$HOME/.local/share}/zinit/zinit.git"
if [[ -f "\$ZINIT_HOME/zinit.zsh" ]]; then
  [[ -f "$zsh_dir/zinit" ]] && source "$zsh_dir/zinit"
fi

# Powerlevel10k
[[ -f "\$HOME/.p10k.zsh" ]] && source "\$HOME/.p10k.zsh"
EOF
}

main() {
  is_arch || die "This install.sh is intended for Arch Linux."
  need sudo || die "sudo not found."
  [[ -d "$REPO_ROOT" ]] || die "Repo not found at $REPO_ROOT (clone/pull it there first)."

  install_packages
  install_fonts
  install_zinit_repo_style
  ensure_zsh_login_shell
  link_repo_configs
  setup_ghostty_config
  write_zshrc_glue

  cat <<'EOF'

✅ Complete.

Next steps:
1) Fully log out + log back in (or reboot) so the login shell switch applies.
2) Open Ghostty (it will read ~/.config/ghostty/config if you symlinked it from the repo).
3) Start zsh now:
   exec zsh
4) (Optional) Re-run p10k wizard:
   p10k configure

Flags:
  --no-aur   skip AUR installs (no Noto Nerd Font)
  --dry-run  print actions only
  --mac      also symlink macOS-only folders

EOF
}

main

