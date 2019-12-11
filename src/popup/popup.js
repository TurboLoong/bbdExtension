document.addEventListener('DOMContentLoaded', function() {
  createSelect();
  $('#submitTodayBtn').on('click', function(params) {
    sendMessage(1);
  });
  $('#submitFiveBtn').on('click', function(params) {
    sendMessage(5);
  });
});
function sendMessage(params) {
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    var activeTab = tabs[0];
    if (params == 1) {
      chrome.tabs.sendMessage(activeTab.id, {
        message: 'start',
        date: 'today'
      });
    } else {
      chrome.tabs.sendMessage(activeTab.id, { message: 'start', date: 'five' });
    }
  });
}

function createSelect() {
  // 项目名称
  chrome.storage.local.get('linkItemMsg', function(result) {
    const linkItemMsg = result.linkItemMsg;
    let optionsEle = '';
    chrome.storage.local.get('defaultItemMsgId', function(result) {
      linkItemMsg.forEach((value, index) => {
        optionsEle += `<option value=${value.itemMsgId} ${
          result.defaultItemMsgId == value.itemMsgId ? 'selected' : ''
        }>${value.itemMsgName}</option>`;
      });
      const linidkItemMsgSelectEle = $('#linidkItemMsgSelect');
      linidkItemMsgSelectEle.html(optionsEle);
      linidkItemMsgSelectEle.comboSelect();
      linidkItemMsgSelectEle.change(function(e, v) {
        chrome.storage.local.set({ defaultItemMsgId: e.target.value });
      });
    });
  });
  // 任务名称
  chrome.storage.local.get('childrenRemark', function(result) {
    const childrenRemarkEle = $('#childrenRemark');
    childrenRemarkEle.val(result.childrenRemark);
    childrenRemarkEle.change(function(e) {
      chrome.storage.local.set({ childrenRemark: e.target.value });
    });
  });
  // 任务描述
  chrome.storage.local.get('childrenNode', function(result) {
    const childrenNodeEle = $('#childrenNode');
    childrenNodeEle.val(result.childrenNode);
    childrenNodeEle.change(function(e) {
      chrome.storage.local.set({ childrenNode: e.target.value });
    });
  });
}
