chrome.browserAction.onClicked.addListener(function(tab) {
	// alert('icon clicked')
	chrome.windows.create({
		url : chrome.extension.getURL("tabs.html"),
		left:0,
		top:0,
		width:500,
		focused:true,
		type : "popup"
	});
});