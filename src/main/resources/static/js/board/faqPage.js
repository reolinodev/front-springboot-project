import Page, {setPagination} from '../module/pagination';
import {setBasicGrid, setGridClickRowEvent} from '../module/grid';
import {serializeFormJson} from '../module/json';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi, callApiWithoutBody} from '../module/async';
import {setBasicViewer} from '../module/editor';

let page = new Page(1, false, 10, 0);
let grid;
let pagination;

const $viewFaqTitle = $('#viewFaqTitle');

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
            name: 'faqId',
            width: 100,
            align: 'center',
        },
        {
            header: '제목',
            name: 'faqTitle',
            align: 'center',
            renderer: {
                styles: {
                    color: '#0863c8',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                },
            },
        },
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

    let url = `/api/faq`;
    const type = 'POST';

    const params = serializeFormJson('faqFrm');
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

        if (page.pageInit === false) {
            page.pageInit = true;
            setGridClickRowEvent(grid, 'faqTitle', faqView);
            pagination.reset(result.totalCount);
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
 * faqView : 상세화면 및 수정화면 이동
 */
const faqView = rowData => {
    getFaqData(rowData.faqId);
};

/**
 * getFaqData : FAQ 상세데이터 조회
 */
const getFaqData = faqId => {
    spinnerShow();
    callApiWithoutBody(
        `/api/faq/${faqId}`,
        'GET',
        getFaqDataSuccess,
        getFaqDataError
    );
};

/**
 *  getFaqDataSuccess : getFaqData successCallback
 */
const getFaqDataSuccess = result => {
    if (result.header["resultCode"] === 'ok') {
        setFaqData(result.data);
    }
    spinnerHide();
};

/**
 *  getFaqDataError : getFaqData errorCallback
 */
const getFaqDataError = response => {
    spinnerHide();
    console.log(response.message);
};

const setFaqData = data => {
    $viewFaqTitle.val(data.faqTitle);
    setBasicViewer('viewer', data.mainText);

    window.$('#faqView').modal('show');
};

$(document).ready(() => {
    grid = setGridLayout();

    pagination = setPagination(page, pagingCallback);

    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    const faqTitleInput = document.getElementById('faqTitle');

    faqTitleInput.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });

    search();
});
