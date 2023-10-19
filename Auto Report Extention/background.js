let access_count = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "func:0") access_count++;
});

chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
    if (details.url.startsWith('https://www.nnn.ed.nico/courses/')) {
      if(access_count == 0){
        access_count++
        chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          files: ['content.js']
        });
      }else{
        setTimeout(() => {chrome.tabs.sendMessage(details.tabId, {action: "func:0"})}, 200);
      }
    }
  });