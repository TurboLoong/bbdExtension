document.addEventListener('DOMContentLoaded', async function() {
  function modifyDOM() {
    return document
      .querySelector('.navbar-custom-menu')
      .querySelectorAll('.messages-menu')[1].innerHTML;
  }
  const doc = document;
  chrome.tabs.executeScript(
    {
      code: '(' + modifyDOM + ')();'
    },
    async results => {
      const href = $(results[0])[0].href;
      var iframe = doc.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = href;
      doc.body.appendChild(iframe);
      const linkItemMsg = await getLinkItemMsg();
      const linkTaskType = await getTaskType();
      init(linkItemMsg, linkTaskType);
    }
  );

  $('#submitTodayBtn').on('click', function() {
    const params = {
      childrenRemark: $('#childrenRemark').val(),
      childrenNode: $('#childrenNode').val(),
      itemMsgId: $('#itemMsgSelect').val(),
      taskTypeId: $('#taskTypeSelect').val()
    };
    saveLocalData(params);
    sendMessage(1);
  });
  const weekDay = new Date().getDay();
  if ([5, 6, 7].includes(weekDay)) {
    $('#submitFiveBtn').on('click', function() {
      const params = {
        childrenRemark: $('#childrenRemark').val(),
        childrenNode: $('#childrenNode').val(),
        itemMsgId: $('#itemMsgSelect').val(),
        taskTypeId: $('#taskTypeSelect').val()
      };
      saveLocalData(params);
      sendMessage(weekDay);
    });
  } else {
    $('#submitFiveBtn').attr('disabled', true);
  }
});

function sendMessage(day) {
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, {
      message: 'send',
      data: day
    });
  });
}

function init(linkItemMsg, linkTaskType) {
  chrome.storage.local.get('params', function(local) {
    const params = local.params || {
      itemMsgId: null,
      taskTypeId: null,
      childrenRemark: '',
      childrenNode: ''
    };
    // 任务名称
    const childrenRemarkEle = $('#childrenRemark');
    childrenRemarkEle.val(params.childrenRemark);

    // 任务描述
    const childrenNodeEle = $('#childrenNode');
    childrenNodeEle.val(params.childrenNode);

    // 项目名称
    const itemMsgId = params.itemMsgId;
    let itemOptionsEle = '';
    linkItemMsg.forEach((value, index) => {
      itemOptionsEle += `<option value=${value.itemMsgId} ${
        itemMsgId == value.itemMsgId ? 'selected' : ''
      }>${value.itemMsgName}</option>`;
    });
    const itemMsgSelectEle = $('#itemMsgSelect');
    itemMsgSelectEle.html(itemOptionsEle);
    itemMsgSelectEle.comboSelect();

    // 任务类型
    const taskTypeId = params.taskTypeId;
    let taskOptionsEle = '';
    linkTaskType.forEach((value, index) => {
      taskOptionsEle += `<option value=${value.taskTypeId} ${
        taskTypeId == value.taskTypeId ? 'selected' : ''
      }>${value.taskTypeName}</option>`;
    });
    const taskTypeSelectEle = $('#taskTypeSelect');
    taskTypeSelectEle.html(taskOptionsEle);
    taskTypeSelectEle.comboSelect();
  });
}
const partUrl = 'http://it.bbdservice.com:8988/man-hour/admin';

function getLinkItemMsg() {
  const date = new Date();
  return fetch(
    partUrl + `/itemMsg/getLinkItemMsg.html?parentDate=${getDate(date)}`
  ).then(r => r.json());
}
function getTaskType() {
  return fetch(
    partUrl + '/workTypeLink/getLinkTaskType.html?workTypeId=940852075975733252'
  ).then(r => r.json());
}

function saveLocalData(params) {
  chrome.storage.local.set({
    params: params
  });
}

function getDate(date) {
  return (
    date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  );
}
