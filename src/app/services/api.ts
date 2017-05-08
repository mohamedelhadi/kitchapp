import { Injectable } from "@angular/core";
import { Http, Response, RequestOptionsArgs, Headers } from "@angular/http";
import { Configuration } from "../../environments/env.config";
import { AppErrorHandler } from "../helpers/error.handler";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import _ from "lodash";

@Injectable()
export class Api {

    private readonly defaults: IApiOptions = {
        shouldAppendBaseUrl: true,
        shouldHandleErrors: true
    };

    constructor(private http: Http, private config: Configuration, private errorHanlder: AppErrorHandler) { }

    private request(method: string, {url, data, options = {}}: { url: string, data?: any, options: IApiOptions }) {
        _.defaults(options, this.defaults);
        options.method = method;
        options.body = data || {};
        url = (options.shouldAppendBaseUrl) ? this.appendBaseUrl(url) : url;
        return this.http
            .request(url, options)
            .map(res => res.json())
            .catch(err => {
                err.options = options;
                err.message = err.message || "Http Error";
                return Observable.throw(err);
            });
    }

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

    private appendBaseUrl(shortUrl: string) {
        /*var user = this.session.getUser();
        if (user != null && user.CompanyId) {
            return config.getBaseApiUrl() + user.CompanyId + "/" + shortUrl;
        }*/
        return this.config.BaseUrl + "api/" + shortUrl;
    }
}

export interface IHttpError extends Response {
    options: IApiOptions;
    message: string;
}

export function isHttpError(err: IHttpError | Error): err is IHttpError {
    return (err as IHttpError).options !== undefined;
}

export interface IApiOptions extends RequestOptionsArgs {

    shouldAppendBaseUrl?: boolean;
    shouldHandleErrors?: boolean;

    /*responseType?: string;
    timeout?: any;
    cache?: boolean;*/
}