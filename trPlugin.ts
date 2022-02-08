import {RenderContext, TransformPluginSettings} from 'trans-render/lib/types';
import {register} from 'trans-render/lib/pluginMgr.js';

export const trPlugin: TransformPluginSettings = {
    selector:  'beActiveAttribs',
    processor: ({}: RenderContext) => {

    }
}

register(trPlugin);