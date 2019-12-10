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
        const iframeDoc = iframe.contentWindow.document;
        // 点击新增
        if (iframeDoc.title == '工时管理22222') {
          const addBtn = iframeDoc.querySelector('.addBtn');
          addBtn.click();
        } else {
          getLinkItemMsg();
          // sendLog();
        }
      };
    }
  }, 10);
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message === 'start') {
    sendLog();
  }
});

async function sendLog() {
  const curr = new Date();
  const lastFiveDaysData = [];
  chrome.storage.local.get('defaultItemMsgId', function(result) {
    httpPost(result.defaultItemMsgId);
  });
  function httpPost(itemMsgId) {
    const defaultValue = {
      childrenDate: '', // 日志日期 '2019-12-8'
      childrenRemark: '修改bug',
      workTypeId: 940852075975733252, // 任务归属
      itemMsgId: itemMsgId || 1125328115096215553, // 项目名称
      taskTypeId: 940857794565275656, //  任务类型
      childrenDateNum: 8, // 工作时长
      childrenNode: '修改bug' // 任务进展描述
    };

    Array.apply(null, Array(5)).forEach((value, index) => {
      const someDate = new Date();
      someDate.setDate(curr.getDate() - index);
      lastFiveDaysData.push({
        ...defaultValue,
        childrenDate: getDate(someDate)
      });
    });

    const formData = new FormData();
    lastFiveDaysData.forEach((value, index) => {
      for (const key in value) {
        formData.append('childrenList[' + index + '].' + key, value[key]);
      }
    });

    //   const res = await fetch(partUrl + '/logTable/saveLogTable.html', {
    //     method: 'POST',
    //     body: formData
    //   }).then(response => response.json());

    console.log(formData);
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
  return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
}
