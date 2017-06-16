import { IApiOptions } from "../index";
import { BaseError } from "./base.error";
import { Response } from "@angular/http";
import { TimeoutError } from "rxjs/util/TimeoutError";
export class HttpError extends BaseError {
    stacktrace: any;
    name: string;
    body: any;
    constructor(public message: string, public options: IApiOptions, public err: Response | TimeoutError) {
        super();
        this.name = this.constructor.name;
        this.stacktrace = this.getStackTrace(message);
        try {
            if (err instanceof Response) {
                this.body = err.text() ? err.json() : null;
            } else {
                this.body = err.message;
            }
        } catch (error) { // parsing errors (e.g. server returning html page service unavailable)
            this.body = err.toString();
        }
    }

    getStackTrace(message) {
        const stack = (new Error(message)).stack.split("\n").map(line => line.trim());
        stack.splice(1, 2); // remove BaseError, ServerError, and InternalError's frames from stack
        return stack;
    }
}
