function getIFLAME(){
  let iframeElement = document.getElementById('modal-inner-iframe');

  if (iframeElement) {
      let video = iframeElement.contentWindow.document.getElementById("video-player");
      if (video) {
          // videoが終了したらconsole.logで出力
          video.addEventListener('ended', function() {
            for(let i = 0; i<5000; i+=1000){
              setTimeout(() => {
                document.getElementsByClassName("has-no-padding")[0].style.backgroundColor = "red";
                iframeElement.contentWindow.document.getElementsByClassName("feLoHN")[0].style.backgroundColor = "red";
              }, 0+i);
              setTimeout(() => {
                document.getElementsByClassName("has-no-padding")[0].style.backgroundColor = "white";
                iframeElement.contentWindow.document.getElementsByClassName("feLoHN")[0].style.backgroundColor = "white";
              }, 500+i);
            }
          });
      }
      setTimeout(getIFLAME, 1000);
  } else {
      setTimeout(getIFLAME, 1000);
  }
}

getIFLAME()
