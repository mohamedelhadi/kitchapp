import { Injectable } from "@angular/core";
import { Configuration } from "../config/env.config";
import { OneSignal, OSNotification, OSNotificationOpenedResult } from "@ionic-native/onesignal";
import { Platform } from "ionic-angular";

@Injectable()
export class Push {
    constructor(private config: Configuration, private oneSignal: OneSignal, private platform: Platform) { }

    // tslint:disable-next-line:no-empty
    public init(onPushReceived: (result: OSNotification) => void = () => { }, onPushOpened: (result: OSNotificationOpenedResult) => void = () => { }) {
        if (this.platform.is("cordova")) {
            this.oneSignal.startInit(this.config.OneSignalAppID, this.config.GoogleProjectNo);

            this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.InAppAlert);

            this.oneSignal.handleNotificationReceived().subscribe(onPushReceived);

            this.oneSignal.handleNotificationOpened().subscribe(onPushOpened);

            this.oneSignal.endInit();
        } else {
            // add browser push configs
        }
    }
}
