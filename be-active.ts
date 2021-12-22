import {BeDecoratedProps, define} from 'be-decorated/be-decorated.js';
import {BeActiveActions, BeActiveVirtualProps, BeActiveProps} from './types';
import {register} from 'be-hive/register.js';

export class BeActiveController implements BeActiveActions{
    #target!: HTMLTemplateElement;
    intro(proxy: HTMLTemplateElement & BeActiveVirtualProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps){
        this.#target = target;
    }

    onCDN({baseCDN, proxy}: this): void {
        if(!baseCDN.endsWith('/')){
            proxy.baseCDN += '/';
            return; // orchestrator will re-call this method
        }
        const content = this.#target.content as DocumentFragment;
        content.querySelectorAll('script').forEach(node =>{
            this.handleScriptTag(node);
        });
        content.querySelectorAll('link').forEach(node =>{
            this.handleLinkTag(node);
        });
        this.#target.remove();
    }

    copyAttrs(src: Element, dest: Element, attrs: string[]){
        attrs.forEach(attr =>{
            if(!src.hasAttribute(attr)) return;
            const attrVal = src.getAttribute(attr)!;
            dest.setAttribute(attr, attrVal);
        })
    }

    handleScriptTag(node: HTMLScriptElement){
        const {id} = node;
        if(!id) throw 'MIA';  //Missing Id Attribute
        const existingTag = (<any>self)[id] as HTMLLinkElement;
        if(existingTag !== undefined && existingTag.localName === 'script') return;
        //TODO -- if no existingTag, but dom content not fully loaded, have to wait (for lazy support)
        //only if supportLazy setting is present.
        const clone = document.createElement('script') as HTMLScriptElement;
        clone.id = id;
        clone.type = 'module';
        this.copyAttrs(existingTag || node, clone, ['async', 'defer', 'integrity', 'crossorigin', 'referrerpolicy']);
        if(!this.noCrossOrigin && !clone.crossOrigin){clone.crossOrigin = 'anonymous';}
        if(existingTag !== undefined){
            clone.innerHTML = `import('${existingTag.href}');`;
        }else{
            clone.innerHTML = `
try{
 import('${id}');
}catch(e){
 import('${this.baseCDN}${id}${this.CDNpostFix}');
}`;
        }
        document.head.appendChild(clone);
    }

    handleLinkTag(node: HTMLLinkElement){
        const {id} = node;
        if(!id) throw 'MIA';  //Missing Id Attribute
        const existingTag = (<any>self)[id] as HTMLLinkElement;
        if(existingTag !== undefined && existingTag.rel === 'stylesheet') return;
        const clone = document.createElement('link') as HTMLLinkElement;
        clone.id = id;
        clone.rel = 'stylesheet';
        this.copyAttrs(existingTag || node, clone, ['integrity', 'crossorigin']);
        if(!this.noCrossOrigin && !clone.crossOrigin){clone.crossOrigin = 'anonymous';}
        if(existingTag !== undefined){
            clone.href = existingTag.href;
        }else{
            clone.href = node.href;
        }
        document.head.appendChild(clone);
    }
}

export interface BeActiveController extends BeActiveProps{}

const tagName = 'be-active';

const ifWantsToBe = 'active';

const upgrade = 'template';

define<BeActiveProps & BeDecoratedProps<BeActiveProps, BeActiveActions>, BeActiveActions>({
    config:{
        tagName,
        propDefaults:{
            ifWantsToBe,
            upgrade,
            forceVisible: ['template'],
            proxyPropDefaults:{
                baseCDN: (<any>self)['be-active/baseCDN']?.href || 'https://esm.run/',
                supportLazy: false,
                CDNpostFix: '',
                noCrossOrigin: false,
            },
            primaryProp: 'baseCDN',
            virtualProps: ['baseCDN', 'supportLazy', 'CDNpostFix', 'noCrossOrigin'],
            intro: 'intro'
        },
        actions:{
            onCDN: 'baseCDN',
        }
    },
    complexPropDefaults:{
        controller : BeActiveController
    }
});

register(ifWantsToBe, upgrade, tagName);