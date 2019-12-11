const partUrl = 'http://it.bbdservice.com:8988/man-hour/admin';

function getLinkItemMsg() {
    const date = new Date();
    fetch(partUrl + `/itemMsg/getLinkItemMsg.html?parentDate=${getDate(date)}`)
        .then(r => r.json())
        .then(response => {
            chrome.storage.local.set({ linkItemMsg: response }, function () {
                console.log('linkItemMsg Value is set to ');
            });
        });
}

function getDate(date) {
    return (
        date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
    );
}

function sendMessageToBackground(message) {
    chrome.runtime.sendMessage({ message }, function (response) {
        console.log('收到来自后台的回复：');
    });
}
