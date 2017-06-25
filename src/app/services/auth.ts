import { Injectable, Inject } from "@angular/core";
import { AppErrorHandler } from "../helpers/index";
import { Configuration } from "../environments/env.config";
import { Platform } from "ionic-angular";
import { Facebook } from "@ionic-native/facebook";
import { FacebookService, InitParams, LoginOptions } from "ngx-facebook";
import { Api, User } from "./index";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { USER, IUser, Gender, FB_TOKEN, INewUser, TOKEN, EXPIRES_AT } from "../contracts/index";
import { Observable } from "rxjs/Observable";
import { Storage } from "@ionic/storage";
import * as moment from "moment";

@Injectable()
export class Auth {
    onInit = new ReplaySubject(1);
    loginOptions: LoginOptions = {
        scope: "public_profile,email",
        return_scopes: true,
        enable_profile_selector: true
    };
    constructor(
        private config: Configuration, private errorHandler: AppErrorHandler, private platform: Platform, private storage: Storage,
        private api: Api, private user: User,
        private fb: Facebook, private facebook: FacebookService) {
        (window as any).fbAsyncInit = () => {
            const initParams: InitParams = {
                appId: this.config.FacebookAppID,
                xfbml: true,
                version: "v2.9"
            };
            facebook.init(initParams).then(() => this.onInit.next(""), err => this.onInit.error(err));
        };
    }
    signInWithFacebook() {
        // TODO: check if TOKEN exists in storage, if it exists then refresh when close to expiration, if it doesn't exist attempt login
        if (this.platform.is("cordova")) {
            return this.fb.login(["email", "public_profile"]).then(res => {
                this.storage.set(FB_TOKEN, res.authResponse.accessToken);
                this.fb.api("/me?fields=id,name,email,link,gender,picture", ["email", "public_profile"])
                    .then(profile => {
                        this.user.User.first().subscribe(savedUser => {
                            const user: INewUser = {
                                identifier: savedUser.identifier,
                                email: profile.email,
                                token: res.authResponse.accessToken,
                                name: profile.name,
                                gender: profile.gender === "male" ? Gender.Male : Gender.Female,
                                photoUrl: profile.picture.data.url,
                                profileUrl: profile.link
                            };
                            this.api.post("auth/verify", user).subscribe((result: any) => {
                                this.user.save(result.user);
                                this.storage.set(TOKEN, result.auth.token);
                                this.storage.set(EXPIRES_AT, moment(result.auth.expires_at).valueOf());
                            });
                        });
                    });
            });
        } else {
            this.onInit.first().subscribe(() => {
                this.facebook.login(this.loginOptions)
                    .then(res => {
                        this.storage.set(FB_TOKEN, res.authResponse.accessToken);
                        this.facebook.api("/me?fields=id,name,email,link,gender,picture").then(profile => {
                            this.user.User.first().subscribe(savedUser => {
                                const user: INewUser = {
                                    identifier: savedUser.identifier,
                                    email: profile.email,
                                    token: res.authResponse.accessToken,
                                    name: profile.name,
                                    gender: profile.gender === "male" ? Gender.Male : Gender.Female,
                                    photoUrl: profile.picture.data.url,
                                    profileUrl: profile.link
                                };
                                this.api.post("auth/verify", user).subscribe((result: any) => {
                                    this.user.save(result.user);
                                    this.storage.set(TOKEN, result.auth.token);
                                    this.storage.set(EXPIRES_AT, moment(result.auth.expires_at).valueOf());
                                });
                            });
                        });
                    })
                    .catch(err => console.error("err: ", err));
            });
        }
    }
    signOut() {
        // TODO: clear user and token details from storage
        if (this.platform.is("cordova")) {
            this.fb.logout();
        } else {
            // tslint:disable-next-line:no-console
            this.facebook.logout().then(() => console.log("Logged out!"));
        }
    }
}
