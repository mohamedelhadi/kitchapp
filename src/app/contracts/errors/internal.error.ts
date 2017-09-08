import { BaseError } from "./base.error";
import { ErrorCodes } from "../index";
export class InternalError extends BaseError {
    public args: any;
    public stacktrace: any;
    public name: string;
    constructor(public message: string, public code: string = ErrorCodes.Unknown, public handleError: boolean = true, ...args) {
        super();
        this.name = this.constructor.name;
        this.stacktrace = this.getStackTrace(message);
        this.args = args;
    }
    private getStackTrace(message) {
        const stack = (new Error(message)).stack.split("\n").map(line => line.trim());
        stack.splice(1, 2); // remove BaseError, HttpError, and InternalError's frames from stack
        return stack;
    }
}
