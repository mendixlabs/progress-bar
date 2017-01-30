import { shallow } from "enzyme";
import { DOM, createElement } from "react";

import { ProgressBar, ProgressBarProps } from "../ProgressBar";
import { Alert } from "../Alert";

import { MockContext, mockMendix } from "tests/mocks/Mendix";
import { random } from "faker";

describe("Progress bar", () => {
    const renderWrapper = (props: ProgressBarProps) => shallow(createElement(ProgressBar, props));
    const getProgressbar = (props: ProgressBarProps) => renderWrapper(props).childAt(0);
    const progress = 23;
    const maximumValue = 100;
    let mxOriginal: mx.mx;

    beforeAll(() => {
        mxOriginal = window.mx;
        window.mx = mockMendix;
        window.mendix = { lib: { MxContext: MockContext } };
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
                ),
                createElement(Alert)
            )
        );
    });

    it("should render positive progress", () => {
        const wrapper = renderWrapper({ maximumValue, progress: 200 });

        expect(wrapper.childAt(0).text()).toEqual(`${200}%`);
    });

    it("should render negative progress", () => {
        const wrapper = renderWrapper({ maximumValue, progress: -20 });

        expect(wrapper.childAt(0).text()).toEqual(`${-20}%`);
    });

    it("should render the progress label invalid when the maximum value is less than 1", () => {
        const progressbar = getProgressbar({ maximumValue: 0, progress }).childAt(0);

        expect(progressbar.text()).toEqual("Invalid");
    });

    it("should not render the progress label when no progress value is specified", () => {
        const progressbar = getProgressbar({ maximumValue, progress: null }).childAt(0);

        expect(progressbar.text()).toEqual("");
    });

    it("should have the class widget-progressbar-text-contrast when progress is below the threshold", () => {
        const progressbar = getProgressbar({ maximumValue, progress: 20 });

        expect(progressbar.hasClass("widget-progressbar-text-contrast")).toBe(true);
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

    describe("configured to call a microflow when clicked", () => {
        const contextObject: any = {
            getEntity: () => random.uuid(),
            getGuid: () => random.uuid()
        };
        const progressbarProps: ProgressBarProps = {
            contextObject,
            maximumValue,
            onClickMicroflow: "ACT_OnClick",
            onClickOption: "callMicroflow",
            progress
        };

        it("executes a microflow when the progress bar is clicked", () => {
            spyOn(window.mx.ui, "action").and.callThrough();

            const progressbar = getProgressbar(progressbarProps);

            progressbar.simulate("click");

            expect(window.mx.ui.action).toHaveBeenCalledWith(progressbarProps.onClickMicroflow, {
                error: jasmine.any(Function),
                params: {
                    applyto: "selection",
                    guids: [ jasmine.any(String) ]
                }
            });
        });

        it("shows an error when no microflow is specified", () => {
            progressbarProps.onClickMicroflow = "";
            const errorMessage = "Error in progress bar configuration: on click microflow is required";

            const progressbar = renderWrapper(progressbarProps);
            const alert = progressbar.find(Alert);

            expect(alert.props().message).toBe(errorMessage);
        });

        it("shows an error when an invalid microflow is specified ", () => {
            progressbarProps.onClickMicroflow = "invalid_action";
            const errorMessage = "Error while executing microflow invalid_action: mx.ui.action error mock";

            spyOn(window.mx.ui, "action").and.callFake((actionname: string, action: { error: (e: Error) => void }) => {
                action.error(new Error("mx.ui.action error mock"));
            });
            const progressbar = renderWrapper(progressbarProps);

            progressbar.childAt(0).simulate("click");

            const alert = progressbar.find(Alert);
            expect(alert.props().message).toBe(errorMessage);
        });
    });

    describe("configured to show a page when clicked", () => {
        const contextObject: any = {
            getEntity: () => random.uuid(),
            getGuid: () => random.uuid()
        };
        const progressbarProps: ProgressBarProps = {
            contextObject,
            maximumValue,
            onClickOption: "showPage",
            onClickPage: "showpage.xml",
            pageLocation: "popup",
            progress
        };

        it("opens a page when the progress circle is clicked", () => {
            spyOn(window.mx.ui, "openForm").and.callThrough();

            const progressbar = getProgressbar(progressbarProps);

            progressbar.simulate("click");

            expect(window.mx.ui.openForm).toHaveBeenCalledWith(progressbarProps.onClickPage, {
                context: new mendix.lib.MxContext(),
                error: jasmine.any(Function),
                location: "popup"
            });
        });

        it("shows an error when no page is specified", () => {
            progressbarProps.onClickPage = "";
            const errorMessage = "Error in progress bar configuration: on click page is required";
            const progressbar = renderWrapper(progressbarProps);

            progressbar.childAt(0).simulate("click");

            const alert = progressbar.find(Alert);
            expect(alert.props().message).toBe(errorMessage);
        });

        it("shows an error when an invalid page is specified ", () => {
            progressbarProps.onClickPage = "invalid_page";
            const errorMessage = `Error while opening page ${progressbarProps.onClickPage}: mx.ui.openForm error mock`;

            spyOn(window.mx.ui, "openForm").and.callFake((path: string, args: { error: Function }) => {
                args.error(new Error("mx.ui.openForm error mock"));
            });
            const progressbar = renderWrapper(progressbarProps);

            progressbar.childAt(0).simulate("click");

            const alert = progressbar.find(Alert);
            expect(alert.props().message).toBe(errorMessage);
        });
    });

    it("should not respond to click events when no click action is configured", () => {
        const progressbarProps: ProgressBarProps = {
            contextObject: jasmine.createSpyObj("contextObject", [ "getGuid", "getEntity" ]),
            maximumValue,
            onClickOption: "doNothing",
            progress
        };
        spyOn(window.mx.ui, "openForm");
        spyOn(window.mx.ui, "action");
        const progressbar = renderWrapper(progressbarProps);

        progressbar.childAt(0).simulate("click");

        expect(window.mx.ui.openForm).not.toHaveBeenCalled();
        expect(window.mx.ui.action).not.toHaveBeenCalled();
    });

    afterAll(() => {
        window.mx = mxOriginal;
    });
});
