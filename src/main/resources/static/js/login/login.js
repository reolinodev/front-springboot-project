import {pageRouter} from '../module/router';
import {getCookie, setCookie, deleteCookie} from '../module/cookie';
import {getDeviceInfo} from '../module/device';
import {getApi, setApi} from '../module/api';

const $loginId = $('#loginId');
const $userPw = $('#userPw');
let apiDomain = '/';

/**
 *  login : 로그인 실행
 */
const certification = () => {
    if ($loginId.val() === '') {
        $('#msg').html('아이디를 입력하세요.');
        $loginId.focus();
        return;
    }

    if ($userPw.val() === '') {
        $('#msg').html('비밀번호를 입력하세요.');
        $userPw.focus();
        return;
    }

    const params = {
        login_id: $loginId.val(),
        user_pw: $userPw.val(),
    };

    $.ajax({
        url: apiDomain + '/api/certification',
        type: 'POST',
        data: JSON.stringify(params),
        headers: {'Content-Type': 'application/json'},
        success(result) {
            console.log('result', result);
            const resultCode = result.header.result_code;
            const accessToken = result.header.access_token;

            if (resultCode === 'ok') {
                $('#msg').html('');
                localStorage.setItem('accessToken', accessToken);
                login();
            }
        },
        error(request, status, error) {
            console.log(
                `code:${request.status}\nmessage:${request.responseText}\nerror:${error}`
            );

            $('#msg').html(request.responseJSON.header.message);
        },
    });

    const idSaveCheck = document.getElementById('idSaveCheck').checked;
    if (idSaveCheck) {
        setCookie('loginId', $loginId.val(), 30);
        setCookie('idSaveCheck', 'Y', 30);
    } else {
        deleteCookie('loginId');
        setCookie('idSaveCheck', 'N', 30);
    }
};

const login = () => {
    const accessToken = localStorage.getItem('accessToken');

    const params = {
        login_id: $loginId.val(),
        user_pw: $userPw.val(),
        login_device: $('#loginDevice').val(),
        device_browser: $('#deviceBrowser').val(),
    };

    $.ajax({
        url: apiDomain + '/api/login',
        type: 'POST',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', accessToken);
        },
        success(result) {
            const resultCode = result.header.result_code;
            const message = result.header.message;

            if (resultCode === 'ok') {
                pageRouter('/page/main');
            } else if (resultCode === 'pwchange') {
                alert(
                    '비밀번호 초기화가 필요합니다. 비밀번호 변경화면으로 이동합니다'
                );
                pageRouter('/page/pwChange');
            } else if (resultCode === 'fail') {
                $('#msg').html(message);
            }
        },
        error(request, status, error) {
            console.log(
                `code:${request.status}\nmessage:${request.responseText}\nerror:${error}`
            );
        },
    });
};

const storageInit = () => {
    sessionStorage.clear();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('apiUrl');
};

const setDeviceInfo = () => {
    let deviceInfo = getDeviceInfo();
    $('#loginDevice').val(deviceInfo.device);
    $('#deviceBrowser').val(deviceInfo.browser);
};

$(document).ready(() => {
    // 엔터 입력시 로그인 처리
    $(window).on('keydown', e => {
        if (e.keyCode === 13) {
            certification();
        }
    });

    // 로그인 이벤트
    $('#loginBtn').click(() => {
        certification();
    });

    //로컬스토리지, 세션스토리지 초기화
    storageInit();

    //디바이스 세팅
    setDeviceInfo();

    //도메인 세팅
    setApi($('#apiUrl').val());
    apiDomain = getApi();

    // // 아이디 기억하기(쿠키 불러오기)
    const idSaveCheck = document.getElementById('idSaveCheck');

    if (getCookie('idSaveCheck') === 'Y') {
        idSaveCheck.checked = true;
        $loginId.val(getCookie('loginId'));
    } else {
        idSaveCheck.checked = false;
    }
});
