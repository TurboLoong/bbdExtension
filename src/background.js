chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.pageAction.show(sender.tab.id);
  if (request.message == 'success') {
    chrome.notifications.create(null, {
      type: 'basic',
      iconUrl: 'icons/success.png',
      title: '状态',
      message: '提交日志成功'
    });
  } else if (request.message == 'fail') {
    chrome.notifications.create(null, {
      type: 'basic',
      iconUrl: 'icons/fail.png',
      title: '状态',
      message: '提交日志失败'
    });
  }
  sendResponse();
});
