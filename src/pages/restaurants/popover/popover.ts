import { ViewController, NavParams, Select } from "ionic-angular";
import { Component, ViewChild } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { BasePopover } from "../../../app/infrastructure/index";
import { IRestaurantsSearchSettings, ICity, ICuisine } from "../../../app/contracts/index";

@Component({
    templateUrl: "popover.html",
    selector: "restaurants-popover"
})
export class RestaurantsPopover extends BasePopover {
    searchSettings: IRestaurantsSearchSettings;
    cities: Observable<ICity[]>;
    cuisines: Observable<ICuisine[]>;
    // @ViewChild(Select) select: Select; picks the first select only
    @ViewChild("citiesSelect") citiesSelect: Select;
    @ViewChild("cuisinesSelect") cuisinesSelect: Select;
    constructor(public viewCtrl: ViewController, private params: NavParams) {
        super({ viewCtrl });
        (params.data.settings as BehaviorSubject<IRestaurantsSearchSettings>).subscribe(settings => this.searchSettings = settings);
        this.cities = params.data.cities;
        this.cuisines = params.data.cuisines;
    }
    ngOnInit(): void {
        super.ngOnInit();
        this.viewCtrl.willUnload.subscribe(() => {
            this.citiesSelect.close();
            this.cuisinesSelect.close();
        });
    }
    onChange() {
        (this.params.data.settings as BehaviorSubject<IRestaurantsSearchSettings>).next(this.searchSettings);
    }
    close() {
        this.viewCtrl.dismiss(this.searchSettings);
    }
}
