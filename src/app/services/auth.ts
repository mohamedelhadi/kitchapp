import { Injectable } from "@angular/core";
import { AppErrorHandler, UI, Utils } from "../helpers/index";
import { Configuration } from "../config/env.config";
import { Platform, AlertController } from "ionic-angular";
import { Storage } from "@ionic/storage";
import { Facebook } from "@ionic-native/facebook";
import { FacebookService, InitParams, LoginOptions } from "ngx-facebook";
import { Api, Identity } from "./index";
import { ReplaySubject } from "rxjs/ReplaySubject";
import "rxjs/add/operator/first";
import { Gender, FB_TOKEN, INewUser, TOKEN, EXPIRES_AT, InternalError, ErrorCodes, TranslationKeys, AuthenticationStatus, ICredentials, LoginProvider } from "../contracts/index";
import * as moment from "moment";

export const AuthStatus$ = new ReplaySubject<AuthenticationStatus>(1);

@Injectable()
export class Auth {
    private onInit: Promise<void>;
    private loginOptions: LoginOptions = {
        scope: "public_profile,email",
        return_scopes: true,
        enable_profile_selector: true
    };
    constructor(
        private config: Configuration, private errHandler: AppErrorHandler, private ui: UI,
        private platform: Platform, private storage: Storage, private alertCtrl: AlertController,
        private api: Api, private identity: Identity,
        private fbNative: Facebook, private fb: FacebookService) {
        this.onInit = new Promise<void>((resolve, reject) => {
            (window as any).fbAsyncInit = () => {
                const initParams: InitParams = {
                    appId: this.config.FacebookAppID,
                    xfbml: true,
                    version: "v2.8"
                };
                fb.init(initParams).then(resolve, reject);
            };
        });
    }
    get user$() {
        return this.identity.user$;
    }
    public async isLoggedIn() {
        const token = await this.storage.get(TOKEN);
        const expireAt = await this.storage.get(EXPIRES_AT);
        const now = moment();
        return token && expireAt > now.valueOf();
    }
    public loginWithCredentials(credentials: ICredentials) {
        return new Promise((resolve, reject) => {
            this.ui.showLoading();
            this.api.post("auth/token", credentials, { handleLoading: false }).subscribe(
                (result: any) => {
                    Promise
                        .all([
                            this.identity.save(result.user),
                            this.storage.set(TOKEN, result.auth.token),
                            this.storage.set(EXPIRES_AT, moment(result.auth.expires_at).valueOf())
                        ])
                        .then(() => {
                            this.ui.hideLoading();
                            AuthStatus$.next(AuthenticationStatus.LoggedIn);
                            resolve(true);
                        })
                        .catch(() => this.ui.hideLoading());
                },
                reject);
        });
    }
    public loginWithFacebook(msgKey?: string): Promise<boolean> {
        if (msgKey) {
            return new Promise((resolve, reject) => {
                const confirmAlert = this.alertCtrl.create({
                    subTitle: this.ui.translate.instant(msgKey),
                    cssClass: "confirm-alert",
                    buttons: [
                        {
                            cssClass: "cancel",
                            text: this.ui.translate.instant(TranslationKeys.Common.Cancel),
                            handler: () => {
                                // this.logger.log("user declined logging in");
                            }
                        },
                        {
                            cssClass: "ok",
                            text: this.ui.translate.instant(TranslationKeys.Common.Ok),
                            handler: () => {
                                this.login(LoginProvider.Facebook).then(resolve);
                            }
                        }
                    ]
                });
                confirmAlert.present();
            });
        } else {
            return this.login(LoginProvider.Facebook);
        }
    }
    public async login(provider: LoginProvider) {
        if (!Utils.isOnline()) {
            this.errHandler.handleError(new InternalError("No internet connection", ErrorCodes.Offline));
            return Promise.reject("no internet");
        }
        switch (provider) {
            case LoginProvider.Facebook:
                return await this.facebookLogin();
            default:
                throw new InternalError("Unimplemented login provider");
        }
    }
    private async facebookLogin() {
        // TODO: check if TOKEN exists in storage, if it exists then refresh when close to expiration, if it doesn't exist attempt login
        try {
            if (this.platform.is("cordova")) {
                const res = await this.fbNative.login(["email", "public_profile"]);
                this.storage.set(FB_TOKEN, res.authResponse.accessToken);
                this.ui.showLoading(TranslationKeys.Messages.LoggingIn);
                const profile = await this.fbNative.api("/me?fields=id,name,email,link,gender,picture", ["email", "public_profile"]);
                return this.verify(profile, res.authResponse.accessToken);
            } else {
                await this.onInit;
                const res = await this.fb.login(this.loginOptions);
                this.storage.set(FB_TOKEN, res.authResponse.accessToken);
                this.ui.showLoading(TranslationKeys.Messages.LoggingIn);
                const profile = await this.fb.api("/me?fields=id,name,email,link,gender,picture");
                return this.verify(profile, res.authResponse.accessToken);
            }
        } catch (err) {
            const message = err ? err.message || err.toString() : "Error in facebook login";
            this.errHandler.handleError(new InternalError(message, ErrorCodes.LoginFailure));
            return false;
        }
    }
    private verify(profile, accessToken): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const user: INewUser = {
                email: profile.email,
                token: accessToken,
                name: profile.name,
                gender: profile.gender === "male" ? Gender.Male : Gender.Female,
                photoUrl: profile.picture.data.url,
                profileUrl: profile.link
            };
            this.ui.showLoading();
            this.api.post("auth/verify", user, { handleError: false, handleLoading: false }).subscribe(
                (result: any) => {
                    Promise
                        .all([
                            this.identity.save(result.user),
                            this.storage.set(TOKEN, result.auth.token),
                            this.storage.set(EXPIRES_AT, moment(result.auth.expires_at).valueOf())
                        ])
                        .then(() => {
                            this.ui.hideLoading();
                            AuthStatus$.next(AuthenticationStatus.LoggedIn);
                            resolve(true);
                        })
                        .catch(() => this.ui.hideLoading());
                },
                reject);
        });
    }
    public async logout() {
        await this.onInit;
        if (this.platform.is("cordova")) {
            this.fbNative.logout();
        } else {
            // const loginStatus = await this.fb.getLoginStatus();
            this.fb.logout();
        }
        await Promise.all([this.storage.remove(TOKEN), this.storage.remove(FB_TOKEN), this.storage.remove(EXPIRES_AT)]);
        AuthStatus$.next(AuthenticationStatus.LoggedOut);
    }
}
