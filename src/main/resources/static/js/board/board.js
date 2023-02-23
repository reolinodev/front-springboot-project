import {setCodeSelBox} from '../module/component';
import Page, {setPagination} from '../module/pagination';
import {setBasicGrid, setGridClickEvent} from '../module/grid';
import {serializeFormJson} from '../module/json';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi, callGetApi} from '../module/async';

let page = new Page(1, false, 10, 0);
let grid;
let pagination;

const $writeBoardTitle = $('#writeBoardTitle');
const $writeBoardType = $('#writeBoardType');
const $writeMemo = $('#writeMemo');
const $writeMsg = $('#writeMsg');
const $writeAuthArea = $('#writeAuthArea');

const $editBoardTitle = $('#editBoardTitle');
const $editUseYn = $('#editUseYn');
const $editBoardId = $('#editBoardId');
const $editMemo = $('#editMemo');
const $editMsg = $('#editMsg');
const $editUpdatedNm = $('#editUpdatedNm');
const $editUpdatedAt = $('#editUpdatedAt');
const $editAuthArea = $('#editAuthArea');

let selectedType;
let selectedAuthList;

const pageInit = () => {
    page = new Page(1, false, Number($('#pagePer').val()), 0);
};

let writeAuthArr = [];
let editAuthArr = [];

/**
 * search : 조회
 */
const search = () => {
    spinnerShow();

    let url = `/api/board`;
    const type = 'POST';
    const params = serializeFormJson('boardViewFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;

    callApi(url, type, params, searchSuccess, searchError);
};

/**
 *  searchSuccess : search successCallback
 */
const searchSuccess = result => {
    if (result.header.result_code === 'ok') {
        const gridData = result.data;
        page.totalCount = result.total;
        grid.resetData(gridData);

        if (page.pageInit === false) {
            setGridClickEvent(grid, 'board_title', 'board_id', getBoardData);
            pagination.reset(result.total);
            page.pageInit = true;
        }
    }
    spinnerHide();
};

/**
 *  searchError : search errorCallback
 */
const searchError = response => {
    spinnerHide();
    console.log(response.message);
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
            name: 'board_id',
            width: 100,
            align: 'center',
            hidden: true,
        },
        {
            header: '게시판유형',
            name: 'board_type_nm',
            width: 150,
            align: 'center',
        },
        {
            header: '게시판명',
            name: 'board_title',
            align: 'center',
            renderer: {
                styles: {
                    color: '#0863c8',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                },
            },
        },
        {header: '작성자명', name: 'updated_nm', width: 150, align: 'center'},
        {header: '비고', name: 'memo', align: 'center'},
        {header: '사용여부', name: 'use_yn_nm', width: 150, align: 'center'},
    ];
    // 데이터
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

/**
 * getBoardData : 게시판 수정 화면 호출
 */
const getBoardData = boardId => {
    spinnerShow();

    const url = `/api/board/${boardId}`;
    callGetApi(url, getBoardDataSuccess, getBoardDataError);
};

/**
 *  getBoardDataSuccess : getBoardData successCallback
 */
const getBoardDataSuccess = result => {
    if (result.header.result_code === 'ok') {
        setBoardData(result.data, result.boardAuthList);
    }
    spinnerHide();
};

/**
 *  getBoardDataError : getBoardData errorCallback
 */
const getBoardDataError = response => {
    spinnerHide();
    console.log(response.message);
};

/**
 * setBoardEditData : 수정화면
 */
const setBoardData = (data, authList) => {
    setCodeSelBox('editUseYn', 'USE_YN', '', data.use_yn);
    setCodeSelBox('editBoardType', 'BOARD_TYPE', '', data.board_type);

    $editBoardTitle.val(data.board_title);
    $editMemo.val(data.memo);
    $editBoardId.val(data.board_id);
    $editUpdatedNm.val(data.updated_nm);
    $editUpdatedAt.val(data.updated_at);

    setAuth('edit', authList);

    $('#editBoardType').prop('disabled', true);

    window.$('#boardEdit').modal('show');
};

/**
 * initUserMngWrite : 등록화면의 값 초기화
 */
const initWrite = () => {
    $('#writeBoardTitle').val('');
    $('#writeMemo').val('');
    writeAuthArr = [];
    setAuth('write', '');
};

/**
 *  save : 게시판 등록
 */
const save = () => {
    let msg = '';
    writeAuthArr = [];

    $('#boardWriteFrm input:checkbox[name=auth_id]').each(function (index) {
        if ($(this).is(':checked') === true) {
            writeAuthArr.push($(this).val());
        }
    });

    if ($writeBoardTitle.val() === '') {
        msg = '게시판명을 입력하세요.';
        $writeMsg.html(msg);
        $writeBoardTitle.focus();
        return;
    }

    spinnerShow();

    let url = `/api/board`;
    const type = 'PUT';
    const params = {
        board_title: $writeBoardTitle.val(),
        board_type: $writeBoardType.val(),
        memo: $writeMemo.val(),
        auth_id_arr: writeAuthArr,
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
    spinnerHide();
    $writeMsg.html(response.message);
};

/**
 *  update : 게시판 수정
 */
const update = () => {
    let msg = '';
    editAuthArr = [];

    $('#boardEditFrm input:checkbox[name=auth_id]').each(function (index) {
        if ($(this).is(':checked') === true) {
            editAuthArr.push($(this).val());
        }
    });

    if ($editBoardTitle.val() === '') {
        msg = '게시판명을 입력하세요.';
        $editMsg.html(msg);
        $editBoardTitle.focus();
        return;
    }

    spinnerShow();

    let url = `/api/board/${$editBoardId.val()}`;
    const type = 'PUT';
    const params = {
        board_title: $editBoardTitle.val(),
        memo: $editMemo.val(),
        use_yn: $editUseYn.val(),
        auth_id_arr: editAuthArr,
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
        $editMsg.html(result.header.message);
    }
    spinnerHide();
};

/**
 *  updateError : update errorCallback
 */
const updateError = response => {
    spinnerHide();
    $editMsg.html(response.message);
};

/**
 * pagingCallback : 페이징 콜백
 */
const pagingCallback = returnPage => {
    page.currentPage = returnPage;
    search();
};

/**
 * closeModal : 모달 닫기
 */
const closeModal = () => {
    window.$('#boardWrite').modal('hide');
    window.$('#boardEdit').modal('hide');
};

/**
 *  setAuth : 권한 세팅
 */
const setAuth = (type, authList) => {
    spinnerShow();

    selectedType = type;
    selectedAuthList = authList;

    const url = `/api/item/auth/use-yn/Y`;
    callGetApi(url, setAuthSuccess, setAuthError);
};

/**
 *  setAuthSuccess : setAuth successCallback
 */
const setAuthSuccess = result => {
    console.log('sadfasdf', selectedAuthList);

    if (result.header.result_code === 'ok') {
        const dataList = result.data;
        let str = '';

        if (selectedType === 'edit') {
            $editAuthArea.html('');

            for (let i = 0; i < dataList.length; i++) {
                const data = dataList[i];
                let equalFlg = false;

                for (let j = 0; j < selectedAuthList.length; j++) {
                    const authData = selectedAuthList[j];
                    if (data.auth_id === authData.auth_id) {
                        equalFlg = true;
                    }
                }

                if (equalFlg) {
                    str = `<div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="auth_id" value="${data.auth_id}" checked>
                                <label className="custom-control-label">${data.auth_nm}</label>
                           </div>`;
                } else {
                    str = `<div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="auth_id" value="${data.auth_id}">
                                <label className="custom-control-label">${data.auth_nm}</label>
                            </div>`;
                }

                $editAuthArea.append(str);
            }
        } else {
            $writeAuthArea.html('');

            for (let i = 0; i < dataList.length; i++) {
                const data = dataList[i];
                str = `<div className="custom-control custom-checkbox">
                            <input className="custom-control-input" type="checkbox" name="auth_id" value="${data.auth_id}">
                            <label className="custom-control-label">${data.auth_nm}</label>
                        </div>`;
                $writeAuthArea.append(str);
            }
        }
    }
    spinnerHide();
};

/**
 *  setAuthSuccess : setAuth errorCallback
 */
const setAuthError = response => {
    spinnerHide();
    console.log(response.message);
};

$(document).ready(() => {
    setCodeSelBox('viewBoardType', 'BOARD_TYPE', 'ALL', '');

    setCodeSelBox('viewUseYn', 'USE_YN', 'ALL', '');

    setCodeSelBox('writeBoardType', 'BOARD_TYPE', '', '');

    grid = setGridLayout();

    pagination = setPagination(page, pagingCallback);

    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    $('#viewBoardType').change(() => {
        pageInit();
        search();
    });

    $('#viewUseYn').change(() => {
        pageInit();
        search();
    });

    $('#writeBtn').click(() => {
        initWrite();
    });

    $('#writeSaveBtn').click(() => {
        save();
    });

    $('#editSaveBtn').click(() => {
        update();
    });

    $('#writeAuthAll').click(function () {
        if ($('#writeAuthAll').is(':checked')) {
            $('#boardWriteFrm input[name=auth_id]').prop('checked', true);
        } else {
            $('#boardWriteFrm input[name=auth_id]').prop('checked', false);
        }
    });

    $('#editAuthAll').click(function () {
        if ($('#editAuthAll').is(':checked')) {
            $('#boardEditFrm input[name=auth_id]').prop('checked', true);
        } else {
            $('#boardEditFrm input[name=auth_id]').prop('checked', false);
        }
    });

    const viewBoardTitle = document.getElementById('viewBoardTitle');
    const viewUpdatedNm = document.getElementById('viewUpdatedNm');

    viewBoardTitle.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });

    viewUpdatedNm.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });

    search();
});
