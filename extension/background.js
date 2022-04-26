const grabBtn = document.querySelector(".grab-btn");

// function receiveItem(message) {
//   const a = message.item;
//   console.log(a);
// }
function handleMessage(request, sender, sendResponse) {
  console.log(`content script sent a message: ${request.content}`);
  sendResponse({ response: "response from background script" });
}

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs[0];
  const currentUrl = tab.url;

  grabBtn.addEventListener("click", () => {
    console.log("btn clicked");
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["content-script.js"],
    });
    chrome.runtime.onMessage.addListener(handleMessage);
  });
});
