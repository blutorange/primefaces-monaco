declare type BaseMessage<K extends string, T> = {
    kind: K,
    data: T,
    messageId?: number;
    instanceId?: number;
};

type InitMessageData = {
    facesResourceUri: string,
    id: string;
    options: typeof import("./util").FramedEditorDefaults,
    resolvedUiLanguageUri: string;
    scrollTop: number;
    supportedEvents: string[];
    value: string;
};

type ResponseMessageData = {
    success: true;
    value: any;
} | {
    success: false;
    error: string;
};

type InvokeMonacoMessageData = {
    method: string;
    args: any[];
}

type ValueChangeMessageData = {
    value: string;
    changes: import("../../npm/node_modules/monaco-editor").editor.IModelContentChange;
};

type ScrollChangeMessageData = {
    scrollLeft: number;
    scrollTop: number;
};

type DomEventMessageData = {
    name: string;
    data: string;
}

type AfterInitMessageData = {
    success: true
} | {
    success: false,
    error: string;
};

declare type MonacoMessage =
    | BaseMessage<"load", undefined>
    | BaseMessage<"init", InitMessageData>
    | BaseMessage<"destroy", undefined>
    | BaseMessage<"response", ResponseMessageData>
    | BaseMessage<"invokeMonaco", InvokeMonacoMessageData>
    | BaseMessage<"valueChange", ValueChangeMessageData>
    | BaseMessage<"scrollChange", ScrollChangeMessageData>
    | BaseMessage<"domEvent", DomEventMessageData>
    | BaseMessage<"afterInit", AfterInitMessageData>
;
