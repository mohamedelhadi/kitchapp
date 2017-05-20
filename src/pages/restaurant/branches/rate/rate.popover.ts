import { ViewController, NavParams } from "ionic-angular";
import { Component } from "@angular/core";
import { IBranch } from "../../../../contracts";

@Component({
    templateUrl: "rate.popover.html",
    selector: "branch-rate-popover"
})
export class BranchRatePopover {
    branches: IBranch[];
    selectedBranchId?: number;
    quality = 3;
    service = 3;
    place = 3;
    price = 3;
    canChangeBranch = false;
    constructor(public viewCtrl: ViewController, private params: NavParams) {
        this.branches = params.data.branches;
        this.selectedBranchId = params.data.branch ? params.data.branch.id : null;
        if (this.branches.length === 1) {
            this.selectedBranchId = this.branches[0].id;
        }
        if (this.selectedBranchId === null) {
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
