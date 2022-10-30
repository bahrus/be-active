import { define } from 'be-decorated/DE.js';
import { register } from 'be-hive/register.js';
export class BeActiveController extends EventTarget {
    async onCDN(pp) {
        const { baseCDN, self } = pp;
        if (!baseCDN.endsWith('/')) {
            return {
                baseCDN: baseCDN + '/', // orchestrator will re-call this method
            };
        }
        const content = self.content;
        content.querySelectorAll('script').forEach(async (node) => {
            const when = node.dataset.when;
            if (when !== undefined) {
                const split = when.split(',');
                for (const name of split) {
                    await customElements.whenDefined(name);
                }
            }
            this.#handleScriptTag(pp, node);
        });
        content.querySelectorAll('link').forEach(node => {
            this.#handleLinkTag(pp, node);
        });
        self.remove();
    }
    #handleScriptTag(pp, node) {
        const { id, dataset } = node;
        const { baseCDN, CDNpostFix } = pp;
        if (!id)
            throw 'MIA'; //Missing Id Attribute
        if (dataset.for !== undefined) {
            if (customElements.get(dataset.for) !== undefined)
                return;
        }
        const existingTag = pp[id];
        if (existingTag !== undefined && existingTag.localName === 'script')
            return;
        //TODO -- if no existingTag, but dom content not fully loaded, have to wait (for lazy support)
        //only if supportLazy setting is present.
        const clone = document.createElement('script');
        clone.id = id;
        clone.type = 'module';
        this.#copyAttrs(existingTag || node, clone, ['async', 'defer', 'integrity', 'crossorigin', 'referrerpolicy']);
        if (!pp.noCrossOrigin && !clone.crossOrigin) {
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
    #handleLinkTag(pp, node) {
        const { href } = node;
        if (!href)
            throw 'MIA'; //Missing Id Attribute
        const existingTag = pp[href];
        if (existingTag !== undefined && existingTag.rel) {
            if (existingTag.rel === 'stylesheet')
                return;
            existingTag.rel = 'stylesheet';
            return;
        }
        const clone = document.createElement('link');
        Object.assign(clone, { id: href, rel: 'stylesheet', href });
        this.#copyAttrs(existingTag || node, clone, ['integrity', 'crossorigin']);
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
            forceVisible: [upgrade],
            proxyPropDefaults: {
                baseCDN: self['be-active/baseCDN']?.href || 'https://esm.run/',
                supportLazy: false,
                CDNpostFix: '',
                noCrossOrigin: false,
            },
            primaryProp: 'baseCDN',
            virtualProps: ['baseCDN', 'supportLazy', 'CDNpostFix', 'noCrossOrigin'],
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
