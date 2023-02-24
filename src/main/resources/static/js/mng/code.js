import {setCodeSelBox, setCodeSelBoxCall} from '../module/component';
import Page, {setPagination} from '../module/pagination';
import {serializeFormJson} from '../module/json';
import {
    focustGridFirstRow,
    setBasicGrid,
    setCheckBoxGridId,
    setGridClickEvent,
} from '../module/grid';
import {checkDuplicateList, checkNullList} from '../module/validation';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi, callGetApi} from '../module/async';

let page = new Page(1, false, 10, 0);
let grid;
let grid2;
let pagination;
let selectedCodeGrpId = 0;

const $writeCodeGrpNm = $('#writeCodeGrpNm'); //코드그룹등록 - 코드그룹명
const $writeCodeGrpVal = $('#writeCodeGrpVal'); //코드그룹등록 - 코드그룹값
const $writeMsg = $('#writeMsg'); //코드그룹등록 - 메시지

const $editCodeGrpNm = $('#editCodeGrpNm'); //코드그룹수정 - 코드그룹명
const $editCodeGrpId = $('#editCodeGrpId'); //코드그룹수정 - 코드그룹식별키
const $editCodeGrpVal = $('#editCodeGrpVal'); //코드그룹수정 - 코드그룹값
const $editUseYn = $('#editUseYn'); //코드그룹수정 - 코드그룹사용여부
const $editMsg = $('#editMsg'); //코드그룹수정 - 메시지

// 페이징 초기화
const pageInit = () => {
    page = new Page(1, false, Number($('#pagePer').val()), 0);
};

/**
 * searchGrp : 코드그룹 조회
 */
const searchGrp = () => {
    spinnerShow();

    let url = '/api/codeGrp';
    const type = 'POST';
    const params = serializeFormJson('codeGrpFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;

    callApi(url, type, params, searchGrpSuccess, searchGrpError);
};

/**
 *  searchGrpSuccess : searchGrp successCallback
 */
const searchGrpSuccess = result => {
    if (result.header.result_code === 'ok') {
        const gridData = result.data;
        page.totalCount = result.total;
        grid.resetData(gridData);

        if (page.pageInit === false) {
            pagination.reset(result.total);
            page.pageInit = true;
            setGridClickEvent(grid, 'code_grp_nm', 'code_grp_id', search);
            setGridClickEvent(
                grid,
                'code_grp_val',
                'code_grp_id',
                getCodeGrpData
            );
        }
    }
    spinnerHide();
};

/**
 *  searchGrpError : searchGrp errorCallback
 */
const searchGrpError = response => {
    spinnerHide();
    console.log(response);
};

/**
 * setGridLayout : Choose User 그리드 구성
 */
const setGridLayout = () => {
    const columns = [
        {
            header: 'SEQ',
            name: 'code_grp_id',
            align: 'center',
            hidden: true,
        },
        {
            header: '코드그룹명',
            name: 'code_grp_nm',
            align: 'center',
            renderer: {
                styles: {
                    color: '#0863c8',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                },
            },
        },
        {
            header: '코드그룹값',
            name: 'code_grp_val',
            align: 'center',
            renderer: {
                styles: {
                    color: '#e83e8c',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                },
            },
        },
    ];
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

/**
 * setGridLayout2 : Selected User 그리드 구성
 */
const setGridLayout2 = () => {
    const columns = [
        {
            header: 'Code Id',
            name: 'code_id',
            align: 'center',
            hidden: true,
        },
        {
            header: 'Code Grp Id',
            name: 'code_grp_id',
            align: 'center',
            hidden: true,
        },
        {
            header: '* 코드명',
            name: 'code_nm',
            align: 'left',
            editor: 'text',
            validation: {required: true},
        },
        {
            header: '* 코드값',
            name: 'code_val',
            align: 'left',
            editor: 'text',
            validation: {required: true},
        },
        {
            header: '상위코드',
            name: 'prn_code_val',
            align: 'left',
            editor: 'text',
        },
        {
            header: '순서',
            name: 'ord',
            align: 'center',
            width: 50,
            editor: 'text',
        },
        {header: '비고', name: 'memo', align: 'left', editor: 'text'},
        {
            header: '* 사용여부',
            name: 'use_yn',
            align: 'center',
            formatter: 'listItemText',
            editor: {
                type: 'select',
                options: {
                    listItems: [
                        {text: '사용', value: 'Y'},
                        {text: '미사용', value: 'N'},
                    ],
                },
            },
            renderer: {
                styles: {
                    color: '#e83e8c',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                },
            },
        },
    ];
    const gridData = [];
    return setCheckBoxGridId(columns, gridData, 'grid2');
};

/**
 * pagingCallback : 페이징 콜백
 */
const pagingCallback = returnPage => {
    page.currentPage = returnPage;
    searchGrp();
};

/**
 *  saveGrp : 코드 그룹 등록
 */
const saveGrp = () => {
    let msg = '';

    if ($writeCodeGrpNm.val() === '') {
        msg = '코드그룹명을 입력하세요.';
        $writeMsg.html(msg);
        $writeCodeGrpNm.focus();
        return;
    }
    if ($writeCodeGrpVal.val() === '') {
        msg = '코드그룹값을 입력하세요.';
        $writeMsg.html(msg);
        $writeCodeGrpVal.focus();
        return;
    }

    spinnerShow();

    let url = '/api/codeGrp';
    const type = 'PUT';
    const params = {
        code_grp_nm: $writeCodeGrpNm.val(),
        code_grp_val: $writeCodeGrpVal.val(),
    };

    callApi(url, type, params, saveGrpSuccess, saveGrpError);
};

/**
 *  saveGrpSuccess : saveGrp successCallback
 */
const saveGrpSuccess = result => {
    if (result.header.result_code === 'ok') {
        alert(result.header.message);
        pageInit();
        searchGrp();
        window.$('#codeGrpWrite').modal('hide');
    }
    spinnerHide();
};

/**
 *  saveGrpError : saveGrp errorCallback
 */
const saveGrpError = response => {
    spinnerHide();
    $('#writeMsg').html(response.message);
};

/**
 *  getCodeGrpData : 코드 그룹 수정 호출
 */
const getCodeGrpData = codeGrpId => {
    spinnerShow();

    const url = `/api/codeGrp/${codeGrpId}`;
    callGetApi(url, getCodeGrpDataSuccess, getCodeGrpDataError);
};

/**
 *  getCodeGrpDataSuccess : getCodeGrpData successCallback
 */
const getCodeGrpDataSuccess = result => {
    if (result.header.result_code === 'ok') {
        setEditData(result.data);
    }
    spinnerHide();
};

/**
 *  getCodeGrpDataError : getCodeGrpData errorCallback
 */
const getCodeGrpDataError = response => {
    spinnerHide();
    console.log(response);
};

/**
 *  setEditData : 데이터 매핑 및 모달 오픈
 */
const setEditData = data => {
    setCodeSelBox('editUseYn', 'USE_YN', '', data.use_yn);

    $editCodeGrpId.val(data.code_grp_id);
    $editCodeGrpNm.val(data.code_grp_nm);
    $editCodeGrpVal.val(data.code_grp_val);

    window.$('#codeGrpEdit').modal('show');
};

/**
 *  updateGrp : 코드 그룹 수정
 */
const updateGrp = () => {
    let msg = '';

    if ($editCodeGrpNm.val() === '') {
        msg = '코드그룹값을 입력하세요.';
        $editMsg.html(msg);
        $editCodeGrpNm.focus();
        return;
    }

    spinnerShow();

    let url = `/api/codeGrp/${$editCodeGrpId.val()}`;
    const type = 'PUT';
    const params = {
        code_grp_nm: $editCodeGrpNm.val(),
        code_grp_val: $editCodeGrpVal.val(),
        use_yn: $editUseYn.val(),
    };

    callApi(url, type, params, updateGrpSuccess, updateGrpError);
};

/**
 *  updateGrpSuccess : updateGrp successCallback
 */
const updateGrpSuccess = result => {
    if (result.header.result_code === 'ok') {
        alert(result.header.message);
        pageInit();
        searchGrp();
        window.$('#codeGrpEdit').modal('hide');
    }
    spinnerHide();
};

/**
 *  updateGrpError : updateGrp errorCallback
 */
const updateGrpError = response => {
    spinnerHide();
    $('#editMsg').html(response.message);
};

/**
 * search : 조회
 */
const search = codeGrpId => {
    selectedCodeGrpId = codeGrpId;

    spinnerShow();

    const url = `/api/code/${codeGrpId}`;
    callGetApi(url, searchSuccess, searchError);
};

/**
 *  searchSuccess : search successCallback
 */
const searchSuccess = result => {
    if (result.header.result_code === 'ok') {
        const gridData = result.data;
        grid2.resetData(gridData);
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
 *  saveCode : 코드를 저장한다.
 */
const saveCode = () => {
    if (grid2.getData().length !== 0) {
        focustGridFirstRow(grid2);
    }

    const rows = grid2.getModifiedRows();
    const data = grid2.getData();

    const {createdRows} = rows;
    const {updatedRows} = rows;
    const {deletedRows} = rows;

    if (
        createdRows.length === 0 &&
        updatedRows.length === 0 &&
        deletedRows.length === 0
    ) {
        alert('변경된 내용이 없습니다.');
        return;
    }

    if (!checkNullList(data, 'code_nm')) {
        alert('코드명이 비어있습니다.');
        return;
    }

    if (!checkNullList(data, 'code_val')) {
        alert('코드값이 비어있습니다.');
        return;
    }

    if (!checkDuplicateList(data, 'code_val')) {
        alert('코드값이 중복입니다.');
        return;
    }

    spinnerShow();

    let url = `/api/code/${selectedCodeGrpId}`;
    const type = 'PUT';
    const params = {
        created_rows: createdRows,
        updated_rows: updatedRows,
        deleted_rows: deletedRows,
    };

    callApi(url, type, params, saveCodeSuccess, saveCodeError);
};

/**
 *  saveCodeSuccess : saveCode successCallback
 */
const saveCodeSuccess = result => {
    if (result.header.result_code === 'ok') {
        alert(result.header.message);
    }
    spinnerHide();
};

/**
 *  saveCodeError : saveCode errorCallback
 */
const saveCodeError = response => {
    spinnerHide();
    console.log(response.message);
};

$(document).ready(() => {
    setCodeSelBoxCall('useYn', 'USE_YN', '', 'Y', searchGrp);

    // 그리드 세팅
    grid = setGridLayout();
    grid2 = setGridLayout2();

    // 페이징 세팅
    pagination = setPagination(page, pagingCallback);

    // 검색버튼 클릭시 검색
    $('#searchGrpBtn').click(() => {
        pageInit();
        searchGrp();
    });

    // 코드 그룹추가 버튼 클릭 이벤트(입력화면 호출)
    $('#codeGrpAddBtn').click(() => {
        $('#writeCodeGrpNm').val('');
        $('#writeCodeGrpVal').val('');
        window.$('#codeGrpWrite').modal('show');
    });

    // 코드 그룹 입력화면 버튼 클릭 이벤트
    $('#saveCodeGrpBtn').click(() => {
        saveGrp();
    });

    // 코드 그룹 수정화면 버튼 클릭 이벤트
    $('#updateCodeGrpBtn').click(() => {
        updateGrp();
    });

    // 사용여부 변경시 검색
    $('#useYn').change(() => {
        pageInit();
        searchGrp();
    });

    // 추가 버튼 클릭 이벤트
    $('#addBtn').click(() => {
        if (selectedCodeGrpId === 0) {
            alert('코드 그룹명을 선택하세요.');
            return;
        }

        const row = {
            code_id: '',
            code_grp_id: selectedCodeGrpId,
            code_nm: '',
            code_val: '',
            prn_code_val: '',
            ord: '',
            memo: '',
            use_yn: 'Y',
        };
        grid2.appendRow(row);
    });

    // 삭제 버튼 클릭 이벤트
    $('#delBtn').click(() => {
        const checkedRows = grid2.getCheckedRows();
        if (checkedRows.length === 0) {
            alert('선택한 항목이 없습니다.');
            return;
        }
        grid2.removeCheckedRows();
    });

    // 저장 버튼 클릭 이벤트
    $('#saveBtn').click(() => {
        saveCode();
    });

    const searchStrInput = document.getElementById('searchStr');

    searchStrInput.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchGrpBtn').click();
        }
    });
});
