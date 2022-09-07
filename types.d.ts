import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps {
    baseCDN?: string;
    CDNpostFix?: string;
    noCrossOrigin?: boolean;
    supportLazy?: boolean;
    isPlugin?: boolean;
}
export interface VirtualProps extends EndUserProps, MinimalProxy<HTMLTemplateElement>{}

export type Proxy = HTMLTemplateElement & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;


export interface BeActiveActions{
    onCDN: (pp: PP) => void;
}