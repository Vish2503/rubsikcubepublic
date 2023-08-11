import { Raycaster, Vector2 } from "three"
import { createWorld, generateScramble, getCubeString, getNotation, move, notationPositions, rubiksCube, setAnimationSpeed, world } from "./src/RubiksCube"

const container = document.querySelector("#scene-container")
createWorld(container)

let cubestring
let firstNotation

let pieces = []

// document.addEventListener("DOMContentLoaded", async () => {
//     setAnimationSpeed(1000)
//     await move("x2")
//     await move("y")
//     setAnimationSpeed()
//     firstNotation = getNotation()
//     Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
// })

// document.addEventListener("keyup", async () => {
//     // let scramble = generateScramble()
//     // setAnimationSpeed(220)
//     // for (let moves of scramble) {
//     //     await move(moves)
//     // }
//     firstNotation = getNotation()
//     Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
//     //await move("M")
//     //pieces = [getPositionByNotation("U"), getPositionByNotation("F")];
//     //highlightPieces(pieces)
//     //console.log(pieces);
// })


function introduction() {
    const infoHeader = document.querySelector("#info-header")
    const infoPara = document.querySelector("#info-para")
    const next = document.querySelector("#next")
    const previous = document.querySelector("#previous")
    const moveName = document.querySelector("#move")

    infoHeader.innerHTML = "INTRODUCTION"
    infoPara.innerHTML = "This is an introduction to the rubiks cube!"
    function first() {
        // if we use > to come to this function we need to remove these listeners
        next.removeEventListener("click", first)
        // if we use < to get to this function we need to remove these listeners
        previous.removeEventListener("click", first)
        next.removeEventListener("click", third)

        revertHighlight(pieces)
        pieces.length = 0;
        // this will push whatever is in the top layer to be highlighted
        (Object.keys(firstNotation).filter(key => (key.includes("U")))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "LAYERS: Top Layer"
        infoPara.innerHTML = "There are three layers in a 3x3 Rubik's Cube. The highlighted pieces make up the top layer."

        // now add the next one which needs to be gone to on click
        next.addEventListener("click", second)
    }
    function second() {
        next.removeEventListener("click", second)

        previous.removeEventListener("click", second)
        next.removeEventListener("click", fourth)
        
        revertHighlight(pieces)
        pieces.length = 0;
        // this will push whatever is in the middle layer to be highlighted
        (Object.keys(firstNotation).filter(key => !(key.includes("U") || key.includes("D")))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "LAYERS: Middle Layer"
        infoPara.innerHTML = "There are three layers in a 3x3 Rubik's Cube. The highlighted pieces make up the middle layer."

        previous.addEventListener("click", first)
        next.addEventListener("click", third)
    }
    function third() {
        previous.removeEventListener("click", first)
        next.removeEventListener("click", third)

        previous.removeEventListener("click", third)
        next.removeEventListener("click", fifth)

        revertHighlight(pieces)
        pieces.length = 0;
        // this will push whatever is in the bottom layer to be highlighted
        (Object.keys(firstNotation).filter(key => (key.includes("D")))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "LAYERS: Bottom Layer"
        infoPara.innerHTML = "There are three layers in a 3x3 Rubik's Cube. The highlighted pieces make up the bottom layer."

        previous.addEventListener("click", second)
        next.addEventListener("click", fourth)
    }
    function fourth() {
        previous.removeEventListener("click", second)
        next.removeEventListener("click", fourth)

        previous.removeEventListener("click", fourth)
        next.removeEventListener("click", sixth)

        revertHighlight(pieces)
        infoHeader.innerHTML = "FACES"
        infoPara.innerHTML = "There are six faces on a Rubik's Cube. Each colored side of the cube makes up a single face."

        previous.addEventListener("click", third)
        next.addEventListener("click", fifth)
    }
    function fifth() {
        previous.removeEventListener("click", third)
        next.removeEventListener("click", fifth)

        previous.removeEventListener("click", fifth)
        next.removeEventListener("click", seventh)

        revertHighlight(pieces)
        pieces.length = 0;
        // this will push centers to pieces for highighting
        (Object.keys(firstNotation).filter(key => (key.length === 1))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "CENTERS"
        infoPara.innerHTML = "These pieces have one color. There are six of them on a cube, one for each side. Center pieces are fixed to the core of the cube and do not move, hence we solve the rest of the face with respect to the center piece. Note that the following colors will always stay opposite to each other in a cube: White & Yellow, Blue & Green and Red & Orange"

        previous.addEventListener("click", fourth)
        next.addEventListener("click", sixth)
    }
    function sixth() {
        previous.removeEventListener("click", fourth)
        next.removeEventListener("click", sixth)

        previous.removeEventListener("click", sixth)
        next.removeEventListener("click", eighth)

        revertHighlight(pieces)
        pieces.length = 0;
        // this will push centers to pieces for highighting
        (Object.keys(firstNotation).filter(key => (key.length === 2))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "EDGES"
        infoPara.innerHTML = "These pieces have two colors on them. There are 12 edge pieces on a cube."

        previous.addEventListener("click", fifth)
        next.addEventListener("click", seventh)
    }
    function seventh() {
        previous.removeEventListener("click", fifth)
        next.removeEventListener("click", seventh)

        previous.removeEventListener("click", seventh)
        next.removeEventListener("click", ninth)

        revertHighlight(pieces)
        pieces.length = 0;
        // this will push centers to pieces for highighting
        (Object.keys(firstNotation).filter(key => (key.length === 3))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "CORNERS"
        infoPara.innerHTML = "These pieces have three colors on them. There are 8 corner pieces on a cube."

        previous.addEventListener("click", sixth)
        next.addEventListener("click", eighth)
    }
    async function eighth(){
        previous.removeEventListener("click", sixth)
        next.removeEventListener("click", eighth)

        previous.removeEventListener("click", eighth)
        next.removeEventListener("click", tenth)

        revertHighlight(pieces)
        pieces.length = 0
        Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
        highlightPieces(pieces)
        infoHeader.innerHTML = "MOVES: UP (U)"
        infoPara.innerHTML = "Moves are universal notations used to denote turns for each of the faces. Moves are represented by the first letter of the face and sometimes with an apostrophe or a 2 beside it. Moves are always a 1/4 face rotation. A move with nothing beside it represents a clockwise rotation on its face axis, a move with an apostrophe represents an anti-clockwise rotation on its face axis and a 2 represents 180 degree rotation."
        moveName.innerHTML = "U"
        await move("U")
        await delay(1000)
        moveName.innerHTML = "U'"
        await move("U'")
        await delay(1000)
        moveName.innerHTML = "U2"
        await move("U2")
        await delay(1000)
        moveName.innerHTML = ""
        setAnimationSpeed(1000)
        await move("U2")
        setAnimationSpeed()

        previous.addEventListener("click", seventh)
        next.addEventListener("click", ninth)
    }
    async function ninth(){
        previous.removeEventListener("click", seventh)
        next.removeEventListener("click", ninth)

        previous.removeEventListener("click", ninth)
        next.removeEventListener("click", eleventh)

        revertHighlight(pieces)
        pieces.length = 0
        Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
        highlightPieces(pieces)
        infoHeader.innerHTML = "MOVES: DOWN (D)"
        infoPara.innerHTML = "Moves are universal notations used to denote turns for each of the faces. Moves are represented by the first letter of the face and sometimes with an apostrophe or a 2 beside it. Moves are always a 1/4 face rotation. A move with nothing beside it represents a clockwise rotation on its face axis, a move with an apostrophe represents an anti-clockwise rotation on its face axis and a 2 represents 180 degree rotation."
        moveName.innerHTML = "D"
        await move("D")
        await delay(1000)
        moveName.innerHTML = "D'"
        await move("D'")
        await delay(1000)
        moveName.innerHTML = "D2"
        await move("D2")
        await delay(1000)
        moveName.innerHTML = ""
        setAnimationSpeed(1000)
        await move("D2")
        setAnimationSpeed()

        previous.addEventListener("click", eighth)
        next.addEventListener("click", tenth)
    }
    async function tenth(){
        previous.removeEventListener("click", eighth)
        next.removeEventListener("click", tenth)

        previous.removeEventListener("click", tenth)
        next.removeEventListener("click", twelfth)

        revertHighlight(pieces)
        pieces.length = 0
        Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
        highlightPieces(pieces)
        infoHeader.innerHTML = "MOVES: LEFT (L)"
        infoPara.innerHTML = "Moves are universal notations used to denote turns for each of the faces. Moves are represented by the first letter of the face and sometimes with an apostrophe or a 2 beside it. Moves are always a 1/4 face rotation. A move with nothing beside it represents a clockwise rotation on its face axis, a move with an apostrophe represents an anti-clockwise rotation on its face axis and a 2 represents 180 degree rotation."
        moveName.innerHTML = "L"
        await move("L")
        await delay(1000)
        moveName.innerHTML = "L'"
        await move("L'")
        await delay(1000)
        moveName.innerHTML = "L2"
        await move("L2")
        await delay(1000)
        moveName.innerHTML = ""
        setAnimationSpeed(1000)
        await move("L2")
        setAnimationSpeed()

        previous.addEventListener("click", ninth)
        next.addEventListener("click", eleventh)
    }
    async function eleventh(){
        previous.removeEventListener("click", ninth)
        next.removeEventListener("click", eleventh)

        previous.removeEventListener("click", eleventh)
        next.removeEventListener("click", thirteenth)

        revertHighlight(pieces)
        pieces.length = 0
        Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
        highlightPieces(pieces)
        infoHeader.innerHTML = "MOVES: RIGHT (R)"
        infoPara.innerHTML = "Moves are universal notations used to denote turns for each of the faces. Moves are represented by the first letter of the face and sometimes with an apostrophe or a 2 beside it. Moves are always a 1/4 face rotation. A move with nothing beside it represents a clockwise rotation on its face axis, a move with an apostrophe represents an anti-clockwise rotation on its face axis and a 2 represents 180 degree rotation."
        moveName.innerHTML = "R"
        await move("R")
        await delay(1000)
        moveName.innerHTML = "R'"
        await move("R'")
        await delay(1000)
        moveName.innerHTML = "R2"
        await move("R2")
        await delay(1000)
        moveName.innerHTML = ""
        setAnimationSpeed(1000)
        await move("R2")
        setAnimationSpeed()

        previous.addEventListener("click", tenth)
        next.addEventListener("click", twelfth)
    }
    async function twelfth(){
        previous.removeEventListener("click", tenth)
        next.removeEventListener("click", twelfth)

        previous.removeEventListener("click", twelfth)

        revertHighlight(pieces)
        pieces.length = 0
        Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
        highlightPieces(pieces)
        infoHeader.innerHTML = "MOVES: FRONT (F)"
        infoPara.innerHTML = "Moves are universal notations used to denote turns for each of the faces. Moves are represented by the first letter of the face and sometimes with an apostrophe or a 2 beside it. Moves are always a 1/4 face rotation. A move with nothing beside it represents a clockwise rotation on its face axis, a move with an apostrophe represents an anti-clockwise rotation on its face axis and a 2 represents 180 degree rotation."
        moveName.innerHTML = "F"
        await move("F")
        await delay(1000)
        moveName.innerHTML = "F'"
        await move("F'")
        await delay(1000)
        moveName.innerHTML = "F2"
        await move("F2")
        await delay(1000)
        moveName.innerHTML = ""
        setAnimationSpeed(1000)
        await move("F2")
        setAnimationSpeed()

        previous.addEventListener("click", eleventh)
        next.addEventListener("click", thirteenth)
    }
    async function thirteenth(){
        previous.removeEventListener("click", eleventh)
        next.removeEventListener("click", thirteenth)

        revertHighlight(pieces)
        pieces.length = 0
        Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
        highlightPieces(pieces)
        infoHeader.innerHTML = "MOVES: BACK (B)"
        infoPara.innerHTML = "Moves are universal notations used to denote turns for each of the faces. Moves are represented by the first letter of the face and sometimes with an apostrophe or a 2 beside it. Moves are always a 1/4 face rotation. A move with nothing beside it represents a clockwise rotation on its face axis, a move with an apostrophe represents an anti-clockwise rotation on its face axis and a 2 represents 180 degree rotation."
        moveName.innerHTML = "B"
        await move("B")
        await delay(1000)
        moveName.innerHTML = "B'"
        await move("B'")
        await delay(1000)
        moveName.innerHTML = "B2"
        await move("B2")
        await delay(1000)
        moveName.innerHTML = ""
        setAnimationSpeed(1000)
        await move("B2")
        setAnimationSpeed()

        previous.addEventListener("click", twelfth)
    }
    next.addEventListener("click", first)

    function keyboardControls(event){
        if (event.key == "ArrowRight") {
            next.click()
        } else if (event.key == "ArrowLeft") {
            previous.click()
        }
    }
    document.addEventListener('keyup', keyboardControls)
}

let allFaces 
let selectedFace
async function getUserCube() {
    await delay(1000)
    firstNotation = getNotation()
    Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
    revertHighlight(pieces)
    pieces.length = 0
    const centers = ["U", "D", "F", "B", "R", "L"]
    centers.forEach(element => {
        pieces.push(getPositionByNotation(element))
    })
    highlightPieces(pieces)

    
    const pointer = new Vector2()
    const raycaster = new Raycaster()

    
    const whiteButton = document.querySelector("#whiteButton")
    const redButton = document.querySelector("#redButton")
    const greenButton = document.querySelector("#greenButton")
    const yellowButton = document.querySelector("#yellowButton")
    const orangeButton = document.querySelector("#orangeButton")
    const blueButton = document.querySelector("#blueButton")
    const finished = document.querySelector("#finished")

    let selectedColor
    function selectFace(event) {
        pointer.x = -1 + 2 * (event.offsetX) / container.clientWidth;
        pointer.y = 1 - 2 * (event.offsetY) / container.clientHeight;
        raycaster.setFromCamera( pointer, world.camera );
        try {
            const intersects = raycaster.intersectObjects(allFaces);
            if (selectedFace) {
                selectedFace.material.color.set(0x555555)
            }
            selectedFace = intersects[0].object
            if (selectedColor) {
                selectedFace.material.color.set(selectedColor)
                selectedFace = undefined
            } else {
                selectedFace.material.color.set(0x999999)
            }
        } catch (error) {}
    }

    whiteButton.addEventListener("click", () => {
        if (!selectedColor) {
            selectedColor = 0xFFFFFF
        } else {
            selectedColor = undefined
        }
        if (selectedFace) {
            selectedFace.material.color.set(selectedColor)
            selectedFace = undefined
        }
    })
    redButton.addEventListener("click", () => {
        if (!selectedColor) {
            selectedColor = 0xFF0000
        } else {
            selectedColor = undefined
        }
        if (selectedFace) {
            selectedFace.material.color.set(0xFF0000)
            selectedFace = undefined
        }
    })
    greenButton.addEventListener("click", () => {
        if (!selectedColor) {
            selectedColor = 0x00FF00
        } else {
            selectedColor = undefined
        }
        if (selectedFace) {
            selectedFace.material.color.set(selectedColor)
            selectedFace = undefined
        }
    })
    orangeButton.addEventListener("click", () => {
        if (!selectedColor) {
            selectedColor = 0xFFA500
        } else {
            selectedColor = undefined
        }
        if (selectedFace) {
            selectedFace.material.color.set(selectedColor)
            selectedFace = undefined
        }
    })
    blueButton.addEventListener("click", () => {
        if (!selectedColor) {
            selectedColor = 0x0000FF
        } else {
            selectedColor = undefined
        }
        if (selectedFace) {
            selectedFace.material.color.set(selectedColor)
            selectedFace = undefined
        }
    })
    yellowButton.addEventListener("click", () => {
        if (!selectedColor) {
            selectedColor = 0xFFFF00
        } else {
            selectedColor = undefined
        }
        if (selectedFace) {
            selectedFace.material.color.set(selectedColor)
            selectedFace = undefined
        }
    })

    window.addEventListener('click', selectFace);

    function userFinished() {
        let faces = getCubeString()
        if(faces.includes("E")) {
            console.log("not finished");
        }
    }
    finished.addEventListener("click", userFinished)
}

let beforeHighlight = []
function highlightPieces(pieces) {
    beforeHighlight = []
    allFaces = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                if (pieces.includes([i-1,j-1,k-1].join())) {
                    continue
                } else {
                    for (let w = 0; w < 6; w++) {
                        allFaces.push(rubiksCube.pieces[i][j][k].faces[w])
                        beforeHighlight.push(rubiksCube.pieces[i][j][k].faces[w].material.color.getHex())
                        rubiksCube.pieces[i][j][k].faces[w].material.color.set(0x555555)
                    }
                }
            }
        }
    }
}

function revertHighlight(pieces) {
    let count = 0
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                if (pieces.includes([i-1,j-1,k-1].join())) {
                    continue
                } else {
                    for (let w = 0; w < 6; w++) {
                        rubiksCube.pieces[i][j][k].faces[w].material.color.set(beforeHighlight[count])
                        count++
                    }
                }
            }
        }
    }
}

// thanks to: https://stackoverflow.com/questions/9907419/how-to-get-a-key-in-a-javascript-object-by-its-value
function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}

function getPositionByNotation(value, notation = firstNotation) {
    return notationPositions[getKeyByValue(notation, value)]
}

// thanks to: https://stackoverflow.com/questions/14226803/wait-5-seconds-before-executing-next-line
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}


// introduction()
getUserCube()