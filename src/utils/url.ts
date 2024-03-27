const parseURL = (key: string = 'layers') => {
    const url = new URL(window.location.href);
    return url.searchParams.get(key);
};

export { parseURL };
