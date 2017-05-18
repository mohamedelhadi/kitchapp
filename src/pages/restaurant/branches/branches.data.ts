import { Injectable } from "@angular/core";
import { Api } from "../../../app/services/api";
import { IBranch, BRANCHES } from "../../../contracts";
import { Storage } from "@ionic/storage";

import { BehaviorSubject } from "rxjs";
import { Observable } from "rxjs/Observable";

@Injectable()
export class BranchesData {
    private branches = new BehaviorSubject<IBranch[]>([]);

    constructor(private api: Api, private storage: Storage) {
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
    getBranches(forceUpdate?: boolean) {
        if (forceUpdate || this.branches.getValue().length === 0) {
            // { params: new URLSearchParams(`restaurantId=${restaurantId}`) }
            this.api.get("branches").subscribe((branches: IBranch[]) => {
                this.branches.next(branches);
            });
        }
    }

    getRestaurantBranches(restaurantId: number): Observable<IBranch[]> {
        return this.api.get(`branches/restaurantbranches/${restaurantId}`);
        /*.subscribe((branches: IBranch[]) => {
            this.branches.next(branches);
        });*/
    }
}
