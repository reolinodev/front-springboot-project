import {setCommSelBoxCall} from '../module/component';
import Page, {setPagination} from '../module/pagination';
import {
    setBasicGrid,
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
    page = new Page(1, false, Number($('#size').val()), 0);
};

/**
 * setGridLayout : 그리드 구성
 */
const setGridLayout = () => {
    // 헤더 생성
    const columns = [
        {header: 'ID', name: 'qnaId', width: 100, align: 'center', hidden: true,},
        {
            header: '게시글명',
            name: 'qnaTitle',
            align: 'center',
            renderer: {
                styles: {
                    color: '#0863c8',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                },
            },
        },
        {header: '작성자', name: 'createdIdLabel', width: 100, align: 'center'},
        {header: '답변자', name: 'responseIdLabel', width: 100, align: 'center'},
        {header: '공개여부', name: 'hiddenYnLabel', width: 100, align: 'center'},
        {header: '답변여부', name: 'responseLabel', width: 100, align: 'center',},
        {header: '비밀번호', name: 'qnaPw', width: 50, align: 'center', hidden: true,},
    ];
    // 데이터
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

/**
 * qnaView : 상세화면 및 수정화면 이동
 */
const qnaView = rowData => {
    const hiddenYn = rowData.hiddenYn;
    const createdId = rowData.createdId;
    const qnaPw = rowData.qnaPw;
    const qnaId = rowData.qnaId;

    const userId = sessionStorage.getItem('userId');

    if (hiddenYn === 'N' && Number(createdId) === Number(userId)) {
        location.href = `/page/board/qna/edit/${qnaId}`;
    } else if (hiddenYn === 'Y' && Number(createdId) === Number(userId)) {
        const inputString = prompt('비공개 글입니다.');
        if(inputString !== qnaPw){
            alert('비밀번호가 일치하지 않습니다. 비밀번호를 잊었을 경우 관리자에게 문의하세요.');
        }else{
            location.href = `/page/board/qna/edit/${qnaId}`;
        }

    } else if (hiddenYn === 'Y' ) {
        alert('비공개 글입니다.');
    }
    else {
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
    params.page = page.page;
    params.size = page.size;
    window.sessionStorage.setItem('params', JSON.stringify(params));

    callApi(url, type, params, searchSuccess, searchError);
};

/**
 *  searchSuccess : search successCallback
 */
const searchSuccess = result => {
    if (result.header.resultCode === 'ok') {
        const gridData = result.data;
        page.totalCount = result.totalCount;
        grid.resetData(gridData);

        if (page.pageInit === false) {
            page.pageInit = true;
            setGridClickRowEvent(grid, 'qnaTitle', qnaView);
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

const setBoardBoxCall = (selected, callback) => {
    const params = {};

    const option = {
        oTxt: 'boardTitle',
        oVal: 'boardId',
    };

    setCommSelBoxCall(
        'boardId',
        '/api/item/board/QNA',
        'POST',
        'ALL',
        selected,
        params,
        option,
        callback
    );
};

const setMoveToPagination = () => {
    pagination.movePageTo(sessionParam.page);
};

$(document).ready(() => {
    setBasicDataRange('startDate', 'endDate', '1years');

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

        $('input[name=qnaTitle]').val(sessionParam.qnaTitle);
        $('input[name=created_nm]').val(sessionParam.created_nm);
        $('input[name=startDate]').val(sessionParam.startDate);
        $('input[name=endDate]').val(sessionParam.endDate);

        page.page = sessionParam.page;
        page.size = sessionParam.size;

        setBoardBoxCall(boardId, setMoveToPagination);
    }
});
