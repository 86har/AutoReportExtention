const TARGET_URL = 'https://www.nnn.ed.nico/courses/';
const DELAY_LOAD_TIME = 200;

let access_count = 0;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "func:0"){
    console.log(`accessed of brawser.\n${access_count}`);
    if(access_count == 0) access_count++;
  }
});

chrome.webNavigation.onHistoryStateUpdated.addListener(details => {
    if (details.url.startsWith(TARGET_URL)) {
      if(access_count == 0){
        console.log(`create new Event.\n${access_count}`);
        if(access_count == 0) access_count++;
        chrome.scripting.executeScript({
          target: { tabId: details.tabId },
          files: ['content.js']
        });
      }else{
        console.log(`resuming operations.\n${access_count}`);

        setTimeout(() => {
          chrome.tabs.sendMessage(details.tabId, {action: "func:0"})
          .catch(() => {
            console.log(`not found Event.\ncreate new Event.\n${access_count}`);
            chrome.scripting.executeScript({
              target: { tabId: details.tabId },
              files: ['content.js']
            });
          })
        }, DELAY_LOAD_TIME);
      }
    }
  });