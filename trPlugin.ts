import {RenderContext, TransformPluginSettings} from 'trans-render/lib/types';
import {register} from 'trans-render/lib/pluginMgr.js';
import {BeActiveActions, BeActiveProps} from './types';
import {onCDN} from './common.js';

export const trPlugin: TransformPluginSettings = {
    selector:  'beActiveAttribs',
    processor: ({target, val, attrib, host}: RenderContext) => {
        const params = {
            baseCDN: (<any>self)['be-active/baseCDN']?.href || 'https://esm.run/',
            supportLazy: false,
            CDNpostFix: '',
            noCrossOrigin: false,
            isPlugin: true,
        }  as BeActiveProps & BeActiveActions;
        if(val!.startsWith('{')){
            const overrides = JSON.parse(val!);
            Object.assign(params, overrides);
        }
        params.proxy = target as HTMLTemplateElement & BeActiveProps;
        onCDN(params as BeActiveProps & BeActiveActions);
    }
}

register(trPlugin);