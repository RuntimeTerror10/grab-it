function handleResponse(message) {
  console.log(`background script sent a response: ${message.response}`);
}

function handleError(error) {
  console.log(`Error: ${error}`);
}

function passItem() {
  const sending = chrome.runtime.sendMessage({
    content: "message from the content script",
  });
  sending.then(handleResponse, handleError);
}

function generateCSSPath(item) {
  const newPath = item.path.reverse();
  console.log(newPath);
  let cssPath = "";
  for (let i = 0; i < newPath.length; i++) {
    if (newPath[i].localName === undefined) {
      console.log(newPath[i]);
    } else {
      if (i === newPath.length - 1) {
        cssPath += `${newPath[i].localName}`;
      } else {
        cssPath += `${newPath[i].localName} > `;
      }
    }
  }
  return cssPath;
}

document.body.addEventListener("click", (e) => {
  e.preventDefault();
  const clickedElement = e;
  console.log(clickedElement);
  const path = generateCSSPath(clickedElement);
  console.log(path);
  passItem();
  e.preventDefault();
});
