import './style.css';
// TODO: 1.(WILL PROBABLY NEED ANOTHER FUNCTION TO HANDLE any GAMEOVER condition)
//       2. find a way to add length to the snake
//       3. further refine movement so user input is very responsive
//       4. make sure food cannot spawn on any part of the snake
//       5. if somehow the snake length is equal to grid area width*height then GAMEWIN conditoin is met


// QUALITY OF LIFE THINGS TO DEAL WITH:
//  fix player pause when player holds key down

const player = document.querySelector<HTMLDivElement>('#player')!;
const food = document.querySelector<HTMLDivElement>('#food')!;
//const gameArea = document.querySelector<HTMLElement>('.game-area')!;

const snakeNodeList = document.querySelectorAll<HTMLDivElement>(".snake-body");
//need to convert the nodeList to an array to use real array methods
//because you can't push to a NodeList
const snakeNodeArr: HTMLDivElement[] = [];
for(const elem of snakeNodeList){
  snakeNodeArr.push(elem)
}

console.log(snakeNodeList)

console.log(snakeNodeArr)

//so all my logic so far is logic applied to 1 element
//so for the snake I want to apply all my changes to a snake "object?", "array?" of snake divs with every movement interval below
// Im first going to experiment with a NodeList of player divs
//playing around with a bunch of stuff 

// gets a random multiple of 20 between 0 and max range
// - probably a more efficient way of doing this because 
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

  //once snake length is added i will need another check to make sure food is not in snake object

  food.style.left = `${foodPlacementX}px`;
  food.style.top = `${foodPlacementY}px`;
}

//food is always moved on initial load
moveFood();

//make sure the food never overlaps with the player on start


//visual output tests
let currentXPosOutput = document.querySelector<HTMLParagraphElement>('#playerX')!;
let currentYPosOutput = document.querySelector<HTMLParagraphElement>('#playerY')!;
let score = document.querySelector<HTMLParagraphElement>('#score')!;

let scoreOutput: number = 0;
//getting CSS styles for player
const playerStyleTop = getComputedStyle(player).getPropertyValue('top')
const playerStyleLeft = getComputedStyle(player).getPropertyValue('left')

currentYPosOutput.innerHTML = `current Y position: ${playerStyleTop}`;
currentXPosOutput.innerHTML = `current X position: ${playerStyleLeft}`;

//Interval ID to make sure multiple intervals dont interfere with each other
// I really want to try 4 intervals for 4 movements
let movementIntervalId: number;

// const gameOver = () => {

// }

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
    snakeNodeList[currentIndex].style.top = `${newYPosition}px`;
    snakeNodeList[currentIndex].style.left = `${XPosition}px`;
    //we want all other blocks to copy the x and y pos of the prev block, so we need an updated snapshot here before we change it
    for(let i = 1; i < snakeNodeList.length; i++){
      //get current snapshot of present block
      yNewSnapshot = +getComputedStyle(snakeNodeList[i]).getPropertyValue('top').replace("px", "");
      xNewSnapshot = +getComputedStyle(snakeNodeList[i]).getPropertyValue('left').replace("px", "")
      //move the current snake to the old snapshot of the previous
      snakeNodeList[i].style.top = `${yOldSnapShot}px`;
      snakeNodeList[i].style.left = `${xOldSnapShot}px`;
      //update so the new snapshots are now the old snapshots for the next loop
      xOldSnapShot = xNewSnapshot;
      yOldSnapShot = yNewSnapshot;
    }
  } else{
    clearInterval(movementIntervalId);
    snakeNodeList[0].style.top = `${YPosition}px`;
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
    snakeNodeList[currentIndex].style.top = `${newYPosition}px`;
    snakeNodeList[currentIndex].style.left = `${XPosition}px`;

    //we want all other blocks to copy the x and y pos of the prev block, so we need an updated snapshot here before we change it
    for(let i = 1; i < snakeNodeList.length; i++){
      //get current snapshot of present block
      yNewSnapshot = +getComputedStyle(snakeNodeList[i]).getPropertyValue('top').replace("px", "");
      xNewSnapshot = +getComputedStyle(snakeNodeList[i]).getPropertyValue('left').replace("px", "")
      //move the current snake to the old snapshot of the previous
      snakeNodeList[i].style.top = `${yOldSnapShot}px`;
      snakeNodeList[i].style.left = `${xOldSnapShot}px`;
      //update snapshots so the new snapshots are now the old snapshots for the next loop
      xOldSnapShot = xNewSnapshot;
      yOldSnapShot = yNewSnapshot;
    }

  } else{
    clearInterval(movementIntervalId);
    snakeNodeList[0].style.top = `${YPosition}px`;
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
    snakeNodeList[currentIndex].style.top = `${YPosition}px`;
    snakeNodeList[currentIndex].style.left = `${newXPosition}px`;
    //we want all other blocks to copy the x and y pos of the prev block, so we need an updated snapshot here before we change it
    for(let i = 1; i < snakeNodeList.length; i++){
      //get current snapshot of present block
      yNewSnapshot = +getComputedStyle(snakeNodeList[i]).getPropertyValue('top').replace("px", "");
      xNewSnapshot = +getComputedStyle(snakeNodeList[i]).getPropertyValue('left').replace("px", "")
      //move the current snake to the old snapshot of the previous
      snakeNodeList[i].style.top = `${yOldSnapShot}px`;
      snakeNodeList[i].style.left = `${xOldSnapShot}px`;
      //update snapshots so the new snapshots are now the old snapshots for the next loop
      xOldSnapShot = xNewSnapshot;
      yOldSnapShot = yNewSnapshot;
    }
  } else {
    //clean up interval 
    clearInterval(movementIntervalId);
    snakeNodeList[0].style.left = `${XPosition}px`;
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

    snakeNodeList[currentIndex].style.top = `${YPosition}px`;
    snakeNodeList[currentIndex].style.left = `${newXPosition}px`;
    //we want all other blocks to copy the x and y pos of the prev block, so we need an updated snapshot here before we change it
    for(let i = 1; i < snakeNodeList.length; i++){
      //get current snapshot of present block
      yNewSnapshot = +getComputedStyle(snakeNodeList[i]).getPropertyValue('top').replace("px", "");
      xNewSnapshot = +getComputedStyle(snakeNodeList[i]).getPropertyValue('left').replace("px", "")
      //move the current snake to the old snapshot of the previous
      snakeNodeList[i].style.top = `${yOldSnapShot}px`;
      snakeNodeList[i].style.left = `${xOldSnapShot}px`;
      //update snapshots so the new snapshots are now the old snapshots for the next loop
      xOldSnapShot = xNewSnapshot;
      yOldSnapShot = yNewSnapshot;
    }
  } else{
    clearInterval(movementIntervalId);
    snakeNodeList[0].style.left = `${XPosition}px`;
  }
  return newXPosition;
}

const handlePlayerFoodCollision = () => {
  //THIS CHECK WILL BE FOR FOOD PELLET MOVEMENT
  if(food.style.left === player.style.left && food.style.top === player.style.top){
    //can forsee food being outside of game area, need another if inside that checks boundries
    //update score
    scoreOutput += 20;
    score.innerHTML = `score: ${scoreOutput}`;
    moveFood();
  }
}

const movementStack: string[] = [];

const handlePlayerMovement = (e: KeyboardEvent) => {
  e.preventDefault(); // to prevent arrows scrolling the window up
  //e.stopPropagation(); //not sure if i need this just yet
  // "player.style.${attr}" is of type "CSSInlineStyle" so in order for this to work how I expect I need the top and left attributes of player to be inline styles beforehand
  let currentYPos: string | number = snakeNodeList[0].style.top;
  let currentXPos: string | number = snakeNodeList[0].style.left;
  let lastMove = movementStack.pop();

  currentYPos = currentYPos.replace("px", ""); // e.g. currentYPos = "20"
  currentXPos = currentXPos.replace("px", ""); // e.g. currentXPos = "0"

  switch(e.key){
    case "w":
    case "ArrowUp":
      //if the last key I pressed is in the opposite direction of what im trying to do now
      if(lastMove === "ArrowDown" || lastMove === "s"){
        //pushing lastMove back onto the stack in this case to make sure the last move is always the same until 
        movementStack.push(lastMove)
        console.log("cant move there mate")
        break;
      } else {
        //push movement to my movement stack
        movementStack.push(e.key)
        console.log(movementStack)
        // ALWAYS make sure the last interval is cleared before setting a new one
        clearInterval(movementIntervalId);

        //i think I should wrap this whole movement thing in a for loop that 
        //goes through the snake segments
        // because the snakeArr element list is globally accessed
        //I can then manipulate each snake block how i want every interval
        //the only thing im not sure about atm is where this for loop should be placed
        
        // different game modes will have different intervals with if statements
        movementIntervalId = setInterval(() => {
          //debugger;
          currentYPos = handleMoveUp(+currentXPos, +currentYPos);
          //playerFoodCollision should always be checked once the player moves
          handlePlayerFoodCollision();
          //showing change to the user
          currentYPosOutput.innerHTML = `current Y position: ${snakeNodeList[0].style.top}`;
        }, 100);
        break;
      }

    case "s":
    case "ArrowDown":
      //if the last key I pressed is in the opposite direction of what im trying to do now
      if(lastMove === "ArrowUp" || lastMove === "w"){
        movementStack.push(lastMove)
        console.log("cant move there mate")
        break;
      } else {
        //push movement to my movement stack
        movementStack.push(e.key)
        console.log(movementStack)
        // ALWAYS make sure the last interval is cleared before setting a new one 
        clearInterval(movementIntervalId);
        // different game modes will have different intervals with if statements
        movementIntervalId = setInterval(() => {
          currentYPos = handleMoveDown(+currentXPos, +currentYPos);
          //playerFoodCollision should always be checked once the player moves
          handlePlayerFoodCollision();
          //showing change to the user
          currentYPosOutput.innerHTML = `current Y position: ${snakeNodeList[0].style.top}`;
        }, 100);
        break;
      }

    case "a":
    case "ArrowLeft":
      if(lastMove === "ArrowRight" || lastMove === "d"){
        movementStack.push(lastMove)
        console.log("cant move there mate")
        break;
      } else {
        //push movement to my movement stack
        movementStack.push(e.key)
        console.log(movementStack)
        clearInterval(movementIntervalId);
        movementIntervalId = setInterval(() => {
          currentXPos = handleMoveLeft(+currentXPos, +currentYPos);
          handlePlayerFoodCollision();
          //showing change to the user
          currentXPosOutput.innerHTML = `current X position: ${snakeNodeList[0].style.left}`;
        }, 100);
        break; 
      }
    case "d":
    case "ArrowRight":
      if(lastMove === "ArrowLeft" || lastMove === "a"){
        movementStack.push(lastMove)
        console.log("cant move there mate")
        break;
      } else {
        //push movement to my movement stack
        movementStack.push(e.key)
        console.log(movementStack)

        clearInterval(movementIntervalId);
        movementIntervalId = setInterval(() => {
          //debugger;
          currentXPos = handleMoveRight(+currentXPos, +currentYPos);
          handlePlayerFoodCollision();
          //showing change to the user
          currentXPosOutput.innerHTML = `current X position: ${snakeNodeList[0].style.left}`;
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