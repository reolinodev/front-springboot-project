export function setApi(url) {
    localStorage.setItem('apiUrl', url);
}

export function getApi() {
    return localStorage.getItem('apiUrl');
}
