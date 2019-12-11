const partUrl = 'http://it.bbdservice.com:8988/man-hour/admin';
chrome.extension.sendMessage({}, function(response) {
  var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === 'complete') {
      clearInterval(readyStateCheckInterval);
      const addNewIndexLink = document.querySelector(
        '#newapply[rurl="/man-hour/admin/logTable/addNewIndex.html"]'
      );
      addNewIndexLink.click();
      const iframe = document.querySelector('iframe');
      iframe.onload = function() {
        getLinkItemMsg();
      };
    }
  }, 10);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'start' && request.date == 'today') {
    sendLog(1);
  } else {
    sendLog(5);
  }
});

async function sendLog(num) {
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
      body: formatParam(lastFiveDaysData)
    })
      .then(response => response.json())
      .then(res => {
        sendMessageToBackground('success');
      })
      .catch(result => {
        sendMessageToBackground('fail');
      });
  }
}

function getLinkItemMsg() {
  const date = new Date();
  fetch(partUrl + '/itemMsg/getLinkItemMsg.html', {
    parentDate: getDate(date)
  })
    .then(r => r.json())
    .then(response => {
      chrome.storage.local.set({ linkItemMsg: response }, function() {
        console.log('linkItemMsg Value is set to ');
      });
    });
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

function sendMessageToBackground(message) {
  chrome.runtime.sendMessage({ message }, function(response) {
    console.log('收到来自后台的回复：');
  });
}
