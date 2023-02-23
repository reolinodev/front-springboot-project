import {setCodeSelBox, setCommSelBoxCall} from '../module/component';
import Page, {setPagination} from '../module/pagination';
import {
    setBasicGrid,
    setGridClickEvent,
    setGridClickRowEvent,
} from '../module/grid';
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
        {header: '공개여부', name: 'hidden_yn_nm', width: 100, align: 'center'},
        {
            header: '답변여부',
            name: 'response_yn_nm',
            width: 100,
            align: 'center',
        },
    ];
    // 데이터
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

/**
 * qnaView : 상세화면 및 수정화면 이동
 */
const qnaView = rowData => {
    const hiddenYn = rowData.hidden_yn;
    const createdId = rowData.created_id;
    const userId = sessionStorage.getItem('userId');
    const qnaId = rowData.qna_id;

    if (createdId === userId) {
        location.href = `/page/board/qna/edit/${qnaId}`;
    } else if (hiddenYn === 'Y') {
        alert('비공개 글입니다.');
    } else {
        location.href = `/page/board/qna/detail/${qnaId}`;
    }
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
            setGridClickRowEvent(grid, 'qna_title', qnaView);
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

const setMoveToPagination = () => {
    pagination.movePageTo(sessionParam.current_page);
};

$(document).ready(() => {
    setBasicDataRange('start_date', 'end_date', '1years');

    grid = setGridLayout();

    pagination = setPagination(page, pagingCallback);

    $('#writeBtn').click(() => {
        location.href = `/page/board/qna/write/${boardId}`;
    });

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
        setBoardBoxCall(boardId, search);
    } else {
        sessionParam = JSON.parse(window.sessionStorage.getItem('params'));

        $('input[name=qna_title]').val(sessionParam.qna_title);
        $('input[name=created_nm]').val(sessionParam.created_nm);
        $('input[name=start_date]').val(sessionParam.start_date);
        $('input[name=end_date]').val(sessionParam.end_date);

        page.currentPage = sessionParam.current_page;
        page.page_per = sessionParam.page_per;

        setBoardBoxCall(boardId, setMoveToPagination);
    }
});
