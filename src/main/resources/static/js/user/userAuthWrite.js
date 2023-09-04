import {setCodeSelBoxCall, setCommSelBox} from '../module/component';
import Page, {setPagination} from '../module/pagination';
import {serializeFormJson} from '../module/json';
import {
    setCheckBoxGrid,
    getCheckedRows,
    setCheckBoxGridId,
} from '../module/grid';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi} from '../module/async';

let page = new Page(1, false, 10, 0);
let grid;
let grid2;
let pagination;
let selectedData = [];

const $authId = $('#authId'); //권한식별키

// 페이징 초기화
const pageInit = () => {
    page = new Page(1, false, Number($('#size').val()), 0);
};

/**
 * search : 조회
 */
const search = () => {
    const params = serializeFormJson('userAuthWriteFrm');
    params.page = page.page;
    params.size = page.size;

    if (params.authId === '') {
        alert('권한을 선택하세요.');
        return;
    }

    spinnerShow();

    const url = '/api/userAuth/input-user';
    const type = 'POST';

    callApi(url, type, params, searchSuccess, searchError);
};

/**
 *  searchSuccess : search successCallback
 */
const searchSuccess = result => {
    const gridData = result.data;
    page.totalCount = result.totalCount;
    grid.resetData(gridData);

    if (page.pageInit === false) {
        pagination.reset(result.totalCount);
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
 * setGridLayout : Choose User 그리드 구성
 */
const setGridLayout = () => {
    const columns = [
        {header: 'SEQ', name: 'userId', align: 'center', hidden: true},
        {header: '아이디', name: 'loginId', align: 'center'},
        {header: '이름', name: 'userNm', align: 'center'},
        {header: '휴대폰번호', name: 'telNo', align: 'center'},
    ];
    const gridData = [];

    return setCheckBoxGrid(columns, gridData);
};

/**
 * setGridLayout2 : Selected User 그리드 구성
 */
const setGridLayout2 = () => {
    const columns = [
        {header: 'SEQ', name: 'userId', align: 'center', hidden: true},
        {header: '아이디', name: 'loginId', align: 'center'},
        {header: '이름', name: 'userNm', align: 'center'},
        {header: '휴대폰번호', name: 'telNo', align: 'center'},
    ];
    const gridData = [];
    return setCheckBoxGridId(columns, gridData, 'grid2');
};

/**
 * pagingCallback : 페이징 콜백
 */
const pagingCallback = returnPage => {
    page.page = returnPage;
    search();
};

/**
 * setUserAuth : 사용자 선택
 */
const setUserAuth = () => {
    if ($authId.val() === '') {
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
            arr.findIndex(item => item.userId === character.userId) === idx
    );

    return uniqueData;
};

/**
 * deleteUserAuth : 사용자 삭제
 */
const deleteUserAuth = () => {
    grid2.removeCheckedRows();
    selectedData = grid2.getData();
};

/**
 *  save : 권한 등록
 */
const save = () => {
    if ($authId.val() === '') {
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
        userArr.push(obj.userId);
    }

    const params = {
        authId: $('#authId').val(),
        userArr: userArr,
    };

    const url = '/api/userAuth';
    const type = 'PUT';

    callApi(url, type, params, saveSuccess, saveError);
};

/**
 *  saveSuccess : save successCallback
 */
const saveSuccess = result => {
    if (result.header.resultCode === 'ok') {
        alert(result.header.message);
        refreshSearch();
    }

    spinnerHide();
};

/**
 *  saveError : save errorCallback
 */
const saveError = response => {
    spinnerHide();
    console.log(response);
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

/**
 *  setAuthIdSelBox :  권한 셀렉트박스 조회
 */
const setAuthIdSelBox = () => {
    const params = {};
    const option = {
        oTxt: 'authNm',
        oVal: 'authId',
    };
    setCommSelBox(
        'authId',
        `/api/item/auth/auth-roles/${$('#authRole').val()}`,
        'POST',
        'SEL',
        '',
        params,
        option
    );
};

$(document).ready(() => {
    setCodeSelBoxCall('authRole', 'AUTH_ROLE', '', '', setAuthIdSelBox);

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

    // 권한변경 이벤트
    $('#authId').change(() => {
        if ($authId.val() !== '') {
            pageInit();
            search();
        }
    });

    $('#authRole').change(() => {
        setAuthIdSelBox();
    });


    // 추가 버튼 클릭 이벤트
    $('#addBtn').click(() => {
        setUserAuth();
    });

    // 삭제 버튼 클릭 이벤트
    $('#delBtn').click(() => {
        deleteUserAuth();
    });

    // 저장 버튼 클릭 이벤트
    $('#saveBtn').click(() => {
        save();
    });

    // 뒤로가기 버튼 클릭 이벤트
    $('#backBtn').click(() => {
        location.href = '/page/user/userAuth';
    });

    const loginId = document.getElementById('loginId');

    loginId.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });

    const userNm = document.getElementById('userNm');

    userNm.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });
});
