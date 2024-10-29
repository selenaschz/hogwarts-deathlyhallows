window.addEventListener("load", () => {
    changeColor();

    //-- Main Menu --
    const menu = document.getElementById("main-menu");
    const gameTitle = document.getElementById("game-title");

    //--Game container--
    const gameScreen = document.getElementById("game-container");

    //-- Menu Options:--
    const storyBt = document.getElementById("story-bt");
    const instructionsBt = document.getElementById("instructions-bt");
    const startTestBt = document.getElementById("start-test-bt");

    //--Game Story--
    const story = document.getElementById("game-story");
    const closeBts = document.querySelectorAll(".close-bt");

    //--Instructions--
    const instructions = document.getElementById("instructions");
    
    //-- House Test --
    const houseTest = document.getElementById("house-test");
    const braveryBt = document.getElementById("bravery");
    const lealtyBt = document.getElementById("loyalty");
    const intelligenceBt = document.getElementById("intelligence");
    const ambitionBt = document.getElementById("ambition");

    //-- Event Listeners --
    //Go to the game story screen:
    storyBt.addEventListener("click", () => {
        menu.classList.add("hidden");
        story.classList.remove("hidden");
    })

    //Return to the main menu:
    closeBts.forEach(button => {
        button.addEventListener("click", () => {
            story.classList.add("hidden");
            instructions.classList.add("hidden");
            houseTest.classList.add("hidden");
            menu.classList.remove("hidden");
        })
    });
    

    //Go to the instructions screen:
    instructionsBt.addEventListener("click", () => {
        menu.classList.add("hidden");
        instructions.classList.remove("hidden");
    })

    //Go to the house test screen:
    startTestBt.addEventListener("click", () => {
        menu.classList.add("hidden");
        houseTest.classList.remove("hidden");
    })

    //Variable to store the chosen house
    let house;
    const houseAudio = new Audio();

    braveryBt.addEventListener("click", () => {
        house = "gryffindor";
        houseAudio.src = `/assets/audio/houses/${house}.mp3`;
        houseAudio.play();
        startGame(house);
        
    })

    lealtyBt.addEventListener("click", () => {
        house = "hufflepuff";
        houseAudio.src = `/assets/audio/houses/${house}.mp3`;
        houseAudio.play();
        startGame(house);
    })

    intelligenceBt.addEventListener("click", () => {
        house = "ravenclaw";
        houseAudio.src = `/assets/audio/houses/${house}.mp3`;
        houseAudio.play();
        startGame(house);
    })

    ambitionBt.addEventListener("click", () => {
        house = "slytherin";
        houseAudio.src = `/assets/audio/houses/${house}.mp3`;
        houseAudio.play();
        startGame(house);
    })

    //Function Start Game
    function startGame(house) {
        const game = new Game("canvas-game", house);
        houseTest.classList.add("hidden");
        gameScreen.classList.remove("hidden");
        game.start();

        document.addEventListener("keydown", event => {
            game.onKeyEvent(event);
        } );
    
        document.addEventListener("keyup", event => {
            game.onKeyEvent(event);
        })
    }

    //Function: Change h1 color
    function changeColor() {
        setInterval(() => {
            gameTitle.classList.toggle("navy-blue");
        }, 1000)
        
    }


    
})