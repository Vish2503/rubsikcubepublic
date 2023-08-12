import { Raycaster, Vector2, Vector3 } from "three";
import { createWorld, generateScramble, move, rubiksCube, setAnimationSpeed, solveTwoPhase, world } from "./src/RubiksCube"

const container = document.querySelector("#scene-container")
createWorld(container)

world.controls.enableRotate = false;
world.camera.position.set(5,4,5)

const pointer = new Vector2()
const raycaster = new Raycaster()
let selectedFace = null
let allFaces = []
function addVisiblefaces(){
    allFaces.length = 0
    let intersects
    const raycaster = new Raycaster()
    let i, j, k, a, b, c

    // Up face
    j = 1
    for (k = -1; k <= 1; k++) {
        for (i = -1; i <= 1; i++) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(0,1,0))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            allFaces.push(intersects[0].object)
        }
    }

    // Right face
    i = 1
    for (j = 1; j >= -1; j--) {
        for (k = 1; k >= -1; k--) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(1,0,0))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            allFaces.push(intersects[0].object)
        }
    }

    // Front face
    k = 1
    for (j = 1; j >= -1; j--) {
        for (i = -1; i <= 1; i++) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(0,0,1))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            allFaces.push(intersects[0].object)
        }
    }
}

let xStart = null
let yStart = null
let xEnd = null
let yEnd = null
let xDistance = null
let yDistance = null
let faceDirection = new Vector3()
let piecePosition = new Vector3()
let firstFaceDirectionWhenNoSelection = new Vector3()
let secondFaceDirectionWhenNoSelection = new Vector3()

function moveStart(event) {
    addVisiblefaces()
    if (event.type === "mousedown") {
        pointer.x = -1 + 2 * (event.offsetX) / world.renderer.domElement.clientWidth;
        pointer.y = 1 - 2 * (event.offsetY) / world.renderer.domElement.clientHeight;
        xStart = event.clientX
        yStart = event.clientY
    } else if (event.type === "touchstart") {
        const {top, left, width, height} = world.renderer.domElement.getBoundingClientRect();
        pointer.x = -1 + 2 * (event.touches[0].clientX - left) / width;
        pointer.y = 1 - 2 * (event.touches[0].clientY - top) / height;
        xStart = event.touches[0].clientX
        yStart = event.touches[0].clientY
    }
    raycaster.setFromCamera( pointer, world.camera );
    try {
        const intersects = raycaster.intersectObjects(allFaces);
        selectedFace = intersects[0].object
        piecePosition.copy(selectedFace.parent.position.round())
        selectedFace.getWorldDirection(faceDirection)
        faceDirection.round()
    } catch (error) {}
}
function moveOngoing(event) {
    if (!xStart || !yStart) {
        return
    }

    if (event.type === "mousemove") {
        xEnd = event.clientX
        yEnd = event.clientY
    } else if (event.type === "touchmove") {
        xEnd = event.touches[0].clientX
        yEnd = event.touches[0].clientY
    }

    if (!selectedFace) {
        if (event.type === "mousemove") {
            pointer.x = -1 + 2 * (event.offsetX) / world.renderer.domElement.clientWidth;
            pointer.y = 1 - 2 * (event.offsetY) / world.renderer.domElement.clientHeight;
        } else if (event.type === "touchmove") {
            const {top, left, width, height} = world.renderer.domElement.getBoundingClientRect();
            pointer.x = -1 + 2 * (event.touches[0].clientX - left) / width;
            pointer.y = 1 - 2 * (event.touches[0].clientY - top) / height;
        }
        raycaster.setFromCamera( pointer, world.camera );
        try {
            const intersects = raycaster.intersectObjects(allFaces);
            let faceOnRightNow = intersects[0].object
            let directionOfFaceOnRightNow = new Vector3()
            faceOnRightNow.getWorldDirection(directionOfFaceOnRightNow)
            directionOfFaceOnRightNow.round()
            let array = directionOfFaceOnRightNow.toArray()
            directionOfFaceOnRightNow.set(Math.abs(array[0]), Math.abs(array[1]), Math.abs(array[2]))
            if (firstFaceDirectionWhenNoSelection.equals(new Vector3(0,0,0))) {
                firstFaceDirectionWhenNoSelection.copy(directionOfFaceOnRightNow)
            }
            if (secondFaceDirectionWhenNoSelection.equals(new Vector3(0,0,0)) && !firstFaceDirectionWhenNoSelection.equals(directionOfFaceOnRightNow)) {
                secondFaceDirectionWhenNoSelection.copy(directionOfFaceOnRightNow)
            }
        } catch (error) {}
    }

    xDistance = xEnd - xStart
    yDistance = - (yEnd - yStart)
}
async function moveEnd(event) {
    removeListeners()
    
    let angle = (Math.atan(yDistance/xDistance) * 180) / Math.PI
    function getSide(faceDirection) {
        if (faceDirection.x) {
            return "Right"
        } else if (faceDirection.y) {
            return "Up"
        } else if (faceDirection.z) {
            return "Front"
        }
    }
    let side = getSide(faceDirection)
    if (side === "Right") {
        if (Math.abs(angle) <= 90 && Math.abs(angle) >= 60) {
            if (yDistance > 0) {
                switch (piecePosition.z) {
                    case 1:
                        await move("F'")
                        break
                    case 0:
                        await move("S'")
                        break
                    case -1:
                        await move("B")
                        break
                    default:
                        break
                }
            } else if (yDistance < 0) {
                switch (piecePosition.z) {
                    case 1:
                        await move("F")
                        break
                    case 0:
                        await move("S")
                        break
                    case -1:
                        await move("B'")
                        break
                    default:
                        break
                }
            }
        } else if (angle <= 45 && angle >= 0) {
            if (xDistance > 0) {
                switch (piecePosition.y) {
                    case 1:
                        await move("U'")
                        break
                    case 0:
                        await move("E")
                        break
                    case -1:
                        await move("D")
                        break
                    default:
                        break
                }
            } else if (xDistance < 0) {
                switch (piecePosition.y) {
                    case 1:
                        await move("U")
                        break
                    case 0:
                        await move("E'")
                        break
                    case -1:
                        await move("D'")
                        break
                    default:
                        break
                }
            }
        }
    } else if (side === "Front") {
        if (Math.abs(angle) <= 90 && Math.abs(angle) >= 60) {
            if (yDistance > 0) {
                switch (piecePosition.x) {
                    case 1:
                        await move("R")
                        break
                    case 0:
                        await move("M'")
                        break
                    case -1:
                        await move("L'")
                        break
                    default:
                        break
                }
            } else if (yDistance < 0) {
                switch (piecePosition.x) {
                    case 1:
                        await move("R'")
                        break
                    case 0:
                        await move("M")
                        break
                    case -1:
                        await move("L")
                        break
                    default:
                        break
                }
            }
        } else if (angle >= -45 && angle <= 0) {
            if (xDistance > 0) {
                switch (piecePosition.y) {
                    case 1:
                        await move("U'")
                        break
                    case 0:
                        await move("E")
                        break
                    case -1:
                        await move("D")
                        break
                    default:
                        break
                }
            } else if (xDistance < 0) {
                switch (piecePosition.y) {
                    case 1:
                        await move("U")
                        break
                    case 0:
                        await move("E'")
                        break
                    case -1:
                        await move("D'")
                        break
                    default:
                        break
                }
            }
        }
    } else if (side === "Up") {
        if (angle <= 45 && angle >= 0) {
            if (yDistance > 0) {
                switch (piecePosition.x) {
                    case 1:
                        await move("R")
                        break
                    case 0:
                        await move("M'")
                        break
                    case -1:
                        await move("L'")
                        break
                    default:
                        break
                }
            } else if (yDistance < 0) {
                switch (piecePosition.x) {
                    case 1:
                        await move("R'")
                        break
                    case 0:
                        await move("M")
                        break
                    case -1:
                        await move("L")
                        break
                    default:
                        break
                }
            }
        } else if (angle >= -45 && angle <= 0) {
            if (yDistance > 0) {
                switch (piecePosition.z) {
                    case 1:
                        await move("F'")
                        break
                    case 0:
                        await move("S'")
                        break
                    case -1:
                        await move("B")
                        break
                    default:
                        break
                }
            } else if (yDistance < 0) {
                switch (piecePosition.z) {
                    case 1:
                        await move("F")
                        break
                    case 0:
                        await move("S")
                        break
                    case -1:
                        await move("B'")
                        break
                    default:
                        break
                }
            }
        }
    }

    if (!selectedFace) {
        let firstSide = getSide(firstFaceDirectionWhenNoSelection)
        let secondSide = getSide(secondFaceDirectionWhenNoSelection)
        if (firstSide === "Front" && secondSide === "Up") {
            await move("x")
        } else if (firstSide === "Up" && secondSide === "Front") {
            await move("x'")
        } else if (firstSide === "Front" && secondSide === "Right") {
            await move("y'")
        } else if (firstSide === "Right" && secondSide === "Front") {
            await move("y")
        } else if (firstSide === "Right" && secondSide === "Up") {
            await move("z'")
        } else if (firstSide === "Up" && secondSide === "Right") {
            await move("z")
        }
    }

    selectedFace = null
    xStart = null
    yStart = null
    xEnd = null
    xEnd = null
    xDistance = 0
    yDistance = 0
    faceDirection.set(0,0,0)
    piecePosition.set(0,0,0)
    firstFaceDirectionWhenNoSelection.set(0,0,0)
    secondFaceDirectionWhenNoSelection.set(0,0,0)
    addListeners()
}

async function scrambleCube() {
    removeListeners()
    let scramble = generateScramble()
    let i = 0;
    while (scramble[i]) {
        await move(scramble[i])
        i++
    }
    addListeners()
}

async function solveCube() {
    removeListeners()
    let solution = solveTwoPhase()
    let i = 0;
    while (solution[i]) {
        await move(solution[i])
        i++
    }
    addListeners()
}
 

let scrambleButton = document.querySelector("#scramble")
let solveButton = document.querySelector("#solve")
function addListeners(){
    window.addEventListener('touchstart', moveStart)
    window.addEventListener('mousedown', moveStart)
    window.addEventListener('touchmove', moveOngoing)
    window.addEventListener('mousemove', moveOngoing)
    window.addEventListener('touchend', moveEnd)
    window.addEventListener('mouseup', moveEnd)
    scrambleButton.addEventListener("click", scrambleCube)
    solveButton.addEventListener("click", solveCube)
}
function removeListeners(){
    window.removeEventListener('touchstart', moveStart)
    window.removeEventListener('mousedown', moveStart)
    window.removeEventListener('touchmove', moveOngoing)
    window.removeEventListener('mousemove', moveOngoing)
    window.removeEventListener('touchend', moveEnd)
    window.removeEventListener('mouseup', moveEnd)
    scrambleButton.removeEventListener("click", scrambleCube)
    solveButton.removeEventListener("click", solveCube)
}

addListeners()