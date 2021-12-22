import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeActiveController {
    #target;
    intro(proxy, target, beDecorProps) {
        this.#target = target;
    }
    onCDN({ baseCDN, proxy }) {
        if (!baseCDN.endsWith('/')) {
            proxy.baseCDN += '/';
            return; // orchestrator will re-call this method
        }
        const content = this.#target.content;
        content.querySelectorAll('script').forEach(node => {
            this.handleScriptTag(node);
        });
        content.querySelectorAll('style').forEach(node => {
            this.handleStyleTag(node);
        });
        this.#target.remove();
    }
    copyAttrs(src, dest, attrs) {
        attrs.forEach(attr => {
            if (!src.hasAttribute(attr))
                return;
            const attrVal = src.getAttribute(attr);
            dest.setAttribute(attr, attrVal);
        });
    }
    handleScriptTag(node) {
        const { id } = node;
        if (!id)
            throw 'MIA'; //Missing Id Attribute
        const existingTag = self[id];
        if (existingTag !== undefined && existingTag.localName === 'script')
            return;
        //TODO -- if no existingTag, but dom content not fully loaded, have to wait (for lazy support)
        //only if supportLazy setting is present.
        const clone = document.createElement('script');
        clone.id = id;
        clone.type = 'module';
        this.copyAttrs(existingTag || node, clone, ['async', 'defer', 'integrity', 'crossorigin']);
        if (existingTag !== undefined) {
            clone.innerHTML = `import('${existingTag.href}');`;
        }
        else {
            clone.innerHTML = `
try{
 import('${id}');
}catch(e){
 import('${this.baseCDN}${id}${this.CDNpostFix}');
}`;
        }
        document.head.appendChild(clone);
    }
    handleStyleTag(node) {
    }
}
const tagName = 'be-active';
const ifWantsToBe = 'active';
const upgrade = 'template';
define({
    config: {
        tagName,
        propDefaults: {
            ifWantsToBe,
            upgrade,
            forceVisible: ['template'],
            proxyPropDefaults: {
                baseCDN: self['be-active/baseCDN']?.href || 'https://esm.run/',
                supportLazy: false,
                CDNpostFix: '',
            },
            primaryProp: 'baseCDN',
            virtualProps: ['baseCDN', 'supportLazy', 'CDNpostFix'],
            intro: 'intro'
        },
        actions: {
            onCDN: 'baseCDN',
        }
    },
    complexPropDefaults: {
        controller: BeActiveController
    }
});
register(ifWantsToBe, upgrade, tagName);
