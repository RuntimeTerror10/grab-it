console.log("loaded");

const generateCSSPath = (ele) => {
  const newPath = ele.path.reverse();
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
};

const copyStringToClipboard = (str) => {
  var el = document.createElement("textarea");
  el.value = str;
  el.setAttribute("readonly", "");
  el.style = { position: "absolute", left: "-9999px" };
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
};

const generateObject = (element, event) => {
  const currentUrl = window.location.href;
  const cssPath = generateCSSPath(event);
  const elementData = element.innerText;
  const elementObject = {
    url: currentUrl,
    path: cssPath,
    data: elementData,
  };
  const elementString = JSON.stringify(elementObject);
  copyStringToClipboard(elementString);
  console.log(elementString);
};

const createButtonGroup = (element, event) => {
  element.style.border = "2px solid blue";

  const buttonGroupContainer = document.createElement("div");
  const cancelButton = document.createElement("button");
  const grabButton = document.createElement("button");
  const selectParentButton = document.createElement("button");

  cancelButton.innerText = "Cancel";
  grabButton.innerText = "Grab";
  selectParentButton.innerText = "Select Parent";

  buttonGroupContainer.appendChild(cancelButton);
  buttonGroupContainer.appendChild(grabButton);
  buttonGroupContainer.appendChild(selectParentButton);

  cancelButton.addEventListener("click", () => {
    element.style.border = "";
    buttonGroupContainer.style.display = "none";
  });

  grabButton.addEventListener("click", () => {
    generateObject(element, event);
    element.style.border = "";
    buttonGroupContainer.style.display = "none";
  });

  return buttonGroupContainer;
};

document.body.addEventListener("contextmenu", (e) => {
  const menuEvent = e;
  const ele = menuEvent.target;
  console.log(ele);
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.message === "grab item") {
      const buttonGroup = createButtonGroup(ele, menuEvent);
      ele.parentNode.insertBefore(buttonGroup, ele.nextSibling);
    }
  });
});
