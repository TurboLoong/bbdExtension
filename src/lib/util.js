const partUrl = 'http://it.bbdservice.com:8988/man-hour/admin';

function getLinkItemMsg() {
  const date = new Date();
  fetch(partUrl + `/itemMsg/getLinkItemMsg.html?parentDate=${getDate(date)}`)
    .then(r => r.json())
    .then(response => {
      chrome.storage.local.set({ linkItemMsg: response }, function() {
        console.log('linkItemMsg Value is set to ');
      });
    })
    .catch(function() {
      chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'icons/info.png',
        title: '状态',
        message: '提一次使用请先登录UT，以后直接登录OA就可以提交'
      });
    });
}

function getTaskType() {
  const date = new Date();
  fetch(
    partUrl + '/workTypeLink/getLinkTaskType.html?workTypeId=940852075975733252'
  )
    .then(r => r.json())
    .then(response => {
      chrome.storage.local.set({ linkTaskType: response }, function() {
        console.log('linkItemMsg Value is set to ');
      });
    })
    .catch(function() {
      chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: 'icons/info.png',
        title: '状态',
        message: '提一次使用请先登录UT，以后直接登录OA就可以提交'
      });
    });
}

function getDate(date) {
  return (
    date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  );
}

function sendMessageToBackground(message) {
  chrome.runtime.sendMessage({ message }, function(response) {
    console.log('收到来自后台的回复：');
  });
}
