// HTML
const playButton = document.getElementsByClassName('ui-button play')[0];
const feedButton = document.getElementsByClassName('ui-button feed')[0];
const gameControls = document.getElementsByClassName('ui-button game-controls');

const scoreLabel = document.getElementsByClassName('score')[0];
const higthScoreLabel = document.getElementsByClassName('h-score')[0];

const gameUI = document.getElementsByClassName('game')[0];
const dino = document.getElementsByClassName('dino-sprite')[0];
const ground = document.getElementsByClassName('ground')[0];


// Variables
let playing = false;
let duck = false;
let spritesCounter = 1;
let score = 0;
let speed = 4;
let hScore = (localStorage.getItem('hScore')) ? localStorage.getItem('hScore') : 0 ;

let randomNumber = 1000;


// Methods
const sleep = async(ms) => new Promise(resolve => setTimeout(resolve, ms));

const getRndInteger = (min, max) => {
    return Math.floor(Math.random() * (max - min) ) + min;
  }

const keyDown = async({keyCode}) => {
    // console.log(keyCode);

    if(playing === false && (keyCode === 32 || keyCode === 38)) {
        newCact();
        playing = true;
        ground.setAttribute('style', `animation: ground-move ${speed}s 0.6s infinite linear both;`);
        playButton.classList.remove('floating');
        playButton.classList.add('close');
        feedButton.classList.add('close');
        await sleep(500);
        gameControls[0].classList.add('mobile-mode');
        gameControls[1].classList.add('mobile-mode');
    }

    if ((keyCode === 32 || keyCode === 38) && !dino.className.includes('jump')) {
        dino['src'] = './data/dino.png';
        dino.classList.add('jump');
        await sleep(500);
        if(dino.className.includes('jump')) {
            dino.classList.remove('jump');
            dino['src'] = './data/dino.png';
        }
    }

    else if(keyCode === 40) {
        dino.classList.remove('jump');
        duck = true;
    }
};

const keyUp = ({keyCode}) => {
    if(keyCode === 40)
        duck = false;
};

const newCact = () => {
    let rand;
    if(speed >= 2.5 || (speed <= 2.5 && score > 1000)) 
        rand = getRndInteger(2, 5) * 100 * speed ;

    else
        rand = getRndInteger(3, 5) * 100 * speed ;

    var cact = document.createElement("div");
    cact.classList.add('cact');
    setTimeout( () => {
        ground.appendChild(cact);
        cact.setAttribute('style', `animation: cact-move ${speed}s linear both;`);
        newCact();  
        setTimeout(() => {
            ground.removeChild(cact);
        }, 3500);
    }, rand);
};


// Main
higthScoreLabel.textContent = hScore.toString().padStart(5,"0");

setInterval(() => {
    spritesCounter = (spritesCounter === 1) ? 2 : 1;

    if(playing) {
        
        score++;
        const actualScore = score.toString().padStart(5,"0");
        scoreLabel.textContent = actualScore;

        if(hScore < score)
            higthScoreLabel.textContent = actualScore;

        if(duck)
            dino['src'] = `./data/dinoD${spritesCounter}.png`;

        else if(!dino.className.includes('jump'))
            dino['src'] = `./data/dinoR${spritesCounter}.png`;  

    }      
}, 100);

setInterval(() => {
    if(speed>=2.1 && playing) {
        speed -= 0.4;
        ground.setAttribute('style', `animation: ground-move ${speed}s infinite linear both;`);
    }
}, 10000);

setTimeout(() => {
    playButton.classList.add('floating');
    gameUI.classList.add('scale-in-center');
}, 1000);


// Events
window.addEventListener("keydown", keyDown);
gameUI.addEventListener("click", () => keyDown({keyCode: 32}));
window.addEventListener("keyup", keyUp);
playButton.addEventListener("click", () => {keyDown({keyCode: 32})});
gameControls[0].addEventListener("click", () => {keyDown({keyCode: 32})});
gameControls[1].addEventListener("touchstart", () => {keyDown({keyCode: 40})});
gameControls[1].addEventListener("touchend", () => {keyUp({keyCode: 40})});
