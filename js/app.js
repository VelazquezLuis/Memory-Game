let toggleCards = [];
let moves = 0;
let clockOff = true;
let time = 0;
let clockId;
let matched = 0;

// RESETS CLASS OF EACH CARD TO DEFUAL 'CARD'
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
  console.log('Cards to shulfe', cardToShuffle);
  const shufflecards = shuffle(cardToShuffle);
  console.log('shulffed cards', shufflecards);
  for ( card of shufflecards){
    deck.appendChild(card);
  }
}
//shufles deck once
shuffleDeck();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

  // Flipps card over on each click 
  deck.addEventListener('click', event => {
    const clickTarget = event.target;
    // only lets you flip 2 cards at a time
    if (isClickValid(clickTarget)) {
      if (clockOff) {
        startClock();
        clockOff = false;
      }
      toggleCard(clickTarget);
      addToggledCard(clickTarget);

      // checks when 2 cards have been clicked  
      if (toggleCards.length === 2) {
        console.log('2 cartas');
        checkForMatch(clickTarget);
        addMove();
        checkScore(); 
      }
      
    }
    
  });
/* 
  deck.addEventListener('click', event => {
    const clickTarget = event.target;
    
    if (clockOff) {
      startClock();  delll
      clockOff = false;
    } */

  isClickValid = (clickTarget) => {
    return (
      clickTarget.classList.contains('card') &&
      !clickTarget.classList.contains('match') &&
      toggleCards.length < 2 && 
      !toggleCards.includes(clickTarget)      
    );
  }

  // toggles card 
  toggleCard = (card) => {
    card.classList.toggle('open');
    card.classList.toggle('show');
  }
  // adds each toggle to the array toggledCards
  addToggledCard = (clickTarget) => {
    toggleCards.push(clickTarget);
    console.log(toggleCards);
  }
  // checks wheather the two cards toggled macth class id 
  checkForMatch = () => {
    const total_pairs = 8   ;
    if (
      toggleCards[0].firstElementChild.className === 
      toggleCards[1].firstElementChild.className
    ) {
      toggleCards[0].classList.toggle('match'); 
      toggleCards[1].classList.toggle('match');
      toggleCards = [];  // maybe pop all isteead of set to nothing         
      matched++;
      if (matched === total_pairs){
        gameWon();
      }   
    } else {
      //this setTimeout gives it time to reset the two card that dont match to flip over back.
      setTimeout(() => {
        console.log('not a macth');
        toggleCard(toggleCards[0]);
        toggleCard(toggleCards[1]);        
        toggleCards = [];
      }, 1000);
        
      }
  }

  

  addMove = () => {
    moves++;
    const movesText = document.querySelector('.moves');
    movesText.innerHTML = moves;
  }

checkScore = () => {
  if (moves === 10 ) {
    hideAStar();
  }
  if (moves === 16) {
    hideAStar();
  }
}

hideAStar = () => {
  const startList = document.querySelectorAll('.stars li');
  for (star of  startList) {   
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }       
  }
}

startClock = () => {
  clockId = setInterval(() => {
    time++;
    displayTime();
    console.log(time);
  }, 1000);  
}

displayTime = () => {
  const clock = document.querySelector('.clock');
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  console.log(clock);
  if (seconds < 10 ){
    clock.innerHTML = `${minutes}:0${seconds}`;
  } else {    
    clock.innerHTML = `${minutes}:${seconds}`;
  }
}

stopClock = () => {
  clearInterval(clockId);
}

// still have to add to the the functionality 
toggleModal = () => {
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

getStars = () => {
  stars = document.querySelectorAll('.stars li');
  starCount = 0;
  for (star of stars) {
    if (star.style.display !== 'none') {
      starCount ++
    }    
  }
  console.log(starCount);
  return starCount;
}
cancel = () => {
  toggleModal();  
}

document.querySelector('.modal_close').addEventListener('click', cancel);
document.querySelector('.modal_cancel').addEventListener('click', cancel);
// not sure if this goes inside what function 



resetGame = () => {
  resetClockAndTime();
  resetMoves();
  resetStars();
  shuffleDeck();
  resetsCards();
  resets_mataches();
}

//resets timer and clock in the popup
resetClockAndTime = () => {
  stopClock();
  clockOff = true;
  time = 0;
  displayTime();
}

resetMoves = () => {
  moves = 0; 
  document.querySelector('.moves').innerHTML = moves;
}

resetStars = () => {
  stars = 0; 
  const starList = document.querySelectorAll('.stars li');
  for(star of starList) {
    star.style.display = 'inline';
  }
}
replayGame = () => {
  resetGame();
  toggleModal();
  resetsCards();
}

resets_mataches = () => {
  matched = 0;
}

// toggleModal();
document.querySelector('.restart').addEventListener('click', resetGame);
document.querySelector('.modal_replay').addEventListener('click', replayGame);

gameWon = () => {
  stopClock();
  writeModalStats();
  toggleModal();
}

