chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);

      // ----------------------------------------------------------
      // This part of the script triggers when page is done loading
      // ----------------------------------------------------------
      const addNewIndexLink = document.querySelector(
        '#newapply[rurl="/man-hour/admin/logTable/addNewIndex.html"]'
      );
      addNewIndexLink.click();
      const iframe = document.querySelector('iframe');
      iframe.onload = function() {
        const iframeDoc = iframe.contentWindow.document;
        if (iframeDoc.title == '工时管理22222') {
          const addBtn = iframeDoc.querySelector('.addBtn');
          addBtn.click();
        } else {
          chrome.tabs.query({ active: true, currentWindow: true }, function(
            tabs
          ) {
            var tab = tabs[0];
            var url = new URL(tab.url);
            var domain = url.hostname;
            // `domain` now has a value like 'example.com'
          });
          fetch(
            'http://it.bbdservice.com:8988/man-hour/admin/logTable/saveLogTable.html'
          )
            .then(r => r.text())
            .then(result => {
              // Result now contains the response text, do what you want...
            });
        }
      };
    }
  }, 10);
});
