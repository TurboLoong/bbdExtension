chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);
      parseCode();
      function parseCode() {
        const src = document.querySelector('.loginbox img').src;
        // chrome.runtime.sendMessage({
        //   message: { type: 'download', data: src }
        // });
        fetch(src)
          .then(res => res.blob())
          .then(blob => {
            const link = document.createElement('a');
            link.download = 'code.jpg';
            link.href = URL.createObjectURL(blob);
            link.click();
            URL.revokeObjectURL(link.href);

            // chrome.runtime.sendMessage({
            //   message: { type: 'download', data: href }
            // });
          });
      }
    }
  }, 10);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message == 'send') {
    chrome.runtime.sendMessage({
      message: { type: 'send', data: request.data }
    });
  }
  return true;
});
