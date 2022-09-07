import { define } from 'be-decorated/be-decorated.js';
import { register } from 'be-hive/register.js';
export class BeActiveController extends EventTarget {
    async onCDN(pp) {
        const { onCDN } = await (import('./common.js'));
        onCDN(pp);
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
            proxyPropDefaults: {
                baseCDN: self['be-active/baseCDN']?.href || 'https://esm.run/',
                supportLazy: false,
                CDNpostFix: '',
                noCrossOrigin: false,
            },
            primaryProp: 'baseCDN',
            virtualProps: ['baseCDN', 'supportLazy', 'CDNpostFix', 'noCrossOrigin'],
        },
        actions: {
            onCDN: 'baseCDN',
        }
    },
    complexPropDefaults: {
        controller: BeActiveController
    }
});
register(ifWantsToBe, upgrade, tagName);
