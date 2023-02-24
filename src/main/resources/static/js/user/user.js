import {setCodeSelBox} from '../module/component';
import Page, {setPagination} from '../module/pagination';
import {serializeFormJson} from '../module/json';
import {setBasicGrid, setGridClickEvent} from '../module/grid';
import {checkKr} from '../module/validation';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi, callApiWithoutBody} from '../module/async';

//변수설정
const $writeLoginId = $('#writeLoginId'); //사용자등록 - 로그인아이디
const $writeUserNm = $('#writeUserNm'); //사용자등록 - 이름
const $writeTelNo = $('#writeTelNo'); //사용자등록 - 휴대폰번호
const $writeMsg = $('#writeMsg'); //사용자등록 - 메시지

const $editLoginId = $('#editLoginId'); //사용자수정 - 로그인아이디
const $editUserId = $('#editUserId'); //사용자수정 - 아이디
const $editTelno = $('#editTelno'); //사용자수정 - 휴대폰번호
const $editPwInitYn = $('#editPwInitYn'); //사용자수정 - 초기화여부
const $editUserNm = $('#editUserNm'); //사용자수정 - 이름
const $editPwFailCnt = $('#editPwFailCnt'); //사용자수정 - 패스워드실패횟수
const $editLastLoginAt = $('#editLastLoginAt'); //사용자수정 - 최근로그인일시
const $editUseYn = $('#editUseYn'); //사용자수정 - 사용여부
const $editMsg = $('#editMsg'); //사용자수정 - 메시지

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

    const url = '/api/user';
    const type = 'POST';
    const params = serializeFormJson('userViewFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;

    callApi(url, type, params, searchSuccess, searchError);
};

/**
 *  searchSuccess : search successCallback
 *  :
 */
const searchSuccess = result => {
    const gridData = result.data;
    page.totalCount = result.total;
    grid.resetData(gridData);

    if (page.pageInit === false) {
        setGridClickEvent(grid, 'login_id', 'user_id', getUserData);
        pagination.reset(result.total);
        page.pageInit = true;
    }

    spinnerHide();
};

/**
 *  searchError : search errorCallback
 */
const searchError = response => {
    spinnerHide();
    console.log(response);
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
 * initWrite : 등록화면의 값 초기화
 */
const initWrite = () => {
    $writeLoginId.val('');
    $writeUserNm.val('');
    $writeTelNo.val('');
    $writeMsg.val('');
};

/**
 *  save : 사용자 등록
 */
const save = () => {
    let msg = '';

    if ($writeLoginId.val() === '') {
        msg = '아이디를 입력하세요.';
        $('#writeMsg').html(msg);
        $('#writeLoginId').focus();
        return;
    }

    if (checkKr($writeLoginId.val())) {
        msg = '아이디는 한글을 사용할수 없습니다.';
        $('#writeMsg').html(msg);
        $('#writeLoginId').focus();
        return;
    }
    if ($writeUserNm.val() === '') {
        msg = '이름을 입력하세요.';
        $('#writeMsg').html(msg);
        $('#writeUserNm').focus();
        return;
    }

    spinnerShow();

    const url = '/api/user';
    const type = 'PUT';
    const params = {
        login_id: $writeLoginId.val(),
        user_nm: $writeUserNm.val(),
        tel_no: $writeTelNo.val(),
    };

    callApi(url, type, params, saveSuccess, saveError);
};

/**
 *  saveSuccess : save successCallback
 */
const saveSuccess = result => {
    if (result.header.result_code === 'ok') {
        alert(result.header.message);
        search();
        closeModal();
    }

    spinnerHide();
};

/**
 *  saveError : save errorCallback
 */
const saveError = response => {
    $writeMsg.html(response.message);
    spinnerHide();
};

/**
 * getUserData : 사용자 수정 화면 호출
 */
const getUserData = userId => {
    spinnerShow();

    callApiWithoutBody(
        `/api/user/${userId}`,
        'GET',
        getUserDataSuccess,
        getUserDataError
    );
};

/**
 *  getUserDataSuccess : getUserData successCallback
 */
const getUserDataSuccess = result => {
    spinnerHide();

    setEditData(result.data);
};

/**
 *  getUserDataError : getUserData errorCallback
 */
const getUserDataError = response => {
    spinnerHide();

    console.log(response);
};

/**
 * setEditData : 에디트 데이터 셋
 */
const setEditData = data => {
    $editLoginId.val(data.login_id);
    $editUserId.val(data.user_id);
    $editTelno.val(data.tel_no);
    $editPwInitYn.val(data.pw_init_yn);
    $editUserNm.val(data.user_nm);
    $editPwFailCnt.val(data.pw_fail_cnt);
    $editLastLoginAt.val(data.last_login_at);

    setCodeSelBox('editUseYn', 'USE_YN', '', data.use_yn);

    window.$('#userEdit').modal('show');
};

/**
 *  update : 사용자 수정
 */
const update = () => {
    spinnerShow();

    const url = `/api/user/${$editUserId.val()}`;
    const type = 'PUT';
    const params = {
        user_nm: $editUserNm.val(),
        tel_no: $editTelno.val(),
        use_yn: $editUseYn.val(),
    };

    callApi(url, type, params, updateSuccess, updateError);
};

/**
 *  updateSuccess : update successCallback
 */
const updateSuccess = result => {
    if (result.header.result_code === 'ok') {
        alert(result.header.message);
        search();
        closeModal();
    } else {
        alert(result.header.message);
    }
    spinnerHide();
};

/**
 *  updateError : update errorCallback
 */
const updateError = response => {
    $editMsg.html(response.message);
    spinnerHide();
};

/**
 *  lockClear : 패스워드 잠금 해제
 */
const lockClear = () => {
    spinnerShow();

    callApiWithoutBody(
        `/api/user/pw-fail-cnt/${$editUserId.val()}`,
        'GET',
        lockClearSuccess,
        lockClearError
    );
};

/**
 *  lockClearSuccess : lockClear successCallback
 */
const lockClearSuccess = result => {
    if (result.header.result_code === 'ok') {
        alert(result.header.message);
        search();
        closeModal();
    } else {
        alert(result.header.message);
    }
    spinnerHide();
};

/**
 *  lockClearError : lockClear errorCallback
 */
const lockClearError = response => {
    console.log(response);
    spinnerHide();
};

/**
 *  pwInit : 비밀번호 초기화
 */
const pwInit = () => {
    spinnerShow();

    const url = `/api/user/user-pw`;
    const type = 'PUT';
    const params = {
        login_id: $editLoginId.val(),
        user_id: $editUserId.val(),
    };

    callApi(url, type, params, pwInitSuccess, pwInitError);
};

/**
 *  pwInitSuccess : pwInit successCallback
 */
const pwInitSuccess = result => {
    if (result.header.result_code === 'ok') {
        alert(result.header.message);
        search();
        closeModal();
    } else {
        alert(result.header.message);
    }
    spinnerHide();
};

/**
 *  pwInitError : pwInit errorCallback
 */
const pwInitError = response => {
    console.log(response);
    spinnerHide();
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
        initWrite();
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
