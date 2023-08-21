import {setCodeSelBoxCall, setCodeSelBox} from '../module/component';
import Page, {setPagination} from '../module/pagination';
import {setBasicGrid, setGridClickEvent} from '../module/grid';
import {serializeFormJson} from '../module/json';
import {setBasicDataRange} from '../module/datePicker';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi} from '../module/async';

let page = new Page(1, false, 10, 0);
let grid;
let pagination;
let sessionParam;
const status = $('#status').val();
const boardId = $('#boardId').val();

const authId = window.sessionStorage.getItem('authId');

const pageInit = () => {
    page = new Page(1, false, Number($('#size').val()), 0);
};

/**
 * setGridLayout : 그리드 구성
 */
const setGridLayout = () => {
    // 헤더 생성
    const columns = [
        {
            header: 'ID',
            name: 'postId',
            width: 100,
            align: 'center',
        },
        {
            header: '게시글명',
            name: 'postTitle',
            align: 'center',
            renderer: {
                styles: {
                    color: '#0863c8',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                },
            },
        },
        {header: '작성자', name: 'createdIdLabel', width: 200, align: 'center'},
        {header: '작성일', name: 'createdAtLabel', width: 200, align: 'center'},
        {header: '사용여부', name: 'useYnLabel', width: 150, align: 'center'},
    ];
    // 데이터
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

/**
 * postView : 게시글 보기
 */
const postView = postId => {
    location.href = `/page/board/post/view/normal/${postId}`;
};

/**
 * search : 조회
 */
const search = () => {
    spinnerShow();

    let url = `/api/post`;
    const type = 'POST';

    const params = serializeFormJson('postViewFrm');
    params.page = page.page;
    params.size = page.size;
    window.sessionStorage.setItem('params', JSON.stringify(params));

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

        setGridClickEvent(grid, 'postTitle', 'postId', postView);

        if (status === 'init') {
            if (page.pageInit === false) {
                pagination.reset(result.totalCount);
                page.pageInit = true;
            }
        } else {
            if (page.pageInit === false) {
                page.pageInit = true;
                pagination.reset(result.totalCount);
                pagination.movePageTo(sessionParam.page);
            }
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
 * pagingCallback : 페이징 콜백
 */
const pagingCallback = returnPage => {
    page.page = returnPage;
    search();
};

/**
 * setUseYnCall :  사용여부 콜백
 */
const setUseYnCall = () => {
    setCodeSelBoxCall('useYn', 'USE_YN', 'ALL', sessionParam.useYn, search);
};

const getBoardAuth = () => {
    const url = '/api/post/auth';
    const type = 'POST';
    const params = {
        boardId: boardId,
        authId: authId,
    };

    callApi(url, type, params, getBoardAuthSuccess, getBoardAuthError);
};

/**
 *  getBoardAuthSuccess : getBoardAuth successCallback
 */
const getBoardAuthSuccess = result => {
    if (result.header["resultCode"] === 'ok') {
        if (result.data !== 1) {
            $('#writeBtn').hide();
        } else {
            $('#writeBtn').show();
        }
    }

    spinnerHide();
};

/**
 *  getBoardAuthError : getBoardAuth errorCallback
 */
const getBoardAuthError = response => {
    spinnerHide();
    console.log(response.message);
};

$(document).ready(() => {
    setBasicDataRange('startDate', 'endDate', '1years');

    getBoardAuth();

    grid = setGridLayout();
    pagination = setPagination(page, pagingCallback);

    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    $('#writeBtn').click(() => {
        location.href = `/page/board/post/write/normal/${boardId}`;
    });

    $('#boardId').change(() => {
        pageInit();
        search();
    });

    $('#useYn').change(() => {
        pageInit();
        search();
    });

    const postTitle = document.getElementById('postTitle');

    postTitle.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });

    const createdNm = document.getElementById('createdNm');

    createdNm.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });

    //첫진입과 뒤로가기로 진입했을 경우 파라미터 세팅
    if (status === 'init') {
        window.sessionStorage.removeItem('params');
        setCodeSelBox('useYn', 'USE_YN', 'ALL', '');
        search();
    } else {
        sessionParam = JSON.parse(window.sessionStorage.getItem('params'));

        $('input[name=startDate]').val(sessionParam.startDate);
        $('input[name=endDate]').val(sessionParam.endDate);
        $('input[name=postTitle]').val(sessionParam.postTitle);
        $('input[name=createdNm]').val(sessionParam.createdNm);

        page.page = sessionParam.page;
        page.size = sessionParam.size;

        setUseYnCall();
    }
});
