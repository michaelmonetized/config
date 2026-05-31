/*
* Mouse event dispatch
* Whenever we are using Yesware scheduler for sending emails later, we have to send a call to schedule-message endpoint
* As soon as we are done with the call, the opened composer window is needed to be closed, this event does that
* */
(function() {
    const evt = new MouseEvent("mouseup", {
        view: window,
        bubbles: true,
        cancelable: true
    });

    const script = document.currentScript;
    let args, uniqueClass;
    try {
        args = JSON.parse(script.dataset.args);
        uniqueClass = args.uniqueClass;
        if (uniqueClass) {
            document.getElementsByClassName(uniqueClass)[0].dispatchEvent(evt);
        }

    } catch (e) {
        console.error(e);
    }

})()




