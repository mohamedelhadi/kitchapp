import { Injectable } from "@angular/core";
import { Utils } from './utils';

@Injectable()
export class Logger {
    constructor(private utils: Utils) {
    }
    public error(err: any) {
        // tslint:disable-next-line:no-console
        console.error(err);
        // log to error tracker
    }
    public log(...data: any[]) {
        if (this.utils.isDev()) {
            // tslint:disable-next-line:no-console
            console.log(data.length === 1 ? data[0] : data);
        }
    }
    public warn(...data: any[]) {
        // tslint:disable-next-line:no-console
        console.warn(data.length === 1 ? data[0] : data);
    }
}
