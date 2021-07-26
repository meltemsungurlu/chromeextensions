//# sourceURL=@chrome-extension-pop-editor.js
console.log('Loading pop-editor.js...');

const panel = new ayanoglu.ui.controls.templateSelector((text) => {
    console.log(text);
    //ayanoglu.wup.workers.sendMessage(text);
}, true);
panel.onWillSelect = () => {
    return false;
};

utility.addMenuItems([{
    'id': 'open-editor',
    'title': 'Open Message Panel',
    'contexts': [
        'page'
    ]
}]);
// var mousePos;
// document.addEventListener('mouseup', function(e) {
//     if (e.button == 0) {

//         if (e.target.tagName === 'TEXTAREA') panel.show(e);
//     }
//     return true;
// })

// utility.addMenuListener((menu, info, tab) => {
//     panel.show(mousePos);
// })