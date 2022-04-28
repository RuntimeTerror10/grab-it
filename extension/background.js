chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: 'Grab this element"',
    contexts: ["all"],
    id: "myContextMenuId",
  });
});

//inject content script on tab change
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.get(activeInfo.tabId, function (tab) {
    chrome.tabs.executeScript(tab.id, {
      file: "content-script.js",
    });
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  chrome.tabs.sendMessage(tab.id, { message: "grab item" });
});
