import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { SideMenu } from "../side-menu/side-menu";
import { RestaurantsData } from "../restaurants/restaurants.data";
import { DataLoader } from "../../app/services/data/index";

@Component({
    selector: "page-splash",
    templateUrl: "splash.html"
})
export class Splash {

    constructor(public navCtrl: NavController, private loader: DataLoader) { }

    ngOnInit() {
        this.loader.load();
        this.navCtrl.setRoot(SideMenu);
    }
}
