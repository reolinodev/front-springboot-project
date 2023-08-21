import {setCodeSelBoxCall, setCommSelBoxCall} from '../module/component';
import Page, {setPagination} from '../module/pagination';
import {setCheckBoxGrid} from '../module/grid';
import {serializeFormJson} from '../module/json';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi} from '../module/async';

let page = new Page(1, false, 10, 0);
let grid;
let pagination;

/**
 * setGridLayout : 그리드 구성
 */
const setGridLayout = () => {
    // 헤더 생성
    const columns = [
        {
            header: 'ID',
            name: 'userAuthId',
            align: 'center',
            width: 50,
        },
        {
            header: 'authId',
            name: 'authId',
            align: 'center',
            hidden: true,
        },
        {
            header: 'userId',
            name: 'userId',
            align: 'center',
            hidden: true,
        },
        {header: '권한구분', name: 'authRoleLabel', align: 'center'},
        {header: '권한명', name: 'authNm', align: 'center'},
        {header: '아이디', name: 'loginId', align: 'center'},
        {header: '이름', name: 'userNm', align: 'center'},
    ];
    // 데이터
    const gridData = [];

    return setCheckBoxGrid(columns, gridData);
};

/**
 * pagingCallback : 페이징 콜백
 */
const pagingCallback = returnPage => {
    page.page = returnPage;
    search();
};

const pageInit = () => {
    page = new Page(1, false, Number($('#size').val()), 0);
};

/**
 * search : 조회
 */
const search = () => {
    spinnerShow();

    const url = '/api/userAuth';
    const type = 'POST';
    const params = serializeFormJson('authUserViewFrm');
    params.page = page.page;
    params.size = page.size;

    callApi(url, type, params, searchSuccess, searchError);
};

/**
 *  searchSuccess : search successCallback
 */
const searchSuccess = result => {
    spinnerHide();

    const gridData = result.data;
    page.totalCount = result.totalCount;
    grid.resetData(gridData);

    if (page.pageInit === false) {
        pagination.reset(result.totalCount);
        page.pageInit = true;
    }

    if ($('#viewAuthId').val() !== '') {
        $('#deleteBtn').show();
    } else {
        $('#deleteBtn').hide();
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
 *  userAuthDelete : 사용자권한 삭제
 */
const userAuthDelete = () => {
    const checkedRows = grid.getCheckedRows();
    if (checkedRows.length === 0) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    const userAuthArr = [];

    for (const obj of checkedRows) {
        userAuthArr.push(obj.userAuthId);
    }

    spinnerShow();

    const url = '/api/userAuth';
    const type = 'DELETE';
    const params = {
        userAuthArr: userAuthArr,
    };

    callApi(url, type, params, userAuthDeleteSuccess, userAuthDeleteError);
};

/**
 *  userAuthDelete : userAuthDelete successCallback
 */
const userAuthDeleteSuccess = result => {
    if (result.header.resultCode === 'ok') {
        alert(result.header.message);
        pageInit();
        search();
    }

    spinnerHide();
};

/**
 *  userAuthDeleteError : userAuthDelete errorCallback
 */
const userAuthDeleteError = response => {
    spinnerHide();
    console.log(response);
};

/**
 *  setAuthIdSelBox : 권한 셀렉트 박스 조회
 */
const setAuthIdSelBox = () => {
    const params = {};
    const option = {
        oTxt: 'authNm',
        oVal: 'authId',
    };
    setCommSelBoxCall(
        'viewAuthId',
        `/api/item/auth/auth-roles/${$('#viewAuthRole').val()}`,
        'POST',
        'ALL',
        '',
        params,
        option,
        search
    );
};

$(document).ready(() => {
    setCodeSelBoxCall('viewAuthRole', 'AUTH_ROLE', '', '', setAuthIdSelBox);

    /**
     * 사용자권한 등록
     */
    $('#writeBtn').click(() => {
        location.href = '/page/user/userAuth/write';
    });

    // 검색버튼
    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    // 권한구분 변경시 권한명 수정
    $('#viewAuthRole').change(() => {
        setAuthIdSelBox();
    });

    // 권한 변경시 조회
    $('#viewAuthId').change(() => {
        search();
    });

    // 삭제버튼 클릭 이벤트
    $('#deleteBtn').click(() => {
        if (confirm('사용자 권한을 삭제할까요?')) {
            userAuthDelete();
        }
    });

    // 그리드 세팅
    grid = setGridLayout();

    // 페이징 세팅
    pagination = setPagination(page, pagingCallback);

    const viewLoginId = document.getElementById('viewLoginId');
    const viewUserNm = document.getElementById('viewUserNm');

    viewLoginId.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });

    viewUserNm.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });
});
