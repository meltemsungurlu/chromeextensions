//# sourceURL=@chrome-extension-wup.js



chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('%cResponse', 'color:blue;font-size:20px;padding:50px;', message);
    if(message.phone) 
     getNumberContactFromPhone(message.phone);

     
        sendResponse({
            success:true,
            farewell: "Phone number received ans processed:" + message.phone,
        });
    return true
});

const ca={
    chrome:{api :{
        whatsApp:{

             openShortcutsDialog: (contact) => {



                var dlg = ayanoglu.ui.modalDialog({ title: 'Shortcuts' });
                dlg.control.style.height = 'auto';
                let _$ = ayanoglu.DOM._$;
            
                var table = _$('div').cls('ayanoglu flex-form').addTo(dlg.container);
            
                let addField = (label, name, tag, index, value, css) => {
                    var row = _$('div').att('id', 'field-' + index).addTo(table);
            
                    var labelCell = _$('div').text(label + (index > -1 ? ` (${index})` : '')).addTo(row);
            
                    var inputCell = _$('div').addTo(row);
                    var input = _$(tag ? tag : 'input').att('name', name).addTo(inputCell);
                    if (css)
                        input.css(css);
                    if (value)
                        input.value = value;
                    row.getValue = () => {
                        return input.value;
                    }
                    return input;
                }
                var nameElement = addField('Başlık', 'label', false, -1, contact.name);
                var txtElement = addField('İlave bilgi', 'text', 'textarea', -1, null, 'min-height:60px;');
                var resultElement = addField('Sonuç', 'result', 'textarea', -1, null, 'height:120px;')
            
                let place = table.querySelector(':scope > div:nth-child(1) > div:nth-child(2)');
            
                let ck = _$('input').att('type', 'checkbox').css('display:inline;margin-left: 16px;transform: scale(1.5);').addTo(place);
                let ckLabel = _$('div').text('Telefon').css('display:inline;margin-left: 8px;').addTo(place);
            
            
            
            
                let build = (e) => {
                    let label = ``;
                    var link = ca.chrome.api.whatsApp.makeWinShortcut(contact.phone1Value, nameElement.value, txtElement.value, ck.checked);
                    resultElement.value = link;
                }
            
                ck.addEventListener('click', build);
            
                [txtElement, nameElement].forEach(el => {
                    el.addEventListener('keyup', build);
                });
            
                dlg.button('Oluştur', () => {
                    resultElement.select();
                    document.execCommand('copy');
                    dlg.close()
                });
                build();
            }
            ,
         parseMemberInfo : function() {
            
                ca.chrome.api.whatsApp.parseContactInfo().then((contact) => {
                    console.dir(contact);
            
                    if (contact.saved) {
                        ca.chrome.api.whatsApp.openShortcutsDialog(contact);
                    } else {
            
                        var dlg = ayanoglu.ui.dialog();
                        dlg.control.style.height = '100%'
                        dlg.title = contact.name;
                        var frm = ayanoglu.ui.contactForm(dlg, dlg.container, contact);
            
                        dlg.button('Ekle', () => {
                            var line = frm.getCsv();
                            var exists = false;
                            var nContact = parseContactCSV(line);
            
                            csvStack.some((csvLine) => {
                                var tContact = parseContactCSV(csvLine);
                                if (nContact.phone1Value === tContact.phone1Value) {
                                    exists = true;
                                    return true;
                                }
                            })
                            if (!exists)
                                csvStack.push(line);
                        });
            
                        dlg.button('Liste', () => {
            
                            var dlg = contactListDialog('CSV Text', false);
                            var output = getCSVText();
                            dlg.writeText(output);
            
                        })
            
                        dlg.button('Sıfırla', () => {
                            csvStack = [];
                        });
            
                    }
            
                });
            },
         makeShortcuts : function()  {
            
                ca.chrome.api.whatsApp.parseContactInfo().then(ca.chrome.api.whatsApp.openShortcutsDialog)
            
            
            }
            ,
         collectUnknownNumbers:function(filter) {
                if (!filter) filter = (contact) => {
                    return (contact.name === false);
                }
                var dlg = ayanoglu.ui.dialog();
            
                dlg.title = 'Unknown Numbers';
            
                dlg.control.style.width = '600px';
                dlg.control.style.right = '0px';
                dlg.control.style.left = 'auto';
                var textElement = _$('textarea').css('margin: 0px; height: 100%; width: -webkit-fill-available;white-space: nowrap;').addTo(dlg.container);
            
            
                var stack = [];
                var groupIndex = 1;
                ca.chrome.api.whatsApp.iterateUsers((contact) => {
                    if (contact === false) {
            
                        return;
                    }
                    if (filter(contact)) {
            
                        var link = ca.chrome.api.whatsApp.makeWinShortcut(contact.phone);
                        if (stack.length % 10 === 0) {
                            textElement.value += '\n\n\n*Group ' + (stack.length / 10) + '*\n\n';
                            groupIndex = 1;
                        }
                        textElement.value += groupIndex + ') ' + link + '\n\n';
            
                        console.log(groupIndex + ') ' + link);
                        stack.push(link);
                        groupIndex++;
                    }
            
                });
            
            },
            parseContactInfo : function() {
                var nameSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div.Mr-fu > div._2Bps4._1mTqm._1pDAt > div:nth-child(3) > span > span'
                var numSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div._2vsnU > div._1CRb5._34vig._3XgGT > span > span';
                numSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div.Mr-fu > div._2Bps4._1mTqm._1pDAt > span > span';
            
                return new Promise((resolve, reject) => {
            
                    ca.chrome.api.whatsApp.openChatPanel().then((element) => {
                        var find = ayanoglu.DOM.findElement;
            
                        var infoPaneSelector = '#app > div > div > div:nth-child(2) > div:nth-child(3)';
                        find(infoPaneSelector, 'infoPane').then((ipElement) => {
            
            
            
            
                            var numSelector = ':scope span > div > span > div > div > div > div > span';
                            var nameSelector = ':scope span > div > span > div > div > div > div > div:nth-of-type(2)';
            
            
            
                            let findNum = (srcEl) => {
                                var src = srcEl.getAttribute('src');
                                var matches = /u=(\d+)%/.exec(src);
                                if (matches && matches[1]) return matches[1];
                                return false;
                            }
                            let els = Array.from(ipElement.querySelectorAll(':scope *[src^="https://web.whatsapp."]'));
                            let numElement = els.find((srcEl) => {
                                if (findNum(srcEl) !== false) return true;
            
                            });
                            if (numElement) {
                                let pNum = findNum(numElement);
                                console.log('Phone: ' + pNum);
                                console.log(numElement);
                                let nameElement = numElement.parentElement.parentElement.nextElementSibling;
                                console.log(nameElement);
                                let name = nameElement.textContent;
                                console.log('Name: ' + name);
                                let saved = /\d\d\d\s\d\d\d\s+\d\d\s+\d\d$/.test(name);
                                resolve({
                                    name: name,
                                    phone1Type: 'mobile',
                                    phone1Value: pNum,
                                    saved: !saved
            
                                });
                            } else {
            
                                let ms = />\+([\d ]+)</.exec(ipElement.innerHTML);
                                if (ms && ms[1]) {
                                    let pNum = ms[1];
                                    let name = pNum;
                                    let nameElement = ipElement.querySelector(".copyable-area h2 > span");
                                    if (nameElement) name = nameElement.textContent;
                                    let saved = /\d\d\d\s\d\d\d\s+\d\d\s+\d\d$/.test(name);
                                    resolve({
                                        name: name,
                                        phone1Type: 'mobile',
                                        phone1Value: pNum,
                                        saved: !saved
            
                                    });
                                    console.log('Phone: ' + pNum);
                                    //     alert('Found: ' + pNum);
            
                                    //ipElement.querySelector(".copyable-area h2 > span")
                                }
                            }
                            return;
                            find(numSelector, 'num element', ipElement).then((numElement) => {
                                var numText = numElement.textContent;
            
                                var num = numText.replace(/[^\d]/g, '');
                                if (/[\d]{10,}/.test(num)) {
                                    var phone = num;
            
                                    find(nameSelector, 'Name', ipElement).then((nameElement) => {
                                        //  console.log(nameElement.textContent);
                                        name = nameElement.textContent
            
                                        resolve({
                                            name: name,
                                            phone1Type: 'mobile',
                                            phone1Value: phone,
                                            saved: false
            
                                        });
            
                                    }, () => {
                                        console.log('Not a new number');
                                    })
                                }
            
                                //debugger;
            
                            })
            
                        })
            
                        return;
                        var saved = false,
                            name, phone;
                        find(numSelector, 'Phone').then((numElement) => {
                            // console.log(numElement.textContent);
            
                            phone = numElement.textContent;
                            var num = phone.replace(/[^\d]/g, '');
                            if (!/[\d]{10,}/.test(num)) {
                                // saved
                                name = phone;
                                console.log('Name found', name);
                                numSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div.Mr-fu > div:nth-child(4) > div:nth-child(3) > div > div > span > span'
                                find(numSelector, 'Phone').then((phoneElement) => {
                                    //  console.log(nameElement.textContent);
                                    var phone = phoneElement.textContent
                                    resolve({
                                        name: name,
                                        phone1Type: 'mobile',
                                        phone1Value: phone,
                                        saved: true
                                    });
            
                                }, () => {
            
                                    reject();
                                })
            
                            } else {
                                find(nameSelector, 'Name').then((nameElement) => {
                                    //  console.log(nameElement.textContent);
                                    name = nameElement.textContent
                                    resolve({
                                        name: name,
                                        phone1Type: 'mobile',
                                        phone1Value: phone,
                                        saved: false
            
                                    });
            
                                }, () => {
            
                                    resolve({
                                        phone1Type: 'mobile',
                                        phone1Value: phone,
                                        saved: false
                                    });
                                })
                            }
            
                        }, reject)
                    }, reject);
            
                })
            
            },
         collectWupGroupMembers : function() {

                console.clear();
            
                let collectMembers = () => {
            let contacts=[];
                    ca.chrome.api.whatsApp.collectGroupMembers(contacts).then((members) => {
                        contacts = members;
                        window.csvStack = [];
                        contacts.forEach((contact) => {
                            csvStack.push(ayanoglu.google.buildContactCSV(contact));
                        });
                        var str = ayanoglu.google.buildContactsCSV(contacts);
            
                        setTimeout(() => {
                            dlg.writeText(str);
                        }, 1);
            
                    }, () => {});
                }
            
                var dlg = contactListDialog('Grup kişiler');
            
                dlg.button('Collect', collectMembers);
            
                dlg.button('Table List', () => {
                    let addLocalStyle = function(element, css) {
                        var style = _$('style').atts({
                            'type': 'text/css',
                        }).addTo(element);
                        if (css)
                            style.textContent += '\n' + css;
                    }
                    let _$ = ayanoglu.DOM._$;
                    var listPop = ayanoglu.ui.modalDialog();
                    listPop.title = 'Liste';
                    listPop.control.css(`width:600px;`);
                    var csvFields = ayanoglu.google.parseContactCSVFields();
                    var contactMap = csvFields.properties;
                    var fields = csvFields.array;
            
                    addLocalStyle(listPop.container, `
            div.contact-table {
                display:table;
                border-spacing: 0px 0px;
               border-left:1px solid rgba(0,0,0,0.09);
               border-top:1px solid rgba(0,0,0,0.09);
            }
            
            div.contact-table > div {
               display:table-row;
            }
            
            div.contact-table > div > div {
               display:table-cell;
               white-space:nowrap;
               padding:9px;
               border-bottom:1px solid rgba(0,0,0,0.09);
               border-right:1px solid rgba(0,0,0,0.03);
            }
            
            div.contact-table > div:first-child > div {
               background-color: rgba(0,0,0,0.09);
               border-bottom:1px solid rgba(0,0,0,0.09);
            }
            
            `)
            
                    var table = _$('div').cls('contact-table').addTo(listPop.container);
                    var csvLines = dlg.text.split('\n');
                    csvLines.forEach((csvLine) => {
            
                        var row = _$('div').css(``).addTo(table);
            
                        var cCsvArr = csvLine.split(',');
                        fields.forEach((field, i) => {
                            var value = cCsvArr[i].replace(/\"/g, '');;
                            var cell = _$('div').css(``).text(value).addTo(row);
                        })
                    });
            
                });
            
                collectMembers();
            
            }
            ,
             formatNames : function(container) {
                var fmtArr = [];
                var text = container.value;
                var lines = text.split('\n');
                for (var i = 0; i < lines.length; i++) {
                    var line = lines[i];
                    if (line.length === 0)
                        continue;
                    var items = line.split(';');
            
                    var str = items[0];
                    while (str.search(/  /gi) !== -1)
                        str = str.replace(/  /gi, ' ');
                    var names = str.split(' ');
            
                    for (var ii = 0; ii < names.length; ii++) {
            
                        var item = names[ii];
                        item = item.replace(/I/g, 'ı');
                        // item=item.replace('Ğ','ğ');
                        // item=item.replace('Ş','ş');
                        // item=item.replace('Ğ','g');
                        item = item[0].toLocaleUpperCase() + item.slice(1).toLocaleLowerCase();
                        names[ii] = item;
                    }
                    str = names.join(' ');
                    fmtArr.push(str + ';' + items[1]);
                }
                container.value = fmtArr.join('\n');
            
            },
             collectGroupMembers : function(membersArr) {

                return new Promise((finalResolve, finalReject) => {
                    if (typeof membersArr === 'undefined')
                        membersArr = [];
            
                    // console.clear();
                    var textStack = [];
                    var itemsCount = 1;
                    var paneSelector = '#pane-side';
                    var contacts = [];
                    var groups = [];
                    //div._1TM40 > div:nth-child(5) > div:nth-child(2) > div > div:nth-child(18) > div > div > div._2kHpK > div._1582E > div.m61XR > span._1_1Jb > span
                    var nameSelector = ':scope span[class="_3Whw5"]';
                    // 'div > div > div > div > div > div > div._2kHpK > div._1582E > div.m61XR > span._1_1Jb > span';
            
                    //div._1TM40 > div:nth-child(5) > div:nth-child(2) > div > div:nth-child(1) > div > div > div._2kHpK > div._3dtfX > div > span > span
                    var phoneSelector = ':scope span[class="_3ko75 _5h6Y_ _3Whw5"]';
                    // 'div > div > div > div > div > div > div._2kHpK > div._3dtfX > div > span > span';
            
                    ca.chrome.api.whatsApp.openChatPanel().then(() => {
            
                        var name = 'Info Panel';
                        var selector = '#app > div > div > div > div > span > div > span > div > div';
            
                        ayanoglu.DOM.findElement(selector, name).then((infoPanelElement) => {
            
                            let continueAfterExpander = () => {
                                // div._1TM40 > div:nth-child(5) > div:nth-child(2) > div > div:nth-child(2)
                                var itemSelector = ':scope section > div > div > div > div > div > div > div > div  span > span';
                                var pat = '[\\d+]{3}\\s[\\d+]{2}\\s[\\d+]{2}$';
                                var i = 0;
                                console.clear();
                                console.groupCollapsed('Collecting members...');
                                var scroller = () => {
            
                                    var items = Array.prototype.slice.call(infoPanelElement.querySelectorAll(itemSelector));
            
                                    var raw = Array.from(infoPanelElement.querySelectorAll(itemSelector));
                                    var items = raw.filter(el => el.textContent.search(pat) !== -1);
            
                                    console.log(items);
            
                                    items.forEach((item, i) => {
                                        var row = item.parentElement.parentElement.parentElement.parentElement;
                                        if (row.children[1]) {
                                            if (row.children[1].children[1]) {
                                                // console.log(i,item.textContent, row.children[1].children[1].textContent);
                                                var phone = item.textContent;
                                                var name = row.children[1].children[1].textContent;
                                                if (/[\w]{3,}/.test(name) && !membersArr.find((m) => {
                                                        return m.phone1Value === phone
                                                    })) {
            
                                                    item.style.border = "1px solid blue";
                                                    membersArr.push({
                                                        name: name,
                                                        phone1Type: 'mobile',
                                                        phone1Value: phone
                                                    });
                                                    itemsCount++;
            
                                                }
                                            }
            
                                        }
                                    })
            
                                    /*   items.forEach((item)=>{
                                            // item.style.border = "1px solid blue";
            
                                            if (phoneElement = item.querySelector(phoneSelector)) {
                                                var phone = phoneElement.textContent;
                                                if (/\+\d+\s+[\d]{3}\s+[\d]{3}\s+[\d]{2}\s+[\d]{2}/ig.test(phone)) {
            
                                                    if (nameElement = item.querySelector(nameSelector)) {
                                                        var name = nameElement.textContent;
                                                       console.log(name, ",", phone);
                                                        if( /[\w]{3}/.test(name) && !membersArr.find((m)=>{return m.phone1Value===phone})) 
                                                            membersArr.push( {
                                                                name: name,
                                                                phone1Type: 'mobile',
                                                                phone1Value: phone
                                                            }) 
                                                    }
              
                                                }
            
                                          
                                                itemsCount++;
                                            }
            
                                        }
                                        );*/
            
                                    var y = infoPanelElement.clientHeight * i;
                                    //  console.log(panel.scrollTop);
                                    infoPanelElement.scrollTo(0, y);
                                    i++;
            
                                    if (infoPanelElement.scrollHeight - infoPanelElement.scrollTop > infoPanelElement.clientHeight + 1) {
                                        setTimeout(scroller, 300)
                                    } else {
                                        //infoPanelElement.scrollTo(0, 0);
                                        console.groupEnd();
                                        finalResolve(membersArr)
                                    }
                                }
            
                                setTimeout(scroller, 1)
                            }
                            var expanderSelector = ':scope div > div > div div';
                            var numPat = '^\\d+\\s+more$';
                            var exp = Array.from(infoPanelElement.querySelectorAll(expanderSelector)).find(el => el.textContent.search(numPat) !== -1);
                            if (exp) {
                                ayanoglu.DOM.simulateMouseEvents(exp, 'click');
                                continueAfterExpander();
                            } else
                                continueAfterExpander();
            
                        })
            
                    });
            
                })
            }
            
            
        , iterateUsers : function(callBack) {
                console.log('iterating Users');
                var unique = [];
            
                console.clear();
                var textStack = [];
                var itemsCount = 1;
                var paneSelector = '#pane-side';
                var contacts = [];
                var groups = [];
                var unReadSelector = 'div > div > div._3j7s9 > div._1AwDx > div._3Bxar > span:nth-child(1) > div > span';
                //unReadSelector = 'div > div > div._3j7s9 > div._1AwDx > div._3Bxar > span:nth-child(1) > div:nth-child(2) > span.OUeyt';
            
                //div > div > div._2kHpK > div._3dtfX > div._3CneP > span > span
                var nameSelector = 'div > div > div._3j7s9 > div._2FBdJ > div._25Ooe > span > span';
                nameSelector = ':scope > div > div > div:nth-child(2) > div > div > span';
            
                var groupNameSelector = 'div > div > div._3j7s9 > div._2FBdJ > div._25Ooe > div > span'
            
                var itemSelector = '#pane-side > div:nth-child(3) > div > div > div';
                let pa2nel;
                if (pa2nel = document.querySelector(paneSelector)) {
                    pa2nel.scrollTo(0, 0);
                    var i = 1;
                    var stopped = false;
            
                    var scroller = () => {
            
                        var items = Array.prototype.slice.call(document.querySelectorAll(itemSelector));
            
                        // console.log('items length', items.length);
                        items.forEach((item, itemIndex) => {
                            //                    item.style.border = "1px solid blue";
                            var nameElement = item.querySelector(nameSelector);
                            var name = false;
                            var phone = false;
                            var unread = false;
                            var isGroup = false;
                            let groupElement;
                            if (nameElement) {
            
                                name = nameElement.textContent;
            
                            } else if (groupElement = item.querySelector(groupNameSelector)) {
                                name = groupElement.textContent;
                                isGroup = true;
                            }
            
                            if (name) {
            
                                itemsCount++;
                                if (unique.indexOf(name) !== -1)
                                    return false;
            
                                ayanoglu.DOM.simulateMouseEvents(item, 'click');
                                unique.push(name);
            
                                if (/\+\d+\s+[\d]{3}\s+[\d]{3}\s+[\d]{2}\s+[\d]{2}/ig.test(name)) {
                                    //   console.log(name);
                                    phone = name;
                                    name = false;
            
                                }
            let unReadElement;
                                if (unReadElement = item.querySelector(unReadSelector)) {
                                let    unread = parseInt(unReadElement.textContent);
                                }
                                var args = {
                                    name: name,
                                    phone: phone,
                                    unread: unread,
                                    count: itemsCount,
                                    index: itemIndex,
                                    isGroup: isGroup,
                                    element: item
                                }
            
                                if (typeof callBack === 'function') {
                                    if (callBack(args))
                                        stopped = true;
                                }
                            }
            
                        });
            
                        var y = pa2nel.clientHeight * i;
                        //  console.log(pa2nel.scrollTop);
                        if (!stopped) {
                            pa2nel.scrollTo(0, y);
                            i++;
            
                            if (pa2nel.scrollHeight - pa2nel.scrollTop > pa2nel.clientHeight) {
                                setTimeout(scroller, 100)
                            } else
                                finalize();
                        } else {
                            pa2nel.scrollTo(0, 0);
                        }
            
                    }
            
                    let finalize = () => {
                        if (typeof callBack === 'function')
                            callBack(false);
                        pa2nel.scrollTo(0, 0);
                    }
            
                    scroller();
            
                }
            
            }
            
             , collectUnknownNumbers_Old : function(callBack) {
                return new Promise((resolve, reject) => {
            
                    // console.clear();
                    var textStack = [];
                    var itemsCount = 1;
                    var paneSelector = '#pane-side';
                    var contacts = [];
                    var groups = [];
                    let pa3nel;
                    if (pa3nel = document.querySelector(paneSelector)) {
                        pa3nel.scrollTo(0, 0);
                        var i = 1;
                        var stopped = false;
                        var itemSelector = '#pane-side > div:nth-child(1) > div > div > div';
            
                        var scroller = () => {
            
                            var items = Array.prototype.slice.call(document.querySelectorAll(itemSelector));
            
                            // console.log('items length', items.length);
                            items.forEach((item) => {
                                // item.style.border = "1px solid blue";
            
                                var unReadSelector = 'div > div > div._3j7s9 > div._1AwDx > div._3Bxar > span:nth-child(1) > div > span';
            
                                var nameSelector = 'div > div > div._3j7s9 > div._2FBdJ > div._25Ooe > span > span';
                                let nameElement;
                                if (nameElement = item.querySelector(nameSelector)) {
                                    var name = nameElement.textContent;
                                    if (/\+\d+\s+[\d]{3}\s+[\d]{3}\s+[\d]{2}\s+[\d]{2}/ig.test(name)) {
                                        //   console.log(name);
                                        if (contacts.indexOf(name) === -1) {
                                            contacts.push(name);
                                            if (typeof callBack === 'function') {
                                                if (callBack(name))
                                                    stopped = true;
                                            }
                                        };
            
                                    }
            let unReadElement;
                                    if (unReadElement = item.querySelector(unReadSelector)) { //  console.log(name);
            
                                    }
                                    itemsCount++;
                                }
            
                            });
            
                            var y = pa3nel.clientHeight * i;
                            //  console.log(pa3nel.scrollTop);
                            if (!stopped) {
                                pa3nel.scrollTo(0, y);
                                i++;
            
                                if (pa3nel.scrollHeight - pa3nel.scrollTop > pa3nel.clientHeight) {
                                    setTimeout(scroller, 3)
                                } else
                                    finalize();
                            } else {
                                pa3nel.scrollTo(0, 0);
                            }
            
                        }
            
                        let finalize = () => {
            
                            pa3nel.scrollTo(0, 0);
                            resolve(contacts);
                        }
            
                        scroller();
            
                    }
            
                })
            }
            
            
            , 
            sendMessage : function(message) {
                    var find = ayanoglu.DOM.findElement;
                    var msgBoxSelector = '#main > footer > div._3pkkz.V42si.copyable-area > div._1Plpp > div > div._2S1VP.copyable-text.selectable-text';
                    msgBoxSelector = '#main > footer div > div > div > div.copyable-text.selectable-text';
                    find(msgBoxSelector, 'textArea').then((element) => {
            
                        element.innerHTML = message;
            
                        //Force refresh
                        event = document.createEvent("UIEvents");
                        event.initUIEvent("input", true, true, window, 1);
                        element.dispatchEvent(event);
            
                        //Click at Send Button
                        ayanoglu.DOM.simulateMouseEvents(document.querySelector('span[data-icon="send"]'), 'click');
            
                    });
                }
                //CHROME 
              ,
              makeWinShortcut : function(phone, name, more, isTel = false) {
                name = name || 'Untitled';
                more = more || '';
                var wPhone = phone.replace(/[^\d]/g, '');
                if (wPhone.toString().length < 10) {
                    alert('Number not valid');
                    return;
                }
                if (wPhone.toString().length === 10) wPhone = '90' + wPhone;
                else if (wPhone.toString().length === 11) wPhone = '9' + wPhone;
            
                var url = (isTel ? 'tel://' : 'api.whatsapp.com/send?phone=') + wPhone;
            
                return `*${name}*
            
            ${more}
            
            tel://${wPhone}
            
            api.whatsapp.com/send?phone=${wPhone}
            `;
            }, 
            getProfileUrl : function(phone) {
            
                var wPhone = phone.replace(/[^\d]/g, '');
                if (wPhone.toString().length < 10) {
                    alert('Number not valid');
                    return;
                }
                if (wPhone.toString().length === 10) wPhone = '90' + wPhone;
                else if (wPhone.toString().length === 11) wPhone = '9' + wPhone;
            
                return 'api.whatsapp.com/send?phone=' + wPhone;
            
            },
            
            
            
               makeShortcut : function(label) {
                // console.clear();
                let find = ayanoglu.DOM.findElement;
                var infoSelector = '#main > header > div._5SiUq';
                var numSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div._2vsnU > div:nth-child(4) > div:nth-child(3) > div > div > span > span';
                var nameSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div._2vsnU > div._1CRb5._34vig._3XgGT > span > span'
            
                find(infoSelector, 'Header').then((element) => {
                    ayanoglu.DOM.simulateMouseEvents(element, 'click');
            
                    find(numSelector, 'Phone').then((phoneElement) => {
                        var phone = phoneElement.textContent;
                        phone = phone.replace(/[^\d]/g, "");
                        var link = 'api.whatsapp.com/send?phone=' + encodeURIComponent(phone);
            
                        find(nameSelector, 'Name').then((nameElement) => {
                            var name = nameElement.textContent;
            
                            var text = '*' + name + (label ? ' (' + label + ')' : '') + '* ' + link;
                            console.log(text);
                            copy(text);
            
                        })
            
                    })
            
                });
            },
            collectContactsWupLinks : function() {

                var d = window.document;
                var nameSelector = '#list-container-inner > div';
                var lines = [];
                var rows = d.querySelectorAll(nameSelector);
                rows.forEach((row) => {
                    let nameNode;
                    if (nameNode = row.querySelector("div.name")) {
                        console.log(nameNode.textContent);
                        let phoneNode;
                        if (phoneNode = row.querySelector("div:nth-child(5) > a")) {
                            console.log(phoneNode.textContent)
                            var compNode = row.querySelector('div:nth-child(4)');
                            if (['Reyaphasta', 'Kolanhasta'].indexOf(compNode.textContent) !== -1)
                                lines.push(ca.chrome.api.whatsApp.makeWinShortcut(phoneNode.textContent, nameNode.textContent + ' - ' + compNode.textContent));
                        }
                    }
                });
            
                ayanoglu.ui.panel('*Last Added Unknown Numbers*\n\n' + lines.join('\n'));
            },
            collectUnknownSenders : function() {
            
                //  console.clear();
                var textStack = [];
                var itemsCount = 1;
                var paneSelector = '#pane-side';
                var contacts = [];
                var groups = [];
            let pa5nel;
                if (pa5nel = document.querySelector(paneSelector)) {
                    pa5nel.scrollTo(0, 0);
                    var i = 1;
            
                    var itemSelector = '#pane-side > div:nth-child(1) > div > div > div';
                    var scroller = () => {
            
                        var items = Array.prototype.slice.call(document.querySelectorAll(itemSelector));
            
                        // console.log('items length', items.length);
                        items.forEach((item) => {
                            // item.style.border = "1px solid blue";
            
                            var unReadSelector = 'div > div > div._3j7s9 > div._1AwDx > div._3Bxar > span:nth-child(1) > div > span';
            
                            var nameSelector = 'div > div > div._3j7s9 > div._2FBdJ > div._25Ooe > span > span';
                            let nameElement;
                            if (nameElement = item.querySelector(nameSelector)) {
                                var name = nameElement.textContent;
                                if (/\+\d+\s+[\d]{3}\s+[\d]{3}\s+[\d]{2}\s+[\d]{2}/ig.test(name)) {
                                    //   console.log(name);
                                    if (contacts.indexOf(name) === -1)
                                        contacts.push(name);
            
                                }
            let unReadElement;
                                if (unReadElement = item.querySelector(unReadSelector)) { //  console.log(name);
            
                                }
                                itemsCount++;
                            }
            
                        });
            
                        var y = pa5nel.clientHeight * i;
                        //  console.log(pa5nel.scrollTop);
                        pa5nel.scrollTo(0, y);
                        i++;
            
                        if (pa5nel.scrollHeight - pa5nel.scrollTop > pa5nel.clientHeight) {
                            setTimeout(scroller, 3)
                        } else
                            finalize();
                    }
            
                    let finalize = () => {
                        console.log('contacts: ', contacts.length);
                        console.log('final', 'i: ' + i + ', itemsCount: ' + itemsCount);
            
                        contacts.forEach((contact) => {
                            var phone = contact;
                            var wPhone = phone.replace(/[^\d]/g, '');
                            var link = 'api.whatsapp.com/send?phone=' + wPhone;
                            textStack.push(link);
                            // output.appendLine(wPhone);
                        });
                        var text = textStack.join('\r\n');
                        ayanoglu.ui.pa5nel(text);
                        pa5nel.scrollTo(0, 0);
                    }
            
                    scroller();
            
                }
            
            }
            
            
             ,openChatPanel:function() {
            
                return new Promise((resolve, reject) => {
            
                    var selector = '#main > header > div:first-child';
                    var name = 'Header';
            
                    var element = document.querySelector(selector)
                    if (!element) {
                        console.error(`"${name}" not found`);
                        reject();
                    } else {
                        ayanoglu.DOM.simulateMouseEvents(element, 'click');
                        console.log(`"${name}" found`);
                        resolve(element);
                    }
                });
            
            }
    
    
        }
    }
    }
}

 


var popData = ["*Randevu almak için:*   \n\n    90 850 473 77 77", "9:00 - 18:00 arası çalışıyorum", "Allah ü Teala razı olsun", "Allah ü Teala razı olsun abicim", "Allah ü Teala Razı olsun abicim.\nBilmukabele biz de Mübarek Ramazan Bayramı'nızı tebrik ederiz. \n\nAllah ü Teala daha nice bayramlara eriştirsin.", "Allah ü Teala Razı olsun kardeşim.\n\nBilmukabele biz de Mübarek Ramazan Bayramı'nızı tebrik ederiz tebrik ederiz.\n\nAllah ü Teala daha nice bayramlara eriştirsin.", "Allah ü Teala razı olsun.\nBilmukabele biz de Mübarek Ramazan Bayramı'nızı tebrik ederiz tebrik ederiz.\n\nAllah ü Teala daha nice bayramlara eriştirsin.", "Amin efendim...", "bit.ly/kbb-burun", "Bu iyiye işaret", "Çok şükür iyiyiz, yaramazlık yok", "Cuma gününüz mübarek olsun", "Cuma gününüz mübarek olsun efendim...", "Eczanelerden reçetesiz alabilirsiniz.", "Estağfurullah abicim", "Estağfurullah...", "Geçmiş olsun ", "Hayırlı akşamlar efendim... 😊", "Hayırlı Ramazanlar ", "http://bit.ly/cayanoglu\n", "https://www.instagram.com/drcuneytayanoglu/\n", "İstediğiniz  zaman yazmakla rahat olun ", "İyi geceler efendim... 😊", "İyi günler efendim, görüşmek üzere 😊", "Merhaba", "Merhaba , nasılsınız ?", "Rahatsızlık sebebi ile 3. Haziran Çarşamba gününe kadar raporluyum. \nBu tarihten sonra görüşebiliriz.", "Ramazan Bayram'ınızı tebrik eder, sağlık ve huzurlu günler dilerim.", "Rica ederim 😊", "Selamün Aleyküm", "Siz nasılsınız ?", "Tabi abicim buyrun 😊", "Teşekkür ederim siz nasılsınız ?", "Teşekkür ederim,\nSizin de Ramazan Bayram'ınızı tebrik eder, sağlık ve huzurlu günler dilerim.", "Teşekkürler 😊", "Ve Aleyküm Selam"];

var d = document;
d.body.addEventListener('paste', (event) => {
    let paste = (event.clipboardData || window.clipboardData).getData('text');

    console.log(paste);
    getNumberContactFromPhone(paste)
})
let getNumberContactFromInput = () => {
    var phone = prompt('Telefon Numarası');
    getNumberContactFromPhone(phone);
}
let getNumberContactFromPhone = (phone) => {
    var link = ca.chrome.api.whatsApp.getProfileUrl(phone);

    //905332761903
    var url = 'https://' + link;
    var anchor = _$('a').att('href', url).addTo(document.body);
    ca.event.raise('click', {}, anchor, true);
    document.body.removeChild(anchor);
};

let onLoad = () => {

    var pop = ayanoglu.ui.floatMenu();
    pop.add('Open Group Member Collector', () => {
        ca.chrome.api.whatsApp.collectWupGroupMembers()
    }, 'icon-doc-text');


    pop.add('Make Shortcuts', () => {
        ca.chrome.api.whatsApp.makeShortcuts();
    }, 'icon-export');


    pop.add('New Number', getNumberContactFromInput, 'icon-phone');

    pop.add('Collect Unknown Numbers', () => {
        ca.chrome.api.whatsApp.collectUnknownNumbers();
    }, 'icon-attach');

    // pop.add('Collect Cuma Numbers', () => {
    //     collectUnknownNumbers((contact) => {


    //         var el = contact.element.querySelector('#pane-side > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div.TbtXF > div._1SjZ2 > div._2vfYK > span')
    //         if (el) {
    //             var srcEl = contact.element.querySelector(':scope *[src^="https://web.whatsapp."]');

    //             if (srcEl) {
    //                 var src = srcEl.getAttribute('src');
    //                 var matches = /u=(\d+)%/.exec(src);
    //                 if (matches && matches[1]) {
    //                     contact.phone = matches[1];
    //                 } else return false;
    //             } else return false;
    //             var text = el.textContent;
    //             return text.search(/cuma/i)
    //         }

    //         return false;
    //     });
    // }, 'icon-list');

    pop.add('Show Collection', () => {
        var dlg = contactListDialog('Member Collection');
        var output = getCSVText();
        dlg.writeText(output);
    }, 'icon-list');


    pop.add('Translate', () => {
        var dlg = ayanoglu.ui.modalDialog();
        dlg.control.style.height = '500px'
        dlg.title = 'Translate';
        let _$ = ayanoglu.DOM._$;
        var txtArea = _$('textarea').css(`width: -webkit-fill-available;
    height: 100%;`).addTo(dlg.container);

        dlg.button('Convert', () => {
            txtArea.value = ayanoglu.utility.upperCase(txtArea.value);
        })

    }, 'icon-up-hand');

};
addEventListener('load', onLoad)

let csvStack = [];




function getFileNameStamp() {
    var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours(),
        min = d.getMinutes();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;
    if (hour.length < 2)
        hour = '0' + hour;
    if (min.length < 2)
        min = '0' + min;

    return [year, month, day, hour, min].join('-');
}
const messagePanelSelector = '#main > div._1LcQK > div > div > div:nth-child(3)';

const popPanel = ayanoglu.ui.controls.selectionPop((text) => {
    console.log(text);
    ca.chrome.api.whatsApp.sendMessage(text);
}, true);

popPanel.onWillSelect = (e) => {
    let messagePanel = document.querySelector(messagePanelSelector);
    if (messagePanel && messagePanel.contains(e.target)) return true;
    return false;
}

utility.addMenuItems([{
    'id': 'open-editor',
    'title': 'Open Message Panel',
    'contexts': [
        'page'
    ]
}]);

utility.addMenuItems([{
    'id': 'open-editor',
    'title': 'Open Message Panel',
    'contexts': [
        'page'
    ]
}]);


// utility.addMenuListener((menu, info, tab) => {
//     popPanel.show(mousePos);
// })



let download = ayanoglu.utility.download;

if (typeof window.contacts === 'undefined')
    window.contacts = [];

let buildContactCSV = ayanoglu.google.buildContactCSV;
let parseContactCSV = ayanoglu.google.parseContactCSV;
let getCSVText = ayanoglu.ui.getCSVText;
let contactListDialog = ayanoglu.ui.contactListDialog;
var panelControl;


function replaceSelectedText(cb) {
    var sel, range;

    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            var replacementText = cb(sel.toString());
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        var replacementText = cb(range.text);
        range.text = replacementText;
    }
}



 

const menuHandlers={
      sendContactToGoogle:(menu, info, tab) => {
        let selectionText = info.selectionText;
    
        var d = document,
            e = encodeURI;
    
        // https://contacts.google.com/new?organization=birincihasta&givenname=hasan&familyname=ali&phone=90%20553%20065%2037%2060
        let phone = e(selectionText);
        phone = phone.replace('+', '%2B');
        let firstName = '';
        let lastName = '';
        var url = `https://contacts.google.com/new?givenname=${firstName}&familyname=${lastName}&phone=${phone}`;
    
        //https://developer.mozilla.org/en-US/docs/Web/API/Window/open
        let strWindowFeatures = "height=300,width=700,left=100,top=100,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no,dialog=yes";
        window.open(url, "wup-this" /* , strWindowFeatures */ );
    
    },
    searchPhoneInGoogleContacts: (menu, info, tab)=>{ 
    
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
    
    
    },
    sendSelectionToWhatsApp: (menu, info, tab)=>{ 
    
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
    }, 
}

function menuHandler(menu, info, tab) {
    if (info.menuItemId === 'new-contact') {
        menuHandlers.sendContactToGoogle(menu, info, tab)
        

    } else if (info.menuItemId === 'wup-selection') {
        menuHandlers.sendSelectionToWhatsApp(menu, info, tab)

    } else if (info.menuItemId === 'wup-contact') {
        menuHandlers.searchPhoneInGoogleContacts(menu, info, tab)

        return;

    }

}

utility.addMenuItems([{
        'id': 'new-contact',
        'title': 'Add  "%s" to Contacts',
        'contexts': ['selection']
    }, {
        'id': 'wup-contact',
        'title': 'Search  "%s" in Contacts',
        'contexts': ['selection']
    }, {
        'id': 'wup-selection',
        'title': 'Send  "%s" to Whatsapp',
        'contexts': ['selection']
    }, {
        'id': 'entity',
        'title': 'Collect Entity',
        'contexts': ['link']
    }
    /*, {
        'id': 'phones',
        'title': 'Collect phones',
        'contexts': ['page']
    }*/
]);
utility.addMenuListener(menuHandler);