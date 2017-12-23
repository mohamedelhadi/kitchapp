import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SideMenu } from '../index';
import { DataLoader } from '../../app/services/data/index';
import { Settings$ } from '../../app/infrastructure/index';
import { Auth } from '../../app/services/index';

@Component({
    selector: 'page-splash',
    templateUrl: 'splash.html'
})
export class Splash implements OnInit {
    constructor(
        public navCtrl: NavController,
        private loader: DataLoader,
        private splashScreen: SplashScreen,
        private translate: TranslateService) {
    }

    public ngOnInit() {
        this.translate.onLangChange.first().subscribe(() => {
            Settings$.first().subscribe((settings) => {
                this.loader.load();
                if (settings.isFirstLaunch) {
                    /* this.navCtrl.setRoot(Intro).then(() => this.splashScreen.hide());
                    return;*/
                }
                this.navCtrl.setRoot(SideMenu);
            });
        });
    }
}
