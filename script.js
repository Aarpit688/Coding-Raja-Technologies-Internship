document.addEventListener("DOMContentLoaded", () => {
    const ad = document.querySelector(".song");
    const playing = document.querySelector(".fa-play");
    const pauses = document.querySelector(".fa-pause");
    const ttl = document.querySelector(".title");
    const art_img = document.querySelector("#artist");
    const art_name = document.querySelector("#name");
    const playSong = document.querySelector("#playsong");
    const volumeControl = document.querySelector("#volume");
    const volumeIcon = document.querySelector("#volume-icon");

    const artist_name = ["Jasleen Royal", "Avvy Sra", "Arijit Singh", "King", "Karan Aujla"];
    const artist_title = ["Heeriye", "Ve Haaniyaan", "Tere Hawaale", "Maan Meri Jaan", "Tauba Tauba"];
    let x = 0;

    playSong.addEventListener("click", effect);
    document.getElementById("forward").addEventListener("click", forward);
    document.getElementById("backward").addEventListener("click", backward);
    ad.addEventListener("loadedmetadata", updateDuration);

    volumeControl.addEventListener("input", (e) => {
        ad.volume = e.target.value;
        updateVolumeIcon();
    });

    function effect() {
        if (ad.duration === ad.currentTime) {
            x = (x + 1) % artist_name.length;
        }
        if (!playing.classList.contains("none")) {
            ad.play();
            requestAnimationFrame(updateProgress);
        } else {
            ad.pause();
        }
        ttl.classList.toggle("run");
        playing.classList.toggle("none");
        pauses.classList.toggle("none");
        art_img.classList.toggle("round");
    }

    function removeEffect() {
        ad.pause();
        ad.currentTime = 0.01;
        ttl.classList.remove("run");
        playing.classList.remove("none");
        pauses.classList.add("none");
        art_img.classList.remove("round");
    }

    function backward() {
        x = (x - 1 + artist_name.length) % artist_name.length;
        removeEffect();
        loadSong(x);
        effect();
    }

    function forward() {
        x = (x + 1) % artist_name.length;
        removeEffect();
        loadSong(x);
        effect();
    }

    function loadSong(index) {
        art_name.innerHTML = artist_name[index];
        ttl.innerHTML = artist_title[index];
        art_img.src = `./images/image${index}.jpeg`;
        ad.src = `./songs/audio${index}.mp3`;

        // Update playlist
        updatePlaylist(index);

        // Check if the elements have updated correctly
        art_img.addEventListener('error', () => {
            console.error(`Image not found: ./images/image${index}.jpeg`);
        });
        ad.addEventListener('error', () => {
            console.error(`Audio not found: ./songs/audio${index}.mp3`);
        });
    }

    function updateDuration() {
        const duration = ad.duration;
        const min = Math.floor(duration / 60);
        const sec = Math.floor(duration % 60).toString().padStart(2, '0');
        document.getElementById("end").innerHTML = `${min}:${sec}`;
    }

    const progress = document.querySelector(".line");
    progress.addEventListener("click", (e) => {
        const width = progress.clientWidth;
        const offsetX = e.offsetX;
        const duration = ad.duration;
        ad.currentTime = (offsetX / width) * duration;
    });

    function updateProgress() {
        const currentTime = ad.currentTime;
        const duration = ad.duration;
        const widthbar = (currentTime / duration) * 100;
        document.querySelector(".lineChild").style.width = `${widthbar}%`;
        const mincur = Math.floor(currentTime / 60);
        const seccur = Math.floor(currentTime % 60).toString().padStart(2, '0');
        document.getElementById("start").innerHTML = `${mincur}:${seccur}`;
        if (!ad.paused) {
            requestAnimationFrame(updateProgress);
        }
    }

    function updatePlaylist(currentIndex) {
        const playlist = document.getElementById("playlist");
        playlist.innerHTML = "";
        artist_name.forEach((name, index) => {
            const li = document.createElement("li");
            li.textContent = `${name} - ${artist_title[index]}`;
            if (index === currentIndex) {
                li.classList.add("current");
            }
            playlist.appendChild(li);
        });
    }

    function updateVolumeIcon() {
        if (ad.volume === 0) {
            volumeIcon.className = 'fa-solid fa-volume-xmark';
        } else if (ad.volume <= 0.5) {
            volumeIcon.className = 'fa-solid fa-volume-low';
        } else {
            volumeIcon.className = 'fa-solid fa-volume-high';
        }
    }

    loadSong(0);
});
