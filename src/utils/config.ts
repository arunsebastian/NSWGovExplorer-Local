const enforceDev = true;
const devEnv = 'https://beta.portal.spatial.nsw.gov.au';
const testEnv = 'https://alpha.portal.spatial.nsw.gov.au';
//const prodEnv = 'https://portal.spatial.nsw.gov.au';

const startUpItemIdDev = 'df2c4ca520134b7491f826bc526b335c';
//const startUpItemIdTest = '';

type PortalInfo = { url: string; itemId: string };

export type Config = {
    portalInfo: PortalInfo;
};

export const getConfig = (): Config => {
    const env = process.env.NODE_ENV;
    const isDev = enforceDev ? true : env === 'development';
    let url = `${devEnv}/portal`;
    let itemId = startUpItemIdDev;
    if (!isDev) {
        url = `${testEnv}/portal`;
        itemId = startUpItemIdDev;
    }
    return {
        portalInfo: {
            url: url,
            itemId: itemId
        }
    };
};
