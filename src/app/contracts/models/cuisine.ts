import { ICuisine } from "../index";

export class Cuisine implements ICuisine {
    constructor(public id: number, public name: string[], public order: number = 0) {
    }
}
