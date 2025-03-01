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
    roundHistory: [],
    hasSeenIntro: false,
    comboCount: 0,
    lastWinner: null
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
const nextBtn = document.querySelector('.next-btn');

// Sound effects
const sounds = {
    click: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-mechanical-bling-210.mp3'),
    win: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-winning-chimes-2015.mp3'),
    lose: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-lose-2027.mp3'),
    draw: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-unlock-game-notification-253.mp3'),
    start: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magical-sweep-transition-3132.mp3'),
    finish: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-magic-sweep-game-trophy-257.mp3'),
    combo: new Audio('https://assets.mixkit.co/sfx/preview/mixkit-arcade-bonus-229.mp3')
};

// Try to preload sounds
for (const sound in sounds) {
    sounds[sound].load();
    // Set volume
    sounds[sound].volume = 0.5;
}

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

@keyframes floating {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}

.choice {
  animation: floating 3s ease-in-out infinite;
}

.choice:nth-child(2) {
  animation-delay: 0.5s;
}

.choice:nth-child(3) {
  animation-delay: 1s;
}

.combo-text {
  position: absolute;
  font-size: 2rem;
  font-weight: bold;
  color: #ff9800;
  text-shadow: 0 0 10px rgba(255, 152, 0, 0.8);
  animation: combo-animation 1s forwards;
  pointer-events: none;
  z-index: 10;
}

@keyframes combo-animation {
  0% { opacity: 0; transform: scale(0.5) translateY(0); }
  50% { opacity: 1; transform: scale(1.2) translateY(-20px); }
  100% { opacity: 0; transform: scale(1) translateY(-40px); }
}

.shooting-star {
  position: absolute;
  width: 4px;
  height: 80px;
  background: linear-gradient(180deg, rgba(255,255,255,0), rgba(255,255,255,1));
  animation: shooting 1s linear;
  opacity: 0;
}

@keyframes shooting {
  0% {
    transform: translateX(0) translateY(0) rotate(45deg);
    opacity: 1;
  }
  100% {
    transform: translateX(200px) translateY(200px) rotate(45deg);
    opacity: 0;
  }
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

// Create shooting stars
function createShootingStars() {
    const shootingStarsCount = 5;
    const container = document.querySelector('.stars');
    
    for (let i = 0; i < shootingStarsCount; i++) {
        setTimeout(() => {
            const shootingStar = document.createElement('div');
            shootingStar.classList.add('shooting-star');
            
            // Random position and angle
            const startX = Math.random() * 100;
            const startY = Math.random() * 100;
            const angle = Math.random() * 45 + 45; // 45-90 degrees
            
            shootingStar.style.left = `${startX}%`;
            shootingStar.style.top = `${startY}%`;
            shootingStar.style.transform = `rotate(${angle}deg)`;
            
            container.appendChild(shootingStar);
            
            // Remove after animation completes
            setTimeout(() => {
                shootingStar.remove();
            }, 1000);
        }, Math.random() * 10000); // Random timing within 10 seconds
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
    gameState.comboCount = 0;
    gameState.lastWinner = null;
}

// Validate and limit rounds input
function validateRoundsInput() {
    let rounds = parseInt(attemptsInput.value) || 5;
    // Limit to maximum 10 rounds
    if (rounds > 10) {
        rounds = 10;
        attemptsInput.value = 10;
    }
    
    // Minimum 1 round
    if (rounds < 1) {
        rounds = 1;
        attemptsInput.value = 1;
    }
    
    return rounds;
}

// Show combo text animation
function showComboText() {
    const comboText = document.createElement('div');
    comboText.className = 'combo-text';
    comboText.textContent = `${gameState.comboCount}x COMBO!`;
    
    // Position near the player choice
    const playerChoice = document.querySelector('.player-choice');
    const rect = playerChoice.getBoundingClientRect();
    
    comboText.style.left = `${rect.left + window.scrollX + rect.width/2 - 50}px`;
    comboText.style.top = `${rect.top + window.scrollY - 20}px`;
    
    document.body.appendChild(comboText);
    
    // Play combo sound
    sounds.combo.play();
    
    // Remove after animation completes
    setTimeout(() => {
        comboText.remove();
    }, 1000);
}

// Start game
function startGame() {
    // Play start sound
    sounds.start.play();
    
    // Set total rounds
    gameState.totalRounds = validateRoundsInput();
    
    // Update display
    totalRoundsDisplay.textContent = gameState.totalRounds;
    currentRoundDisplay.textContent = gameState.currentRound;
    playerScoreDisplay.textContent = gameState.playerScore;
    computerScoreDisplay.textContent = gameState.computerScore;
    
    // Hide setup screen, show game screen
    setupScreen.style.display = 'none';
    gameScreen.style.display = 'block';
    
    // Show intro message if not seen yet
    if (!gameState.hasSeenIntro) {
        showCosmicMessage("Welcome, cosmic warrior! The fate of the universe rests in your hands. Choose wisely!");
        gameState.hasSeenIntro = true;
    }
}

// Generate computer choice
function getComputerChoice() {
    const choices = ['rock', 'paper', 'scissors'];
    
    // Analyze player's past choices to make smarter decisions
    if (gameState.roundHistory.length > 0) {
        // Check if player has a pattern
        const playerChoices = gameState.roundHistory.map(round => round.playerChoice);
        
        // If player chose the same thing twice in a row, counter it
        if (playerChoices.length >= 2 && 
            playerChoices[playerChoices.length - 1] === playerChoices[playerChoices.length - 2]) {
            const lastChoice = playerChoices[playerChoices.length - 1];
            
            // Choose the counter to the player's likely next choice
            if (lastChoice === 'rock') return 'paper';
            if (lastChoice === 'paper') return 'scissors';
            if (lastChoice === 'scissors') return 'rock';
        }
        
        // Check most frequent choice
        const choiceCounts = {
            rock: gameState.playerChoices.rock,
            paper: gameState.playerChoices.paper,
            scissors: gameState.playerChoices.scissors
        };
        
        const mostFrequent = Object.keys(choiceCounts).reduce((a, b) => 
            choiceCounts[a] > choiceCounts[b] ? a : b);
        
        // 60% chance to counter the most frequent choice
        if (Math.random() < 0.6) {
            if (mostFrequent === 'rock') return 'paper';
            if (mostFrequent === 'paper') return 'scissors';
            if (mostFrequent === 'scissors') return 'rock';
        }
    }
    
    // Otherwise choose randomly
    return choices[Math.floor(Math.random() * choices.length)];
}

// Determine winner
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'draw';
    }
    
    if (
        (playerChoice === 'rock' && computerChoice === 'scissors') ||
        (playerChoice === 'paper' && computerChoice === 'rock') ||
        (playerChoice === 'scissors' && computerChoice === 'paper')
    ) {
        return 'player';
    }
    
    return 'computer';
}

// Handle player choice
function handleChoice(choice) {
    // Disable choice buttons
    choices.forEach(btn => {
        btn.style.pointerEvents = 'none';
    });
    
    // Update player choice stats
    gameState.playerChoices[choice]++;
    
    // Get computer choice
    const computerChoice = getComputerChoice();
    gameState.computerChoices[computerChoice]++;
    
    // Display choices
    playerChoiceDisplay.textContent = choiceEmojis[choice];
    computerChoiceDisplay.textContent = choiceEmojis[computerChoice];
    
    // Determine winner
    const winner = determineWinner(choice, computerChoice);
    
    // Update combo count
    if (winner === 'player') {
        if (gameState.lastWinner === 'player') {
            gameState.comboCount++;
            if (gameState.comboCount >= 2) {
                showComboText();
            }
        } else {
            gameState.comboCount = 1;
        }
        gameState.lastWinner = 'player';
    } else {
        gameState.comboCount = 0;
        gameState.lastWinner = winner;
    }
    
    // Update scores
    if (winner === 'player') {
        gameState.playerScore++;
        playerScoreDisplay.textContent = gameState.playerScore;
        
        // Apply winner/loser styling
        playerChoiceDisplay.classList.add('winner');
        computerChoiceDisplay.classList.add('loser');
        
        // Show win message
        roundResult.textContent = "You won this round!";
        roundResult.style.color = 'var(--win-color)';
        
        // Play win sound
        sounds.win.play();
    } else if (winner === 'computer') {
        gameState.computerScore++;
        computerScoreDisplay.textContent = gameState.computerScore;
        
        // Apply winner/loser styling
        computerChoiceDisplay.classList.add('winner');
        playerChoiceDisplay.classList.add('loser');
        
        // Show lose message
        roundResult.textContent = "The AI won this round!";
        roundResult.style.color = 'var(--lose-color)';
        
        // Play lose sound
        sounds.lose.play();
    } else {
        gameState.draws++;
        
        // Apply draw styling
        playerChoiceDisplay.classList.add('draw');
        computerChoiceDisplay.classList.add('draw');
        
        // Show draw message
        roundResult.textContent = "It's a draw!";
        roundResult.style.color = 'var(--draw-color)';
        
        // Play draw sound
        sounds.draw.play();
    }
    
    // Update round history
    gameState.roundHistory.push({
        round: gameState.currentRound,
        playerChoice: choice,
        computerChoice: computerChoice,
        winner: winner
    });
    
    // Show cosmic message based on result
    if (winner === 'player') {
        if (gameState.comboCount >= 3) {
            showCosmicMessage("Cosmic combo mastery! The stars align in your favor!");
        } else {
            const messages = [
                "The cosmic forces smile upon you!",
                "Your cosmic energy overpowers the AI!",
                "The stars align in your favor!",
                "Your celestial strategy prevails!"
            ];
            showCosmicMessage(messages[Math.floor(Math.random() * messages.length)]);
        }
    } else if (winner === 'computer') {
        const messages = [
            "The AI's quantum calculations were superior this time...",
            "The cosmic balance shifts to the AI!",
            "The stars have momentarily abandoned you...",
            "The AI tapped into dark cosmic energy!"
        ];
        showCosmicMessage(messages[Math.floor(Math.random() * messages.length)]);
    } else {
        const messages = [
            "A cosmic stalemate! The universe is in balance.",
            "Neither cosmic force prevails!",
            "Perfect equilibrium between human and machine!",
            "The cosmic scales are perfectly balanced."
        ];
        showCosmicMessage(messages[Math.floor(Math.random() * messages.length)]);
    }
    
    // Show next button
    nextBtn.style.display = 'block';
    
    // If last round, change button text
    if (gameState.currentRound === gameState.totalRounds) {
        nextBtn.textContent = "See Results";
    }
    
    // Ensure the game does not prematurely end
    if (gameState.currentRound < gameState.totalRounds) {
        gameState.currentRound++;
        currentRoundDisplay.textContent = gameState.currentRound;
    }

    // Show next button
    nextBtn.style.display = 'block';

    // If last round, change button text
    if (gameState.currentRound >= gameState.totalRounds) {
        nextBtn.textContent = "See Results";
    }
    
}

// Go to next round or show results
function nextRound() {
    // Hide next button
    nextBtn.style.display = 'none';

    // Ensure the game properly transitions between rounds
    if (gameState.currentRound >= gameState.totalRounds) {
        showResults();
    } else {
        // Allow next round to proceed
        choices.forEach(btn => {
            btn.style.pointerEvents = 'auto';
        });

        // Reset UI elements for the new round
        playerChoiceDisplay.textContent = '';
        computerChoiceDisplay.textContent = '';
        roundResult.textContent = '';

        // Update round display
        currentRoundDisplay.textContent = gameState.currentRound;
    }
}

// Show cosmic message
function showCosmicMessage(message) {
    // Clear previous message
    if (document.body.contains(cosmicMessageDisplay)) {
        document.body.removeChild(cosmicMessageDisplay);
    }
    
    // Add star emojis around the message
    let starMessage = "";
    const starEmojis = ["✨", "⭐", "💫"];
    
    for (let i = 0; i < 3; i++) {
        const starEmoji = document.createElement('span');
        starEmoji.textContent = starEmojis[i % starEmojis.length];
        starEmoji.className = 'star-emoji';
        starEmoji.style.setProperty('--delay', i);
        starMessage += starEmoji.outerHTML + " ";
    }
    
    starMessage += message;
    
    for (let i = 0; i < 3; i++) {
        const starEmoji = document.createElement('span');
        starEmoji.textContent = starEmojis[i % starEmojis.length];
        starEmoji.className = 'star-emoji';
        starEmoji.style.setProperty('--delay', i);
        starMessage += " " + starEmoji.outerHTML;
    }
    
    cosmicMessageDisplay.innerHTML = starMessage;
    
    // Add to game screen
    gameScreen.appendChild(cosmicMessageDisplay);
}

// Show results
function showResults() {
    // Play finish sound
    sounds.finish.play();
    
    // Hide game screen, show result screen
    gameScreen.style.display = 'none';
    resultScreen.style.display = 'block';
    
    // Update stats
    victoriesDisplay.textContent = gameState.playerScore;
    defeatsDisplay.textContent = gameState.computerScore;
    drawsDisplay.textContent = gameState.draws;
    
    // Calculate win rate
    const winRate = gameState.totalRounds === 0 ? 0 : 
        Math.round((gameState.playerScore / gameState.totalRounds) * 100);
    winRateDisplay.textContent = `${winRate}%`;
    
    // Update choice stats
    rockStatsDisplay.textContent = `Used: ${gameState.playerChoices.rock} times`;
    paperStatsDisplay.textContent = `Used: ${gameState.playerChoices.paper} times`;
    scissorsStatsDisplay.textContent = `Used: ${gameState.playerChoices.scissors} times`;
    
    // Set chart heights
    const maxHeight = 150; // Maximum bar height in pixels
    const maxValue = Math.max(gameState.playerScore, gameState.computerScore, gameState.draws);
    
    if (maxValue > 0) {
        const winHeight = (gameState.playerScore / maxValue) * maxHeight;
        const loseHeight = (gameState.computerScore / maxValue) * maxHeight;
        const drawHeight = (gameState.draws / maxValue) * maxHeight;
        
        winBar.style.height = `${winHeight}px`;
        loseBar.style.height = `${loseHeight}px`;
        drawBar.style.height = `${drawHeight}px`;
    }
    
    // Update chart values
    winValue.textContent = gameState.playerScore;
    loseValue.textContent = gameState.computerScore;
    drawValue.textContent = gameState.draws;
    
    // Determine final result
    let resultMessage;
    if (gameState.playerScore > gameState.computerScore) {
        resultMessage = "You Won the Cosmic Battle!";
        finalResult.style.color = 'var(--win-color)';
    } else if (gameState.playerScore < gameState.computerScore) {
        resultMessage = "The AI Won the Cosmic Battle!";
        finalResult.style.color = 'var(--lose-color)';
    } else {
        resultMessage = "The Cosmic Battle Ended in a Draw!";
        finalResult.style.color = 'var(--draw-color)';
    }
    finalResult.textContent = resultMessage;
    
    // Generate result details
    let detailsHTML = "<h3>Battle Analysis</h3>";
    
    // Add most used weapon
    const mostUsedWeapon = Object.keys(gameState.playerChoices).reduce((a, b) => 
        gameState.playerChoices[a] > gameState.playerChoices[b] ? a : b);
    detailsHTML += `<p>Your favorite weapon was ${choiceEmojis[mostUsedWeapon]} (${mostUsedWeapon}).</p>`;
    
    // Add round by round details
    detailsHTML += "<h3>Round by Round</h3>";
    detailsHTML += "<ul>";
    gameState.roundHistory.forEach((round, index) => {
        const roundNum = index + 1;
        const playerEmoji = choiceEmojis[round.playerChoice];
        const computerEmoji = choiceEmojis[round.computerChoice];
        let resultText;
        
        if (round.winner === 'player') {
            resultText = `<span style="color: var(--win-color)">You won</span>`;
        } else if (round.winner === 'computer') {
            resultText = `<span style="color: var(--lose-color)">AI won</span>`;
        } else {
            resultText = `<span style="color: var(--draw-color)">Draw</span>`;
        }
        
        detailsHTML += `<li>Round ${roundNum}: ${playerEmoji} vs ${computerEmoji} - ${resultText}</li>`;
    });
    detailsHTML += "</ul>";
    
    // Add cosmic analysis
    detailsHTML += "<h3>Cosmic Analysis</h3>";
    if (winRate >= 75) {
        detailsHTML += "<p>The cosmos has chosen you as its champion! Your strategic prowess is off the charts!</p>";
    } else if (winRate >= 50) {
        detailsHTML += "<p>Your cosmic energy is strong! With more practice, you could become a legendary warrior.</p>";
    } else if (winRate >= 25) {
        detailsHTML += "<p>The stars see potential in you, but your cosmic strategies need refinement.</p>";
    } else {
        detailsHTML += "<p>Your cosmic energy is dormant. Fear not, with practice, you can unlock your true potential!</p>";
    }
    
    resultDetailsDisplay.innerHTML = detailsHTML;
}

function playAgain() {
    // Play click sound
    sounds.click.play();
    
    // Reset game state
    resetGameState();
    
    // Hide result screen, show setup screen
    resultScreen.style.display = 'none';
    setupScreen.style.display = 'block';

    // Reset input field
    attemptsInput.value = 5; // Default value
}


// Event listeners
window.addEventListener('load', () => {
    createStars();
    setInterval(createShootingStars, 10000);
});

startBtn.addEventListener('click', () => {
    sounds.click.play();
    startGame();
});

choices.forEach(choice => {
    choice.addEventListener('click', () => {
        sounds.click.play();
        handleChoice(choice.dataset.choice);
    });
});

nextBtn.addEventListener('click', () => {
    sounds.click.play();
    nextRound();
});

playAgainBtn.addEventListener('click', playAgain);

// Input validation
attemptsInput.addEventListener('input', validateRoundsInput);