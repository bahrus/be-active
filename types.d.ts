import {BeDecoratedProps} from 'be-decorated/types';

export interface BeActiveVirtualProps{
    baseCDN: string;
    CDNpostFix: string;
    noCrossOrigin: boolean;
    //baseCDNRef:  string;
    supportLazy: boolean;
    isPlugin: boolean;
}

export interface BeActiveProps extends BeActiveVirtualProps{
    proxy: HTMLTemplateElement & BeActiveVirtualProps;
}

export interface BeActiveActions{
    //intro(proxy: HTMLTemplateElement & BeActiveVirtualProps, target: HTMLTemplateElement, beDecorProps: BeDecoratedProps): void;

    onCDN: (self: BeActiveActions & BeActiveProps) => void;
}