# nology-snake-game

I’m going to create a classic snake game where the player controls a "snake" avatar that gets bigger with every "food pellet" that gets eaten. If the player runs into themselves or the border then its game over.
In order to create a functional snake game I think I need to break the game down into these following steps.

- Getting the user to control an initial starting block to move around in 2 dimensions using the arrow keys on the keyboard (or alternatively WASD)
  
- Once the player overlaps the food pellet (which will be a different coloured div to player) three things should happen:
  - The food pellet will move to a new random area in the container where the player isn’t already occupying.
  - The players score will increase
  - The length of the player should also increase by a set amount.
  
- The game will be over once the following conditions are met:
  - If the player extends past the game area container.
  - If the player runs into themselves by hitting the head of the snake on any other part of the snake. 


How I tackle and further break down the problems above will be demonstrated and commented on in my code base
