import { Component, createElement } from "react";
import { BarType, BootstrapStyle, ProgressBar } from "./ProgressBar";
import { Alert } from "./Alert";

interface ProgressBarContainerProps {
    barType: BarType;
    bootstrapStyleAttribute: string;
    contextObject: mendix.lib.MxObject;
    maximumValueAttribute: string;
    onClickMicroflow: string;
    onClickOption: OnClickOptions;
    onClickPage: string;
    pageLocation: PageLocation;
    progressAttribute: string;
    progressStyle: BootstrapStyle;
    textColorSwitch: number;
}

interface ProgressBarContainerState {
    bootstrapStyle?: BootstrapStyle;
    alertMessage?: string;
    maximumValue?: number;
    showAlert?: boolean;
    progressValue: number | null;
}

type OnClickOptions = "doNothing" | "showPage" | "callMicroflow";
type PageLocation = "content" | "popup" | "modal";

class ProgressBarContainer extends Component<ProgressBarContainerProps, ProgressBarContainerState> {
    private subscriptionHandles: number[];

    constructor(props: ProgressBarContainerProps) {
        super(props);

        this.state = {
            alertMessage: this.validateProps(),
            bootstrapStyle: this.getBootstrapStyle(props.contextObject),
            maximumValue: this.getValue<number>(props.contextObject, this.props.maximumValueAttribute, 100),
            progressValue: this.getValue<null>(props.contextObject, this.props.progressAttribute, null),
            showAlert: !!this.validateProps()
        };
        this.subscriptionHandles = [];
        this.resetSubscription(props.contextObject);
    }

    render() {
        if (this.state.showAlert) {
            return createElement(Alert, { message: this.state.alertMessage });
        }

        return createElement(ProgressBar, {
            alertMessage: this.state.alertMessage,
            barType: this.props.barType,
            bootstrapStyle: this.getBootstrapStyle(this.props.contextObject),
            colorSwitch: this.props.textColorSwitch,
            maximumValue: this.getValue<number>(this.props.contextObject, this.props.maximumValueAttribute, 100),
            onClickAction: this.handleClick,
            progress: this.getValue<null>(this.props.contextObject, this.props.progressAttribute, null)
        });
    }

    componentWillReceiveProps(newProps: ProgressBarContainerProps) {
        this.resetSubscription(newProps.contextObject);
        this.updateValues(newProps.contextObject);
    }

    private validateProps(): string {
        let errorMessage = "";
        if (this.props.onClickOption === "callMicroflow" && !this.props.onClickMicroflow) {
            errorMessage = "on click microflow is required";
        } else if (this.props.onClickOption === "showPage" && !this.props.onClickPage) {
            errorMessage = "on click page is required";
        }
        if (errorMessage) {
            errorMessage = `Error in progress circle configuration: ${errorMessage}`;
        }

        return errorMessage;
    }

    private getValue<T>(contextObject: mendix.lib.MxObject, attribute: string, defaultValue: T): T | number {
        return contextObject && attribute ? parseFloat(contextObject.get(attribute) as string) : defaultValue;
    }

    private getBootstrapStyle(contextObject: mendix.lib.MxObject): BootstrapStyle {
        if (contextObject && this.props.bootstrapStyleAttribute) {
            return contextObject.get(this.props.bootstrapStyleAttribute) as BootstrapStyle;
        }

        return this.props.progressStyle;
    }

    private updateValues(contextObject: mendix.lib.MxObject) {
        this.setState({
            bootstrapStyle: this.getBootstrapStyle(contextObject),
            maximumValue: this.getValue<number>(contextObject, this.props.maximumValueAttribute, 100),
            progressValue: this.getValue<null>(contextObject, this.props.progressAttribute, null)
        });
    }

    private resetSubscription(contextObject: mendix.lib.MxObject) {
        this.unSubscribe();

        if (contextObject) {
            this.subscriptionHandles.push(window.mx.data.subscribe({
                callback: () => this.updateValues(contextObject),
                guid: contextObject.getGuid()
            }));
            [
                this.props.progressAttribute,
                this.props.maximumValueAttribute,
                this.props.bootstrapStyleAttribute
            ].forEach((attr) => {
                this.subscriptionHandles.push(window.mx.data.subscribe({
                    attr,
                    callback: () => this.updateValues(contextObject),
                    guid: contextObject.getGuid()
                }));
            });
        }

    }

    private unSubscribe() {
        this.subscriptionHandles.forEach((handle) => window.mx.data.unsubscribe(handle));
    }

    private handleClick() {
        const { contextObject, onClickMicroflow, onClickOption, onClickPage, pageLocation } = this.props;
        if (contextObject && onClickOption === "callMicroflow" && onClickMicroflow && contextObject.getGuid()) {
            window.mx.ui.action(onClickMicroflow, {
                error: (error) =>
                    this.setState({
                        alertMessage: `Error while executing microflow ${onClickMicroflow}: ${error.message}`
                    }),
                params: {
                    applyto: "selection",
                    guids: [ contextObject.getGuid() ]
                }
            });
        } else if (contextObject && onClickOption === "showPage" && onClickPage && contextObject.getGuid()) {
            const context = new window.mendix.lib.MxContext();
            context.setContext(contextObject);

            window.mx.ui.openForm(onClickPage, {
                error: (error) =>
                    this.setState({ alertMessage: `Error while opening page ${onClickPage}: ${error.message}` }),
                context,
                location: pageLocation
            });
        }
    }
}

export { OnClickOptions, ProgressBarContainer as default, PageLocation };
