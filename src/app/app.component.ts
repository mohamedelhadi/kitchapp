import { Component, ViewChild, OnInit } from '@angular/core';
import {
    Platform, Nav, LoadingController, ToastController, App, MenuController, Tab
} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Subject } from 'rxjs/Subject';
import { AppSettings } from './infrastructure/app.settings';
import { Push } from './services/index';
import { Splash, SideMenu } from '../pages/index';
import { OverlayPortal } from 'ionic-angular/components/app/overlay-portal';

export const OnBack$ = new Subject<string>();

@Component({
    template: '<ion-nav [root]="rootPage"></ion-nav>',
    providers: [LoadingController, ToastController]
})
export class AppComponent {
    @ViewChild(Nav) public nav: Nav;
    public rootPage = Splash;
    constructor(
        private app: App, private menu: MenuController, private platform: Platform,
        private statusBar: StatusBar,
        private settings: AppSettings,
        private push: Push
    ) {
        this.initializeApp();
    }
    public async initializeApp() {
        await this.platform.ready();
        this.statusBar.styleDefault();
        this.settings.initLanguage();
        this.push.init();
        this.platform.registerBackButtonAction(() => {
            if (OnBack$.observers.length > 0) {
                OnBack$.next();
            } else {
                const nav = this.app.getActiveNav();
                if (this.menu && this.menu.isOpen()) {
                    this.menu.close();
                } else if (nav.canGoBack()) {
                    // normal navigation from page to another
                    nav.pop();
                } else if (nav instanceof Tab) {
                    // override tabs default behavior which only takes to previous tab
                    if (nav.index === 0) {
                        if (nav.parent.parent.canGoBack()) {
                            nav.parent.parent.pop();
                        }
                    } else {
                        nav.parent.select(0);
                    }
                } else if (nav instanceof OverlayPortal) {
                    nav.getActive().dismiss();
                } else {
                    this.platform.exitApp();
                }
            }
        });
    }
}
