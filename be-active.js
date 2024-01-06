import { BE, propDefaults, propInfo } from 'be-enhanced/BE.js';
import { XE } from 'xtal-element/XE.js';
export class BeActive extends BE {
    static get beConfig() {
        return {
            parse: true,
            primaryProp: 'baseCDN'
        };
    }
    async onCDN(self) {
        const { enhancedElement, baseCDN } = self;
        if (!baseCDN.endsWith('/')) {
            return {
                baseCDN: baseCDN + '/', // orchestrator will re-call this method
            };
        }
        const content = enhancedElement.content;
        content.querySelectorAll('script').forEach(async (node) => {
            const when = node.dataset.when;
            if (when !== undefined) {
                const split = when.split(',');
                for (const name of split) {
                    await customElements.whenDefined(name);
                }
            }
            this.#handleScriptTag(self, node);
        });
        content.querySelectorAll('link').forEach(node => {
            this.#handleLinkTag(self, node);
        });
        enhancedElement.setAttribute('be-gone', '');
        setTimeout(() => {
            enhancedElement.remove();
        }, 1000);
        return {
            resolved: true,
        };
    }
    #handleScriptTag(self, node) {
        const { id, dataset } = node;
        const { baseCDN, CDNpostFix, enhancedElement, noCrossOrigin } = self;
        if (!id)
            throw 'MIA'; //Missing Id Attribute
        if (dataset.for !== undefined) {
            if (customElements.get(dataset.for) !== undefined)
                return;
        }
        const existingTag = window[id];
        if (existingTag !== undefined && existingTag.localName === 'script')
            return;
        const clone = document.createElement('script');
        clone.id = id;
        clone.type = 'module';
        this.#copyAttrs(existingTag || node, clone, ['async', 'defer', 'integrity', 'crossorigin', 'referrerpolicy']);
        if (!noCrossOrigin && !clone.crossOrigin) {
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
                
                }
            `;
        }
        document.head.appendChild(clone);
    }
    #copyAttrs(src, dest, attrs) {
        attrs.forEach(attr => {
            if (!src.hasAttribute(attr))
                return;
            const attrVal = src.getAttribute(attr);
            dest.setAttribute(attr, attrVal);
        });
    }
    #handleLinkTag(self, node) {
        const { href } = node;
        if (!href)
            throw 'MIA'; //Missing Id Attribute
        const existingTag = window[href];
        if (existingTag !== undefined && existingTag.rel) {
            if (existingTag.rel === 'stylesheet')
                return;
            existingTag.rel = 'stylesheet';
            return;
        }
        const clone = document.createElement('link');
        Object.assign(clone, { id: href, rel: 'stylesheet', href });
        this.#copyAttrs(existingTag || node, clone, ['integrity', 'crossorigin']);
        document.head.appendChild(clone);
    }
}
export const tagName = 'be-active';
const ifWantsToBe = 'active';
const upgrade = 'template';
const xe = new XE({
    config: {
        tagName,
        propDefaults: {
            ...propDefaults,
            baseCDN: self['be-active/baseCDN']?.href || 'https://esm.run/',
            //supportLazy: false,
            CDNpostFix: '',
            noCrossOrigin: false,
        },
        propInfo: {
            ...propInfo
        },
        actions: {
            onCDN: 'baseCDN',
        }
    },
    superclass: BeActive,
});
