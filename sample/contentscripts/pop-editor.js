//# sourceURL=@chrome-extension-pop-editor.js
console.log('Loading pop-editor.js...');

const panel = new ayanoglu.ui.controls.selectionPop((text)=>{
	console.log(text);
	//ayanoglu.wup.workers.sendMessage(text);
}
, true);

utility.addMenuItems([
	{
		'id':'open-editor',
		'title' : 'Open Message Panel',
		'contexts' : [
			'page'
			]
	}
	]);
var mousePos;
document.addEventListener('mouseup', function (e) {
	  if (e.button == 2) {
		  mousePos=e;
	    var p = {clientX: e.clientX, clientY: e.clientY};
	    var msg = {text: 'example', point: p, from: 'mouseup'};
	  
	    chrome.runtime.sendMessage(msg, function(response) {});
	  }
	})

utility.addMenuListener( (menu,info,tab)=>{
	panel.show(mousePos); 
})