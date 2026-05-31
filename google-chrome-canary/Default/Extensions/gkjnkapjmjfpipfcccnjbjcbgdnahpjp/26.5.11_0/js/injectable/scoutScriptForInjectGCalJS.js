(function () {
  /**
   * This "scout" script is a thin shim that we inject into gcal tabs every time
   * a tab "updated" event is received. If that tab hasn't previously been initialized
   * when the scout script executes, it will request that we inject the much, much larger
   * main Yesware javascript and css payloads.
   */
  var initialized = document.body.attributes["data-yesware-initialized"];
  var initializing = document.body.attributes["data-yesware-initializing"];
  if (!initializing && !initialized) {
    // It's possible for the scout script to be executed multiple times before
    // `data-yesware-initialized` gets set by yesware.init, so set a flag to
    // ensure that we don't request multiple injections.
    document.body.setAttribute("data-yesware-initializing", "true");

    // Request injection of the main Yesware code
    chrome.runtime.sendMessage({ action: "injectGCalJS" });
  };
})();
