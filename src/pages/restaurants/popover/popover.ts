import { ViewController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { IRestaurantsSearchSettings, ICity, ICuisine } from "../../../contracts";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Component({
    templateUrl: "popover.html",
    selector: "restaurants-popover"
})
export class RestaurantsPopover {
    settings: IRestaurantsSearchSettings;
    cities: Observable<ICity[]>;
    cuisines: Observable<ICuisine[]>;
    constructor(public viewCtrl: ViewController, private params: NavParams) {
        (params.data.settings as BehaviorSubject<IRestaurantsSearchSettings>).subscribe(settings => this.settings = settings);
        this.cities = params.data.cities;
        this.cuisines = params.data.cuisines;
    }

    onChange() {
        (this.params.data.settings as BehaviorSubject<IRestaurantsSearchSettings>).next(this.settings);
    }

    close() {
        this.viewCtrl.dismiss(this.settings);
    }
}
