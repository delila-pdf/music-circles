const snippetCount = 5;
// snippet objects of a song
let snippets = [];
// randomize snippets each time
let colorSchemes = [
    ["#FFC19B", "#D3FF11", "#FF731E", "#04C7FF", "#D536FF"],
    ["#c2c1c5", "#a00068", "#26f4ff", "#0057FF", "#ff8cf1"],
    ["FF3B01", "316CF4", "FF5FDB", "000000", "FDDFE1"]
];
let containerNumbers = [0, 1, 2, 3, 4];
let circleBox = document.querySelector("#circle-box");

const gameStates = {
    initial: "start",
    listening: "listening",
    ordering: "ordering",
    checkorder: "checkorder"
};
let gameState = gameStates.initial;
//beginning gameState

const modal = document.querySelector("#modal");
const modalText = document.querySelector("#modaltext");

function hideModal() {
    setTimeout(() => {
        modal.style.display = "none";
        modalText.innerHTML = "";
    }, 300);
    modal.style.opacity = "0";
}

function displayModal(html) {
    modal.style.display = "block";
    modalText.innerHTML = html;
    setTimeout(() => modal.style.opacity = "1", 0);

}

modal.addEventListener("click", function () {
    switch (gameState) {
        case gameStates.initial:
            changeGameState(gameStates.listening);
            break;
        case gameStates.ordering:
            orderPhase();
            break;
        case gameStates.listening:
            break;
        default:
            break;
    }
});

function changeGameState(state) {
    let prevState = gameState;
    gameState = state;
    switch (gameState) {
        case gameStates.initial:
            break;
        case gameStates.listening:
            hideModal();
            initSong(0, 0);
            startTimer(1000, 10000, gameStates.ordering);
            break;
        case gameStates.ordering:
            document.querySelectorAll(".circle").forEach(c => c.style.transform = "scale(0)")
            displayModal(`<p> Now drag and drop the circles in the fitting order on the numbers</p>`);
            document.querySelector("#progress").style.width = "100%";
            document.querySelector("#sort-bar").style.display = "flex";
            break;
        default:
            break;
    }
}
//after clicking on modal


function initSong(songNumber, colorSchemeNumber) {
    // remove old song
    snippets = [];
    // randomize containers of circles
    containerNumbers.sort(() => {
        return Math.random() >= 0.5 ? 1 : -1;
    });

    createSnippets(songNumber, colorSchemeNumber);

    const bar = document.querySelector("#progress-bar");
    bar.addEventListener("click", orderPhase)
}

function createSnippets(songNumber, colorSchemeNumber) {
    // random colors
    colorSchemes[colorSchemeNumber].sort(() => {
        return Math.random() >= 0.5 ? 1 : -1;
    });
    //random container row
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
            isPlaying: false,
        });
        let snippet = snippets[i];
        buildCircle(circle, //id 
            colorSchemes[colorSchemeNumber][i], //color
            boxContainers[containerNumbers[i]], //order
            snippet); //
        buildAudio(snippet);
    }
}

function buildCircle(circle, color, boxContainer, snippet) {
    circle.setAttribute("class", "circle");
    circle.setAttribute("style", "background:" + color);

    setCircleSize(circle, createRandomDiameter(boxContainer));

    circle.addEventListener("click", function bounce() {
        if (!snippet.isPlaying) {
            // stop playing audio
            for (let i = 0; i < snippets.length; i++) {
                snippets[i].audio.load()
                snippets[i].isPlaying = false;
                snippets[i].circle.style.animationName = "none";
            };
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

function buildAudio(snippet) {
    snippet.audio.addEventListener("ended", function stopBouncingandPlaying() {
        snippet.isPlaying = false;
        snippet.circle.style.animationName = "none";
    });
    snippet.audio.setAttribute("src", snippet.path);
    snippet.audio.setAttribute("class", "audio");
}

function setCircleSize(circle, diameter) {
    circle.style.height = diameter + "px";
    circle.style.width = diameter + "px";
}

function createRandomDiameter(boxContainer) {
    const bounding = boxContainer.getBoundingClientRect();
    // random durchmesser
    let diameter = Math.random() * bounding.width;
    while (diameter < bounding.width * 0.4) {
        diameter = Math.random() * bounding.width;
    }
    return diameter;
}

function startTimer(initTime, alertTime, targetState) {
    document.querySelector("#progress").style.width = "100%";
    let remainingTime = initTime;
    var interval = setInterval(() => {
        remainingTime -= 1000;
        document.querySelector("#progress").style.width = (remainingTime / initTime) * 100 + "%";
        if (remainingTime === alertTime - 1000) {
            document.querySelector("#progress").style.transition.property = "background";
            document.querySelector("#progress").style.transition.duration = "0.5s";
            document.querySelector("#progress").style.background = "red";
        }
        if (remainingTime === 0) {
            clearInterval(interval);
            setTimeout(() => { changeGameState(targetState); }, 1000);
        }
    }, 1000);
}



function orderPhase() {
    hideModal();
    document.querySelectorAll(".circle").forEach(c => c.style.transform = "scale(1)");
    let rowLeft = document.querySelector("#row-left");
    let rowRight = document.querySelector("#row-right");
    let circles = document.querySelectorAll(".circle");

    // change to new circle layout

    circleBox.classList.add("dice");

    circles.forEach(c => circleBox.appendChild(c));
    circleBox.removeChild(rowLeft);
    circleBox.removeChild(rowRight);

    circles.forEach(c => {
        c.style.width = "25vw";
        c.style.height = "25vw";
    });


    // add top sort bar


    circles.forEach(c => {
        c.style.transition = "none";
    });

    const draggable = new Draggable.Draggable(document.querySelectorAll("#game"), {
        draggable: ".circle",
        delay: 0
    });

    draggable.on("drag:start", e => {
        console.log(e);
    });

    let targetSortContainer;
    let sortBarContainers = document.querySelectorAll(".sort-container");


    draggable.on("drag:move", e => {
        if (e.data.sensorEvent.data.target.getAttribute("class") == "sort-container") {
            targetSortContainer = e.data.sensorEvent.data.target;
            e.data.sensorEvent.data.target.append(draggable.mirror);
        } else {
            circleBox.append(draggable.mirror);
            targetSortContainer = null;
        }
    });

    draggable.on("drag:stop", e => {
        let circle = e.data.source;
        if (targetSortContainer != null) {
            circle.style += "z-index: -1;";
            targetSortContainer.append(circle);

            if ([...sortBarContainers].filter(e => e.childElementCount == 0).length == 0) {
                console.log("All in position");
                // diplayVerify()

            } else {
                console.log("Still ordering");
                // hideVerify
            }
        } else if (circle.parentNode.getAttribute("class") == "sort-container") {
            circleBox.append(circle);
        }
    });

    startTimer(30000, 5000, gameStates.checkorder);

}