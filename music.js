
const wrapper = document.querySelector(".wrapper"),
  musicImg = wrapper.querySelector(".img-area img"),
  musicName = wrapper.querySelector(".song-details .name"),
  musicArtist = wrapper.querySelector(".song-details .artist"),
  playPauseBtn = wrapper.querySelector(".play-pause"),
  prevBtn = wrapper.querySelector("#prev"),
  nextBtn = wrapper.querySelector("#next"),
  mainAudio = wrapper.querySelector("#main-audio"),
  progressArea = wrapper.querySelector(".progress-area"),
  progressBar = progressArea.querySelector(".progress-bar"),
  musicList = wrapper.querySelector(".music-list"),
  moreMusicBtn = wrapper.querySelector("#more-music"),
  closeMoreMusic = musicList.querySelector("#close"),
  repeatBtn = wrapper.querySelector("#repeat-plist"),
  ulTag = wrapper.querySelector("ul");

let musicIndex = Math.floor(Math.random() * allMusic.length);
let isMusicPaused = true;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  updatePlayingSong();
});

// Load music details
function loadMusic(index) {
  const song = allMusic[index];
  musicName.innerText = song.name;
  musicArtist.innerText = song.artist;
  musicImg.src = `${song.src}.jpg`;
  mainAudio.src = `${song.src}.mp3`;
}

// Play music
function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

// Pause music
function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

// Play previous song
function prevMusic() {
  musicIndex = (musicIndex - 1 + allMusic.length) % allMusic.length;
  loadMusic(musicIndex);
  playMusic();
  updatePlayingSong(); // Update list
}

// Play next song
function nextMusic() {
  musicIndex = (musicIndex + 1) % allMusic.length;
  loadMusic(musicIndex);
  playMusic();
  updatePlayingSong(); // Update list
}

// Select a song from the list
function selectSong(element) {
  const selectedIndex = element.getAttribute("li-index");
  musicIndex = selectedIndex - 1;
  loadMusic(musicIndex);
  playMusic();
  updatePlayingSong(); // Update list
}

// Play or pause event
playPauseBtn.addEventListener("click", () => {
  const isPlaying = wrapper.classList.contains("paused");
  isPlaying ? pauseMusic() : playMusic();
  updatePlayingSong();
});

// Previous and next button events
prevBtn.addEventListener("click", prevMusic);
nextBtn.addEventListener("click", nextMusic);

// Update progress bar as music plays
mainAudio.addEventListener("timeupdate", (e) => {
  if (mainAudio.duration) {
    const progressWidth = (e.target.currentTime / mainAudio.duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    updateCurrentTime(e.target.currentTime);
  }
});

// Update current time and duration
function updateCurrentTime(currentTime) {
  const currentMin = Math.floor(currentTime / 60);
  const currentSec = Math.floor(currentTime % 60)
    .toString()
    .padStart(2, "0");
  wrapper.querySelector(".current-time").innerText = `${currentMin}:${currentSec}`;
}

mainAudio.addEventListener("loadeddata", () => {
  const totalMin = Math.floor(mainAudio.duration / 60);
  const totalSec = Math.floor(mainAudio.duration % 60)
    .toString()
    .padStart(2, "0");
  wrapper.querySelector(".max-duration").innerText = `${totalMin}:${totalSec}`;
});

// Seek through the progress bar
progressArea.addEventListener("click", (e) => {
  const progressWidth = progressArea.clientWidth;
  const clickedOffsetX = e.offsetX;
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * mainAudio.duration;
  playMusic();
  updatePlayingSong();
});

// Repeat/shuffle button event
repeatBtn.addEventListener("click", () => {
  switch (repeatBtn.innerText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
});

// Handle song end event
mainAudio.addEventListener("ended", () => {
  switch (repeatBtn.innerText) {
    case "repeat":
      nextMusic();
      break;
    case "repeat_one":
      mainAudio.currentTime = 0;
      playMusic();
      break;
    case "shuffle":
      shuffleMusic();
      break;
  }
});

// Shuffle music
function shuffleMusic() {
  let randomIndex;
  do {
    randomIndex = Math.floor(Math.random() * allMusic.length);
  } while (randomIndex === musicIndex);
  musicIndex = randomIndex;
  loadMusic(musicIndex);
  playMusic();
  updatePlayingSong();
}

// Show/hide music list
moreMusicBtn.addEventListener("click", () => {
  musicList.classList.toggle("show");
});

closeMoreMusic.addEventListener("click", () => {
  musicList.classList.remove("show");
});

// Generate song list dynamically
allMusic.forEach((song, index) => {
  const liTag = `
    <li li-index="${index + 1}">
      <div class="row">
        <span>${song.name}</span>
        <p>${song.artist}</p>
      </div>
      <span id="${song.src}" class="audio-duration">3:40</span>
      <audio class="${song.src}" src="so"></audio>
    </li>`
  ulTag.insertAdjacentHTML("beforeend", liTag);

  const liAudioTag = ulTag.querySelector(`.${song.src}`);
  liAudioTag.addEventListener("loadeddata", () => {
    const duration = liAudioTag.duration;
    const totalMin = Math.floor(duration / 60);
    const totalSec = Math.floor(duration % 60)
      .toString()
      .padStart(2, "0");
    const durationTag = ulTag.querySelector(`#${song.src}`);
    durationTag.innerText = `${totalMin}:${totalSec}`;
    durationTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });

  // Add click event listener to each list item
  const liItem = ulTag.querySelector(`li[li-index="${index + 1}"]`);
  liItem.addEventListener("click", () => selectSong(liItem));
});

// Update the song that is currently playing in the list
function updatePlayingSong() {
  const allLiTags = ulTag.querySelectorAll("li");

  // Remove 'playing' class from all list items
  allLiTags.forEach((li) => {
    li.classList.remove("playing");
    const audioTag = li.querySelector(".audio-duration");
    const songDuration = audioTag.getAttribute("t-duration");
    audioTag.innerText = songDuration; // Reset to original duration
  });

  // Add 'playing' class to the current song
  const currentLi = ulTag.querySelector(`li[li-index="${musicIndex + 1}"]`);
  currentLi.classList.add("playing");

  // Update the duration text to "Playing"
  const currentAudioTag = currentLi.querySelector(".audio-duration");
  currentAudioTag.innerText = "Playing";
}






/*none*/
const body = document.querySelector("body");
const darkLight = document.querySelector("#darkLight");
const sidebar = document.querySelector(".sidebar");
const submenuItems = document.querySelectorAll(".submenu_item");
const sidebarOpen = document.querySelector("#sidebarOpen");
const sidebarClose = document.querySelector(".collapse_sidebar");
const sidebarExpand = document.querySelector(".expand_sidebar");
sidebarOpen.addEventListener("click", () => sidebar.classList.toggle("close"));

sidebarClose.addEventListener("click", () => {
  sidebar.classList.add("close", "hoverable");
});
sidebarExpand.addEventListener("click", () => {
  sidebar.classList.remove("close", "hoverable");
});

sidebar.addEventListener("mouseenter", () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.remove("close");
  }
});
sidebar.addEventListener("mouseleave", () => {
  if (sidebar.classList.contains("hoverable")) {
    sidebar.classList.add("close");
  }
});

darkLight.addEventListener("click", () => {
  body.classList.toggle("dark");
  if (body.classList.contains("dark")) {
    document.setI
    darkLight.classList.replace("bx-sun", "bx-moon");
  } else {
    darkLight.classList.replace("bx-moon", "bx-sun");
  }
});

submenuItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    item.classList.toggle("show_submenu");
    submenuItems.forEach((item2, index2) => {
      if (index !== index2) {
        item2.classList.remove("show_submenu");
      }
    });
  });
});

if (window.innerWidth < 768) {
  sidebar.classList.add("close");
} else {
  sidebar.classList.remove("close");
}

$$magicbuild.js*$$

const allImages = document.querySelectorAll(".images .img");
const lightbox = document.querySelector(".lightbox");
const closeImgBtn = lightbox.querySelector(".close-icon");

allImages.forEach(img => {
    // Calling showLightBox function with passing clicked img src as argument
    img.addEventListener("click", () => showLightbox(img.querySelector("img").src));
});

const showLightbox = (img) => {
    // Showing lightbox and updating img source
    lightbox.querySelector("img").src = img;
    lightbox.classList.add("show");
    document.body.style.overflow = "hidden";
}

closeImgBtn.addEventListener("click", () => {
    // Hiding lightbox on close icon click
    lightbox.classList.remove("show");
    document.body.style.overflow = "auto";
});
const quoteText = document.querySelector(".quote"),
  quoteBtn = document.querySelector("button"),
  authorName = document.querySelector(".name"),
  speechBtn = document.querySelector(".speech"),
  copyBtn = document.querySelector(".copy"),
  twitterBtn = document.querySelector(".twitter"),
  synth = speechSynthesis;





