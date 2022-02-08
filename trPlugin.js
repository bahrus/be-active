import { register } from 'trans-render/lib/pluginMgr.js';
import { onCDN } from './common.js';
export const trPlugin = {
    selector: 'beActiveAttribs',
    processor: ({ target, val, attrib, host }) => {
        const params = {
            baseCDN: self['be-active/baseCDN']?.href || 'https://esm.run/',
            supportLazy: false,
            CDNpostFix: '',
            noCrossOrigin: false,
            isPlugin: true,
        };
        if (val.startsWith('{')) {
            const overrides = JSON.parse(val);
            Object.assign(params, overrides);
        }
        params.proxy = target;
        onCDN(params);
    }
};
register(trPlugin);
