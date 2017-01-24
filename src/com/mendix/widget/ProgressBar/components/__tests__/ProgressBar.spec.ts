import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { ProgressBar, ProgressBarProps } from "../ProgressBar";
import { Alert } from "../Alert";

import { mockMendix } from "tests/mocks/Mendix";

describe("Progress bar", () => {
    const renderWrapper = (props: ProgressBarProps) => shallow(createElement(ProgressBar, props));
    const getProgressbar = (props: ProgressBarProps) => renderWrapper(props).childAt(0);
    const progress = 23;
    const maximumValue = 100;
    let mxOriginal: mx.mx;

    beforeAll(() => {
        mxOriginal = window.mx;
        window.mx = mockMendix;
    });

    it("has progress bar structure", () => {
        const progressbar = shallow(createElement(ProgressBar, { maximumValue, progress }));

        expect(progressbar).toBeElement(
            DOM.div({ className: "widget-progressbar" },
                DOM.div(
                    {
                        className: "progress widget-progressbar-text-contrast",
                        onClick: jasmine.any(Function) as any
                    },
                    DOM.div({ className: "progress-bar progress-bar-default", style: { width: jasmine.any(String) } },
                        jasmine.any(String) as any
                    )
                )
            )
        );
    });

    it("should render the progress", () => {
        const wrapper = renderWrapper({ maximumValue, progress: 20 });

        expect(wrapper.childAt(0).text()).toEqual(`${20}%`);
        wrapper.setProps({ maximumValue, progress: -20 });
        expect(wrapper.childAt(0).text()).toEqual(`${-20}%`);
        wrapper.setProps({ maximumValue, progress: 300 });
        expect(wrapper.childAt(0).text()).toEqual(`${300}%`);
    });

    it("should render the progress label invalid when the maximum value is less than 1", () => {
        const progressbar = getProgressbar({ maximumValue: 0, progress }).childAt(0);

        expect(progressbar.text()).toEqual("Invalid");
    });

    it("should not render the progress label when no progress value is specified", () => {
        const progressbar = getProgressbar({ maximumValue, progress: null }).childAt(0);

        expect(progressbar.text()).toEqual("");
    });

    it("should not have the class widget-progressbar-text-contrast when progress exceeds the threshold", () => {
        const progressbar = getProgressbar({ maximumValue, progress: 80 });

        expect(progressbar.hasClass("widget-progressbar-text-contrast")).toBe(false);
    });

    describe("with bootstrap style", () => {
        it("default should have the class progress-bar-default", () => {
            const progressbar = getProgressbar({ bootstrapStyle: "default", maximumValue, progress }).childAt(0);

            expect(progressbar.hasClass("progress-bar-default")).toBe(true);
        });

        it("success should have the class progress-bar-success", () => {
            const progressbar = getProgressbar({ bootstrapStyle: "success", maximumValue, progress }).childAt(0);

            expect(progressbar.hasClass("progress-bar-success")).toBe(true);
        });

        it("info should have the class progress-bar-info", () => {
            const progressbar = getProgressbar({ bootstrapStyle: "info", maximumValue, progress }).childAt(0);

            expect(progressbar.hasClass("progress-bar-info")).toBe(true);
        });

        it("warning should have the class progress-bar-warning", () => {
            const progressbar = getProgressbar({ bootstrapStyle: "warning", maximumValue, progress }).childAt(0);

            expect(progressbar.hasClass("progress-bar-warning")).toBe(true);
        });

        it("danger should have the class progress-bar-danger", () => {
            const progressbar = getProgressbar({ bootstrapStyle: "danger", maximumValue, progress }).childAt(0);

            expect(progressbar.hasClass("progress-bar-danger")).toBe(true);
        });
    });

    describe("of type", () => {
        it("default should not have the classes progress-bar-striped and active", () => {
            const progressbar = getProgressbar({ barType: "default", maximumValue, progress }).childAt(0);

            expect(progressbar.hasClass("progress-bar-striped")).toBe(false);
            expect(progressbar.hasClass("active")).toBe(false);
        });

        it("striped should have the class progress-bar-striped", () => {
            const progressbar = getProgressbar({ barType: "striped", maximumValue, progress }).childAt(0);

            expect(progressbar.hasClass("progress-bar-striped")).toBe(true);
        });

        it("animated should have the classes progress-bar-striped and active", () => {
            const progressbar = getProgressbar({ barType: "animated", maximumValue, progress }).childAt(0);

            expect(progressbar.hasClass("progress-bar-striped")).toBe(true);
            expect(progressbar.hasClass("active")).toBe(true);
        });
    });

    it("with a valid on click microflow should respond to click events", () => {
        spyOn(window.mx.ui, "action").and.callThrough();
        const props = { maximumValue, progress, onClickMicroflow: "microflow", contextObjectGuid: "2" };
        const progressbar = getProgressbar(props);

        progressbar.simulate("click");

        expect(window.mx.ui.action).toHaveBeenCalled();
        expect(window.mx.ui.action).toHaveBeenCalledWith("microflow", {
            error: jasmine.any(Function),
            params: {
                applyto: "selection",
                guids: [ "2" ]
            }
        });
    });

    it("shows an error when an invalid onClick microflow is set", () => {
        const errorMessage = "Error while executing microflow: invalid_action: mx.ui.action error mock";

        spyOn(window.mx.ui, "action").and.callFake((actionname: string, action: { error: (e: Error) => void }) => {
            action.error(new Error("mx.ui.action error mock"));
        });

        const props = { maximumValue, progress, onClickMicroflow: "invalid_action", contextObjectGuid: "4" };
        const progressbarWrapper = renderWrapper(props);
        const progressbar = progressbarWrapper.childAt(0);

        progressbar.simulate("click");

        const alert = progressbarWrapper.find(Alert);
        expect(alert.props().message).toBe(errorMessage);
    });

    it("should not respond to click events when no microflow is specified", () => {
        spyOn(window.mx.ui, "action").and.callThrough();
        const progressbar = getProgressbar({ maximumValue, progress, contextObjectGuid: "3", onClickMicroflow: "" });

        progressbar.simulate("click");

        expect(window.mx.ui.action).not.toHaveBeenCalled();
    });

    afterAll(() => {
        window.mx = mxOriginal;
    });
});
