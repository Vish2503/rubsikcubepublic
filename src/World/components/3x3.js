import { Group } from 'three';
import { Piece } from './Piece';

class Rubikscube {
    constructor() {
        this.group = new Group()
        this.pieces = []
        this.indices = []
        for (let i = 0; i < 3; i++) {
            this.pieces[i] = []
            this.indices[i] = []
            for (let j = 0; j < 3; j++) {
                this.pieces[i][j] = []
                this.indices[i][j] = []
                for (let k = 0; k < 3; k++) {
                    this.pieces[i][j][k] = new Piece(i, j, k)
                    this.pieces[i][j][k].cube.position.set(i-1,j-1,k-1) 
                    this.indices[i][j][k] = [i,j,k]  
                    this.group.add(this.pieces[i][j][k].cube)  
                }
            }
        }
    }

    addToScene(scene) {
        scene.add(this.group)
    }
}


export { Rubikscube }