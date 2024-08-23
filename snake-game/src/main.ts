import './style.css'



const player = document.querySelector<HTMLDivElement>('#player')!;
player.focus(); // do the player is automatically focused on page


// this event function will handle all player movement
const handlePlayerKeyPress = (event: KeyboardEvent) => {
    const target = <HTMLDivElement>event.currentTarget;
    console.log(event.key);// test 
    target.focus(); // not sure if i need this yet
    //event.stopPropagation()

    if(event.key === "ArrowRight" || event.key === "d"){
        let currentLeftPos: string | number = target.style.left; // type string or number because im going to be converting between the 2
        currentLeftPos = currentLeftPos.replace("px", "");
        // console.log(currentLeftPos) // test
        currentLeftPos = +currentLeftPos + 20;
        currentLeftPos = `${currentLeftPos}px`
        target.style.left = currentLeftPos;

    } else if(event.key === "ArrowLeft" || event.key === "a"){
        let currentLeftPos: string | number = target.style.left; 
        currentLeftPos = currentLeftPos.replace("px", "");
        // console.log(currentLeftPos) // test
        currentLeftPos = +currentLeftPos - 20; // minus value in order to go backwards
        currentLeftPos = `${currentLeftPos}px`
        target.style.left = currentLeftPos;

        // console.log(target.style.left)
    } else if(event.key === "ArrowUp" || event.key === "w"){
        let currentTopPos: string | number = target.style.top; // getting the
        currentTopPos = currentTopPos.replace("px", "");
        // console.log(currentLeftPos) // test
        currentTopPos = +currentTopPos - 20; // because minus
        currentTopPos = `${currentTopPos}px`
        target.style.top = currentTopPos;

        // console.log(target.style.left)
    } else if (event.key === "ArrowDown" || event.key === "s"){
        let currentTopPos: string | number = target.style.top;
        currentTopPos = currentTopPos.replace("px", "");
        // console.log(currentLeftPos) // test
        currentTopPos = +currentTopPos + 20; // in order to go backwards
        currentTopPos = `${currentTopPos}px`
        target.style.top = currentTopPos;
    }
}

player.addEventListener("keydown", handlePlayerKeyPress)