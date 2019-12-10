chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        localStorage["total_elements"] = request;
    }
)
// document.querySelector('#linkItemMsgSelect').append