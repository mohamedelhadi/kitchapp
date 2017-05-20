import { Injectable } from "@angular/core";
import { AlertController, LoadingController, Loading, ToastController } from "ionic-angular";

@Injectable()
export class UI {

    loading: Loading;
    constructor(private alertCtrl: AlertController, private loadingCtrl: LoadingController, private toastCtrl: ToastController
    ) { }

    showError(msg?: string) {
        const alert = this.alertCtrl.create({
            // title: "Error",
            subTitle: msg || "An error occurred",
            buttons: ["Dismiss"]
        });
        alert.present();
        return alert;
    }
    showLoading(content?: string, showBackdrop: boolean = true) {
        if (!this.loading) {
            this.loading = this.loadingCtrl.create({
                spinner: "crescent",
                content,
                showBackdrop
                /*cssClass,
                delay,
                dismissOnPageChange,
                duration*/
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
    showToast(message: string, duration: number = 3000, position: string = "bottom") {
        const toast = this.toastCtrl.create({
            message,
            duration,
            position,
            dismissOnPageChange: true
        });
        toast.present();
    }
}
