import {BeDecoratedProps} from 'be-decorated/types';

export interface BeActiveVirtualProps{
    baseCDN: string;
    baseCDNRef:  string;
    supportLazy: boolean;
}

export interface BeActiveProps extends BeActiveVirtualProps{
    proxy: HTMLTemplateElement & BeActiveVirtualProps;
}

export interface BeActiveActions{
    intro(proxy: HTMLTemplateElement & BeActiveVirtualProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;

    onCDN(self: this): void;
}