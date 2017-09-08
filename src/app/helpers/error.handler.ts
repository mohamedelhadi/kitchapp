import { ErrorHandler, Injectable } from "@angular/core";
import { UI, Logger, Utils } from "./";
import { Response } from "@angular/http";
import { InternalError, HttpError, ErrorCodes, IServerError, ServerErrorCodes, TranslationKeys } from "../contracts/index";

@Injectable()
export class AppErrorHandler extends ErrorHandler {
    constructor(private ui: UI, private logger: Logger, private utils: Utils) {
        super();
    }
    public handleError(err: Error | InternalError | HttpError): void {
        this.logger.error(err);
        if (err instanceof InternalError) {
            this.handleInternalError(err);
        } else if (err instanceof HttpError) {
            this.handleHttpError(err);
        } else {
            this.ui.showError(this.utils.isDev() ? err.message : null);
        }
    }
    private handleInternalError(err: InternalError) {
        if (err.handleError) {
            switch (err.code) {
                case ErrorCodes.Offline:
                case ErrorCodes.GeolocationPositionError:
                    this.ui.showToast(TranslationKeys.Errors[err.code]);
                    break;
                default:
                    this.ui.showError(this.utils.isDev() ? err.message : TranslationKeys.Errors[err.code]);
                    break;
            }
        }
    }
    private handleHttpError(err: HttpError): void {
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
    return err && (err as IServerError).code !== undefined;
}
