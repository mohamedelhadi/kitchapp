import { Injectable, Inject } from "@angular/core";
import { AppErrorHandler, UI, Utils } from "../helpers/index";
import { Configuration } from "../environments/env.config";
import { Platform, AlertController } from "ionic-angular";
import { Facebook } from "@ionic-native/facebook";
import { FacebookService, InitParams, LoginOptions } from "ngx-facebook";
import { Api, Identity } from "./index";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { USER, IUser, Gender, FB_TOKEN, INewUser, TOKEN, EXPIRES_AT, InternalError, ErrorCodes, TranslationKeys, AuthenticationStatus, ICredentials } from "../contracts/index";
import { Observable } from "rxjs/Observable";
import { Storage } from "@ionic/storage";
import * as moment from "moment";

export const AuthStatus = new ReplaySubject<AuthenticationStatus>(1);

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
                fb.init(initParams).then(resolve, reject); // () => this.onInit.next(""), err => this.onInit.error(err));
            };
        });
    }
    get User() {
        return this.identity.User;
    }
    public isLoggedIn() {
        return this.storage.get(TOKEN).then(token => {
            if (token) {
                return this.storage.get(EXPIRES_AT).then(expireAt => {
                    const now = moment();
                    if (expireAt > now.valueOf()) {
                        return true;
                    }
                    return false;
                });
            }
            return false;
        });
    }
    public login(provider: string = "facebook") {
        // TODO: check if TOKEN exists in storage, if it exists then refresh when close to expiration, if it doesn't exist attempt login
        if (!Utils.isOnline()) {
            this.errHandler.handleError(new InternalError("No internet connection", ErrorCodes.Offline));
            return Promise.reject("no internet");
        }
        const failed = err => {
            const message = err ? err.message || err.toString() : "Error in facebook login";
            this.errHandler.handleError(new InternalError(message, ErrorCodes.LoginFailure));
            return false;
            // can't use Promise.reject because it throws undefined error (conflicts with zones)!
            // return Promise.reject(message);
        };
        if (this.platform.is("cordova")) {
            return this.fbNative.login(["email", "public_profile"])
                .then(res => {
                    this.storage.set(FB_TOKEN, res.authResponse.accessToken);
                    this.ui.showLoading(TranslationKeys.Messages.LoggingIn);
                    return this.fbNative.api("/me?fields=id,name,email,link,gender,picture", ["email", "public_profile"])
                        .then(profile => {
                            return this.verify(profile, res.authResponse.accessToken);
                        });
                })
                .catch(failed);
        } else {
            return this.onInit
                .then(() => {
                    return this.fb.login(this.loginOptions)
                        .then(res => {
                            this.storage.set(FB_TOKEN, res.authResponse.accessToken);
                            this.ui.showLoading(TranslationKeys.Messages.LoggingIn);
                            return this.fb.api("/me?fields=id,name,email,link,gender,picture")
                                .then(profile => {
                                    return this.verify(profile, res.authResponse.accessToken);
                                });
                        });
                })
                .catch(failed);
        }
    }
    public loginWithFacebook(confirm: boolean = true): Promise<boolean> {
        if (confirm) {
            return new Promise((resolve, reject) => {
                const confirmAlert = this.alertCtrl.create({
                    // title: this.ui.translate.instant(TranslationKeys.Common.Login),
                    subTitle: this.ui.translate.instant(TranslationKeys.Messages.YouNeedToLoginInOrderToRate),
                    cssClass: "confirm-alert",
                    buttons: [
                        {
                            cssClass: "cancel",
                            text: this.ui.translate.instant(TranslationKeys.Common.Cancel),
                            handler: () => {
                                // this.logger.info("user declined logging in");
                            }
                        },
                        {
                            cssClass: "ok",
                            text: this.ui.translate.instant(TranslationKeys.Common.Ok),
                            handler: () => {
                                this.login().then(resolve);
                            }
                        }
                    ]
                });
                confirmAlert.present();
            });
        } else {
            return this.login();
        }
    }
    private verify(profile, accessToken): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.identity.User.first().subscribe(savedUser => {
                const user: INewUser = {
                    identifier: savedUser.identifier,
                    email: profile.email,
                    token: accessToken,
                    name: profile.name,
                    gender: profile.gender === "male" ? Gender.Male : Gender.Female,
                    photoUrl: profile.picture.data.url,
                    profileUrl: profile.link
                };
                this.ui.showLoading();
                this.api.post("auth/verify", user, { handleError: false, showLoading: false }).subscribe((result: any) => {
                    Promise
                        .all([
                            this.identity.save(result.user),
                            this.storage.set(TOKEN, result.auth.token),
                            this.storage.set(EXPIRES_AT, moment(result.auth.expires_at).valueOf())
                        ])
                        .then(() => {
                            this.ui.hideLoading();
                            AuthStatus.next(AuthenticationStatus.LoggedIn);
                            resolve(true);
                        })
                        .catch(() => this.ui.hideLoading());
                }, reject);
            });
        });
    }
    public loginWithCredentials(credentials: ICredentials) {
        return new Promise((resolve, reject) => {
            this.ui.showLoading();
            this.api.post("auth/token", credentials, { showLoading: false }).subscribe((result: any) => {
                Promise
                    .all([
                        this.identity.save(result.user),
                        this.storage.set(TOKEN, result.auth.token),
                        this.storage.set(EXPIRES_AT, moment(result.auth.expires_at).valueOf())
                    ])
                    .then(() => {
                        this.ui.hideLoading();
                        AuthStatus.next(AuthenticationStatus.LoggedIn);
                        resolve(true);
                    })
                    .catch(() => this.ui.hideLoading());
            }, reject);
        });
    }
    public logout() {
        return this.onInit.then(() => {
            if (this.platform.is("cordova")) {
                this.fbNative.logout();
            } else {
                this.fb.getLoginStatus().then(loginStatus => {
                    this.fb.logout().then(() => {
                        // broadcast, broadcasted below
                    });
                });
            }
            return Promise
                .all([this.storage.remove(TOKEN), this.storage.remove(FB_TOKEN), this.storage.remove(EXPIRES_AT)])
                .then(() => AuthStatus.next(AuthenticationStatus.LoggedOut));
        });
    }
}
