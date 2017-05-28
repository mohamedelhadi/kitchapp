import { IApiOptions } from "../index";
import { BaseError } from "./base.error";
export class HttpError extends BaseError {
    stacktrace: any;
    name: string;
    body: any;
    constructor(public message: string, public options: IApiOptions, public response: Response) {
        super();
        this.name = this.constructor.name;
        this.stacktrace = this.getStackTrace(message);
        try {
            this.body = response.text && response.text() ? response.json() : null; // checking for text first because rxjs TimeoutError doesn't have this function
        } catch (error) { // parsing errors (e.g. server returning html page unavailable)
            // nothing needs to be done
        }
    }

    getStackTrace(message) {
        const stack = (new Error(message)).stack.split("\n").map(line => line.trim());
        stack.splice(1, 2); // remove CustomError's (including ServerError, InternalError) frames from stack
        return stack;
    }
}
