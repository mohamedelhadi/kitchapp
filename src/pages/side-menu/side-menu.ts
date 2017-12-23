import { Storage } from '@ionic/storage';
import { Component, ViewChild, OnInit } from '@angular/core';
import {
    NavController, NavParams, Nav,
    MenuController, PopoverController, App, Tab
} from 'ionic-angular';
import { Home, Settings, LanguagesPopover } from '../index';

import {
    TranslationKeys, Language, IAppSettings
} from '../../app/contracts/index';
import { Settings$ } from '../../app/infrastructure/index';
import { Identity, Auth } from '../../app/services/index';
import { DataLoader } from '../../app/services/data/index';
import { IUser } from '../../app/contracts/api.interfaces';

@Component({
    selector: 'side-menu',
    templateUrl: 'side-menu.html'
})
export class SideMenu implements OnInit {
    @ViewChild(Nav) public nav: Nav;
    public settings: IAppSettings;
    public rootPage: any = Home;
    public home = Home;
    public settingsPage = Settings;
    public about = null;
    public login = null;
    public translation = TranslationKeys;
    constructor(
        public navCtrl: NavController, public navParams: NavParams,
        public menu: MenuController, private popoverCtrl: PopoverController,
        public identity: Identity,
        private auth: Auth, private loader: DataLoader,
        private app: App
    ) { }
    public ngOnInit() {
        Settings$.subscribe(settings => this.settings = settings); // TODO: unsubscribe
    }
    public showLanguagePopover(ev) {
        this.close();
        const popover = this.popoverCtrl.create(LanguagesPopover);
        popover.present();
    }
    public isRtl() {
        return this.settings && this.settings.language === Language.ar;
    }
    public isLtr() {
        return !this.isRtl();
    }
    public async logout() {
        this.rootPage = this.home;
        this.close();
        await this.auth.logout();
        this.loader.clearData();
    }
    public close() {
        this.menu.close();
    }
    public goToHome() {
        if (this.rootPage !== this.home) {
            this.rootPage = this.home;
        }
    }
}
