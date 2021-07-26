//# sourceURL=@chrome-extension-wup.js
let wupLib = {
    workers: {}
};


wupLib.collectContactsWupLinks = function() {

    var d = window.document;
    var nameSelector = '#list-container-inner > div';
    var lines = [];
    var rows = d.querySelectorAll(nameSelector);
    rows.forEach((row) => {
        if (nameNode = row.querySelector("div.name")) {
            console.log(nameNode.textContent);
            if (phoneNode = row.querySelector("div:nth-child(5) > a")) {
                console.log(phoneNode.textContent)
                var compNode = row.querySelector('div:nth-child(4)');
                if (['Reyaphasta', 'Kolanhasta'].indexOf(compNode.textContent) !== -1)
                    lines.push(ayanoglu.wup.makeWinShortcut(phoneNode.textContent, nameNode.textContent + ' - ' + compNode.textContent));
            }
        }
    });

    ayanoglu.ui.panel('*Last Added Unknown Numbers*\n\n' + lines.join('\n'));
};
let collectUnknownSenders = function() {

    //  console.clear();
    var textStack = [];
    var itemsCount = 1;
    var paneSelector = '#pane-side';
    var contacts = [];
    var groups = [];

    if (panel = document.querySelector(paneSelector)) {
        panel.scrollTo(0, 0);
        var i = 1;

        var itemSelector = '#pane-side > div:nth-child(1) > div > div > div';
        var scroller = () => {

            var items = Array.prototype.slice.call(document.querySelectorAll(itemSelector));

            // console.log('items length', items.length);
            items.forEach((item) => {
                // item.style.border = "1px solid blue";

                var unReadSelector = 'div > div > div._3j7s9 > div._1AwDx > div._3Bxar > span:nth-child(1) > div > span';

                var nameSelector = 'div > div > div._3j7s9 > div._2FBdJ > div._25Ooe > span > span';
                if (nameElement = item.querySelector(nameSelector)) {
                    var name = nameElement.textContent;
                    if (/\+\d+\s+[\d]{3}\s+[\d]{3}\s+[\d]{2}\s+[\d]{2}/ig.test(name)) {
                        //   console.log(name);
                        if (contacts.indexOf(name) === -1)
                            contacts.push(name);

                    }

                    if (unReadElement = item.querySelector(unReadSelector)) { //  console.log(name);

                    }
                    itemsCount++;
                }

            });

            var y = panel.clientHeight * i;
            //  console.log(panel.scrollTop);
            panel.scrollTo(0, y);
            i++;

            if (panel.scrollHeight - panel.scrollTop > panel.clientHeight) {
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
            ayanoglu.ui.panel(text);
            panel.scrollTo(0, 0);
        }

        scroller();

    }

}

wupLib.workers.collectUnknownSenders = collectUnknownSenders;

function openChatPanel() {

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

wupLib.openChatPanel = openChatPanel;

let collectGroupMembers = function(membersArr) {

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

        wupLib.openChatPanel().then(() => {

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

wupLib.workers.collectGroupMembers = collectGroupMembers;

let iterateUsers = function(callBack) {
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

    var itemSelector = '#pane-side > div:nth-child(1) > div > div > div';

    if (panel = document.querySelector(paneSelector)) {
        panel.scrollTo(0, 0);
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

                    if (unReadElement = item.querySelector(unReadSelector)) {
                        unread = parseInt(unReadElement.textContent);
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

            var y = panel.clientHeight * i;
            //  console.log(panel.scrollTop);
            if (!stopped) {
                panel.scrollTo(0, y);
                i++;

                if (panel.scrollHeight - panel.scrollTop > panel.clientHeight) {
                    setTimeout(scroller, 100)
                } else
                    finalize();
            } else {
                panel.scrollTo(0, 0);
            }

        }

        let finalize = () => {
            if (typeof callBack === 'function')
                callBack(false);
            panel.scrollTo(0, 0);
        }

        scroller();

    }

}

wupLib.workers.iterateUsers = iterateUsers;
let collectUnknownNumbers_Old = function(callBack) {
    return new Promise((resolve, reject) => {

        // console.clear();
        var textStack = [];
        var itemsCount = 1;
        var paneSelector = '#pane-side';
        var contacts = [];
        var groups = [];
        if (panel = document.querySelector(paneSelector)) {
            panel.scrollTo(0, 0);
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

                        if (unReadElement = item.querySelector(unReadSelector)) { //  console.log(name);

                        }
                        itemsCount++;
                    }

                });

                var y = panel.clientHeight * i;
                //  console.log(panel.scrollTop);
                if (!stopped) {
                    panel.scrollTo(0, y);
                    i++;

                    if (panel.scrollHeight - panel.scrollTop > panel.clientHeight) {
                        setTimeout(scroller, 3)
                    } else
                        finalize();
                } else {
                    panel.scrollTo(0, 0);
                }

            }

            let finalize = () => {

                panel.scrollTo(0, 0);
                resolve(contacts);
            }

            scroller();

        }

    })
}

//    wupLib.workers.collectUnknownNumbers = collectUnknownNumbers;

let sendMessage = function(message) {
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
wupLib.workers.sendMessage = sendMessage;

wupLib.makeWinShortcut = function(phone, name) {
    var wPhone = phone.replace(/[^\d]/g, '');
    if (/^[\d]{11,}$/.test(wPhone))
    ;
    else {
        if (/^[\d]{,10}$/.test(wPhone))
            wPhone = '90' + wPhone;
        if (!/^9\d+/.test(wPhone))
            wPhone = '9' + wPhone;
    }

    var link = 'api.whatsapp.com/send?phone=' + wPhone;
    if (name)
        link = '*' + name + '* ' + link;
    return link;
};
wupLib.workers.makeShortcut = function(label) {
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
}

window.ayanoglu.wup = wupLib;
var endLibrary = null;

var popData = ["*Randevu almak için:*   \n\n    90 850 473 77 77", "9:00 - 18:00 arası çalışıyorum", "Allah ü Teala razı olsun", "Allah ü Teala razı olsun abicim", "Allah ü Teala Razı olsun abicim.\nBilmukabele biz de Mübarek Ramazan Bayramı'nızı tebrik ederiz. \n\nAllah ü Teala daha nice bayramlara eriştirsin.", "Allah ü Teala Razı olsun kardeşim.\n\nBilmukabele biz de Mübarek Ramazan Bayramı'nızı tebrik ederiz tebrik ederiz.\n\nAllah ü Teala daha nice bayramlara eriştirsin.", "Allah ü Teala razı olsun.\nBilmukabele biz de Mübarek Ramazan Bayramı'nızı tebrik ederiz tebrik ederiz.\n\nAllah ü Teala daha nice bayramlara eriştirsin.", "Amin efendim...", "bit.ly/kbb-burun", "Bu iyiye işaret", "Çok şükür iyiyiz, yaramazlık yok", "Cuma gününüz mübarek olsun", "Cuma gününüz mübarek olsun efendim...", "Eczanelerden reçetesiz alabilirsiniz.", "Estağfurullah abicim", "Estağfurullah...", "Geçmiş olsun ", "Hayırlı akşamlar efendim... 😊", "Hayırlı Ramazanlar ", "http://bit.ly/cayanoglu\n", "https://www.instagram.com/drcuneytayanoglu/\n", "İstediğiniz  zaman yazmakla rahat olun ", "İyi geceler efendim... 😊", "İyi günler efendim, görüşmek üzere 😊", "Merhaba", "Merhaba , nasılsınız ?", "Rahatsızlık sebebi ile 3. Haziran Çarşamba gününe kadar raporluyum. \nBu tarihten sonra görüşebiliriz.", "Ramazan Bayram'ınızı tebrik eder, sağlık ve huzurlu günler dilerim.", "Rica ederim 😊", "Selamün Aleyküm", "Siz nasılsınız ?", "Tabi abicim buyrun 😊", "Teşekkür ederim siz nasılsınız ?", "Teşekkür ederim,\nSizin de Ramazan Bayram'ınızı tebrik eder, sağlık ve huzurlu günler dilerim.", "Teşekkürler 😊", "Ve Aleyküm Selam"];

var d = document;
let onLoad = () => {

    var pop = ayanoglu.ui.floatMenu();
    pop.add('Open Group Member Collector', () => {
        collectWupGroupMembers()
    }, 'icon-doc-text');

    pop.add('Parse Member Info', () => {
        parseMemberInfo();
    }, 'icon-user');

    pop.add('Collect Numbers', () => {
        collectUnknownNumbers();
    }, 'icon-attach');

    pop.add('Collect Cuma Numbers', () => {
        collectUnknownNumbers((contact) => {


            var el = contact.element.querySelector('#pane-side > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div.TbtXF > div._1SjZ2 > div._2vfYK > span')
            if (el) {
                var srcEl = contact.element.querySelector(':scope *[src^="https://web.whatsapp."]');

                if (srcEl) {
                    var src = srcEl.getAttribute('src');
                    var matches = /u=(\d+)%/.exec(src);
                    if (matches && matches[1]) {
                        contact.phone = matches[1];
                    } else return false;
                } else return false;
                var text = el.textContent;
                return text.search(/cuma/i)
            }

            return false;
        });
    }, 'icon-export');

    pop.add('Show Collection', () => {
        var dlg = contactListDialog('Member Collection');
        var output = getCSVText();
        dlg.writeText(output);
    }, 'icon-list');

    pop.add('New Number', () => {


        var phone = prompt('Telefon Numarası');

        var link = ayanoglu.wup.makeWinShortcut(phone);

        //905332761903
        var url = 'https://' + link;
        var anchor = _$('a').att('href', url).addTo(document.body);
        ca.event.raise('click', {}, anchor, true);
        document.body.removeChild(dv);
    }, 'icon-phone');

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

window.csvStack = [];

let parseMemberInfo = function() {

    parseContactInfo().then((contact) => {
        console.dir(contact);

        if (contact.saved) {

            var dlg = ayanoglu.ui.modalDialog();
            dlg.control.style.height = '300px';
            let _$ = ayanoglu.DOM._$;

            var table = _$('div').cls('ayanoglu flex-form').addTo(dlg.container);

            let addField = (label, name, tag, index, value) => {
                var row = _$('div').att('id', 'field-' + index).addTo(table);

                var labelCell = _$('div').text(label + (index > -1 ? ` (${index})` : '')).addTo(row);

                var inputCell = _$('div').addTo(row);
                var input = _$(tag ? tag : 'input').att('name', name).addTo(inputCell);
                if (value)
                    input.value = value;
                row.getValue = () => {
                    return input.value;
                }
                return input;
            }
            var nameElement = addField('Etiket', 'label', false, -1, contact.name);
            var txtElement = addField('Etiket', 'text', 'textarea', -1);
            txtElement.addEventListener('change', (e) => {
                ayanoglu.utility.copy(txtElement.value);
            });
            dlg.button('Oluştur', () => {
                var link = ayanoglu.wup.makeWinShortcut(contact.phone1Value, nameElement.value);
                txtElement.value = link;
                ayanoglu.utility.copy(link);
            });

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
}

function collectUnknownNumbers(filter) {
    if (!filter) filter = (contact) => {
        return (contact.name === false);
    }
    var dlg = ayanoglu.ui.dialog();

    dlg.title = 'Unknown Numbers';

    dlg.control.style.width = '800px';
    dlg.control.style.right = '0px';
    dlg.control.style.left = 'auto';
    var textElement = _$('textarea').css('margin: 0px; height: 100%; width: -webkit-fill-available;white-space: nowrap;').addTo(dlg.container);


    var stack = [];
    var groupIndex = 1;
    ayanoglu.wup.workers.iterateUsers((contact) => {
        if (contact === false) {

            return;
        }
        if (filter(contact)) {

            var link = ayanoglu.wup.makeWinShortcut(contact.phone);
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

}

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
    ayanoglu.wup.workers.sendMessage(text);
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


let parseContactInfo = function() {
    var nameSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div.Mr-fu > div._2Bps4._1mTqm._1pDAt > div:nth-child(3) > span > span'
    var numSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div._2vsnU > div._1CRb5._34vig._3XgGT > span > span';
    numSelector = '#app > div > div > div.YD4Yw > div._1-iDe._14VS3 > span > div > span > div > div > div.Mr-fu > div._2Bps4._1mTqm._1pDAt > span > span';

    return new Promise((resolve, reject) => {

        ayanoglu.wup.openChatPanel().then((element) => {
            var find = ayanoglu.DOM.findElement;

            var infoPaneSelector = '#app > div > div > div:nth-child(2) > div:nth-child(3)';
            find(infoPaneSelector, 'infoPane').then((ipElement) => {

                var numSelector = ':scope span > div > span > div > div > div > div > span';
                var nameSelector = ':scope span > div > span > div > div > div > div > div:nth-of-type(2)';

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

}

let download = ayanoglu.utility.download;

if (typeof window.contacts === 'undefined')
    window.contacts = [];

let buildContactCSV = ayanoglu.google.buildContactCSV;
let parseContactCSV = ayanoglu.google.parseContactCSV;
let getCSVText = ayanoglu.ui.getCSVText;
let contactListDialog = ayanoglu.ui.contactListDialog;
var panelControl;
let collectWupGroupMembers = function() {

    console.clear();

    let collectMembers = () => {

        ayanoglu.wup.workers.collectGroupMembers(contacts).then((members) => {
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

let formatNames = function(container) {
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

}

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

function menuHandler(menu, info, tab) {

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