import { Injectable } from "@angular/core";
import { AlertController, LoadingController, Loading, ToastController } from "ionic-angular";
import { TranslateService } from "@ngx-translate/core";
import { TranslationKeys, ErrorCodes } from "../contracts/index";

@Injectable()
export class UI {
    private loading: Loading;
    constructor(
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        public translate: TranslateService) { }

    public showError(messageKey?: string, interpolateParams?: any) {
        const alert = this.alertCtrl.create({
            subTitle: this.translate.instant(messageKey || TranslationKeys.Errors[ErrorCodes.Unknown], interpolateParams),
            buttons: [this.translate.instant(TranslationKeys.Common.Dismiss)]
        });
        alert.present();
        return alert;
    }
    public showLoading(content?: string, interpolateParams?: any, showBackdrop: boolean = true) {
        if (!this.loading) {
            this.loading = this.loadingCtrl.create({
                showBackdrop,
                spinner: "crescent",
                content: content ? this.translate.instant(content, interpolateParams) : null
                /*cssClass, delay, dismissOnPageChange, duration*/
            });
            this.loading.present();
        } else {
            this.loading.setContent(content);
        }
    }
    public hideLoading() {
        if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
        }
    }
    public showToast(messageKey: string, interpolateParams?: any, duration: number = 4000, position: string = "bottom") {
        const toast = this.toastCtrl.create({
            duration,
            position,
            message: this.translate.instant(messageKey, interpolateParams),
            dismissOnPageChange: true
        });
        toast.present();
    }
}
