import { ViewController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { IBranch } from "../../../../contracts";
import { BasePopover } from "../../../../app/infrastructure/index";

@Component({
    templateUrl: "rate.popover.html",
    selector: "branch-rate-popover"
})
export class BranchRatePopover extends BasePopover {
    branches: IBranch[];
    selectedBranch: IBranch;
    selectedBranchId?: number;
    quality = 3;
    service = 3;
    place = 3;
    price = 3;
    canChangeBranch = false;
    constructor(public viewCtrl: ViewController, private params: NavParams) {
        super({ viewCtrl });
        this.branches = params.data.branches;
        this.selectedBranch = params.data.branch ? params.data.branch : null;
        if (this.selectedBranch) {
            this.selectedBranchId = this.selectedBranch.id;
        } else {
            this.canChangeBranch = true;
        }
    }
    onChange() {
        // change
    }
    close() {
        this.viewCtrl.dismiss();
    }
}
