// ----------------------------
// このプログラムはベータ板です。
// ----------------------------

let videoSrc = "";

function getIFLAME(){
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
        video.addEventListener('ended', function() {
          console.log("debug_point-4");
  
          let movieList = document.querySelector('.movie').parentNode;
          for(let i = 0; i < movieList.querySelectorAll("li").length; i++){
            const movieElement = movieList.querySelectorAll("li")[i];

            for(;;){
              // Nプラス教材をここで省く
              console.log(movieList.querySelectorAll("li")[i+1]);  
              if(movieList.querySelectorAll("li")[i+1] !== undefined){
                if(movieList.querySelectorAll("li")[i+1].classList.contains("supplement")){
                  i++;
                }else{
                  break;
                }
              }else{
                break;
              }
            }

            if(movieElement.querySelector("a").classList.contains("is-selected")){
              if(movieList.querySelectorAll("li")[i+1].classList.contains("evaluation-test")){
                console.log("debug_point-5");
                setTimeout(()=>{movieList.querySelectorAll("li")[i+1].querySelector("a").click()
                  // ここで画面を赤く点滅させる
                  for(let j=0;j < 6000; j+= 1000){
                    setTimeout(() => {
                      movieList.style.backgroundColor="red";
                      iframeElement.contentWindow.document.getElementById("container").style.backgroundColor="red";
                    }, 1000+j);
                    setTimeout(() => {
                      movieList.style.backgroundColor="white";
                      iframeElement.contentWindow.document.getElementById("container").style.backgroundColor="white";
                    }, 1500+j);
                  }
                }, 1000);
                break;
              }
  
              setTimeout(()=>{movieList.querySelectorAll("li")[i+1].querySelector("a").click()}, 1000);
            }
          }
        }, { once: true });
      }
    }
  }
  setTimeout(getIFLAME, 1000);
}

getIFLAME();