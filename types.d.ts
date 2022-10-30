import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps {
    baseCDN?: string;
    CDNpostFix?: string;
    noCrossOrigin?: boolean;
    supportLazy?: boolean;
}
export interface VirtualProps extends EndUserProps, MinimalProxy<HTMLTemplateElement>{}

export type Proxy = HTMLTemplateElement & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export type PPP = Partial<ProxyProps>;

export interface BeActiveActions{
    onCDN: (pp: PP) => Promise<PPP | void>;
}