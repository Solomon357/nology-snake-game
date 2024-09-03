import './style.css';
// TODO:
//       1. slightly refine growSnake() to deal with functions 
//       2. handle GameOver event if snake collides with itself or falls outside container
//       4. styling + music


// QUALITY OF LIFE THINGS TO DEAL WITH after:
//  fix bug where player can pause when player holds key down
//  further refine movement so user input is very responsive
//  if somehow the snake length is equal to grid area width*height then GAMEWIN conditin is met

const player = document.querySelector<HTMLDivElement>('#player')!;
const food = document.querySelector<HTMLDivElement>('#food')!;
const gameArea = document.querySelector<HTMLElement>('.game-area')!;

const snakeNodeList = document.querySelectorAll<HTMLDivElement>(".snake-body");
//need to convert the nodeList to an array to use real array methods
//because you can't push to a NodeList
const snakeNodeArr: HTMLDivElement[] = [];
for(const elem of snakeNodeList){
  snakeNodeArr.push(elem)
}

//console.log(snakeNodeList)
//console.log(snakeNodeArr)

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
  //going through all current snake segments
  for(const snakeSegment of snakeNodeArr){
    //check to see if food is overlapping with the snake anywhere
    if(food.style.left === snakeSegment.style.left && food.style.top === snakeSegment.style.top){
      //then do this function again
      //**again between this recursive call and getRandomNumber the potential for game speed loss is very high */
      return moveFood();
    }
  }
  //if we make it this far then food is where it should be so do nothing
}

//food is always moved on initial load
moveFood();



//visual output tests
let currentXPosOutput = document.querySelector<HTMLParagraphElement>('#playerX')!;
let currentYPosOutput = document.querySelector<HTMLParagraphElement>('#playerY')!;
let score = document.querySelector<HTMLParagraphElement>('#score')!;

let scoreOutput: number = 0;
let isGrowSnake: boolean = false;
//getting CSS styles for player
const playerStyleTop = getComputedStyle(player).getPropertyValue('top')
const playerStyleLeft = getComputedStyle(player).getPropertyValue('left')

currentYPosOutput.innerHTML = `current Y position: ${playerStyleTop}`;
currentXPosOutput.innerHTML = `current X position: ${playerStyleLeft}`;

//Interval ID to make sure multiple intervals dont interfere with each other
// I really want to try 4 intervals for 4 movements
let movementIntervalId: number;

const handleGameOver = (typeOfLoss: string, isGrowSnake: boolean) => {

  if(typeOfLoss === "OutOfBounds"){
    document.removeEventListener('keydown', handlePlayerMovement)
    //then trigger and alert saying game over
    alert("Out of Bounds! Press the 'r' key to restart!")
    //if grow snake is not the reason for selfCollision then I really ran into myself 
  } else if (typeOfLoss === "SelfCollision" && !isGrowSnake){
    document.removeEventListener('keydown', handlePlayerMovement)
    alert("You ran into yourself:( Press the 'r' key to restart!")
  }
  
}

//I need a way of keeping track of the last key the player pressed
//I won't need a stack - should change to a variable


const handleMoveUp = (XPosition: number, YPosition: number, currentIndex:number = 0 ) => {
  
  let yNewSnapshot: number;
  let xNewSnapshot: number;
  //need an initial snapshot of where exactly this block should move to
  let yOldSnapShot: number = YPosition;
  let xOldSnapShot: number = XPosition;

  let newYPosition = YPosition - 20;

  if(YPosition >= 0 && YPosition <= 380 && XPosition >= 0 && XPosition <= 680){
    //I only really want to change the direction of the snake head based off a hardcoded new direction
    snakeNodeArr[currentIndex].style.top = `${newYPosition}px`;
    snakeNodeArr[currentIndex].style.left = `${XPosition}px`;
    //we want all other blocks to copy the x and y pos of the prev block, so we need an updated snapshot here before we change it
    for(let i = 1; i < snakeNodeArr.length; i++){
      //get current snapshot of present block
      yNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('top').replace("px", "");
      xNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('left').replace("px", "")
      //move the current snake to the old snapshot of the previous
      snakeNodeArr[i].style.top = `${yOldSnapShot}px`;
      snakeNodeArr[i].style.left = `${xOldSnapShot}px`;
      //update so the new snapshots are now the old snapshots for the next loop
      xOldSnapShot = xNewSnapshot;
      yOldSnapShot = yNewSnapshot;
    }
  } else{
    clearInterval(movementIntervalId);
    handleGameOver("OutOfBounds", false);
    //snakeNodeArr[0].style.top = `${YPosition}px`;
  }
  return newYPosition;
}


const handleMoveDown = (XPosition: number, YPosition: number, currentIndex: number = 0) => {
  
  let yNewSnapshot: number;
  let xNewSnapshot: number;
  //need an initial snapshot of where exactly this block should move to
  let yOldSnapShot: number = YPosition;
  let xOldSnapShot: number = XPosition;

  let newYPosition: number = YPosition + 20;

  if(YPosition >= 0 && YPosition <= 380 && XPosition >= 0 && XPosition <= 680){
    snakeNodeArr[currentIndex].style.top = `${newYPosition}px`;
    snakeNodeArr[currentIndex].style.left = `${XPosition}px`;

    //we want all other blocks to copy the x and y pos of the prev block, so we need an updated snapshot here before we change it
    for(let i = 1; i < snakeNodeArr.length; i++){
      //get current snapshot of present block
      yNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('top').replace("px", "");
      xNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('left').replace("px", "")
      //move the current snake to the old snapshot of the previous
      snakeNodeArr[i].style.top = `${yOldSnapShot}px`;
      snakeNodeArr[i].style.left = `${xOldSnapShot}px`;
      //update snapshots so the new snapshots are now the old snapshots for the next loop
      xOldSnapShot = xNewSnapshot;
      yOldSnapShot = yNewSnapshot;
    }

  } else{
    clearInterval(movementIntervalId);
    handleGameOver("OutOfBounds" ,false);
    //snakeNodeArr[0].style.top = `${YPosition}px`;
  }
  return newYPosition;
}

const handleMoveLeft = (XPosition: number, YPosition: number, currentIndex: number = 0) => {
  let xNewSnapshot: number;
  let yNewSnapshot: number;
  //need an initial snapshot of where exactly this block should move to
  let xOldSnapShot: number = XPosition;
  let yOldSnapShot: number = YPosition;

  let newXPosition = XPosition - 20;

  if(XPosition >= 0 && XPosition <= 680 && YPosition >= 0 && YPosition <= 380){
    snakeNodeArr[currentIndex].style.top = `${YPosition}px`;
    snakeNodeArr[currentIndex].style.left = `${newXPosition}px`;
    //we want all other blocks to copy the x and y pos of the prev block, so we need an updated snapshot here before we change it
    for(let i = 1; i < snakeNodeArr.length; i++){
      //get current snapshot of present block
      yNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('top').replace("px", "");
      xNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('left').replace("px", "")
      //move the current snake to the old snapshot of the previous
      snakeNodeArr[i].style.top = `${yOldSnapShot}px`;
      snakeNodeArr[i].style.left = `${xOldSnapShot}px`;
      //update snapshots so the new snapshots are now the old snapshots for the next loop
      xOldSnapShot = xNewSnapshot;
      yOldSnapShot = yNewSnapshot;
    }
  } else {
    //clean up interval 
    clearInterval(movementIntervalId);
    //call gameOver
    handleGameOver("OutOfBounds", false)
    //snakeNodeArr[0].style.left = `${XPosition}px`;
  }
  return newXPosition;
}

const handleMoveRight = (XPosition: number, YPosition: number, currentIndex: number = 0) => {
  let xNewSnapshot: number;
  let yNewSnapshot: number;
  //need an initial snapshot of where exactly this block should move to
  let xOldSnapShot: number = XPosition;
  let yOldSnapShot: number = YPosition;

  let newXPosition = XPosition + 20;
  if(XPosition >= 0 && XPosition <= 680 && YPosition >= 0 && YPosition <= 380){

    snakeNodeArr[currentIndex].style.top = `${YPosition}px`;
    snakeNodeArr[currentIndex].style.left = `${newXPosition}px`;
    //we want all other blocks to copy the x and y pos of the prev block, so we need an updated snapshot here before we change it
    for(let i = 1; i < snakeNodeArr.length; i++){
      //get current snapshot of present block
      yNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('top').replace("px", "");
      xNewSnapshot = +getComputedStyle(snakeNodeArr[i]).getPropertyValue('left').replace("px", "")
      //move the current snake to the old snapshot of the previous
      snakeNodeArr[i].style.top = `${yOldSnapShot}px`;
      snakeNodeArr[i].style.left = `${xOldSnapShot}px`;
      //update snapshots so the new snapshots are now the old snapshots for the next loop
      xOldSnapShot = xNewSnapshot;
      yOldSnapShot = yNewSnapshot;
    }
  } else{
    clearInterval(movementIntervalId);
    handleGameOver("OutOfBounds", false);
    //snakeNodeArr[0].style.left = `${XPosition}px`;
  }
  return newXPosition;
}

const growSnake = () => {
  //I need an exception of when we're growing snake dont worry about self collision
  isGrowSnake = true;
  //i want to add a new div with class="snake-body" width&height = 20px to the nodeListArr 
  let newSnakeElement = document.createElement("div");
  newSnakeElement.className = "snake-body";
  //determining where the new snake element will grow from 
  let newXPos;
  let newYPos;
  newXPos = +snakeNodeArr[snakeNodeArr.length-1].style.left.replace("px", "")
  newYPos = +snakeNodeArr[snakeNodeArr.length-1].style.top.replace("px", "")
  newSnakeElement.style.left = `${newXPos}px`
  newSnakeElement.style.top = `${newYPos}px`

  snakeNodeArr.push(newSnakeElement);
  gameArea.appendChild(newSnakeElement)
}

const handlePlayerFoodCollision = () => {
  //THIS CHECK WILL BE FOR FOOD PELLET MOVEMENT
  if(food.style.left === player.style.left && food.style.top === player.style.top){
    //can forsee food being outside of game area, need another if inside that checks boundries
    //update score
    scoreOutput += 20;
    score.innerHTML = `score: ${scoreOutput}`;
    growSnake();
    moveFood();
  }
}

//handle Collision with self
const handleSelfCollision = (arr: HTMLDivElement[]) => {
  if(arr.length < 2){
    return "cant collide";
  }

  let XPos = snakeNodeArr[0].style.left;
  let YPos = snakeNodeArr[0].style.top;

  for(let i = 1; i < arr.length; i++){
    if(XPos === arr[i].style.left && YPos === arr[i].style.top){
      handleGameOver("SelfCollision", isGrowSnake);
      //console.log("Game Over!")
      //sstop everything and run gameOver
    }
  }
  //reset isGrowSnake back to false
  isGrowSnake = false;
}

let lastMove: string = "";
//will implement this after deadline
//let movementQueue: string[] = [];

const handlePlayerMovement = (e: KeyboardEvent) => {
  e.preventDefault(); // to prevent arrows scrolling the window up
  //e.stopPropagation(); //not sure if i need this just yet
  // "player.style.${attr}" is of type "CSSInlineStyle" so in order for this to work how I expect I need the top and left attributes of player to be inline styles beforehand

  let currentYPos: string | number = snakeNodeArr[0].style.top;
  let currentXPos: string | number = snakeNodeArr[0].style.left;

  currentYPos = currentYPos.replace("px", ""); // e.g. currentYPos = "20"
  currentXPos = currentXPos.replace("px", ""); // e.g. currentXPos = "0"

  switch(e.key){
    case "w":
    case "ArrowUp":
      //if the last key I pressed is in the opposite direction of where I'm trying to move
      if(lastMove === "ArrowDown" || lastMove === "s"){
        console.log("cant move there mate")
        break;
      } else {
        lastMove = e.key;
        
        console.log(lastMove)
        // ALWAYS make sure the last interval is cleared before setting a new one
        clearInterval(movementIntervalId);
        
        // different game modes will have different intervals with if statements
        movementIntervalId = setInterval(() => {
          currentYPos = handleMoveUp(+currentXPos, +currentYPos);
          //playerFoodCollision should always be checked once the player moves
          handlePlayerFoodCollision();
          handleSelfCollision(snakeNodeArr)
          //showing change to the user
          currentYPosOutput.innerHTML = `current Y position: ${snakeNodeArr[0].style.top}`;
        }, 100);
        break;
      }
    case "s":
    case "ArrowDown":
      //if the last key I pressed is in the opposite direction of what im trying to do now
      if(lastMove === "ArrowUp" || lastMove === "w"){
        console.log("cant move there mate")
        break;
      } else {
        //push movement to my movement stack
        lastMove = e.key
        console.log(lastMove)
        // ALWAYS make sure the last interval is cleared before setting a new one 
        clearInterval(movementIntervalId);
        // different game modes will have different intervals with if statements
        movementIntervalId = setInterval(() => {
          currentYPos = handleMoveDown(+currentXPos, +currentYPos);
          //playerFoodCollision should always be checked once the player moves
          handlePlayerFoodCollision();
          handleSelfCollision(snakeNodeArr)
          //showing change to the user
          currentYPosOutput.innerHTML = `current Y position: ${snakeNodeArr[0].style.top}`;
        }, 100);
        break;
      }

    case "a":
    case "ArrowLeft":
      if(lastMove === "ArrowRight" || lastMove === "d"){
        console.log("cant move there mate")
        break;
      } else {
        //push movement to my movement stack
        lastMove = e.key
        console.log(lastMove)
        clearInterval(movementIntervalId);
        movementIntervalId = setInterval(() => {
          currentXPos = handleMoveLeft(+currentXPos, +currentYPos);
          handlePlayerFoodCollision();
          handleSelfCollision(snakeNodeArr)
          //showing change to the user
          currentXPosOutput.innerHTML = `current X position: ${snakeNodeArr[0].style.left}`;
        }, 100);
        break; 
      }
    case "d":
    case "ArrowRight":
      if(lastMove === "ArrowLeft" || lastMove === "a"){
        console.log("cant move there mate");
        break;
      } else {
        //update last move
        lastMove = e.key
        console.log(lastMove)
        clearInterval(movementIntervalId);
        movementIntervalId = setInterval(() => {
          //debugger;
          currentXPos = handleMoveRight(+currentXPos, +currentYPos);
          handlePlayerFoodCollision();
          handleSelfCollision(snakeNodeArr)
          //showing change to the user
          currentXPosOutput.innerHTML = `current X position: ${snakeNodeArr[0].style.left}`;
      }, 100);
      break;
      }
    default:
      break;
  }
}

document.addEventListener("keydown", handlePlayerMovement);
//document.addEventListener("change", handlePlayerFoodCollision)

document.addEventListener("keydown", ((e:KeyboardEvent) => {
  if(e.key === "r"){
    location.reload()
  }
}))