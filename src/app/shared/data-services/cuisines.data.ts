import { Injectable } from "@angular/core";
import { Api } from "../../../app/services/api";
import { ICuisine, CUISINES } from "../../../contracts";
import { Storage } from "@ionic/storage";

import { BehaviorSubject } from "rxjs";

@Injectable()
export class CuisinesData {
    private cuisines = new BehaviorSubject<ICuisine[]>([]);

    constructor(private api: Api, private storage: Storage) {
        storage.ready().then(() => {
            this.storage.get(CUISINES).then((cuisines: ICuisine[]) => {
                if (cuisines) {
                    this.cuisines.next(cuisines);
                }
            });
        });
    }
    get Cuisines() {
        return this.cuisines.asObservable();
    }
    getCuisines(forceUpdate?: boolean) {
        if (forceUpdate || this.cuisines.getValue().length === 0) {
            this.api.get("cuisines").subscribe((cuisines: ICuisine[]) => {
                this.cuisines.next(cuisines);
            });
            /*setTimeout(() => {
                this.cuisines.next(this.tmp);
            }, 0);*/
        }
    }

    /*tmp: ICuisine[] = [
    {
        "id": 0,
        "name": [
            "Yen SDD Diverse",
            "Iceland Krona Intelligent Soft Fish Grocery, Electronics & Games"
        ]
    },
    {
        "id": 1,
        "name": [
            "Berkshire Drive Practical",
            "haptic Squares backing up"
        ]
    },
    {
        "id": 2,
        "name": [
            "multimedia redundant bypass",
            "International generate redundant"
        ]
    },
    {
        "id": 3,
        "name": [
            "invoice Auto Loan Account Intranet",
            "Plastic Tasty Concrete Bacon hard drive"
        ]
    },
    {
        "id": 4,
        "name": [
            "Intranet Lebanon platforms",
            "navigating Peso Uruguayo Uruguay Peso en Unidades Indexadas mesh"
        ]
    },
    {
        "id": 5,
        "name": [
            "array payment connecting",
            "Investment Account generating action-items"
        ]
    },
    {
        "id": 6,
        "name": [
            "Unbranded Fields Trail",
            "Metal Mill bandwidth"
        ]
    },
    {
        "id": 7,
        "name": [
            "California orange bandwidth",
            "Representative Intelligent Wooden Towels synthesize"
        ]
    },
    {
        "id": 8,
        "name": [
            "feed Cotton navigating",
            "ROI Awesome Fresh Gloves Connecticut"
        ]
    },
    {
        "id": 9,
        "name": [
            "Investment Account knowledge user Cross-platform",
            "grow Junctions parsing"
        ]
    },
    {
        "id": 10,
        "name": [
            "Credit Card Account transmitting Home",
            "panel Health Soft"
        ]
    },
    {
        "id": 11,
        "name": [
            "application Slovakia (Slovak Republic) Spur",
            "next-generation Horizontal Handcrafted Metal Pants"
        ]
    },
    {
        "id": 12,
        "name": [
            "Massachusetts Metal zero defect",
            "Cambridgeshire Analyst integrated"
        ]
    },
    {
        "id": 13,
        "name": [
            "Awesome Rubber Cheese Up-sized Borders",
            "Czech Koruna Ouguiya Parkway"
        ]
    },
    {
        "id": 14,
        "name": [
            "Rand Loti Licensed Fresh Pants payment",
            "portals parsing Niger"
        ]
    }
];*/
}
