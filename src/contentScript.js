chrome.extension.sendMessage({}, function (response) {
    var readyStateCheckInterval = setInterval(function () {
        if (document.readyState === 'complete') {
            clearInterval(readyStateCheckInterval);
            //   const addNewIndexLink = document.querySelector(
            //     '#newapply[rurl="/man-hour/admin/logTable/addNewIndex.html"]'
            //   );
            //   addNewIndexLink.click();
            //   const iframe = document.querySelector('iframe');
            //   iframe.onload = function() {
            getLinkItemMsg();
            //};
        }
    }, 10);
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message === 'start' && request.date == 'today') {
        sendMessageToBackground({ type: 'send', data: 1 });
    } else {
        sendMessageToBackground({ type: 'send', data: 5 });
    }
});