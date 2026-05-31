// This code is called by Helpers.ListViewManagerHelper via Yesware.Injector, which loads this script
// using chrome.runtime.getURL. It reads the selected items on the Salesforce _Lightning_ version of
// the Contacts list page, then posts the resulting array of IDs to the page, enabling
// them to be passed to Campaigns.
(function() {
    function readSelectedItems() {
        try {
            var listViewManagerHtml = document.getElementsByClassName("forceListViewManager")[0];
            // $A gives access to the underlying Aura framework
            // To view api documentation, visit https://<myDomain>.lightning.force.com/auradocs/reference.app,
            // where <myDomain> is the name of your custom Salesforce domain.
            // Some other $A resources that don't require login to Salesforce:
            // https://resources.docs.salesforce.com/sfdc/pdf/lightning.pdf (developer guide)
            // https://developer.salesforce.com/resource/pdfs/Lightning_Components_Cheatsheet.pdf (cheat sheet)
            var listViewManagerComponent = $A?.getComponent(listViewManagerHtml);

            // The key under which the listViewManager instance resides appears to change at
            // the whim of Saleforce's minifier, so search through the available values to
            // find our huckleberry.
            var listViewInstance = Object.values(listViewManagerComponent ?? {}).find(value => {
                // Our desired instance toString()s as "markup://force:listViewManager {256:0} {listViewManager}"
                return value && value.toString().includes("listViewManager");
            });
            return listViewInstance?.getSelectionModel()?.selectedItems || [];
        } catch (e) {
            // If we can't find the listViewManager, return an empty array
            console.error("Error reading selected items from Lightning ListViewManager:", e);
            return [];
        }
    }
    var script = document.currentScript;

    var args, mtype;
    var result, success = true;
    try {
        args = JSON.parse(script.dataset.args);
        mtype = args.type;
        auroraSelectedIds = readSelectedItems();
        lightingComponentSelectedIds = JSON?.parse(localStorage?.getItem('ywSelectedRowIds') || '[]');
        result = auroraSelectedIds.length > 0 ? auroraSelectedIds : lightingComponentSelectedIds;
    } catch(e) {
        success = false;
        result = e.message;
    }
    window.postMessage({ type: mtype, result: result, success: success }, window.location.origin);
})();

