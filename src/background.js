const partUrl = 'http://it.bbdservice.com:8988/man-hour/admin';
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (sender.tab.url == 'http://192.168.2.240:8080/main/fixed.jsp') {
    chrome.pageAction.show(sender.tab.id);
  } else if (request.message) {
    if (request.message.type == 'send') {
      sendLog(request.message.data);
    } else if (request.message.type == 'download') {
      let currId = '';
      chrome.downloads.download(
        {
          url:
            'http://upload.wikimedia.org/wikipedia/commons/6/6e/Moonbeam_UFO.JPG',
          filename: 'code.jpeg',
          conflictAction: 'overwrite',
          saveAs: false
        },
        function(downloadId) {
          currId = downloadId;
        }
      );
      chrome.downloads.onChanged.addListener(function(item) {
        if (
          item.id === currId &&
          item.state &&
          item.state.current == 'complete'
        ) {
          console.log(item.id);
        }
      });
    }
  }
  // else if (sender.tab.url.includes('it.bbdservice.com:9898')) {

  //   chrome.tabs.executeScript(null, {
  //     code: '(' + parseCode() + ')()'
  //   });
  // }
});

function sendLog(days) {
  chrome.storage.local.get('params', function(local) {
    httpPost(local.params);
  });
  function httpPost({ itemMsgId, childrenRemark, childrenNode, taskTypeId }) {
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

    const params = [];
    days.forEach((value, index) => {
      params.push({
        ...defaultValue,
        childrenDate: value
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
      body: formatParam(params)
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
  chrome.runtime.sendMessage({
    type: 'msg',
    data: status
  });
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
