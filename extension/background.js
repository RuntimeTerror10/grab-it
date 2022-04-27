chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    title: 'Grab this element"',
    contexts: ["all"],
    id: "myContextMenuId",
  });
});

//send message to content script
chrome.contextMenus.onClicked.addListener(function (info, tab) {
  chrome.tabs.sendMessage(tab.id, { message: "grab item" });
});

// chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   if (request.message === "get url") {
//     chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//       sendResponse({ url: tabs[0].url });
//     });
//   }
// });
