import { Injectable, Inject } from "@angular/core";
import { AppErrorHandler } from "../helpers/index";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { USER, IUser, Gender } from "../contracts/index";
import { Observable } from "rxjs/Observable";
import { Storage } from "@ionic/storage";
import { Device } from "@ionic-native/device";

@Injectable()
export class Identity {
    user = new ReplaySubject<IUser>(1);
    constructor(private storage: Storage, private device: Device) {
        storage.ready().then(() => {
            storage.get(USER).then((savedUser: IUser) => {
                if (savedUser) {
                    this.user.next(savedUser);
                } else {
                    this.user.next({ identifier: device.uuid } as IUser);
                }
            });
        });
    }

    get User() {
        return this.user.asObservable();
    }

    save(user: IUser) {
        this.user.next(user);
        this.storage.set(USER, user);
    }
}