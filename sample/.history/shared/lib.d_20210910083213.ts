
interface contactType {
        name: string;
        phone: string;
        saved: boolean;
}
interface wupLibrary {
        workers: {
                iterateUsers(contact: contactType): void;
                sendMessage(text: String): void;
                openChatPanel(): Promise<any>;
                collectGroupMembers(contacts: contactType[]): Promise<any>;
                collectUnknownSenders(): void;
        };

        makeWinShortcut(phone: string): string;
        collectContactsWupLinks(): void;
}
interface dialogOptions {
        className?: string;
        title: string;
        /**
         * Style for dialog control
         */
        controlStyle?: string;
}
interface promptDialogOptions extends dialogOptions {
        /**
         * input text
         */
        text?: String;
}
declare interface ayanoglu {
        google: {
                parseContactCSVFields(): void;
        };
        utility: {
                formatName(): void;
                download(): void;
                upperCase(): void;
                copy(): void;

        };
        DOM: {
                _$(tagName: string): HTMLElementDelegate;
                style(css: string): void;
        };
        ui: {

                controls: {
                        selectionPop(): void;
                        dialog(options: dialogOptions): void;
                        templateSelector(): void;
                };
                panel(): void;
                dialog(): void;
                floatMenu(): void;
                modalDialog(): void;
                getCsvText(): void;
                contactListDialog(): void;
                contactForm(): void;
        };
        wup: wupLibrary;

}

interface selectionPop {
        onWillSelect(): void;
}

/**
 * root name space 1
 */
declare namespace ayanoglux {


        namespace ui {

                panel();
                modalDialog();
                namespace controls {
                        function selectionPop(handle: function, reset: boolean?= false, storageKey?: string = 'wup-message-replies'): selectionPop
                        function templateSelector(handle: function, reset: boolean?= false, storageKey?: string = 'wup-message-replies'): selectionPop

                        class promptDialog extends dialog {
                                show(): Promise<string>;
                                input: HTMLTextAreaElement;
                                constructor(options?: promptDialogOptions)
                        }
                        class dialog {
                                close(): void;
                                add(item: any): HTMLElementDelegate;
                                container: HTMLElementDelegate;
                                control: HTMLElementDelegate;
                                constructor(options?: dialogOptions)
                        };
                        class panel { constructor(options?: dialogOptions) };
                }
        }
}

interface pipeRequest {
        request: IRequest;
}
interface utility {

}
interface IRequest {
        requestType: string;
}
interface messageRequest extends IRequest {

        recipient: string;
        message?: string;
}

declare namespace chrome.runtime {
        export function sendMessage<M = runTimeRequestConstructor, R = any>(message: M, responseCallback?: (response: R) => void): void;

}
interface MessageSender {

}
interface ExtensionMessageEventDelegate
        extends chrome.runtime.ExtensionMessageEvent  {
                message: runTimeRequestConstructor;
                sender: MessageSender;
                 sendResponse: (response?: any) => void;
                 addListener(callback: T): void;
         }

           interface ExtensionMessageEvent
         extends chrome.events.Event<
         (message: runTimeRequestConstructor, sender: MessageSender, sendResponse: (response?: any) => void) => void
         > { }

declare namespace chrome.runtime   {
         export var onMessage: ExtensionMessageEvent;
}

interface runTimeRequestConstructor {
        // new <T extends object = object>(values?: readonly T[] | null): WeakSet<T>;
        // readonly prototype: WeakSet<object>;
        new(type: string, detail?: object): typeof runTimeRequest;
        readonly detail: object
        readonly type: string;
}
declare var runTimeRequest: runTimeRequestConstructor;

// declare var utility: utility;
declare var ayanoglu: ayanoglu;
declare var wupLib: wupLibrary;

// window.ayanoglu= ayanogluLib;


// export type HTMLElementDelegate=HTMLElementDelegate;