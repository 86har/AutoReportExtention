const TARGET_URL = 'https://www.nnn.ed.nico/courses/';
const DELAY_LOAD_TIME = 200;

let access_count = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "func:0"){
    if(access_count == 0) access_count++;
  }
});

chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
    if (details.url.startsWith(TARGET_URL)) {
      if(access_count == 0){
        if(access_count == 0) access_count++;
        chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          files: ['content.js']
        });
      }else{
        setTimeout(() => {
          chrome.tabs.sendMessage(details.tabId, {action: "func:0"})
          .catch(() => {
            chrome.scripting.executeScript({
              target: { tabId: details.tabId },
              files: ['content.js']
            });
          })
        }, DELAY_LOAD_TIME);
      }
    }
  });