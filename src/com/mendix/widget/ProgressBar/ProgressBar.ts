import * as dojoDeclare from "dojo/_base/declare";
import * as WidgetBase from "mxui/widget/_WidgetBase";
import { createElement } from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { MicroFlowProps, ProgressBar as ProgressBarComponent, ProgressBarProps } from "./components/ProgressBar";

class ProgressBar extends WidgetBase {
    // Parameters configured from modeler
    private progressAttribute: string;
    private bootstrapStyleAttribute: string;
    private classBar: string;
    private barType: string;
    private description: string;
    private textColorSwitch: number;
    private width: number;
    private onclickMicroflow: string;
    // Internal variables
    private contextObject: mendix.lib.MxObject;

    postCreate() {
        this.updateRendering();
    }

    update(object: mendix.lib.MxObject, callback: Function) {
        this.contextObject = object;
        this.resetSubscriptions();
        this.updateRendering();

        callback();
    }

    uninitialize(): boolean {
        unmountComponentAtNode(this.domNode);

        return true;
    }

    private updateRendering() {
        render(createElement(ProgressBarComponent, this.getProgressBarProps()), this.domNode);
    }

    private getProgressBarProps(): ProgressBarProps {
        const percentage = this.contextObject
            ? Math.round(parseInt(this.contextObject.get(this.progressAttribute)as string, 10))
            : 0;
        const bootstrapStyle = this.contextObject && this.bootstrapStyleAttribute
            ? (this.contextObject.get(this.bootstrapStyleAttribute))as string
            : this.classBar !== "none" ? this.classBar : "";

        return {
            barType: this.barType,
            bootstrapStyle,
            colorSwitch: this.textColorSwitch,
            label: this.contextObject
                ? this.description
                : "",
            microflowProps: this.createOnClickProps(),
            percentage,
            width: this.width
        };
    }

    private createOnClickProps(): MicroFlowProps {
        return ({
            guid: this.contextObject ? this.contextObject.getGuid() : undefined,
            name: this.onclickMicroflow,
            origin: this.mxform
        });
    }

    private resetSubscriptions() {
        this.unsubscribeAll();
        if (this.contextObject) {
            this.subscribe({
                callback: (guid) => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
            this.subscribe({
                attr: this.progressAttribute,
                callback: (guid, attr, attrValue) => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
            this.subscribe({
                attr: this.bootstrapStyleAttribute,
                callback: (guid, attr, attrValue) => this.updateRendering(),
                guid: this.contextObject.getGuid()
            });
        }
    }
}

// Declare widget prototype the Dojo way
// Thanks to https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/dojo/README.md
// tslint:disable : only-arrow-functions
dojoDeclare("com.mendix.widget.ProgressBar.ProgressBar", [ WidgetBase ],
    (function (Source: any) {
        let result: any = {};
        for (let i in Source.prototype) {
            if (i !== "constructor" && Source.prototype.hasOwnProperty(i)) {
                result[i] = Source.prototype[i];
            }
        }
        return result;
    }(ProgressBar))
);
