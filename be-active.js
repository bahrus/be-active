import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
const test = () => import('be-hive/be-hive.js');
console.log(test);
export class BeActiveController {
    intro(proxy, target, beDecorProps) {
        const clone = target.content.cloneNode(true);
        this.cloneTemplate(clone, 'script', ['src', 'type', 'nomodule', 'id']);
        this.cloneTemplate(clone, 'style', []);
        target.remove();
    }
    copyAttrs(src, dest, attrs) {
        attrs.forEach(attr => {
            if (!src.hasAttribute(attr))
                return;
            const attrVal = src.getAttribute(attr);
            dest.setAttribute(attr, attrVal);
        });
    }
    cloneTemplate(clonedNode, tagName, copyAttrs) {
        Array.from(clonedNode.querySelectorAll(tagName)).forEach(node => {
            const { id } = node;
            if (id && self[id])
                return;
            const clone = document.createElement(tagName);
            this.copyAttrs(node, clone, copyAttrs);
            clone.innerHTML = node.innerHTML;
            document.head.appendChild(clone);
        });
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
            virtualProps: [],
            intro: 'intro'
        }
    },
    complexPropDefaults: {
        controller: BeActiveController
    }
});
register(ifWantsToBe, upgrade, tagName);
