let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;

const main = document.querySelector('main');

//Player = 2, Wall = 1, Enemy = 3, Point = 0
const maze = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 0, 1, 0, 0, 0, 0, 3, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 1, 1, 0, 0, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 1, 1],
    [1, 0, 0, 1, 0, 3, 0, 0, 0, 1],
    [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
    [1, 3, 1, 0, 0, 0, 0, 0, 0, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
];

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

const player = document.querySelector('#player');
const playerMouth = player.querySelector('.mouth');
let playerTop = 0;
let playerLeft = 0;

// Collision Detection
setInterval(function() {
    if(downPressed == true) {
        let position = player.getBoundingClientRect() /*Get the Current location and store it in position*/
        let newBottom = position.bottom + 1; 

        let btmL = document.elementFromPoint(position.left, newBottom); 
        let btmR = document.elementFromPoint(position.left, newBottom);


        if (btmL.classList.contains('wall') == false && btmR.classList.contains('wall') == false) {  /* If btmL or btmR classlist contains 'wall' it is false (cannot move down) move player ++*/
            playerTop++;
            player.style.top = playerTop + 'px';
        }

        playerMouth.classList = 'down';
    }

    else if(upPressed == true) {
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

    else if(leftPressed == true) {
        let position = player.getBoundingClientRect();
        let newLeft = position.left - 1;

        let topLeft = document.elementFromPoint(newLeft, position.top);
        let bottomLeft = document.elementFromPoint(newLeft, position.bottom);

        if (topLeft.classList.contains('wall')== false && bottomLeft.classList.contains('wall') == false) {
            playerLeft--;
            player.style.left = playerLeft + 'px';
        }
        playerMouth.classList = 'left';
    }

    else if(rightPressed == true) {
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
    pointCheck()
}, 10);

// START BUTTON 
const startButton = document.querySelector('.start');

function startGame() {
    startButton.style.display = 'none';
    document.addEventListener('keydown', keyDown);
    document.addEventListener('keyup', keyUp);

    console.log('Game Started')
}

startButton.addEventListener('click', startGame)

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
    if (colourPicker.style.display === 'none') {
        colourPicker.style.display = 'block';
        closeside.textContent = '-';
    } else {
        colourPicker.style.display = 'none';
        closeside.textContent = '+'
    }
}

// Points Detection
let pointScoreTrack = 0;
const maxPoints = document.querySelectorAll('.point').length;
const collectedPoints = new Set();

function pointCheck() {
    const position = player.getBoundingClientRect();
    const points = document.querySelectorAll('.point');

    for (let i = 0; i < points.length; i++) {
        let pointPosition = points[i].getBoundingClientRect();

        if (
            position.right > pointPosition.left &&
            position.left < pointPosition.right &&
            position.bottom > pointPosition.top &&
            position.top < pointPosition.bottom &&
            !collectedPoints.has(points[i]) //only apply if hasnt been collected
        ) {
            pointScoreTrack++; //if not been collected +1 to score and update 
            document.querySelector('.score p').textContent = pointScoreTrack;

            collectedPoints.add(points[i]);
            if (collectedPoints.has(points[i])) { //add the new collected points
                points[i].classList.add('collected'); //to the css class collected (visibility hidden)

            if (pointScoreTrack === maxPoints) { //if the points were to == to the .length of the total points
                gameOver(); //run the game over function
            }

            if (pointScoreTrack % 5 === 0) { //COME BACK TO
                player.classList.add('pacPoints')
            }
        }
    }
}

// Game Over
function gameOver() {
    alert('game over');
    prompt('What is your Name? ')
}
}