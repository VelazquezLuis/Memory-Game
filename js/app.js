let switchCards = [];
let moves = 0;
let timeOff = true;
let time = 0;
let clockId;
let matched = 0;

// RESETS CLASS OF EACH CARD TO DEFUALt 'CARD'
resetsCards = () => {
  const allCards = document.querySelectorAll('.deck li');
  for (let card of allCards) {
    card.className = 'card';
  }
}
resetsCards();

// Shuffle function from http://stackoverflow.com/a/2450976 
shuffle = (array) => {
  var currentIndex = array.length, temporaryValue, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

const deck = document.querySelector('.deck');

// shuffles deck
shuffleDeck = () => {
  const cardToShuffle = Array.from(document.querySelectorAll('.deck li'));
  
  const shufflecards = shuffle(cardToShuffle);
  for ( card of shufflecards){
    deck.appendChild(card);
  }
}
//shufles deck once
shuffleDeck();

// Flipps card over on each click 
deck.addEventListener('click', event => {
  const clickedTarget = event.target;
  // starts timer when first card is clicked 
  if (isClickValid(clickedTarget)) {
    if (timeOff) {
      timeOn();
      timeOff = false;
    }
    switchCard(clickedTarget);
    addSwitchdCard(clickedTarget);

    // checks when 2 cards have been clicked  
    if (switchCards.length === 2) {
      checkForMatch(clickedTarget);
      addMove();
      checkScore(); 
    }
    
  }
  
});

// checks that the target does NOT contain the class “match”
isClickValid = (clickTarget) => {
  return (
    clickTarget.classList.contains('card') &&
    !clickTarget.classList.contains('match') &&
    switchCards.length < 2 && 
    !switchCards.includes(clickTarget)      
  );
}

// switches card 
switchCard = (card) => {
  card.classList.toggle('open');
  card.classList.toggle('show');
}
// adds each toggle to the array toggledCards
addSwitchdCard = (clickTarget) => {
  switchCards.push(clickTarget);
}
// checks wheather the two cards toggled macth class id 
checkForMatch = () => {
  const total_pairs = 8;
  if (
    switchCards[0].firstElementChild.className === 
    switchCards[1].firstElementChild.className
  ) {
    switchCards[0].classList.toggle('match'); 
    switchCards[1].classList.toggle('match');
    switchCards = [];       
    matched++;
    if (matched === total_pairs){
      gameWon();
    }   
  } else {
    //this setTimeout gives it time to reset the two card that dont match to flip over back.
    setTimeout(() => {
      console.log('not a macth');
      switchCard(switchCards[0]);
      switchCard(switchCards[1]);        
      switchCards = [];
    }, 1000);
      
    }
}

//increments moves by one and displays it in the html
addMove = () => {
  moves++;
  const movesText = document.querySelector('.moves');
  movesText.innerHTML = moves;
}

//checks scores to see how stars the player should have depending the moves the have. 
checkScore = () => {
  if (moves === 10 ) {
    hideAStar();
  }
  if (moves === 16) {
    hideAStar();
  }
}

//hides a star 
hideAStar = () => {
  const startList = document.querySelectorAll('.stars li');
  for (star of  startList) {   
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }       
  }
}

//starts the clock
timeOn = () => {
  clockId = setInterval(() => {
    time++;
    displayTime();
    console.log(time);
  }, 1000);  
}

//formats time with a [00:00] format 
displayTime = () => {
  const clock = document.querySelector('.clock');
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  if (seconds < 10 ){
    clock.innerHTML = `${minutes}:0${seconds}`;
  } else {    
    clock.innerHTML = `${minutes}:${seconds}`;
  }
}

//stops the timer 
stopClock = () => {
  clearInterval(clockId);
}

//shows the modal
switchModal = () => {
  const modal = document.querySelector('.modal_background');
  modal.classList.toggle('hide');
}


//gets the live time and prints it the the modal 
writeModalStats = () => {
  const timeStat= document.querySelector('.modal_time');
  const clockTime = document.querySelector('.clock').innerHTML;
  const moveStat = document.querySelector('.modal_moves');
  const starStat = document.querySelector('.modal_stars');
  const stars = getStars(); 

  timeStat.innerHTML = `Time = ${clockTime}`;
  moveStat.innerHTML = `Moves = ${moves}`;
  starStat.innerHTML = `stars = ${stars}`;
}

// counts the number of star player has  
getStars = () => {
  stars = document.querySelectorAll('.stars li');
  starCount = 0;
  for (star of stars) {
    if (star.style.display !== 'none') {
      starCount ++
    }    
  }
  return starCount;
}

// turns off the modal 
cancel = () => {
  switchModal();  
}

document.querySelector('.modal_close').addEventListener('click', cancel);
document.querySelector('.modal_cancel').addEventListener('click', cancel);

// restarts the game 
resetGame = () => {
  resetClockAndTime();
  resetMoves();
  resetStars();
  shuffleDeck();
  resetsCards();
  resets_mataches();
  switchCards = [];
}

//resets timer and clock in the popup
resetClockAndTime = () => {
  stopClock();
  timeOff = true;
  time = 0;
  displayTime();
}

// resets move count
resetMoves = () => {
  moves = 0; 
  document.querySelector('.moves').innerHTML = moves;
}

//resets stars to 3 
resetStars = () => {
  stars = 0; 
  const starList = document.querySelectorAll('.stars li');
  for(star of starList) {
    star.style.display = 'inline';
  }
}
//resets game when the modal is showing
replayGame = () => {
  resetGame();
  switchModal();
  resetsCards();
}

//resets matches count
resets_mataches = () => {
  matched = 0;
}

document.querySelector('.restart').addEventListener('click', resetGame);
document.querySelector('.modal_replay').addEventListener('click', replayGame);

//shows modal with updated stats
gameWon = () => {
  stopClock();
  writeModalStats();
  switchModal();
}

