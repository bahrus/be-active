import {BeDecoratedProps, define} from 'be-decorated/be-decorated.js';
import {BeActiveActions, VirtualProps, PP} from './types';
import {register} from 'be-hive/register.js';

export class BeActiveController extends EventTarget implements BeActiveActions{
    async onCDN(pp: PP){
        const {onCDN} = await(import('./common.js'));
        onCDN(pp);
    }
}


const tagName = 'be-active';

const ifWantsToBe = 'active';

const upgrade = 'template';

define<VirtualProps & BeDecoratedProps<VirtualProps, BeActiveActions>, BeActiveActions>({
    config:{
        tagName,
        propDefaults:{
            ifWantsToBe,
            upgrade,
            forceVisible: ['template'],
            proxyPropDefaults:{
                baseCDN: (<any>self)['be-active/baseCDN']?.href || 'https://esm.run/',
                supportLazy: false,
                CDNpostFix: '',
                noCrossOrigin: false,
            },
            primaryProp: 'baseCDN',
            virtualProps: ['baseCDN', 'supportLazy', 'CDNpostFix', 'noCrossOrigin'],
        },
        actions:{
            onCDN: 'baseCDN',
        }
    },
    complexPropDefaults:{
        controller : BeActiveController
    }
});

register(ifWantsToBe, upgrade, tagName);