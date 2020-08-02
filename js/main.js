const PLAYER_1_KEY = 'q';
const PLAYER_2_KEY = 'p';
const MIN_ROUND_WAIT = 2000;
const MAX_ROUND_WAIT = 6500;

const PLAYER_1_SPRITE_STAND = './src/sprites/p1_stand.svg';
const PLAYER_2_SPRITE_STAND = './src/sprites/p2_stand.svg';
const PLAYER_1_SPRITE_SHOOT = './src/sprites/p1_shoot.svg';
const PLAYER_2_SPRITE_SHOOT = './src/sprites/p2_shoot.svg';
const PLAYER_1_SPRITE_DEATH = './src/sprites/p1_death.svg';
const PLAYER_2_SPRITE_DEATH = './src/sprites/p2_death.svg';

window.addEventListener('load', () => {
    
    
    const startGameButton = document.getElementById('startGameButton');
    startGameButton.addEventListener('click', startGame);
    
    this.addEventListener('keypress', checkKeyPressed);
    
    let player1 = document.getElementById('player1');
    let player2 = document.getElementById('player2');
    let notificationText = document.getElementById('notification');
    
    let waitCountdown = null;
    let enableGuns = false;
    let roundActive = false;

    function startGame() {
        player1.src = PLAYER_1_SPRITE_STAND;
        player2.src = PLAYER_2_SPRITE_STAND;
        enableGuns = false;
        roundActive = false;
        notificationText.textContent = '';

        let seconds = 3;
        let countdown = setInterval(function() {
            if(seconds == 0) {
                clearInterval(countdown);
                startRound();
                return;
            }
            notificationText.textContent = seconds--;
        }, 1000);

        function startRound() {
            roundActive = true;
            notificationText.textContent = 'Espera';
            waitCountdown = setTimeout( function() {
                enableGuns = true;
                notificationText.textContent = '¡DISPARA!';
            }, getRandomValue(MIN_ROUND_WAIT, MAX_ROUND_WAIT));
        }
    }

    function checkKeyPressed(event) {
        if(roundActive) {
            let key = event.key.toLocaleLowerCase();

            if(key != PLAYER_1_KEY && key != PLAYER_2_KEY) {
                return;
            }

            clearInterval(waitCountdown);
            
            if(enableGuns) {
                if(key == PLAYER_1_KEY) {
                    notificationText.textContent = 'Gana jugador 1';
                    player1.src = PLAYER_1_SPRITE_SHOOT;
                    player2.src = PLAYER_2_SPRITE_DEATH;
                }
                else {
                    notificationText.textContent = 'Gana jugador 2';
                    player1.src = PLAYER_1_SPRITE_DEATH;
                    player2.src = PLAYER_2_SPRITE_SHOOT;
                }
            }
            else {
                if(key == PLAYER_1_KEY) {
                    notificationText.textContent = 'Jugador 1 es un traidor. Gana jugador 2';
                    player1.src = PLAYER_1_SPRITE_DEATH;
                    player2.src = PLAYER_2_SPRITE_SHOOT;
                }
                else {
                    notificationText.textContent = 'Jugador 2 es un traidor. Gana jugador 1';
                    player1.src = PLAYER_1_SPRITE_SHOOT;
                    player2.src = PLAYER_2_SPRITE_DEATH;
                }
            }

            enableGuns = false;
            roundActive = false;
        }
    }   
});

function getRandomValue (min, max) {
    return Math.floor((Math.random() * max) + min);
}