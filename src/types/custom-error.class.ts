export class CustomError {
    readonly _msg: string;

    constructor(msg: string) {
        this._msg = msg;
    }

    get msg() {
        return this._msg;
    }
}