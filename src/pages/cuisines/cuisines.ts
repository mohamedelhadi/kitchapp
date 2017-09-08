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
    constructor(
        private ui: UI,
        private navCtrl: NavController, private navParams: NavParams, private popoverCtrl: PopoverController,
        protected data: CuisinesData) {
        super({});
    }
    public ionViewDidLoad() {
        this.data.getCuisines();
    }
    public viewRestaurants(cuisineId: number) {
        this.navCtrl.push(Restaurants, { cuisineId });
    }
}
