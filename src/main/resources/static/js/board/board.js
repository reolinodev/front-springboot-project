import {setCodeSelBox} from '../module/component';
import Page, {setPagination} from '../module/pagination';
import {setBasicGrid, setGridClickEvent} from '../module/grid';
import {serializeFormJson} from '../module/json';
import {mainViewTokenInvalidate, setAccessToken} from '../module/router';
import {spinnerHide, spinnerShow} from '../module/spinner';

let page = new Page(1, false, 10, 0);
let grid;
let pagination;

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

    const params = serializeFormJson('boardViewFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;

    const accessToken = window.localStorage.getItem('accessToken');

    $.ajax({
        url: '/api/board/',
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

            setGridClickEvent(
                grid,
                'board_title',
                'board_idntf_key',
                boardEdit
            );

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
            name: 'board_idntf_key',
            width: 100,
            align: 'center',
            hidden: true,
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
        {header: '작성자', name: 'sys_mdfcn_nm', width: 150, align: 'center'},
        {header: '비고', name: 'memo', align: 'center'},
        {header: '사용여부', name: 'use_yn_nm', width: 150, align: 'center'},
    ];
    // 데이터
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

/**
 * boardEdit : 게시판 수정 화면 호출
 */
const boardEdit = boardId => {
    spinnerShow();

    const accessToken = window.localStorage.getItem('accessToken');

    $.ajax({
        url: `/api/board/${boardId}`,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', accessToken);
        },
        success(result) {
            setBoardEditData(result.data, result.authData);

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
                boardEdit(boardId);
            } else if (request.status === 403) {
                mainViewTokenInvalidate();
            }

            spinnerHide();
        },
    });
};

/**
 * setBoardEditData : 수정화면
 */
const setBoardEditData = (data, authData) => {
    setCodeSelBox('editUseYn', 'USE_YN', '', data.use_yn);
    $('#editBoardTitle').val(data.board_title);
    $('#editMemo').val(data.memo);
    $('#editBoardId').val(data.board_idntf_key);
    setAuth('edit', authData);

    window.$('#boardEdit').modal('show');
};

/**
 * initUserMngWrite : 등록화면의 값 초기화
 */
const initBoardWrite = () => {
    $('#writeBoardTitle').val('');
    $('#writeMemo').val('');
    writeAuthArr = [];
    setAuth('write', '');
};

/**
 *  saveProc : 게시판 등록
 */
const saveProc = () => {
    let msg = '';
    writeAuthArr = [];

    $('#boardWriteFrm input:checkbox[name=auth_idntf_key]').each(function (
        index
    ) {
        if ($(this).is(':checked') === true) {
            writeAuthArr.push($(this).val());
        }
    });

    if ($('#writeBoardTitle').val() === '') {
        msg = '게시판명을 입력하세요.';
        $('#writeMsg').html(msg);
        $('#writeBoardTitle').focus();
        return;
    }

    spinnerShow();

    const param = {
        board_title: $('#writeBoardTitle').val(),
        memo: $('#writeMemo').val(),
        auth_id_arr: writeAuthArr,
    };

    const accessToken = window.localStorage.getItem('accessToken');

    $.ajax({
        url: '/api/board/',
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
                saveProc();
            } else if (request.status === 403) {
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

/**
 *  editProc : 사용자 수정
 */
const editProc = () => {
    let msg = '';
    editAuthArr = [];

    $('#boardEditFrm input:checkbox[name=auth_idntf_key]').each(function (
        index
    ) {
        if ($(this).is(':checked') === true) {
            editAuthArr.push($(this).val());
        }
    });

    if ($('#editBoardTitle').val() === '') {
        msg = '게시판명을 입력하세요.';
        $('#editMsg').html(msg);
        $('#editBoardTitle').focus();
        return;
    }

    spinnerShow();

    const param = {
        board_title: $('#editBoardTitle').val(),
        memo: $('#editMemo').val(),
        use_yn: $('#editUseYn').val(),
        auth_id_arr: editAuthArr,
    };

    const accessToken = window.localStorage.getItem('accessToken');

    $.ajax({
        url: `/api/board/${$('#editBoardId').val()}`,
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
 *  setCompCd : 계열사 서비스 코드 세팅
 */
const setAuth = (type, authList) => {
    spinnerShow();

    const param = {};
    const accessToken = window.localStorage.getItem('accessToken');

    $.ajax({
        url: `/api/auth/useAuth`,
        type: 'POST',
        data: JSON.stringify(param),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', accessToken);
        },
    }).then(
        result => {
            const dataList = result.data;
            let str = '';

            if (type === 'edit') {
                $('#editAuthArea').html('');

                for (let i = 0; i < dataList.length; i++) {
                    const data = dataList[i];
                    let equalFlg = false;

                    for (let j = 0; j < authList.length; j++) {
                        const authData = authList[j];
                        if (data.auth_idntf_key === authData.auth_idntf_key) {
                            equalFlg = true;
                        }
                    }

                    if (equalFlg) {
                        str = `<div className="custom-control custom-checkbox">
                                    <input className="custom-control-input" type="checkbox" name="auth_idntf_key" value="${data.auth_idntf_key}" checked>
                                    <label className="custom-control-label">${data.auth_nm}</label>
                               </div>`;
                    } else {
                        str = `<div className="custom-control custom-checkbox">
                                    <input className="custom-control-input" type="checkbox" name="auth_idntf_key" value="${data.auth_idntf_key}">
                                    <label className="custom-control-label">${data.auth_nm}</label>
                                </div>`;
                    }

                    $('#editAuthArea').append(str);
                }
            } else {
                $('#writeAuthArea').html('');

                for (let i = 0; i < dataList.length; i++) {
                    const data = dataList[i];
                    str = `<div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="auth_idntf_key" value="${data.auth_idntf_key}">
                                <label className="custom-control-label">${data.auth_nm}</label>
                            </div>`;
                    $('#writeAuthArea').append(str);
                }
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
                        console.log(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#msg').html(data.message);
                    console.log(data.message);
                }
            } else if (request.status === 401) {
                setAccessToken(request.responseJSON);
                setAuth(type, authList);
            } else if (request.status === 403) {
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

$(document).ready(() => {
    setCodeSelBox('viewUseYn', 'USE_YN', 'ALL', '');

    grid = setGridLayout();

    pagination = setPagination(page, pagingCallback);

    setAuth('write', '');

    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    $('#writeBtn').click(() => {
        initBoardWrite();
    });

    $('#writeSaveBtn').click(() => {
        saveProc();
    });

    $('#editSaveBtn').click(() => {
        editProc();
    });

    $('#writeAuthAll').click(function () {
        if ($('#writeAuthAll').is(':checked'))
            $('#boardWriteFrm input[name=auth_idntf_key]').prop(
                'checked',
                true
            );
        else
            $('#boardWriteFrm input[name=auth_idntf_key]').prop(
                'checked',
                false
            );
    });

    $('#editAuthAll').click(function () {
        if ($('#editAuthAll').is(':checked'))
            $('#boardEditFrm input[name=auth_idntf_key]').prop('checked', true);
        else
            $('#boardEditFrm input[name=auth_idntf_key]').prop(
                'checked',
                false
            );
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
