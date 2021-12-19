import {BeDecoratedProps, define} from 'be-decorated/be-decorated.js';
import {BeActiveActions, BeActiveVirtualProps, BeActiveProps} from './types';
import {register} from 'be-hive/register.js';

const test = () => import('be-hive/be-hive.js');
console.log(test);
export class BeActiveController implements BeActiveActions{
    intro(proxy: HTMLTemplateElement & BeActiveVirtualProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps){
        const clone = target.content.cloneNode(true) as DocumentFragment;
        this.cloneTemplate(clone, 'script', ['src', 'type', 'nomodule', 'id']);
        this.cloneTemplate(clone, 'style', []);
        target.remove();
    }

    copyAttrs(src: HTMLScriptElement, dest: Element, attrs: string[]){
        attrs.forEach(attr =>{
            if(!src.hasAttribute(attr)) return;
            const attrVal = src.getAttribute(attr)!;
            dest.setAttribute(attr, attrVal);
        })
    }

    cloneTemplate(clonedNode: DocumentFragment, tagName: string, copyAttrs: string[]){ 
        Array.from(clonedNode.querySelectorAll(tagName)).forEach(node =>{
            const {id} = node;
            if(id && (<any>self)[id]) return;
            const clone = document.createElement(tagName) as HTMLScriptElement;
            this.copyAttrs(node as HTMLScriptElement, clone, copyAttrs);
            clone.innerHTML = node.innerHTML;
            document.head.appendChild(clone);
        })
    
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
            virtualProps: [],
            intro: 'intro'
        }
    },
    complexPropDefaults:{
        controller : BeActiveController
    }
});

register(ifWantsToBe, upgrade, tagName);