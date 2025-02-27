// Game state
const gameState = {
    totalRounds: 5,
    currentRound: 1,
    playerScore: 0,
    computerScore: 0,
    draws: 0,
    playerChoices: {
        rock: 0,
        paper: 0,
        scissors: 0
    },
    computerChoices: {
        rock: 0,
        paper: 0,
        scissors: 0
    },
    roundHistory: []
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
const currentRoundDisplay = document.getElementById('current-round');
const totalRoundsDisplay = document.getElementById('total-rounds');
const playerScoreDisplay = document.getElementById('player-score');
const computerScoreDisplay = document.getElementById('computer-score');
const finalResult = document.querySelector('.final-result');
const victoriesDisplay = document.getElementById('victories');
const defeatsDisplay = document.getElementById('defeats');
const drawsDisplay = document.getElementById('draws');
const winRateDisplay = document.getElementById('win-rate');
const rockStatsDisplay = document.getElementById('rock-stats');
const paperStatsDisplay = document.getElementById('paper-stats');
const scissorsStatsDisplay = document.getElementById('scissors-stats');
const resultDetailsDisplay = document.getElementById('result-details');
const playAgainBtn = document.querySelector('.play-again-btn');
const winBar = document.getElementById('win-bar');
const loseBar = document.getElementById('lose-bar');
const drawBar = document.getElementById('draw-bar');
const winValue = document.getElementById('win-value');
const loseValue = document.getElementById('lose-value');
const drawValue = document.getElementById('draw-value');
const cosmicMessageDisplay = document.createElement('div');

// Set up cosmic message element
cosmicMessageDisplay.className = 'cosmic-message';
cosmicMessageDisplay.style.fontSize = '1.3rem';
cosmicMessageDisplay.style.textAlign = 'center';
cosmicMessageDisplay.style.marginTop = '1.5rem';
cosmicMessageDisplay.style.padding = '1rem';
cosmicMessageDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
cosmicMessageDisplay.style.borderRadius = '10px';
cosmicMessageDisplay.style.boxShadow = '0 0 15px rgba(255, 255, 255, 0.3)';
cosmicMessageDisplay.style.animation = 'glow 2s infinite alternate';

// Add styles for the glow animation
const styleElement = document.createElement('style');
styleElement.textContent = `
@keyframes glow {
  from {
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(65, 105, 225, 0.3);
  }
  to {
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(65, 105, 225, 0.5);
  }
}

@keyframes twinkle {
  0% { opacity: 0.3; }
  50% { opacity: 1; }
  100% { opacity: 0.3; }
}

.star-emoji {
  display: inline-block;
  animation: twinkle 1.5s infinite;
  animation-delay: calc(var(--delay) * 0.5s);
}
`;
document.head.appendChild(styleElement);

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

// Reset game state
function resetGameState() {
    gameState.currentRound = 1;
    gameState.playerScore = 0;
    gameState.computerScore = 0;
    gameState.draws = 0;
    gameState.playerChoices = {
        rock: 0,
        paper: 0,
        scissors: 0
    };
    gameState.computerChoices = {
        rock: 0,
        paper: 0,
        scissors: 0
    };
    gameState.roundHistory = [];
}

// Validate and limit rounds input
function validateRoundsInput() {
    let rounds = parseInt(attemptsInput.value) || 5;
    // Limit to maximum 10 rounds
    if (rounds > 10) {
        rounds = 10;
        attemptsInput.value = 10;
    }
    return rounds;
}

// Generate cosmic ending message
function getCosmicEndingMessage() {
    const playerWon = gameState.playerScore > gameState.computerScore;
    const isDraw = gameState.playerScore === gameState.computerScore;
    
    // Arrays of cosmic themed phrases
    const intros = [
        "The cosmic battle has concluded! ",
        "As stardust settles across the universe, ",
        "The celestial competition has reached its end! ",
        "Written in the stars, your destiny is revealed: ",
        "The galactic contest has reached its finale! "
    ];
    
    const winPhrases = [
        "You shine brighter than a supernova! The cosmos crowns YOU as champion!",
        "Your cosmic energy has overwhelmed the digital entity! Victory is yours!",
        "The stars aligned in your favor! You've conquered the digital cosmos!",
        "Champion of the astral plane! Your stellar strategy prevailed!",
        "Your cosmic power radiates through the universe! The AI bows to your superiority!"
    ];
    
    const losePhrases = [
        "The cosmic AI has harnessed the power of the universe against you!",
        "The digital constellation outshined your cosmic strategy this time!",
        "The stars favored your silicon opponent in this galactic contest!",
        "The cosmic algorithm proved too powerful for this stellar battle!",
        "Better luck in your next journey through the digital cosmos!"
    ];
    
    const drawPhrases = [
        "A perfect cosmic balance! Neither entity could overpower the other!",
        "The stars couldn't decide a victor - your energies were perfectly matched!",
        "A stellar stalemate across the digital universe!",
        "The cosmic scales remain balanced - neither champion nor defeated!",
        "Two forces in perfect harmony, like binary stars orbiting each other!"
    ];
    
    // Pick random phrases
    const intro = intros[Math.floor(Math.random() * intros.length)];
    let outcome;
    
    if (isDraw) {
        outcome = drawPhrases[Math.floor(Math.random() * drawPhrases.length)];
    } else if (playerWon) {
        outcome = winPhrases[Math.floor(Math.random() * winPhrases.length)];
    } else {
        outcome = losePhrases[Math.floor(Math.random() * losePhrases.length)];
    }
    
    // Create message with twinkling star emojis
    let message = intro + outcome;
    
    // Add twinkling stars
    let messageWithStars = '';
    const starEmojis = ['✨', '🌟', '💫', '⭐'];
    
    for (let i = 0; i < 3; i++) {
        const starEmoji = starEmojis[Math.floor(Math.random() * starEmojis.length)];
        const delay = Math.random() * 3;
        messageWithStars += `<span class="star-emoji" style="--delay: ${delay}">${starEmoji}</span> `;
    }
    
    return messageWithStars + message + ' ' + messageWithStars;
}

// Start game
startBtn.addEventListener('click', () => {
    gameState.totalRounds = validateRoundsInput();
    resetGameState();
    
    // Update UI
    totalRoundsDisplay.textContent = gameState.totalRounds;
    currentRoundDisplay.textContent = gameState.currentRound;
    playerScoreDisplay.textContent = gameState.playerScore;
    computerScoreDisplay.textContent = gameState.computerScore;
    
    // Reset battle area
    playerChoiceDisplay.textContent = '';
    computerChoiceDisplay.textContent = '';
    roundResult.textContent = '';
    
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
        
        // Track choices
        gameState.playerChoices[playerChoice]++;
        gameState.computerChoices[computerChoice]++;
        
        // Display choices
        playerChoiceDisplay.textContent = choiceEmojis[playerChoice];
        computerChoiceDisplay.textContent = choiceEmojis[computerChoice];
        
        // Reset classes
        playerChoiceDisplay.className = 'player-choice';
        computerChoiceDisplay.className = 'computer-choice';
        
        // Determine the winner
        const result = determineWinner(playerChoice, computerChoice);
        
        // Store round result
        gameState.roundHistory.push({
            round: gameState.currentRound,
            playerChoice,
            computerChoice,
            result
        });
        
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
        
        // Check if all rounds are complete
        if (gameState.currentRound >= gameState.totalRounds) {
            // Show results after 1 second so player can see the final round result
            setTimeout(showResults, 1000);
        } else {
            // Move to next round after 1 second
            setTimeout(() => {
                // Increment round
                gameState.currentRound++;
                currentRoundDisplay.textContent = gameState.currentRound;
                
                // Reset UI for next round
                roundResult.textContent = '';
                playerChoiceDisplay.textContent = '';
                computerChoiceDisplay.textContent = '';
                playerChoiceDisplay.className = 'player-choice';
                computerChoiceDisplay.className = 'computer-choice';
            }, 1000);
        }
    });
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
    
    // Calculate win rate
    const winRate = (gameState.playerScore / gameState.totalRounds * 100).toFixed(1);
    winRateDisplay.textContent = `${winRate}%`;
    
    // Update choice statistics
    rockStatsDisplay.textContent = `Used: ${gameState.playerChoices.rock} times`;
    paperStatsDisplay.textContent = `Used: ${gameState.playerChoices.paper} times`;
    scissorsStatsDisplay.textContent = `Used: ${gameState.playerChoices.scissors} times`;
    
    // Create detailed summary
    let mostUsedChoice = 'none';
    let maxCount = 0;
    for (const [choice, count] of Object.entries(gameState.playerChoices)) {
        if (count > maxCount) {
            maxCount = count;
            mostUsedChoice = choice;
        }
    }
    
    // Generate summary text
    let summaryText = `You played ${gameState.totalRounds} rounds against the computer. `;
    
    if (gameState.playerScore > gameState.computerScore) {
        summaryText += `Congratulations! You won the battle with ${gameState.playerScore} victories versus ${gameState.computerScore} defeats. `;
    } else if (gameState.playerScore < gameState.computerScore) {
        summaryText += `Unfortunately, you lost the battle with ${gameState.playerScore} victories versus ${gameState.computerScore} defeats. `;
    } else {
        summaryText += `The battle ended in a draw with ${gameState.playerScore} victories each. `;
    }
    
    if (maxCount > 0) {
        summaryText += `Your favorite weapon was ${mostUsedChoice} which you used ${maxCount} times. `;
    }
    
    // Add a fun fact
    if (gameState.draws > gameState.totalRounds * 0.3) {
        summaryText += "You had a high number of draws - great minds think alike!";
    } else if (gameState.playerScore > gameState.totalRounds * 0.7) {
        summaryText += "Wow! You dominated this game. You're a natural strategist!";
    } else if (gameState.computerScore > gameState.totalRounds * 0.7) {
        summaryText += "The computer was on fire today! Better luck next time!";
    }
    
    resultDetailsDisplay.textContent = summaryText;
    
    // Update the bar chart
    const maxHeight = 180; // Maximum height for bars
    const maxValue = Math.max(gameState.playerScore, gameState.computerScore, gameState.draws);
    
    // Calculate heights based on values
    const winHeight = maxValue > 0 ? (gameState.playerScore / maxValue) * maxHeight : 0;
    const loseHeight = maxValue > 0 ? (gameState.computerScore / maxValue) * maxHeight : 0;
    const drawHeight = maxValue > 0 ? (gameState.draws / maxValue) * maxHeight : 0;
    
    // Set chart values
    winValue.textContent = gameState.playerScore;
    loseValue.textContent = gameState.computerScore;
    drawValue.textContent = gameState.draws;
    
    // Animate the bars
    setTimeout(() => {
        winBar.style.height = `${winHeight}px`;
        loseBar.style.height = `${loseHeight}px`;
        drawBar.style.height = `${drawHeight}px`;
    }, 100);
    
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
    
    // Add cosmic ending message
    cosmicMessageDisplay.innerHTML = getCosmicEndingMessage();
    // Find the right place to insert the cosmic message
    const statsSection = document.querySelector('.stats-grid') || document.querySelector('.stats');
    if (statsSection && statsSection.parentNode) {
        statsSection.parentNode.insertBefore(cosmicMessageDisplay, statsSection);
    } else {
        // Fallback: add to the result screen
        resultScreen.appendChild(cosmicMessageDisplay);
    }
    
    // Show result screen
    gameScreen.style.display = 'none';
    resultScreen.style.display = 'block';
}

// Add input validation for max rounds
attemptsInput.addEventListener('change', function() {
    let value = parseInt(this.value) || 5;
    // Enforce maximum of 10 rounds
    if (value > 10) {
        this.value = 10;
    }
});

// Initialize
createStars();