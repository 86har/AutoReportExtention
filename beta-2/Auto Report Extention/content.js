var sounds = [];
var soundNums = 4;
for(i=0;i<soundNums;i++){
  sounds[i] = new Audio(chrome.runtime.getURL(`assets/audio/sound${String(i+1)}.mp3`));
}

var initialSettingDatas = {
  "functions":{
      "background_play": true,
      "auto_play": true
  },
  "notices":{
      "notice_sound": true,
      "notice_sound_number": 0,
      "notice_sound_volume": 40
  }
}
var settingDatas = initialSettingDatas;
var playingVideoSrc;

function getElementsByClassNamesAll(classString, sarchElm = document) {
  const classNames = classString.split(' ');
  const selector = classNames.map(name => `.${name}`).join('');
  const initialElements = sarchElm.querySelectorAll(selector);

  const matchedElements = Array.from(initialElements).filter(element => {
      const elementClasses = element.className.split(' ');
      return elementClasses.length === classNames.length && elementClasses.every(cls => classNames.includes(cls));
  });

  if(Array.from(matchedElements).length == 0){
    return undefined;
  }else{
    return Array.from(matchedElements);
  }
}
function getElementsByClassNames(classString, sarchElm = document) {
  const fullfillElm = getElementsByClassNamesAll(classString, sarchElm);
  if(fullfillElm === undefined){
    return undefined;
  }else{
    return fullfillElm[0];
  }
}

function soundEnded(){
  const iframeElement = document.querySelector("iframe");

  sounds[playingSoundNum].pause();
  sounds[playingSoundNum].currentTime=0;

  iframeElement.contentWindow.document.removeEventListener('click', soundEnded);
  document.removeEventListener("click", soundEnded);
  sounds[playingSoundNum].removeEventListener("click", soundEnded);
}

function soundPlay(fileNumber){
  const iframeElement = document.querySelector("iframe");

  playingSoundNum = fileNumber
  sounds[playingSoundNum].volume = settingDatas["notices"]["notice_sound_volume"]/100
  sounds[playingSoundNum].play();

  setTimeout(() => {
    iframeElement.contentWindow.document.addEventListener('click', soundEnded);
    document.addEventListener('click', soundEnded);
    sounds[playingSoundNum].addEventListener("ended", soundEnded);
  }, 400);
}

function setVideoEvent(){
  let pauseActionInvalid = false;
  let seekActionInvalid = false;

  const iframeElement = document.querySelector("iframe");
  if(iframeElement){
    const iframeDocument = iframeElement.contentWindow.document;
    const video = iframeDocument.getElementById("video-player");
    if(video && playingVideoSrc != video.src && !(isNaN(video.currentTime))){
      try{
        playingVideoSrc = video.src
      } catch (error) {
        playingVideoSrc = video.querySelector("source").src;
      }
      
      video.play().catch(error => {
        console.error('Video play failed:', error);

        setTimeout(() => {
          video.play()
          setTimeout(() => {
            video.play()
          }, 6000);
        }, 2000);
      });

      getElementsByClassNames("sc-192m11g-2 itwYZr", iframeDocument).addEventListener("click", ()=>{
        if(!(pauseActionInvalid)) setTimeout(() => {pauseActionInvalid = false;}, 200);
        pauseActionInvalid = true;
      })

      video.addEventListener('timeupdate', ()=>{
        console.log(video.currentTime);
      })

      video.addEventListener("seeked", ()=>{
        if(!(seekActionInvalid)) pauseActionInvalid = false;
      })
      video.addEventListener("seeking", ()=>{
        if(!(seekActionInvalid)) pauseActionInvalid = true;
      })

      video.addEventListener("pause", ()=>{
        if(!(seekActionInvalid)) setTimeout(() => {seekActionInvalid = false;}, 200);
        seekActionInvalid = true;

        let videoCurrentTimed = video.currentTime;

        if(!(pauseActionInvalid) && !(video.ended) && settingDatas["functions"]["background_play"]){
          if(!(pauseActionInvalid)) setTimeout(() => {pauseActionInvalid = false;}, 200);
          pauseActionInvalid = true;
          video.currentTime = videoCurrentTimed;
          setTimeout(() => {
            video.play();
          }, 50);
        }
      })

      video.addEventListener("ended", ()=>{
        setTimeout(() => {
          if(settingDatas["functions"]["auto_play"]){
            const videoLists = getElementsByClassNamesAll("sc-aXZVg sc-gEvEer sc-1y7jhg7-0 dKubqp fteAEG kmjwyG");
            let videoNumber;
            videoLists.forEach((listElm, listNumber)=>{
              if(getElementsByClassNames("sc-aXZVg sc-gEvEer hYNtMZ fteAEG sc-1otp79h-0 sc-35qwhb-0 evJGlU crtNbk", listElm) !== undefined){
                videoNumber = listNumber;
              }
  
            })
  
            let nextVideo = videoLists[videoNumber+1];
            let skipCounter = 1;
  
            for(;;){
              if(getElementsByClassNames("sc-x54faw-0 fqBzHf", videoLists[videoNumber+skipCounter]) === undefined && getElementsByClassNames("sc-x54faw-0 fsxYnC", videoLists[videoNumber+skipCounter]) === undefined){
                nextVideo = videoLists[videoNumber+skipCounter];
                break;
              }else{ skipCounter++ };
            }
  
            if(getElementsByClassNames("sc-x54faw-0 fsaiMR", videoLists[videoNumber+skipCounter]) !== undefined && settingDatas["notices"]["notice_sound"]){
              soundPlay(settingDatas["notices"]["notice_sound_number"]);
            }
  
            getElementsByClassNames("sc-aXZVg sc-gEvEer hYNtMZ fteAEG sc-1otp79h-0 sc-35qwhb-0 evJGlU cpELFc", nextVideo).click();
          }
        }, 1000);
      })
    }else{
      setTimeout(() => {setVideoEvent();}, 100);
    }
  }else{
    setTimeout(() => {setVideoEvent();}, 100);
  }

}

function addExtentionEvent(){
  document.querySelector("body").style.display = "none"

  setTimeout(() => {
    document.querySelector("body").style.display = "block"

    const elements = getElementsByClassNamesAll("sc-aXZVg sc-gEvEer sc-1y7jhg7-0 dKubqp fteAEG kmjwyG");
    elements.forEach((element, videoNumber)=>{
      if(getElementsByClassNamesAll("sc-aXZVg iuHQbN", element) !== undefined){
        element.addEventListener("click", ()=>{setVideoEvent(videoNumber)});
      }
    })
  }, 1000);
}

function checkVideoElement(callback) {
  const elements = getElementsByClassNamesAll("sc-aXZVg sc-gEvEer sc-1y7jhg7-0 dKubqp fteAEG kmjwyG");

  let elementLoaded = true;
  if(elements){
    elements.forEach((element)=>{
      if(countAllDescendants(element) < 14) elementLoaded = false;
    })
  
    if (elementLoaded) {
      console.log("loaded")
      callback(elements);
    } else {
      console.log("non loaded")
      setTimeout(() => {checkVideoElement(callback);}, 100);
    }
  }else{
    console.log("non loaded")

    setTimeout(() => {checkVideoElement(callback);}, 100);
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "func:0") addExtentionEvent();
});

function countAllDescendants(element) {
  let count = 0;
  for (let child of element.children) {
      count += 1 + countAllDescendants(child);
  }
  return count;
}

chrome.runtime.sendMessage({ action: "func:0" });
document.querySelector("body").style.display = "none"

checkVideoElement((elements)=>{
  document.querySelector("body").style.display = "block"

  elements.forEach((element, videoNumber)=>{
    if(getElementsByClassNames("sc-aXZVg fUVLbK",element) !== undefined){
      console.log(`element: ${getElementsByClassNames("sc-aXZVg fUVLbK",element).innerText}\nnumber :${videoNumber}`)
    }else{
      console.log(`element: ${getElementsByClassNames("sc-aXZVg daZTuV",element).innerText}\nnumber :${videoNumber}`)
    }
    if(getElementsByClassNamesAll("sc-aXZVg iuHQbN", element) !== undefined) element.addEventListener("click", ()=>{setVideoEvent()});
  })
})

setInterval(() => {
  chrome.storage.sync.get(['settingDatas'], function(result){
    const data = result['settingDatas'];
    // const data = undefined;

    if (data === undefined) {
        chrome.storage.sync.set({ "settingDatas": initialSettingDatas });
    }else{
        settingDatas = data;
    }
 })
}, 5000);