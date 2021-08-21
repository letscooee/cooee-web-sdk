import {LocalStorageHelper} from './local-storage-helper';
import {Constants} from '../constants';

/**
 * A simple data holder class that contains runtime state of the application/SDK.
 *
 * @author Abhishek Taparia
 * @version 0.0.1
 */
export class RuntimeData {

    private static instance: RuntimeData | null = null;

    private inInactive: boolean = true;
    private lastEnterActive: Date = new Date();
    private lastEnterInactive: Date | null = null;

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
        return this.inInactive;
    }

    /**
     * Set data when inactive.
     */
    public setInactive(): void {
        this.inInactive = true;
        this.lastEnterInactive = new Date();
        LocalStorageHelper.setNumber(Constants.STORAGE_LAST_ACTIVE, this.lastEnterInactive.getTime());
    }

    /**
     * Set data when active.
     */
    public setActive(): void {
        this.inInactive = false;
        this.lastEnterActive = new Date();
    }

    /**
     * Check if it first active after web launch.
     *
     * @return {boolean} true on web launch
     */
    public isFirstActive(): boolean {
        return this.lastEnterInactive == null;
    }

    /**
     * Get time of when last inactive occurred.
     *
     * @return {Date} when last inactive occurred
     */
    public getLastEnterInactive(): Date | null {
        return this.lastEnterInactive;
    }

    /**
     * Get active time in seconds.
     *
     * @return {number} total active seconds
     */
    public getTimeForActiveInSeconds(): number {
        // @ts-ignore
        return ((this.lastEnterInactive?.getTime() - this.lastEnterActive?.getTime()) / 1000);
    }

    /**
     * Get inactive time in seconds.
     *
     * @return {number} total inactive seconds
     */
    public getTimeForInactiveInSeconds(): number {
        if (this.lastEnterInactive == null) {
            return 0;
        }

        return ((new Date().getTime() - this.lastEnterInactive.getTime()) / 1000);
    }

}
