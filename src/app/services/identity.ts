import { Injectable } from "@angular/core";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { USER, IUser } from "../contracts/index";
import { Storage } from "@ionic/storage";

@Injectable()
export class Identity {
    private user = new ReplaySubject<IUser>(1);
    constructor(private storage: Storage) {
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