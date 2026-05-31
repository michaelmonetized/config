/*
* Rewiring window.confirm method here:
* this will check in gmail for attachments and if Gmail native or Yesware managed attachments are included,
* it won't pop up the confirmation dialog box, else it would behave normally like it does.
*
* */
(function() {
    const oldConfirm = window.confirm;
    window.confirm = function(msg) {
        const re = /It seems like you forgot to attach a file/;
        if (re.test(msg) &&
            (document.querySelectorAll(".yw-tracked-file-attachment").length > 0)) {
            return true;
        }
        return oldConfirm(msg);

    };

})()
