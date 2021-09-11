console.log('ayanoglu');
var d = document;
d.body.addEventListener('dblclick', (e) => {
    let res = /^\?(.+)/.exec(location.search)
    if (Array.isArray(res)) {
        let values = res[1].split('&').map((item) => {
            return item.split('=')[1];
        });
        let name = values[0],
            phone = values[1];
        // let c = d.createElement('div');
        // c.setAttribute('style', 'position:fixed;')
        // d.body.appendChild(c);

    }

})



function menuHandler(menu, info, tab) {


    if (info.menuItemId === 'wup') {
        let phone = info.linkUrl;
        let pt = /.+\+([\d]{12})$/ig;
        if (pt.test(phone)) {
            phone = phone.replace(pt, "$1");

            let contactEl = document.querySelector('div#contactName');
            let name = contactEl ? contactEl.textContent : 'No Name';
            let link = `
    *${name}*
    
    api.whatsapp.com/send?phone=${phone}
    `;
            ayanoglu.utility.copy(link);

 let dlg = new ayanoglu.ui.controls.promptDialog({ title: 'İçerik', text: link, controlStyle: 'width:500px;height:300px;' })

        return dlg.show().then((text) => {
            ayanoglu.utility.copy(text);
            dlg.input.select();
        }, (reason) => { debugger });
            console.log('phone:', phone);
        }

    } else
    if (info.menuItemId === 'collect-contacts') {
        let contacts = {};
        let contactSelector = '#yDmH0d > c-wiz:nth-child(16) > div.QkOsze > div:nth-child(3) > div:nth-child(2) > div > div';
        let contactEls = Array.from(document.querySelectorAll(contactSelector));
        let nameSelector = ':scope > div > div.E6Tb7b.iMwYAb';
        let phoneSelector = ':scope > div > div.E6Tb7b.b62A4e > span';
        let companySelector = ':scope > div > div.E6Tb7b.ZAFZMe';
        contactEls.forEach((cEl) => {
            let nameEl = cEl.querySelector(nameSelector);
            let name = nameEl.textContent;


            let phoneEl = cEl.querySelector(phoneSelector);
            let phone = phoneEl.textContent;
            phone = phone.replace('+', '');

            let companyEl = cEl.querySelector(companySelector);
            let company = companyEl.textContent;

            contacts[phone] = { name: name, phone: phone, company: company };
            // console.log(name,phone,company)

        });
        let text = '';
        Object.keys(contacts).forEach((key, i) => {
            let contact = contacts[key];
            console.log(contact);
            let link = `

${i+1}) *${contact.name}*  ${contact.company}
    
    api.whatsapp.com/send?phone=${contact.phone}
    
****************************************************************************************************************************************************************************************************************************
    `;
            text += link;
        });

        ayanoglu.utility.copy(text);
        //            debugger;
    }
    return;

    if (info.menuItemId === 'wup-selection') {
        if (!info.selectionText)
            return;
        var cb = (selectionText) => {
            var d = document,
                e = encodeURI;
            var f = 'https://api.whatsapp.com/send';
            var p = '?text=' + e(selectionText);
            var url = f + p + '\n\n\n' + selectionText;
            return url
        };

        replaceSelectedText(cb);

        // location.href=url;
        // var strWindowFeatures =
        // "height=300,width=700,left=100,top=100,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no,dialog=yes";
        // window.open( url, "wup-this",strWindowFeatures);

        return info.selectionText;

    } else if (info.menuItemId === 'wup-contact') {
        if (!info.selectionText)
            return;
        let selectionText = info.selectionText;

        var d = document,
            e = encodeURI;
        var f = 'https://contacts.google.com/search/';
        var p = '' + e(selectionText);
        var url = f + p;
        //https://developer.mozilla.org/en-US/docs/Web/API/Window/open
        var strWindowFeatures = "height=300,width=700,left=100,top=100,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no,dialog=yes";
        window.open(url, "wup-this" /* , strWindowFeatures */ );




        return;

    }

}

utility.addMenuItems([{
    'id': 'wup',
    'title': 'Wup Shortcut',
    'contexts': ['link']
}]);
utility.addMenuListener(menuHandler);