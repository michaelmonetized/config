#!/bin/zsh

echo "Starting tmux_start.sh" >> ~/tmux_start.log
date >> ~/tmux_start.log

# Check if we're already in a tmux session
if [ -n "$TMUX" ]; then
    echo "Already in a tmux session" >> ~/tmux_start.log
    exit 0
fi

# Check if the desired session exists
if /usr/bin/tmux has-session -t hustlelaunch 2>/dev/null; then
    echo "Attaching to existing session" >> ~/tmux_start.log
    exec /usr/bin/tmux attach-session -t hustlelaunch
else
    echo "Creating new session" >> ~/tmux_start.log
    exec /usr/bin/tmux new-session -s hustlelaunch
fi

echo "This line should not be reached" >> ~/tmux_start.log
