import { CustomError } from "./CustomError";

export class ServerError extends CustomError {
    constructor(message: string, ...args) {
        super(message, args);
    }
}
