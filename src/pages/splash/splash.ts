import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { SideMenu } from "../side-menu/side-menu";
import { RestaurantsData } from "../restaurants/restaurants.data";


@Component({
    selector: "page-splash",
    templateUrl: "splash.html"
})
export class Splash {

    constructor(public navCtrl: NavController, private data: RestaurantsData) { }

    ionViewDidLoad() {
        // loaded
    }

    ngOnInit() {
        // show spinner
        // subscribe (inside subscription hide spinner)
        this.navCtrl.setRoot(SideMenu); // move inside subscription
        this.data.getRestaurants(true);
    }
}
