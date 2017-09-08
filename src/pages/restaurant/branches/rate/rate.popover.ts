import { ViewController, NavParams } from "ionic-angular";
import { Component, Inject, ElementRef, ViewChild } from "@angular/core";
import { BasePopover } from "../../../../app/infrastructure/index";
import { UI } from "../../../../app/helpers/index";
import { RestaurantsData } from "../../../../app/services/data/restaurants.data";
import { IBranch, IUser, IBranchRate } from "../../../../app/contracts/index";
import { Identity } from "../../../../app/services/index";

@Component({
    templateUrl: "rate.popover.html",
    selector: "branch-rate-popover"
})
export class BranchRatePopover extends BasePopover {
    public branches: IBranch[];
    public selectedBranch: IBranch;
    public selectedBranchId?: number;
    public quality = 3;
    public service = 3;
    public place = 3;
    public price = 3;
    public comment: string = "";
    @ViewChild("txt") public txt: ElementRef;
    public canChangeBranch = false;
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
    public close() {
        this.viewCtrl.dismiss();
    }
    public submit() {
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
            .subscribe(
            rateSummary => {
                if (this.selectedBranch) {
                    this.selectedBranch.rate = rateSummary;
                } else {
                    const selectedBranch = this.branches.find(branch => branch.id === +this.selectedBranchId);
                    selectedBranch.rate = rateSummary;
                }
                this.restaurantsData.updateStream();
                this.close();
            },
            err => this.close());
    }
    public resize() {
        this.txt.nativeElement.style.height = this.txt.nativeElement.scrollHeight + "px";
    }
}
