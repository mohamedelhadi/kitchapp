import { ViewController, NavParams } from "ionic-angular";
import { Component, Inject } from "@angular/core";
import { IBranch, IUser, USER, IBranchRate, IServerError, ErrorCode } from "../../../../contracts";
import { BasePopover } from "../../../../app/infrastructure/index";
import { ReplaySubject } from "rxjs/ReplaySubject";
import { UI } from "../../../../app/helpers/index";
import { RestaurantsData } from "../../../restaurants/restaurants.data";

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
    user: IUser;
    canChangeBranch = false;
    constructor(public viewCtrl: ViewController, private params: NavParams, private ui: UI, private restaurantsData: RestaurantsData, @Inject(USER) private userSubject: ReplaySubject<IUser>) {
        super({ viewCtrl });
        this.branches = params.data.branches;
        this.selectedBranch = params.data.branch ? params.data.branch : null;
        if (this.selectedBranch) {
            this.selectedBranchId = this.selectedBranch.id;
        } else {
            this.canChangeBranch = true;
        }
    }
    ngOnInit() {
        super.ngOnInit();
        this.userSubject.takeUntil(this.viewCtrl.willUnload).subscribe(user => this.user = user);
    }
    close() {
        this.viewCtrl.dismiss();
    }
    submit() {
        if (!this.selectedBranchId) {
            this.ui.showToast("Kindly select a branch from the list.");
            return;
        }
        this.restaurantsData
            .rateBranch({
                user: this.user,
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
}
