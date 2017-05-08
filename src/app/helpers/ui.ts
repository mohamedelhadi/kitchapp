import { Injectable } from "@angular/core";
import { AlertController } from "ionic-angular";

@Injectable()
export class UI {

    constructor(private alertCtrl: AlertController) { }

    showError(msg?: string) {
        let alert = this.alertCtrl.create({
            // title: "Error",
            subTitle: msg || "An error occured",
            buttons: ["Dismiss"]
        });
        alert.present();
        return alert;
    }
}