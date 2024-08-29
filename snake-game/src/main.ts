import './style.css';

// TODO: 1. WILL PROBABLY NEED ANOTHER FUNCTION TO HANDLE any GAMEOVER condition
//       2. will need to incorporate food pellets moving on player overlap and score system 

const player = document.querySelector<HTMLDivElement>('#player')!;

//getting CSS styles 
const playerStyleTop = getComputedStyle(player).getPropertyValue('top')
const playerStyleLeft = getComputedStyle(player).getPropertyValue('left')

const gameArea  = document.querySelector<HTMLElement>('.game-area')!;
const food = document.createElement("div");

//all my food attributes will go below
food.id = "food";
food.style.position = "relative";
food.style.width = "20px";
food.style.height = "20px";
food.style.background = "red";
food.style.zIndex = "-1";

// gets a random multiple of 20 between 0 and max range
// probably a more efficient way of doing this because 
// worst case is extremely inefficient but this is my solution for now
const getRandomNumber = (max: number, increment: number): number => {

  let randomNumber = Math.floor(Math.random()* max)
  
  if(randomNumber % increment === 0 || randomNumber === 0){
    return randomNumber
  }
  
  return getRandomNumber(max, increment);
}

//I want food to move to a new random space if player and food are in the same place
const moveFood = () => {
  let foodPlacementX = getRandomNumber(680, 20);
  let foodPlacementY = getRandomNumber(380, 20);

  food.style.left = `${foodPlacementX}px`;
  food.style.top = `${foodPlacementY}px`;
}

//food is always moved on initial load
moveFood();

//make sure the food never overlaps with the player on start

//THIS CHECK WILL BE FOR FOOD PELLET MOVEMENT
if(food.style.left === player.style.left && food.style.top === player.style.top){
  //can forsee food being outside of game area, need another if inside that checks boundries
  //food.style.left = `${foodPlacementX + 20}px`
  moveFood();
}
//only append to the DOM once all initial attributes are set
gameArea.appendChild(food)
//visual output test
let currentXPosOutput = document.querySelector<HTMLParagraphElement>('#playerX')!;
let currentYPosOutput = document.querySelector<HTMLParagraphElement>('#playerY')!;
//let score = document.querySelector<HTMLParagraphElement>('#score')!;

currentYPosOutput.innerHTML = `current Y position: ${playerStyleTop}`;
currentXPosOutput.innerHTML = `current X position: ${playerStyleLeft}`;


//Interval ID to make sure only one interval is running at a time
let intervalId: number;

// const gameOver = () => {

// }
// all directions need to check for both X and Y positions so no 
const handleMoveUp = (XPosition: string | number, YPosition: string | number) => {
  
  if(+YPosition >= 0 && +YPosition <= 380 && +XPosition >= 0 && +XPosition <= 680){
    YPosition = +YPosition - 20;
    player.style.top = `${YPosition}px`;
    // console.log(player.style.top)
  } else{
    clearInterval(intervalId);
    player.style.top = `${YPosition}px`;
  }
  return YPosition;
}

const handleMoveDown = (XPosition:string | number, YPosition: string | number) => {
  if(+YPosition >= 0 && +YPosition <= 380 && +XPosition >= 0 && +XPosition <= 680){
    YPosition = +YPosition + 20;
    player.style.top = `${YPosition}px`;
    // console.log(player.style.top)
  } else{
    clearInterval(intervalId);
    player.style.top = `${YPosition}px`;
  }
  return YPosition;
}

const handleMoveLeft = (XPosition: string | number, YPosition: string | number) => {
  if(+XPosition >= 0 && +XPosition <= 680 && +YPosition >= 0 && +YPosition <= 380){
    XPosition = +XPosition - 20;
    player.style.left = `${XPosition}px`;
  } else {
    //clean up interval 
    clearInterval(intervalId);
    player.style.left = `${XPosition}px`;
  }
  return XPosition;
}

const handleMoveRight = (XPosition: string | number, YPosition: string | number) => {
  if(+XPosition >= 0 && +XPosition <= 680 && +YPosition >= 0 && +YPosition <= 380){
    XPosition = +XPosition + 20;
    player.style.left = `${XPosition}px`;
    // console.log(player.style.top)
  } else{
    clearInterval(intervalId);
    player.style.left = `${XPosition}px`;
  }
  return XPosition;
}

const handlePlayerMovement = (e: KeyboardEvent) => {
  e.preventDefault(); // to prevent arrows scrolling the window up
  e.stopPropagation(); //not sure if i need this just yet
  // "player.style.${attr}" is of type "CSSInlineStyle" so in order for this to work how I expect I need the top and left attributes of player to be inline styles beforehand
  let currentYPos: string | number = player.style.top;
  let currentXPos: string | number = player.style.left;

  currentYPos = currentYPos.replace("px", ""); // e.g. currentYPos = "20"
  currentXPos = currentXPos.replace("px", ""); // e.g. currentXPos = "0"

  switch(e.key){
    case "ArrowUp":
      // making sure the last interval is cleared before setting a new one 
      clearInterval(intervalId);

      intervalId = setInterval(() => {
        currentYPos = handleMoveUp(currentXPos, currentYPos);
        // show change to the user
        currentYPosOutput.innerHTML = `current Y position: ${player.style.top}`;
      }, 100);
      break;

    case "ArrowDown":
      clearInterval(intervalId);

      intervalId = setInterval(() => {
        currentYPos = handleMoveDown(currentXPos, currentYPos);
        // show change to the user regardless of conditional
        currentYPosOutput.innerHTML = `current Y position: ${player.style.top}`;
      }, 100);
      break; 

    case "ArrowLeft":
      //debugger;
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        currentXPos = handleMoveLeft(currentXPos, currentYPos);
         //show change to the user
        currentXPosOutput.innerHTML = `current X position: ${player.style.left}`;
      }, 100);
      break; 

    case "ArrowRight":
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        currentXPos = handleMoveRight(currentXPos, currentYPos);
        // show change to the user
        currentXPosOutput.innerHTML = `current X position: ${player.style.left}`;
      }, 100);
      break;

    default:
      break;
  }
}


document.addEventListener("keydown", handlePlayerMovement);