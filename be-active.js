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
        content.querySelectorAll('script').forEach(async (node) => {
            const when = node.dataset.when;
            if (when !== undefined) {
                const split = when.split(',');
                for (const name of split) {
                    await customElements.whenDefined(name);
                }
            }
            this.handleScriptTag(node);
        });
        content.querySelectorAll('link').forEach(node => {
            this.handleLinkTag(node);
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
        const { id, dataset } = node;
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
        this.copyAttrs(existingTag || node, clone, ['async', 'defer', 'integrity', 'crossorigin', 'referrerpolicy']);
        if (!this.noCrossOrigin && !clone.crossOrigin) {
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
    import('${this.baseCDN}${cdnPath}${this.CDNpostFix}');
 });
}catch(e){
 
}`;
        }
        document.head.appendChild(clone);
    }
    handleLinkTag(node) {
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
        this.copyAttrs(existingTag || node, clone, ['integrity', 'crossorigin']);
        //if(!this.noCrossOrigin && !clone.crossOrigin){clone.crossOrigin = 'anonymous';}
        document.head.appendChild(clone);
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
                noCrossOrigin: false,
            },
            primaryProp: 'baseCDN',
            virtualProps: ['baseCDN', 'supportLazy', 'CDNpostFix', 'noCrossOrigin'],
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
