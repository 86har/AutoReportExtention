// ----------------------------
// このプログラムはベータ板です。
// ----------------------------

let videoSrc = "";

let sounds = [];
let soundNums = 4;

let playingSoundNum;

let timerIds = [];
let videoStatus = false;

let initialSettingDatas = {
  "functions":{
      "background_play": true,
      "auto_play": true
  },
  "notices":{
      "flashing": true,
      "flashing_color": "#ff0000",
      "flashing_count": 5,
      "notice_sound": true,
      "notice_sound_number": 0,
      "notice_sound_volume": 40
  }
}

let settingDatas = initialSettingDatas;
chrome.storage.sync.get(['settingDatas'], function(result){
    const data = result['settingDatas'];
    console.log(data)
    if (data === undefined) {
        chrome.storage.sync.set({ "settingDatas": initialSettingDatas });
    }else{
        settingDatas = data;
    }
})

for(i=0;i<soundNums;i++){
  sounds[i] = new Audio(chrome.runtime.getURL(`assets/audio/sound${String(i+1)}.mp3`));
}

function handleDocumentClick(event) {
  const iframeElement = document.getElementById('modal-inner-iframe');

  sounds[playingSoundNum].pause();
  sounds[playingSoundNum].currentTime=0;

  timerIds.forEach((timerId)=>{
    clearTimeout(timerId)
  });

  let movieList = document.querySelector('.movie').parentNode;
  movieList.style.backgroundColor="white";
  iframeElement.contentWindow.document.getElementById("container").style.backgroundColor="white";

  iframeElement.contentWindow.document.removeEventListener('click', handleDocumentClick);
  document.removeEventListener("click", handleDocumentClick);
  sounds[playingSoundNum].removeEventListener("click", soundEnded);
}

function soundEnded(){
  const iframeElement = document.getElementById('modal-inner-iframe');

  sounds[playingSoundNum].pause();
  sounds[playingSoundNum].currentTime=0;

  iframeElement.contentWindow.document.removeEventListener('click', handleDocumentClick);
  document.removeEventListener("click", handleDocumentClick);
  sounds[playingSoundNum].removeEventListener("click", soundEnded);
}

function soundPlay(fileNumber){
  console.log(timerIds)
  let iframeElement = document.getElementById('modal-inner-iframe');
  console.log(iframeElement)

  playingSoundNum = fileNumber
  sounds[playingSoundNum].volume = Number(settingDatas["notices"]["notice_sound_volume"])/100;
  sounds[playingSoundNum].play();

  setTimeout(() => {
    iframeElement.contentWindow.document.addEventListener('click', handleDocumentClick);
    document.addEventListener('click', handleDocumentClick);
    sounds[playingSoundNum].addEventListener("ended", soundEnded);
  }, 400);
}

function getIFLAME(){
  chrome.storage.sync.get(['settingDatas'], function(result){
    const data = result['settingDatas'];
    if (data === undefined) {
        chrome.storage.sync.set({ "settingDatas": initialSettingDatas });
    }else{
        settingDatas = data;
    }
  })

  // console.log("debug_point-1");
  let iframeElement = document.getElementById('modal-inner-iframe');

  // iframe要素が存在するか確認
  if (iframeElement) {
    // console.log("debug_point-2");
    let video = iframeElement.contentWindow.document.getElementById("video-player");

    // video要素が存在し、なおかつ同じvideo要素でないかを確認
    if(video){
      // console.log("debug_point-3");
      let videoSrcData = "";
      try{
        videoSrcData = video.querySelector("source").src;
      } catch (error) {
        videoSrcData = video.src;
      }

      if (videoSrc != videoSrcData) {
        videoSrc = videoSrcData;
        videoStatus = true;
        if(settingDatas["functions"]["auto_play"]){
          video.addEventListener('ended', function() {
            videoStatus = false

            let movieList = document.querySelector('.movie').parentNode;
            for(let i = 0; i < movieList.querySelectorAll("li").length; i++){
              const movieElement = movieList.querySelectorAll("li")[i];
  
              for(;;){
                // Nプラス教材をここで省く
                if(movieList.querySelectorAll("li")[i+1] !== undefined){
                  if(movieList.querySelectorAll("li")[i+1].classList.contains("supplement")){
                    i++;
                  }else{ break };
                }else{ break };
              }
  
              if(movieElement.querySelector("a").classList.contains("is-selected")){
                if(movieList.querySelectorAll("li")[i+1].classList.contains("evaluation-test")){
                  setTimeout(()=>{
                    movieList.querySelectorAll("li")[i+1].querySelector("a").click()
  
                    if(settingDatas["notices"]["flashing"]){
                      for(let j=0;j < 1000*settingDatas["notices"]["flashing_count"]; j+= 1000){
                        timerIds.push(setTimeout(() => {
                          movieList.style.backgroundColor=settingDatas["notices"]["flashing_color"];
                          iframeElement.contentWindow.document.getElementById("container").style.backgroundColor=settingDatas["notices"]["flashing_color"];
                        }, 1000+j));
                        timerIds.push(setTimeout(() => {
                          movieList.style.backgroundColor="white";
                          iframeElement.contentWindow.document.getElementById("container").style.backgroundColor="white";
                        }, 1500+j));
                      }
                      setTimeout(() => {
                        timerIds = [];
                      }, 7500);
                    }
                    if(settingDatas["notices"]["notice_sound"]) soundPlay(Number(settingDatas["notices"]["notice_sound_number"]));
                  }, 1000);
                  break;
                }
    
                setTimeout(()=>{movieList.querySelectorAll("li")[i+1].querySelector("a").click()}, 1000);
              }
            }
          }, { once: true });
        }
      }else{
        if(settingDatas["functions"]["background_play"] && videoStatus) video.play();
      }
    }
  }
  setTimeout(getIFLAME, 1000);
}

getIFLAME();