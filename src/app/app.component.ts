import { Component, ViewChild, AfterViewInit, OnInit } from "@angular/core";
import { Platform, Nav, LoadingController, ToastController, ViewController, App, MenuController, Tab } from "ionic-angular";
import { SplashScreen } from "@ionic-native/splash-screen";
import { StatusBar } from "@ionic-native/status-bar";
import { Splash } from "../pages/splash/splash";
import { Subject } from "rxjs/Subject";

export const onBack = new Subject<string>();

@Component({
    templateUrl: "app.component.html",
    providers: [LoadingController, ToastController]
})
export class AppComponent implements OnInit {
    @ViewChild(Nav) nav: Nav;

    constructor(private app: App, private platform: Platform, private statusBar: StatusBar, private splashScreen: SplashScreen, private menu: MenuController) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleDefault();
            this.platform.registerBackButtonAction(() => {
                if (onBack.observers.length > 0) {
                    onBack.next();
                } else {
                    const nav = this.app.getActiveNav();
                    if (this.menu && this.menu.isOpen()) {
                        return this.menu.close();
                    } else if (nav.canGoBack()) {
                        // normal navigations from page to another
                        nav.pop();
                    } else if (nav instanceof Tab) {
                        // override tabs default behavior which takes which pop's out completely to the previous page
                        if (nav.index === 0) {
                            nav.parent.parent.pop();
                        } else {
                            nav.parent.select(0);
                        }
                    } else {
                        this.platform.exitApp();
                    }
                    /* in case needed in future
                    const activeView: ViewController = nav.getActive();
                    if (typeof activeView.instance.onBackButton === "function") {
                        activeView.instance.onBackButton();
                    }*/
                }
            });
        });
    }

    ngOnInit() {
        this.nav.setRoot(Splash).then(() => {
            // this.splashscreen.hide();
        });
    }
}
