const partUrl = 'http://it.bbdservice.com:8988/man-hour/admin';

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (sender.tab.url == 'http://192.168.2.240:8080/main/fixed.jsp') {
    chrome.pageAction.show(sender.tab.id);
  }
  if (request.message) {
    if (request.message.type == 'send') {
      sendLog(request.message.data);
    }
  }
  sendResponse();
});

function sendLog(num) {
  const curr = new Date();
  chrome.storage.local.get('params', function(local) {
    httpPost(local.params);
  });
  function httpPost({ itemMsgId, childrenRemark, childrenNode, taskTypeId }) {
    const lastFiveDaysData = [];

    const defaultValue = {
      childrenDate: '', // 日志日期 '2019-12-8'
      childrenRemark: childrenRemark || '修改bug', //任务名称
      parentTime: '09:33:57',
      workTypeId: '940852075975733252', // 任务归属
      itemMsgId: itemMsgId || '1125328115096215553', // 项目名称
      taskTypeId: taskTypeId || '940857794565275656', //  任务类型
      childrenDateNum: 8, // 工作时长
      childrenNode: childrenNode || '修改bug' // 任务进展描述
    };
    if (num == 1) {
      lastFiveDaysData.push({
        ...defaultValue,
        childrenDate: getDate(curr)
      });
    } else {
      // 获取当周的周一到周五的日期
      Array.apply(null, Array(5)).forEach((value, index) => {
        let someDate = new Date();
        someDate.setDate(curr.getDate() - (curr.getDay() - (5 - index)));
        lastFiveDaysData.push({
          ...defaultValue,
          childrenDate: getDate(someDate)
        });
      });
    }

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

function sendNotification(status, message) {
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
  } else if (status == 'info') {
    chrome.notifications.create(null, {
      type: 'basic',
      iconUrl: 'icons/info.png',
      title: '状态',
      message: message
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
