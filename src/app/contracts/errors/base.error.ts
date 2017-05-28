export class BaseError {
    constructor() {
        Error.apply(this, arguments);
    }
}
BaseError.prototype = new Error();
/*
export class CustomError extends BaseError {
    args: any;
    stacktrace: any;
    name: string;
    constructor(public message: string, ...args) {
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
*/
