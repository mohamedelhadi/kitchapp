import { ErrorHandler, Injectable } from "@angular/core";
import { UI, Logger, Utils } from "./";
import { Response } from "@angular/http";
import { Configuration } from "../../environments/env.config";
import { IHttpError, isHttpError } from "../services/api";

@Injectable()
export class AppErrorHandler extends ErrorHandler {

    constructor(private ui: UI, private logger: Logger, private utils: Utils) {
        super(false);
    }

    handleError(err: IHttpError | Error): void {
        this.logger.error(err);
        let shouldShowError = isHttpError(err) ? err.options.shouldHandleErrors : true;
        if (shouldShowError) {
            this.ui.showError(this.utils.isDev() ? err.message : null);
        }
    }
}
