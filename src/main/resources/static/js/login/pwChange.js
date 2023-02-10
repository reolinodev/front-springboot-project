import {pageRouter} from '../module/router';
import {getApi} from '../module/api';

let apiDomain = getApi();
const $loginId = $('#loginId');
const $userPw = $('#userPw');
const $userPwRe = $('#userPwRe');

/**
 *  pwChangeProc : 회원가입 실행
 */
const pwChangeProc = () => {
    let msg = '';

    if ($loginId.val() === '') {
        msg = '아이디를 입력하세요.';
        $('#msg').html(msg);
        $('#loginId').focus();
        return;
    } else if ($userPw.val() === '') {
        msg = '비밀번호를 입력하세요.';
        $('#msg').html(msg);
        $('#userPw').focus();
        return;
    } else if ($userPwRe.val() === '') {
        msg = '비밀번호를 한번 더 입력하세요..';
        $('#msg').html(msg);
        $('#userPwRe').focus();
        return;
    } else if ($userPw.val() !== $userPwRe.val()) {
        msg = '비밀번호가 일치하지 않습니다.';
        $('#msg').html(msg);
        $('#userPwRe').focus();
        return;
    }

    const param = {
        login_id: $loginId.val(),
        user_pw: $userPw.val(),
    };

    const accessToken = localStorage.getItem('accessToken');

    $.ajax({
        url: apiDomain + '/api/user/user-pw',
        type: 'PUT',
        data: JSON.stringify(param),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', accessToken);
        },
    }).then(
        data => {
            if (data.header.result_code === 'ok') {
                alert(data.header.message);
                login();
            } else {
                $('#msg').html(data.header.message);
            }
        },
        (request, status, error) => {
            if (request.status === 500) {
                console.log(
                    `code:${request.status}\n` +
                        `message:${request.responseText}\n` +
                        `error:${error}`
                );
            } else if (request.status === 400) {
                const {errorList} = request.responseJSON;
                if (errorList !== undefined) {
                    if (errorList.lengh !== 0) {
                        const {message} = errorList[0];
                        $('#msg').html(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#msg').html(data.message);
                }
            }
        }
    );
};

/**
 *  login : 로그인 화면 이동
 */
const login = () => {
    pageRouter('/login');
};

$(document).ready(() => {
    // 패스워드 변경 이벤트
    $('#pwChangeBtn').click(() => {
        pwChangeProc();
    });

    // 돌아가기 이벤트
    $('#returnBtn').click(() => {
        login();
    });
});
