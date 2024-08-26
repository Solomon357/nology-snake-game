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


const handlePlayerMovement1 = (e: KeyboardEvent) => {
  e.preventDefault(); // to prevent arrows scrolling the window up

  // "player.style.${attr}" is of type "CSSInlineStyle" so in order for this to work how I expect I need the top and left attributes of player to be inline styles beforehand
  let currentYPos: string | number = player.style.top;
  let currentXPos: string | number = player.style.left;

  // if(+currentXPos < 0 || +currentXPos > 680 ){
  //    // run the game over functionality
  //     return;
  // }

  currentYPos = currentYPos.replace("px", ""); // e.g. currentYPos = "20"
  currentXPos = currentXPos.replace("px", ""); // e.g. currentXPos = "0"

  switch(e.key){
    case "ArrowUp":
      currentYPos = +currentYPos - 20;
      player.style.top = `${currentYPos}px`;
      // console.log(player.style.top)
      // show change to the user
      currentYPosOutput.innerHTML = `current Y position: ${player.style.top}`;
      break;

    case "ArrowDown":
      currentYPos = +currentYPos + 20;
      player.style.top = `${currentYPos}px`;
      // console.log(player.style.top);
      // show change to the user
      currentYPosOutput.innerHTML = `current Y position: ${player.style.top}`;
      break; 

    case "ArrowLeft":
      currentXPos = +currentXPos - 20 
      player.style.left = `${currentXPos}px`;
      // console.log(player.style.left)
      // show change to the user
      currentXPosOutput.innerHTML = `current X position: ${player.style.left}`;
      break; 

    case "ArrowRight":
      currentXPos = +currentXPos + 20 
      player.style.left = `${currentXPos}px`;
      // console.log(player.style.left)
      // show change to the user
      currentXPosOutput.innerHTML = `current X position: ${player.style.left}`;
      break; 

    default:
      break;
  }
}

document.addEventListener("keydown", handlePlayerMovement1);