import { ViewController, Platform } from "ionic-angular";
import { Storage, StorageConfig } from "@ionic/storage";
import { onBack } from "../../app.component";
import { OnInit, ReflectiveInjector } from "@angular/core";
import { TranslationKeys, IAppSettings } from "../../contracts/index";
import { Globalization } from "@ionic-native/globalization";
import { TranslateService } from "@ngx-translate/core";
import { Configuration } from "../../environments/env.config";
import { settings } from "../index";
import { ReplaySubject } from "rxjs/Rx";

export class BasePopover implements OnInit {
    public viewCtrl: ViewController;
    protected settings: IAppSettings;
    protected translation = TranslationKeys;
    constructor({ viewCtrl }: { viewCtrl: ViewController }) {
        this.viewCtrl = viewCtrl;
        settings.subscribe(settings => this.settings = settings);
    }
    ngOnInit(): void {
        const subscription = onBack.subscribe(() => this.viewCtrl.dismiss());
        this.viewCtrl.willUnload.subscribe(() => subscription.unsubscribe());
    }
}
