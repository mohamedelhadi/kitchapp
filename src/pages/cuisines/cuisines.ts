import { Component } from "@angular/core";
import { NavController } from "ionic-angular";
import { Restaurants } from "../restaurants/restaurants";
import { BasePage } from "../../app/infrastructure/index";
import { CuisinesData } from "../../app/services/data/index";

@Component({
    selector: "page-cuisines",
    templateUrl: "cuisines.html"
})
export class Cuisines extends BasePage {
    constructor(
        private navCtrl: NavController,
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
