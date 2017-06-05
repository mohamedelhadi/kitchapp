import { ViewController, NavParams, Select } from "ionic-angular";
import { Component, ViewChild } from "@angular/core";
import { BasePopover, AppSettings } from "../../../app/infrastructure/index";
import { Language } from "../../../app/contracts/index";

@Component({
    templateUrl: "popover.html",
    selector: "home-popover"
})
export class HomePopover extends BasePopover {
    en = Language.en;
    ar = Language.ar;
    constructor(public viewCtrl: ViewController, private params: NavParams, private appSettings: AppSettings) {
        super({ viewCtrl });
    }
    /*ngOnInit(): void {
        super.ngOnInit();
    }*/
    select(language: Language) {
        this.appSettings.setLanguage(language, this.settings);
        this.close();
    }
    close() {
        this.viewCtrl.dismiss();
    }
}