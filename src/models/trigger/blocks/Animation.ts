export class Animation {

    readonly en?: EnterAnimation;
    readonly ex?: ExitAnimation;

    constructor(data?: Partial<Animation>) {
        data = data ?? {};
        this.en = data.en;
        this.ex = data.ex;
    }

    getEnterAnimation(): Keyframe[] {
        switch (this.en) {
            case EnterAnimation.SLIDE_IN_TOP:
                return [
                    {transform: 'translateY(-100%)'},
                    {transform: 'translateY(0%)'},
                ];
            case EnterAnimation.SLIDE_IN_DOWN:
                return [
                    {transform: 'translateY(100%)'},
                    {transform: 'translateY(0%)'},
                ];
            case EnterAnimation.SLIDE_IN_LEFT:
                return [
                    {transform: 'translateX(-100%)'},
                    {transform: 'translateX(0%)'},
                ];
            case EnterAnimation.SLIDE_IN_RIGHT:
                return [
                    {transform: 'translateX(100%)'},
                    {transform: 'translateX(0%)'},
                ];
            case EnterAnimation.SLIDE_IN_TOP_LEFT:
                return [
                    {transform: 'translate(-100%, -100%)'},
                    {transform: 'translate(0%, 0%)'},
                ];
            case EnterAnimation.SLIDE_IN_TOP_RIGHT:
                return [
                    {transform: 'translate(100%, -100%)'},
                    {transform: 'translate(0%, 0%)'},
                ];
            case EnterAnimation.SLIDE_IN_BOTTOM_LEFT:
                return [
                    {transform: 'translate(-100%, 100%)'},
                    {transform: 'translate(0%, 0%)'},
                ];
            case EnterAnimation.SLIDE_IN_BOTTOM_RIGHT:
                return [
                    {transform: 'translate(100%, 100%)'},
                    {transform: 'translate(0%, 0%)'},
                ];
            case EnterAnimation.POP:
                return [
                    {transform: 'scale(0.1)'},
                    {transform: 'scale(1)'},
                ];
            default:
                return [];
        }
    }

    getExitAnimation(): Keyframe[] {
        switch (this.ex) {
            case ExitAnimation.SLIDE_OUT_TOP:
                return [
                    {transform: 'translateY(0%)'},
                    {transform: 'translateY(-100%)'},
                ];
            case ExitAnimation.SLIDE_OUT_DOWN:
                return [
                    {transform: 'translateY(0%)'},
                    {transform: 'translateY(100%)'},
                ];
            case ExitAnimation.SLIDE_OUT_LEFT:
                return [
                    {transform: 'translateX(0%)'},
                    {transform: 'translateX(-100%)'},
                ];
            case ExitAnimation.SLIDE_OUT_RIGHT:
                return [
                    {transform: 'translateX(0%)'},
                    {transform: 'translateX(100%)'},
                ];
            case ExitAnimation.SLIDE_OUT_TOP_LEFT:
                return [
                    {transform: 'translate(0%, 0%)'},
                    {transform: 'translate(-100%, -100%)'},
                ];
            case ExitAnimation.SLIDE_OUT_TOP_RIGHT:
                return [
                    {transform: 'translate(0%, 0%)'},
                    {transform: 'translate(100%, -100%)'},
                ];
            case ExitAnimation.SLIDE_OUT_BOTTOM_LEFT:
                return [
                    {transform: 'translate(0%, 0%)'},
                    {transform: 'translate(-100%, 100%)'},
                ];
            case ExitAnimation.SLIDE_OUT_BOTTOM_RIGHT:
                return [
                    {transform: 'translate(0%, 0%)'},
                    {transform: 'translate(100%, 100%)'},
                ];
            case ExitAnimation.POP:
                return [
                    {transform: 'scale(1)'},
                    {transform: 'scale(0)'},
                ];
            default:
                return [];
        }
    }

}

export enum EnterAnimation {
    NONE = 1,
    SLIDE_IN_TOP, SLIDE_IN_DOWN, SLIDE_IN_LEFT, SLIDE_IN_RIGHT,
    SLIDE_IN_TOP_LEFT, SLIDE_IN_TOP_RIGHT, SLIDE_IN_BOTTOM_LEFT, SLIDE_IN_BOTTOM_RIGHT, POP
}

export enum ExitAnimation {
    NONE = 1,
    SLIDE_OUT_TOP, SLIDE_OUT_DOWN, SLIDE_OUT_LEFT, SLIDE_OUT_RIGHT,
    SLIDE_OUT_TOP_LEFT, SLIDE_OUT_TOP_RIGHT, SLIDE_OUT_BOTTOM_LEFT, SLIDE_OUT_BOTTOM_RIGHT, POP
}
