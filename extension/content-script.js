function passItem() {
  chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
    console.log(response.farewell);
  });
}

function generateCSSPath(item) {
  const newPath = item.path.reverse();
  console.log(newPath);
  let cssPath = "";
  for (let i = 0; i < newPath.length; i++) {
    if (newPath[i].localName !== undefined) {
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
});
