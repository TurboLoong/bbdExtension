chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);
      getLinkItemMsg();
    }
  }, 10);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'start' && request.date == 'today') {
    sendMessageToBackground({ type: 'send', data: 1 });
  } else {
    sendMessageToBackground({ type: 'send', data: 5 });
  }
});

function getLinkItemMsg() {
  const date = new Date();
  fetch(partUrl + `/itemMsg/getLinkItemMsg.html?parentDate=${getDate(date)}`)
    .then(r => r.json())
    .then(response => {
      chrome.storage.local.set({ linkItemMsg: response }, function() {
        console.log('linkItemMsg Value is set to ');
      });
    });
}
