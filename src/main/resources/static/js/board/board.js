import {setCodeSelBox} from '../module/component';
import Page, {setPagination} from '../module/pagination';
import {setBasicGrid, setGridClickEvent} from '../module/grid';
import {serializeFormJson} from '../module/json';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi, callApiWithoutBody} from '../module/async';

let page = new Page(1, false, 10, 0);
let grid;
let pagination;

const $writeBoardTitle = $('#writeBoardTitle');
const $writeBoardType = $('#writeBoardType');
const $writeMemo = $('#writeMemo');
const $writeMsg = $('#writeMsg');
const $writeAuthArea = $('#writeAuthArea');
const $writeAttachYn = $('#writeAttachYn');
const $writeCommentYn = $('#writeCommentYn');


const $editBoardTitle = $('#editBoardTitle');
const $editBoardType = $('#editBoardType');
const $editBoardTypeCd = $('#editBoardTypeCd');
const $editUseYn = $('#editUseYn');
const $editBoardId = $('#editBoardId');
const $editMemo = $('#editMemo');
const $editMsg = $('#editMsg');
const $editUpdatedNm = $('#editUpdatedNm');
const $editUpdatedAt = $('#editUpdatedAt');
const $editAuthArea = $('#editAuthArea');
const $editAttachYn = $('#editAttachYn');
const $editCommentYn = $('#editCommentYn');

let selectedType;
let selectedAuthList;

const pageInit = () => {
    page = new Page(1, false, Number($('#size').val()), 0);
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
    params.page = page.page;
    params.size = page.size;

    callApi(url, type, params, searchSuccess, searchError);
};

/**
 *  searchSuccess : search successCallback
 */
const searchSuccess = result => {
    if (result.header["resultCode"] === 'ok') {
        const gridData = result.data;
        page.totalCount = result.totalCount;
        grid.resetData(gridData);

        if (page.pageInit === false) {
            setGridClickEvent(grid, 'boardTitle', 'boardId', getBoardData);
            pagination.reset(result.totalCount);
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
        {
            header: 'ID',
            name: 'boardId',
            width: 50,
            align: 'center',
        },
        {
            header: '게시판유형',
            name: 'boardTypeLabel',
            width: 150,
            align: 'center',
        },
        {
            header: '게시판명',
            name: 'boardTitle',
            align: 'center',
            renderer: {
                styles: {
                    color: '#0863c8',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                },
            },
        },
        {header: '작성자명', name: 'createdIdLabel', width: 150, align: 'center'},
        {header: '비고', name: 'memo', align: 'center'},
        {header: '사용여부', name: 'useYnLabel', width: 150, align: 'center'},
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

    callApiWithoutBody(
        `/api/board/${boardId}`,
        'GET',
        getBoardDataSuccess,
        getBoardDataError
    );
};

/**
 *  getBoardDataSuccess : getBoardData successCallback
 */
const getBoardDataSuccess = result => {
    if (result.header["resultCode"] === 'ok') {
        setBoardData(result.data, result["boardAuths"]);
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
const setBoardData = (data, boardAuths) => {
    setCodeSelBox('editUseYn', 'USE_YN', '', data.useYn);
    setCodeSelBox('editBoardType', 'BOARD_TYPE', '', data.boardType);
    setCodeSelBox('editAttachYn', 'USE_YN', '', data.attachYn);
    setCodeSelBox('editCommentYn', 'USE_YN', '', data.commentYn);

    $editBoardTitle.val(data.boardTitle);
    $editMemo.val(data.memo);
    $editBoardId.val(data.boardId);
    $editUpdatedNm.val(data.createdIdLabel);
    $editUpdatedAt.val(data.updatedAtLabel);
    $editBoardTypeCd.val(data.boardType);
    $editMsg.html('');

    setAuth('edit', boardAuths);

    $('#editBoardType').prop('disabled', true);

    $('#editAuthAll').click(function () {
        if (
            $('#editAuthAll').is(':checked') &&
            $editBoardType.val() === 'POST'
        ) {
            $('#boardEditFrm input[name=authId]').prop('checked', true);
        } else {
            $('#boardEditFrm input[name=authId]').prop('checked', false);
        }
    });

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
    setCodeSelBox('writeAttachYn', 'USE_YN', 'SEL', '');
    setCodeSelBox('writeCommentYn', 'USE_YN', 'SEL', '');
    $writeMsg.html('');
};

/**
 *  save : 게시판 등록
 */
const save = () => {
    let msg = '';
    writeAuthArr = [];

    $('#boardWriteFrm input:checkbox[name=authId]').each(function (index) {
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


    if ($writeAttachYn.val() === '') {
        msg = '첨부파일사용여부를 선택하세요.';
        $writeMsg.html(msg);
        return;
    }

    if ($writeCommentYn.val() === '') {
        msg = '댓글사용여부를 선택하세요.';
        $writeMsg.html(msg);
        return;
    }

    spinnerShow();

    let url = `/api/board`;
    const type = 'PUT';
    const params = {
        boardTitle: $writeBoardTitle.val(),
        boardType: $writeBoardType.val(),
        attachYn: $writeAttachYn.val(),
        commentYn: $writeCommentYn.val(),
        memo: $writeMemo.val(),
        authIdArr: writeAuthArr,
    };

    callApi(url, type, params, saveSuccess, saveError);
};

/**
 *  saveSuccess : save successCallback
 */
const saveSuccess = result => {
    if (result.header.resultCode === 'ok') {
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

    $('#boardEditFrm input:checkbox[name=authId]').each(function (index) {
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
        boardTitle: $editBoardTitle.val(),
        memo: $editMemo.val(),
        useYn: $editUseYn.val(),
        attachYn: $editAttachYn.val(),
        commentYn: $editCommentYn.val(),
        authIdArr: editAuthArr,
    };

    callApi(url, type, params, updateSuccess, updateError);
};

/**
 *  updateSuccess : update successCallback
 */
const updateSuccess = result => {
    if (result.header.resultCode === 'ok') {
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
    page.page = returnPage;
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

    callApiWithoutBody(
        `/api/item/auth/used-auths`,
        'GET',
        setAuthSuccess,
        setAuthError
    );
};

/**
 *  setAuthSuccess : setAuth successCallback
 */
const setAuthSuccess = result => {
    if (result.header["resultCode"] === 'ok') {
        const dataList = result.data;
        let str = '';

        if (selectedType === 'edit') {
            $editAuthArea.html('');

            for (let i = 0; i < selectedAuthList.length; i++) {
                const data = selectedAuthList[i];
                if (data.useYn ==="Y" ) {
                    str = `<div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="authId" value="${data.authId}" checked>
                                <label className="custom-control-label">${data.authNm}</label>
                           </div>`;
                } else {
                    str = `<div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="authId" value="${data.authId}">
                                <label className="custom-control-label">${data.authNm}</label>
                            </div>`;
                }
                $editAuthArea.append(str);
            }
        } else {
            $writeAuthArea.html('');

            for (let i = 0; i < dataList.length; i++) {
                const data = dataList[i];
                str = `<div className="custom-control custom-checkbox">
                            <input className="custom-control-input" type="checkbox" name="authId" value="${data.authId}">
                            <label className="custom-control-label">${data.authNm}</label>
                        </div>`;
                $writeAuthArea.append(str);
            }
        }
    }

    if ($editBoardTypeCd.val() !== 'POST') {
        $('#boardEditFrm input[name=authId]').prop('disabled', true);
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

    search();

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

    //게시판 유형이 바뀌면 권한을 넣지 않는다.
    $writeBoardType.change(() => {
        $('#boardWriteFrm input[name=authId]').prop('checked', false);
        $('#writeAuthAll').prop('checked', false);

        if ($writeBoardType.val() !== 'POST') {
            $('#boardWriteFrm input[name=authId]').prop('disabled', true);
        } else {
            $('#boardWriteFrm input[name=authId]').prop('disabled', false);
        }
    });

    $('#writeAuthAll').click(function () {
        if (
            $('#writeAuthAll').is(':checked') &&
            $writeBoardType.val() === 'POST'
        ) {
            $('#boardWriteFrm input[name=authId]').prop('checked', true);
        } else {
            $('#boardWriteFrm input[name=authId]').prop('checked', false);
        }
    });

    const viewBoardTitle = document.getElementById('viewBoardTitle');

    viewBoardTitle.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });
});
