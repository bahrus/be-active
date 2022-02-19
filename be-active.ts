import {BeDecoratedProps, define} from 'be-decorated/be-decorated.js';
import {BeActiveActions, BeActiveVirtualProps, BeActiveProps} from './types';
import {register} from 'be-hive/register.js';

export class BeActiveController implements BeActiveActions{
    async onCDN({}){
        const {onCDN} = await(import('./common.js'));
        onCDN(this);
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