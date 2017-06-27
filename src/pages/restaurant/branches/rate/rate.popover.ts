import { ViewController, NavParams } from "ionic-angular";
import { Component, Inject, ElementRef, ViewChild } from "@angular/core";
import { BasePopover } from "../../../../app/infrastructure/index";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { UI } from "../../../../app/helpers/index";
import { RestaurantsData } from "../../../restaurants/restaurants.data";
import { IBranch, IUser, IBranchRate } from "../../../../app/contracts/index";
import { Identity } from "../../../../app/services/index";

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
    comment: string = "";
    @ViewChild("txt") txt: ElementRef;
    canChangeBranch = false;
    constructor(public viewCtrl: ViewController, private params: NavParams, private ui: UI, private restaurantsData: RestaurantsData) {
        super({ viewCtrl });
        this.branches = params.data.branches;
        this.selectedBranch = params.data.branch ? params.data.branch : this.branches.length === 1 ? this.branches[0] : null;
        if (this.selectedBranch) {
            this.selectedBranchId = this.selectedBranch.id;
        } else {
            this.canChangeBranch = true;
        }
    }
    close() {
        this.viewCtrl.dismiss();
    }
    submit() {
        if (!this.selectedBranchId) {
            this.ui.showToast(this.translation.Messages.SelectBranch);
            return;
        }
        this.restaurantsData
            .rateBranch({
                quality: this.quality,
                service: this.service,
                place: this.place,
                price: this.price,
                comment: this.comment,
                branchId: this.selectedBranchId
            } as IBranchRate)
            .subscribe(rateSummary => {
                if (this.selectedBranch) {
                    this.selectedBranch.rate = rateSummary;
                } else {
                    const selectedBranch = this.branches.find(branch => branch.id === +this.selectedBranchId);
                    selectedBranch.rate = rateSummary;
                }
                this.restaurantsData.updateStream();
                this.close();
            }, err => this.close());
    }
    resize() {
        this.txt.nativeElement.style.height = this.txt.nativeElement.scrollHeight + "px";
    }
}
