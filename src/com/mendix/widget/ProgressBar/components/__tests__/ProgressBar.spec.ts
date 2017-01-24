import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { MicroFlowProps, ProgressBar, ProgressBarProps } from "../ProgressBar";

import { MxLogger, MxMock, MxUiMock } from "tests/mocks/Mendix";

describe("Progress bar", () => {
    const renderProgressBar = (props: ProgressBarProps) => shallow(createElement(ProgressBar, props));
    const colorSwitch = 50;
    const percentage = 23;
    const maximumValue = 100;
    const progressBarWrapper = renderProgressBar({ colorSwitch, percentage });
    const progressBar = progressBarWrapper.childAt(0);
    let mxOriginal: mx.mx;

    beforeAll(() => {
        mxOriginal = window.mx;
        window.logger = MxLogger.prototype;
        window.mx = MxMock.prototype;
        window.mx.ui = MxUiMock.prototype;
    });

    it("has progress bar structure", () => {
        const plainProgressBar = renderProgressBar({ colorSwitch: 0, percentage: 80 });

        expect(plainProgressBar).toBeElement(
            DOM.div({
                className: "widget-progressbar progress",
                onClick: jasmine.any(Function) as any,
                style: { width: "100%" }
            },
                DOM.div({ className: "progress-bar", style: { width: jasmine.any(String) } },
                    jasmine.any(String) as any
                )
            )
        );
    });

    it("should render the progress", () => {
        const bar = renderProgressBar({ percentage, colorSwitch, maximumValue });

        expect(bar.text()).toEqual("23%");
    });

    it("should render the progress when percentage is negative", () => {
        const bar = renderProgressBar({ colorSwitch, percentage: -10, maximumValue}).childAt(0);

        expect(bar.text()).toEqual("-10%");
    });

    it("should render the progress label 200% when percentage is 200", () => {
        const bar = renderProgressBar({ colorSwitch, percentage: 200, maximumValue }).childAt(0);

        expect(bar.text()).toEqual("200%");
    });

    it("should render the progress label invalid when maximum value is less than 1", () => {
        const bar = renderProgressBar({ colorSwitch, maximumValue: 0, percentage: 200 }).childAt(0);

        expect(bar.text()).toEqual("Invalid");
    });

    it("should render the progress label with empty when percentage is undefined", () => {
        const bar = renderProgressBar({ colorSwitch, percentage: undefined, maximumValue }).childAt(0);

        expect(bar.text()).toEqual("");
    });

    describe("label color", () => {
        it("should be black before a threshold", () => {
            expect(progressBarWrapper.hasClass("widget-progressbar-text-contrast")).toBe(true);
        });

        it("should not be black after a threshold", () => {
            progressBarWrapper.setProps({ colorSwitch: 78, percentage: 89 });

            expect(progressBarWrapper.hasClass("widget-progressbar-text-contrast")).toBe(false);
        });
    });

    describe("bootstrap class", () => {
        it("should be success if set style is success", () => {
            const bar = renderProgressBar({ bootstrapStyle: "success", percentage, colorSwitch }).childAt(0);

            expect(bar.hasClass("progress-bar-success")).toBe(true);
        });

        it("should not be success if set style is not success", () => {
            const bar = renderProgressBar({ bootstrapStyle: "", percentage, colorSwitch }).childAt(0);

            expect(bar.hasClass("progress-bar-success")).toBe(false);
        });

        it("should be info if set style is info", () => {
            const bar = renderProgressBar({ bootstrapStyle: "info", percentage, colorSwitch }).childAt(0);

            expect(bar.hasClass("progress-bar-info")).toBe(true);
        });

        it("should not be info if set style is not info", () => {
            expect(progressBar.hasClass("progress-bar-info")).toBe(false);
        });

        it("should be warning if set style is warning", () => {
            const bar = renderProgressBar({ bootstrapStyle: "warning", percentage, colorSwitch }).childAt(0);

            expect(bar.hasClass("progress-bar-warning")).toBe(true);
        });

        it("should not be warning if set style is not warning", () => {
            expect(progressBar.hasClass("progress-bar-warning")).toBe(false);
        });

        it("should be danger if set style is danger", () => {
            const bar = renderProgressBar({ bootstrapStyle: "danger", percentage, colorSwitch }).childAt(0);

            expect(bar.hasClass("progress-bar-danger")).toBe(true);
        });

        it("should not be danger if set style is not danger", () => {
            expect(progressBar.hasClass("progress-bar-danger")).toBe(false);
        });
    });

    describe("type", () => {
        it("should be striped if set type is striped", () => {
            const bar = renderProgressBar({ barType: "striped", percentage, colorSwitch }).childAt(0);

            expect(bar.hasClass("progress-bar-striped")).toBe(true);
        });

        it("should not be striped if set type is not striped", () => {
            expect(progressBar.hasClass("progress-bar-striped")).toBe(false);
        });

        it("should be animated if set type is animated", () => {
            const bar = renderProgressBar({ barType: "animated", percentage, colorSwitch }).childAt(0);

            expect(bar.hasClass("progress-bar-striped")).toBe(true);
            expect(bar.hasClass("active")).toBe(true);
        });

        it("should be not be animated if set type is not animated", () => {
            expect(progressBar.hasClass("progress-bar-striped")).not.toBe(true);
            expect(progressBar.hasClass("active")).toBe(false);
        });
    });

    it("should respond to click event", () => {
        spyOn(window.mx.ui, "action").and.callThrough();
        const validMicroflow: MicroFlowProps = { guid: "2", name: "m" };
        const barWrapper: any = renderProgressBar({ percentage, colorSwitch, microflowProps: validMicroflow });

        barWrapper.props().onClick();

        expect(window.mx.ui.action).toHaveBeenCalled();
        expect(window.mx.ui.action).toHaveBeenCalledWith(validMicroflow.name, {
            error: jasmine.any(Function),
            params: {
                applyto: "selection",
                guids: [ validMicroflow.guid ]
            }
        });
    });

    it("should not run onclick event if action name is empty", () => {
        spyOn(window.mx.ui, "action").and.callThrough();
        const emptyMicroflow: MicroFlowProps = { guid: "3", name: "" };
        const barWrapper: any = renderProgressBar({ percentage, colorSwitch, microflowProps: emptyMicroflow });

        barWrapper.props().onClick();

        expect(window.mx.ui.action).not.toHaveBeenCalled();
    });

    it("shows an error when an invalid onClick microflow is set", () => {
        const invalidAction = "invalid_action";
        const errorMessage = "Error while executing microflow: invalid_action: mx.ui.action error mock";
        const onclickProps: MicroFlowProps = {
            guid: "4",
            name: "invalid_action"
        };

        spyOn(window.mx.ui, "action").and.callFake((actionname: string, action: { error: (e: Error) => void }) => {
            if (actionname === invalidAction) {
                action.error(new Error("mx.ui.action error mock"));
            }
        });
        spyOn(window.mx.ui, "error").and.callThrough();

        const barWrapper: any = renderProgressBar({ percentage, colorSwitch, microflowProps: onclickProps });
        barWrapper.simulate("click");

        expect(window.mx.ui.error).toHaveBeenCalledWith(errorMessage);
    });

    afterAll(() => {
        window.mx = mxOriginal;
    });
});
