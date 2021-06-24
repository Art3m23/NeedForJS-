'use strict';

const MAX_ENEMY = 7;
let speed = 0;
let audio1 = new Audio(); 
let previousScore = [];
let arrSpeed = [];
const score = document.querySelector('.score'),
startPage = document.querySelector('.startPage'),
start = document.querySelector('.start'),
gameArea = document.querySelector('.gameArea'),
level = document.querySelector('.level'),
newGame = document.querySelector('.newGame'),
gameOver = document.querySelector('.gameOver'),
game = document.querySelector('.game'),
pause = document.querySelector('.pause'),
play = document.querySelector('.play'),
pauseImg = document.querySelector('.pauseImg'),
scoresave = document.querySelector('.scoresave'),
car = document.createElement('div');
car.classList.add('car');


start.addEventListener('click', Game);
pause.addEventListener('click', pauseGame);
play.addEventListener('click', returnGame);
newGame.addEventListener('click', fun1);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false,
};

const setting = {
    start: false,
    score: 0,
    traffic: 4
};

function getQuantityElements(heightElement) {
    return document.documentElement.clientHeight / heightElement + 1;
}

const getRandomEnemy = (max) => Math.floor((Math.random() * max) + 1);

function Game() {
    start.classList.add('hide');
    level.style.display = "inherit";
    newGame.style.display = "inherit";   
}

function fun1() {
    let rad = document.getElementsByName('level');
    for (var i=0;i<rad.length; i++) {
        if (rad[i].checked) {
            if(i === 0){
               speed = 4;
            }
            else if(i === 1){
               speed = 6;
            }
            else {
               speed = 8;
            }
            arrSpeed.push(speed);
            startGame();
        }
    }
}


function startGame(){
    pause.style.display = "inherit";
    gameArea.style.display = "inherit";
    scoresave.style.display = "";
    gameOver.style.display = "";
    level.style.display = "";
    newGame.style.display = "";
    gameArea.innerHTML = '';
    startPage.remove();
    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++){
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * i + 1;
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `
        transparent 
        url(./image/enemy${getRandomEnemy(MAX_ENEMY)}.png)  
        center / cover 
        no-repeat`;
        gameArea.appendChild(enemy);
    }
    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);
    car.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2;
    car.style.top = 'auto';
    car.style.bottom = '10px';
    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;
    soundGame();
    requestAnimationFrame(playGame);
}

function playGame(){
    setting.score += speed;
    score.innerHTML = 'SCORE<br>' + setting.score;
    moveRoad();
    moveEnemy();
    if (setting.start) {
        if (keys.ArrowLeft && setting.x > 0){
            setting.x -= speed;
        }
        if (keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)){
            setting.x += speed;
        }

        if (keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)){
            setting.y += speed;
        }

        if (keys.ArrowUp && setting.y > 0){
            setting.y -= speed;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);
    }
}

function startRun(event){
    event.preventDefault();
    keys[event.key] = true;
}

function stopRun(event){
    event.preventDefault();
    keys[event.key] = false;

}

function moveRoad() {
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line){
        line.y += speed;
        line.style.top = line.y + 'px';
        if(line.y >= document.documentElement.clientHeight) {
            line.y = -100;
        }
    });
}

function moveEnemy(){
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        if(carRect.top <= enemyRect.bottom && 
            carRect.right >= enemyRect.left && 
            carRect.left <= enemyRect.right && 
            carRect.bottom >= enemyRect.top) {
            soundClick();    
            setting.start = false;
            previousScore.push(setting.score);
            for( let j = arrSpeed.length-1 ; j >= 0; j--){
                for( let i = 0; i < arrSpeed.length; i++){
                    if(arrSpeed[j] != arrSpeed[i]) {
                        previousScore = [];
                        arrSpeed = [];
                    }
                }
            }
            audio1.pause();
            start.classList.remove('hide');
            start.style.top = score.offsetHeight;
            gameArea.style.display = "";
            gameOver.style.display = 'inherit';
            for( let i = 0; i < previousScore.length; i++){
                if(setting.score > previousScore[i]) {
                    scoresave.style.display = "inherit";
                }
            }
        }

        item.y += speed / 2;
        item.style.top = item.y + 'px';

        if(item.y >= document.documentElement.clientHeight){
            item.y = -100 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }

    });

}

function pauseGame() {
    setting.start = false;
    gameArea.style.opacity = '0';
    pauseImg.style.display = 'inherit';
    pause.style.display = "none";
    play.style.display = 'inherit';
    audio1.pause();
}

function returnGame() {
    setting.start = true;
    gameArea.style.opacity = '1';
    pauseImg.style.display = "";
    pause.style.display = "inherit";
    play.style.display = "";
    audio1.play();
    requestAnimationFrame(playGame);
}
function soundClick() {
    let audio = new Audio(); 
    audio.src = './audio/dtp.mp3'; 
    audio.autoplay = true; 
    audio.playbackRate = 3.0;
}    
function soundGame() {
    audio1.src = './audio/muzyka.mp3'; 
    audio1.autoplay = true; 
}
function soundStop() {
    let audio1 = new Audio(); 
    audio1.src = './audio/muzyka.mp3'; 
    audio1.autoplay = true; 
}