const partUrl = 'http://it.bbdservice.com:8988/man-hour/admin';

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  chrome.pageAction.show(sender.tab.id);
  if (request.message) {
    if (request.message.type == 'send') {
      sendLog(request.message.data);
    }
  }
  sendResponse();
});

function sendLog(num) {
  const curr = new Date();
  const lastFiveDaysData = [];
  chrome.storage.local.get('defaultItemMsgId', function(itemResult) {
    chrome.storage.local.get('childrenRemark', function(markResult) {
      chrome.storage.local.get('childrenNode', function(nodeResult) {
        httpPost(
          itemResult.defaultItemMsgId,
          markResult.childrenRemark,
          nodeResult.childrenNode
        );
      });
    });
  });
  function httpPost(itemMsgId, childrenRemark, childrenNode) {
    const defaultValue = {
      childrenDate: '', // 日志日期 '2019-12-8'
      childrenRemark: childrenRemark || '修改bug', //任务名称
      parentTime: '09:33:57',
      workTypeId: '940852075975733252', // 任务归属
      itemMsgId: itemMsgId || '1125328115096215553', // 项目名称
      taskTypeId: '940857794565275656', //  任务类型
      childrenDateNum: 8, // 工作时长
      childrenNode: childrenNode || '修改bug' // 任务进展描述
    };
    Array.apply(null, Array(num || 1)).forEach((value, index) => {
      const someDate = new Date();
      someDate.setDate(curr.getDate() - index);
      lastFiveDaysData.push({
        ...defaultValue,
        childrenDate: getDate(someDate)
      });
    });
    fetch(partUrl + '/logTable/saveLogTable.html', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      host: 'it.bbdservice.com:8988',
      origin: 'http://it.bbdservice.com:8988',
      referer: 'http://it.bbdservice.com:8988/man-hour/admin/index.html',
      body: formatParam(lastFiveDaysData)
    })
      .then(response => response.json())
      .then(res => {
        sendNotification('success');
      })
      .catch(result => {
        sendNotification('fail');
      });
  }
}

function sendNotification(status) {
  if (status == 'success') {
    chrome.notifications.create(null, {
      type: 'basic',
      iconUrl: 'icons/success.png',
      title: '状态',
      message: '提交日志成功'
    });
  } else if (status == 'fail') {
    chrome.notifications.create(null, {
      type: 'basic',
      iconUrl: 'icons/fail.png',
      title: '状态',
      message: '提交日志失败'
    });
  }
}
function getDate(date) {
  return (
    date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  );
}

function formatParam(params) {
  const searchParams = params
    .map((value, index) => {
      return Object.keys(value)
        .map(key => {
          return (
            encodeURIComponent(`childrenList[${index}].${key}`) +
            '=' +
            encodeURIComponent(value[key])
          );
        })
        .join('&');
    })
    .join('&');
  return searchParams;
}
