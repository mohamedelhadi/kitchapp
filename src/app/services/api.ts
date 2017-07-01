import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { AppErrorHandler } from "../helpers/error.handler";
import { Storage } from "@ionic/storage";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { defaults } from "lodash";

import { IApiOptions, InternalError, ErrorCodes, HttpError, TOKEN, EXPIRES_AT, AuthenticationStatus } from "../contracts/index";
import { Configuration } from "../environments/env.config";
import { UI, Utils } from "../helpers/index";
import { TimeoutError } from "rxjs/util/TimeoutError";

import * as moment from "moment";
import { AuthStatus } from "./index";

@Injectable()
export class Api {
    private readonly defaults: IApiOptions = {
        appendBaseUrl: true,
        handleError: true,
        showLoading: true
    };
    private token: string;

    constructor(private http: Http, private config: Configuration, private errHandler: AppErrorHandler, private ui: UI, private storage: Storage) {
        this.setToken();
        AuthStatus.subscribe(status => {
            switch (status) {
                case AuthenticationStatus.LoggedIn:
                    this.setToken();
                    break;
                case AuthenticationStatus.LoggedOut:
                    this.token = null;
                    break;
            }
        });
    }
    private setToken() {
        this.storage.get(TOKEN).then(token => {
            if (token) {
                this.storage.get(EXPIRES_AT).then(expireAt => {
                    const now = moment();
                    if (expireAt > now.valueOf()) {
                        this.token = token;
                    } else {
                        this.token = null;
                    }
                });
            }
        });
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
    private request(method: string, { url, data, options = {} }: { url: string, data?: any, options: IApiOptions }) {
        defaults(options, this.defaults);
        if (!Utils.isOnline()) {
            this.errHandler.handleError(new InternalError("No internet connection", ErrorCodes.Offline, options.handleError));
            return Observable.empty();
        }
        options.method = method;
        options.body = data || {};
        url = (options.appendBaseUrl) ? this.appendBaseUrl(url) : url;
        options.headers = new Headers({ "Content-Type": "application/json" });
        if (this.token) {
            options.headers.set("Authorization", `bearer ${this.token}`);
        }
        if (options.showLoading) {
            this.ui.showLoading();
        }
        return this.http
            .request(url, options)
            .do(() => this.ui.hideLoading())
            .timeout(55000)
            .map(res => res.text() ? res.json() : {})
            .catch(err => {
                this.ui.hideLoading();
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
        /*var user = this.session.getUser();
        if (user != null && user.CompanyId) {
            return config.getBaseApiUrl() + user.CompanyId + "/" + shortUrl;
        }*/
        return this.config.BaseUrl + "api/" + shortUrl;
    }
}
