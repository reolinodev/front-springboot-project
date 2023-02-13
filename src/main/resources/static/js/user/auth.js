import {setCodeSelBox} from '../module/component';
import Page, {setPagination} from '../module/pagination';
import {serializeFormJson} from '../module/json';
import {setBasicGrid, setGridClickEvent} from '../module/grid';
import {checkKr} from '../module/validation';
import {mainViewTokenInvalidate, setAccessToken} from '../module/router';
import {spinnerHide, spinnerShow} from '../module/spinner';

let page = new Page(1, false, 10, 0);
let grid;
let pagination;

const pageInit = () => {
    page = new Page(1, false, Number($('#pagePer').val()), 0);
};

/**
 * search : 조회
 */
const search = () => {
    spinnerShow();

    const params = serializeFormJson('authViewFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;

    const accessToken = window.localStorage.getItem('accessToken');

    $.ajax({
        url: '/api/auth/',
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

            setGridClickEvent(grid, 'auth_cd', 'auth_idntf_key', authEdit);

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
            name: 'auth_idntf_key',
            width: 100,
            align: 'center',
            hidden: true,
        },
        {
            header: '권한코드',
            name: 'auth_cd',
            align: 'center',
            renderer: {
                styles: {
                    color: '#0863c8',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                },
            },
        },
        {header: '권한명', name: 'auth_nm', align: 'center'},
        {header: '순서', name: 'ord', align: 'center'},
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

const $writeAuthNm = $('#writeAuthNm');
const $writeAuthCd = $('#writeAuthCd');
const $writeOrd = $('#writeOrd');
const $writeMemo = $('#writeMemo');

/**
 * initAuthMngWrite : 등록화면의 값 초기화
 */
const initAuthMngWrite = () => {
    $writeAuthNm.val('');
    $writeAuthCd.val('');
    $writeOrd.val('');
    $writeMemo.val('');
    $('#writeMsg').html('');
};

/**
 *  insertProc : 권한 등록
 */
const insertProc = () => {
    let msg = '';

    if (checkKr($writeAuthCd.val())) {
        msg = '값을 한글로 입력할 수 없습니다.';
        $('#writeMsg').html(msg);
        $writeAuthCd.focus();
        return;
    }

    spinnerShow();

    const param = {
        auth_nm: $writeAuthNm.val(),
        auth_cd: $writeAuthCd.val(),
        ord: $writeOrd.val(),
        memo: $writeMemo.val(),
    };

    const accessToken = window.localStorage.getItem('accessToken');

    $.ajax({
        url: '/api/auth/',
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
                const {errorList} = request.responseJSON;
                if (errorList !== undefined) {
                    if (errorList.lengh !== 0) {
                        const {message} = errorList[0];
                        $('#writeMsg').html(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#writeMsg').html(data.message);
                }
            } else if (request.status === 401) {
                setAccessToken(request.responseJSON);
                insertProc();
            } else if (request.status === 403) {
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

const $editAuthIdntfKey = $('#editAuthIdntfKey');
const $editAuthNm = $('#editAuthNm');
const $editAuthCd = $('#editAuthCd');
const $editOrd = $('#editOrd');
const $editMemo = $('#editMemo');
const $editUseYn = $('#editUseYn');

/**
 * authEdit : 권한 수정 화면 호출
 */
const authEdit = authIdntfKey => {
    spinnerShow();

    const accessToken = window.localStorage.getItem('accessToken');

    $.ajax({
        url: `/api/auth/${authIdntfKey}`,
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
                authEdit(authIdntfKey);
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
    $editAuthIdntfKey.val(data.auth_idntf_key);
    $editAuthNm.val(data.auth_nm);
    $editAuthCd.val(data.auth_cd);
    $editOrd.val(data.ord);
    $editMemo.val(data.memo);

    setCodeSelBox('editUseYn', 'USE_YN', '', data.use_yn);

    window.$('#authEdit').modal('show');
};

/**
 *  editProc : 권한 수정
 */
const editProc = () => {
    spinnerShow();

    const param = {
        auth_idntf_key: $editAuthIdntfKey.val(),
        auth_nm: $editAuthNm.val(),
        ord: $editOrd.val(),
        memo: $editMemo.val(),
        use_yn: $editUseYn.val(),
    };

    const accessToken = window.localStorage.getItem('accessToken');

    $.ajax({
        url: `/api/auth/${$editAuthIdntfKey.val()}`,
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
                const {errorList} = request.responseJSON;
                if (errorList !== undefined) {
                    if (errorList.lengh !== 0) {
                        const {message} = errorList[0];
                        $('#editMsg').html(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#editMsg').html(data.message);
                }
            } else if (request.status === 401) {
                setAccessToken(request.responseJSON);
                editProc();
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
    window.$('#authWrite').modal('hide');
    window.$('#authEdit').modal('hide');
};

$(document).ready(() => {
    // 셀렉트 박스(공통코드) : 사용구분 => USE_YN
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
        initAuthMngWrite();

        window.$('#authWrite').modal('show');
    });

    // 권한을 등록한다.
    $('#insertBtn').click(() => {
        insertProc();
    });

    // 권한을 수정한다.
    $('#editBtn').click(() => {
        editProc();
    });

    const searchStrInput = document.getElementById('searchStr');

    searchStrInput.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });

    search();
});
