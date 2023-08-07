import { Color } from 'three';
import { createCube } from './cube';
import { createFace } from './face';

const color = [
    new Color(0xffffff),
    new Color(0x00ff00),
    new Color(0xff0000),
    new Color(0x0000ff),
    new Color(0xffa500),
    new Color(0xffff00)
]

class Piece {
    constructor () {
        this.cube = createCube()
        this.faces = []
        for (let i = 0; i < 6; i++) {
            this.faces[i] = createFace()
            this.faces[i].material.color.set(color[i])
            this.cube.add(this.faces[i])
        }
        this.faces[0].rotateX(Math.PI / 2).position.set(0,0.501,0)
        this.faces[1].position.set(0,0,0.501)
        this.faces[2].rotateY(Math.PI / 2).position.set(0.501,0,0)
        this.faces[3].position.set(0,0,-0.501)
        this.faces[4].rotateY(Math.PI / 2).position.set(-0.501,0,0)
        this.faces[5].rotateX(Math.PI / 2).position.set(0,-0.501,0)
    }
}

export { Piece }