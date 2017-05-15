export class CustomError extends Error {
    args: any;
    stack: any;
    constructor(message: string, ...args) {
        super(message);
        this.name = this.constructor.name;
        this.stack = this.getStackTrace(message);
        this.args = args;
    }

    getStackTrace(message) {
        const stack = (new Error(message)).stack.split("\n").map(line => line.trim());
        stack.splice(1, 4); // remove CustomError's (including ServerError, InternalError) frames from stack
        return stack;
    }
}