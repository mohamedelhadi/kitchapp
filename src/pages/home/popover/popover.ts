import { ViewController } from "ionic-angular";
import { Component } from "@angular/core";
import { BasePopover, AppSettings } from "../../../app/infrastructure/index";
import { Language } from "../../../app/contracts/index";

@Component({
    templateUrl: "popover.html",
    selector: "home-popover"
})
export class HomePopover extends BasePopover {
    public en = Language.en;
    public ar = Language.ar;
    constructor(public viewCtrl: ViewController, private appSettings: AppSettings) {
        super({ viewCtrl });
    }
    public select(language: Language) {
        this.appSettings.setLanguage(language, this.settings);
        this.close();
    }
    public close() {
        this.viewCtrl.dismiss();
    }
}
