export class Stopwatch {
    private _hrtime: [number, number] = [0, 0];

    start() {
        this._hrtime = process.hrtime();
    }

    interval() {
        this._hrtime = process.hrtime(this._hrtime);
        return secondsToTime(this._hrtime[0]);
    }
}

const secondsToTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600)
        .toString()
        .padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60)
        .toString()
        .padStart(2, '0');
    const s = Math.floor(seconds % 60)
        .toString()
        .padStart(2, '0');
    return `${h}:${m}:${s}`;
};
