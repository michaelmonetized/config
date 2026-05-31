// This code is called by Helpers.ListViewportHelper via Yesware.Injector, which loads this script
// using chrome.runtime.getURL. It reads the selected items on the Salesforce _Classic_ version of
// the Contacts list page, then posts the resulting array of IDs to the page, enabling
// them to be passed to Campaigns.
(function() {
    // This function directly accesses Salesforce's undocumented, in-page javascript APIs.
    // These calls were figured out by reverse engineering a Salesforce page.
    function readSelectedItems(viewportId) {
        var instance = window.ListViewport.instances[viewportId];
        var selectionModel = instance.grid.getSelectionModel();

        return selectionModel.selections.items.map(function(i) {
            return i.id;
        });
    }
    var script = document.currentScript;
    var args, mtype, viewportId;

    var result, success = true;
    try {
        args = JSON.parse(script.dataset.args);
        mtype = args.type;
        viewportId = args.viewportId;
        result = readSelectedItems(viewportId);
    } catch(e) {
        success = false;
        result = e.message;
    }
    window.postMessage({ type: mtype, result: result, success: success }, window.location.origin);
})();
