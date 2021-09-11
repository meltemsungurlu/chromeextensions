//# sourceURL=@chrome-extension-options.js
// https://developer.chrome.com/extensions/getstarted
'use strict';

let processDv=document.querySelector('div.tab-control > div.content > div#process');
 
 

processDv.onclick = (e)=> {
	 console.log(e.type);
	chrome.runtime.sendMessage({ popUp:{
		 event:e
	}, greeting: "hello from popup page"}, function(response) {
		
		  console.log('%cResponse','color:red;font-size:20px;padding:50px;',response.farewell);
		});
};
