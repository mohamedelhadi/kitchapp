import { ViewController, NavParams, Select } from "ionic-angular";
import { Component, ViewChild, OnInit } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { BasePopover } from "../../../app/infrastructure/index";
import { IRestaurantsSearchSettings, ICity, ICuisine } from "../../../app/contracts/index";

@Component({
    templateUrl: "popover.html",
    selector: "restaurants-popover"
})
export class RestaurantsPopover extends BasePopover implements OnInit {
    public searchSettings: IRestaurantsSearchSettings;
    public cities: Observable<ICity[]>;
    public cuisines: Observable<ICuisine[]>;
    @ViewChild("citiesSelect") public citiesSelect: Select;
    @ViewChild("cuisinesSelect") public cuisinesSelect: Select;
    constructor(public viewCtrl: ViewController, private params: NavParams) {
        super({ viewCtrl });
        this.cities = params.data.cities;
        this.cuisines = params.data.cuisines;
    }
    public ngOnInit(): void {
        super.ngOnInit();
        const searchSettings$: BehaviorSubject<IRestaurantsSearchSettings> = this.params.data.settings;
        searchSettings$.takeUntil(this.viewCtrl.willUnload).subscribe(settings => this.searchSettings = settings);
        this.viewCtrl.willUnload.subscribe(() => {
            this.citiesSelect.close();
            this.cuisinesSelect.close();
        });
    }
    public onChange() {
        (this.params.data.settings as BehaviorSubject<IRestaurantsSearchSettings>).next(this.searchSettings);
    }
    public close() {
        this.viewCtrl.dismiss(this.searchSettings);
    }
}
