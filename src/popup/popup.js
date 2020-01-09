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
    results => {
      const href = $(results[0])[0].href;
      var iframe = doc.createElement('iframe');
      iframe.id = 'UTiframe';
      iframe.style.display = 'none';
      iframe.src = href;
      doc.body.appendChild(iframe);
      $('iframe#UTiframe').load(async function() {
        const notFills = await getNotFill();
        const linkItemMsg = await getLinkItemMsg();
        const linkTaskType = await getTaskType();
        init(notFills, linkItemMsg, linkTaskType);
      });
    }
  );
  $('#submitBtn').on('click', function() {
    let days = [];
    $('input[name="checkboxItem"]:checked').each(function() {
      days.push($(this).val());
    });
    if (days.length) {
      const params = {
        childrenRemark: $('#childrenRemark').val(),
        childrenNode: $('#childrenNode').val(),
        itemMsgId: $('#itemMsgSelect').val(),
        taskTypeId: $('#taskTypeSelect').val()
      };
      saveLocalData(params);
      sendMessage(days);
    }
  });
});

chrome.runtime.onMessage.addListener(async function(
  request,
  sender,
  sendResponse
) {
  if (request.type == 'msg') {
    const message = {
      success: '<span class="has-text-success">提交日志成功</span>',
      fail: '<span class="has-text-warning">提交日志失败</span>'
    };
    $('#backMessage').html(message[request.data]);
    const notFills = await getNotFill();
    if (Array.isArray(notFills) && notFills.length) {
      $('#notFillItems').html(
        notFills.reduce(
          (pre, curr) =>
            pre +
            `<span class="checkItem"><span class="check_span"><input type="checkbox" name="checkboxItem" value="${curr}"></span>${curr}</span>`,
          '<div class="checkItem"><span class="check_span"><input type="checkbox" id="checkAll"></span> 全选</div>'
        )
      );
    } else {
      $('#notFillItems').text('没有日志可填写');
    }
    $('#notFillItems').selectCheck({
      allId: 'checkAll',
      parentSelect: '.checkItem'
    });
  }
});

function sendMessage(days) {
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(
      activeTab.id,
      {
        message: 'send',
        data: days
      },
      function(res) {
        console.log(res);
      }
    );
  });
}

function init(notFills, linkItemMsg, linkTaskType) {
  // 未填报日期
  if (Array.isArray(notFills) && notFills.length) {
    $('#notFillItems').html(
      notFills.reduce(
        (pre, curr) =>
          pre +
          `<span class="checkItem"><span class="check_span"><input type="checkbox" name="checkboxItem" value="${curr}"></span>${curr}</span>`,
        '<div class="checkItem"><span class="check_span"><input type="checkbox" id="checkAll"></span> 全选</div>'
      )
    );
  } else {
    $('#notFillItems').text('没有日志可填写');
  }
  $('#notFillItems').selectCheck({
    allId: 'checkAll',
    parentSelect: '.checkItem'
  });
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

function getNotFill() {
  return fetch(
    partUrl + '/tableShow/getNotFill.html?_=' + new Date().getTime()
  ).then(res => res.json());
}

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
    date.getFullYear() +
    '-' +
    isLessThanTen(date.getMonth() + 1) +
    '-' +
    isLessThanTen(date.getDate())
  );
}

function isLessThanTen(num) {
  return num < 10 ? '0' + num : num;
}
