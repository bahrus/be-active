import {RenderContext, TransformPluginSettings} from 'trans-render/lib/types';
import {register} from 'trans-render/lib/pluginMgr.js';
import {BeActiveActions, PP, VirtualProps, Proxy} from './types';
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
        }  as PP;
        if(val!.startsWith('{')){
            const overrides = JSON.parse(val!);
            Object.assign(params, overrides);
        }
        params.proxy = target as Proxy;
        onCDN(params as any as PP);
    }
}

register(trPlugin);