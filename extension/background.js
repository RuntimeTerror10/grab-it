chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: 'Grab this element"',
    contexts: ["all"],
    id: "myContextMenuId",
  });
});

//inject content script on tab change
chrome.tabs.onActivated.addListener(function (activeInfo) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      files: ["content-script.js"],
    });
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  chrome.tabs.sendMessage(tab.id, { message: "grab element" });
});
