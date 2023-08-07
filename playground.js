import { Raycaster, Vector2 } from "three";
import { createWorld, move, rubiksCube, world } from "./src/RubiksCube"

const container = document.querySelector("#scene-container")
createWorld(container)

world.controls.enabled = false;
world.camera.position.set(5,4,5)

const pointer = new Vector2()
const raycaster = new Raycaster()
let selectedPiece
let allPieces = []
rubiksCube.pieces.flat(2).forEach(element => {
    allPieces.push(element.cube)
})

window.addEventListener( 'click', (event) => {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    raycaster.setFromCamera( pointer, world.camera );

    const intersects = raycaster.intersectObjects(allPieces);
    if (intersects.length) {
        selectedPiece = intersects[0].object
    }
    console.log(selectedPiece);
});