import { ErrorHandler, Injectable } from '@angular/core';
import { UI, Utils, Logger } from './';
import {
    InternalError, HttpError, ErrorCodes, IServerError, ServerErrorCodes, TranslationKeys
} from '../contracts/index';
import { HttpErrorResponse } from '@angular/common/http';
import { TimeoutError } from 'rxjs/util/TimeoutError';
import { Configuration } from '../config/env.config';

@Injectable()
export class AppErrorHandler implements ErrorHandler {
    constructor(
        private ui: UI, private utils: Utils, private config: Configuration,
        private logger: Logger
    ) { }
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
                    this.ui.showToast(TranslationKeys.Errors[err.code]);
                    break;
                case ErrorCodes.GeolocationPositionError:
                case ErrorCodes.LocationPermissionDenied:
                    this.ui.showError(TranslationKeys.Errors[err.code]);
                    break;
                default:
                    this.ui.showError(
                        this.utils.isDev() ? err.message : TranslationKeys.Errors[err.code]
                    );
            }
        }
    }
    private handleHttpError(httpError: HttpError): void {
        if (httpError.options.handleError) {
            if (
                httpError.err instanceof HttpErrorResponse &&
                isServerError(httpError.err.error)
            ) {
                const err = httpError.err.error;
                this.ui.showError(TranslationKeys.ServerErrors[err.code]);
            } else if (httpError.err instanceof TimeoutError) {
                this.ui.showError(TranslationKeys.Messages.ConnectionFailedPleaseTryAgain);
            } else {
                this.ui.showError(this.utils.isDev() ? httpError.message : null);
            }
        }
    }
}
export function isServerError(err): err is IServerError {
    return err && (err as IServerError).code !== undefined;
}
