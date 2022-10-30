import { register } from 'trans-render/lib/pluginMgr.js';
export const trPlugin = {
    selector: 'beActiveAttribs',
    ready: true,
    processor: async ({ target, val, attrib, host }) => {
        if (customElements.get('be-active') === undefined)
            return;
        const { attach } = await import('be-decorated/upgrade.js');
        const instance = document.createElement('be-active');
        attach(target, 'active', instance.attach.bind(instance));
    }
};
register(trPlugin);
