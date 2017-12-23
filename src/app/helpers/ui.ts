import { Injectable } from '@angular/core';
import { AlertController, LoadingController, Loading, ToastController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { TranslationKeys, ErrorCodes, IAppSettings } from '../contracts/index';
import { Settings$ } from '../infrastructure/index';
import { default as format } from 'date-fns/format';

@Injectable()
export class UI {
    private loading: Loading;
    private loadingTimer: any;
    private settings: IAppSettings;
    constructor(
        private alertCtrl: AlertController,
        private loadingCtrl: LoadingController,
        private toastCtrl: ToastController,
        public translate: TranslateService
    ) {
        Settings$.subscribe(settings => this.settings = settings);
    }

    public formatDate(date: Date | string) {
        return date ? format(date, this.settings.dateFormat) : null;
    }
    public showMessage(messageKey?: string, titleKey?: string, interpolateParams?: any) {
        const alert = this.alertCtrl.create({
            title: titleKey ? this.translate.instant(titleKey, interpolateParams) : '',
            subTitle: messageKey ? this.translate.instant(messageKey, interpolateParams) : '',
            buttons: [this.translate.instant(TranslationKeys.Common.Ok)]
        });
        alert.present();
        return alert;
    }
    public showError(messageKey?: string, interpolateParams?: any) {
        const alert = this.alertCtrl.create({
            subTitle: this.translate.instant(
                messageKey || TranslationKeys.Errors[ErrorCodes.Unknown], interpolateParams
            ),
            buttons: [this.translate.instant(TranslationKeys.Common.Dismiss)]
        });
        alert.present();
        return alert;
    }
    public showConfirm(messageKey: string, titleKey?: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const alert = this.alertCtrl.create({
                title: titleKey ? this.translate.instant(titleKey) : '',
                cssClass: 'confirm-alert',
                message: this.translate.instant(messageKey),
                buttons: [
                    {
                        cssClass: 'cancel',
                        text: this.translate.instant(TranslationKeys.Common.Cancel),
                        role: 'cancel',
                        handler: () => {
                            resolve(false);
                        }
                    },
                    {
                        cssClass: 'yes',
                        text: this.translate.instant(TranslationKeys.Common.Yes),
                        handler: () => {
                            resolve(true);
                        }
                    }
                ]
            });
            alert.present();
        });
    }
    public showLoading(
        content?: string, delay?: number, interpolateParams?: any, showBackdrop: boolean = true
    ) {
        if (!this.loading) {
            if (delay) {
                this.loadingTimer = setTimeout(
                    () => this.createLoading(content, interpolateParams, showBackdrop),
                    delay
                );
            } else {
                this.createLoading(content, interpolateParams, showBackdrop);
            }
        } else {
            this.loading.setContent(content);
        }
    }
    private createLoading(content?: string, interpolateParams?: any, showBackdrop: boolean = true) {
        this.loading = this.loadingCtrl.create({
            showBackdrop,
            spinner: 'crescent',
            content: content ? this.translate.instant(content, interpolateParams) : null
            /*cssClass, delay, dismissOnPageChange, duration*/
        });
        this.loading.present();
    }
    public hideLoading() {
        if (this.loading) {
            this.loading.dismiss();
            this.loading = null;
        }
        if (this.loadingTimer) {
            clearTimeout(this.loadingTimer);
            this.loadingTimer = null;
        }
    }
    public showToast(
        messageKey: string, interpolateParams?: any,
        duration: number = 3000, position: string = 'bottom') {
        const toast = this.toastCtrl.create({
            duration,
            position,
            message: this.translate.instant(messageKey, interpolateParams),
            dismissOnPageChange: false
        });
        toast.present();
    }
}
