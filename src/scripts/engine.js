const state = {
    view: {
        squares: document.querySelectorAll('.square'),
        enemy: document.querySelector('.enemy'),
        timeLeft: document.querySelector('#time-left'),
        score: document.querySelector('#score'),
        lifes: document.querySelector('#lifes'),
        retry: document.querySelector('#retry'),
        panel: document.querySelector('.panel'),
        feedback: document.querySelector('.feedback'),
        feedbackMsg: document.querySelector('#feedback-msg'),
    },
    values: {
        gameVelocity: 1000,
        hitPosition: 0,
        result: 0,
        currentTime: 60,
        lifesLeft: 3,
        feedbackMsg: ''
    },
    actions: {
        timerId: null,
        countDownTimerId: null,
    }
}

function initialize() {
    addListenerHitbox();
    addListenerRetry();

    state.actions.timerId = setInterval(randomSquare, 1000);
    state.actions.countDownTimerId = setInterval(countDown, 1000);
}

function playSound(audioName, stop = false) {
    let audio = new Audio(`./src/audios/${audioName}.m4a`);

    audio.volume = 0.4;

    if (stop) {
        audio.pause();
        audio.currentTime = 0;
    } else {
        audio.play();
    }    
}

function countDown() {
    state.values.currentTime--;
    state.view.timeLeft.textContent = state.values.currentTime;

    if (state.values.currentTime === 13) {
        playSound('countdown');
    }

    if (state.values.currentTime <= 0) {
        gameOver();
    }
}

function randomSquare() {
    state.view.squares.forEach(
        (square) => square.classList.remove('enemy')
    );

    const randomNumber = Math.floor(Math.random() * 9);
    const randomSquare = state.view.squares[randomNumber];

    randomSquare.classList.add('enemy');
    state.values.hitPosition = randomSquare.id;
}

function addListenerHitbox() {
    state.view.squares.forEach((square) => {
        square.addEventListener('mousedown', hit, false);
    })
}

function hit(event) {
    const idClickado = event.target.id;

    if (idClickado === state.values.hitPosition) {
        state.values.result++;
        state.view.score.textContent = state.values.result;
        state.values.hitPosition = null;
        playSound('pew');
    } else {
        const randomNumber = Math.floor(Math.random() * 2) +1;
        playSound(`errou${randomNumber}`);
        removeLifes();
    }
}

function removeLifes() {
    state.values.lifesLeft--;
    state.view.lifes.textContent = `x${state.values.lifesLeft}`;

    if (state.values.lifesLeft <= 0) {
        gameOver();
    }
}

function gameOver() {
    playSound('gameover');

    clearInterval(state.actions.countDownTimerId);
    clearInterval(state.actions.timerId);
    
    state.values.feedbackMsg = `O seu resultado foi ${state.values.result}!!`;
    state.view.feedbackMsg.textContent = state.values.feedbackMsg;

    state.view.feedback.classList.remove('hide');

    state.values.currentTime = 1;
    state.view.retry.removeAttribute('hidden');

    state.view.squares.forEach((square) => {
        square.removeEventListener('mousedown', hit, false);
        square.classList.remove('enemy');
    });

    state.view.squares[4].classList.add('enemy');
}

function addListenerRetry() {
    state.view.retry.addEventListener('click', retry);
}

function retry() {
    document.location.reload();
}

initialize()