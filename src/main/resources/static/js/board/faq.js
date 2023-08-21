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
            width: 50,
            align: 'center',
        },
        {header: '게시판', name: 'boardTitle', width: 200, align: 'center'},
        {
            header: '게시글명',
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
        {header: '작성자', name: 'createdIdLabel', width: 200, align: 'center'},
        {header: '사용여부', name: 'useYnLabel', width: 150, align: 'center'},
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
            pagination.reset(result.totalCount);
            page.pageInit = true;
            setGridClickEvent(grid, 'faqTitle', 'faqId', faqView);
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

const setBoardBoxCall = (selected, callback) => {
    const params = {};

    const option = {
        oTxt: 'boardTitle',
        oVal: 'boardId',
    };

    setCommSelBoxCall(
        'boardId',
        '/api/item/board/FAQ',
        'POST',
        'ALL',
        selected,
        params,
        option,
        callback
    );
};

const setUseYnCall = () => {
    setCodeSelBoxCall(
        'useYn',
        'useYn',
        'ALL',
        sessionParam.useYn,
        setMoveToPagination
    );
};

const setMoveToPagination = () => {
    pagination.movePageTo(sessionParam.page);
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

        $('input[name=faqTitle]').val(sessionParam.faqTitle);

        page.page = sessionParam.page;
        page.size = sessionParam.size;

        setBoardBoxCall(sessionParam.boardId, setUseYnCall);
    }
});
