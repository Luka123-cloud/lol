// index.js
window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');

    if (!preloader) return;

    // основной скрытие
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 500);

    // fallback (если что-то зависло)
    setTimeout(() => {
        if (!preloader.classList.contains('hidden')) {
            preloader.classList.add('hidden');
        }
    }, 4000);
});


document.addEventListener('DOMContentLoaded', function () {
    // В index.js внутри DOMContentLoaded
const cursor = document.querySelector('.cursor');
if (cursor) {
    // Движение курсора
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Эффект при наведении на интерактивные элементы
    const hoverElements = document.querySelectorAll(
        'button, .inventory-cell, .horizontal-mask-item, .voice-item, .music-btn, .player-close-btn'
    );
    
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });
}
    // =========================
    // ГЛОБАЛЬНЫЕ ЭЛЕМЕНТЫ
    // =========================
    const bodyMusic = document.getElementById('birthdayMusic');
    const musicBtn = document.getElementById('musicControl');
    const gallery = document.querySelector('.gallery-container');

    const page2 = document.querySelector('.page2');

    // gallery
    const galleryTrack = document.querySelector('.gallery-track');
    const galleryRange = document.getElementById('galleryRange');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // old voice player
    const voicePlayer = document.getElementById('voicePlayer');
    const playerImage = document.getElementById('playerImage');
    const playerName = document.getElementById('playerName');
    const playlist = document.getElementById('playlist');
    const closePlayer = document.getElementById('closePlayer');

    // mask player
    const maskPlayer = document.getElementById('maskPlayer');
    const closeMaskPlayer = document.getElementById('closeMaskPlayer');
    const playerLargeImage = document.getElementById('playerLargeImage');
    const playerLargeName = document.getElementById('playerLargeName');
    const maskHorizontalList = document.getElementById('maskHorizontalList');
    const voiceList = document.getElementById('voiceList');

    const cells = document.querySelectorAll('.inventory-cell:not(.empty)');

    // =========================
    // ФОНОВАЯ МУЗЫКА
    // =========================
    let musicStarted = false;
    let musicPausedByScroll = false;
    let lastScrollY = window.scrollY;

    function showMainControls() {
        if (gallery) gallery.classList.remove('hidden');
        if (musicBtn) musicBtn.classList.remove('hidden');
    }

    function hideMainControls() {
        if (gallery) gallery.classList.add('hidden');
        if (musicBtn) musicBtn.classList.add('hidden');
    }

    function playMusic() {
        if (!bodyMusic || !musicBtn) return;

        if (!musicStarted) {
            bodyMusic.play()
                .then(() => {
                    musicStarted = true;
                    musicBtn.textContent = 'Pause ⏸';
                    musicBtn.classList.remove('hidden');
                })
                .catch(err => console.log('Ошибка воспроизведения музыки:', err));
        } else if (bodyMusic.paused && !musicPausedByScroll) {
            bodyMusic.play()
                .then(() => {
                    musicBtn.textContent = 'Pause ⏸';
                    musicBtn.classList.remove('hidden');
                })
                .catch(err => console.log('Ошибка воспроизведения музыки:', err));
        }
    }

    function pauseMusic() {
        if (!bodyMusic || !musicBtn) return;

        if (!bodyMusic.paused) {
            bodyMusic.pause();
            musicBtn.textContent = 'Play ▶';
        }
    }

    if (musicBtn) {
        musicBtn.addEventListener('click', function () {
            if (!bodyMusic) return;

            if (bodyMusic.paused) {
                playMusic();
                musicPausedByScroll = false;
            } else {
                pauseMusic();
            }
        });
    }

    window.addEventListener('scroll', function () {
        if (!musicBtn || !bodyMusic) return;

        const currentScrollY = window.scrollY;

        // если mask player открыт, вообще не трогаем кнопку музыки и галерею
        if (maskPlayer && maskPlayer.classList.contains('active')) {
            lastScrollY = currentScrollY;
            return;
        }

        if (currentScrollY > 100 && currentScrollY > lastScrollY) {
            musicBtn.classList.add('hidden');

            if (musicStarted && !bodyMusic.paused) {
                bodyMusic.pause();
                bodyMusic.currentTime = 0;
                musicBtn.textContent = 'Play ▶';
                musicPausedByScroll = true;
            }
        }

        if (currentScrollY < 50 && currentScrollY < lastScrollY) {
            musicBtn.classList.remove('hidden');

            if (musicPausedByScroll) {
                bodyMusic.play()
                    .then(() => {
                        musicBtn.textContent = 'Pause ⏸';
                        musicPausedByScroll = false;
                    })
                    .catch(err => console.log('Ошибка возобновления:', err));
            }
        }

        if (currentScrollY < 100 && currentScrollY > 50) {
            musicBtn.classList.remove('hidden');
        }

        lastScrollY = currentScrollY;
    });

    document.addEventListener('click', function startOnClick() {
        if (!musicStarted) {
            playMusic();
        }
        document.removeEventListener('click', startOnClick);
    }, { once: true });

    document.addEventListener('scroll', function startOnScroll() {
        if (!musicStarted && window.scrollY < 50) {
            playMusic();
        }
    }, { once: true });

    // =========================
    // ГАЛЕРЕЯ
    // =========================
    if (galleryTrack && galleryRange && galleryItems.length > 0) {
        let currentIndex = 0;
        const totalItems = galleryItems.length;

        function updateGalleryPosition(index) {
            galleryTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
            galleryTrack.style.transform = `translateX(-${index * 100}%)`;
        }

        galleryRange.addEventListener('input', function (e) {
            currentIndex = parseInt(e.target.value, 10);
            updateGalleryPosition(currentIndex);
        });

        galleryTrack.addEventListener('wheel', function (e) {
            e.preventDefault();

            const delta = e.deltaY > 0 ? 1 : -1;
            let newIndex = currentIndex + delta;

            if (newIndex < 0) newIndex = 0;
            if (newIndex >= totalItems) newIndex = totalItems - 1;

            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                galleryRange.value = currentIndex;
                updateGalleryPosition(currentIndex);
            }
        });

        updateGalleryPosition(0);
    }

    // =========================
    // ЭФФЕКТ ИМЕНИ НА PAGE2
    // =========================
    if (page2) {
        let nameHover = page2.querySelector('.inventory-name-hover');

        if (!nameHover) {
            nameHover = document.createElement('div');
            nameHover.className = 'inventory-name-hover';
            page2.appendChild(nameHover);
        }

        cells.forEach(cell => {
            const img = cell.querySelector('img');
            const name = cell.dataset.name || (img ? img.alt : 'Маска');

            cell.addEventListener('mouseenter', function () {
                nameHover.textContent = name;
                nameHover.classList.add('active');
            });

            cell.addEventListener('mouseleave', function () {
                nameHover.classList.remove('active');
            });
        });
    }

    // =========================
    // ДАННЫЕ ДЛЯ СТАРОГО VOICE PLAYER
    // =========================
    const voiceMessages = {
        'Самурай': [
            { name: 'История', file: 'kaef.mp3', time: '1:23' }
        ],
        'Они': [
            { name: 'Рык', file: 'oni_roar.mp3', time: '0:08' }
        ],
        'Хання': [
            { name: 'Шепот', file: 'hannya_whisper.mp3', time: '0:32' }
        ]
    };
    

    // =========================
    // СТАРЫЙ VOICE PLAYER
    // =========================
    let oldPlayerAudio = null;
    let currentOldPlayingItem = null;

    if (voicePlayer && playerImage && playerName && playlist && closePlayer) {
        oldPlayerAudio = new Audio();
        oldPlayerAudio.className = 'voice-audio';
        document.body.appendChild(oldPlayerAudio);

        function openPlayer(maskName, imageSrc) {
            playerImage.src = imageSrc;
            playerName.textContent = maskName;

            playlist.innerHTML = '';

            const messages = voiceMessages[maskName] || [
                { name: 'Голосовое сообщение', file: 'default.mp3', time: '0:30' }
            ];

            messages.forEach((msg, index) => {
                const item = document.createElement('div');
                item.className = 'playlist-item';
                item.dataset.index = index;
                item.dataset.file = msg.file;

                item.innerHTML = `
                    <img src="${imageSrc}" class="playlist-item-image" alt="${maskName}">
                    <div class="playlist-item-info">
                        <div class="playlist-item-name">${msg.name}</div>
                        <div class="playlist-item-time">${msg.time}</div>
                    </div>
                    <button class="playlist-item-play">▶</button>
                `;

                const playBtn = item.querySelector('.playlist-item-play');

                playBtn.addEventListener('click', function (e) {
                    e.stopPropagation();

                    if (currentOldPlayingItem === item) {
                        if (oldPlayerAudio.paused) {
                            oldPlayerAudio.play();
                            playBtn.textContent = '⏸';
                            playBtn.classList.add('playing');
                        } else {
                            oldPlayerAudio.pause();
                            playBtn.textContent = '▶';
                            playBtn.classList.remove('playing');
                        }
                    } else {
                        if (currentOldPlayingItem) {
                            const oldBtn = currentOldPlayingItem.querySelector('.playlist-item-play');
                            if (oldBtn) {
                                oldBtn.textContent = '▶';
                                oldBtn.classList.remove('playing');
                            }
                            currentOldPlayingItem.classList.remove('active');
                        }

                        oldPlayerAudio.src = msg.file;
                        oldPlayerAudio.play();
                        playBtn.textContent = '⏸';
                        playBtn.classList.add('playing');
                        item.classList.add('active');
                        currentOldPlayingItem = item;
                    }
                });

                item.addEventListener('click', function () {
                    playBtn.click();
                });

                playlist.appendChild(item);
            });

            voicePlayer.classList.add('active');
        }

        // если вдруг хочешь использовать старый player по клику
        // сейчас не включаю его на inventory-cell, потому что у тебя уже есть maskPlayer

        closePlayer.addEventListener('click', function () {
            oldPlayerAudio.pause();
            oldPlayerAudio.currentTime = 0;
            voicePlayer.classList.remove('active');
            currentOldPlayingItem = null;
        });

        voicePlayer.addEventListener('click', function (e) {
            if (e.target === voicePlayer) {
                closePlayer.click();
            }
        });

        oldPlayerAudio.addEventListener('ended', function () {
            if (currentOldPlayingItem) {
                const playBtn = currentOldPlayingItem.querySelector('.playlist-item-play');
                if (playBtn) {
                    playBtn.textContent = '▶';
                    playBtn.classList.remove('playing');
                }
                currentOldPlayingItem.classList.remove('active');
                currentOldPlayingItem = null;
            }
        });
    }

    // =========================
    // MASK PLAYER
    // =========================
    const masksData = [
        { name: 'Самурай', image: 'https://i.pinimg.com/736x/fc/92/fd/fc92fdb036e97921ad0ac4f2815c9693.jpg', type: 'Воин' },
        { name: 'Они', image: 'https://i.pinimg.com/1200x/38/e9/3e/38e93e07aad7d19d8bab7f7a10d9775f.jpg', type: 'Демон' },
        { name: 'Хання', image: 'https://i.pinimg.com/736x/1b/45/3a/1b453af26f062180328613fd34b9f3b1.jpg', type: 'Ревность' },
        { name: 'Тэнгу', image: 'https://i.pinimg.com/474x/a6/af/c3/a6afc319871aad419327acb68d1cb8e6.jpg', type: 'Дух' },
        { name: 'Хёттоко', image: 'https://i.pinimg.com/736x/6c/83/99/6c83997a5931792446b084a161d951c8.jpg', type: 'Комедия' },
        { name: 'Намахаге', image: 'https://i.pinimg.com/736x/17/6f/a4/176fa4290b9c77239c55ca6dc1ebbc08.jpg', type: 'Оборотень' },
        { name: 'Кицунэ', image: 'https://i.pinimg.com/736x/e1/b5/d3/e1b5d3b3ee39d1ed1a594822615ecff0.jpg', type: 'Лиса' },
        { name: 'Окамэ', image: 'https://i.pinimg.com/736x/51/92/f4/5192f47b5c8353a5e8d84cf16f74b222.jpg', type: 'Счастье' },
        { name: 'Ультрамен', image: 'https://i.pinimg.com/1200x/8b/d7/37/8bd737c96501ddd7b0f26badc3a4310a.jpg', type: 'Герой' },
        { name: 'Комаину', image: 'https://i.pinimg.com/736x/7d/23/ff/7d23ff32b916f353b98ce92810b4149f.jpg', type: 'Стражи' },
        { name: 'Анимэгао', image: 'https://i.pinimg.com/736x/1d/bf/9f/1dbf9f78431418a417588dc12d86c395.jpg', type: 'Аниме' },
        { name: 'Каппа', image: 'https://i.pinimg.com/736x/48/f6/cc/48f6cc2368b473939b713afc625e54d1.jpg', type: 'Водяной' },
        { name: 'Но', image: 'https://i.pinimg.com/736x/9c/ce/c6/9ccec689d1afad8ba383bd1b496139eb.jpg', type: 'Театр' },
        { name: 'Кендо', image: 'https://i.pinimg.com/1200x/5e/fa/dc/5efadc76bc473b11db9ef15cc0603ad8.jpg', type: 'Самурай' },
        { name: 'Дополнительная', image: 'https://i.pinimg.com/736x/d2/ab/52/d2ab5228b713be42e32a2778578d22bf.jpg', type: 'Дополнительная' },
        { name: 'Еще одна', image: 'https://i.pinimg.com/736x/ca/f0/4f/caf04f902459656d0898e6578b2ad6a8.jpg', type: 'Еще одна' },
        { name: 'Последняя', image: 'https://i.pinimg.com/736x/e6/91/9b/e6919b5ace3855012275ddcc52500d2a.jpg', type: 'Последняя' }

    ];

    const voiceMessagesData = {
        'Самурай': [
            { name: 'Приветствие', file: 'kaef.mp3', time: '0:15' },
            { name: 'История', file: 'voices/samurai_story.mp3', time: '1:23' }
        ],
        'Они': [
            { name: 'Рык', file: 'voices/oni.mp3', time: '0:08' }
        ],
        'Хання': [
            { name: 'Голосовое сообщение', file: '', time: '0:30' }
        ]
    };

    let currentAudio = null;
    let currentPlayingButton = null;

    function stopCurrentMaskAudio() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        if (currentPlayingButton) {
            currentPlayingButton.textContent = '▶';
            currentPlayingButton.classList.remove('playing');
        }

        currentAudio = null;
        currentPlayingButton = null;
    }

    function renderMaskList(selectedName) {
        if (!maskHorizontalList) return;

        maskHorizontalList.innerHTML = '';

        masksData.forEach(mask => {
            const item = document.createElement('div');
            item.className = 'horizontal-mask-item';

            if (mask.name === selectedName) {
                item.classList.add('active');
            }

            item.innerHTML = `<img src="${mask.image}" alt="${mask.name}">`;

            item.addEventListener('click', function () {
                openMask(mask.name);
            });

            maskHorizontalList.appendChild(item);
        });

        setTimeout(() => {
            maskHorizontalList.scrollTop = 0;
            maskHorizontalList.scrollLeft = 0;
        }, 50);
    }

    function playVoice(file, button) {
        if (!file) return;

        // клик по той же кнопке
        if (currentPlayingButton === button && currentAudio) {
            if (!currentAudio.paused) {
                currentAudio.pause();
                button.textContent = '▶';
                button.classList.remove('playing');
            } else {
                currentAudio.play();
                button.textContent = '⏸';
                button.classList.add('playing');
            }
            return;
        }

        // остановить предыдущий
        if (currentPlayingButton && currentAudio) {
            currentAudio.pause();
            currentPlayingButton.textContent = '▶';
            currentPlayingButton.classList.remove('playing');
        }

        if (!currentAudio) {
            currentAudio = new Audio(file);
        } else {
            currentAudio.src = file;
        }

        currentAudio.play()
            .then(() => {
                button.textContent = '⏸';
                button.classList.add('playing');
                currentPlayingButton = button;
            })
            .catch(err => {
                console.error('Ошибка загрузки аудио:', file, err);
                button.textContent = '▶';
                button.classList.remove('playing');
                button.disabled = true;
                button.style.opacity = '0.5';
            });

        currentAudio.onended = () => {
            if (currentPlayingButton) {
                currentPlayingButton.textContent = '▶';
                currentPlayingButton.classList.remove('playing');
            }
            currentPlayingButton = null;
        };

        currentAudio.onerror = () => {
            console.error('Ошибка загрузки аудио:', file);
            button.textContent = '▶';
            button.classList.remove('playing');
            button.disabled = true;
            button.style.opacity = '0.5';
        };
    }

    function renderVoiceList(maskName) {
        if (!voiceList) return;

        voiceList.innerHTML = '';

        const messages = voiceMessagesData[maskName] || [
            { name: 'Голосовое сообщение', file: '', time: '0:30' }
        ];

        messages.forEach(msg => {
            const item = document.createElement('div');
            item.className = 'voice-item';

            item.innerHTML = `
                <div class="voice-icon">♪</div>
                <div class="voice-info">
                    <div class="voice-name">${msg.name}</div>
                    <div class="voice-time">${msg.time}</div>
                </div>
                <button class="voice-play-btn" data-file="${msg.file}">▶</button>
            `;

            const playBtn = item.querySelector('.voice-play-btn');

            if (msg.file) {
                playBtn.addEventListener('click', function (e) {
                    e.stopPropagation();
                    playVoice(msg.file, playBtn);
                });
            } else {
                playBtn.disabled = true;
                playBtn.style.opacity = '0.5';
            }

            voiceList.appendChild(item);
        });
    }

    function openMask(maskName) {
        if (!maskPlayer || !playerLargeImage || !playerLargeName) return;

        const mask = masksData.find(m => m.name === maskName);
        if (!mask) return;

        hideMainControls();

        playerLargeImage.src = mask.image;
        playerLargeImage.alt = mask.name;
        playerLargeName.textContent = mask.name;

        stopCurrentMaskAudio();
        renderMaskList(maskName);
        renderVoiceList(maskName);

        maskPlayer.classList.add('active');
    }

    function closeMask() {
        if (!maskPlayer) return;

        maskPlayer.classList.remove('active');
        stopCurrentMaskAudio();
        showMainControls();
    }

    cells.forEach(cell => {
        cell.addEventListener('click', function () {
            const name = this.dataset.name;
            if (name) {
                openMask(name);
            }
        });
    });

    if (closeMaskPlayer) {
        closeMaskPlayer.addEventListener('click', closeMask);
    }

    if (maskPlayer) {
        maskPlayer.addEventListener('click', function (e) {
            if (e.target === maskPlayer) {
                closeMask();
            }
        });
    }
});