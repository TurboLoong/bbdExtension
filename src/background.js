// if you checked "fancy-settings" in extensionizr.com, uncomment this lines

// var settings = new Store("settings", {
//     "sample_setting": "This is how you use Store.js to remember values"
// });

//example of using a message handler from the inject scripts
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
// const partUrl = 'http://it.bbdservice.com:8988/man-hour/admin';

// chrome.webRequest.onCompleted.addListener(
//     function (details) {
//         console.log(details);
//     },
//     { urls: [partUrl + '/workTypeLink/getWorkTypes.html'] }
// );
