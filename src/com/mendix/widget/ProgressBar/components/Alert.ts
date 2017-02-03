import { DOM } from "react";

export const Alert = (props: { message?: string }) =>
    props.message
        ? DOM.div({ className: "alert alert-danger widget-progressbar-alert" }, props.message)
        : null;
