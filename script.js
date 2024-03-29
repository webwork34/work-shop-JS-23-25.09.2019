const score     = document.querySelector('.score'),
      start     = document.querySelector('.start'),
      gameArea  = document.querySelector('.gameArea'),
      car       = document.createElement('div'),
      music     = document.createElement('embed');
    //   music     = document.createElement('audio');
      
let scoreLS;
if(localStorage.getItem('score')){
    scoreLS = +localStorage.getItem('score');
} else scoreLS = 0;
// console.log(scoreLS);

// music.setAttribute('src', './audio.mp3');
// music.setAttribute('type', 'audio/mp3');
// music.classList.add('music');


car.classList.add('car');

start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

let keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowRight: false,
    ArrowLeft: false
};

const setting = {
    start: false,
    score: 0,
    speed: 5,
    traffic: 3
};

function getQuantityElements(heightElemnt){
    return (gameArea.offsetHeight / heightElemnt) + 1;
};


function startGame(){

    if(localStorage.getItem('score')){
        scoreLS = +localStorage.getItem('score');
        keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowRight: false,
            ArrowLeft: false
        };
    } else scoreLS = 0;
    // console.log(scoreLS);

    start.classList.add('hide');
    gameArea.innerHTML = '';

    for (let i = 0; i < getQuantityElements(100); i++) {
        const line = document.createElement('div');
        line.classList.add('line');        
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 * setting.traffic); i++) {
        const enemy = document.createElement('div');
        let enemyImg = Math.floor(Math.random() * 2) + 1;
        enemy.classList.add('enemy');
        enemy.y = -100 * setting.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = `transparent url("./image/enemy${enemyImg}.png") center / cover no-repeat`;
        gameArea.appendChild(enemy);
    }

    setting.score = 0;
    setting.start = true;
    gameArea.appendChild(car);

    car.style.left = (gameArea.offsetWidth / 2) - (car.offsetWidth / 2);
    car.style.top = 'auto';
    car.style.bottom = '10px';
    score.innerHTML = 0;

    // gameArea.appendChild(music);

    // music.setAttribute('autoplay', true);
    // music.setAttribute('src', './audio.mp3');

    setting.x = car.offsetLeft;
    setting.y = car.offsetTop;

    requestAnimationFrame(playGame);
};



function playGame(){

    if(setting.start){
        setting.score += setting.speed;
        score.innerHTML = 'SCORE<br>' + setting.score;
        // console.log(setting.score);

        moveRoad();
        moveEnemy();
        if(keys.ArrowLeft && setting.x > 0){
            setting.x -= setting.speed;
        }
        if(keys.ArrowRight && setting.x < (gameArea.offsetWidth - car.offsetWidth)){
            setting.x += setting.speed;
        }

        if(keys.ArrowUp && setting.y > 0){
            setting.y -= setting.speed;
        }

        if(keys.ArrowDown && setting.y < (gameArea.offsetHeight - car.offsetHeight)){
            setting.y += setting.speed;
        }

        car.style.left = setting.x + 'px';
        car.style.top = setting.y + 'px';

        requestAnimationFrame(playGame);
    }
};


function startRun(e){
    e.preventDefault();
    keys[e.key] = true;
};

function stopRun(e){
    e.preventDefault();
    keys[e.key] = false;
};

function moveRoad(){
    let lines = document.querySelectorAll('.line');
    lines.forEach(function(line){
        line.y += setting.speed;
        line.style.top = line.y + 'px';

        if(line.y >= gameArea.offsetHeight){
            line.y = -100;
        }
    });
};

function moveEnemy(){
    let enemy = document.querySelectorAll('.enemy');

    enemy.forEach(function(item){

        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();

        if(carRect.top <= enemyRect.bottom &&
            carRect.right >= enemyRect.left &&
            carRect.left <= enemyRect.right &&
            carRect.bottom >= enemyRect.top){
                setting.start = false;    
                // console.warn('ДТП');
                start.classList.remove('hide');
                start.style.top = score.offsetHeight;

                setTimeout(function(){
                    if(setting.score - 1 > scoreLS){
                        alert('Рекорд побит. Новый рекорд = ' + setting.score);
                        localStorage.setItem('score', setting.score);
                    }
                }, 100);
        }

        

        item.y += setting.speed / 2;
        item.style.top = item.y + 'px';

        if(item.y >= gameArea.offsetHeight){
            item.y = -150 * setting.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    });

    
    
};