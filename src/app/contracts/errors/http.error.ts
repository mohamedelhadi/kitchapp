import { IApiOptions } from '../index';
import { BaseError } from './base.error';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs/util/TimeoutError';
export class HttpError extends BaseError {
    public stacktrace: any;
    public name: string;
    constructor(
        public message: string, public options: IApiOptions,
        public err: HttpErrorResponse | TimeoutError
    ) {
        super();
        this.name = this.constructor.name;
        this.stacktrace = this.getStackTrace(message);
    }

    private getStackTrace(message) {
        const stack = (new Error(message)).stack.split('\n').map(line => line.trim());
        stack.splice(1, 2); // remove BaseError and HttpError's frames from stack
        return stack;
    }
}
