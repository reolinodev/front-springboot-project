export function setCookie(cookieName, value, days) {
    const exDate = new Date();
    exDate.setDate(exDate.getDate() + days);
    const cookieValue = escape(value) + ((days == null) ? '' : `; expires=${  exDate.toUTCString()}`);
    document.cookie = `${cookieName}=${cookieValue}`;
}

// eslint-disable-next-line consistent-return
export function getCookie(cookieName) {
    const cookieVal = document.cookie.split(';');

    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < cookieVal.length; i++) {
        let x = cookieVal[i].substr(0, cookieVal[i].indexOf('='));
        const y = cookieVal[i].substr(cookieVal[i].indexOf('=') + 1);
        x = x.replace(/^\s+|\s+$/g, '');
        if (x === cookieName) {
            return unescape(y);
        }
    }
}


export function deleteCookie(cookieName) {
    document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
}

