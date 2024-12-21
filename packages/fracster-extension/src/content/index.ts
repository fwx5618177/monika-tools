// 可以在页面中进行数据操作的内容脚本
console.log("Content script loaded");

// 例如在页面上显示某些数据
const displayData = (data: any) => {
  const div = document.createElement("div");
  div.style.position = "fixed";
  div.style.top = "10px";
  div.style.right = "10px";
  div.style.backgroundColor = "white";
  div.style.border = "1px solid black";
  div.style.padding = "10px";
  div.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
  document.body.appendChild(div);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "displayData") {
    displayData(request.data);
    sendResponse({ status: "success" });
  }
});
