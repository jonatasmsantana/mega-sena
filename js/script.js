let state = {
    board: [],
    currentGame: [],
    savedGames: []
};

function start(){
    readLocalStorage();
    createBoard();
    newGame();
}

function readLocalStorage(){
    if(!window.localStorage){
        return;
    }

    let savedGamesfromLocalStorage = window.localStorage.getItem('saved-games');

    if(savedGamesfromLocalStorage){
        state.savedGames = JSON.parse(savedGamesfromLocalStorage);
    }
}

function writeToLocalStorage(){
    window.localStorage.setItem('saved-games', JSON.stringify(state.savedGames));
}

function createBoard(){
    state.board = [];
    for(let i = 1; i <= 60; i++){
        state.board.push(i);
    }
}

function newGame(){
    resetGame();
    render();
}

function render(){
    renderBoard();
    renderButtons();
    renderSavedGames();
}

function renderBoard(){
    let divBoard = document.querySelector('#megasena-board');
    divBoard.innerHTML = '';

    let listOfNumbers = document.createElement('ul');
    listOfNumbers.classList.add("numbers-list");

    for(let i = 0; i < state.board.length; i++){
        let currentNumber = state.board[i];

        let itemFromListOfNumbers = document.createElement('li');
        itemFromListOfNumbers.classList.add("numbers");
        itemFromListOfNumbers.textContent = currentNumber;

        itemFromListOfNumbers.addEventListener("click", handleNumberClick);

        if(isNumberInGame(Number(currentNumber))){
            itemFromListOfNumbers.classList.add("selected-number");
        }

        listOfNumbers.appendChild(itemFromListOfNumbers);
    }

    divBoard.appendChild(listOfNumbers);
}

function handleNumberClick(event){

    let clickedNumber = Number(event.currentTarget.textContent);
    
    if(isNumberInGame(clickedNumber)){
        removeNumberFromGame(clickedNumber);
    } else{
        addNumberToGame(clickedNumber);
    }
    render();
    
}

function renderButtons(){
    let divButtons = document.querySelector('#megasena-buttons');
    divButtons.innerHTML = '';

    let buttonNewGame = createNewGameButton();
    let buttonRandomGame = createRandomGameButton();
    let buttonSaveGame = createSaveGameButton();

    divButtons.appendChild(buttonNewGame);
    divButtons.appendChild(buttonRandomGame);
    divButtons.appendChild(buttonSaveGame);
}

function createNewGameButton(){
    let button = document.createElement("button");
    button.textContent = "Novo Jogo";

    button.addEventListener("click", newGame);

    return button;
}

function createRandomGameButton(){
    let button = document.createElement("button");
    button.textContent = "Jogo aleatório";

    button.addEventListener("click", randomGame);

    return button;
}

function createSaveGameButton(){
    let button = document.createElement("button");
    button.textContent = "Salvar jogo";
    button.disabled = !isGameComplete();

    button.addEventListener("click", saveGame);

    return button;
}

function renderSavedGames(){
    let divSavedGames = document.querySelector("#megasena-saved-games");
    divSavedGames.innerHTML = '';

    if(state.savedGames.length === 0){
        divSavedGames.innerHTML = '<p>Nenhum jogo salvo ainda!</p>';
    }else{
        let ulSavedGames = document.createElement('ul');

        for(let i = 0; i < state.savedGames.length; i++){
            let currentGame = state.savedGames[i];

            let liGame = document.createElement('li');
            liGame.textContent = currentGame.join(' - ');

            ulSavedGames.appendChild(liGame);
        }

        divSavedGames.appendChild(ulSavedGames);
    }
}

function addNumberToGame(numberToAdd){
    if(numberToAdd < 1 || numberToAdd > 60){
        console.error("Número inválido", numberToAdd);
        return;
    }

    if(state.currentGame.length >= 6){
        console.error("O jogo já está completo");
        return;
    }

    if(isNumberInGame(numberToAdd)){
        console.error("Este número já foi selecionado!", numberToAdd);
        return;
    }
    state.currentGame.push(numberToAdd);
}

function removeNumberFromGame(numberToRemove){
    if(numberToRemove < 1 || numberToRemove > 60){
        console.error("Número inválido!", numberToRemove);
        return;
    }
    let newGame = [];
    for(let i = 0; i < state.currentGame.length; i++){
        
        let currentNumber = state.currentGame[i];
        
        if(currentNumber === numberToRemove){
            continue;
        }

        newGame.push(currentNumber);
    }

    state.currentGame = newGame;
}

function isNumberInGame(numberToCheck){
    return state.currentGame.includes(numberToCheck);
}

function isGameComplete(){
    return state.currentGame.length === 6;
}

function saveGame(){
    if(!isGameComplete()){
        console.error("Jogo incompleto!");
        return;
    }

    state.savedGames.push(state.currentGame);
    writeToLocalStorage();
    newGame();
}

function resetGame(){
    state.currentGame = [];
}

function randomGame(){
    resetGame();
    while(!isGameComplete()){
        let randomNumber = Math.ceil(Math.random() * 60);
        addNumberToGame(randomNumber);
    }
    render();
}
start();
