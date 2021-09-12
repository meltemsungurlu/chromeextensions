let stylePaths = [
    "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",
    "https://fonts.googleapis.com/icon?family=Material+Icons",

];

stylePaths.forEach((href) => {
    injectStyleSheet(href)
})

document.body.classList.add(chrome.runtime.id);