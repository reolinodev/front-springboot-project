import {
    setCodeSelBox,
    setCommSelBoxCall,
    setCodeSelBoxCall,
} from '../module/component';
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

const pageInit = () => {
    page = new Page(1, false, Number($('#pagePer').val()), 0);
};

/**
 * setGridLayout : 그리드 구성
 */
const setGridLayout = () => {
    // 헤더 생성
    const columns = [
        {header: 'No', name: 'rnum', width: 100, align: 'center'},
        {
            header: 'SEQ',
            name: 'qna_id',
            width: 100,
            align: 'center',
            hidden: true,
        },
        {header: '게시판', name: 'board_title', width: 150, align: 'center'},
        {
            header: '게시글명',
            name: 'qna_title',
            align: 'center',
            renderer: {
                styles: {
                    color: '#0863c8',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                },
            },
        },
        {header: '작성자', name: 'created_nm', width: 100, align: 'center'},
        {header: '답변자', name: 'response_nm', width: 100, align: 'center'},
        {header: '작성일', name: 'created_at', width: 150, align: 'center'},
        {
            header: '답변여부',
            name: 'response_yn_nm',
            width: 100,
            align: 'center',
        },
        {header: '사용여부', name: 'use_yn_nm', width: 100, align: 'center'},
    ];
    // 데이터
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

/**
 * qnaAnswer : qna 수정
 */
const qnaAnswer = qnaId => {
    location.href = `/page/board/qna/answer/${qnaId}`;
};

/**
 * search : 조회
 */
const search = () => {
    spinnerShow();

    let url = `/api/qna`;
    const type = 'POST';

    const params = serializeFormJson('qnaFrm');
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
        const gridData = result.data;
        page.totalCount = result.total;
        grid.resetData(gridData);

        if (page.pageInit === false) {
            page.pageInit = true;
            setGridClickEvent(grid, 'qna_title', 'qna_id', qnaAnswer);
            pagination.reset(result.total);
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
        '/api/item/board/QNA/Y',
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
        'USE_YN',
        'ALL',
        sessionParam.use_yn,
        setResponseYnCall
    );
};

const setResponseYnCall = () => {
    setCodeSelBoxCall(
        'responseYn',
        'RESPONSE_YN',
        'ALL',
        sessionParam.response_yn,
        setMoveToPagination
    );
};

const setMoveToPagination = () => {
    pagination.movePageTo(sessionParam.current_page);
};

$(document).ready(() => {
    setBasicDataRange('start_date', 'end_date', '1years');

    grid = setGridLayout();

    pagination = setPagination(page, pagingCallback);

    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    $('#boardId').change(() => {
        pageInit();
        search();
    });

    $('#responseYn').change(() => {
        pageInit();
        search();
    });

    $('#useYn').change(() => {
        pageInit();
        search();
    });

    const qnaTitleInput = document.getElementById('qnaTitle');

    qnaTitleInput.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });

    const createdNmInput = document.getElementById('createdNm');

    createdNmInput.addEventListener('keyup', function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById('searchBtn').click();
        }
    });

    //첫진입과 뒤로가기로 진입했을 경우 파라미터 세팅
    if (status === 'init') {
        window.sessionStorage.removeItem('params');
        setCodeSelBox('responseYn', 'RESPONSE_YN', 'ALL', '');
        setCodeSelBox('useYn', 'USE_YN', 'ALL', '');
        setBoardBoxCall('', search);
    } else {
        sessionParam = JSON.parse(window.sessionStorage.getItem('params'));

        $('input[name=qna_title]').val(sessionParam.qna_title);
        $('input[name=created_nm]').val(sessionParam.created_nm);
        $('input[name=start_date]').val(sessionParam.start_date);
        $('input[name=end_date]').val(sessionParam.end_date);

        page.currentPage = sessionParam.current_page;
        page.page_per = sessionParam.page_per;

        setBoardBoxCall(sessionParam.board_id, setUseYnCall);
    }
});
