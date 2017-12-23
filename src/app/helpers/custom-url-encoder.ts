import { HttpUrlEncodingCodec } from '@angular/common/http';
// Angular v5
export class CustomUrlEncoder extends HttpUrlEncodingCodec {
    public encodeKey(k: string): string {
        k = super.encodeKey(k);
        return k.replace(/\+/gi, '%2B');
    }
    public encodeValue(v: string): string {
        v = super.encodeValue(v);
        return v.replace(/\+/gi, '%2B');
    }
}
