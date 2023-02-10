import { setCommSelBoxCall, setCodeSelBoxCall } from '../module/component';
import Page, { setPagination } from '../module/pagination';
import { setBasicGrid, setGridClickEvent } from '../module/grid';
import { serializeFormJson } from '../module/json';
import { setBasicDataRange } from '../module/datePicker';
import { mainViewTokenInvalidate, setAccessToken } from "../module/router";
import { spinnerHide, spinnerShow } from "../module/spinner";

let page = new Page(1, false, 10, 0);
let grid;
let pagination;
let sessionParam;
const status = $("#status").val();

const authIdntfKey = window.sessionStorage.getItem("authIdntfKey");

const pageInit = () => {
    page = new Page(1, false, Number($('#pagePer').val()), 0);
};

/**
 * setGridLayout : 그리드 구성
 */
const setGridLayout = () => {
    // 헤더 생성
    const columns = [
        { header: 'No', name: 'rnum', width: 50, align: 'center' },
        { header: 'SEQ', name: 'post_idntf_key', width: 100, align: 'center', hidden: true},
        { header: '게시판', name: 'board_title', width: 200, align: 'center'},
        { header: '게시글명', name: 'post_title', align: 'center', renderer: { styles: {color: '#0863c8', textDecoration : 'underline', cursor: 'pointer'}}},
        { header: '작성자', name: 'sys_mdfcn_nm', width: 200, align: 'center' },
        { header: '작성일', name: 'sys_mdfcn_dt_val', width: 200, align: 'center'},
        { header: '사용여부', name: 'use_yn_nm', width: 150, align: 'center' },
    ];
    // 데이터
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

/**
 * postView : 게시글 보기
 */
const postView = (postId) => {
    const boardKey = $("#boardKey").val();

    let url = `/page/board/post/view/${postId}`;
    if(boardKey !== ''){
        url = `/page/board/post/view/${postId}/`+boardKey
    }

    location.href = url;
};

/**
 * search : 조회
 */
const search = () => {

    spinnerShow();

    const params = setParamter();
    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/post/',
        type: 'POST',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            const gridData = result.data;
            page.totalCount = result.total;
            grid.resetData(gridData);

            setGridClickEvent(grid, 'post_title', 'post_idntf_key', postView);

            if (page.pageInit === false) {
                pagination.reset(result.total);
                page.pageInit = true;
            }

            spinnerHide();
        },
        error(request, status, error) {
            console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);

            if(request.status === 401){
                setAccessToken(request.responseJSON);
                search();
            }
            else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        },
    });
};


/**
 * backSearch : 돌아가기 버튼시 조회
 */
const backSearch = () => {

    spinnerShow();

    const params = setParamter();
    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/post/',
        type: 'POST',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            const gridData = result.data;
            page.totalCount = result.total;
            page.pageInit = true;
            grid.resetData(gridData);

            setGridClickEvent(grid, 'post_title', 'post_idntf_key', postView);

            pagination.reset(result.total);
            pagination.movePageTo(sessionParam.current_page);

            spinnerHide();
        },
        error(request, status, error) {
            console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);

            if(request.status === 401){
                setAccessToken(request.responseJSON);
                search();
            }
            else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        },
    });
};

/**
* getBoardAuth : 해당 게시판의 입력 권한이 있는지 조회
*/
const getBoardAuth = (boardIdntfKey) => {
    const params = {
        board_idntf_key : boardIdntfKey,
        auth_idntf_key : authIdntfKey
    }

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/post/boardAuth',
        type: 'POST',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
           const cnt = result.data;
           if(cnt === 1){
               $("#writeBtn").show();
           }else {
               $("#writeBtn").hide();
           }
        },
        error(request, status, error) {
            console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);

            if(request.status === 401){
                setAccessToken(request.responseJSON);
                getBoardAuth(boardIdntfKey);
            }
            else if(request.status === 403){
                mainViewTokenInvalidate();
            }
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

const setUseYn = () => {
    if(status === 'back'){
        setCodeSelBoxCall('useYn', 'USE_YN', 'ALL', sessionParam.use_yn, backSearch);
    }else {
        setCodeSelBoxCall('useYn', 'USE_YN', 'ALL', '', search);
    }
}

/**
 * setParamter : 검색 파라미터 세팅
 */
const setParamter= () => {

    const params = serializeFormJson('postViewFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;

    window.sessionStorage.setItem("params", JSON.stringify(params));

    return params;
}

$(document).ready(() => {

    const boardKey = $("#boardKey").val();

    if(boardKey !== '') {
        $("#boardKeyDiv").hide();
        //입력수정 권한 조회
        getBoardAuth(boardKey);
    }

    grid = setGridLayout();
    pagination = setPagination(page, pagingCallback);

    setBasicDataRange('start_date', 'end_date', '1years');

    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    $('#writeBtn').click(() => {
        let url = '/page/board/post/write';
        if(boardKey !== ''){
            url = `/page/board/post/write/`+boardKey
        }

        location.href = url;
    });

    const searchStrInput = document.getElementById("searchStr");

    searchStrInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("searchBtn").click();
        }
    });

    const option = {
        oTxt: 'board_title',
        oVal: 'board_idntf_key',
    };

    const params = {};


    if(status === 'init') {

        window.sessionStorage.removeItem("params");

        setCommSelBoxCall(
            'boardId',
            '/api/board/select',
            'POST',
            'ALL',
            boardKey,
            params,
            option,
            setUseYn
        );

    } else {

        sessionParam = JSON.parse(window.sessionStorage.getItem("params"));

        $('input[name=start_date]').val(sessionParam.start_date);
        $('input[name=end_date]').val(sessionParam.end_date);
        $('input[name=search_str]').val(sessionParam.search_str);

        page.currentPage = sessionParam.current_page;
        page.page_per = sessionParam.page_per;

        setCommSelBoxCall(
            'boardId',
            '/api/board/select',
            'POST',
            'ALL',
            sessionParam.board_idntf_key,
            params,
            option,
            setUseYn
        );

    }








});
