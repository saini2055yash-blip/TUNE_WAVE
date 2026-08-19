document.addEventListener("DOMContentLoaded", function () {

  const songs = document.querySelectorAll(".playlist .song");
  const files = [
    "Tareefan.mp3",
    "Wajah Bewajah (From Do Deewane Seher Mein).mp3",
    "Samjhawan.mp3",
    "Nazare.mp3",
    "Kasturi (From Amar Prem Ki Prem Kahani).mp3",
    "Thinking of You.mp3",
    "Iss Tarah.mp3",
    "Khat.mp3",
    "O Meri Laila.mp3",
    "Dil (feat. Sara Gurpal).mp3",
    "Bam Lahiri.mp3",
    "Lae Dooba.mp3",
    "Shararat (From Dhurandhar).mp3",
    "Main Hoon (From Battle Of Galwan).mp3",
    "Qubool (From Haq).mp3",
    "Parvati Boli Shankar Se.mp3",
    "Preet Re - From Dhadak 2.mp3",
    "Apna Bana Le.mp3",
    "Nazm Nazm.mp3",
    "Saiyaara (From Saiyaara).mp3"
  ];

  const images = [
    "images/Tareefan.jfif",
    "images/Wajah Bewajah (From Do Deewane Seher Mein).jfif",
    "images/Samjhawan.jfif",
    "images/Nazare.jfif",
    "images/Kasturi (From Amar Prem Ki Prem Kahani).jfif",
    "images/Thinking of You.jfif",
    "images/Iss Tarah.jfif",
    "images/Khat.jfif",
    "images/O Meri Laila.jfif",
    "images/Dil.jfif",
    "images/Bam Lahiri.jfif",
    "images/Lae Dooba.jfif",
    "images/Shararat.jfif",
    "images/Main Hoon.jfif",
    "images/Qubool.jfif",
    "images/Parvati Boli Shankar Se.jfif",
    "images/Preet Re.jfif",
    "images/Apna Bana Le.jfif",
    "images/Nazm Nazm.jfif",
    "images/Saiyara.jfif"
  ];

  const audio = new Audio();
  let currentSong = 0;
  let loopMode = 0;

  const playBtn = document.querySelector(".play");
  const nextBtn = document.querySelector(".fa-caret-right");
  const prevBtn = document.querySelector(".fa-caret-left");
  const replayBtn = document.querySelector(".replay");
  const loopBtn = document.querySelector(".loop");
  const navPart2 = document.querySelector(".nav-part2");
  const progress = document.querySelector('.progress');
  const timeCurr = document.querySelector('.time-current');
  const timeDur = document.querySelector('.time-duration');
  const backdrop = document.querySelector('.song-backdrop');
  const upperImage = document.querySelector('.upper-image-container');
  const volume = document.querySelector('.volume');
  const volumeIcon = document.querySelector('.volume-icon');
  let prevVolume = 1;

  const searchBox = document.getElementById('searchBox');
  const noResults = document.getElementById('noResults');
  const likeCounter = document.getElementById('likeCounter');

  // ---- ADD LIKE BUTTONS ----
  songs.forEach(song => {
    const heart = document.createElement('i');
    heart.classList.add('fa-regular', 'fa-heart', 'like-btn');
    song.appendChild(heart);

    heart.addEventListener('click', (e) => {
      e.stopPropagation();
      heart.classList.toggle('fa-regular');
      heart.classList.toggle('fa-solid');
      heart.classList.toggle('liked');
      updateLikeCount();
    });
  });

  function updateLikeCount() {
    const liked = document.querySelectorAll('.like-btn.liked').length;
    likeCounter.textContent = `Liked Songs: ${liked}`;
  }

  updateLikeCount(); // initial

  // ---- SEARCH FUNCTIONALITY ----
  searchBox.addEventListener('input', () => {
    const filter = searchBox.value.toLowerCase();
    let found = false;

    songs.forEach(song => {
      const text = song.textContent.toLowerCase();
      if (text.includes(filter)) {
        song.style.display = '';
        found = true;
      } else {
        song.style.display = 'none';
      }
    });

    noResults.style.display = (filter !== '' && !found) ? 'block' : 'none';
  });

  // ---- TIME FORMAT ----
  function formatTime(sec) {
    if (!isFinite(sec)) return '00:00';
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  // ---- PLAY SONG ----
  function playSong(index) {
    if (!files[index]) return;
    currentSong = index;
    audio.src = files[index];
    audio.play();

    if (backdrop) backdrop.style.backgroundImage = `url('${images[index]}')`;
    if (upperImage) upperImage.style.backgroundImage = `url('${images[index]}')`;

    songs.forEach(song => song.classList.remove("active"));
    songs[index].classList.add("active");

    if (navPart2) navPart2.textContent = songs[index].textContent;

    updatePlayIcon();
  }

  function updatePlayIcon() {
    playBtn.classList.toggle("fa-play", audio.paused);
    playBtn.classList.toggle("fa-pause", !audio.paused);
  }

  // ---- CLICK SONG ----
  songs.forEach((song, i) => song.addEventListener('click', () => playSong(i)));

  // ---- PLAY/PAUSE BUTTON ----
  playBtn.addEventListener('click', () => {
    if (!audio.src) { playSong(0); return; }
    audio.paused ? audio.play() : audio.pause();
    updatePlayIcon();
  });

  // ---- NEXT/PREVIOUS SONG ----
  nextBtn.addEventListener('click', () => {
    if(loopMode === 1) { audio.currentTime = 0; audio.play(); }
    else { currentSong = (currentSong + 1) % files.length; playSong(currentSong); }
  });

  prevBtn.addEventListener('click', () => {
    currentSong = (currentSong - 1 + files.length) % files.length;
    playSong(currentSong);
  });

  // ---- REPLAY SONG ----
  replayBtn.addEventListener('click', () => { audio.currentTime = 0; audio.play(); updatePlayIcon(); });

  // ---- LOOP SONG ----
  loopBtn.addEventListener('click', () => {
    loopMode = loopMode === 0 ? 1 : 0;
    loopBtn.classList.toggle("active", loopMode === 1);
  });

  // ---- AUTO NEXT ----
  audio.addEventListener('ended', () => {
    if(loopMode === 1) audio.play();
    else nextBtn.click();
  });

  // ---- PROGRESS BAR ----
  audio.addEventListener('loadedmetadata', () => timeDur.textContent = formatTime(audio.duration));
  audio.addEventListener('timeupdate', () => {
    timeCurr.textContent = formatTime(audio.currentTime);
    progress.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
  });

  progress.addEventListener('input', () => {
    if(audio.duration) audio.currentTime = (progress.value / 100) * audio.duration;
  });

  // ---- VOLUME ----
  audio.volume = parseFloat(volume.value || 1);
  volume.addEventListener('input', () => {
    audio.volume = parseFloat(volume.value);
    if(volumeIcon) {
      if(audio.volume === 0) volumeIcon.classList.replace('fa-volume-high','fa-volume-xmark');
      else volumeIcon.classList.replace('fa-volume-xmark','fa-volume-high');
    }
  });
  volumeIcon.addEventListener('click', () => {
    if(audio.volume > 0) { prevVolume = audio.volume; audio.volume = 0; volume.value = 0; volumeIcon.classList.replace('fa-volume-high','fa-volume-xmark'); }
    else { audio.volume = prevVolume || 1; volume.value = audio.volume; volumeIcon.classList.replace('fa-volume-xmark','fa-volume-high'); }
  });

});
