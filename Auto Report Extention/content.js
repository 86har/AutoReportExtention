let videoSrc = "";

function getIFLAME(){
  let iframeElement = document.getElementById('modal-inner-iframe');

  if (iframeElement) {
      let video = iframeElement.contentWindow.document.getElementById("video-player");

      if (video && videoSrc != video.src) {
          videoSrc = video.src;
          video.addEventListener('ended', function() {
            let movieList = document.querySelector('.movie').parentNode;
            for(let i = 0; i < movieList.querySelectorAll("li").length; i++){
              const movieElement = movieList.querySelectorAll("li")[i];
              if(movieElement.querySelector("a").classList.contains("is-selected")){
                if(movieList.querySelectorAll("li")[i+1].classList.contains("evaluation-test")){
                  movieList.querySelectorAll("li")[i+1].querySelector("a").click();
                    for(let j=0;j < 8000; j+= 1000){
                      setTimeout(() => {
                        movieList.style.backgroundColor="red";
                        iframeElement.contentWindow.document.getElementById("container").style.backgroundColor="red";
                      }, 0+j);
                      setTimeout(() => {
                        movieList.style.backgroundColor="white";
                        iframeElement.contentWindow.document.getElementById("container").style.backgroundColor="white";
                      }, 500+j);
                    }
                  break;
                }
                for(;;){
                  if(movieList.querySelectorAll("li")[i+1].classList.contains("supplement")){
                    i++;
                  }else{
                    break;
                  }
                }

                movieList.querySelectorAll("li")[i+1].querySelector("a").click();
              }
            }
          }, { once: true });
          setTimeout(getIFLAME, 1000);
      }else{
        setTimeout(getIFLAME, 1000);
      }
  } else {
    setTimeout(getIFLAME, 1000);
  }
}

getIFLAME()