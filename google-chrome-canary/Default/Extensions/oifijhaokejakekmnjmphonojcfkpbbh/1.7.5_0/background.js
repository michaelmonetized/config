import { b as browser } from "./assets/vendor-df4776a1.js";
import { d as loadSites } from "./assets/load-a81c33fb.js";
const loadSitesListener = async (message) => {
  if (message.action === "loadSites") {
    const loadSitesMessage = message;
    return loadSites(
      loadSitesMessage.text,
      loadSitesMessage.lazyloading,
      loadSitesMessage.random,
      loadSitesMessage.reverse,
      loadSitesMessage.deduplicate,
      loadSitesMessage.handleAsSearchQuery,
      loadSitesMessage.selectedTabGroupId,
      loadSitesMessage.selectedContainerId
    );
  }
  return false;
};
browser.runtime.onMessage.addListener(loadSitesListener);
//# sourceMappingURL=background.js.map
