import { ErrorHandler, Injectable } from "@angular/core";
import { UI, Logger, Utils } from "./";
import { Response } from "@angular/http";
import { InternalError, HttpError, ErrorCode, IServerError, ServerErrorCode, TranslationKeys } from "../contracts/index";

@Injectable()
export class AppErrorHandler extends ErrorHandler {

    constructor(private ui: UI, private logger: Logger, private utils: Utils) {
        super();
    }

    handleError(err: Error | InternalError | HttpError): void {
        this.logger.error(err);
        if (err instanceof InternalError) {
            this.handleInternalError(err);
        } else if (err instanceof HttpError) {
            this.handleHttpError(err);
        } else {
            this.ui.showError(this.utils.isDev() ? err.message : null);
        }
    }
    handleInternalError(err: InternalError) {
        if (err.handleError) {
            if (err.code === ErrorCode.Offline) {
                this.ui.showToast(TranslationKeys.Errors[ErrorCode.Offline]);
                return;
            }
            this.ui.showError(this.utils.isDev() ? err.message : null);
        }
    }
    handleHttpError(err: HttpError): void {
        this.logger.error(err);
        if (err.options.handleError) {
            const error = err.body;
            if (isServerError(error)) {
                this.ui.showError(TranslationKeys.ServerErrors[error.code]);
            } else {
                this.ui.showError(this.utils.isDev() ? err.message : null);
            }
        }
    }
}
export function isServerError(err: IServerError): err is IServerError {
    return (err as IServerError).code !== undefined;
}
