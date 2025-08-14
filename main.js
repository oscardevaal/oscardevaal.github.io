let darkTheme = false;

document.addEventListener('DOMContentLoaded', function () {
	 const modal = document.querySelector("dialog");
	 const switchThemeBtn = document.querySelector("#switchTheme");
	 const modeSelect = document.querySelector("#mode-select");

	 document.querySelector("#open-dialog").addEventListener("click", () => {
		  modal.showModal();
	 });

	 modal.querySelector("#okBtn").addEventListener("click", () => {
		  modal.close();
	 });

	 switchThemeBtn.addEventListener("click", () => {
		  const root = document.documentElement;

		  darkTheme = !darkTheme;

		  // Update the CSS variable
		  if (darkTheme) {
				// https://www.color-hex.com/color-palette/1044414
				switchThemeBtn.innerText = "Light theme";
				root.style.setProperty('--background-color', '#1c1b16');
				root.style.setProperty('--text-color', '#ebeae5');
				root.style.setProperty('--main-color', '#b6b093');
				root.style.setProperty('--secondairy-color', '#b8a54b');
				root.style.setProperty('--highlight-color', '#33312a');

				modeSelect.classList.remove("day");
		  }
		  else {
				switchThemeBtn.innerText = "Dark theme";
				root.style.setProperty('--background-color', '#f4f4f4');
				root.style.setProperty('--text-color', '#2f2f2f');
				root.style.setProperty('--main-color', '#4a4a4a');
				root.style.setProperty('--secondairy-color', '#4f3c52');
				root.style.setProperty('--highlight-color', '#fbe26c');

				modeSelect.classList.add("day");
        }

        setCoordinates();
	 });

	 const form = document.getElementById("form");
	 const inputs = form.querySelectorAll('input');
	 inputs.forEach(input => {
		  if (input.value) {
				input.focus();
				input.blur();
		  }
	 });
});

//audio
var xValues;
var yValues;
var percentages;

function skip(event) {
    const x = event.offsetX;
    const y = event.offsetY;

    // Navigate three levels up from the event target
    const parent = event.target.parentElement.parentElement.parentElement;

    for (let i = 0; i < 60; i++) {
        if (
            x < xValues[i] + 8 && x > xValues[i] - 8 &&
            y < yValues[i] + 8 && y > yValues[i] - 8
        ) {
            const dashoffset = 691 - (6.91 * percentages[i]);

            const progress = parent.querySelector(".progress");
            const audio = parent.querySelector(".audio");
            const playButton = parent.querySelector(".play-button");

            if (!progress || !audio || !playButton) {
                return;
            }

            progress.dataset.dashoffset = dashoffset;
            audio.currentTime = audio.duration * (percentages[i] / 100);

            if (playButton.classList.contains("stopped")) {
                progress.style.strokeDashoffset = dashoffset;
                playButton.classList.remove("stopped");
                playButton.classList.add("paused");
            } else if (!playButton.classList.contains("play")) {
                progress.style.strokeDashoffset = dashoffset;
            }

            break;
        }
    }
}

document.querySelectorAll("audio").forEach(function (audio) {
    audio.addEventListener("ended", function () {
        const playButton = this.parentElement.querySelector(".play-button");
        if (playButton) {
            playButton.classList.remove("play");
            playButton.classList.add("stopped");
        }
    });
});

function setCoordinates() {
    var steps = 60;
    var radius = 110;
    var center = 120;

    xValues = [steps];
    yValues = [steps];
    percentages = [steps];
    for (var i = 0; i < steps; i++) {
        xValues[i] = (center + radius * Math.cos(2 * Math.PI * (i - 15) / steps));
        yValues[i] = (center + radius * Math.sin(2 * Math.PI * (i - 15) / steps));
        percentages[i] = i / steps * 100;
    }

    //set data dashoffset
    document.querySelectorAll("div .play-button").forEach(function (button) {
        button.dataset.dashoffset = "691";
    });
}

document.querySelectorAll(".controls").forEach(function (control) {
    control.addEventListener("click", function () {
        const playButton = this.parentElement;
        const audioItem = playButton.parentElement;

        // Pause all other audio elements
        document.querySelectorAll(".play-button").forEach(function (button) {
            const currentClass = button.classList[1];
            const clickedClass = playButton.classList[1];

            if (currentClass !== clickedClass && button.classList.contains("play")) {
                button.classList.remove("play");
                const otherAudio = button.parentElement.querySelector(".audio");
                if (otherAudio) {
                    otherAudio.pause();
                }
            }
        });

        const itemPlayButton = audioItem.querySelector(".play-button");
        const itemAudio = audioItem.querySelector(".audio");
        const itemProgress = audioItem.querySelector(".progress");

        // Reset if stopped
        if (itemPlayButton.classList.contains("stopped")) {
            if (itemProgress) {
                itemProgress.style.strokeDashoffset = "691";
                itemProgress.dataset.dashoffset = "691";
            }
            if (itemAudio) {
                itemAudio.currentTime = 0;
            }
            itemPlayButton.classList.remove("stopped");
        }

        // Toggle play/pause
        if (!itemPlayButton.classList.contains("play")) {
            itemAudio.play();
            itemPlayButton.classList.add("play");
        } else {
            itemAudio.pause();
            itemPlayButton.classList.remove("play");
        }

        playProgressBar(audioItem);
    });
});

function playProgressBar(audioItem) {
    const playButton = audioItem.querySelector(".play-button");
    if (!playButton.classList.contains("play")) {
        return;
    }

    setTimeout(function () {
        const audio = audioItem.querySelector("audio");
        const progress = audioItem.querySelector(".progress");

        if (!audio || !progress) return;

        const offset = 691 / audio.duration / 3;
        let dashoffset = parseFloat(progress.dataset.dashoffset);

        if (dashoffset - offset < 0) {
            dashoffset = 0;
        } else {
            dashoffset -= offset;
        }

        progress.style.strokeDashoffset = dashoffset;
        progress.dataset.dashoffset = dashoffset;

        playProgressBar(audioItem);
    }, 330);
}

setCoordinates();

function scrollPhoto(previous = false) {
    const container = document.querySelector('#gallery');
    const photos = Array.from(container.children);
    const visibleItems = getVisibleElements(container).at(0);
    let scrollToPhoto = photos.at(photos.indexOf(visibleItems) - 1);
    if (!previous) {
        let index = photos.indexOf(visibleItems) + 1;
        if (index >= photos.length) {
            index = 0;
        }
        scrollToPhoto = photos.at(index);
    }

    container.scrollTo({
        left: scrollToPhoto.offsetLeft,
        behavior: "smooth"
    });
}

function getVisibleElements(container) {
    const containerRect = container.getBoundingClientRect();

    return Array.from(container.children).filter(child => {
        const childRect = child.getBoundingClientRect();

        // Check horizontal visibility (you can also check vertical if needed)
        const horizontallyVisible =
            childRect.left > 0 &&
            childRect.left < containerRect.right &&
            childRect.right > containerRect.left;

        // Optional: Check vertical visibility inside the container
        const verticallyVisible =
            childRect.top < containerRect.bottom &&
            childRect.bottom > containerRect.top;

        return horizontallyVisible && verticallyVisible;
    });
}