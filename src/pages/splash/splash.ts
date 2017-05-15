import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { SideMenu } from "../side-menu/side-menu";
import { RestaurantsData } from "../restaurants/restaurants.data";
import { DataLoader } from "../../app/shared/data-services";


@Component({
    selector: "page-splash",
    templateUrl: "splash.html"
})
export class Splash {

    constructor(public navCtrl: NavController, private loader: DataLoader) { }

    ionViewDidLoad() {
        // loaded
    }

    ngOnInit() {
        this.loader.load();
        this.navCtrl.setRoot(SideMenu);
    }
}
