let walletAmount = 0;
let betAmount = 0;
let gameRunning = false;
let jetMultiplier = 1.00;
let highestMultiplier = 1.00;
let interval;

const walletDisplay = document.getElementById('walletAmount');
const jetMultiplierDisplay = document.getElementById('jetMultiplier');
const highestMultiplierDisplay = document.getElementById('highestMultiplier');
const message = document.getElementById('message');
const betButton = document.getElementById('betButton');
const cashOutButton = document.getElementById('cashOutButton');
const addMoneyButton = document.getElementById('addMoney');
const signUpForm = document.getElementById('signUpForm');

addMoneyButton.addEventListener('click', addMoney);
betButton.addEventListener('click', placeBet);
cashOutButton.addEventListener('click', cashOut);
signUpForm.addEventListener('submit', signUp);

function addMoney() {
    const amount = prompt('Enter amount to add:');
    walletAmount += parseFloat(amount);
    updateWallet();
}

function placeBet() {
    if (!gameRunning) {
        betAmount = prompt('Enter bet amount:');
        if (betAmount > walletAmount) {
            message.textContent = 'Insufficient funds!';
            return;
        }
        walletAmount -= betAmount;
        updateWallet();
        startGame();
    }
}

function cashOut() {
    if (gameRunning) {
        const winnings = betAmount * jetMultiplier;
        walletAmount += winnings;
        updateWallet();
        message.textContent = `You cashed out at x${jetMultiplier.toFixed(2)} and won ${winnings.toFixed(2)} KES!`;
        betAmount = 0; // Reset bet amount after cashing out
    }
}

function startGame() {
    gameRunning = true;
    jetMultiplier = 1.00;
    highestMultiplier = 1.00;
    betButton.disabled = true;
    cashOutButton.disabled = false;
    message.textContent = 'Game started!';

    interval = setInterval(() => {
        jetMultiplier += 0.1;
        if (jetMultiplier > highestMultiplier) {
            highestMultiplier = jetMultiplier;
        }
        jetMultiplierDisplay.textContent = `x${jetMultiplier.toFixed(2)}`;
        highestMultiplierDisplay.textContent = `Highest Multiplier: x${highestMultiplier.toFixed(2)}`;
        if (Math.random() < 0.1) { // 10% chance to end the game
            clearInterval(interval);
            gameRunning = false;
            betButton.disabled = false;
            cashOutButton.disabled = true;
            message.textContent = `Game ended automatically at x${jetMultiplier.toFixed(2)}. Highest Multiplier was x${highestMultiplier.toFixed(2)}.`;
            setTimeout(resetGame, 3000); // Wait 3 seconds before resetting the game
        }
    }, 1000);

    setTimeout(() => {
        if (gameRunning) {
            clearInterval(interval);
            gameRunning = false;
            betButton.disabled = false;
            cashOutButton.disabled = true;
            message.textContent = `Game ended after 30 seconds at x${jetMultiplier.toFixed(2)}. Highest Multiplier was x${highestMultiplier.toFixed(2)}.`;
            setTimeout(resetGame, 3000); // Wait 3 seconds before resetting the game
        }
    }, 30000); // Auto end after 30 seconds
}

function resetGame() {
    message.textContent = 'Game will restart in 30 seconds...';
    setTimeout(startGame, 30000); // Restart the game after 30 seconds
}

function updateWallet() {
    walletDisplay.textContent = walletAmount.toFixed(2);
}

async function signUp(event) {
    event.preventDefault();
    const phone = signUpForm.phone.value;
    const otp = signUpForm.otp.value;

    try {
        const response = await fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone, otp }),
        });

        if (response.ok) {
            message.textContent = 'Sign up successful!';
            document.getElementById('signUpModal').style.display = 'none';
        } else {
            message.textContent = 'Sign up failed!';
        }
    } catch (error) {
        console.error('Error:', error);
        message.textContent = 'An error occurred!';
    }
}
