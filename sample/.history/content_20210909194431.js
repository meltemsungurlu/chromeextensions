//# sourceURL=@chrome-extension-content.js



var d = document, b = d.body;

let _$ = ayanoglu.DOM._$;

const renderPopUp = () => {
    let popUpId = 'N1GQRTzMo';
    if ( !b.querySelector( '#' + popUpId ) )
    {
        let popUp = _$( 'div' ).att( 'id', popUpId ).css( `display: none;
            position: fixed;
            width: 200px;
            height: 64px;
            background-color: yellow;
            top: 0px;
            left: 50%;
            box-sizing: border-box;
            box-shadow: 0px 0px 5px 1px gainsboro;
            border-radius: 5px;
            padding:16px;
            z-index: 1000;
            `).addTo( b );

        popUp.addEventListener( 'click', ( e ) => {
            chrome.runtime.sendMessage(
                {
                    request: {
                        name: 'phone-number',
                        value: e.target.textContent

                    }
                }, function ( response ) {

                    console.log( '%cMessage Response', 'color:red;font-size:14px;padding:10px;background-color:yellow', response );
                } );
            popUp.style.display = 'none';
        } )
        b.addEventListener( 'mouseover', ( e ) => {
            let text = e.target.textContent;
            if ( text.length < 100 )
            {

                let phone = text.replace( /[^\d]/g, '' );
                let length = phone.toString().length;
                if ( length >= 10 && length < 15 )
                {
                    popUp.textContent = phone;
                    popUp.style.left = ( e.clientX - 16 ) + 'px';
                    popUp.style.top = ( e.clientY - 16 ) + 'px';
                    popUp.style.display = 'block';
                } else
                {
                    popUp.style.display = 'none';
                }



            }
            else
            {
                popUp.style.display = 'none';
            }

            // console.log(e.target.textContent)
        } )
    }
}




let locked = () => {
    return b.style.opacity == '0.01';
}
let lockScreen = ( e ) => {
    if ( e && e.stopPropagation ) e.stopPropagation();


    b.style.opacity = e === true ? '0.01' : ( e === false ? '1' : ( locked() ? '1' : '0.01' ) );

    if ( e !== true ) setCookie( 'screen-lock', locked() ? "1" : "0", 10 );


}
b.addEventListener( 'dblclick', ( e ) => {
    if ( e.altKey && e.ctrlKey && e.shiftKey )
    {
        lockScreen( e );
    }

} )

lockScreen( getCookie( 'screen-lock' ) == "1" );

utility.addMenuItems( [
    {
        'id': 'translate-selection',
        'title': 'Translate "%s"',
        'contexts': ['selection']
    },
    {
        'id': 'send-phone-number',
        'title': 'WhatsApp to "%s"',
        'contexts': ['selection', 'link']
    },
    {
        'id': 'test',
        'title': 'Dialog Works',
        'contexts': ['page']
    }, {
        'id': 'collect-contacts',
        'title': 'Collect Contacts Wup Links',
        'contexts': ['page'],
        'documentUrlPatterns': ['https://new.hadiii.com/gcontacts/']
    }] );




const menuListener = function ( menu, info, tab ) {


    if ( info.menuItemId === 'send-phone-number' )
    {
        console.log( '%cdebugger', 'width:-webkit-fill-available;color:red;font-size:larger;padding:10px;background-color:yellow;border:1px solid blue;' );

        let phone = info.linkUrl || info.selectionText;
        var wPhone = phone.replace( /[^\d]/g, '' );
        if ( wPhone.toString().length < 10 )
        {
            alert( `Number ${ phone } not valid` );
            return;
        }




        chrome.runtime.sendMessage(
            {
                request: {
                    name: 'phone-number',
                    value: wPhone

                }
            }, function ( response ) {

                console.log( '%cMessage Response', 'color:red;font-size:14px;padding:10px;background-color:yellow', response );
            } );
        return true;



    } else
        if ( info.menuItemId === 'test' )
        {
            console.log( '%cdebugger', 'width:-webkit-fill-available;color:red;font-size:larger;padding:10px;background-color:yellow;border:1px solid blue;' );

            let dlg = new ayanoglu.ui.controls.promptDialog( { title: 'İçerik' } )

            return dlg.show().then( ( text ) => {
                debugger
            }, ( reason ) => { debugger } );

            return;
        } else
            if ( info.menuItemId === 'translate-selection' )
            {
                if ( !info.selectionText )
                    return;
                console.log( "info", info );

                var d = document,
                    l = d.location,
                    e = encodeURIComponent;
                var f = 'https://tureng.com/en/turkish-english/';
                var p = info.selectionText;
                var url = f + p;
                //https://developer.mozilla.org/en-US/docs/Web/API/Window/open
                var strWindowFeatures = "height=500,width=700,left=100,top=100,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no,dialog=yes";
                window.open( url, "translate-this", strWindowFeatures );

                /*		chrome.windows.create({
                                            url : url,
                                            width:700,
                                            height:300,
                                            focused:true,
                                            type:"popup"
                            }, function ( tab ) {
        
                            });
                            */
            } else
                if ( info.menuItemId === 'collect-contacts' )
                {

                    let contacts = {};
                    let contactSelector = '#list-container-inner > div[data-control-row]';
                    let contactEls = Array.from( document.querySelectorAll( contactSelector ) );
                    let nameSelector = ':scope > div.name';
                    let companySelector = ':scope > div:nth-child(4)';
                    let phoneSelector = ':scope > div:nth-child(5)';
                    contactEls.forEach( ( cEl ) => {
                        let nameEl = cEl.querySelector( nameSelector );
                        let name = nameEl.textContent;


                        let phoneEl = cEl.querySelector( phoneSelector );
                        let phone = phoneEl.textContent;
                        phone = phone.replace( '+', '' );

                        let companyEl = cEl.querySelector( companySelector );
                        let company = companyEl.textContent;

                        contacts[phone] = { name: name, phone: phone, company: company };
                        // console.log(name,phone,company)

                    } );
                    let text = '';
                    Object.keys( contacts ).forEach( ( key, i ) => {
                        let contact = contacts[key];
                        console.log( contact );
                        let link = `

${ i + 1 }) *${ contact.name }*  (${ contact.company })
    
    api.whatsapp.com/send?phone=${ contact.phone }
    
****************************************************************************************************************************************************************************************************************************
    `;
                        text += link;
                    } );



                    let dlg = new ayanoglu.ui.controls.promptDialog( { title: 'İçerik', text: text, controlStyle: 'width:500px;height:300px;' } )
                    dlg.input.select();
                    return dlg.show().then( ( text ) => {
                        ayanoglu.utility.copy( text );

                    }, ( reason ) => { debugger } );

                    //            debugger;
                }


}

utility.addMenuListener( menuListener );