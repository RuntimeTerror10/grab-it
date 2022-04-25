function passItem() {
  chrome.runtime.sendMessage({ greeting: "hello" }, function (response) {
    console.log(response.farewell);
  });
}

// function generateCSSTree(item) {
//   if (item.target.parentNode === "li") {
//     console.log(item.target.parentNode);
//   } else {
//     console.log(item.target.parentNode);
//   }
// }

document.body.addEventListener("click", (e) => {
  const clickedElement = e;
  console.log(clickedElement);
  passItem();
  //   generateCSSTree(clickedElement);
});
