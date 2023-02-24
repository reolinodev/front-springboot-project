import {setCodeSelBox} from '../module/component';
import Page, {setPagination} from '../module/pagination';
import {serializeFormJson} from '../module/json';
import {setBasicGrid, setGridClickEvent} from '../module/grid';
import {checkKr} from '../module/validation';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi, callGetApi} from '../module/async';

let page = new Page(1, false, 10, 0);
let grid;
let pagination;

const $writeAuthRole = $('#writeAuthRole'); //권한등록 - 권한구분
const $writeAuthNm = $('#writeAuthNm'); //권한등록 - 권한명
const $writeAuthVal = $('#writeAuthVal'); //권한등록 - 권한코드
const $writeOrd = $('#writeOrd'); //권한등록 - 순서
const $writeMemo = $('#writeMemo'); //권한등록 - 비고
const $writeMainUrl = $('#writeMainUrl'); //권한등록 - 메인URL
const $writeMsg = $('#writeMsg'); //권한등록 - 메시지

const $editAuthRoleNm = $('#editAuthRoleNm'); //권한수정 - 권한구분
const $editAuthNm = $('#editAuthNm'); //권한수정 - 권한명
const $editAuthId = $('#editAuthId'); //권한수정 - 권한식별키
const $editAuthVal = $('#editAuthVal'); //권한수정 - 권한코드
const $editOrd = $('#editOrd'); //권한수정 - 순서
const $editUseYn = $('#editUseYn'); //권한수정 - 사용여부
const $editMemo = $('#editMemo'); //권한수정 - 비고
const $editMainUrl = $('#editMainUrl'); //권한수정 - 메인URL
const $editMsg = $('#editMsg'); //권한수정 - 메시지

const pageInit = () => {
    page = new Page(1, false, Number($('#pagePer').val()), 0);
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
            name: 'auth_id',
            width: 100,
            align: 'center',
            hidden: true,
        },
        {header: '권한구분', name: 'auth_role_nm', align: 'center'},
        {
            header: '권한코드',
            name: 'auth_val',
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
        {header: '사용여부', name: 'use_yn_nm', width: 150, align: 'center'},
    ];
    // 데이터
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

/**
 * search : 조회
 */
const search = () => {
    spinnerShow();

    const url = '/api/auth';
    const type = 'POST';
    const params = serializeFormJson('authViewFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;

    callApi(url, type, params, searchSuccess, searchError);
};

/**
 *  searchSuccess : search successCallback
 */
const searchSuccess = result => {
    spinnerHide();

    const gridData = result.data;
    page.totalCount = result.total;
    grid.resetData(gridData);

    if (page.pageInit === false) {
        setGridClickEvent(grid, 'auth_val', 'auth_id', getAuthData);
        pagination.reset(result.total);
        page.pageInit = true;
    }
};

/**
 *  searchError : search errorCallback
 */
const searchError = response => {
    spinnerHide();
    console.log(response);
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
    setCodeSelBox('writeAuthRole', 'AUTH_ROLE', '', '');
    $writeAuthNm.val('');
    $writeAuthVal.val('');
    $writeOrd.val('');
    $writeMemo.val('');
    $writeMainUrl.val('');
    $('#writeMsg').html('');
};

/**
 *  save : 권한 등록
 */
const save = () => {
    let msg = '';

    if (checkKr($writeAuthVal.val())) {
        msg = '값을 한글로 입력할 수 없습니다.';
        $('#writeMsg').html(msg);
        $writeAuthVal.focus();
        return;
    }

    spinnerShow();

    const url = '/api/auth';
    const type = 'PUT';
    const params = {
        auth_role: $writeAuthRole.val(),
        auth_nm: $writeAuthNm.val(),
        auth_val: $writeAuthVal.val(),
        ord: $writeOrd.val(),
        memo: $writeMemo.val(),
        main_url: $writeMainUrl.val(),
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
 * authEdit : 권한 수정 화면 호출
 */
const getAuthData = authId => {
    spinnerShow();

    const url = `/api/auth/${authId}`;
    callGetApi(url, getAuthDataSuccess, getAuthDataError);
};

/**
 *  getAuthDataSuccess : getAuthData successCallback
 */
const getAuthDataSuccess = result => {
    setEditData(result.data);
    spinnerHide();
};

/**
 *  getAuthDataError : getAuthData errorCallback
 */
const getAuthDataError = response => {
    console.log(response);
    spinnerHide();
};

/**
 * setEditData : 에디트 데이터 셋
 */
const setEditData = data => {
    $editAuthRoleNm.val(data.auth_role_nm);
    $editAuthId.val(data.auth_id);
    $editAuthNm.val(data.auth_nm);
    $editAuthVal.val(data.auth_val);
    $editOrd.val(data.ord);
    $editMemo.val(data.memo);
    $editMainUrl.val(data.main_url);

    setCodeSelBox('editUseYn', 'USE_YN', '', data.use_yn);

    window.$('#authEdit').modal('show');
};

/**
 *  update : 권한 수정
 */
const update = () => {
    spinnerShow();

    const url = `/api/auth/${$editAuthId.val()}`;
    const type = 'PUT';
    const params = {
        auth_nm: $editAuthNm.val(),
        ord: $editOrd.val(),
        memo: $editMemo.val(),
        use_yn: $editUseYn.val(),
        main_url: $editMainUrl.val(),
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
        $('#editMsg').html(result.header.message);
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
 * closeModal : 모달 닫기
 */
const closeModal = () => {
    window.$('#authWrite').modal('hide');
    window.$('#authEdit').modal('hide');
};

$(document).ready(() => {
    // 셀렉트 박스(공통코드) : 권한구분 => AUTH_ROLE
    setCodeSelBox('viewAuthRole', 'AUTH_ROLE', 'ALL', '');

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
        initWrite();
        window.$('#authWrite').modal('show');
    });

    // 권한을 등록한다.
    $('#saveBtn').click(() => {
        save();
    });

    // 권한을 수정한다.
    $('#updateBtn').click(() => {
        update();
    });

    const viewAuthNm = document.getElementById('viewAuthNm');
    const viewAuthVal = document.getElementById('viewAuthVal');

    viewAuthNm.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });

    viewAuthVal.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });

    search();
});
