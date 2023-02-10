import { setCodeSelBox } from '../module/component';
import Page, { setPagination } from '../module/pagination';
import { serializeFormJson } from '../module/json';
import {
    focustGridFirstRow,
    setBasicGrid,
    setCheckBoxGridId,
    setGridClickEvent
} from '../module/grid';
import { checkDuplicateList, checkNullList } from '../module/validation';
import { mainViewTokenInvalidate, setAccessToken } from "../module/router";
import { spinnerHide, spinnerShow } from "../module/spinner";

let page = new Page(1, false, 10, 0);
let grid;
let grid2;
let pagination;
let selectedCodeGrpId = 0;

// 페이징 초기화
const pageInit = () => {
    page = new Page(1, false, Number($('#pagePer').val()), 0);
};

/**
 * search : 조회
 */
const searchGrp = () => {

    spinnerShow();

    const params = serializeFormJson('codeGrpFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/mng/codeGrp/',
        type: 'POST',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            const gridData = result.data;
            page.totalCount = result.total;
            grid.resetData(gridData);

            if (page.pageInit === false) {
                pagination.reset(result.total);
                page.pageInit = true;
            }

            setGridClickEvent(grid, 'cd_grp_nm', 'cd_grp_idntf_key', search);
            setGridClickEvent(grid, 'cd_grp_val', 'cd_grp_idntf_key', codeMngEdit);

            spinnerHide();
        },
        error(request, status, error) {
            console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);

            if(request.status === 401){
                setAccessToken(request.responseJSON);
                searchGrp();
            }
            else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        },
    });
};

/**
 * setGridLayout : Choose User 그리드 구성
 */
const setGridLayout = () => {
    const columns = [
        { header: 'SEQ', name: 'cd_grp_idntf_key', align: 'center', hidden: true },
        { header: '코드그룹명', name: 'cd_grp_nm', align: 'center', renderer: { styles: {color: '#0863c8', textDecoration : 'underline', cursor: 'pointer'}} },
        { header: '코드그룹값', name: 'cd_grp_val', align: 'center', renderer: { styles: {color: '#e83e8c', textDecoration : 'underline', cursor: 'pointer'}} },
    ];
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

/**
 * setGridLayout2 : Selected User 그리드 구성
 */
const setGridLayout2 = () => {
    const columns = [
        { header: 'Code Id', name: 'cd_idntf_key', align: 'center', hidden: true },
        { header: 'Code Grp Id', name: 'cd_grp_idntf_key', align: 'center', hidden: true },
        { header: '* 코드명', name: 'cd_nm', align: 'left', editor: 'text', validation: { required: true }},
        { header: '* 코드값', name: 'cd_val', align: 'left', editor: 'text', validation: { required: true }},
        { header: '상위코드', name: 'prn_cd_val', align: 'left', editor: 'text' },
        { header: '순서', name: 'ord', align: 'center', width: 50, editor: 'text'},
        { header: '비고', name: 'memo', align: 'left', editor: 'text' },
        {
            header: '* 사용여부',
            name: 'use_yn',
            align: 'center',
            formatter: 'listItemText',
            editor: {
                type: 'select',
                options: {
                    listItems: [
                        { text: '사용', value: 'Y' },
                        { text: '미사용', value: 'N' },
                    ],
                },
            },
            renderer: { styles: {color: '#e83e8c', textDecoration : 'underline', cursor: 'pointer'}}
        },
    ];
    const gridData = [];
    return setCheckBoxGridId(columns, gridData, 'grid2');
};

/**
 * pagingCallback : 페이징 콜백
 */
const pagingCallback = (returnPage) => {
    page.currentPage = returnPage;
    searchGrp();
};

const $writeCodeGrpNm = $('#writeCodeGrpNm');
const $writeCodeGrpVal = $('#writeCodeGrpVal');

/**
 *  insertGrpProc : 코드 그룹 등록
 */
const insertGrpProc = () => {
    let msg = '';

    if ($writeCodeGrpNm.val() === '') {
        msg = '코드그룹명을 입력하세요.';
        $('#writeMsg').html(msg);
        $writeCodeGrpNm.focus();
        return;
    }
    if ($writeCodeGrpVal.val() === '') {
        msg = '코드그룹값을 입력하세요.';
        $('#writeMsg').html(msg);
        $writeCodeGrpVal.focus();
        return;
    }

    spinnerShow();

    const params = {
        cd_grp_nm: $('#writeCodeGrpNm').val(),
        cd_grp_val: $('#writeCodeGrpVal').val(),
    };

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/mng/codeGrp/',
        type: 'PUT',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
    }).then(
        (data) => {
            if (data.header.resultCode === 'ok') {
                alert(data.header.message);
                pageInit();
                searchGrp();
                window.$('#codeGrpWrite').modal('hide');
            }

            spinnerHide();
        },
        (request, status, error) => {
            if (request.status === 500) {
                console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);
            } else if (request.status === 400) {
                const { errorList } = request.responseJSON;
                if (errorList !== undefined) {
                    if (errorList.lengh !== 0) {
                        const { message } = errorList[0];
                        $('#writeMsg').html(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#writeMsg').html(data.message);
                }
            } else if(request.status === 401){
                setAccessToken(request.responseJSON);
                insertGrpProc();
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

/**
 *  codeMngEdit : 코드 그룹 수정 호출
 */
const codeMngEdit = (codeGrpId) => {

    spinnerShow();

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: `/api/mng/codeGrp/${codeGrpId}`,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            setEditData(result.data);

            spinnerHide();
        },
        error(request, status, error) {
            console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);

            if(request.status === 401){
                setAccessToken(request.responseJSON);
                codeMngEdit(codeGrpId);
            }
            else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        },
    });
};

const $editCodeGrpNm = $('#editCodeGrpNm');
const $editCodeGrpId = $('#editCodeGrpId');
const $editCodeGrpVal = $('#editCodeGrpVal');

/**
 *  setEditData : 데이터 매핑 및 모달 오픈
 */
const setEditData = (data) => {
    setCodeSelBox('editUseYn', 'USE_YN', '', data.use_yn);

    $editCodeGrpId.val(data.cd_grp_idntf_key);
    $editCodeGrpNm.val(data.cd_grp_nm);
    $editCodeGrpVal.val(data.cd_grp_val);

    window.$('#codeGrpEdit').modal('show');
};

/**
 *  editGrpProc : 코드 그룹 수정
 */
const editGrpProc = () => {
    let msg = '';

    if ($editCodeGrpNm.val() === '') {
        msg = '코드그룹값을 입력하세요.';
        $('#editMsg').html(msg);
        $editCodeGrpNm.focus();
        return;
    }

    spinnerShow();

    const params = {
        cd_grp_idntf_key: $editCodeGrpId.val(),
        cd_grp_nm: $editCodeGrpNm.val(),
        cd_grp_val: $editCodeGrpVal.val(),
        use_yn: $('#editUseYn').val(),
    };

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: `/api/mng/codeGrp/${$editCodeGrpId.val()}`,
        type: 'PUT',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
    }).then(
        (data) => {
            if (data.header.resultCode === 'ok') {
                alert(data.header.message);
                pageInit();
                searchGrp();
                window.$('#codeGrpEdit').modal('hide');
            }

            spinnerHide();
        },
        (request, status, error) => {
            if (request.status === 500) {
                console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);
            } else if (request.status === 400) {
                const { errorList } = request.responseJSON;
                if (errorList !== undefined) {
                    if (errorList.lengh !== 0) {
                        const { message } = errorList[0];
                        $('#editMsg').html(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#editMsg').html(data.message);
                }
            } else if(request.status === 401){
                setAccessToken(request.responseJSON);
                editGrpProc();
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

/**
 * search : 조회
 */
const search = (codeGrpId) => {
    selectedCodeGrpId = codeGrpId;

    const accessToken = window.localStorage.getItem("accessToken");

    spinnerShow();

    $.ajax({
        url: `/api/mng/code/${codeGrpId}`,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            const gridData = result.data;
            grid2.resetData(gridData);

            spinnerHide();
        },
        error(request, status, error) {
            console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);

            if(request.status === 401){
                setAccessToken(request.responseJSON);
                search(codeGrpId);
            }
            else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        },
    });
};

const saveCodePrc = () => {

    focustGridFirstRow(grid2);

    const rows = grid2.getModifiedRows();
    const data = grid2.getData();

    const { createdRows } = rows;
    const { updatedRows } = rows;
    const { deletedRows } = rows;

    if (
        createdRows.length === 0 &&
        updatedRows.length === 0 &&
        deletedRows.length === 0
    ) {
        alert('변경된 내용이 없습니다.');
        return;
    }

    if (!checkNullList(data, 'cd_nm')) {
        alert('코드명이 비어있습니다.');
        return;
    }

    if (!checkNullList(data, 'cd_val')) {
        alert('코드값이 비어있습니다.');
        return;
    }

    if (!checkDuplicateList(data, 'cd_val')) {
        alert('코드값이 중복입니다.');
        return;
    }

    spinnerShow();

    const params = {
        cd_grp_idntf_key: selectedCodeGrpId,
        created_rows: createdRows,
        updated_rows: updatedRows,
        deleted_rows: deletedRows,
    };

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: `/api/mng/code/${selectedCodeGrpId}`,
        type: 'POST',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            if (result.header.resultCode === 'ok') {
                alert(result.header.message);
            }

            spinnerHide();
        },
        error(request, status, error) {
            if (request.status === 500) {
                console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);
            } else if (request.status === 400) {
                const { errorList } = request.responseJSON;
                if (errorList !== undefined) {
                    if (errorList.lengh !== 0) {
                        const { message } = errorList[0];
                        alert(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    alert(data.message);
                }
            } else if(request.status === 401){
                setAccessToken(request.responseJSON);
                saveCodePrc();
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        },
    });
}

$(document).ready(() => {
    setCodeSelBox('useYn', 'USE_YN', '', 'Y');

    // 그리드 세팅
    grid = setGridLayout();
    grid2 = setGridLayout2();

    // 페이징 세팅
    pagination = setPagination(page, pagingCallback);

    // 코드그룹 조회
    searchGrp();

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
    $('#writeCodeGrpBtn').click(() => {
        insertGrpProc();
    });

    // 코드 그룹 수정화면 버튼 클릭 이벤트
    $('#editCodeGrpBtn').click(() => {
        editGrpProc();
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
            cd_idntf_key: '',
            cd_grp_idntf_key: selectedCodeGrpId,
            cd_nm: '',
            cd_val: '',
            prn_cd_val: '',
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
        saveCodePrc();
    });

    const searchStrInput = document.getElementById("searchStr");

    searchStrInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("searchGrpBtn").click();
        }
    });

});
