import { ViewController, NavParams, PopoverController } from 'ionic-angular';
import { Component } from '@angular/core';
import { VariationRatePopover } from '../variation-rate/rate.popover';
import { BasePopover } from '../../../../app/infrastructure/index';
import { ICategoryItem } from '../../../../app/contracts/index';
import { Auth } from '../../../../app/services/index';

@Component({
    templateUrl: 'variations.popover.html',
    selector: 'variations-popover'
})
export class VariationsPopover extends BasePopover {
    public item: ICategoryItem;
    constructor(
        public viewCtrl: ViewController, private params: NavParams,
        private popoverCtrl: PopoverController, private auth: Auth
    ) {
        super({ viewCtrl });
        this.item = params.data.item;
    }
    public async showVariationRate(ev) {
        const loggedIn = await this.auth.isLoggedIn();
        if (loggedIn) {
            this.showPopover();
        } else {
            const successfullyLoggedIn = await this.auth.loginWithFacebook(
                this.translation.Messages.YouNeedToLoginInOrderToRate
            );
            if (successfullyLoggedIn) {
                this.showPopover();
            }
        }
    }
    public showPopover() {
        const popover = this.popoverCtrl.create(
            VariationRatePopover,
            { item: this.item },
            { cssClass: 'top-popover' }
        );
        popover.present();
    }
    public close() {
        this.viewCtrl.dismiss();
    }
    public getBackground() {
        // tslint:disable-next-line:max-line-length
        return `url(${this.item.variations[0].photo}) no-repeat center, url('assets/images/item.png') no-repeat center`;
    }
}
