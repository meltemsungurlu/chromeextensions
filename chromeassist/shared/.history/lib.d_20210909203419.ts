
interface contactType {
        name:string;
        phone:string;
        saved:boolean;
}
interface wupLibrary {
        workers:{
                iterateUsers(contact:contactType):void; 
                sendMessage(text:String):void;
                openChatPanel():Promise<any>;
                collectGroupMembers(contacts:contactType[]):Promise<any>;
                collectUnknownSenders():void;
        };

        makeWinShortcut(phone:string):string;
        collectContactsWupLinks():void;
}
interface dialogOptions {
        className?:string;
        title:string;
        /**
         * Style for dialog control
         */
        controlStyle?:string;
}
 interface promptDialogOptions extends dialogOptions {
         /**
          * input text
          */
text?:String;
 }
interface ayanogluLib {
        google:{
                parseContactCSVFields():void;
        },
        utility:{
                formatName():void;
                download():void;
                upperCase():void;
                copy():void;

        };
        DOM:{
                _$(tagName:string):HTMLElementDelegate;
                style(css:string):void;
        };
        ui:{

                controls:{
                        selectionPop():void;
                        dialog(options:dialogOptions):void;
                        templateSelector():void;
                };
                panel():void;
                dialog():void;
                floatMenu():void;
                modalDialog():void;
                getCsvText():void;
                contactListDialog():void;
                contactForm():void;
        };
wup: wupLibrary;

}

interface selectionPop {
  onWillSelect():void;
}

/**
 * root name space 1
 */
declare namespace ayanoglux {
 
         
        namespace ui {
                
                panel() ;
                modalDialog();
                namespace controls {
                        function selectionPop( handle: function, reset:boolean? = false, storageKey? : string = 'wup-message-replies'):selectionPop
                        function templateSelector( handle: function, reset:boolean? = false, storageKey? : string = 'wup-message-replies'):selectionPop 

class promptDialog extends dialog {
        show():Promise<string>;
        input:HTMLTextArea;
        constructor(options?:promptDialogOptions)
}
                        class dialog {
                                close() : void;
                                add(item: any):HTMLElementDelegate;
                                container:HTMLElementDelegate;
                                control:HTMLElementDelegate;
                                constructor(options?:dialogOptions)};
                        class panel {constructor(options?:dialogOptions)};
                }
        }
}
// interface chrome{
// runtime:{

// }
// };
interface messageType {
        name:string;
        value:any;
}
  interface utility {

}
declare var ayanoglu: ayanogluLib;
declare var wupLib: wupLibrary;

// window.ayanoglu= ayanogluLib;


// export type HTMLElementDelegate=HTMLElementDelegate;