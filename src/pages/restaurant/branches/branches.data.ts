/*import { Injectable } from "@angular/core";
import { Api } from "../../../app/services/api";
import { IBranch, BRANCHES, IBranchRate, IBranchRateSummary, IApiOptions } from "../../../contracts";
import { Storage } from "@ionic/storage";

import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/Observable";
import { RestaurantsData } from "../../restaurants/restaurants.data";

@Injectable()
export class BranchesData {
    private branches = new BehaviorSubject<IBranch[]>([]);

    constructor(private api: Api, private storage: Storage, private restaurantsData: RestaurantsData) {
        storage.ready().then(() => {
            this.storage.get(BRANCHES).then((branches: IBranch[]) => {
                if (branches) {
                    this.branches.next(branches);
                }
            });
        });
    }
    get Branches() {
        return this.branches.asObservable();
    }
    getBranches(forceUpdate?: boolean, options?: IApiOptions) {
        if (forceUpdate || this.branches.getValue().length === 0) {
            // { params: new URLSearchParams(`restaurantId=${restaurantId}`) }
            this.api.get("branches").subscribe((branches: IBranch[]) => {
                this.branches.next(branches);
            });
        }
    }
    getRestaurantBranches(restaurantId: number): Observable<IBranch[]> {
        return this.restaurantsData.getRestaurant(restaurantId).map(restaurant => restaurant.branches);
        // return this.api.get(`branches/restaurantbranches/${restaurantId}`);
    }
    rateBranch(rate: IBranchRate): Observable<IBranchRateSummary> {
        return this.api.post("branches/rate", rate).do(rateSummary => {
            const branches = this.branches.getValue();

            const ratedBranch = branches.find(branch => branch.id === +rate.branchId);
            ratedBranch.rate = rateSummary;
            this.branches.next(branches);
        });
    }
}
*/
