import { BoxGeometry, MeshStandardMaterial, Mesh } from 'three'; 

function createCube() {
    const geometry = new BoxGeometry(1,1,1)
    const material = new MeshStandardMaterial({
        color: 'black'
    })

    const cube = new Mesh(geometry, material)

    return cube
}

export { createCube }