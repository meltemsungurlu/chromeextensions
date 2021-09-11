//# sourceURL=@chrome-extension-options.js
// https://developer.chrome.com/extensions/getstarted
'use strict';

let reloadElement = document.querySelector('div#reload');



reloadElement.onclick = (e) => {
    console.log(e.type);
    chrome.runtime.sendMessage({
        /** @type {messageRequest}*/
    request:{

    }
    }, function(response) {

        console.log('%cResponse', 'color:red;font-size:20px;padding:50px;', response);
    });
};