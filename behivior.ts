import {register} from 'be-hive/register.js';
import {tagName } from './be-active.js';
import './be-active.js';

const ifWantsToBe = 'active';
const upgrade = 'template';

register(ifWantsToBe, upgrade, tagName);