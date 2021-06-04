chrome.browserAction.onClicked.addListener(function(tab) {
	//  alert(screen.height)
	chrome.windows.create({
		url: chrome.extension.getURL("tabs.html"),
		left: 0,
		top: 0,
		width: 500,
		height: screen.height,
		focused: true,
		type: "panel"
	});
});
