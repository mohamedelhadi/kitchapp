import { Component, OnInit } from "@angular/core";
import { NavController } from "ionic-angular";
import { SideMenu } from "../side-menu/side-menu";
import { RestaurantsData } from "../restaurants/restaurants.data";
import { DataLoader } from "../../app/services/data/index";

@Component({
    selector: "page-splash",
    templateUrl: "splash.html"
})
export class Splash implements OnInit {

    constructor(public navCtrl: NavController, private loader: DataLoader) { }

    public ngOnInit() {
        this.loader.load();
        this.navCtrl.setRoot(SideMenu);
    }
}
