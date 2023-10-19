let initialSettingDatas = {
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

let sounds=[]
for(let i=0;i<4;i++){
    sounds[i] = new Audio(chrome.runtime.getURL(`assets/audio/sound${String(i+1)}.mp3`));
}

const audioPlayButton = document.getElementById("js_audio_play");

const volumeSlider = document.getElementById("js_volume_slider");
const audioNumber = document.getElementById("js_audio_number");
const volumeText = document.getElementById("js_volume_text");
const background_play = document.getElementById("js_background_play");
const auto_play = document.getElementById("js_auto_play");
const notice_sound = document.getElementById("js_notice_sound");

let audio;

let settingDatas = initialSettingDatas;
chrome.storage.sync.get(['settingDatas'], function(result){
    let data = result['settingDatas'];

    // 強制的に初期化させるには下記のコードを実行
    // data = undefined

    if (data === undefined) {
        chrome.storage.sync.set({ "settingDatas": initialSettingDatas });
    }else{
        settingDatas = data;
    }

    background_play.checked = settingDatas["functions"]["background_play"];
    auto_play.checked = settingDatas["functions"]["auto_play"];
    notice_sound.checked = settingDatas["notices"]["notice_sound"];
    audioNumber.value = settingDatas["notices"]["notice_sound_number"];
    volumeSlider.value = settingDatas["notices"]["notice_sound_volume"];
    volumeText.value = settingDatas["notices"]["notice_sound_volume"];
})

function zenkakuToHankaku(str) {
    if(!(/^[０-９]+$/.test(str))){
        return str;
    }

    const zenkaku = '０１２３４５６７８９';
    const hankaku = '0123456789';

    let result = '';
    for (let i = 0; i < str.length; i++) {
        const index = zenkaku.indexOf(str[i]);
        if (index !== -1) {
            result += hankaku[index];
        } else {
            result += str[i];
        }
    }
    return result;
}

background_play.addEventListener("change",()=>{
    settingDatas["functions"]["background_play"] = background_play.checked;
    chrome.storage.sync.set({ "settingDatas": settingDatas });
})
auto_play.addEventListener("change",()=>{
    settingDatas["functions"]["auto_play"] = auto_play.checked;
    chrome.storage.sync.set({ "settingDatas": settingDatas });
})

notice_sound.addEventListener("change",()=>{
    settingDatas["notices"]["notice_sound"] = notice_sound.checked;
    chrome.storage.sync.set({ "settingDatas": settingDatas });
})

volumeSlider.addEventListener("input", ()=>{
    volumeText.value = volumeSlider.value
    audio.volume = volumeSlider.value/100;
})
volumeSlider.addEventListener("change", ()=>{
    settingDatas["notices"]["notice_sound_volume"] = volumeSlider.value;
    chrome.storage.sync.set({ "settingDatas": settingDatas });
})
volumeText.addEventListener("change", ()=>{
    volumeValue=zenkakuToHankaku(volumeText.value);

    if (volumeValue >= 0 && volumeValue <= 100 && Number.isInteger(Number(volumeValue))) {
        volumeSlider.value = volumeValue;
        volumeText.value = volumeValue
        settingDatas["notices"]["notice_sound_volume"] = volumeSlider.value;
        chrome.storage.sync.set({ "settingDatas": settingDatas });
    
        audio.volume = volumeSlider.value/100;
    }else{
        volumeText.value = volumeSlider.value
    }
})
audioNumber.addEventListener("change", ()=>{
    pauseAndResetAudio(true);

    settingDatas["notices"]["notice_sound_number"] = audioNumber.value;
    chrome.storage.sync.set({ "settingDatas": settingDatas });
})
function pauseAndResetAudio(changeNumber = false){
    let soundNumber = audioNumber.value;
    if(changeNumber){
        soundNumber = settingDatas["notices"]["notice_sound_number"];
    }
    audio = sounds[soundNumber];

    audio.pause();
    audio.currentTime = 0;
    audioPlayButton.textContent = "再生";

    audioPlayButton.removeEventListener("click", pauseAndResetAudio);
    audioPlayButton.addEventListener('click', soundTestPlay);
}

function soundTestPlay(){
    const soundNumber = audioNumber.value;
    audio = sounds[soundNumber];

    audio.volume = volumeSlider.value/100;
    audio.play();
    audioPlayButton.textContent = "停止";

    audioPlayButton.removeEventListener("click", soundTestPlay);
    audioPlayButton.addEventListener('click', pauseAndResetAudio);

    audio.addEventListener('ended', function() {
        audioPlayButton.textContent = "再生";
        audioPlayButton.removeEventListener("click", pauseAndResetAudio);
        audioPlayButton.addEventListener("click", soundTestPlay);
    });
}

audioPlayButton.addEventListener("click", soundTestPlay);