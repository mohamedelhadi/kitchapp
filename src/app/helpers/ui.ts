import { Injectable } from "@angular/core";
import { AlertController, LoadingController, Loading, ToastController } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { TranslationKeys, ErrorCodes } from "../contracts/index";

@Injectable()
export class UI {

    loading: Loading;
    constructor(
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        private translate: TranslateService) { }

    showError(messageKey?: string, interpolateParams?: any) {
        const alert = this.alertCtrl.create({
            // title: "Error",
            subTitle: this.translate.instant(messageKey || TranslationKeys.Errors[ErrorCodes.Unknown], interpolateParams),
            buttons: [this.translate.instant(TranslationKeys.Common.Dismiss)]
        });
        alert.present();
        return alert;
    }
    showLoading(content?: string, interpolateParams?: any, showBackdrop: boolean = true) {
        if (!this.loading) {
            this.loading = this.loadingCtrl.create({
                spinner: "crescent",
                content: content ? this.translate.instant(content, interpolateParams) : null,
                showBackdrop
                /*cssClass, delay, dismissOnPageChange, duration*/
            });
            this.loading.present();
        } else {
            this.loading.setContent(content);
        }
    }
    hideLoading() {
        if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
        }
    }
    showToast(messageKey: string, interpolateParams?: any, duration: number = 4000, position: string = "bottom") {
        const toast = this.toastCtrl.create({
            message: this.translate.instant(messageKey, interpolateParams),
            duration,
            position,
            dismissOnPageChange: true
        });
        toast.present();
    }
}
