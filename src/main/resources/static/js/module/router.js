let tokenAlert = true;
/**
 *  pageRouter : 페이지 이동
 *  url : 이동 url
 *  html form-frm, input-url 있어야 함
 */
export function pageRouter(url) {
    $('#url').val(url);
    const $frm = $('#frm');
    $frm.attr('action', '/');
    $frm.attr('method', 'post');
    $frm.submit();
}

/**
 *  mainViewTokenInvalidate : 페이지 이동
 *  html form-frm, input-url 있어야 함
 */
export function mainViewTokenInvalidate() {
    if (tokenAlert) {
        tokenAlert = false;
        alert('인증토큰이 만료되었습니다. 로그인화면으로 이동합니다.');
        sessionStorage.clear();
        const $frm = parent.$('#frm');
        $frm.attr('action', '/login');
        $frm.attr('method', 'get');
        $frm.submit();
    }
}

/**
 *  framePageRouter : iframe내 페이지 이동 및 상단 네비게이션 적용
 */
export function framePageRouter(url, parentMenuName, childMenuName) {
    $('#menuTitle').html(childMenuName);
    $('#parentMenuNm').html(parentMenuName);
    $('#childMenuNm').html(childMenuName);
    $('#contentFrame').attr('src', url);

    sessionStorage.setItem('url', url);
    sessionStorage.setItem('parentMenuName', parentMenuName);
    sessionStorage.setItem('childMenuName', childMenuName);
}

/**
 *  mainViewTokenInvalidate : 페이지 이동
 *  html form-frm, input-url 있어야 함
 */
export function setAccessToken(responseJson) {
    const newToken = responseJson.new_token;
    window.localStorage.setItem('accessToken', newToken);
}
