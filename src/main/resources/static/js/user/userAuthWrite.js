import {setCodeSelBox, setCommSelBox} from '../module/component';
import Page, {setPagination} from '../module/pagination';
import {serializeFormJson} from '../module/json';
import {
    setCheckBoxGrid,
    getCheckedRows,
    setCheckBoxGridId,
} from '../module/grid';
import {mainViewTokenInvalidate, setAccessToken} from '../module/router';
import {spinnerHide, spinnerShow} from '../module/spinner';

let page = new Page(1, false, 10, 0);
let grid;
let grid2;
let pagination;
let selectedData = [];

// 페이징 초기화
const pageInit = () => {
    page = new Page(1, false, Number($('#pagePer').val()), 0);
};

/**
 * search : 조회
 */
const search = () => {
    const params = serializeFormJson('authUserWriteFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;

    if (params.auth_idntf_key === '') {
        alert('권한을 선택하세요.');
        return;
    }

    spinnerShow();

    const accessToken = window.localStorage.getItem('accessToken');

    $.ajax({
        url: '/api/userAuth/inputUser',
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
 * setGridLayout : Choose User 그리드 구성
 */
const setGridLayout = () => {
    const columns = [
        {header: 'SEQ', name: 'user_idntf_key', align: 'center', hidden: true},
        {header: '아이디', name: 'login_id', align: 'center'},
        {header: '이름', name: 'user_nm', align: 'center'},
        {header: '계열사', name: 'corp_nm', align: 'center'},
    ];
    const gridData = [];

    return setCheckBoxGrid(columns, gridData);
};

/**
 * setGridLayout2 : Selected User 그리드 구성
 */
const setGridLayout2 = () => {
    const columns = [
        {header: 'SEQ', name: 'user_idntf_key', align: 'center', hidden: true},
        {header: '아이디', name: 'login_id', align: 'center'},
        {header: '이름', name: 'user_nm', align: 'center'},
        {header: '계열사', name: 'corp_nm', align: 'center'},
    ];
    const gridData = [];
    return setCheckBoxGridId(columns, gridData, 'grid2');
};

/**
 * pagingCallback : 페이징 콜백
 */
const pagingCallback = returnPage => {
    page.currentPage = returnPage;
    search();
};

/**
 * setAuthUser : 사용자 선택
 */
const setAuthUser = () => {
    if ($('#authIdntfKey').val() === '') {
        alert('권한을 선택하세요.');
        return;
    }

    const checkedRows = getCheckedRows(grid);
    if (checkedRows.length === 0) {
        alert('항목을 선택하세요.');
        return;
    }

    setSelectedUser(checkedRows);
};

/**
 * setSelectedUser : Selected User 그리드에 데이터 매핑핑
 */
const setSelectedUser = list => {
    for (const obj of list) {
        selectedData.push(obj);
    }

    selectedData = removeDuplicateItem(selectedData);

    grid2.resetData(selectedData);
};
/**
 * removeDuplicateItem : 사용자 아이디 중복 항목 제거
 */
const removeDuplicateItem = data => {
    let uniqueData;
    uniqueData = data.filter(
        (character, idx, arr) =>
            arr.findIndex(
                item => item.user_idntf_key === character.user_idntf_key
            ) === idx
    );

    return uniqueData;
};

/**
 * deleteAuthUser : 사용자 삭제
 */
const deleteAuthUser = () => {
    grid2.removeCheckedRows();
    selectedData = grid2.getData();
};

/**
 *  insertProc : 권한 등록
 */
const insertProc = () => {
    if ($('#authIdntfKey').val() === '') {
        alert('권한을 선택하세요.');
        return;
    }

    if (selectedData.length === 0) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    spinnerShow();

    const userArr = [];

    for (const obj of selectedData) {
        userArr.push(obj.user_idntf_key);
    }

    const params = {
        auth_idntf_key: $('#authIdntfKey').val(),
        user_arr: userArr,
    };

    const accessToken = window.localStorage.getItem('accessToken');

    $.ajax({
        url: '/api/userAuth/',
        type: 'PUT',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', accessToken);
        },
    }).then(
        data => {
            if (data.header.result_code === 'ok') {
                alert(data.header.message);
                refreshSearch();
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
                        alert(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    alert(data.message);
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

/**
 *  refreshSearch :  재검색하기
 */

const refreshSearch = () => {
    pageInit();
    $('#searchStr').val('');
    selectedData = [];
    grid2.resetData(selectedData);
    search();
};

$(document).ready(() => {
    const params = {};
    const option = {
        oTxt: 'auth_nm',
        oVal: 'auth_idntf_key',
    };
    setCommSelBox(
        'authIdntfKey',
        '/api/auth/useAuth',
        'POST',
        'SEL',
        '',
        params,
        option
    );

    setCodeSelBox('corpCd', 'CORP_CD', 'ALL', '');

    // 그리드 세팅
    grid = setGridLayout();
    grid2 = setGridLayout2();

    // 페이징 세팅
    pagination = setPagination(page, pagingCallback);

    // 검색버튼 클릭시 검색
    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    // 추가 버튼 클릭 이벤트
    $('#addBtn').click(() => {
        setAuthUser();
    });

    // 삭제 버튼 클릭 이벤트
    $('#delBtn').click(() => {
        deleteAuthUser();
    });

    // 저장 버튼 클릭 이벤트
    $('#saveBtn').click(() => {
        insertProc();
    });

    // 뒤로가기 버튼 클릭 이벤트
    $('#backBtn').click(() => {
        location.href = '/page/user/userAuth';
    });

    const searchStrInput = document.getElementById('searchStr');

    searchStrInput.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });
});
