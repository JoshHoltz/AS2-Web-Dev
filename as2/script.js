let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let lives = 2;


const main = document.querySelector('main');

//Player = 2, Wall = 1, Enemy = 3, Point = 0
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 0, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

function randomEnemy() {
    let row = Math.floor(Math.random() * maze.length);
    let column = Math.floor(Math.random() * maze[row].length);

    if (maze[row][column] == 0) {
        maze[row][column] = 3;
    }
    else {
        randomEnemy();
    }

}

randomEnemy(); 
randomEnemy(); 
randomEnemy(); 

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
            default:
                block.classList.add('point');
                block.style.height = '1vh';
                block.style.width = '1vh';
        }

        main.appendChild(block);
    }
}

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
        upPressed = true;
    } else if (event.key === 'ArrowDown') {
        downPressed = true;
    } else if (event.key === 'ArrowLeft') {
        leftPressed = true;
    } else if (event.key === 'ArrowRight') {
        rightPressed = true;
    }
}

//ENEMY MOVEMENT
const enemies = document.querySelectorAll('.enemy');
const wallEdge = document.querySelectorAll('.wall');
// let enemyTop = 0;
// let enemyLeft = 0;

function randomNumber() {
    return Math.floor(Math.random() * 4) + 1;
};
let direction = randomNumber();

setInterval(function moveEnemy() {
    enemies.forEach(enemy => {
        let enemyPos = enemy.getBoundingClientRect();
        let newDirection = randomNumber(); 
        let enemyTop = 0;
        let enemyLeft = 0;
        // let newDirection = 1;
        // console.log(newDirection);

        switch(newDirection) {
            case 1: //MOVE DOWN
                let newBottom = enemyPos.bottom + 1;
                let btmL = document.elementFromPoint(enemyPos.left, newBottom);
                let btmR = document.elementFromPoint(enemyPos.right, newBottom);

                // console.log('btmL:', btmL);
                // console.log('btmR:', btmR);
                        
                if (btmL.classList.contains('wall') && btmR.classList.contains('wall')) {
                    enemyTop++; 
                    enemy.style.top = enemyTop + 'px'; 
                } else {
                    enemyTop--;
                    enemy.style.top = enemyTop + 'px';
                }
                break;

            case 2: //MPVE UP
                let newTop = enemyPos.top - 1;
                let topL = document.elementFromPoint(enemyPos.left, newTop);
                let topR = document.elementFromPoint(enemyPos.right, newTop);

                if (topL.classList.contains('wall') == false && topR.classList.contains('wall') == false) { 
                    enemyTop--; 
                    enemy.style.top = enemyTop + 'px'; 
                } else {
                    enemyTop++;
                    enemy.style.top = enemyTop + 'px';
                }
                break;
            
            case 3: //LEFT
                let newLeft = enemyPos.left - 1; 
                let topLeft = document.elementFromPoint(newLeft, enemyPos.top);
                let topRight = document.elementFromPoint(newLeft, enemyPos.bottom);
        
                if (topLeft.classList.contains('wall') == false && topRight.classList.contains('wall') == false) { 
                    enemyLeft--;
                    enemy.style.left = enemyLeft + 'px'; 
                } else {
                    enemyLeft++;
                    enemy.style.left = enemyLeft + 'px';
                }
                break;
            
            case 4: //RIGHT
                let newRight = enemyPos.right + 1; 
                let rightTop = document.elementFromPoint(newRight, enemyPos.top);
                let rightBottom = document.elementFromPoint(newRight, enemyPos.bottom);
            
                if (rightTop.classList.contains('wall') === false && rightBottom.classList.contains('wall') === false) { 
                    enemyLeft++; 
                    enemy.style.left = enemyLeft + 'px'; 
                } else {
                    enemyLeft--;
                    enemy.style.left = enemyLeft + 'px';
                }
                break;
        }
    });
}, 10); 

const player = document.querySelector('#player');
const playerMouth = player.querySelector('.mouth');
let playerTop = 0;
let playerLeft = 0;

// Collision Detection
setInterval(function () {
    if (downPressed == true) {
        let position = player.getBoundingClientRect() /*Get the Current location and store it in position*/
        let newBottom = position.bottom + 1; /*to work out the location below we will + 1*/

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

    // moveEnemy();

    // randomEnemy();


}, 10);

// START, NEXT, AND, RESTART BUTTONS //

// START BUTTON 
const startButton = document.querySelector('.start');

function startGame() {

    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    //ARROW KEYS
    document.querySelector('#ubttn').addEventListener('mousedown', function () {
        upPressed = true;
    });

    document.querySelector('#ubttn').addEventListener('mouseup', function () {
        upPressed = false;
    });

    document.querySelector('#dbttn').addEventListener('mousedown', function () {
        downPressed = true;
    });

    document.querySelector('#dbttn').addEventListener('mouseup', function () {
        downPressed = false;
    });

    document.querySelector('#lbttn').addEventListener('mousedown', function () {
        leftPressed = true;
    });

    document.querySelector('#lbttn').addEventListener('mouseup', function () {
        leftPressed = false;
    });

    document.querySelector('#rbttn').addEventListener('mousedown', function () {
        rightPressed = true;
    });

    document.querySelector('#rbttn').addEventListener('mouseup', function () {
        rightPressed = false;
    });

    startButton.style.display = 'none';

    // setInterval(moveEnemy, 50000);

    console.log('Game Started')
}

startButton.addEventListener('click', startGame)

// NEXT LEVEL
const nextButton = document.querySelector('.next');
nextButton.style.display = 'none';
let nextBtn = nextButton.addEventListener('click', reloadBrowser)

function nextLevel() {

    nextButton.style.display = 'flex';

    document.removeEventListener('keydown', keyDown);
    document.removeEventListener('keyup', keyUp);

    nextBtn.addEventListener('click', restartButton)
    reloadBrowser();
}

// RESTART GAME
const restartButton = document.querySelector('.restart');
restartButton.style.display = 'none';
let restartBtn = restartButton.addEventListener('click', reloadBrowser)

function restartGame() {
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
    alert('You Won! Game Over');

    let upPressed = false;
    let downPressed = false;
    let leftPressed = false;
    let rightPressed = false;

    document.removeEventListener('keydown', keyDown);
    document.removeEventListener('keyup', keyUp);

    player.classList.add('dead');

    topFiveLocalStorage();

    if (maxPoints === pointScoreTrack) { //if they won the level and the max points is === to the gathered points run next level as they won
        nextLevel();
    }
}

// LOCAL STORAGE 
function topFiveLocalStorage() {
    let playerName = prompt('What is your Name? ');

    let scoreTrack = {
        playerName: playerName,
        score: pointScoreTrack
    };

    let scoreTrackJSON = JSON.stringify(scoreTrack); //Convert the int (pointScoreTrack) into str as localStorage can only store str's
    localStorage.setItem('gameScore', scoreTrackJSON);

    console.log(scoreTrackJSON);
}

// RELOAD BROWSER
function reloadBrowser() {
    location.reload();
}

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

// ENEMY DETECTION
let playerInvincibility = false;

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
            }

            setTimeout(() => {
                player.classList.remove('hit');
                playerInvincibility = false; //invincibility = false to break 
            }, 3000); //3s iof invincibility 

            if (lives <= 0) {  //if lives are less than or = to 0 run restartGame(); as they lost
                restartGame();
            } else {
                removeLife();
                updateLives(); //otherwise updateLives();
            }
        }
    }
}

// Points Detection
let pointScoreTrack = 0; //let start of game score = 0 always;
const maxPoints = document.querySelectorAll('.point').length; //get the maximum points achiveable in the maze by selecting All '.point'.length and store it in maxPoints
// const collectedPoints = new Set();

// function pointCheck() {
//     const position = player.getBoundingClientRect(); //GET PLAYER POSITION 
//     const points = document.querySelectorAll('.point');

//     for (let i = 0; i < points.length; i++) {
//         let pointPosition = points[i].getBoundingClientRect();

//         // if (
//         //     position.right > pointPosition.left &&
//         //     position.left < pointPosition.right &&
//         //     position.bottom > pointPosition.top &&
//         //     position.top < pointPosition.bottom &&
//         //     !collectedPoints.has(points[i]) //if point hasnt been collected you can run, otherwise do not 
//         // ) {
//         //     pointScoreTrack++; //if not been collected +1 to score and update 
//         //     document.querySelector('.score p').textContent = pointScoreTrack;

//         collectedPoints.add(points[i]);
//         if (collectedPoints.has(points[i])) { //add the new collected points
//             points[i].classList.add('collected'); //to the css class collected (visibility hidden)

//             if (pointScoreTrack === maxPoints) { //if the points were to == to the .length of the total points
//                 gameOver(); //run the game over function
//                 // nextLevel();
//             }

//             if (pointScoreTrack % 5 === 0) { //COME BACK TO
//                 // player.classList.add('hit')
//             }
//         }
//     }
// }

function pointCheck() {
    const position = player.getBoundingClientRect(); //get player position
    const points = document.querySelectorAll('.point'); //select all with class with points

    for (let i = 0; i < points.length; i++) {
        let pos = points[i].getBoundingClientRect();
        if (position.right > pos.left &&
            position.left < pos.right &&
            position.bottom > pos.top &&
            position.top < pos.bottom
        ) {
            points[i].classList.remove('point');
            pointScoreTrack++;
            document.querySelector('.score p').textContent = pointScoreTrack;


            if (pointScoreTrack === maxPoints) { //if the points were to == to the .length of the total points
                gameOver(); //run the game over function
                // nextLevel();
            }
        }
    }
}

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
}
