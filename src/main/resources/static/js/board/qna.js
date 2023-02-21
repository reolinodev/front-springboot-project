import { setCommSelBox, setCodeSelBox } from '../module/component';
import Page, { setPagination } from '../module/pagination';
import { setBasicGrid, setGridClickEvent } from '../module/grid';
import { serializeFormJson } from '../module/json';
import { setBasicDataRange } from '../module/datePicker';

let page = new Page(1, false, 10, 0);
let grid;
let pagination;

const pageInit = () => {
    page = new Page(1, false, Number($('#pagePer').val()), 0);
};

/**
 * setGridLayout : 그리드 구성
 */
const setGridLayout = () => {
    // 헤더 생성
    const columns = [
        { header: 'No', name: 'rnum', width: 100, align: 'center' },
        {
            header: 'SEQ',
            name: 'qna_id',
            width: 100,
            align: 'center',
            hidden: true,
        },
        { header: '게시판', name: 'board_title', width: 150, align: 'center' },
        {
            header: '질의 유형',
            name: 'qna_type_nm',
            width: 150,
            align: 'center',
        },
        { header: '제목', name: 'title', align: 'left' },
        { header: '이름', name: 'created_nm', width: 100, align: 'center' },
        { header: '생성일', name: 'created_at', width: 150, align: 'center' },
        {
            header: '응답여부',
            name: 'response_yn_nm',
            width: 100,
            align: 'center',
        },
        { header: '사용여부', name: 'use_yn_nm', width: 100, align: 'center' },
    ];
    // 데이터
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

/**
 * qnaEditView : qna 수정
 */
const qnaEditView = (qnaId) => {
    location.href = `/admin/board/qna/edit/${qnaId}`;
};

/**
 * search : 조회
 */
const search = () => {
    const params = serializeFormJson('qnaViewFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;

    $.ajax({
        url: '/api/admin/qna/',
        type: 'POST',
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' },
        success(result) {
            const gridData = result.data;
            page.totalCount = result.total;
            grid.resetData(gridData);

            // eslint-disable-next-line no-use-before-define
            setGridClickEvent(grid, 'title', 'qna_id', qnaEditView);

            if (page.pageInit === false) {
                pagination.reset(result.total);
                page.pageInit = true;
            }
        },
        error(request, status, error) {
            // eslint-disable-next-line no-useless-concat
            console.log(
                `code:${request.status}\n` +
                    `message:${request.responseText}\n` +
                    `error:${error}`
            );
        },
    });
};

/**
 * pagingCallback : 페이징 콜백
 */
const pagingCallback = (returnPage) => {
    page.currentPage = returnPage;
    search();
};

$(document).ready(() => {
    const option = {
        oTxt: 'title',
        oVal: 'board_id',
    };

    const params = {};

    setCommSelBox(
        'boardId',
        '/api/admin/board/qna',
        'POST',
        'ALL',
        '',
        params,
        option
    );

    setCodeSelBox('qnaType', 'QNA_TYPE', 'ALL', '');

    setCodeSelBox('responseYn', 'RESPONSE_YN', 'ALL', '');

    setCodeSelBox('useYn', 'USE_YN', 'ALL', '');

    setBasicDataRange('start_date', 'end_date', '1years');

    grid = setGridLayout();

    pagination = setPagination(page, pagingCallback);

    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    $('#pagePer').change(() => {
        pageInit();
        pagination = setPagination(page, pagingCallback);
        search();
    });

    $('#boardId').change(() => {
        pageInit();
        search();
    });

    $('#qnaType').change(() => {
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

    search();
});
