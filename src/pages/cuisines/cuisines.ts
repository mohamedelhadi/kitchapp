import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, PopoverController } from "ionic-angular";
import { Subject } from "rxjs/Subject";
import { Restaurants } from "../restaurants/restaurants";
import { BasePage, AppSettings } from "../../app/infrastructure/index";
import { CuisinesData } from "../../app/services/data/index";
import { Logger, UI } from "../../app/helpers/index";

@Component({
    selector: "page-cuisines",
    templateUrl: "cuisines.html"
})
export class Cuisines extends BasePage {
    // cuisines: ICuisine[];
    constructor(
        private appSettings: AppSettings, private logger: Logger, private ui: UI,
        private navCtrl: NavController, private navParams: NavParams, private popoverCtrl: PopoverController,
        protected data: CuisinesData) {
        super({ appSettings, logger });
    }
    ionViewDidLoad() {
        this.data.getCuisines();
    }
    viewRestaurants(cuisineId: number) {
        this.navCtrl.push(Restaurants, { cuisineId });
    }
    back() {
        this.navCtrl.canGoBack();
    }
}
