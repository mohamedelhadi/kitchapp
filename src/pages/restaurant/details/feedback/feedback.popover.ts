import { ViewController, NavParams, PopoverController } from "ionic-angular";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { BasePopover } from "../../../../app/infrastructure/index";
import { IUser, IFeedback, IRestaurant } from "../../../../app/contracts/index";
import { UI } from "../../../../app/helpers/index";
import { RestaurantsData } from "../../../restaurants/restaurants.data";

@Component({
    templateUrl: "feedback.popover.html",
    selector: "feedback-popover"
})
export class FeedbackPopover extends BasePopover {
    @ViewChild("msg") msg: ElementRef;
    message: string = "";
    restaurant: IRestaurant;
    constructor(public viewCtrl: ViewController, private params: NavParams, private popoverCtrl: PopoverController, private ui: UI, private restaurantsData: RestaurantsData) {
        super({ viewCtrl });
        this.restaurant = params.data.restaurant;
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
    resize() {
        this.msg.nativeElement.style.height = this.msg.nativeElement.scrollHeight + "px";
    }
}