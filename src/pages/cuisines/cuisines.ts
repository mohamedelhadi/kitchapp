import { Component, OnInit } from "@angular/core";
import { NavController, NavParams, PopoverController } from "ionic-angular";
import { Subject } from "rxjs/Subject";
import { Restaurants } from "../restaurants/restaurants";
import { BasePage } from "../../app/infrastructure/index";
import { CuisinesData } from "../../app/services/data/index";
import { Logger, UI } from "../../app/helpers/index";

@Component({
    selector: "page-cuisines",
    templateUrl: "cuisines.html"
})
export class Cuisines extends BasePage {
    // cuisines: ICuisine[];
    constructor(
        private logger: Logger, private ui: UI,
        private navCtrl: NavController, private navParams: NavParams, private popoverCtrl: PopoverController,
        protected data: CuisinesData) {
        super({ logger });
    }
    public ionViewDidLoad() {
        this.data.getCuisines();
    }
    public viewRestaurants(cuisineId: number) {
        this.navCtrl.push(Restaurants, { cuisineId });
    }
    public back() {
        this.navCtrl.canGoBack();
    }
}
