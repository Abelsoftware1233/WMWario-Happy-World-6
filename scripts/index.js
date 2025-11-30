const cards = document.querySelectorAll('.card');

// Game state variables
let hasFlippedCard = false;
let firstCard, secondCard;
let lockBoard = false; // Prevents further card flipping during a comparison delay


// - Function to flip the card
function flipCard() {
    // 1. Check if the board is locked (waiting for unmatched cards to flip back)
    if(lockBoard) return;
    // 2. Prevent clicking the same card twice
    if(this === firstCard) return;

    this.classList.add('flip');

    // Is this the first card being flipped?
    if(!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        return;
    }

    // This is the second card
    secondCard = this;
    
    checkForMatch();
}


// - Function that checks if the flipped cards are a match
function checkForMatch() {
    const isMatch = firstCard.dataset.card === secondCard.dataset.card;
    
    // If cards match, keep them flipped and remove event listeners
    if (isMatch) {
        disableCards();
        return;
    }
    
    // If cards don't match, flip them back after a delay
    unflipCards();
}


// - Function that disables matched cards (removes click/tap listeners)
function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    
    // Crucial for mobile support: remove touchstart listener as well
    firstCard.removeEventListener('touchstart', flipCard);
    secondCard.removeEventListener('touchstart', flipCard);

    resetBoard();
}


// - Function that flips back unmatched cards
function unflipCards() {
    // Lock the board to prevent flipping other cards while the unmatched cards are visible
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1500); // 1.5 second delay before flipping back
}


// - Function that resets the board state
function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}


// - Function that shuffles the cards (Immediately Invoked Function Expression - IIFE)
(function shuffle() {
    cards.forEach((card) => {
        let randomPosition = Math.floor(Math.random() * cards.length); // Use cards.length for flexibility
        card.style.order = randomPosition;
    })
})();


// - Add click and touchstart event listeners to each card
cards.forEach((card) => {
    // Standard click event for desktop/mouse
    card.addEventListener('click', flipCard);
    
    // Added touchstart event for mobile/touchscreens
    // Using { passive: true } for better scroll performance on mobile
    card.addEventListener('touchstart', flipCard, { passive: true });
});
