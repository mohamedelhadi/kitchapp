import { Injectable, Inject } from "@angular/core";
import { AppErrorHandler } from "../helpers/index";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { USER, IUser, Gender } from "../contracts/index";
import { Observable } from "rxjs/Observable";
import { Storage } from "@ionic/storage";
import { Device } from "@ionic-native/device";

@Injectable()
export class Identity {
    private user = new ReplaySubject<IUser>(1);
    constructor(private storage: Storage, private device: Device) {
        this.init();
    }
    private async init() {
        const user: IUser = await this.storage.get(USER);
        this.user.next(user || {} as IUser);
    }
    get user$() {
        return this.user.asObservable();
    }
    public save(user: IUser) {
        this.user.next(user);
        return this.storage.set(USER, user);
    }
}