import { World } from './World/World.js';
import { Rubikscube } from './World/components/3x3.js';  
import { Euler, Raycaster, Vector3 } from 'three';  


let world;
let rubiksCube;

let currentlyAnimating = false
let AnimationSpeed = Math.PI * 2

function setAnimationSpeed(speed) {
    const defaultSpeed = Math.PI * 2;
    if (!speed) {
        AnimationSpeed = defaultSpeed
        return
    } 
    AnimationSpeed = speed;
}

function createWorld(container) {
    world = new World(container)
    world.start()

    rubiksCube = new Rubikscube()
    rubiksCube.addToScene(world.scene)  
}

// this function does a move on the rubiks cube when called, both the animation and moving the cube around.
const allowedMoves = [
    "R", "L", "U", "D", "F", "B", "M", "E", "S", "x", "y", "z", "r", "l", "u", "d", "f", "b", 
    "R2", "L2", "U2", "D2", "F2", "B2", "M2", "E2", "S2", "x2", "y2", "z2", "r2", "l2", "u2", "d2", "f2", "b2", 
    "R3", "L3", "U3", "D3", "F3", "B3", "M3", "E3", "S3", "x3", "y3", "z3", "r3", "l3", "u3", "d3", "f3", "b3", 
    "R'", "L'", "U'", "D'", "F'", "B'", "M'", "E'", "S'", "x'", "y'", "z'", "r'", "l'", "u'", "d'", "f'", "b'", 
    "R2'", "L2'", "U2'", "D2'", "F2'", "B2'", "M2'", "E2'", "S2'", "x2'", "y2'", "z2'", "r2'", "l2'", "u2'", "d2'", "f2'", "b2'", 
    "R3'", "L3'", "U3'", "D3'", "F3'", "B3'", "M3'", "E3'", "S3'", "x3'", "y3'", "z3'", "r3'", "l3'", "u3'", "d3'", "f3'", "b3'"
    ]
function move(move) {

    // using a promise to ensure that we will wait for the whole animation to finish and then move on to other moves
    return new Promise(resolve => {
        // this global variable will let us know whenever we are animating so we can stop other controls which may cause issues with the animation
        currentlyAnimating = true
        if (!allowedMoves.includes(move)) {
            resolve()
            return
        }
        const [x, y, z, dir, rotatingAround] = getMoveInfo(move)

        // i_, j_ and k_ will be the position of the center piece which will actually rotate and the other pieces on the face or cube will be attached to the centerpiece and move together
        let i_ = 1
        let j_ = 1
        let k_ = 1
        // we are holding the indices of the piece actually at any position in an indices array so a, b, c will hold that index and eventually i_, j_, k_ will be assigned that value
        let a = 1, b = 1, c = 1
        if (rotatingAround === "x" && x.length === 1) {
            [a,b,c] = rubiksCube.indices[x[0]][1][1]
        }
        else if (rotatingAround === "y" && y.length === 1) {
            [a,b,c] = rubiksCube.indices[1][y[0]][1]
        }
        else if (rotatingAround === "z" && z.length === 1) {
            [a,b,c] = rubiksCube.indices[1][1][z[0]]
        }
        i_ = a
        j_ = b
        k_ = c

        // attaching the actual pieces to the center piece in the scene
        for (const i of x) {
            for (const j of y) {
                for (const k of z) {
                    [a,b,c] = rubiksCube.indices[i][j][k]
                    if (a === i_ && b === j_ && c === k_) continue;
                    rubiksCube.pieces[i_][j_][k_].cube.attach(rubiksCube.pieces[a][b][c].cube)
                }
            }
        }

        // now we can animate and move that center piece
        world.loop.updatables.push(rubiksCube.pieces[i_][j_][k_])
        let total = 0
        const oldRotation = new Euler().copy(rubiksCube.pieces[i_][j_][k_].cube.rotation)
        rubiksCube.pieces[i_][j_][k_].tick = (delta) => {

            let speed = delta * AnimationSpeed
            
            if (move.charAt(0) === "x" || move.charAt(0) === "r") {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(1,0,0), dir * speed)
            } else if (move.charAt(0) === "y" || move.charAt(0) === "u") {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,1,0), dir * speed)
            } else if (move.charAt(0) === "z" || move.charAt(0) === "f" || move.charAt(0) === "S") {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,0,1), dir * speed)
            } else if (move.charAt(0) === "l" || move.charAt(0) === "M") {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(-1,0,0), dir * speed)
            } else if (move.charAt(0) === "d" || move.charAt(0) === "E") {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,-1,0), dir * speed)
            } else if (move.charAt(0) === "b") {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,0,-1), dir * speed)
            } else {
                rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(rubiksCube.pieces[i_][j_][k_].cube.position, dir * speed)
            }

            total += dir * speed

            // when we have sufficiently animated the move, we can remove the centerpiece from the animation loop and revert back to the oldRotation then finally actually move the pieces as we wanted
            if (Math.abs(total) >= Math.abs(dir * Math.PI / 2)) {

                world.loop.updatables.splice(world.loop.updatables.indexOf(rubiksCube.pieces[i_][j_][k_]))
                currentlyAnimating = false

                rubiksCube.pieces[i_][j_][k_].cube.setRotationFromEuler(oldRotation)
                if (move.charAt(0) === "x" || move.charAt(0) === "r") {
                    rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(1,0,0), dir * Math.PI / 2)
                } else if (move.charAt(0) === "y" || move.charAt(0) === "u") {
                    rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,1,0), dir * Math.PI / 2)
                } else if (move.charAt(0) === "z" || move.charAt(0) === "f" || move.charAt(0) === "S") {
                    rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,0,1), dir * Math.PI / 2)
                } else if (move.charAt(0) === "l" || move.charAt(0) === "M") {
                    rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(-1,0,0), dir * Math.PI / 2)
                } else if (move.charAt(0) === "d" || move.charAt(0) === "E") {
                    rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,-1,0), dir * Math.PI / 2)
                } else if (move.charAt(0) === "b") {
                    rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(new Vector3(0,0,-1), dir * Math.PI / 2)
                } else {
                    rubiksCube.pieces[i_][j_][k_].cube.rotateOnWorldAxis(rubiksCube.pieces[i_][j_][k_].cube.position, dir * Math.PI / 2)
                }

                // finally we can change the indices array to hold the new values after the move finishes
                let new_i, new_j, new_k
                let previous = []
                for (let i = 0; i < 3; i++) {
                    previous[i] = []
                    for (let j = 0; j < 3; j++) {
                        previous[i][j] = []
                        for (let k = 0; k < 3; k++) {
                            previous[i][j][k] = []
                            previous[i][j][k] = rubiksCube.indices[i][j][k]
                            // also using this loop to remove the piece from being attached to the centerpiece
                            rubiksCube.group.attach(rubiksCube.pieces[i][j][k].cube)
                        }
                    }
                }
                for (const i of x) {
                    for (const j of y) {
                        for (const k of z) {
                            let vector1 = new Vector3(i-1,j-1,k-1)
                            if (move.charAt(0) === "R" || move.charAt(0) === "x" || move.charAt(0) === "r") {
                                vector1.applyAxisAngle(new Vector3(1,0,0), dir * Math.PI / 2).round()
                            }
                            if (move.charAt(0) === "L" || move.charAt(0) === "l" || move.charAt(0) === "M") {
                                vector1.applyAxisAngle(new Vector3(-1,0,0), dir * Math.PI / 2).round()
                            }
                            else if (move.charAt(0) === "U" || move.charAt(0) === "y" || move.charAt(0) === "u") {
                                vector1.applyAxisAngle(new Vector3(0,1,0), dir * Math.PI / 2).round()
                            }
                            else if (move.charAt(0) === "D" || move.charAt(0) === "d" || move.charAt(0) === "E") {
                                vector1.applyAxisAngle(new Vector3(0,-1,0), dir * Math.PI / 2).round()
                            }
                            else if (move.charAt(0) === "F" || move.charAt(0) === "z" || move.charAt(0) === "f" || move.charAt(0) === "S") {
                                vector1.applyAxisAngle(new Vector3(0,0,1), dir * Math.PI / 2).round()
                            }
                            else if (move.charAt(0) === "B" || move.charAt(0) === "b") {
                                vector1.applyAxisAngle(new Vector3(0,0,-1), dir * Math.PI / 2).round()
                            }
                            new_i = vector1.getComponent(0) + 1
                            new_j = vector1.getComponent(1) + 1
                            new_k = vector1.getComponent(2) + 1
                            rubiksCube.indices[new_i][new_j][new_k] = previous[i][j][k]
                        }
                    }
                }
                // we can now resolve the promise as we have completed everything for this move
                resolve();
            }
        }
    })
}

// this function just gives us information about the pieces to be moved, which way to move the pieces and on which axis the pieces need to be moved, it is a helper function for move
function getMoveInfo(move) {
    let x = [0,1,2]
    let y = [0,1,2]
    let z = [0,1,2]
    let dir = -1
    let rotatingAround
    if (!move.charAt(1)) {
        dir = -1
    } else if (move.charAt(1) === "2") {
        dir = -2
    }
    else if (move.charAt(1) === "3") {
        dir = -3
    }

    if (move.charAt(move.length - 1) === "'") {
        dir *= -1
    } 
    
    switch (move.charAt(0)) {
        case "R":
            x = [2]
            rotatingAround = "x"
            break;
        case "r":
            x = [1,2]
            rotatingAround = "x"
            break;
        case "L":
            x = [0]
            rotatingAround = "x"
            break;
        case "l":
            x = [0,1]
            rotatingAround = "x"
            break;
        case "M":
            x = [1]
            rotatingAround = "x"
            break;
        case "U":
            y = [2]
            rotatingAround = "y"
            break;
        case "u":
            y = [1,2]
            rotatingAround = "y"
            break;
        case "D":
            y = [0]
            rotatingAround = "y"
            break;
        case "d":
            y = [0,1]
            rotatingAround = "y"
            break;
        case "E":
            y = [1]
            rotatingAround = "y"
            break;
        case "F":
            z = [2]
            rotatingAround = "z"
            break;
        case "f":
            z = [1,2]
            rotatingAround = "z"
            break;
        case "S":
            z = [1]
            rotatingAround = "z"
            break;
        case "B":
            z = [0]
            rotatingAround = "z"
            break;
        case "b":
            z = [0,1]
            rotatingAround = "z"
            break;
        case "x":
            rotatingAround = "x"
            break;
        case "y":
            rotatingAround = "y"
            break;
        case "z":
            rotatingAround = "z"
            break;
        default:
            break;
    }
    return [x, y, z, dir, rotatingAround]
}

// this function returns all 6 faces in a string following the representation expected by the kociemba two phase solver. this was chosen simply for convention, so I do not have to change between by representation and kociemba representation everytime I try to use it
/*
 - https://github.com/hkociemba/RubiksCube-TwophaseSolver
A solved string is of the form: 'UUUUUUUUURRRRRRRRRFFFFFFFFFDDDDDDDDDLLLLLLLLLBBBBBBBBB'
The names of the facelet positions of the cube
             |************|
             |*U1**U2**U3*|
             |************|
             |*U4**U5**U6*|
             |************|
             |*U7**U8**U9*|
             |************|
|************|************|************|************|
|*L1**L2**L3*|*F1**F2**F3*|*R1**R2**R3*|*B1**B2**B3*|
|************|************|************|************|
|*L4**L5**L6*|*F4**F5**F6*|*R4**R5**R6*|*B4**B5**B6*|
|************|************|************|************|
|*L7**L8**L9*|*F7**F8**F9*|*R7**R8**R9*|*B7**B8**B9*|
|************|************|************|************|
             |************|
             |*D1**D2**D3*|
             |************|
             |*D4**D5**D6*|
             |************|
             |*D7**D8**D9*|
             |************|
A cube definition string "UBL..." means for example: In position U1 we have the U-color, in position U2 we have the
B-color, in position U3 we have the L color etc.
*/
function getCubeString() {
    let faces = ""
    let intersects
    const raycaster = new Raycaster()
    let i, j, k, a, b, c

    // U face
    j = 1
    for (k = -1; k <= 1; k++) {
        for (i = -1; i <= 1; i++) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(0,1,0))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            faces += getColor(intersects[0].object.material.color.getHex())
        }
    }

    // R face
    i = 1
    for (j = 1; j >= -1; j--) {
        for (k = 1; k >= -1; k--) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(1,0,0))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            faces += getColor(intersects[0].object.material.color.getHex())
        }
    }

    // F face
    k = 1
    for (j = 1; j >= -1; j--) {
        for (i = -1; i <= 1; i++) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(0,0,1))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            faces += getColor(intersects[0].object.material.color.getHex())
        }
    }

    // D face
    j = -1
    for (k = 1; k >= -1; k--) {
        for (i = -1; i <= 1; i++) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(0,-1,0))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            faces += getColor(intersects[0].object.material.color.getHex())
        }
    }

    // L face
    i = -1
    for (j = 1; j >= -1; j--) {
        for (k = -1; k <= 1; k++) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(-1,0,0))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            faces += getColor(intersects[0].object.material.color.getHex())
        }
    }

    // B-face
    k = -1
    for (j = 1; j >= -1; j--) {
        for (i = 1; i >= -1; i--) {
            [a,b,c] = rubiksCube.indices[i+1][j+1][k+1]
            raycaster.set(new Vector3(i,j,k), new Vector3(0,0,-1))
            intersects = raycaster.intersectObjects(rubiksCube.pieces[a][b][c].faces)
            faces += getColor(intersects[0].object.material.color.getHex())
        }
    }

    return faces;
}

// simply returns the string representation of the color, the string is the face on which this color is the center of
/*
    White => U
    Green => F
    Red => R
    Blue => B
    Orange => L
    Yellow => D
*/
function getColor(color) {
    switch (color) {
        case 0xffffff:
            return "U"
        case 0x00ff00:
            return "F"
        case 0xff0000:
            return "R"
        case 0x0000ff:
            return "B"
        case 0xffa500:
            return "L"
        case 0xffff00:
            return "D"
        default:
            return "E";
    }
}

// this function stores the orientation of the pieces in an object from a given cubestring, basically manually done, couldn't come up with anything better
function getNotation(cubestring = getCubeString()) {
    let notation = {
        UBL: cubestring[0] + cubestring[47] + cubestring[36],
        UB: cubestring[1] + cubestring[46],
        URB: cubestring[2]  + cubestring[11] + cubestring[45],
        UL: cubestring[3] + cubestring[37],
        U: cubestring[4],
        UR: cubestring[5] + cubestring[10],
        ULF: cubestring[6] + cubestring[38] + cubestring[18],
        UF: cubestring[7] + cubestring[19],
        UFR: cubestring[8] + cubestring[20] + cubestring[9],
        RUF: cubestring[9] + cubestring[8] + cubestring[20],
        RU: cubestring[10] + cubestring[5],
        RBU: cubestring[11] + cubestring[45] + cubestring[2],
        RF: cubestring[12] + cubestring[23],
        R: cubestring[13],
        RB: cubestring[14] + cubestring[48],
        RFD: cubestring[15] + cubestring[26] + cubestring[29],
        RD: cubestring[16] + cubestring[32], 
        RDB: cubestring[17] + cubestring[35] + cubestring[51],
        FUL: cubestring[18] + cubestring[6] + cubestring[38],
        FU: cubestring[19] + cubestring[7],
        FRU: cubestring[20] + cubestring[9] + cubestring[8],
        FL: cubestring[21] + cubestring[41],
        F: cubestring[22],
        FR: cubestring[23] + cubestring[12],
        FLD: cubestring[24] + cubestring[44] + cubestring[27],
        FD: cubestring[25] + cubestring[28],
        FDR: cubestring[26] + cubestring[29] + cubestring[15],
        DFL: cubestring[27] + cubestring[24] + cubestring[44],
        DF: cubestring[28] + cubestring[25],
        DRF: cubestring[29] + cubestring[15] + cubestring[26],
        DL: cubestring[30] + cubestring[43],
        D: cubestring[31],
        DR: cubestring[32] + cubestring[16],
        DLB: cubestring[33] + cubestring[42] + cubestring[53],
        DB: cubestring[34] + cubestring[52],
        DBR: cubestring[35] + cubestring[51] + cubestring[17],
        LUB: cubestring[36] + cubestring[0] + cubestring[47],
        LU: cubestring[37] + cubestring[3],
        LFU: cubestring[38] + cubestring[18] + cubestring[6],
        LB: cubestring[39] + cubestring[50],
        L: cubestring[40],
        LF: cubestring[41] + cubestring[21],
        LBD: cubestring[42] + cubestring[53] + cubestring[33],
        LD: cubestring[43] + cubestring[30],
        LDF: cubestring[44] + cubestring[27] + cubestring[24],
        BUR: cubestring[45] + cubestring[2] + cubestring[11],
        BU: cubestring[46] + cubestring[1],
        BLU: cubestring[47] + cubestring[36] + cubestring[0],
        BR: cubestring[48] + cubestring[14],
        B: cubestring[49],
        BL: cubestring[50] + cubestring[39],
        BRD: cubestring[51] + cubestring[17] + cubestring[35],
        BD: cubestring[52] + cubestring[34],
        BDL: cubestring[53] + cubestring[33] + cubestring[42]
    }

    return notation
}

const notationPositions = {
    "UBL": "-1,1,-1",
    "UB": "0,1,-1",
    "URB": "1,1,-1",
    "UL": "-1,1,0",
    "U": "0,1,0",
    "UR": "1,1,0",
    "ULF": "-1,1,1",
    "UF": "0,1,1",
    "UFR": "1,1,1",
    "RUF": "1,1,1",
    "RU": "1,1,0",
    "RBU": "1,1,-1",
    "RF": "1,0,1",
    "R": "1,0,0",
    "RB": "1,0,-1",
    "RFD": "1,-1,1",
    "RD": "1,-1,0",
    "RDB": "1,-1,-1",
    "FUL": "-1,1,1",
    "FU": "0,1,1",
    "FRU": "1,1,1",
    "FL": "-1,0,1",
    "F": "0,0,1",
    "FR": "1,0,1",
    "FLD": "-1,-1,1",
    "FD": "0,-1,1",
    "FDR": "1,-1,1",
    "DFL": "-1,-1,1",
    "DF": "0,-1,1",
    "DRF": "1,-1,1",
    "DL": "-1,-1,0",
    "D": "0,-1,0",
    "DR": "1,-1,0",
    "DLB": "-1,-1,-1",
    "DB": "0,-1,-1",
    "DBR": "1,-1,-1",
    "LUB": "-1,1,-1",
    "LU": "-1,1,0",
    "LFU": "-1,1,1",
    "LB": "-1,0,-1",
    "L": "-1,0,0",
    "LF": "-1,0,1",
    "LBD": "-1,-1,-1",
    "LD": "-1,-1,0",
    "LDF": "-1,-1,1",
    "BUR": "1,1,-1",
    "BU": "0,1,-1",
    "BLU": "-1,1,-1",
    "BR": "1,0,-1",
    "B": "0,0,-1",
    "BL": "-1,0,-1",
    "BRD": "1,-1,-1",
    "BD": "0,-1,-1",
    "BDL": "-1,-1,-1"
}


const scrambleMoves = ["R", "L", "U", "D", "F", "B"]
const scrambleDirs = ["", "'", "2"]
// generates a random 25 move scramble using moves in scrambleMoves and directions in scrambleDirs such that no three consecutive moves have any moves in common (so as to not have something like R, R' or R L R', etc)
function generateScramble() {

    function getRandomMove() {
        return scrambleMoves[Math.floor(Math.random() * scrambleMoves.length)] + scrambleDirs[Math.floor(Math.random() * scrambleDirs.length)]
    }
    let scramble = []
    // generating the first two moves so that the second move is not the same as first move
    scramble.push(getRandomMove())
    scramble.push(getRandomMove())
    while (scramble[0].charAt(0) === scramble[1].charAt(1)) {
        scramble[1] = getRandomMove
    }

    for (let i = 2; i < 25; i++) {
        let move = getRandomMove()
        while (scramble[i - 1].charAt(0) === move.charAt(0) || scramble[i - 2].charAt(0) === move.charAt(0)) {
            move = getRandomMove()
        }
        scramble.push(move)
    }

    return scramble
}

function solveTwoPhase() {
    try {
        let cube = new Cube()
        cube = Cube.fromString(getCubeString())
        return cube.solve().split(" ")
    } catch (error) {
        Cube.initSolver()
        let cube = new Cube()
        cube = Cube.fromString(getCubeString())
        return cube.solve().split(" ")
    }
}

function reverseMove(move) {
    if (move.charAt(move.length - 1) === "'") {
        return move.slice(0,-1)
    } else {
        return move += "'"
    }
}

export { createWorld, world, rubiksCube, currentlyAnimating, allowedMoves, move, getCubeString, getNotation, notationPositions, generateScramble, setAnimationSpeed, solveTwoPhase, reverseMove }