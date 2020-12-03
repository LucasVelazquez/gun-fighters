screen.orientation.lock('landscape');

const PLAYER_1_KEY = 'q';
const PLAYER_2_KEY = 'p';
const MIN_ROUND_WAIT = 2000;
const MAX_ROUND_WAIT = 6500;

const PLAYER_1_SPRITE_STAND = new Image();
PLAYER_1_SPRITE_STAND.src = './src/sprites/p1_stand.svg';

const PLAYER_2_SPRITE_STAND = new Image();
PLAYER_2_SPRITE_STAND.src = './src/sprites/p2_stand.svg';

const PLAYER_1_SPRITE_SHOOT = new Image();
PLAYER_1_SPRITE_SHOOT.src = './src/sprites/p1_shoot.svg';

const PLAYER_2_SPRITE_SHOOT = new Image();
PLAYER_2_SPRITE_SHOOT.src = './src/sprites/p2_shoot.svg';

const PLAYER_1_SPRITE_DEATH = new Image();
PLAYER_1_SPRITE_DEATH.src = './src/sprites/p1_death.svg';

const PLAYER_2_SPRITE_DEATH = new Image();
PLAYER_2_SPRITE_DEATH.src = './src/sprites/p2_death.svg';

const BACKGROUND_MUSIC = './src/music/background.ogg';
const SHOOT_1_FX = './src/fx/shoot_1.wav';

const DEATH_1_FX = './src/fx/death_1.mp3';
const DEATH_2_FX = './src/fx/death_2.mp3';
const DEATH_3_FX = './src/fx/death_3.mp3';

window.addEventListener('load', () => {
    document.getElementById('loading').style.display = 'none';
    let backgroundMusic = new Audio(BACKGROUND_MUSIC);
    backgroundMusic.volume = 0.4;

    backgroundMusic.addEventListener('ended', function () {
        this.currentTime = 0;
        this.play();
    }, false);

    let shoot1 = new Audio(SHOOT_1_FX);
    let deathsFxs = [
        new Audio(DEATH_1_FX),
        new Audio(DEATH_2_FX),
        new Audio(DEATH_3_FX)
    ];
    let startGameButton = document.getElementById('startGameButton');
    startGameButton.addEventListener('click', startGame);

    let player1 = document.getElementById('player1');
    let player2 = document.getElementById('player2');
    let notificationText = document.getElementById('notification');

    let player1Button = document.getElementById('q');
    let player2Button = document.getElementById('p');

    let waitCountdown = null;
    let countdown = null;
    let enableGuns = false;
    let roundActive = false;

    if (deviceIsDesktop()) {
        this.addEventListener('keypress', checkWinner);

        player1Button.children[0].textContent = 'Presiona "Q" para disparar';
        player2Button.children[0].textContent = 'Presiona "P" para disparar';
    }
    else {
        player1Button.addEventListener('touchstart', checkWinner);
        player2Button.addEventListener('touchstart', checkWinner);

        player1Button.children[0].textContent = 'Presiona para disparar';
        player2Button.children[0].textContent = 'Presiona para disparar';
    }

    function startGame() {
        player1.src = PLAYER_1_SPRITE_STAND.src;
        player2.src = PLAYER_2_SPRITE_STAND.src;
        enableGuns = false;
        roundActive = false;
        notificationText.textContent = '';
        notificationText.style.color = 'Black';
        clearInterval(waitCountdown);
        clearInterval(countdown);

        if (backgroundMusic.paused) {
            backgroundMusic.play();
        }

        let seconds = 3;
        countdown = setInterval(function () {
            if (seconds == 0) {
                clearInterval(countdown);
                startRound();
                return;
            }
            notificationText.textContent = seconds--;
        }, 1000);

        function startRound() {
            roundActive = true;
            notificationText.textContent = 'Espera';
            waitCountdown = setTimeout(function () {
                enableGuns = true;
                notificationText.style.color = 'Red';
                notificationText.textContent = '¡DISPARA!';
            }, getRandomValue(MIN_ROUND_WAIT, MAX_ROUND_WAIT));
        }
    }

    function checkWinner(event) {
        if (roundActive) {
            let key;

            if(deviceIsDesktop()) {
                key = event.key.toLocaleLowerCase();
            }
            else {
                key = event.currentTarget.id;
            }

            if (key != PLAYER_1_KEY && key != PLAYER_2_KEY) {
                return;
            }

            roundActive = false;
            clearInterval(waitCountdown);
            notificationText.style.color = 'Black';
            shoot1.play();
            deathsFxs[getRandomValue(0, deathsFxs.length - 1)].play();

            if (enableGuns) {
                if (key == PLAYER_1_KEY) {
                    notificationText.textContent = 'Gana jugador 1';
                    player1.src = PLAYER_1_SPRITE_SHOOT.src;
                    player2.src = PLAYER_2_SPRITE_DEATH.src;
                }
                else {
                    notificationText.textContent = 'Gana jugador 2';
                    player1.src = PLAYER_1_SPRITE_DEATH.src;
                    player2.src = PLAYER_2_SPRITE_SHOOT.src;
                }
            }
            else {
                if (key == PLAYER_1_KEY) {
                    notificationText.textContent = 'Jugador 1 es un traidor. Gana jugador 2';
                    player1.src = PLAYER_1_SPRITE_DEATH.src;
                    player2.src = PLAYER_2_SPRITE_SHOOT.src;
                }
                else {
                    notificationText.textContent = 'Jugador 2 es un traidor. Gana jugador 1';
                    player1.src = PLAYER_1_SPRITE_SHOOT.src;
                    player2.src = PLAYER_2_SPRITE_DEATH.src;
                }
            }

            enableGuns = false;
        }
    }
});

function getRandomValue(min, max) {
    return Math.floor((Math.random() * max) + min);
}

function deviceIsDesktop() {
    return !(navigator.userAgent.match(/Tablet|iPad|Mobile|Windows Phone|Lumia|Android|webOS|iPhone|iPod|Blackberry|PlayBook|BB10|Opera Mini|\bCrMo\/|Opera Mobi/i));
}