import { ViewController, NavParams, PopoverController } from "ionic-angular";
import { Component } from "@angular/core";
import { BasePopover } from "../../../../app/infrastructure/index";
import { IUser, IFeedback, IRestaurant } from "../../../../app/contracts/index";
import { UI } from "../../../../app/helpers/index";
import { Auth, Identity } from "../../../../app/services/index";
import { RestaurantsData } from "../../../restaurants/restaurants.data";

@Component({
    templateUrl: "feedback.popover.html",
    selector: "feedback-popover"
})
export class FeedbackPopover extends BasePopover {
    restaurant: IRestaurant;
    message: string = "";
    user: IUser;
    constructor(public viewCtrl: ViewController, private params: NavParams, private popoverCtrl: PopoverController, private ui: UI, private restaurantsData: RestaurantsData, private identity: Identity) {
        super({ viewCtrl });
        this.restaurant = params.data.restaurant;
    }
    ngOnInit() {
        super.ngOnInit();
        this.identity.User.takeUntil(this.viewCtrl.willUnload).subscribe(user => this.user = user);
    }
    send() {
        if (this.message) {
            this.restaurantsData
                .sendFeedback({
                    message: this.message,
                    restaurantId: this.restaurant.id
                } as IFeedback)
                .subscribe(() => this.close(), err => this.close());
        } else {
            this.ui.showToast(this.translation.Messages.ForgotToEnterFeedback);
        }
    }
    close() {
        this.viewCtrl.dismiss();
    }
}
