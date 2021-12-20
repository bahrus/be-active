import {BeDecoratedProps, define} from 'be-decorated/be-decorated.js';
import {BeActiveActions, BeActiveVirtualProps, BeActiveProps} from './types';
import {register} from 'be-hive/register.js';


export class BeActiveController implements BeActiveActions{
    intro(proxy: HTMLTemplateElement & BeActiveVirtualProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps){
        const clone = target.content.cloneNode(true) as DocumentFragment;
        clone.querySelectorAll('script').forEach(node =>{
            this.handleScriptTag(node);
        });
        clone.querySelectorAll('style').forEach(node =>{
            this.handleStyleTag(node);
        });
        target.remove();
    }

    copyAttrs(src: HTMLScriptElement, dest: Element, attrs: string[]){
        attrs.forEach(attr =>{
            if(!src.hasAttribute(attr)) return;
            const attrVal = src.getAttribute(attr)!;
            dest.setAttribute(attr, attrVal);
        })
    }

    handleScriptTag(node: HTMLScriptElement){
        const {id} = node;
        if(!id) throw 'MIA';  //Missing Id Attribute
        const existingTag = (<any>self)[id] as Element;
        if(existingTag !== undefined && existingTag.localName === 'script') return;
        const clone = document.createElement('script') as HTMLScriptElement;
        clone.id = id;
        clone.type = 'module';
        this.copyAttrs(node, clone, ['async', 'defer', 'integrity', 'crossorigin']);
        clone.innerHTML = node.innerHTML;
        document.head.appendChild(clone);
    }

    handleStyleTag(node: HTMLStyleElement){
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
            noParse: true,
            forceVisible: ['template'],
            virtualProps: [],
            intro: 'intro'
        }
    },
    complexPropDefaults:{
        controller : BeActiveController
    }
});

register(ifWantsToBe, upgrade, tagName);