const grabBtn = document.querySelector(".grab-btn");

function handleMessage(request, sender, sendResponse) {
  console.log(`content script sent a message: ${request.content}`);
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
