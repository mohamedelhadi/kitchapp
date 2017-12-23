/*
 * CustomQueryEncoderHelper
 * Fix plus sign (+) not encoding, being replaced with blank space
 * See: https://github.com/angular/angular/issues/11058#issuecomment-247367318
 */
import { QueryEncoder } from '@angular/http';

// Angular < v5
export class CustomQueryEncoder extends QueryEncoder {
    public encodeKey(k: string): string {
        k = super.encodeKey(k);
        return k.replace(/\+/gi, '%2B');
    }
    public encodeValue(v: string): string {
        v = super.encodeValue(v);
        return v.replace(/\+/gi, '%2B');
    }
}
