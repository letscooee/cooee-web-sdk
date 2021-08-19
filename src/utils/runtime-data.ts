/**
 * A simple data holder class that contains runtime state of the application/SDK.
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class RuntimeData {

    private static instance: RuntimeData | null = null;

    private inBackground: boolean = true;
    private lastEnterForeground: Date = new Date();
    private lastEnterBackground: Date | null = null;

    /**
     * Get instance of the class.
     *
     * @return {RuntimeData}
     */
    public static getInstance(): RuntimeData {
        if (this.instance == null) {
            this.instance = new RuntimeData();

        }
        return this.instance;
    }

    /**
     * Check if app is inactive.
     *
     * @return {boolean}
     */
    public isInactive(): boolean {
        return this.inBackground;
    }

    /**
     * Set data when inactive.
     */
    public setInactive() {
        this.inBackground = true;
        this.lastEnterBackground = new Date();
    }

    /**
     * Set data when active.
     */
    public setActive() {
        this.inBackground = false;
        this.lastEnterForeground = new Date();
    }

    /**
     * Check if it first active after web launch.
     *
     * @return {boolean}
     */
    public isFirstActive(): boolean {
        return this.lastEnterBackground == null;
    }

    /**
     * Get time of when last inactive occurred.
     *
     * @return {Date}
     */
    public getLastEnterInactive(): Date | null {
        return this.lastEnterBackground;
    }

    /**
     * Get active time in seconds.
     *
     * @return {number}
     */
    public getTimeForActiveInSeconds(): number {
        // @ts-ignore
        return ((this.lastEnterBackground?.getTime() - this.lastEnterForeground?.getTime()) / 1000);
    }

    /**
     * Get inactive time in seconds.
     *
     * @return {number}
     */
    public getTimeForInactiveInSeconds(): number {
        if (this.lastEnterBackground == null) {
            return 0;
        }

        return ((new Date().getTime() - this.lastEnterBackground.getTime()) / 1000);
    }

}
