// Type definitions for lamejs
// Project: https://github.com/zhuker/lamejs
// Definitions by: MPN Conductor

declare module 'lamejs' {
    export class Mp3Encoder {
        constructor(channels: number, samplerate: number, kbps: number);
        encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array;
        flush(): Int8Array;
    }

    export = lamejs;
}

declare namespace lamejs {
    class Mp3Encoder {
        constructor(channels: number, samplerate: number, kbps: number);
        encodeBuffer(left: Int16Array, right?: Int16Array): Int8Array;
        flush(): Int8Array;
    }
}
