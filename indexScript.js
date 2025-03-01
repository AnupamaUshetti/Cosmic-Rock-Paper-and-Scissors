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
    comboText.style.top = `${rect.top + window.scrollY -