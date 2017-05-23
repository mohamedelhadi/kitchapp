import { ViewController } from "ionic-angular";
import { onBack } from "../../app.component";
import { OnInit } from "@angular/core";

export class BasePopover implements OnInit {
    public viewCtrl: ViewController;
    constructor({ viewCtrl }: { viewCtrl: ViewController }) {
        this.viewCtrl = viewCtrl;
    }
    ngOnInit(): void {
        const subscription = onBack.subscribe(() => this.viewCtrl.dismiss());
        this.viewCtrl.willUnload.subscribe(() => subscription.unsubscribe());
    }
}
