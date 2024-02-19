const enforceDev = true;
const devEnv = 'https://beta.portal.spatial.nsw.gov.au';
const testEnv = 'https://alpha.portal.spatial.nsw.gov.au';
//const prodEnv = 'https://portal.spatial.nsw.gov.au';

type PortalInfo = { url: string };

export type Config = {
    portalInfo: PortalInfo;
};

export const getConfig = (): Config => {
    const env = process.env.NODE_ENV;
    const isDev = enforceDev ? true : env === 'development';
    let url = `${devEnv}/portal`;
    if (!isDev) {
        url = `${testEnv}/portal`;
    }
    return {
        portalInfo: {
            url: url
        }
    };
};
