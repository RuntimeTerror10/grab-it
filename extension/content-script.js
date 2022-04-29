console.log("loaded");
let eventObject = {};

const generateCSSPath = (el) => {
  let path = [],
    parent;
  while ((parent = el.parentNode)) {
    path.unshift(
      `${el.tagName}:nth-child(${[].indexOf.call(parent.children, el) + 1})`
    );
    el = parent;
  }
  return `${path.join(" > ")}`.toLowerCase();
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
  const cssPath = generateCSSPath(element);
  console.log(cssPath);
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

const createButtonGroup = (event) => {
  event.target.style.border = "2px solid blue";

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

  event.target.parentNode.insertBefore(
    buttonGroupContainer,
    event.target.nextSibling
  );

  cancelButton.addEventListener("click", () => {
    event.target.style.border = "";
    buttonGroupContainer.remove();
  });

  grabButton.addEventListener("click", () => {
    generateObject(event.target, event);
    event.target.style.border = "";
    buttonGroupContainer.remove();
  });
};

chrome.runtime.onMessage.addListener(function (request) {
  if (request.message === "grab element") {
    createButtonGroup(eventObject);
  }
});

document.body.addEventListener("contextmenu", (e) => {
  eventObject = e;
  console.log(e);
});
