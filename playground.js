import { Raycaster, Vector2 } from "three";
import { createWorld, move, rubiksCube, world } from "./src/RubiksCube"

const container = document.querySelector("#scene-container")
createWorld(container)

world.controls.enabled = false;
world.camera.position.set(5,4,5)

const pointer = new Vector2()
const raycaster = new Raycaster()
let selectedFace
let allFaces = []
rubiksCube.pieces.flat(2).forEach(element => {
    allFaces.push(...element.cube.children)
})

// window.addEventListener( 'click', (event) => {
//     pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
//     pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
//     raycaster.setFromCamera( pointer, world.camera );

//     const intersects = raycaster.intersectObjects(allPieces);
//     if (intersects.length) {
//         selectedPiece = intersects[0].object
//     }
//     console.log(selectedPiece);
// });

function selectFace(event) {
    console.log(event);
    pointer.x = -1 + 2 * (event.offsetX) / container.clientWidth;
    pointer.y = 1 - 2 * (event.offsetY) / container.clientHeight;
    raycaster.setFromCamera( pointer, world.camera );
    try {
        const intersects = raycaster.intersectObjects(allFaces);
        selectedFace = intersects[0].object
        console.log(selectedFace);
    } catch (error) {}
}

// window.addEventListener('touchstart', selectFace);
window.addEventListener('mousedown', selectFace);