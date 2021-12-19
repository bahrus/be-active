import {BeDecoratedProps, define} from 'be-decorated/be-decorated.js';
import {BeActiveActions, BeActiveVirtualProps, BeActiveProps} from './types';
import {register} from 'be-hive/register.js';

export class BeActiveController implements BeActiveActions{
    intro(proxy: HTMLTemplateElement & BeActiveVirtualProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps){
        const clone = target.content.cloneNode(true) as DocumentFragment;
        const head = document.head;
        const toBeCopied: Element[] = [];
        for(const node of clone.children){
            if(node.id && (<any>self)[node.id]) continue;
            toBeCopied.push(node);
        }
        while(toBeCopied.length > 0){
            const node = toBeCopied.pop()!;
            head.appendChild(node);
        }
        target.remove();
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