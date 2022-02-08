export const onCDN = ({ baseCDN, proxy }) => {
    if (!baseCDN.endsWith('/')) {
        proxy.baseCDN += '/';
        return; // orchestrator will re-call this method
    }
    const content = proxy.content;
    content.querySelectorAll('script').forEach(async (node) => {
        const when = node.dataset.when;
        if (when !== undefined) {
            const split = when.split(',');
            for (const name of split) {
                await customElements.whenDefined(name);
            }
        }
        handleScriptTag(proxy, node);
    });
    content.querySelectorAll('link').forEach(node => {
        handleLinkTag(proxy, node);
    });
    proxy.remove();
};
function handleScriptTag(self, node) {
    const { id, dataset } = node;
    const { baseCDN, CDNpostFix } = self;
    if (!id)
        throw 'MIA'; //Missing Id Attribute
    if (dataset.for !== undefined) {
        if (customElements.get(dataset.for) !== undefined)
            return;
    }
    const existingTag = self[id];
    if (existingTag !== undefined && existingTag.localName === 'script')
        return;
    //TODO -- if no existingTag, but dom content not fully loaded, have to wait (for lazy support)
    //only if supportLazy setting is present.
    const clone = document.createElement('script');
    clone.id = id;
    clone.type = 'module';
    copyAttrs(existingTag || node, clone, ['async', 'defer', 'integrity', 'crossorigin', 'referrerpolicy']);
    if (!self.noCrossOrigin && !clone.crossOrigin) {
        clone.crossOrigin = 'anonymous';
    }
    if (existingTag !== undefined) {
        clone.innerHTML = `import('${existingTag.href}');`;
    }
    else {
        let cdnPath = id;
        if (node.dataset.version !== undefined) {
            const split = id.split('/');
            split[0] += `@${node.dataset.version}`;
            cdnPath = split.join('/');
        }
        clone.innerHTML = `
try{
import('${id}').catch(e=>{
import('${baseCDN}${cdnPath}${CDNpostFix}');
});
}catch(e){

}`;
    }
    document.head.appendChild(clone);
}
function handleLinkTag(self, node) {
    const { href } = node;
    if (!href)
        throw 'MIA'; //Missing Id Attribute
    const existingTag = self[href];
    if (existingTag !== undefined && existingTag.rel) {
        if (existingTag.rel === 'stylesheet')
            return;
        existingTag.rel = 'stylesheet';
        return;
    }
    const clone = document.createElement('link');
    Object.assign(clone, { id: href, rel: 'stylesheet', href });
    copyAttrs(existingTag || node, clone, ['integrity', 'crossorigin']);
    //if(!this.noCrossOrigin && !clone.crossOrigin){clone.crossOrigin = 'anonymous';}
    document.head.appendChild(clone);
}
function copyAttrs(src, dest, attrs) {
    attrs.forEach(attr => {
        if (!src.hasAttribute(attr))
            return;
        const attrVal = src.getAttribute(attr);
        dest.setAttribute(attr, attrVal);
    });
}
