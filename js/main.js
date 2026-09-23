const audio = document.getElementById("audio-track");

const timelineContainer = document.getElementById("song-timeline");
const seekSlider = document.getElementById("seek-slider");
const durationContainer = document.getElementById("duration");
const currentTimeContainer = document.getElementById("current-time");

let animationFrame = null;

audio.volume = 0.5;


function togglePlayPause(pathClass) {

    const paths = document.querySelectorAll("." + pathClass);

    if (audio.paused) {

        audio.play()
            .then(() => {

                // Show pause icon
                paths[0].classList.remove("active");
                paths[1].classList.add("active");

            })
            .catch(error => {

                console.error("Audio could not play:", error);

            });

    } else {

        audio.pause();

        // Show play icon
        paths[0].classList.add("active");
        paths[1].classList.remove("active");
    }
}


// ===============================
// AUDIO PLAY EVENT
// ===============================

audio.addEventListener("play", function () {

    cancelAnimationFrame(animationFrame);

    animationFrame = requestAnimationFrame(whilePlaying);

});


// ===============================
// AUDIO PAUSE EVENT
// ===============================

audio.addEventListener("pause", function () {

    cancelAnimationFrame(animationFrame);

});


// ===============================
// AUDIO ENDED
// ===============================

audio.addEventListener("ended", function () {

    cancelAnimationFrame(animationFrame);

    seekSlider.value = 0;

    currentTimeContainer.textContent = "0:00";

    timelineContainer.style.setProperty(
        "--seek-before-width",
        "0%"
    );

    // Show play icon
    const paths = document.querySelectorAll(".play-pause");

    if (paths.length >= 2) {
        paths[0].classList.add("active");
        paths[1].classList.remove("active");
    }
});


// ===============================
// TIME FORMAT
// ===============================

function calculateTime(seconds) {

    if (!isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);

    const secs = Math.floor(seconds % 60);

    const formattedSeconds =
        secs < 10 ? "0" + secs : secs;

    return minutes + ":" + formattedSeconds;
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

        seekSlider.max =
            Math.floor(audio.duration);
    }
}


// ===============================
// BUFFERED AMOUNT
// ===============================

function displayBufferedAmount() {

    if (!timelineContainer) {
        return;
    }

    if (!audio.buffered.length) {
        return;
    }

    if (!isFinite(audio.duration) || audio.duration <= 0) {
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
// UPDATE WHILE PLAYING
// ===============================

function whilePlaying() {

    if (audio.paused) {
        return;
    }

    if (!audio.duration || !isFinite(audio.duration)) {
        return;
    }

    // Update slider
    seekSlider.value =
        Math.floor(audio.currentTime);

    // Update current time
    currentTimeContainer.textContent =
        calculateTime(audio.currentTime);


    // Update timeline
    if (timelineContainer) {

        const percentage =
            (audio.currentTime / audio.duration) * 100;

        timelineContainer.style.setProperty(
            "--seek-before-width",
            percentage + "%"
        );
    }


    // Continue animation
    animationFrame =
        requestAnimationFrame(whilePlaying);
}


// ===============================
// SEEK SLIDER
// ===============================

seekSlider.addEventListener("input", function () {

    const value = Number(this.value);

    currentTimeContainer.textContent =
        calculateTime(value);


    if (timelineContainer && seekSlider.max > 0) {

        const percentage =
            (value / seekSlider.max) * 100;

        timelineContainer.style.setProperty(
            "--seek-before-width",
            percentage + "%"
        );
    }
});


// ===============================
// CHANGE AUDIO POSITION
// ===============================

seekSlider.addEventListener("change", function () {

    audio.currentTime =
        Number(this.value);
});


// ===============================
// AUDIO METADATA LOADED
// ===============================

audio.addEventListener("loadedmetadata", function () {

    displayDuration();

    setSliderMax();

    seekSlider.value = 0;

    currentTimeContainer.textContent = "0:00";

    displayBufferedAmount();
});


// ===============================
// BUFFER UPDATE
// ===============================

audio.addEventListener("progress", function () {

    displayBufferedAmount();
});


// ===============================
// HEART / REPEAT / SHUFFLE COLOR
// ===============================

function toggleColor(buttonId) {

    const button =
        document.getElementById(buttonId);

    if (button) {
        button.classList.toggle("active");
    }
}
