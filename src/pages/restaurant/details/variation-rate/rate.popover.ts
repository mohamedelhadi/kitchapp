import { ViewController, NavParams } from "ionic-angular";
import { Component, Inject } from "@angular/core";
import { BasePopover } from "../../../../app/infrastructure/index";
import { RestaurantsData } from "../../../restaurants/restaurants.data";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { UI } from "../../../../app/helpers/index";
import { IVariation, IUser, USER, IVariationRate, ICategoryItem } from "../../../../app/contracts/index";

@Component({
    templateUrl: "rate.popover.html",
    selector: "variation-rate-popover"
})
export class VariationRatePopover extends BasePopover {
    item: ICategoryItem;
    rate: number = 3;
    comment: string = "";
    user: IUser;
    constructor(public viewCtrl: ViewController, private params: NavParams, private ui: UI, private restaurantsData: RestaurantsData, @Inject(USER) private userSubject: ReplaySubject<IUser>) {
        super({ viewCtrl });
        this.item = params.data.item;
    }
    ngOnInit() {
        super.ngOnInit();
        this.userSubject.takeUntil(this.viewCtrl.willUnload).subscribe(user => this.user = user);
    }
    close() {
        this.viewCtrl.dismiss();
    }
    submit() {
        this.restaurantsData
            .rateVariation({
                user: this.user,
                rate: this.rate,
                comment: this.comment,
                variationId: this.item.variations[0].id
            } as IVariationRate)
            .subscribe(newRate => {
                this.item.variations[0].rate = newRate;
                this.restaurantsData.updateStream();
                this.close();
            },
            err => this.close());
    }
}
