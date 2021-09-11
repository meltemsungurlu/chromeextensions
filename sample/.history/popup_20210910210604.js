//# sourceURL=@chrome-extension-options.js
// https://developer.chrome.com/extensions/getstarted
'use strict';

var ref = document.head;

let    js = document.createElement('script');
 
    // js.defer = true
    // js.async = true;;
    js.addEventListener('load', (e)=>{
        console.log('okeee')
    })
    js.src =chrome.extension.getURL('shared/bootstrap.js');
    ref.appendChild(js);

     
let reloadElement = document.querySelector('div#reload');


reloadElement.addEventListener( 'click', (e) => {
    console.log(e.type);
    let request=new runTimeRequest("reload-extension");
    chrome.runtime.sendMessage(request, function(response) {

        console.log('%cResponse', 'color:red;font-size:20px;padding:50px;', response);
    });
})

utility.injectBootsrapStyleSheet();