var audio = document.getElementById("audio-track");
var isPlaying = false;

audio.volume = 0.5;

const timelineContainer = document.getElementById("song-timeline");
const seekSlider = document.getElementById("seek-slider");
const durationContainer = document.getElementById("duration");
const currentTimeContainer = document.getElementById("current-time");

let animationFrame = null;


// ===============================
// PLAY / PAUSE
// ===============================

function togglePlayPause(pathClass) {

    var paths = document.querySelectorAll("." + pathClass);

    for (var i = 0; i < paths.length; i++) {
        paths[i].classList.toggle("active");
    }

    if (audio.paused) {

        audio.play().catch(function (error) {
            console.log("Audio play error:", error);
        });

    } else {

        audio.pause();
    }
}


// ===============================
// AUDIO EVENTS
// ===============================

audio.addEventListener("play", function () {

    isPlaying = true;

    cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(whilePlaying);

});


audio.addEventListener("pause", function () {

    isPlaying = false;

    cancelAnimationFrame(animationFrame);
});


audio.addEventListener("ended", function () {

    isPlaying = false;

    cancelAnimationFrame(animationFrame);

    seekSlider.value = 0;
    currentTimeContainer.textContent = "0:00";

    timelineContainer.style.setProperty(
        "--seek-before-width",
        "0%"
    );
});


// ===============================
// TIME FORMAT
// ===============================

function calculateTime(secs) {

    if (!isFinite(secs)) {
        return "0:00";
    }

    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);

    const returnedSeconds =
        seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + returnedSeconds;
}


// ===============================
// DISPLAY DURATION
// ===============================

function displayDuration() {

    if (isFinite(audio.duration)) {

        durationContainer.textContent =
            calculateTime(audio.duration);

    }
}


// ===============================
// SET SLIDER MAX
// ===============================

function setSliderMax() {

    if (isFinite(audio.duration)) {

        seekSlider.max = Math.floor(audio.duration);
    }
}


// ===============================
// BUFFERED PROGRESS
// ===============================

function displayBufferedAmount() {

    if (
        !audio.buffered.length ||
        !isFinite(audio.duration) ||
        audio.duration === 0
    ) {
        return;
    }

    const bufferedAmount =
        audio.buffered.end(audio.buffered.length - 1);

    const percentage =
        (bufferedAmount / audio.duration) * 100;

    timelineContainer.style.setProperty(
        "--buffered-width",
        percentage + "%"
    );
}


// ===============================
// UPDATE CURRENT TIME
// ===============================

function whilePlaying() {

    if (!audio.paused) {

        seekSlider.value =
            Math.floor(audio.currentTime);

        currentTimeContainer.textContent =
            calculateTime(audio.currentTime);

        const percentage =
            (audio.currentTime / audio.duration) * 100;

        timelineContainer.style.setProperty(
            "--seek-before-width",
            percentage + "%"
        );

        animationFrame =
            requestAnimationFrame(whilePlaying);
    }
}


// ===============================
// SEEK SLIDER
// ===============================

seekSlider.addEventListener("input", function (e) {

    const value = e.target.value;

    currentTimeContainer.textContent =
        calculateTime(value);

    const percentage =
        (value / seekSlider.max) * 100;

    timelineContainer.style.setProperty(
        "--seek-before-width",
        percentage + "%"
    );
});


// Change audio position after slider is moved
seekSlider.addEventListener("change", function (e) {

    audio.currentTime = e.target.value;

});


// ===============================
// RANGE PROGRESS
// ===============================

function showRangeProgress(rangeInput) {

    const percentage =
        (rangeInput.value / rangeInput.max) * 100;

    timelineContainer.style.setProperty(
        "--seek-before-width",
        percentage + "%"
    );
}


// ===============================
// AUDIO METADATA
// ===============================

audio.addEventListener("loadedmetadata", function () {

    displayDuration();

    setSliderMax();

    currentTimeContainer.textContent = "0:00";

    seekSlider.value = 0;

    showRangeProgress(seekSlider);

    displayBufferedAmount();
});


// ===============================
// BUFFER UPDATE
// ===============================

audio.addEventListener("progress", function () {

    displayBufferedAmount();
});


// ===============================
// TOGGLE BUTTON COLOR
// ===============================

function toggleColor(buttonId) {

    document
        .getElementById(buttonId)
        .classList.toggle("active");
}
