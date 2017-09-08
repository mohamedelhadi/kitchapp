import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { AppErrorHandler } from "../helpers/error.handler";
import { Storage } from "@ionic/storage";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/do";
import "rxjs/add/operator/timeout";
import "rxjs/add/observable/empty";
import defaults from "lodash/defaults";

import { IApiOptions, InternalError, ErrorCodes, HttpError, TOKEN, EXPIRES_AT, AuthenticationStatus } from "../contracts/index";
import { Configuration } from "../config/env.config";
import { UI, Utils } from "../helpers/index";
import { TimeoutError } from "rxjs/util/TimeoutError";

import * as moment from "moment";
import { AuthStatus$ } from "./index";

@Injectable()
export class Api {
    private readonly defaults: IApiOptions = {
        appendBaseUrl: true,
        handleError: true,
        handleLoading: true
    };
    private token: string;

    constructor(private http: Http, private config: Configuration, private errHandler: AppErrorHandler, private ui: UI, private storage: Storage) {
        this.loadToken();
        AuthStatus$.subscribe(status => {
            switch (status) {
                case AuthenticationStatus.LoggedIn:
                    this.loadToken();
                    break;
                case AuthenticationStatus.LoggedOut:
                    this.token = null;
                    break;
            }
        });
    }
    private async loadToken() {
        const token = await this.storage.get(TOKEN);
        if (token) {
            const expireAt = await this.storage.get(EXPIRES_AT);
            const now = moment();
            this.token = expireAt > now.valueOf() ? token : null;
        }
    }
    public get(url: string, options?: IApiOptions) {
        return this.request("GET", { url, options });
    }
    public post(url: string, data?: any, options?: IApiOptions) {
        return this.request("POST", { url, data, options });
    }
    public update(url: string, data?: any, options?: IApiOptions) {
        return this.request("PUT", { url, data, options });
    }
    public delete(url: string, options?: IApiOptions) {
        return this.request("DELETE", { url, options });
    }
    private request(method: string, { url, data = {}, options = {} }: { url: string, data?: any, options: IApiOptions }) {
        defaults(options, this.defaults);
        if (!Utils.isOnline()) {
            this.errHandler.handleError(new InternalError("No internet connection", ErrorCodes.Offline, options.handleError));
            return Observable.empty();
        }
        url = (options.appendBaseUrl) ? this.appendBaseUrl(url) : url;
        options.url = url;
        options.method = method;
        options.body = data;
        options.headers = new Headers({ "Content-Type": "application/json" });
        if (this.token) {
            options.headers.set("Authorization", `bearer ${this.token}`);
        }
        if (options.handleLoading) {
            this.ui.showLoading();
        }
        return this.http
            .request(url, options)
            .do(() => { if (options.handleLoading) { this.ui.hideLoading(); } })
            .timeout(55000)
            .map(res => res.text() ? res.json() : {})
            .catch(err => {
                if (options.handleLoading) { this.ui.hideLoading(); }
                if (err instanceof Response || err instanceof TimeoutError) {
                    this.errHandler.handleError(new HttpError("Http Error", options, err as any));
                } else {
                    // instance of Error
                    this.errHandler.handleError(new InternalError(err.message || err.toString(), ErrorCodes.Unknown, options.handleError));
                }
                return Observable.throw(err);
            });
    }
    private appendBaseUrl(shortUrl: string) {
        return this.config.baseUrl + "api/" + shortUrl;
    }
}
