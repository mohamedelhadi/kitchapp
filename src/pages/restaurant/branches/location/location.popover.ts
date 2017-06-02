import { ViewController, NavParams } from "ionic-angular";
import { Component, ViewChild, ElementRef, OnInit, Renderer2 } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { BasePopover } from "../../../../app/infrastructure/index";
import { Utils } from "../../../../app/helpers/index";
import { IBranch } from "../../../../app/contracts/index";

declare const google;

@Component({
    templateUrl: "location.popover.html",
    selector: "location-popover"
})
export class LocationPopover extends BasePopover implements OnInit {
    @ViewChild("map") map: ElementRef;
    branch: IBranch;
    locationUrl: any;
    constructor(public viewCtrl: ViewController, private params: NavParams, private sanitizer: DomSanitizer, private renderer: Renderer2) {
        super({ viewCtrl });
        this.branch = params.data.branch;
        this.locationUrl = this.sanitizer.bypassSecurityTrustUrl("geo:" + this.branch.location.latitude + "," + this.branch.location.longitude);
    }
    ngOnInit(): void {
        super.ngOnInit();
        // Load map only after view is initialize
        if (Utils.isOnline()) {
            this.loadMap();
        } else {
            this.renderer.setStyle(this.map.nativeElement, "display", "none"); // because ngIf causes @ViewChild("map") to fail
        }
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
            title: this.branch.name[this.settings.language]
        });
        const infoWindow = new google.maps.InfoWindow({
            content: this.branch.name[this.settings.language]
        });
        marker.addListener("click", () => {
            infoWindow.open(map, marker);
        });
    }
    close() {
        this.viewCtrl.dismiss();
    }
}
