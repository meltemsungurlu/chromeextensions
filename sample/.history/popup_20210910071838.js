//# sourceURL=@chrome-extension-options.js
// https://developer.chrome.com/extensions/getstarted
'use strict';

let reloadElement = document.querySelector('div#reload');


reloadElement.addEventListener( 'click', (e) => {
    console.log(e.type);
    chrome.runtime.sendMessage(/** @type {runTimeRequest}*/ {
        requestType: 'reload-extension'
    }, function(response) {

        console.log('%cResponse', 'color:red;font-size:20px;padding:50px;', response);
    });
})
