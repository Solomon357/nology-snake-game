import './style.css'

const player = document.querySelector<HTMLDivElement>('#player')!;
// const gameArea  = document.querySelector<HTMLElement>('.game-area')!;

//getting CSS styles 
const playerStyleTop = getComputedStyle(player).getPropertyValue('top')
const playerStyleLeft = getComputedStyle(player).getPropertyValue('left')
//output test
let currentXPosOutput = document.querySelector<HTMLParagraphElement>('#playerX')!;
let currentYPosOutput = document.querySelector<HTMLParagraphElement>('#playerY')!;
currentYPosOutput.innerHTML = `current Y position: ${playerStyleTop}`;
currentXPosOutput.innerHTML = `current X position: ${playerStyleLeft}`;



const moveUp = (YPosition: string | number): number => {
  YPosition = +YPosition - 20;
  return YPosition;
}
const moveDown = (YPosition: string | number): number => {
  YPosition = +YPosition + 20;
  return YPosition;
}
const moveLeft = (XPosition: string | number): number => {
  XPosition = +XPosition - 20;
  return XPosition;
}
const moveRight = (XPosition: string | number): number => {
  XPosition = +XPosition + 20;
  return XPosition;
}
const handlePlayerMovement = (e: KeyboardEvent) => {
  e.preventDefault(); // to prevent arrows scrolling the window up

  // "player.style.${attr}" is of type "CSSInlineStyle" so in order for this to work how I expect I need the top and left attributes of player to be inline styles beforehand
  let currentYPos: string | number = player.style.top;
  let currentXPos: string | number = player.style.left;

  currentYPos = currentYPos.replace("px", ""); // e.g. currentYPos = "20"
  currentXPos = currentXPos.replace("px", ""); // e.g. currentXPos = "0"

  //1. TRY LOOPING ANOTHER FUNCTION WITH EVENT INSIDE
  switch(e.key){
    case "ArrowUp":
      //need to check for both X and Y positions for all directions 
      if(+currentYPos >= 0 && +currentYPos <= 380 && +currentXPos >= 0 && +currentXPos <= 680){
        currentYPos = moveUp(currentYPos);
        player.style.top = `${currentYPos}px`;
        // console.log(player.style.top)
      } else{
        currentYPos = +currentYPos - 0;
        player.style.top = `${currentYPos}px`;
      }
      // show change to the user
      currentYPosOutput.innerHTML = `current Y position: ${player.style.top}`;
      break;

    case "ArrowDown":
      if(+currentYPos >= 0 && +currentYPos <= 380 && +currentXPos >= 0 && +currentXPos <= 680){
        currentYPos = moveDown(currentYPos);
        player.style.top = `${currentYPos}px`;
        // console.log(player.style.top);
        
      } else{
        currentYPos = +currentYPos + 0;
        player.style.top = `${currentYPos}px`;
      }
      // show change to the user regardless of conditional
      currentYPosOutput.innerHTML = `current Y position: ${player.style.top}`;
      break; 

    case "ArrowLeft":
      if(+currentXPos >= 0 && +currentXPos <= 680 && +currentYPos >= 0 && +currentYPos <= 380){
        currentXPos = moveLeft(currentXPos)
        player.style.left = `${currentXPos}px`;
        // console.log(player.style.left)
      } else {
        currentXPos = +currentXPos - 0;
        player.style.left = `${currentXPos}px`;
      }
      // show change to the user
      currentXPosOutput.innerHTML = `current X position: ${player.style.left}`;
      break; 

    case "ArrowRight":
      if(+currentXPos >= 0 && +currentXPos <= 680 && +currentYPos >= 0 && +currentYPos <= 380){
        currentXPos = moveRight(currentXPos) 
        player.style.left = `${currentXPos}px`;
        // console.log(player.style.left)
      } else {
        currentXPos = +currentXPos + 0;
        player.style.left = `${currentXPos}px`;
      }
      // show change to the user
      currentXPosOutput.innerHTML = `current X position: ${player.style.left}`;
      break;

    default:
      break;
  }
}

document.addEventListener("keydown", handlePlayerMovement);