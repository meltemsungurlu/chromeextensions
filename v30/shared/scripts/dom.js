//# sourceURL=@extension-resources-dom.js



const _$ = function(...args) {

    let tag = arguments[0];
    let tagName, attributes = [];
    if (/^\w+$/i.test(tag)) {
        console.log('this is a tag name')
        let ms = /^\w+$/.exec(tag);
        tagName = ms[1];
    } else if (/^\w+\s+/i.test(tag)) {


        let rgx = new RegExp(/(\w+)(\s+.*)?/)
        let ms = rgx.exec(tag);
        if (ms[1]) {
            tagName = ms[1];

            if (ms[2]) {
                let atts = ms[2].split(/(\s+\w+="[^"]+")/);
                atts.forEach((item, index, arr) => {
                    let msa = /\s+(\w+)="(.+)"/.exec(item);
                    if (msa) {
                        attributes.push([msa[1], msa[2]])
                    }
                })
            }
        }


        console.log('this is a tag data', ms)
    } else {
        console.log('this is something else')
    }
    if (tagName) {
        let element = document.createElement(tagName);
        attributes.forEach((item, index, arr) => {
            element.setAttribute(item[0], item[1]);
        })
        return element;
    }
}

let elementPrototypes = {

    '_': function(tag) {
        if (/^\s*<\w+[\s\S]+/i.test(tag)) {
            console.log('this is a tag string')

            let temp = document.createElement('span');
            temp.insertAdjacentHTML('beforeend', tag)

            let out = Array.from(temp.children);
            while (temp.childElementCount > 0) {
                this.appendChild(temp.children[0])
            }
            return out;
        }

        let element = _$(tag);
        this.appendChild(element)
        return [element];
    }
}

Object.keys(elementPrototypes).forEach((name, index, arr) => {
    HTMLElement.prototype[name] = elementPrototypes[name];
})

ayanoglu.DOM={
        _$:_$
};
