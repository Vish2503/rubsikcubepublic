import { createWorld, generateScramble, getCubeString, getNotation, move, notationPositions, rubiksCube, setAnimationSpeed, world } from "./src/RubiksCube"

const container = document.querySelector("#scene-container")
createWorld(container)

let cubestring
let firstNotation

let pieces = []

setTimeout(async () => {
    setAnimationSpeed(1000)
    await move("x2")
    await move("y")
    setAnimationSpeed()
    firstNotation = getNotation()
    Object.keys(firstNotation).forEach(element => pieces.push(getPositionByNotation(element)))
}, 1000)

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

    infoHeader.innerHTML = "INTRODUCTION"
    infoPara.innerHTML = "This is an introduction to the rubiks cube!"
    function first() {
        // previous.removeEventListener("click", third)
        // previous.addEventListener("click", third)
        revertHighlight(pieces)
        pieces.length = 0;
        // this will push whatever is in the top layer to be highlighted
        (Object.keys(firstNotation).filter(key => (key.includes("U")))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "LAYERS: Top Layer"
        infoPara.innerHTML = "There are three layers in a 3x3 Rubik's Cube. The highlighted pieces make up the top layer."
        next.removeEventListener("click", first)
        next.addEventListener("click", second)
    }
    function second() {
        // previous.removeEventListener("click", third)
        // previous.addEventListener("click", first)
        revertHighlight(pieces)
        pieces.length = 0;
        // this will push whatever is in the middle layer to be highlighted
        (Object.keys(firstNotation).filter(key => !(key.includes("U") || key.includes("D")))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "LAYERS: Middle Layer"
        infoPara.innerHTML = "There are three layers in a 3x3 Rubik's Cube. The highlighted pieces make up the middle layer."
        next.removeEventListener("click", second)
        next.addEventListener("click", third)
    }
    function third() {
        // previous.removeEventListener("click", first)
        // previous.addEventListener("click", second)
        revertHighlight(pieces)
        pieces.length = 0;
        // this will push whatever is in the bottom layer to be highlighted
        (Object.keys(firstNotation).filter(key => (key.includes("D")))).forEach(element => {
            pieces.push(getPositionByNotation(element))
        })
        highlightPieces(pieces)
        infoHeader.innerHTML = "LAYERS: Bottom Layer"
        infoPara.innerHTML = "There are three layers in a 3x3 Rubik's Cube. The highlighted pieces make up the bottom layer."
        next.removeEventListener("click", third)
        next.addEventListener("click", fourth)
    }
    function fourth() {
        // previous.removeEventListener("click", second)
        // previous.addEventListener("click", third)
        revertHighlight(pieces)
        infoHeader.innerHTML = "FACES"
        infoPara.innerHTML = "There are six faces on a Rubik's Cube. Each colored side of the cube makes up a single face."
        next.removeEventListener("click", fourth)
        next.addEventListener("click", first)
    }
    next.addEventListener("click", first)
    // previous.addEventListener("click", third)

    document.addEventListener('keyup', event => {
        if (event.key == "ArrowRight") {
            next.click()
        } else if (event.key == "ArrowLeft") {
            previous.click()
        }
    })
}

let beforeHighlight = []
function highlightPieces(pieces) {
    beforeHighlight = []
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            for (let k = 0; k < 3; k++) {
                if (pieces.includes([i-1,j-1,k-1].join())) {
                    continue
                } else {
                    for (let w = 0; w < 6; w++) {
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
introduction()