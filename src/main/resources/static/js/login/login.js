import {pageRouter} from '../module/router';
import {getDeviceInfo} from '../module/device';
import {getApi, setApi} from '../module/api';
import {callApi, callApiWithoutToken} from '../module/async';

// 변수설정
const $loginId = $('#loginId'); //사용자아이디
const $userPw = $('#userPw'); //사용자비밀번호
const $loginDevice = $('#loginDevice'); //사용자디바이스
const $deviceBrowser = $('#deviceBrowser'); //사용자접속브라우저
const $idSaveCheck = $('#idSaveCheck'); //아이디 기억하기
let apiDomain = '/'; //api호출 도메인

/**
 *  certification : 인증키발급
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

    const url = '/api/certification';
    const type = 'POST';
    const params = {
        loginId: $loginId.val(),
        userPw: $userPw.val(),
        authRole: 'WEB',
    };

    callApiWithoutToken(
        url,
        type,
        params,
        certificationSuccess,
        certificationError
    );

    setRememberLoginId();
};

/**
 *  certificationSuccess : certification successCallback
 *  : accessToken을 localStorage에 저장하고 로그인
 */
const certificationSuccess = result => {
    const resultCode = result.header.resultCode;
    const accessToken = result.header.accessToken;

    if (resultCode === 'ok') {
        $('#msg').html('');
        localStorage.setItem('accessToken', accessToken);
        login();
    }
};

/**
 *  certificationError : certification errorCallback
 */
const certificationError = response => {
    $('#msg').html(response.message);
};

/**
 *  setRememberLoginId
 *  : 아이디 기억하기 :로컬스토리지에 저장
 */
const setRememberLoginId = () => {
    const idSaveCheck = document.getElementById('idSaveCheck').checked;
    if (idSaveCheck) {
        localStorage.setItem('rememberLoginId', $loginId.val());
        localStorage.setItem('idSaveCheck', 'Y');
    } else {
        localStorage.removeItem('rememberLoginId');
        localStorage.setItem('idSaveCheck', 'N');
    }
};

/**
 *  getRememberLoginId
 *  : 아이디 기억하기 :로컬스토리지에 가져오기
 */
const getRememberLoginId = () => {
    if (localStorage.getItem('idSaveCheck') === 'Y') {
        const rememberLoginId = localStorage.getItem('rememberLoginId');
        $idSaveCheck.prop('checked', true);
        $loginId.val(rememberLoginId);
    } else {
        $idSaveCheck.prop('checked', false);
    }
};

/**
 *  login : 로그인
 */
const login = () => {
    const url = '/api/login';
    const type = 'POST';

    const params = {
        loginId: $loginId.val(),
        userPw: $userPw.val(),
        loginDevice: $loginDevice.val(),
        deviceBrowser: $deviceBrowser.val(),
        authRole: 'WEB',
    };

    callApi(url, type, params, loginSuccess, loginError);
};

/**
 *  loginSuccess : login successCallback
 *  : 비밀번호 초기화가 필요한 경우 비밀번호변경 페이지 이동, 로그인 성공시 메인페이지 이동
 */
const loginSuccess = result => {
    const resultCode = result.header.resultCode;
    const message = result.header.message;

    if (resultCode === 'ok') {
        pageRouter('/page/main');
    } else if (resultCode === 'pwchange') {
        alert('비밀번호 초기화가 필요합니다. 비밀번호 변경화면으로 이동합니다');
        pageRouter('/page/pwChange/'+$loginId.val());
    } else if (resultCode === 'fail') {
        $('#msg').html(message);
    }
};

/**
 *  loginError : login errorCallback
 */
const loginError = response => {
    console.log(response);
};

/**
 *  storageInit
 *  : 세션스토리지 초기화, 로컬스토리지 초기화
 */
const storageInit = () => {
    sessionStorage.clear();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('apiUrl');
};

/**
 *  setDeviceInfo
 *  : 디바이스정보 세팅
 */
const setDeviceInfo = () => {
    let deviceInfo = getDeviceInfo();
    $loginDevice.val(deviceInfo.device);
    $deviceBrowser.val(deviceInfo.browser);
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

    //아이디 기억하기
    getRememberLoginId();
});
