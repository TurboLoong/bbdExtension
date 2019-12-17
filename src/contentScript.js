chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);
      if (document.location.pathname == '/main/fixed.jsp') {
        var iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src =
          'http://it.bbdservice.com:8988/man-hour/admin/index.html?oldId=402882705d762f7c015d78101173077c';
        document.body.appendChild(iframe);
      }
    }
  }, 10);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message == 'send') {
    sendMessageToBackground({ type: 'send', data: request.data });
  }
});
