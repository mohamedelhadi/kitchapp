import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AppErrorHandler } from '../helpers/error.handler';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import { TimeoutError } from 'rxjs/util/TimeoutError';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/timer';
import defaults from 'lodash/defaults';
import * as HttpStatus from 'http-status-codes';

import {
    IApiOptions, InternalError, ErrorCodes, HttpError,
    EXPIRES_AT, IAppSettings, Language, defaultLanguage
} from '../contracts/index';
import { Configuration } from '../config/env.config';
import { UI, Utils, Logger } from '../helpers/index';
import { Settings$ } from '../infrastructure/index';

@Injectable()
export class Api {
    private readonly defaults: IApiOptions = {
        appendBaseUrl: true,
        handleError: true,
        handleLoading: true,
        headers: Utils.JSONHeader
    };
    private token: string;
    private settings: IAppSettings;
    constructor(
        private http: HttpClient, private config: Configuration, private logger: Logger,
        private errHandler: AppErrorHandler, private ui: UI, private storage: Storage
    ) {
        Settings$.subscribe(settings => this.settings = settings);
    }
    public getAuthToken() {
        return this.token;
    }
    public setAuthToken(token: string) {
        this.token = token;
    }
    public removeAuthToken() {
        this.token = null;
    }
    public get(url: string, options?: IApiOptions) {
        return this.request('GET', { url, options });
    }
    public post(url: string, data?: any, options?: IApiOptions) {
        return this.request('POST', { url, data, options });
    }
    public update(url: string, data?: any, options?: IApiOptions) {
        return this.request('PUT', { url, data, options });
    }
    public delete(url: string, options?: IApiOptions) {
        return this.request('DELETE', { url, options });
    }
    private request(
        method: string, { url, data = {}, options = {} }:
            { url: string, data?: any, options: IApiOptions }) {
        defaults(options, this.defaults);
        if (!Utils.isOnline()) {
            this.errHandler
                .handleError(new InternalError(
                    'No internet connection', ErrorCodes.Offline, options.handleError
                ));
            this.ui.hideLoading();
            return Observable.empty();
        }
        url = (options.appendBaseUrl) ? this.appendBaseUrl(url) : url;
        options.url = url;
        options.body = data;
        options.headers = options.headers.set('lang', this.settings ?
            Language[this.settings.language] : Language[defaultLanguage]
        );
        if (this.token) {
            options.headers = options.headers.set('Authorization', `bearer ${this.token}`);
        }
        if (options.handleLoading) {
            this.ui.showLoading(options.loadingMessage);
        }
        return this.http
            .request(method, url, options)
            .do(() => { if (options.handleLoading) { this.ui.hideLoading(); } })
            .timeout(50000)
            .retryWhen(attempts => attempts
                .zip(Observable.range(1, 4))
                .mergeMap(([err, tries]) => {
                    if (tries < 3) {
                        return this.handleRetries(err, tries);
                    }
                    return Observable.throw(err);
                })
            )
            .catch(err => {
                if (options.handleLoading) { this.ui.hideLoading(); }
                if (err instanceof HttpErrorResponse || err instanceof TimeoutError) {
                    err = new HttpError(err.message, options, err);
                } else {
                    // client side
                    err = new InternalError(
                        err.message || err.toString(),
                        ErrorCodes.Unknown,
                        options.handleError,
                        err
                    );
                }
                return Observable.throw(err);
            });
    }
    private handleRetries(err: any, tries: number) {
        if (err.status) {
            if (err.status >= HttpStatus.BAD_REQUEST &&
                err.status <= HttpStatus.EXPECTATION_FAILED &&
                err.status !== HttpStatus.REQUEST_TIMEOUT) {
                return Observable.throw(err);
            }
        }
        this.logger.log('Retry no.' + tries);
        return Observable.timer(tries * 10);
    }
    private appendBaseUrl(shortUrl: string) {
        return this.config.baseUrl + 'api/' + shortUrl;
    }
}
