 // Game state
 const gameState = {
    totalRounds: 5,
    currentRound: 1,
    playerScore: 0,
    computerScore: 0,
    draws: 0
};

// DOM elements
const setupScreen = document.querySelector('.setup-screen');
const gameScreen = document.querySelector('.game-screen');
const resultScreen = document.querySelector('.result-screen');
const attemptsInput = document.getElementById('attempts');
const startBtn = document.querySelector('.start-btn');
const choices = document.querySelectorAll('.choice');
const playerChoiceDisplay = document.querySelector('.player-choice');
const computerChoiceDisplay = document.querySelector('.computer-choice');
const roundResult = document.querySelector('.round-result');
const nextBtn = document.querySelector('.next-btn');
const currentRoundDisplay = document.getElementById('current-round');
const totalRoundsDisplay = document.getElementById('total-rounds');
const playerScoreDisplay = document.getElementById('player-score');
const computerScoreDisplay = document.getElementById('computer-score');
const finalResult = document.querySelector('.final-result');
const victoriesDisplay = document.getElementById('victories');
const defeatsDisplay = document.getElementById('defeats');
const drawsDisplay = document.getElementById('draws');
const playAgainBtn = document.querySelector('.play-again-btn');

// Choice emojis
const choiceEmojis = {
    rock: '🪨',
    paper: '📄',
    scissors: '✂️'
};

// Initialize star background
function createStars() {
    const starsContainer = document.querySelector('.stars');
    const starsCount = 150;
    
    for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 3;
        
        // Random animation delay
        const delay = Math.random() * 5;
        
        star.style.left = `${x}%`;
        star.style.top = `${y}%`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.animationDelay = `${delay}s`;
        
        starsContainer.appendChild(star);
    }
}

// Start game
startBtn.addEventListener('click', () => {
    gameState.totalRounds = parseInt(attemptsInput.value) || 5;
    gameState.currentRound = 1;
    gameState.playerScore = 0;
    gameState.computerScore = 0;
    gameState.draws = 0;
    
    // Update UI
    totalRoundsDisplay.textContent = gameState.totalRounds;
    currentRoundDisplay.textContent = gameState.currentRound;
    playerScoreDisplay.textContent = gameState.playerScore;
    computerScoreDisplay.textContent = gameState.computerScore;
    
    // Show game screen
    setupScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    resultScreen.style.display = 'none';
});

// Player selects a choice
choices.forEach(choice => {
    choice.addEventListener('click', () => {
        // Get player choice
        const playerChoice = choice.dataset.choice;
        
        // Get computer choice
        const choices = ['rock', 'paper', 'scissors'];
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];
        
        // Display choices
        playerChoiceDisplay.textContent = choiceEmojis[playerChoice];
        computerChoiceDisplay.textContent = choiceEmojis[computerChoice];
        
        // Reset classes
        playerChoiceDisplay.className = 'player-choice';
        computerChoiceDisplay.className = 'computer-choice';
        
        // Determine the winner
        const result = determineWinner(playerChoice, computerChoice);
        
        // Update UI based on result
        if (result === 'win') {
            roundResult.textContent = 'You win this round!';
            playerChoiceDisplay.classList.add('winner');
            computerChoiceDisplay.classList.add('loser');
            gameState.playerScore++;
        } else if (result === 'lose') {
            roundResult.textContent = 'Computer wins this round!';
            playerChoiceDisplay.classList.add('loser');
            computerChoiceDisplay.classList.add('winner');
            gameState.computerScore++;
        } else {
            roundResult.textContent = "It's a draw!";
            playerChoiceDisplay.classList.add('draw');
            computerChoiceDisplay.classList.add('draw');
            gameState.draws++;
        }
        
        // Update score
        playerScoreDisplay.textContent = gameState.playerScore;
        computerScoreDisplay.textContent = gameState.computerScore;
        
        // Disable choices
        choices.forEach(c => c.style.pointerEvents = 'none');
        
        // Show next button or end the game
        if (gameState.currentRound < gameState.totalRounds) {
            nextBtn.style.display = 'block';
        } else {
            // Game over - show results after 1.5 seconds
            setTimeout(showResults, 1500);
        }
    });
});

// Next round
nextBtn.addEventListener('click', () => {
    gameState.currentRound++;
    currentRoundDisplay.textContent = gameState.currentRound;
    
    // Reset UI
    roundResult.textContent = '';
    playerChoiceDisplay.textContent = '';
    computerChoiceDisplay.textContent = '';
    playerChoiceDisplay.className = 'player-choice';
    computerChoiceDisplay.className = 'computer-choice';
    nextBtn.style.display = 'none';
    
    // Enable choices
    choices.forEach(c => c.style.pointerEvents = 'auto');
});

// Play again
playAgainBtn.addEventListener('click', () => {
    // Show setup screen
    setupScreen.style.display = 'block';
    gameScreen.style.display = 'none';
    resultScreen.style.display = 'none';
});

// Determine the winner of a round
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'draw';
    }
    
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'win';
    } else {
        return 'lose';
    }
}

// Show results screen
function showResults() {
    // Update stats
    victoriesDisplay.textContent = gameState.playerScore;
    defeatsDisplay.textContent = gameState.computerScore;
    drawsDisplay.textContent = gameState.draws;
    
    // Determine final result message
    if (gameState.playerScore > gameState.computerScore) {
        finalResult.textContent = '🏆 You Won the Battle! 🏆';
        finalResult.style.color = '#4CAF50';
    } else if (gameState.playerScore < gameState.computerScore) {
        finalResult.textContent = '😢 You Lost the Battle! 😢';
        finalResult.style.color = '#f44336';
    } else {
        finalResult.textContent = '🤝 The Battle Ended in a Draw! 🤝';
        finalResult.style.color = '#FFC107';
    }
    
    // Show result screen
    gameScreen.style.display = 'none';
    resultScreen.style.display = 'block';
}

// Initialize
createStars();

// Enable choices
choices.forEach(c => c.style.pointerEvents = 'auto');