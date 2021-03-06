//# sourceURL=@chrome-extension-content.js
//https://tureng.com/en/turkish-english/brew
console.log('Loading content.js...');

chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
	
	  console.log('%cResponse','color:red;font-size:20px;padding:50px;',response.farewell);
	});
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log('%cResponse','color:blue;font-size:20px;padding:50px;',message)
    return true
});
var d=document,b=d.body;
let locked=()=>{
	return b.style.opacity=='0.01';
}
 let lockScreen=(e)=>{
	        if(e && e.stopPropagation) e.stopPropagation();

	     
        b.style.opacity=e===true?'0.01':(e===false?'1' :( locked()  ?'1':'0.01'));
        
      if(e!==true)  setCookie('screen-lock',locked() ?"1":"0",10);


}
b.addEventListener('dblclick',(e)=>{
    if(e.altKey && e.ctrlKey && e.shiftKey){
    lockScreen(e);
    }
  
})
  
 lockScreen(getCookie('screen-lock')=="1");

utility.addMenuItems([{
    'id': 'translate-selection',
    'title': 'Translate "%s"',
    'contexts': ['selection']
}]);

utility.addMenuListener(function(menu, info, tab) {

    if (!info.selectionText)
        return;

    if (menu.menuItemId !== 'translate-selection')
        return;
    console.log("info", info);

    var d = document
      , l = d.location
      , e = encodeURIComponent;
    var f = 'https://tureng.com/en/turkish-english/';
    var p = info.selectionText;
    var url = f + p;
    //https://developer.mozilla.org/en-US/docs/Web/API/Window/open
    var strWindowFeatures = "height=500,width=700,left=100,top=100,resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no,status=no,dialog=yes";
    window.open(url, "translate-this", strWindowFeatures);

    /*		chrome.windows.create({
									url : url,
									width:700,
									height:300,
									focused:true,
									type:"popup"
					}, function ( tab ) {

					});
					*/
});

