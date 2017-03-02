import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { BarType, BootstrapStyle } from "./components/ProgressBar";
import ProgressBarContainer, { OnClickOptions, PageLocation } from "./components/ProgressBarContainer";

class ProgressBar extends WidgetBase {
    // Parameters configured from modeler
    progressAttribute: string;
    bootstrapStyleAttribute: string;
    progressStyle: BootstrapStyle;
    barType: BarType;
    textColorSwitch: number;
    maximumValueAttribute: string;
    onClickMicroflow: string;
    onClickOption: OnClickOptions;
    onClickPage: string;
    pageLocation: PageLocation;
    // Internal variables

    update(contextObject: mendix.lib.MxObject, callback?: () => void) {
        this.updateRendering(contextObject);

        if (callback) callback();
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);

        return true;
    }

    private updateRendering(contextObject: mendix.lib.MxObject) {
        render(createElement(ProgressBarContainer, {
            barType: this.barType,
            bootstrapStyleAttribute: this.bootstrapStyleAttribute,
            contextObject,
            maximumValueAttribute: this.maximumValueAttribute,
            onClickMicroflow: this.onClickMicroflow,
            onClickOption: this.onClickOption,
            onClickPage: this.onClickPage,
            pageLocation: this.pageLocation,
            progressAttribute: this.progressAttribute,
            progressStyle: this.progressStyle,
            textColorSwitch: this.textColorSwitch
        }), this.domNode);
    }
}

// tslint:disable : only-arrow-functions
dojoDeclare("com.mendix.widget.custom.progressbar.ProgressBar", [ WidgetBase ], function(Source: any) {
    const result: any = {};
    for (const i in Source.prototype) {
        if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
            result[i] = Source.prototype[i];
        }
    }
    return result;
}(ProgressBar));
