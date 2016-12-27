/* tslint:disable */
export class MxMock implements mx.mx {
    appUrl: string;
    baseUrl: string;
    modulePath: string;
    addOnLoad(callback: Function): void { /* */ }
    login(username: string, password: string, onSuccess: Function, onError: Function): void { /* */ }
    logout(): void { /* */ }
    data: MxDataMock;
    meta: mx.meta;
    parser: mx.parser;
    server: mx.server;
    session: mx.session;
    ui: MxUiMock;
    onError(error: Error): void { /* */ }
}

export class MxUiMock implements mx.ui {
    action(
        actionname: string,
        action: {
            progress?: string,
            progressMsg?: string,
            params?: {
                applyto?: string,
                guids?: string[],
                xpath?: string,
                constraints?: string,
                sort?: any,
                gridid?: string,
            },
            context?: any,
            store?: any,
            async?: boolean,
            callback?: (result: mendix.lib.MxObject | mendix.lib.MxObject[] | boolean | number | string) => void,
            error?: (e: Error) => void,
            onValidation?: Function,
        },
        scope?: any
    ): void { /* */ }

    back(): void { /* */ }
    confirmation(args: { content: string, proceed: string, cancel: string, handler: Function }): void { /* */ }
    error(msg: string, modal?: boolean): void { /* */ }
    exception(msg: string): void { /* */ }
    getTemplate(mxid: string, content: string): DocumentFragment {
        const fakeElement: any = "Fake";
        return fakeElement;
    }
    showProgress(): number { return 11; }
    hideProgress(pid: number): void { /* */ }
    info(msg: string, modal: boolean): void { /* */ }
    onError(error: Error): void { /* */ }
    showUnderlay(delay?: number): void { /* */ }
    hideUnderlay(delay?: number): void { /* */ }
    resize(): void { /* */ }
    isRtl(): string { return "Fake"; }
    openForm(
        path: string,
        args?: {
            location?: "content" | "popup" | "modal",
            domNode?: HTMLElement,
            title?: string,
            context?: mendix.lib.MxContext,
            callback?(form: mxui.lib.form._FormBase): void,
            error?(error: Error): void,
        },
        scope?: any
    ): void { /* */ }
    showLogin(messageCode: number): void { /* */ }
}

export class MxDataMock implements mx.data {
    action(action: {
        params: {
            actionname: string,
            applyto?: string,
            guids?: string[],
            xpath?: string,
            constraints?: string,
            sort?: any,
            gridid?: string,
        },
        context?: any,
        store?: any,
        origin?: mxui.lib.form._FormBase,
        async?: boolean,
        callback?: (result: mendix.lib.MxObject | mendix.lib.MxObject[] | boolean | number | string) => void,
        error?: (e: Error) => void,
        onValidation?: (validations: mendix.lib.ObjectValidation[]) => void,
    }, scope?: any): void {
        if (action.params.actionname === "error_microflow") {
            action.error(new Error("Mock some error that is thrown in the Mendix runtime"));
        } else {
            setTimeout(() => action.callback && action.callback(null));
        }
    };
    commit(args: {
        mxobj: mendix.lib.MxObject,
        callback: Function,
        error?: (e: Error) => void,
        onValidation?: Function
    }, scope?: Object): void { };
    create(arg: {
        entity: string,
        callback: (obj: mendix.lib.MxObject) => void,
        error: (e: Error) => void,
    }, scope?: Object): void { };
    createXPathString(arg: {
        entity: string,
        context: any,
        callback: (xpath: string, allMatched: boolean) => void
    }): void { };
    /**
      * Retrieves MxObjects from the Runtime. Using microflow 
      */
    get(args: any, scope?: Object): void { };
    getBacktrackConstraints(metaObject: any, context: any, callback: (xpath: string, allMatched: boolean) => void): void { };
    release(objects: mendix.lib.MxObject | mendix.lib.MxObject[]): void { };
    remove(arg: {
        guid?: string,
        guids?: string[],
        callback: Function,
        error: (e: Error) => void
    }, scope?: Object): void { };
    rollback(args: {
        mxobj: mendix.lib.MxObject;
        callback: Function,
        error: (e: Error) => void,

    }, scope?: Object): void { };
    save(args: {
        mxobj?: mendix.lib.MxObject;
        callback?: Function,
        error?: (e: Error) => void,

    }, scope?: Object): void { };
    /**
     * Registers a callback to be invoked on changes specific entity 
     */
    subscribe(args: any): number { return 0 };
    unsubscribe(handle: number): void { };
    update(args: {
        guid?: string,
        entity?: string,
    }): void;
    // update attribute
    update(args: {
        guid: string,
        attr: string,
    }): void { };
    saveDocument(guid: string, name: string, params: any, blob: Blob, callback: Function, error: (error: Error) => void): void { };
}

export class MxLogger implements mendix.logger {
    error(...info: any[]): void { };
    debug(...info: any[]): void { };
    info(...info: any[]): void { };
    warn(...info: any[]): void { };
    exception(...info: any[]): void { };
    scream(...info: any[]): void { };

}
