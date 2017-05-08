import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { Platform, Nav } from "ionic-angular";
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Splash } from "../pages/splash/splash";

@Component({
    templateUrl: "app.html"
})
export class App implements OnInit {
    @ViewChild(Nav) nav: Nav;

    constructor(private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
        });
    }

    ngOnInit() {
        this.nav.setRoot(Splash).then(() => {
            // this.splashscreen.hide();
        });
    }
}
