const snippetCount = 5;
// snippet objects of a song, containing order, path, circle, audio, isPlaying
let snippets = [];
// randomize it each time
let colorSchemes = [
    ["yellow", "cyan", "magenta", "black", "#0014ff"],
    ["red", "blue", "orange", "purple", "agua"]
];
let containerNumbers = [0, 1, 2, 3, 4];
let circleBox = document.querySelector("#circle-box");

const gameStates = {
    INITIAL: "start",
    LISTENING: "listening",
    ORDERING: "ordering"
};
let gameState = gameStates.INITIAL;

const modal = document.querySelector("#modal");

function hideModal() {
    modal.style.opacity = "0";
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

function revealModal(text) {
    modal.querySelector("div").innerHTML = text;
    modal.style.display = "flex";
    setTimeout(() => {
        modal.style.opacity = "0.8";
    }, 300);
}

modal.addEventListener("click", (e) => {
    switch (gameState) {
        case gameStates.INITIAL:
            changeGameState(gameStates.LISTENING);
            break;
        case gameStates.LISTENING:
            break;
        case gameStates.ORDERING:
            break;
        default:
            break;
    }
});

function changeGameState(state) {
    gameState = state;
    window.dispatchEvent(new Event("gameStateChanged"));
}

window.addEventListener("gameStateChanged", (e) => {
    switch (gameState) {
        case gameStates.INITIAL:
            break;
        case gameStates.LISTENING:
            hideModal();
            initSong(0, 0);
            startTimer(60000, 10000, gameStates.ORDERING);
            break;
        case gameStates.ORDERING:
            startOrderPhase();
            console.log("Switched state to ordering");
            break;
        default:
            break;
            // für was braucht man default hier? 
    }
});


function initSong(songNumber, colorSchemeNumber) {
    // remove old song
    snippets = [];
    // randomize containers
    containerNumbers.sort(() => {
        return Math.random() >= 0.5 ? 1 : -1;
    });

    createSnippets(songNumber, colorSchemeNumber);

    const bar = document.querySelector("#progress-bar");
    bar.addEventListener("click", () => startOrderPhase())
}

function createSnippets(songNumber, colorSchemeNumber) {
    // shuffle colors
    colorSchemes[colorSchemeNumber].sort(() => {
        return Math.random() >= 0.5 ? 1 : -1;
    });
    circleBox.style.flexDirection = Math.random() >= 0.5 ? "row-reverse" : "row";
    // create snippet objects
    const boxContainers = document.querySelectorAll(".box-container");
    for (let i = 0; i < snippetCount; i++) {
        let circle = document.createElement("div");
        let audio = document.createElement("audio");
        const path = `./songs/song_${songNumber}/snippet_${i}.mp3`;
        snippets.push({
            order: i,
            path: path,
            circle: circle,
            audio: audio,
            isPlaying: false
        });
        let snippet = snippets[i];
        buildCircle(circle, colorSchemes[colorSchemeNumber][i], boxContainers[containerNumbers[i]], snippet);
        buildAudio(snippet);
    }
}

function buildCircle(circle, color, boxContainer, snippet) {
    circle.setAttribute("class", "circle");
    circle.setAttribute("style", "background:" + color);

    setCirclePositionAndSize(circle, createRandomPositionAndSize(boxContainer));

    circle.addEventListener("click", e => {
        if (!snippet.isPlaying) {
            // stop playing audio
            snippets.forEach(s => {
                s.audio.load()
                s.isPlaying = false;
                s.circle.style.animationName = "none";
            });
            snippet.audio.play();
            snippet.isPlaying = true;
            circle.style.animationName = "bounce";
            circle.style.animationDuration = "0.5s";
            circle.style.animationIterationCount = "infinite";
        }
    });
    boxContainer.append(circle);
    setTimeout(() => { circle.style.transform = "scale(1)"; }, Math.random() * 300);
}

function setCirclePositionAndSize(circle, positionAndSize) {
    circle.style.left = positionAndSize.x + "px";
    circle.style.top = positionAndSize.y + "px";
    circle.style.height = positionAndSize.diameter + "px";
    circle.style.width = positionAndSize.diameter + "px";
}

function buildAudio(snippet) {
    snippet.audio.addEventListener("ended", e => {
        snippet.isPlaying = false;
        snippet.circle.style.animationName = "none";
    });
    snippet.audio.setAttribute("src", snippet.path);
    snippet.audio.setAttribute("class", "audio");
}

function createRandomPositionAndSize(boxContainer) {
    const bounding = boxContainer.getBoundingClientRect();
    // random diameter
    let diameter = Math.random() * bounding.width;
    while (diameter < bounding.width * 0.4) {
        diameter = Math.random() * bounding.width;
    }
    // random x
    let x = -1;
    while (x < 0) {
        x = Math.random() * bounding.width - diameter;
    }
    // random y
    let y = Math.random() * (bounding.height - diameter);

    return { x: x, y: y, diameter: diameter };
}

function startTimer(initTime, alertTime, targetState) {
    document.querySelector("#progress").style.width = "100%";
    let remainingTime = initTime;
    var interval = setInterval(() => {
        remainingTime -= 1000;
        document.querySelector("#progress").style.width = (remainingTime / initTime) * 100 + "%";
        if (remainingTime === alertTime - 1000) {
            document.querySelector("#progress").style.background = "red";
        }
        if (remainingTime === 0) {
            clearInterval(interval);
            setTimeout(() => { changeGameState(targetState); }, 1000);
        }
    }, 1000);
}

function startOrderPhase() {
    let rowLeft = document.querySelector("#row-left");
    let rowRight = document.querySelector("#row-right");
    let circles = document.querySelectorAll(".circle");

    circleBox.style.flexFlow = "column nowrap";

    rowLeft.style.height = "60%";
    rowLeft.style.width = "100%";

    rowRight.style.height = "40%";
    rowRight.style.width = "100%";

    circles.forEach(c => {
        c.style.top = "50%";
        c.style.left = "50%";
        c.style.transform = "translate(-50%, -50%)";
        c.style.width = "20vw";
        c.style.height = "20vw";
    });

}