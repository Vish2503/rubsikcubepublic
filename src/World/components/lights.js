import { AmbientLight } from 'three';   

function createLights() {
    const ambientLight = new AmbientLight('white', 3)
    return ambientLight
}

export { createLights }