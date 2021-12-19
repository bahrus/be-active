import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeActiveController {
    intro(proxy, target, beDecorProps) {
        const clone = target.content.cloneNode(true);
        const head = document.head;
        const toBeCopied = [];
        for (const node of clone.children) {
            if (node.id && self[node.id])
                continue;
            toBeCopied.push(node);
        }
        while (toBeCopied.length > 0) {
            const node = toBeCopied.pop();
            head.appendChild(node);
        }
        target.remove();
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
