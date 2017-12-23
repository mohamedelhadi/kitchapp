import { ICity } from '../index';

export class City implements ICity {
    constructor(public id: number, public name: string[]) {
    }
}
