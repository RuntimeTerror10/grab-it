const grabBtn = document.querySelector(".grab-btn");

function receiveItem(message) {
  const a = message.item;
  console.log(a);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.greeting == "hello") {
    sendResponse({ farewell: "goodbye" });
    return true;
  }
});

grabBtn.addEventListener("click", () => {
  console.log("btn clicked");
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content-script.js"],
    });
  });
});
