document.addEventListener('DOMContentLoaded', function() {
  init();
  $('#submitTodayBtn').on('click', function(params) {
    sendMessage(1);
  });
  const weekDay = new Date().getDay();
  if ([5, 6, 7].includes(weekDay)) {
    $('#submitFiveBtn').on('click', function(params) {
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

function init() {
  chrome.storage.local.get('params', function(local) {
    const params = local.params || {
      itemMsgId: null,
      childrenRemark: '',
      childrenNode: ''
    };
    // 任务名称
    const childrenRemarkEle = $('#childrenRemark');
    childrenRemarkEle.val(params.childrenRemark);
    childrenRemarkEle.change(function(e) {
      chrome.storage.local.set({
        params: { ...params, childrenRemark: e.target.value }
      });
    });

    // 任务描述
    const childrenNodeEle = $('#childrenNode');
    childrenNodeEle.val(params.childrenNode);
    childrenNodeEle.change(function(e) {
      chrome.storage.local.set({
        params: { ...params, childrenNode: e.target.value }
      });
    });

    const itemMsgId = params.itemMsgId;
    chrome.storage.local.get('linkItemMsg', function(local) {
      const linkItemMsg = local.linkItemMsg;
      let optionsEle = '';
      linkItemMsg.forEach((value, index) => {
        optionsEle += `<option value=${value.itemMsgId} ${
          itemMsgId == value.itemMsgId ? 'selected' : ''
        }>${value.itemMsgName}</option>`;
      });
      const linidkItemMsgSelectEle = $('#linidkItemMsgSelect');
      linidkItemMsgSelectEle.html(optionsEle);
      linidkItemMsgSelectEle.comboSelect();
      linidkItemMsgSelectEle.change(function(e, v) {
        chrome.storage.local.set({
          params: { ...local.params, itemMsgId: e.target.value }
        });
      });
    });
  });
}
