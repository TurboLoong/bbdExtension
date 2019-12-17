function sendMessageToBackground(message) {
  chrome.runtime.sendMessage({ message }, function(response) {
    console.log('收到来自后台的回复：');
  });
}
