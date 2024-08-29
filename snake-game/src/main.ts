import './style.css'

const player = document.querySelector<HTMLDivElement>('#player')!;
// const gameArea  = document.querySelector<HTMLElement>('.game-area')!;

//getting CSS styles 
const playerStyleTop = getComputedStyle(player).getPropertyValue('top')
const playerStyleLeft = getComputedStyle(player).getPropertyValue('left')

//visual output test
let currentXPosOutput = document.querySelector<HTMLParagraphElement>('#playerX')!;
let currentYPosOutput = document.querySelector<HTMLParagraphElement>('#playerY')!;
currentYPosOutput.innerHTML = `current Y position: ${playerStyleTop}`;
currentXPosOutput.innerHTML = `current X position: ${playerStyleLeft}`;

//Interval ID to make sure only one interval is running at a time
let intervalId: number;

// TODO: 1. need to fix the container issue that I didnt have before 
//        - WILL PROBABLY NEED ANOTHER FUNCTION TO HANDLE any GAMEOVER condition
//       2. will need to incorporate food pellets and a score system
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
    player.style.top = `${XPosition}px`;
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
    player.style.top = `${XPosition}px`;
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
      debugger;
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