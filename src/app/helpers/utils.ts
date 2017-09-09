import { Injectable } from "@angular/core";
import { IDropdownOption } from "../contracts/index";
import { Configuration } from "../config/env.config";
import { Environments } from "../config/configuration";

@Injectable()
export class Utils {
    public static isOnline() {
        return navigator.onLine;
    }
    public static getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
        const deg2rad = 0.017453292519943295; // === Math.PI / 180
        const cos = Math.cos;
        lat1 *= deg2rad;
        lon1 *= deg2rad;
        lat2 *= deg2rad;
        lon2 *= deg2rad;
        const a = (
            (1 - cos(lat2 - lat1)) +
            (1 - cos(lon2 - lon1)) * cos(lat1) * cos(lat2)
        ) / 2;

        return 12742 * Math.asin(Math.sqrt(a)); // Diameter of the earth in km (2 * 6371)
    }
    public static deepClone(o) { // recursiveDeepCopy2 =>  https://jsperf.com/js-deep-copy/7
        // use with discretion!
        let newO;
        let i;
        if (typeof o !== "object") { return o; }
        if (!o) { return o; }
        if (o.constructor === Array) {
            newO = [];
            for (i = 0; i < o.length; i += 1) {
                newO[i] = Utils.deepClone(o[i]);
            }
            return newO;
        }
        newO = {};
        /* may reduce performance
        for (let index = 0, keys = Object.keys(o); index < keys.length; index++) {
            const key = keys[index];
            newO[key] = Utils.deepClone(o[key]);
        }*/
        // tslint:disable-next-line:forin
        for (i in o) {
            newO[i] = Utils.deepClone(o[i]);
        }
        return newO;
    }
    public static containsArabic(text: string): boolean {
        return /[\u0600-\u06FF]/.test(text);
    }
    public static isPhoneNumber(phone: string): boolean {
        return phone ? phone.match(/^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g) !== null : false;
    }
    public static isNumber(value: any): boolean {
        return /^\d+$/.test(value);
    }
    public static openBrowser(link: string): void {
        (window as any).cordova.InAppBrowser.open(link, "_system", "location=yes");
    }
    public static getExtension(file: string | File): string {
        if (typeof (file) === "string" || file instanceof String) {
            // tslint:disable-next-line:no-bitwise
            return file.substr((~-file.lastIndexOf(".") >>> 0) + 2).toLowerCase();
        } else {
            // tslint:disable-next-line:no-bitwise
            return file.name.substr((~-file.name.lastIndexOf(".") >>> 0) + 2).toLowerCase();
        }
    }
    public static getFileName(file: string | File): string {
        if (typeof (file) === "string" || file instanceof String) {
            return file.substring(file.lastIndexOf("/") + 1);
        } else {
            return file.name;
        }
    }
    public static getPath(filePath: string): string {
        return filePath.substring(0, filePath.lastIndexOf("/") + 1);
    }
    public static normalizeFileName(name: string): string {
        name = name.replace(/[|&;$%@" \-<>()+,]/g, ""); // remove illegal chars
        name = name.replace(/\.(?=.*?\.)/, ""); // remove dots except the extension dot
        return name;
    }
    public static enumToDropdown(e): IDropdownOption[] {
        const options: IDropdownOption[] = [];
        for (const item in e) {
            if (e.hasOwnProperty(item) && !Utils.isNumber(item)) { // discard numeric keys of the enum
                options.push({ text: item, value: e[item] });
            }
        }
        return options;
    }
    public static getHash(value: string) {
        // tslint:disable-next-line:one-variable-per-declaration
        let hash = 0, i, chr, len;
        if (value.length === 0) {
            return hash;
        }
        for (i = 0, len = value.length; i < len; i++) {
            chr = value.charCodeAt(i);
            // tslint:disable-next-line:no-bitwise
            hash = ((hash << 5) - hash) + chr;
            // tslint:disable-next-line:no-bitwise
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }
    public static getMime(name: string): string {
        const extension = this.getExtension(name);
        switch (extension) {
            case "jpg": case "jpeg":
                return "image/jpeg";
            case "gif":
                return "image/gif";
            case "bmp":
                return "image/bmp";
            case "png":
                return "image/png";
            case "mp3":
                return "audio/mpeg";
            case "mid":
                return "application/x-midi";
            case "wav":
                return "audio/x-wav";
            case "amr":
                return "audio/amr";
            case "3gp":
                return "video/3gpp";
            case "aac":
                return "audio/x-aac";
            case "ogg":
                return "audio/ogg";
            case "flac":
                return "audio/x-flac";
            case "m4a":
                return "audio/mp4";
            case "pdf":
                return "application/pdf";
            case "txt":
                return "text/plain";
            case "doc":
                return "application/mxf";
            case "docx":
                return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case "xls":
                return "application/vnd.ms-excel";
            case "xlsx":
                return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
            case "ppt":
                return "application/vnd.ms-powerpoint";
            case "pptx":
                return "application/vnd.openxmlformats-officedocument.presentationml.presentation";
        }
    }

    constructor(private config: Configuration) { }
    public isDev() {
        return this.config.environment === Environments.dev || this.config.environment === Environments.browser;
    }
}
