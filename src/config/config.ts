import { ENV } from '../utils/constants';

const enforceDev = false;
const navigationMenuTimeout = 3; // in seconds

const Config = {
    [ENV.DEV]: {
        url: 'https://beta.portal.spatial.nsw.gov.au/portal',
        mapId: '2995f4cb2581421f8172f988c18ff4c2',
        sceneId: '49fde993776b4efeb1a791539b1f782b',
        basemapGroup2d: '1b60560a776046aebf3f64d2e8d41663', //'8a7a84efeaf147c0aedf3f29c06728bd',
        basemapGroup3d: '1b60560a776046aebf3f64d2e8d41663'
    },
    [ENV.TEST]: {
        url: 'https://alpha.portal.spatial.nsw.gov.au/portal',
        mapId: '',
        sceneId: ''
    },
    [ENV.PROD]: {
        url: 'https://portal.spatial.nsw.gov.au/portal',
        mapId: '',
        sceneId: ''
    },
    [ENV.AGOL]: {
        url: 'https://arunsebastian.maps.arcgis.com',
        mapId: '26ada7d3df0641a1ae3d39f211973329',
        sceneId: 'c618ba9c82b0472eb13c37b186e22f62'
    }
};

type PortalInfo = {
    url: string;
    mapId: string;
    sceneId: string;
    basemapGroup2d?: string;
    basemapGroup3d?: string;
};

export type PortalConfig = {
    portalInfo: PortalInfo;
};

export const getConfig = (env?: string): PortalConfig => {
    env = env ?? process.env.NODE_ENV;
    return {
        portalInfo: enforceDev ? Config[ENV.DEV] : Config[env]
    };
};

export const getWidgetConfig = (key: string) => {
    const widgetConfig = {
        navigation: {
            displayTimeOut: navigationMenuTimeout
        }
    } as any;
    return typeof key === 'string' && widgetConfig[key]
        ? widgetConfig[key]
        : widgetConfig;
};
