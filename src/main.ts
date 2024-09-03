import './style.css';
// TODO:
//       1. styling + music
//       2. implement highScore

//  QUALITY OF LIFE THINGS TO DEAL WITH after deadline:
//  - fix bug where player can pause when player holds key down
//  - further refine movement so user input is very responsive
//  - create game modes that work
//  - be able to change theme
//  - if somehow the snake length is equal to grid area width*height then GAMEWIN condition is met

//access to HTML elements
const player = document.querySelector<HTMLDivElement>('#player')!;
const food = document.querySelector<HTMLDivElement>('#food')!;
const gameOverScreen = document.querySelector<HTMLDivElement>('#gameOverScreen')!;
const OutofBoundsScreen = document.querySelector<HTMLDivElement>('#OutOfBoundsScreen')!;
const gameArea = document.querySelector<HTMLElement>('.game-area')!;
const snakeNodeList = document.querySelectorAll<HTMLDivElement>(".snake-body");

//need to convert the nodeList to an array to use real array methods
//because you can't use array.push in a NodeList
const snakeNodeArr: HTMLDivElement[] = [];
for(const elem of snakeNodeList){
  snakeNodeArr.push(elem)
}
//console.log(snakeNodeList)
//console.log(snakeNodeArr)

//visual output tests
// let currentXPosOutput = document.querySelector<HTMLParagraphElement>('#playerX')!;
// let currentYPosOutput = document.querySelector<HTMLParagraphElement>('#playerY')!;
// const playerStyleTop = getComputedStyle(player).getPropertyValue('top')
// const playerStyleLeft = getComputedStyle(player).getPropertyValue('left')
// currentYPosOutput.innerHTML = `current Y position: ${playerStyleTop}`;
// currentXPosOutput.innerHTML = `current X position: ${playerStyleLeft}`;

// ALL GLOBAL VARIABLES
let score = document.querySelector<HTMLParagraphElement>('#score')!;
let scoreOutput: number = 0;
let isGrowSnake: boolean = false;
let movementIntervalId: number; //Interval ID is needed to make sure multiple intervals dont interfere with each other

// ALL FUNCTIONS 

// gets a random multiple of 20 between 0 and max range
// * probably a more efficient way of doing this because 
//   worst case is extremely inefficient but this is my solution for now
const getRandomNumber = (max: number, increment: number): number => {
  let randomNumber = Math.floor(Math.random()* max)
  
  if(randomNumber % increment === 0 || randomNumber === 0){
    return randomNumber;
  }
  return getRandomNumber(max, increment);
}

//I want food to move to a new random space if player and food are in the same place
const moveFood = () => {
  let foodPlacementX = getRandomNumber(680, 20);
  let foodPlacementY = getRandomNumber(380, 20);

  food.style.left = `${foodPlacementX}px`;
  food.style.top = `${foodPlacementY}px`;
  //going through all current snake segments and checking their positions
  for(const snakeSegment of snakeNodeArr){
    if(food.style.left === snakeSegment.style.left && food.style.top === snakeSegment.style.top){
      //**between this recursive call and getRandomNumber the potential for game speed loss is very high */
      return moveFood();
    }
  }
  //if we make it this far then food is where it should be so do nothing
}

const handleGameOver = (typeOfLoss: string, isGrowSnake: boolean): void => {
  if(typeOfLoss === "OutOfBounds"){
    document.removeEventListener('keydown', handlePlayerMovement)
    player.style.background = "grey";
    //then trigger a pop up saying game over
    OutofBoundsScreen.style.display = "block";
    //if grow snake is not the reason for selfCollision then I really ran into myself, so run the code below
  } else if(typeOfLoss === "SelfCollision" && !isGrowSnake){
    document.removeEventListener('keydown', handlePlayerMovement)
    gameOverScreen.style.display = "block";
    player.style.background = "grey";
  }

  //if im here that means growSnake() was the reason this function fired, so false alarm do nothing
}

//ALL THE MOVE FUNCTIONS WITH THE EXCEPTION OF PLAYERMOVE ARE THE EXACT SAME LOGIC 

const handleMoveUp = (XPosition: number, YPosition: number, currentIndex:number = 0 ) => {
  //debugger;
  //need an initial snapshot of where exactly this block should move to
  let yOldSnapShot: number = YPosition;
  let xOldSnapShot: number = XPosition;
  //need a new snapshot as soon as we access the next block so the next block now where to move to
  let yNewSnapshot: number;
  let xNewSnapshot: number;

  let newYPosition = YPosition - 20; // moving the head of the snake

  if(YPosition >= 0 && YPosition <= 380 && XPosition >= 0 && XPosition <= 680){
    //I only really want to change the direction of the snake head based off the new Position
    snakeNodeArr[currentIndex].style.top = `${newYPosition}px`;
    snakeNodeArr[currentIndex].style.left = `${XPosition}px`;
    //we want all other blocks to copy the x and y pos of the prev block, so we need an updated snapshot here before we change the position of the blocks
    for(let i = 1; i < snakeNodeArr.length; i++){
      //get current snapshot of present block
      yNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('top').replace("px", "");
      xNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('left').replace("px", "")
      //move the current snake to the old snapshot of the previous
      snakeNodeArr[i].style.top = `${yOldSnapShot}px`;
      snakeNodeArr[i].style.left = `${xOldSnapShot}px`;
      //update the old snapshots with the new snapshots for the next loop
      xOldSnapShot = xNewSnapshot;
      yOldSnapShot = yNewSnapshot;
    }
  } else{
    clearInterval(movementIntervalId);
    handleGameOver("OutOfBounds", false);
  }
  return newYPosition;
}

const handleMoveDown = (XPosition: number, YPosition: number, currentIndex: number = 0) => {
  let yOldSnapShot: number = YPosition;
  let xOldSnapShot: number = XPosition;
  let yNewSnapshot: number;
  let xNewSnapshot: number;

  let newYPosition: number = YPosition + 20;

  if(YPosition >= 0 && YPosition <= 380 && XPosition >= 0 && XPosition <= 680){
    snakeNodeArr[currentIndex].style.top = `${newYPosition}px`;
    snakeNodeArr[currentIndex].style.left = `${XPosition}px`;

    for(let i = 1; i < snakeNodeArr.length; i++){
      yNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('top').replace("px", "");
      xNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('left').replace("px", "");

      snakeNodeArr[i].style.top = `${yOldSnapShot}px`;
      snakeNodeArr[i].style.left = `${xOldSnapShot}px`;
 
      xOldSnapShot = xNewSnapshot;
      yOldSnapShot = yNewSnapshot;
    }
  } else{
    clearInterval(movementIntervalId);
    handleGameOver("OutOfBounds" ,false);
  }
  return newYPosition;
}

const handleMoveLeft = (XPosition: number, YPosition: number, currentIndex: number = 0) => {
  let xOldSnapShot: number = XPosition;
  let yOldSnapShot: number = YPosition;
  let xNewSnapshot: number;
  let yNewSnapshot: number;

  let newXPosition = XPosition - 20;

  if(XPosition >= 0 && XPosition <= 680 && YPosition >= 0 && YPosition <= 380){
    snakeNodeArr[currentIndex].style.top = `${YPosition}px`;
    snakeNodeArr[currentIndex].style.left = `${newXPosition}px`;

    for(let i = 1; i < snakeNodeArr.length; i++){
      yNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('top').replace("px", "");
      xNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('left').replace("px", "")

      snakeNodeArr[i].style.top = `${yOldSnapShot}px`;
      snakeNodeArr[i].style.left = `${xOldSnapShot}px`;

      xOldSnapShot = xNewSnapshot;
      yOldSnapShot = yNewSnapshot;
    }
  } else {
    clearInterval(movementIntervalId);
    handleGameOver("OutOfBounds", false)
  }
  return newXPosition;
}

const handleMoveRight = (XPosition: number, YPosition: number, currentIndex: number = 0) => {
  let xOldSnapShot: number = XPosition;
  let yOldSnapShot: number = YPosition;
  let xNewSnapshot: number;
  let yNewSnapshot: number;

  let newXPosition = XPosition + 20;

  if(XPosition >= 0 && XPosition <= 680 && YPosition >= 0 && YPosition <= 380){
    snakeNodeArr[currentIndex].style.top = `${YPosition}px`;
    snakeNodeArr[currentIndex].style.left = `${newXPosition}px`;

    for(let i = 1; i < snakeNodeArr.length; i++){
      yNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('top').replace("px", "");
      xNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('left').replace("px", "")

      snakeNodeArr[i].style.top = `${yOldSnapShot}px`;
      snakeNodeArr[i].style.left = `${xOldSnapShot}px`;

      xOldSnapShot = xNewSnapshot;
      yOldSnapShot = yNewSnapshot;
    }
  } else{
    clearInterval(movementIntervalId);
    handleGameOver("OutOfBounds", false);
  }
  return newXPosition;
}

const growSnake = () => {
  isGrowSnake = true; //I need an exception to self collison of when we're growing snake after eating food

  let newSnakeElement = document.createElement("div");
  newSnakeElement.className = "snake-body";
  let newXPos = +snakeNodeArr[snakeNodeArr.length-1].style.left.replace("px", "")
  let newYPos = +snakeNodeArr[snakeNodeArr.length-1].style.top.replace("px", "")
  newSnakeElement.style.left = `${newXPos}px`
  newSnakeElement.style.top = `${newYPos}px`

  snakeNodeArr.push(newSnakeElement);
  gameArea.appendChild(newSnakeElement)
}

const handlePlayerFoodCollision = () => {
  if(food.style.left === player.style.left && food.style.top === player.style.top){
    scoreOutput += 20;
    score.innerHTML = `score: ${scoreOutput}`;
    growSnake();
    moveFood();
  }
}

const handleSelfCollision = (arr: HTMLDivElement[]) => {
  //because its impossible to collide with myself if snake.length is less than 5 
  if(arr.length < 5){
    return;
  }

  let XPos = snakeNodeArr[0].style.left;
  let YPos = snakeNodeArr[0].style.top;
  //i = 2 because block 3 is the closest block you can collide with yourself 
  for(let i = 2; i < arr.length; i++){
    if(XPos === arr[i].style.left && YPos === arr[i].style.top){
      clearInterval(movementIntervalId)
      handleGameOver("SelfCollision", isGrowSnake);
    }
  }
  //reset isGrowSnake back to false (not sure if i need this reset)
  isGrowSnake = false;
}

moveFood(); //food is always moved on initial load
let lastMove: string = "";
//will implement this after deadline for refined movement
//let movementQueue: string[] = [];

const handlePlayerMovement = (e: KeyboardEvent) => {
  e.preventDefault(); // to prevent arrows scrolling the window up
  //e.stopPropagation();
  //"player.style.${attr}" is of type "CSSInlineStyle" so in order for this to work how I 
  //expect I need the top and left attributes of player to be inline styles beforehand
  let currentYPos: string | number = snakeNodeArr[0].style.top;
  let currentXPos: string | number = snakeNodeArr[0].style.left;

  currentYPos = currentYPos.replace("px", ""); // e.g. currentYPos = "20"
  currentXPos = currentXPos.replace("px", ""); // e.g. currentXPos = "0"

  switch(e.key){

    case "w":
    case "ArrowUp":
      //if the last key I pressed is in the opposite direction of where I'm trying to move i want to just keep moving
      if(lastMove === "ArrowDown" || lastMove === "s"){
        console.log("cant move there mate") // test
        break;
      } else {
        lastMove = e.key;
        // console.log(lastMove) // test
        // ALWAYS make sure the last interval is cleared before setting a new one
        clearInterval(movementIntervalId);
        movementIntervalId = setInterval(() => { //setInterval is how i can get multiple movements with one keypress
          currentYPos = handleMoveUp(+currentXPos, +currentYPos);
          //all collisions should always be checked once the player has finished moving
          handlePlayerFoodCollision();
          handleSelfCollision(snakeNodeArr)
        }, 100);
        break;
      }

    case "s":
    case "ArrowDown":
      if(lastMove === "ArrowUp" || lastMove === "w"){
        console.log("cant move there mate")
        break;
      } else {
        lastMove = e.key
        // console.log(lastMove) // test
        clearInterval(movementIntervalId);
        movementIntervalId = setInterval(() => {
          currentYPos = handleMoveDown(+currentXPos, +currentYPos);
          handlePlayerFoodCollision();
          handleSelfCollision(snakeNodeArr)
        }, 100);
        break;
      }

    case "a":
    case "ArrowLeft":
      if(lastMove === "ArrowRight" || lastMove === "d"){
        console.log("cant move there mate")
        break;
      } else {
        lastMove = e.key
        // console.log(lastMove) //test
        clearInterval(movementIntervalId);
        movementIntervalId = setInterval(() => {
          currentXPos = handleMoveLeft(+currentXPos, +currentYPos);
          handlePlayerFoodCollision();
          handleSelfCollision(snakeNodeArr);
        }, 100);
        break; 
      }

    case "d":
    case "ArrowRight":
      if(lastMove === "ArrowLeft" || lastMove === "a"){
        console.log("cant move there mate");
        break;
      } else {
        lastMove = e.key
        // console.log(lastMove) //test
        clearInterval(movementIntervalId);
        movementIntervalId = setInterval(() => {
          currentXPos = handleMoveRight(+currentXPos, +currentYPos);
          handlePlayerFoodCollision();
          handleSelfCollision(snakeNodeArr);
      }, 100);
      break;
      }

    default:
      break;
  }
}



document.addEventListener("keydown", handlePlayerMovement);
//just to reload the page with the r key at any time
document.addEventListener("keydown", ((e:KeyboardEvent) => {
  if(e.key === "r"){
    location.reload()
  }
}))