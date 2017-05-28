import { BaseError } from "./base.error";
import { ErrorCode } from "../index";
export class InternalError extends BaseError {
    args: any;
    stacktrace: any;
    name: string;
    constructor(public message: string, public code: ErrorCode = ErrorCode.Unknown, public handleError: boolean = true, ...args) {
        super();
        this.name = this.constructor.name;
        this.stacktrace = this.getStackTrace(message);
        this.args = args;
    }

    getStackTrace(message) {
        const stack = (new Error(message)).stack.split("\n").map(line => line.trim());
        stack.splice(1, 2); // remove CustomError's (including ServerError, InternalError) frames from stack
        return stack;
    }
}
