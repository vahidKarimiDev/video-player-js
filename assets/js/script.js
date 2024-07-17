const playPauseBtn = document.querySelector('.play-puase-btn');
const videoContainer = document.querySelector('.video-container');
const miniPlayerBtn = document.querySelector('.mini-player__btn');
const muteBtn = document.querySelector('.mute-btn');
const volumeSlider = document.querySelector('.volume-slider');
const fullScreenBtn = document.querySelector('.full-screen__btn');
const totalTime = document.querySelector('.total-time');
const currentTime = document.querySelector('.current-time');
const speedBtn = document.querySelector('.speed-btn');
const preViewImg = document.querySelector('.prevview-img');
const thumbneilImg = document.querySelector('.thumbneil-img');
const timelineContainer = document.querySelector('.timeline-container');
const video = document.querySelector('video');


document.addEventListener('keydown', e => {

    const tagName = document.activeElement.tagName.toLowerCase();

    if (tagName === "input") return;

    switch (e.key.toLowerCase()) {
        case " ":
            if (tagName == 'button') return;
        case "k":
            toggelPlay()
            break;
        case "f":
            toggleFullScreenMode()
            break;
        case "i":
            toggleMiniPlayMode()
            break;
        case "m":
            toggleMute()
            break;
        case "arrowleft":
        case "j":
            skip(-5)
            break;
        case "arrowright":
        case "l":
            skip(5)
            break;

    }
})


// Time Line
let isScrubbing = false;
let wasPaused;

const toggleScrubbin = (e) => {
    const rect = timelineContainer.getBoundingClientRect();
    const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    isScrubbing = (e.buttons & 1) === 1;
    videoContainer.classList.toggle('scrubbing', isScrubbing);
    if (isScrubbing) {
        wasPaused = video.paused
        video.pause()
    } else {
        video.currentTime = percent * video.duration;
        if (!wasPaused) video.play()
    }

    hadnelTimelineUpdate(e)
}

const hadnelTimelineUpdate = (e) => {
    const rect = timelineContainer.getBoundingClientRect();
    const rectImg = preViewImg.getBoundingClientRect()
    let percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    if (percent >= 0.9313008) {
        percent = 0.9313008;
        

    } else if (percent <= 0.072560969) {
        percent = 0.072560969
    }
    const previewNumber = Math.max(1, Math.floor((percent * video.duration) / 10));

    timelineContainer.style.setProperty('--preview-position', percent);

    if (isScrubbing) {
        e.preventDefault();
        timelineContainer.style.setProperty('--position-porgress', percent)
    }

}

timelineContainer.addEventListener('mousemove', hadnelTimelineUpdate);
timelineContainer.addEventListener('mousedown', toggleScrubbin);
document.addEventListener('mouseup', e => {
    if (isScrubbing) toggleScrubbin(e)
})
document.addEventListener('mousemove', e => {
    if (isScrubbing) hadnelTimelineUpdate(e)
})


// PlayBack Speed
const toggleSpeed = () => {
    let newPlayBackRate = video.playbackRate + 0.25;
    if (newPlayBackRate > 2) newPlayBackRate = 0.25;
    video.playbackRate = newPlayBackRate;
    speedBtn.textContent = `${newPlayBackRate}x`
}

speedBtn.addEventListener('click', toggleSpeed);


// Time
video.addEventListener('loadeddata', () => {
    totalTime.textContent = formatDurration(video.duration)
});

video.addEventListener('timeupdate', () => {
    currentTime.textContent = formatDurration(video.currentTime);
    const percent = video.currentTime / video.duration
    timelineContainer.style.setProperty('--position-porgress', percent)


})

const leadingZeroFormated = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2
});

const formatDurration = (time) => {
    const seconds = Math.floor(time % 60);
    const minutes = Math.floor(time / 60) % 60;
    const hours = Math.floor(time / 3600);

    if (hours === 0) {
        return `${minutes}:${leadingZeroFormated.format(seconds)}`;
    } else {
        return `${hours}:${leadingZeroFormated.format(minutes)}:${leadingZeroFormated.format(seconds)}`
    }

}

const skip = (duration) => {
    video.currentTime += duration
}


// Volume
const toggleMute = () => {
    video.muted = !video.muted;
}

video.addEventListener('volumechange', () => {
    volumeSlider.value = video.volume;

    let volumeLevel;


    if (video.muted || video.volume === 0) {
        volumeSlider.value = 0;
        volumeLevel = 'mute';
    } else {
        volumeLevel = "high";
    }

    video.volume;
    video.muted;

    videoContainer.dataset.volumeLevel = volumeLevel;
});

muteBtn.addEventListener('click', toggleMute);
volumeSlider.addEventListener('input', (e) => {
    video.volume = e.target.value;
    video.muted = e.target.value === 0
})


// View Mode 
const toggleMiniPlayMode = () => {
    if (videoContainer.classList.contains('mini-player')) {
        document.exitPictureInPicture()

    } else {
        video.requestPictureInPicture()
    }
}
const toggleFullScreenMode = () => {
    if (document.fullscreenElement == null) {
        videoContainer.requestFullscreen()
    } else {
        document.exitFullscreen()
    }
}

miniPlayerBtn.addEventListener('click', toggleMiniPlayMode);
fullScreenBtn.addEventListener('click', toggleFullScreenMode);

document.addEventListener('fullscreenchange', () => {
    videoContainer.classList.toggle('full-screen', document.fullscreenElement)
})

video.addEventListener('enterpictureinpicture', () => {
    videoContainer.classList.add('mini-player')
})

video.addEventListener('leavepictureinpicture', () => {
    videoContainer.classList.remove('mini-player')
});
// video.addEventListener('dblclick', toggleFullScreenMode)


// Play/Pause
const toggelPlay = () => {
    video.paused ? video.play() : video.pause()
}

video.addEventListener('play', () => {
    videoContainer.classList.remove('paused')
});

video.addEventListener('pause', () => {
    videoContainer.classList.add('paused')
});
video.addEventListener('click', toggelPlay)

playPauseBtn.addEventListener('click', toggelPlay);
