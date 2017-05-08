import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { SideMenu } from "../side-menu/side-menu";


@Component({
    selector: "page-splash",
    templateUrl: "splash.html"
})
export class Splash {

    constructor(public navCtrl: NavController) { }

    ionViewDidLoad() {
        this.navCtrl.setRoot(SideMenu);
    }
}
