import { MeshStandardMaterial, Mesh, PlaneGeometry, DoubleSide } from 'three'; 

function createFace() {
    const geometry = new PlaneGeometry(0.9,0.9)
    const material = new MeshStandardMaterial({
        side: DoubleSide
    })

    const face = new Mesh(geometry, material)

    return face
}

export { createFace }