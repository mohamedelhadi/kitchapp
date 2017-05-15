import { CustomError } from "./CustomError";

export class InternalError extends CustomError {
    constructor(message: string, ...args) {
        super(message, args);
    }
}
