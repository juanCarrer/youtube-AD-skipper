
chrome.tabs.onUpdated.addListener(function
  (tabId, changeInfo, tab) {
    // read changeInfo data and do something with it (like read the url)
    if (changeInfo.url) {
      // do something here
      chrome.tabs.sendMessage(tabId, { type: 'changeUrl', newUrl: changeInfo.url }, function handler (response) {
        console.log(`toggle action - ${action}`, response)
      })
    }
  }
);