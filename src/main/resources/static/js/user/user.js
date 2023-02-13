import {setCodeSelBox} from '../module/component';
import Page, {setPagination} from '../module/pagination';
import {serializeFormJson} from '../module/json';
import {setBasicGrid, setGridClickEvent} from '../module/grid';
import {checkKr} from '../module/validation';
import {mainViewTokenInvalidate, setAccessToken} from '../module/router';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {getApi} from '../module/api';

const apiDomain = getApi();
let page = new Page(1, false, 10, 0);
let grid;
let pagination;

const pageInit = () => {
    page = new Page(1, false, Number($('#pagePer').val()), 0);
};

let writeCompArr = [];
let editCompArr = [];

/**
 * search : 조회
 */
const search = () => {
    spinnerShow();

    const params = serializeFormJson('userViewFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;

    const accessToken = localStorage.getItem('accessToken');

    $.ajax({
        url: `${apiDomain}/api/user/`,
        type: 'POST',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', accessToken);
        },
        success(result) {
            const gridData = result.data;
            page.totalCount = result.total;
            grid.resetData(gridData);

            setGridClickEvent(grid, 'login_id', 'user_id', userEdit);

            if (page.pageInit === false) {
                pagination.reset(result.total);
                page.pageInit = true;
            }

            spinnerHide();
        },
        error(request, status, error) {
            console.log(
                `code:${request.status}\n` +
                    `message:${request.responseText}\n` +
                    `error:${error}`
            );

            if (request.status === 401) {
                setAccessToken(request.responseJSON);
                search();
            } else if (request.status === 403) {
                mainViewTokenInvalidate();
            }

            spinnerHide();
        },
    });
};

/**
 * setGridLayout : 그리드 구성
 */
const setGridLayout = () => {
    // 헤더 생성
    const columns = [
        {header: 'No', name: 'rnum', width: 50, align: 'center'},
        {
            header: 'SEQ',
            name: 'user_id',
            width: 100,
            align: 'center',
            hidden: true,
        },
        {
            header: '아이디',
            name: 'login_id',
            align: 'center',
            renderer: {
                styles: {
                    color: '#0863c8',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                },
            },
        },
        {header: '이름', name: 'user_nm', align: 'center'},
        {header: '휴대폰번호', name: 'tel_no', align: 'center'},
        {header: '최근접속시간', name: 'last_login_at', align: 'center'},
        {header: '사용여부', name: 'use_yn_nm', width: 150, align: 'center'},
    ];
    // 데이터
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

/**
 * pagingCallback : 페이징 콜백
 */
const pagingCallback = returnPage => {
    page.currentPage = returnPage;
    search();
};

/**
 * initUserWrite : 등록화면의 값 초기화
 */
const initUserWrite = () => {
    $('#writeLoginId').val('');
    $('#writeUserNm').val('');
    $('#writeTelNo').val('');
    $('#writeMsg').html('');
};

/**
 *  save : 사용자 등록
 */
const save = () => {
    let msg = '';

    if ($('#writeLoginId').val() === '') {
        msg = '아이디를 입력하세요.';
        $('#writeMsg').html(msg);
        $('#writeLoginId').focus();
        return;
    }

    if (checkKr($('#writeLoginId').val())) {
        msg = '아이디는 한글을 사용할수 없습니다.';
        $('#writeMsg').html(msg);
        $('#writeLoginId').focus();
        return;
    }
    if ($('#writeUserNm').val() === '') {
        msg = '이름을 입력하세요.';
        $('#writeMsg').html(msg);
        $('#writeUserNm').focus();
        return;
    }

    spinnerShow();

    const param = {
        login_id: $('#writeLoginId').val(),
        user_nm: $('#writeUserNm').val(),
        user_pw: $('#writeLoginId').val(),
        tel_no: $('#writeTelNo').val(),
    };

    const accessToken = localStorage.getItem('accessToken');

    $.ajax({
        url: `${apiDomain}/api/user`,
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
                search();
                closeModal();
            } else {
                $('#writeMsg').html(data.header.message);
            }

            spinnerHide();
        },
        (request, status, error) => {
            if (request.status === 500) {
                console.log(
                    `code:${request.status}\n` +
                        `message:${request.responseText}\n` +
                        `error:${error}`
                );
            } else if (request.status === 400) {
                const errorList = request.responseJSON.error_list;

                if (errorList !== undefined) {
                    if (errorList.length !== 0) {
                        const message = errorList[0].message;
                        $('#writeMsg').html(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#writeMsg').html(data.message);
                }
            } else if (request.status === 401) {
                setAccessToken(request.responseJSON);
                save();
            } else if (request.status === 403) {
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

const $editLoginId = $('#editLoginId');
const $editUserId = $('#editUserId');
const $editUserNm = $('#editUserNm');
const $editCompGrCd = $('#editCompGrCd');
const $editUseYn = $('#editUseYn');

/**
 * userEdit : 사용자 수정 화면 호출
 */
const userEdit = userId => {
    const accessToken = localStorage.getItem('accessToken');

    spinnerShow();

    $.ajax({
        url: `${apiDomain}/api/user/${userId}`,

        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', accessToken);
        },
        success(result) {
            setEditData(result.data);
            spinnerHide();
        },
        error(request, status, error) {
            console.log(
                `code:${request.status}\n` +
                    `message:${request.responseText}\n` +
                    `error:${error}`
            );

            if (request.status === 401) {
                setAccessToken(request.responseJSON);
                userEdit(userId);
            } else if (request.status === 403) {
                mainViewTokenInvalidate();
            }

            spinnerHide();
        },
    });
};

/**
 * setEditData : 에디트 데이터 셋
 */
const setEditData = data => {
    $('#editLoginId').val(data.login_id);
    $('#editUserId').val(data.user_id);
    $('#editTelno').val(data.tel_no);
    $('#editPwInitYn').val(data.pw_init_yn);
    $('#editUserNm').val(data.user_nm);
    $('#editPwFailCnt').val(data.pw_fail_cnt);
    $('#editLastLoginAt').val(data.last_login_at);

    setCodeSelBox('editUseYn', 'USE_YN', '', data.use_yn);

    window.$('#userEdit').modal('show');
};

/**
 *  update : 사용자 수정
 */
const update = () => {
    spinnerShow();

    const accessToken = localStorage.getItem('accessToken');

    const param = {
        user_nm: $('#editUserNm').val(),
        tel_no: $('#editTelno').val(),
        use_yn: $('#editUseYn').val(),
    };

    $.ajax({
        url: `${apiDomain}/api/user/${$('#editUserId').val()}`,
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
                search();
                closeModal();
            } else {
                $('#editMsg').html(data.header.message);
            }

            spinnerHide();
        },
        (request, status, error) => {
            if (request.status === 500) {
                console.log(
                    `code:${request.status}\n` +
                        `message:${request.responseText}\n` +
                        `error:${error}`
                );
            } else if (request.status === 400) {
                const errorList = request.responseJSON.error_list;

                if (errorList !== undefined) {
                    if (errorList.length !== 0) {
                        const message = errorList[0].message;
                        $('#editMsg').html(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#editMsg').html(data.message);
                }
            } else if (request.status === 401) {
                setAccessToken(request.responseJSON);
                save();
            } else if (request.status === 403) {
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

/**
 *  lockClear : 패스워드 잠금 해제
 */
const lockClear = () => {
    spinnerShow();

    const accessToken = localStorage.getItem('accessToken');

    const param = {
        login_id: $('#editLoginId').val(),
        user_id: $('#editUserId').val(),
    };

    $.ajax({
        url: `${apiDomain}/api/user/pw-fail-cnt/${$('#editUserId').val()}`,
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
            } else {
                $('#editMsg').html(data.header.message);
            }

            spinnerHide();
        },
        (request, status, error) => {
            if (request.status === 500) {
                console.log(
                    `code:${request.status}\n` +
                        `message:${request.responseText}\n` +
                        `error:${error}`
                );
            } else if (request.status === 400) {
                const errorList = request.responseJSON.error_list;

                if (errorList !== undefined) {
                    if (errorList.length !== 0) {
                        const message = errorList[0].message;
                        $('#editMsg').html(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#editMsg').html(data.message);
                }
            } else if (request.status === 401) {
                setAccessToken(request.responseJSON);
                save();
            } else if (request.status === 403) {
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

/**
 *  pwInit : 비밀번호 초기화
 */
const pwInit = () => {
    const accessToken = localStorage.getItem('accessToken');

    const param = {
        login_id: $('#editLoginId').val(),
        user_id: $('#editUserId').val(),
        pw_init_yn: 'N',
    };

    spinnerShow();

    $.ajax({
        url: `${apiDomain}/api/user/user-pw`,
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
            } else {
                $('#editMsg').html(data.header.message);
            }

            spinnerHide();
        },
        (request, status, error) => {
            if (request.status === 500) {
                console.log(
                    `code:${request.status}\n` +
                        `message:${request.responseText}\n` +
                        `error:${error}`
                );
            } else if (request.status === 400) {
                const errorList = request.responseJSON.error_list;

                if (errorList !== undefined) {
                    if (errorList.length !== 0) {
                        const message = errorList[0].message;
                        $('#editMsg').html(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#editMsg').html(data.message);
                }
            } else if (request.status === 401) {
                setAccessToken(request.responseJSON);
                save();
            } else if (request.status === 403) {
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

/**
 * closeModal : 모달 닫기
 */
const closeModal = () => {
    window.$('#userWrite').modal('hide');
    window.$('#userEdit').modal('hide');
};

$(document).ready(() => {
    setCodeSelBox('viewUseYn', 'USE_YN', 'ALL', '');

    // 그리드 세팅
    grid = setGridLayout();

    // 페이징 세팅
    pagination = setPagination(page, pagingCallback);

    // 검색버튼
    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    // 등록버튼 클릭시 모달을 초기화한다.
    $('#writeBtn').click(() => {
        initUserWrite();
    });

    // 사용자를 등록한다.
    $('#saveBtn').click(() => {
        save();
    });

    // 사용자를 수정한다.
    $('#updateBtn').click(() => {
        update();
    });

    //  잠금해제 한다.
    $('#lockClearBtn').click(() => {
        lockClear();
    });

    //  비밀번호 초기화 한다.
    $('#pwInitBtn').click(() => {
        pwInit();
    });

    const userNm = document.getElementById('userNm');
    const loginId = document.getElementById('loginId');

    userNm.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });

    loginId.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });

    search();
});
