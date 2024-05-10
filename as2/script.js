let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let lives = 2;


const main = document.querySelector('main');

// ======================================================================================================
//Player = 2, Wall = 1, Enemy = 3, Point = 0, solveablePath = 5
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 5, 1, 0, 0, 0, 5, 0, 1],
    [1, 0, 5, 0, 5, 5, 5, 5, 5, 1],
    [1, 0, 5, 5, 0, 0, 5, 5, 5, 1],
    [1, 0, 5, 1, 0, 0, 5, 5, 5, 1],
    [1, 0, 5, 0, 5, 5, 0, 1, 1, 1],
    [1, 0, 5, 1, 0, 5, 5, 5, 0, 1],
    [1, 5, 0, 0, 5, 0, 5, 5, 0, 1],
    [1, 5, 5, 5, 0, 0, 0, 5, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function randomMaze() {
    let row = Math.floor(Math.random() * maze.length);
    let column = Math.floor(Math.random() * maze[row].length);

    if (maze[row][column] == 0) {
        maze[row][column] = 1;
    }
    else {
        randomMaze();
    }
}

randomMaze();
randomMaze();
randomMaze();


let enemiesAdded = 3; //start from 3 for the starting number
function randomEnemy() {
    let row = Math.floor(Math.random() * maze.length);
    let column = Math.floor(Math.random() * maze[row].length);

    if (maze[row][column] == 0) {
        maze[row][column] = 3;
        enemiesAdded++;
    }
    else {
        randomEnemy();
    }
}

randomEnemy();
randomEnemy();
randomEnemy();

// ====================================================================================================== 
// Sound
let pacManSound = new Audio('pacman_beginning.mp3') //MAZE GAME SOUND
let deathSound = new Audio('pacman_death.mp3') //DEATH SOUND
let newLevelSound = new Audio('pacman_intermission.mp3') //NEW LEVEL SOUND
let hitSound = new Audio('Lost-life-sound-effect.mp3')

//Populates the maze in the HTML
for (let y of maze) {
    for (let x of y) {
        let block = document.createElement('div');
        block.classList.add('block');

        switch (x) {
            case 1:
                block.classList.add('wall');
                break;
            case 2:
                block.id = 'player';
                let mouth = document.createElement('div');
                mouth.classList.add('mouth');
                block.appendChild(mouth);
                break;
            case 3:
                block.classList.add('enemy');
                break;
            case 4:
                block.classList.add('powerUpImage')
            default:
                block.classList.add('point');
                block.style.height = '1vh';
                block.style.width = '1vh';
        }

        main.appendChild(block);
    }
}

// ======================================================================================================
//Player movement
function keyUp(event) {
    if (event.key === 'ArrowUp') {
        upPressed = false;
    } else if (event.key === 'ArrowDown') {
        downPressed = false;
    } else if (event.key === 'ArrowLeft') {
        leftPressed = false;
    } else if (event.key === 'ArrowRight') {
        rightPressed = false;
    }
}

function keyDown(event) {
    if (event.key === 'ArrowUp') {
        if (hitPause) return;
        upPressed = true;
    } else if (event.key === 'ArrowDown') {
        if (hitPause) return;
        downPressed = true;
    } else if (event.key === 'ArrowLeft') {
        if (hitPause) return;
        leftPressed = true;
    } else if (event.key === 'ArrowRight') {
        if (hitPause) return;
        rightPressed = true;
    }
}

//ENEMY MOVEMENT
let waitTillStartEnemyMove = false;
let enemies = document.querySelectorAll('.enemy');
const wallEdge = document.querySelectorAll('.wall');

function customEnemySpeed() {
    //New Line: https://stackoverflow.com/questions/1841452/new-line-in-javascript-alert-box
    // Ensure a valid number has been entered https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
    let speed = prompt('Enter the desired Speed for Enemies: 1-20. \n 1 - Fastest \n 20 - Slowest ');
    speed = parseInt(speed) //convert string to int

    if (isNaN(speed) || speed <= 0 || speed >= 21) {
        alert('Enter a valid number between 1-20.\n 1 - Fastest \n 20 - Slowest')
        customEnemySpeed();
    } else {
        enemySpeed(speed);
    }
}

function randomNumber() {
    return Math.floor(Math.random() * 4) + 1;
};
let direction = randomNumber();

function enemySpeed(speed) {
    setInterval(function moveEnemy() {
        if (!waitTillStartEnemyMove) return;
        enemies = document.querySelectorAll('.enemy');
    
        pacManSound.play(); //PLAY PACMAN SOUNDS
    
        enemies.forEach(enemy => {
            let enemyPos = enemy.getBoundingClientRect();
            let enemyTop = parseInt(enemy.style.top) || 0; //PARSE INT SO ITS NOT RETURNING A STRING!!!!
            let enemyLeft = parseInt(enemy.style.left) || 0;
            let direction = enemy.direction || randomNumber();
    
            switch (direction) {
                case 1: // MOVE DOWN
                    newBottom = enemyPos.bottom + 1;
                    btmL = document.elementFromPoint(enemyPos.left, newBottom);
                    btmR = document.elementFromPoint(enemyPos.right, newBottom);
    
                    let hitEnemyBottom = false;
                    for (const surrondingEnemy of enemies) {
                        if (surrondingEnemy !== enemy) {
                            let surrodningEnemyPos = surrondingEnemy.getBoundingClientRect();
                            if (enemyPos.left < surrodningEnemyPos.right &&
                                enemyPos.right > surrodningEnemyPos.left &&
                                newBottom < surrodningEnemyPos.top &&
                                enemyPos.top < surrodningEnemyPos.bottom) {
                                hitEnemyBottom = true;
                            }
                        }
                    };
    
                    if (!hitEnemyBottom && btmL.classList.contains('wall') == false && btmR.classList.contains('wall') == false) {
                        enemyTop++;
                    } else {
                        direction = randomNumber();
                    }
                    break;
    
                case 2: // MOVE UP
                    newTop = enemyPos.top - 1;
                    topL = document.elementFromPoint(enemyPos.left, newTop);
                    topR = document.elementFromPoint(enemyPos.right, newTop);
    
                    let hitEnemyTop = false;
                    for (const surrondingEnemy of enemies) {
                        if (surrondingEnemy !== enemy) {
                            let surrodningEnemyPos = surrondingEnemy.getBoundingClientRect();
                            if (enemyPos.left < surrodningEnemyPos.right &&
                                enemyPos.right > surrodningEnemyPos.left &&
                                newTop < surrodningEnemyPos.bottom &&
                                enemyPos.bottom > surrodningEnemyPos.top) {
                                hitEnemyTop = true;
                            }
                        }
                    };
                    if (!hitEnemyTop && topL.classList.contains('wall') == false && topR.classList.contains('wall') == false) {
                        enemyTop--;
                    } else {
                        direction = randomNumber();
                    }
                    break;
    
                case 3: // MOVE LEFT
                    newLeft = enemyPos.left - 1;
                    leftTop = document.elementFromPoint(newLeft, enemyPos.top);
                    leftBottom = document.elementFromPoint(newLeft, enemyPos.bottom);
    
                    let hitEnemyLeft = false;
                    for (const surrondingEnemy of enemies) {
                        if (surrondingEnemy !== enemy) {
                            let surrodningEnemyPos = surrondingEnemy.getBoundingClientRect();
                            if (enemyPos.top < surrodningEnemyPos.bottom &&
                                enemyPos.bottom > surrodningEnemyPos.top &&
                                newLeft < surrodningEnemyPos.right &&
                                enemyPos.right > surrodningEnemyPos.left) {
                                hitEnemyLeft = true;
                            }
                        }
                    };
                    if (!hitEnemyLeft && leftTop.classList.contains('wall') == false && leftBottom.classList.contains('wall') == false) {
                        enemyLeft--;
                    } else {
                        direction = randomNumber();
                    }
                    break;
    
                case 4: // MOVE RIGHT
                    newRight = enemyPos.right + 1;
                    rightTop = document.elementFromPoint(newRight, enemyPos.top);
                    rightBottom = document.elementFromPoint(newRight, enemyPos.bottom);
    
                    let hitEnemyRight = false;
                    for (const surrondingEnemy of enemies) {
                        if (surrondingEnemy !== enemy) {
                            let surrodningEnemyPos = surrondingEnemy.getBoundingClientRect();
                            if (enemyPos.top < surrodningEnemyPos.bottom &&
                                enemyPos.bottom > surrodningEnemyPos.top &&
                                newRight > surrodningEnemyPos.left &&
                                enemyPos.left < surrodningEnemyPos.right) {
                                hitEnemyRight = true;
                            }
                        }
                    };
                    if (!hitEnemyRight && rightTop.classList.contains('wall') == false && rightBottom.classList.contains('wall') == false) {
                        enemyLeft++;
                    } else {
                        direction = randomNumber();
                    }
                    break;
            }
    
            enemy.style.top = enemyTop + 'px';
            enemy.style.left = enemyLeft + 'px';
            enemy.direction = direction;
        });
    }, speed);
}

let player = document.querySelector('#player');
const playerMouth = player.querySelector('.mouth');
let playerTop = 0;
let playerLeft = 0;

// ======================================================================================================

function customPlayerSpeed() {
    //New Line: https://stackoverflow.com/questions/1841452/new-line-in-javascript-alert-box
    // Ensure a valid number has been entered https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/isNaN
    let speed = prompt('Enter the desired Speed for the Player: 1-20. \n 1 - Fastest \n 20 - Slowest ');
    speed = parseInt(speed) //convert string to int

    if (isNaN(speed) || speed <= 0 || speed >= 21) {
        alert('Enter a valid number between 1-20.\n 1 - Fastest \n 20 - Slowest')
        customPlayerSpeed();
    } else {
        playerSpeed(speed);
    }
}

// Collision Detection
function playerSpeed(speed) {

    return setInterval(function () {
        player = document.querySelector('#player');
        if (downPressed == true) {
            let position = player.getBoundingClientRect() /*Get the Current location and store it in position*/
            let newBottom = position.bottom + 2; /*to work out the location below we will + 1*/

            let btmL = document.elementFromPoint(position.left, newBottom);
            let btmR = document.elementFromPoint(position.right, newBottom);


            if (btmL.classList.contains('wall') == false && btmR.classList.contains('wall') == false) {  /* If btmL or btmR classlist contains 'wall' it is false (cannot move down) move player ++*/
                playerTop++;
                player.style.top = playerTop + 'px';
            }
            playerMouth.classList = 'down';
        }

        else if (upPressed == true) {
            let position = player.getBoundingClientRect();
            let newTop = position.top - 1;

            let topL = document.elementFromPoint(position.left, newTop);
            let topR = document.elementFromPoint(position.right, newTop);

            if (topL.classList.contains('wall') == false && topR.classList.contains('wall') == false) {
                playerTop--;
                player.style.top = playerTop + 'px';
            }
            playerMouth.classList = 'up';
        }

        else if (leftPressed == true) {
            let position = player.getBoundingClientRect();
            let newLeft = position.left - 1;

            let topLeft = document.elementFromPoint(newLeft, position.top);
            let bottomLeft = document.elementFromPoint(newLeft, position.bottom);

            if (topLeft.classList.contains('wall') == false && bottomLeft.classList.contains('wall') == false) {
                playerLeft--;
                player.style.left = playerLeft + 'px';
            }
            playerMouth.classList = 'left';
        }

        else if (rightPressed == true) {
            let position = player.getBoundingClientRect();
            let newRight = position.right + 1;

            let topRight = document.elementFromPoint(newRight, position.top);
            let bottomRight = document.elementFromPoint(newRight, position.bottom);

            if (topRight.classList.contains('wall') == false && bottomRight.classList.contains('wall') == false) {
                playerLeft++;
                player.style.left = playerLeft + 'px';
            }
            playerMouth.classList = 'right';
        }

        enemyCheck();
        pointCheck();
    }, speed);
};

// playerSpeed(10);
// customPlayerSpeed();
// playerSpeed();


// ======================================================================================================
// START, NEXT, AND, RESTART BUTTONS //

// START BUTTON 
const startButton = document.querySelector('.start');

function startGame() {
    customPlayerSpeed();
    customEnemySpeed();

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    waitTillStartEnemyMove = true;

    // //ARROW KEYS
    let leftButton = document.getElementById("lbttn");
    leftButton.addEventListener('mousedown', goleft)
    function goleft() {
        leftPressed = true;
    }

    let rightButton = document.getElementById("rbttn");
    rightButton.addEventListener('mousedown', goright)
    function goright() {
        rightPressed = true;
    }

    let upButton = document.getElementById("ubttn");
    upButton.addEventListener('mousedown', gotop)
    function gotop() {
        upPressed = true;
    }

    let downButton = document.getElementById("dbttn");
    downButton.addEventListener('mousedown', godown)
    function godown() {
        downPressed = true;
    }


    startButton.style.display = 'none';

    console.log('Game Started')
}

startButton.addEventListener('click', startGame)

// NEXT LEVEL
const nextButton = document.querySelector('.next');
nextButton.style.display = 'none';
let nextBtn = nextButton.addEventListener('click', nextLevel)

function nextLevel() {
    waitTillStartEnemyMove = false;
    playerTop = 0;
    playerLeft = 0;

    upPressed = false;
    downPressed = false;
    leftPressed = false;
    rightPressed = false;

    nextButton.style.display = 'flex';

    document.removeEventListener('keydown', keyDown);
    document.removeEventListener('keyup', keyUp);

    document.querySelector('.score p').textContent = pointScoreTrack;

    removeMaze();
    LevelMaxPoints();
    // moveEnemy();
}

// ======================================================================================================
function removeMaze() {
    document.querySelector('main').innerHTML = '';

    randomNextLevel();
}

let NewLevelMaxPoints = document.querySelectorAll('.point').length;
function LevelMaxPoints() {
    LevelMaxPoints = document.querySelectorAll('.point').length;
}
let randomWallTrack = 0

function randomNextLevel() {
    nextButton.style.display = 'none';
    // playerInvincibility = true;
    for (let y of maze) {
        for (let x of y) {
            let block = document.createElement('div');
            block.classList.add('block');

            switch (x) {
                case 1:
                    let wallCount = document.querySelectorAll('.wall')
                    if (wallCount.length >= 56) {
                        break;
                    } {
                        block.classList.add('wall');
                    }
                    break;
                case 2:
                    block.id = 'player';
                    let mouth = document.createElement('div');
                    mouth.classList.add('mouth');
                    block.appendChild(mouth);
                    break;
                case 3:
                    let enemeyCount = document.querySelectorAll('.enemy')
                    if (enemeyCount.length >= 5) {
                        break;
                    } {
                        block.classList.add('enemy');
                    }
                    break;
                default:
                    block.classList.add('point');
                    block.style.height = '1vh';
                    block.style.width = '1vh';
            }

            main.appendChild(block);
        }
    }

    randomWallTrack++

    if (randomWallTrack <= 10) {
        randomMaze();
    } else {
        console.log('wall limit reached')
    }
    
    startGame();
    moveEnemy();
    pointCheck();
}



// RESTART GAME
const restartButton = document.querySelector('.restart');
restartButton.style.display = 'none';
let restartBtn = restartButton.addEventListener('click', reloadBrowser)

function restartGame() {
    const enemies = document.querySelectorAll('.enemy');

    for (const enemy of enemies) {
        enemy.classList.remove('enemy');
    }

    waitTillStartEnemyMove = false;
    playerTop = 0;
    playerLeft = 0;

    upPressed = false;
    downPressed = false;
    leftPressed = false;
    rightPressed = false;

    restartButton.style.display = 'flex';
    document.removeEventListener('keydown', keyDown);
    document.removeEventListener('keyup', keyUp);
    player.classList.add('dead');

    topFiveLocalStorage();

    restartBtn.addEventListener('click', restartButton)
    reloadBrowser();
}

// GAME OVER
function gameOver() {
    waitTillStartEnemyMove = false;
    playerTop = 0;
    playerLeft = 0;

    upPressed = false;
    downPressed = false;
    leftPressed = false;
    rightPressed = false;

    alert('You Won! Game Over');

    document.removeEventListener('keydown', keyDown);
    document.removeEventListener('keyup', keyUp);

    player.classList.add('dead');

    topFiveLocalStorage();

    if (maxPoints === pointScoreTrack) { //if they won the level and the max points is === to the gathered points run next level as they won
        nextLevel();
    }
}

// ======================================================================================================
// LOCAL STORAGE
function updateLeaderboard() {
    let leaderboardElement = document.querySelector('.leaderboard ol');

    let existingScores = JSON.parse(localStorage.getItem('scores')) || [];
    existingScores.sort((a, b) => b[1] - a[1]);

    leaderboardElement.innerHTML = ''; //CLEAR ALL HTML INNER CONTENT
    existingScores.forEach(score => {
        let [playerName, playerScore] = score;
        let listItem = document.createElement('li');
        listItem.textContent = `${playerName}........${playerScore}`;
        existingScores[4] = listItem.style.colour = 'red';
        leaderboardElement.appendChild(listItem);
    });
}

// TOP 5 SCORES
function topFiveLocalStorage() {
    let playerName = sessionStorage.getItem('playerName');

    if (!playerName) {
        playerName = prompt('What is your Name? ');

        if (!playerName) { //If they dont enter a name, dont display/store score
            return;
        }

        sessionStorage.setItem('playerName', playerName);
    }

    let existingScores = JSON.parse(localStorage.getItem('scores')) || [];

    let playerIndex = existingScores.findIndex(score => score[0] === playerName); //IS PLAYER ALREADY IN THE ARRAY

    if (playerIndex !== -1) {
        if (pointScoreTrack > existingScores[playerIndex][1]) { //IF PPLAYER IS IN LEADERBOARD
            existingScores[playerIndex][1] = pointScoreTrack; // UPDATE THERE SCORE
        }
    } else {
        existingScores.push([playerName, pointScoreTrack]); //IF NOT IN LEADERBOARD PUSH THEM TO IT
    }

    // HIGH TO LOW SCORE AND DISPLAY TOP 5
    existingScores.sort((a, b) => b[1] - a[1]);
    existingScores = existingScores.slice(0, 5);
    localStorage.setItem('scores', JSON.stringify(existingScores)); //SET THE STRING TO BE AN INT ON EXISITINGSCORE

    updateLeaderboard();
}

document.addEventListener('DOMContentLoaded', function () {
    updateLeaderboard();
});


// RELOAD BROWSER
function reloadBrowser() {
    location.reload();
    sessionStorage.clear();
}

// ======================================================================================================
// UPDATE LIVES
function updateLives() {
    let totalLives = document.querySelectorAll('.lives li'); //select the css class for the lives 

    if (lives >= 0) { //if they lives are not = to or less than 0 run 
        lives--; //remove lives by 1
        console.log(lives);
    } else {
        console.log('Test');
    }
}

// ======================================================================================================
// Change Player Colour
const colours = document.querySelectorAll('.colours li');
const closeside = document.getElementById('closeside');
const colourPicker = document.getElementById('colourPicker')
const livesCount = document.getElementById('#lives li')

closeside.addEventListener('click', closeColourPicker)

colours.forEach(colour => {
    colour.addEventListener('click', setColour);
});

function setColour() {
    player.style.backgroundColor = this.id;
}

function closeColourPicker() {
    if (colourPicker.style.display === 'none') { //if pressed
        colourPicker.style.display = 'block';
        closeside.textContent = '-'; //if you are displaying change '+' to be '-' to imitate minimise button
    } else {
        colourPicker.style.display = 'none';
        closeside.textContent = '+' //if not displaying colour wheel display '+' to show open button for colours
    }
}

// ======================================================================================================
// ENEMY DETECTION
let playerInvincibility = false;
let hitPause = false;

function enemyCheck() {
    let position = player.getBoundingClientRect(); //GET PLAYER POSITION 
    const enemies = document.querySelectorAll('.enemy');

    if (playerInvincibility) return; //if already invincible break out of the loop to stop allowing potential always invincible bug to run

    for (const enemy of enemies) {
        const enemyPosition = enemy.getBoundingClientRect();

        if (
            position.right > enemyPosition.left &&
            position.left < enemyPosition.right &&
            position.bottom > enemyPosition.top &&
            position.top < enemyPosition.bottom
        ) {
            if (playerInvincibility == false) { //if not invincible add the 'hit' css class
                player.classList.add('hit');
                playerInvincibility = true; //player invinciblity = true now 
                hitSound.play();
                hitPause = true;
            }

            setTimeout(() => {
                player.classList.remove('hit');
                //playerInvincibility = false; //invincibility = false to break 
                hitPause = false;
            }, 1500); //1.5s iof invincibility 

            setTimeout(() => {
                playerInvincibility = false; //invincibility = false to break 
            }, 2000); //2s iof invincibility 


            if (lives <= 0) {  //if lives are less than or = to 0 run restartGame(); as they lost
                deathSound.play();
                restartGame();
            } else {
                removeLife();
                updateLives(); //otherwise updateLives();
            }
        }
    }
}

// ======================================================================================================
// Points Detection
let pointScoreTrack = 0; //let start of game score = 0 always;
let maxPoints = document.querySelectorAll('.point').length; //get the maximum points achiveable in the maze by selecting All '.point'.length and store it in maxPoints
function pointCheck() {
    const position = player.getBoundingClientRect(); //get player position
    let points = document.querySelectorAll('.point'); //select all with class with points

    if (points.length == 0) {
        newLevelSound.play()
        nextLevel();
        randomNextLevel();
    }

    for (let i = 0; i < points.length; i++) {
        let pos = points[i].getBoundingClientRect();
        if (position.right > pos.left &&
            position.left < pos.right &&
            position.bottom > pos.top &&
            position.top < pos.bottom
        ) {
            points[i].classList.remove('point');
            console.log('points Got')
            pointScoreTrack++;
            document.querySelector('.score p').textContent = pointScoreTrack;
        }
    }
};


function createLife() {
    const li = document.createElement('li');
    const ul = document.querySelector('.lives ul');
    ul.appendChild(li);
}

createLife();
createLife();
createLife();

function removeLife() {
    const li = document.querySelector('.lives ul li');
    li.parentNode.removeChild(li);
};

// playerInvincibility = true;

