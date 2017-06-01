import { Component, createElement } from "react";
import { ProgressBar, ProgressBarProps } from "./components/ProgressBar";
import ProgressBarContainer, { ProgressBarContainerProps } from "./components/ProgressBarContainer";
import { Alert } from "./components/Alert";

import * as css from "./ui/ProgressBar.scss";

// tslint:disable-next-line:class-name
export class preview extends Component<ProgressBarContainerProps, {}> {
    componentWillMount() {
        this.addPreviewStyle("widget-progress-bar-style");
    }

    render() {
        const warnings = ProgressBarContainer.validateProps(this.props);
        if (warnings) {
            return createElement(Alert, { message: warnings });
        }
        return createElement(ProgressBar, this.transformProps(this.props));
    }

    private transformProps(props: ProgressBarContainerProps): ProgressBarProps {
        return {
            barType: props.barType,
            bootstrapStyle: props.bootstrapStyle,
            className: props.class,
            maximumValue: 100,
            progress: 80,
            style: ProgressBarContainer.parseStyle(props.style)
        };
    }

    private addPreviewStyle(styleId: string) {
        // This workaround is to load style in the preview temporary till mendix has a better solution
        const iFrame = document.getElementsByClassName("t-page-editor-iframe")[0] as HTMLIFrameElement;
        const iFrameDoc = iFrame.contentDocument;
        if (!iFrameDoc.getElementById(styleId)) {
            const styleTarget = iFrameDoc.head || iFrameDoc.getElementsByTagName("head")[0];
            const styleElement = document.createElement("style");
            styleElement.setAttribute("type", "text/css");
            styleElement.setAttribute("id", styleId);
            styleElement.appendChild(document.createTextNode(css));
            styleTarget.appendChild(styleElement);
        }
    }
}
