import { Injectable } from "@angular/core";
import { Http, Response, Headers } from "@angular/http";
import { Configuration } from "../../environments/env.config";
import { AppErrorHandler } from "../helpers/error.handler";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { defaults } from "lodash";
import { IApiOptions, InternalError, OFFLINE } from "../../contracts";
import { Utils, UI } from "../helpers/index";
import { HttpError } from "../../contracts/errors/http.error";

@Injectable()
export class Api {

    private readonly defaults: IApiOptions = {
        appendBaseUrl: true,
        handleError: true,
        showLoading: true
    };

    constructor(private http: Http, private config: Configuration, private errorHandler: AppErrorHandler, private ui: UI) { }

    get(url: string, options?: IApiOptions) {
        return this.request("GET", { url, options });
    }
    post(url: string, data?: any, options?: IApiOptions) {
        return this.request("POST", { url, data, options });
    }
    update(url: string, data?: any, options?: IApiOptions) {
        return this.request("PUT", { url, data, options });
    }
    delete(url: string, options?: IApiOptions) {
        return this.request("DELETE", { url, options });
    }

    private request(method: string, { url, data, options = {} }: { url: string, data?: any, options: IApiOptions }) {
        defaults(options, this.defaults);
        if (!Utils.isOnline()) {
            this.errorHandler.handleError(new InternalError("No internet connection", OFFLINE, options.handleError));
            return Observable.empty();
        }
        options.method = method;
        options.body = data || {};
        url = (options.appendBaseUrl) ? this.appendBaseUrl(url) : url;
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
                this.errorHandler.handleError(new HttpError(err.message || "Http Error", options, err));
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
