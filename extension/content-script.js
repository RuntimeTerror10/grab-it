// function passItem() {
//   chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
//     console.log(response.farewell);
//   });
// }

// #js-pjax-container > div.container-xl.px-3.px-md-4.px-lg-5 > div > div.Layout-sidebar > div > div.js-profile-editable-replace > div.d-flex.flex-column > div.js-profile-editable-area.d-flex.flex-column.d-md-block > div.flex-order-1.flex-md-order-none.mt-2.mt-md-0 > div > a:nth-child(1) > span

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
  // passItem();
  const path = generateCSSPath(clickedElement);
  console.log(path);
});
