import {RenderContext, TransformPluginSettings} from 'trans-render/lib/types';
import {DEMethods} from 'be-decorated/types';
import {register} from 'trans-render/lib/pluginMgr.js';

export const trPlugin: TransformPluginSettings = {
    selector: 'beActiveAttribs',
    ready: true,
    processor:  async ({target, val, attrib, host}: RenderContext) => {
        if(customElements.get('be-active') === undefined) return;
        const {attach} = await import('be-decorated/upgrade.js');
        const instance = document.createElement('be-active') as any as DEMethods;
        attach(target!, 'active', instance.attach.bind(instance));
    }
}

register(trPlugin);