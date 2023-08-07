import { PerspectiveCamera, Vector3 } from 'three';

function createCamera() {
    const camera = new PerspectiveCamera(75, 1, 1, 100)

    camera.position.set(4,4,6);
    camera.lookAt(new Vector3())
    return camera
}

export { createCamera }