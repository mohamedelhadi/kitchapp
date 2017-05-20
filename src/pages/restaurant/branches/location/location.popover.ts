import { ViewController, NavParams } from "ionic-angular";
import { Component, ViewChild, ElementRef, OnInit } from "@angular/core";
import { IBranch } from "../../../../contracts";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
    templateUrl: "location.popover.html",
    selector: "location-popover"
})
export class LocationPopover implements OnInit {
    @ViewChild("map") map: ElementRef;
    branch: IBranch;
    locationUrl: any;
    constructor(public viewCtrl: ViewController, private params: NavParams, private sanitizer: DomSanitizer) {
        this.branch = params.data.branch;
        this.locationUrl = this.sanitizer.bypassSecurityTrustUrl("geo:" + this.branch.location.latitude + "," + this.branch.location.longitude);
    }
    ngOnInit(): void {
        // Load map only after view is initialize
        this.loadMap();
    }
    sanitize(url: string) {
        return this.sanitizer.bypassSecurityTrustUrl(url);
    }
    loadMap() {
        if (google === undefined) { // failed to load google maps api due to network or whatever
            return;
        }
        const coordinates = { lat: this.branch.location.latitude, lng: this.branch.location.longitude };
        const map = new google.maps.Map(this.map.nativeElement, {
            center: coordinates,
            zoom: 16
        });
        const marker = new google.maps.Marker({
            position: coordinates,
            map,
            title: this.branch.name[0]
        });
        const infoWindow = new google.maps.InfoWindow({
            content: this.branch.name[0]
        });
        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    }
    close() {
        this.viewCtrl.dismiss();
    }
}
