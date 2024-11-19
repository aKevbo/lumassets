function openNewTab() {
  chrome.tabs.create({ url: chrome.runtime.getURL("game.html") }, () => {});
}

chrome.action.onClicked.addListener(openNewTab);

chrome.runtime.onInstalled.addListener((e) => {
  if (e.reason === "install") {
    openNewTab();
  }
});
