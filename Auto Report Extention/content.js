let videoSrc = "";

function getIFLAME(){
  let iframeElement = document.getElementById('modal-inner-iframe');

  if (iframeElement) {
    let video = iframeElement.contentWindow.document.getElementById("video-player");

    if(video){
      let videoSrcData = "";
      try{
        videoSrcData = video.querySelector("source").src;
      } catch (error) {
        videoSrcData = video.src;
      }

      if (videoSrc != videoSrcData) {
  
        videoSrc = videoSrcData;
        video.addEventListener('ended', function() {
          let movieList = document.querySelector('.movie').parentNode;
          for(let i = 0; i < movieList.querySelectorAll("li").length; i++){
            const movieElement = movieList.querySelectorAll("li")[i];

            for(;;){
              if(movieList.querySelectorAll("li")[i+1] !== undefined){
                if(movieList.querySelectorAll("li")[i+1].classList.contains("supplement")){
                  i++;
                }else{ break };
              }else{ break };
            };

            if(movieElement.querySelector("a").classList.contains("is-selected")){
              if(movieList.querySelectorAll("li")[i+1].classList.contains("evaluation-test")){
                setTimeout(()=>{movieList.querySelectorAll("li")[i+1].querySelector("a").click()
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
