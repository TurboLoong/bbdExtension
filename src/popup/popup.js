document.addEventListener('DOMContentLoaded', function () {
  createSelect();
  $('#submitBtn').on('click', sendMessage);
});
function sendMessage(params) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    var activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { message: 'start' });
  });
}

function createSelect() {
  chrome.storage.local.get('linkItemMsg', function (result) {
    const linkItemMsg = result.linkItemMsg;
    let optionsEle = '';
    chrome.storage.local.get('defaultItemMsgId', function (result) {
      linkItemMsg.forEach((value, index) => {
        optionsEle += `<option value=${value.itemMsgId} ${
          result.defaultItemMsgId == value.itemMsgId ? 'selected' : ''
          }>${value.itemMsgName}</option>`;
      });
      $('#linidkItemMsgSelect').html(optionsEle);
      $('#linidkItemMsgSelect').comboSelect();
      $('#linidkItemMsgSelect').change(function (e, v) {
        chrome.storage.local.set({ defaultItemMsgId: e.target.value });
      });
    });
  });
}
