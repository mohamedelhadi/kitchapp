import { ViewController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { IRestaurantsOrderSettings } from "../../../contracts";

@Component({
    template: `
        <ion-row padding-left padding-right>
            <ion-label>Order</ion-label>
        </ion-row>
        <ion-list>
            <ion-item>
                <ion-label>A - Z</ion-label>
                <ion-toggle (ionChange)="order()" [(ngModel)]="settings.AtoZ" checked="settings.AtoZ"></ion-toggle>
            </ion-item>
            <ion-item>
                <ion-label>Nearby</ion-label>
                <ion-toggle (ionChange)="order()" [(ngModel)]="settings.Nearby" checked="settings.Nearby"></ion-toggle>
            </ion-item>
            <ion-item>
                <ion-label>Top rated</ion-label>
                <ion-toggle (ionChange)="order()" [(ngModel)]="settings.TopRated" checked="settings.TopRated"></ion-toggle>
            </ion-item>
        </ion-list>
        <!--
        <ion-row>
            <ion-col>
                <ion-label text-right>A - Z</ion-label>
            </ion-col>
            <ion-col>
                <ion-toggle [(ngModel)]="orderSettings.AtoZ" checked="orderSettings.AtoZ"></ion-toggle>
            </ion-col>
            <ion-col>
                <ion-label>Z - A</ion-label>
            </ion-col>
        </ion-row>
        <ion-row padding>
            <button ion-button (click)="close()" block>Done</button>
        </ion-row>-->
  `,
    selector: "restaurants-popover"
})
export class RestaurantsPopover {
    settings: IRestaurantsOrderSettings;
    order: () => void;
    constructor(public viewCtrl: ViewController, private params: NavParams) {
        this.settings = params.data.settings;
        this.order = params.data.order;
    }

    close() {
        this.viewCtrl.dismiss();
    }
}
