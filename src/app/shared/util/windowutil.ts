export class WindowUtil {
    static openWindow(url:string): void {
        this.getWindow().open(url);
    }
    static getWindow(): any {
        return window;
    }
}
