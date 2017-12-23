import { ViewController, NavParams } from 'ionic-angular';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { BasePopover } from '../../../../app/infrastructure/index';
import { RestaurantsData } from '../../../../app/services/data/restaurants.data';
import { IVariationRate, ICategoryItem } from '../../../../app/contracts/index';
import { Identity } from '../../../../app/services/index';
import { Observable } from 'rxjs/Observable';

@Component({
    templateUrl: 'rate.popover.html',
    selector: 'variation-rate-popover'
})
export class VariationRatePopover extends BasePopover {
    public item: ICategoryItem;
    public rate: number = 3;
    public comment: string = '';
    @ViewChild('txt') public txt: ElementRef;
    constructor(
        public viewCtrl: ViewController, private params: NavParams,
        private restaurantsData: RestaurantsData
    ) {
        super({ viewCtrl });
        this.item = params.data.item;
    }
    public close() {
        this.viewCtrl.dismiss();
    }
    public submit() {
        this.restaurantsData
            .rateVariation({
                rate: this.rate,
                comment: this.comment,
                variationId: this.item.variations[0].id
            } as IVariationRate)
            .catch(err => {
                this.close();
                return Observable.throw(err);
            })
            .subscribe(newRate => {
                this.item.variations[0].rate = newRate;
                this.restaurantsData.updateStream();
                this.close();
            });
    }
    public resize() {
        this.txt.nativeElement.style.height = this.txt.nativeElement.scrollHeight + 'px';
    }
}
