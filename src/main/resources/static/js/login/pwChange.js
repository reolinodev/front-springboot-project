import {pageRouter} from '../module/router';
import {callApi} from '../module/async';

// 변수설정
const $userPw = $('#userPw'); //비밀번호
const $userPwRe = $('#userPwRe'); //비밀번호확인

/**
 *  update : 비밀번호 변경실행
 */
const update = () => {
    let msg = '';

    if ($userPw.val() === '') {
        msg = '비밀번호를 입력하세요.';
        $('#msg').html(msg);
        $('#userPw').focus();
        return;
    } else if ($userPwRe.val() === '') {
        msg = '비밀번호를 한번 더 입력하세요.';
        $('#msg').html(msg);
        $('#userPwRe').focus();
        return;
    } else if ($userPw.val() !== $userPwRe.val()) {
        msg = '비밀번호가 일치하지 않습니다.';
        $('#msg').html(msg);
        $('#userPwRe').focus();
        return;
    }

    const url = '/api/user/user-page/user-pw';
    const type = 'PUT';
    const params = {
        user_pw: $userPw.val(),
    };

    callApi(url, type, params, updateSuccess, updateError);
};

/**
 *  updateSuccess : update successCallback
 *  :
 */
const updateSuccess = result => {
    if (result.header.result_code === 'ok') {
        alert(result.header.message);
        back();
    } else {
        $('#msg').html(result.header.message);
    }
};

/**
 *  updateError : update errorCallback
 */
const updateError = response => {
    $('#msg').html(response.message);
};

/**
 *  back
 *  : 로그인화면으로 이동
 */
const back = () => {
    pageRouter('/login');
};

$(document).ready(() => {
    // 패스워드 변경 이벤트
    $('#updateBtn').click(() => {
        update();
    });

    // 돌아가기 이벤트
    $('#backBtn').click(() => {
        back();
    });
});
