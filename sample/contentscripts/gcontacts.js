console.log('ayanoglu');
var d = document;
d.body.addEventListener('dblclick', (e) => {
    let values = /^\?(.+)/.exec(location.search)[1].split('&').map((item) => {
        return item.split('=')[1];
    });
    let name = values[0],
        phone = values[1];
    let c = d.createElement('div');
    c.setAttribute('style', 'position:fixed;')
    d.body.appendChild(c);
    debugger;
})