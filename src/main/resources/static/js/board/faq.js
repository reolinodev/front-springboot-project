import {
    setCommSelBoxCall,
    setCodeSelBoxCall,
    setCodeSelBox,
} from '../module/component';
import Page, {setPagination} from '../module/pagination';
import {setBasicGrid, setGridClickEvent} from '../module/grid';
import {serializeFormJson} from '../module/json';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi} from '../module/async';

let page = new Page(1, false, 10, 0);
let grid;
let pagination;
let sessionParam;
const status = $('#status').val();

const pageInit = () => {
    page = new Page(1, false, Number($('#pagePer').val()), 0);
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
            name: 'faq_id',
            width: 100,
            align: 'center',
            hidden: true,
        },
        {header: '게시판', name: 'board_title', width: 200, align: 'center'},
        {
            header: '게시글명',
            name: 'faq_title',
            align: 'center',
            renderer: {
                styles: {
                    color: '#0863c8',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                },
            },
        },
        {header: '작성자', name: 'created_nm', width: 200, align: 'center'},
        {header: '사용여부', name: 'use_yn_nm', width: 150, align: 'center'},
    ];
    // 데이터
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

/**
 * postView : 게시글 보기
 */
const faqView = faqId => {
    location.href = `/page/board/faq/edit/${faqId}`;
};

/**
 * search : 조회
 */
const search = () => {
    spinnerShow();

    let url = `/api/faq`;
    const type = 'POST';

    const params = serializeFormJson('faqFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;
    window.sessionStorage.setItem('params', JSON.stringify(params));

    callApi(url, type, params, searchSuccess, searchError);
};

/**
 *  searchSuccess : search successCallback
 */
const searchSuccess = result => {
    if (result.header.result_code === 'ok') {
        console.log('result', result);
        const gridData = result.data;
        page.totalCount = result.total;
        grid.resetData(gridData);

        setGridClickEvent(grid, 'faq_title', 'faq_id', faqView);

        if (status === 'init') {
            if (page.pageInit === false) {
                pagination.reset(result.total);
                page.pageInit = true;
            }
        } else {
            if (page.pageInit === false) {
                page.pageInit = true;
                pagination.reset(result.total);
                pagination.movePageTo(sessionParam.current_page);
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
    page.currentPage = returnPage;
    search();
};

const setBoardBoxCall = (selected, callback) => {
    const params = {};

    const option = {
        oTxt: 'board_title',
        oVal: 'board_id',
    };

    setCommSelBoxCall(
        'boardId',
        '/api/item/board/FAQ/Y',
        'POST',
        'ALL',
        selected,
        params,
        option,
        callback
    );
};

const setUseYnCall = () => {
    setCodeSelBoxCall('useYn', 'USE_YN', 'ALL', sessionParam.use_yn, search);
};

$(document).ready(() => {
    grid = setGridLayout();
    pagination = setPagination(page, pagingCallback);

    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    $('#writeBtn').click(() => {
        location.href = '/page/board/faq/write';
    });

    $('#boardId').change(() => {
        pageInit();
        search();
    });

    $('#useYn').change(() => {
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

    //첫진입과 뒤로가기로 진입했을 경우 파라미터 세팅
    if (status === 'init') {
        window.sessionStorage.removeItem('params');
        setCodeSelBox('useYn', 'USE_YN', 'ALL', '');
        setBoardBoxCall('', search);
    } else {
        sessionParam = JSON.parse(window.sessionStorage.getItem('params'));

        $('input[name=faq_title]').val(sessionParam.faq_title);

        page.currentPage = sessionParam.current_page;
        page.page_per = sessionParam.page_per;

        setBoardBoxCall(sessionParam.board_id, setUseYnCall);
    }
});
