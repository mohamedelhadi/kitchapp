import { ViewController } from "ionic-angular";
import { OnBack$ } from "../../app.component";
import { OnInit } from "@angular/core";
import { TranslationKeys, IAppSettings } from "../../contracts/index";
import { Settings$ } from "../index";

export class BasePopover implements OnInit {
    public viewCtrl: ViewController;
    protected settings: IAppSettings;
    protected translation = TranslationKeys;
    constructor({ viewCtrl }: { viewCtrl: ViewController }) {
        this.viewCtrl = viewCtrl;
    }
    public ngOnInit(): void {
        Settings$.takeUntil(this.viewCtrl.willUnload).subscribe(settings => this.settings = settings);
        OnBack$.takeUntil(this.viewCtrl.willUnload).subscribe(() => this.viewCtrl.dismiss());
    }
}
