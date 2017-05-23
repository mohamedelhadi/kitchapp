import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, PopoverController } from "ionic-angular";
import { Subject } from "rxjs/Subject";
import { ICuisine } from "../../contracts/index";
import { Configuration } from "../../environments/env.config";
import { UI, Logger } from "../../app/helpers/index";
import { CuisinesData } from "../../app/shared/data-services/index";
import { Restaurants } from "../restaurants/restaurants";
import { BasePage, AppSettings } from "../../app/infrastructure/index";

@Component({
    selector: "page-cuisines",
    templateUrl: "cuisines.html"
})
export class Cuisines extends BasePage {
    // cuisines: ICuisine[];
    constructor(
        private config: Configuration, private appSettings: AppSettings, private logger: Logger, private ui: UI,
        private navCtrl: NavController, private navParams: NavParams, private popoverCtrl: PopoverController,
        protected data: CuisinesData) {
        super({ config, appSettings, logger });
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
