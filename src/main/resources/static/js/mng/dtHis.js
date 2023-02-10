import {
    setCodeSelBox,
    setCodeSelBoxCall,
    setCommSelBox, setCommSelBoxCall
} from '../module/component';
import Page, { setPagination } from '../module/pagination';
import { serializeFormJson } from '../module/json';
import { setBasicGrid, setGridClickRowEvent } from '../module/grid';
import { mainViewTokenInvalidate, setAccessToken } from "../module/router";
import { setBasicDataRange } from "../module/datePicker";
import { spinnerHide, spinnerShow } from "../module/spinner";

let page = new Page(1, false, 10, 0);
let grid;
let pagination;
let sessionParam;

const pageInit = () => {
    page = new Page(1, false, Number($('#pagePer').val()), 0);
};


/**
 * search : 조회
 */
const search = () => {

    spinnerShow();

    const params = setParamter();
    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/dtHis/',
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

            setGridClickRowEvent(grid, 'file_nm', 'file_nm', pageMove);
            setGridClickRowEvent(grid, 'tb_nm', 'file_nm', pageMove);

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
 * backSearch : 조회
 */
const backSearch = () => {

    spinnerShow();

    const params = setParamter();
    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/dtHis/',
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

            setGridClickRowEvent(grid, 'file_nm', 'file_nm', pageMove);
            setGridClickRowEvent(grid, 'tb_nm', 'file_nm', pageMove);

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
 * setGridLayout : 그리드 구성
 */
const setGridLayout = () => {
    // 헤더 생성
    const columns = [
        { header: 'No', name: 'rnum', width: 50, align: 'center' },
        { header: '구분', name: 'dt_gb_nm', width: 100, align: 'center' },
        { header: '구분코드', name: 'dt_gb_cd', align: 'center', hidden: true},
        { header: '계열사서비스', name: 'corp_svc_nm', align: 'center' },
        { header: '파일명', name: 'file_nm', align: 'center', renderer: { styles: {color: '#0863c8', textDecoration : 'underline', cursor: 'pointer'}}},
        { header: '테이블명', name: 'tb_nm', align: 'center', renderer: { styles: {color: '#0863c8', textDecoration : 'underline', cursor: 'pointer'}}},
        { header: '시작시간', name: 'strt_dt', align: 'center'},
        { header: '종료시간', name: 'end_dt', align: 'center'},
        { header: '정보기준일자', name: 'info_line_ymd_view', align: 'center'},
        { header: '단계', name: 'grd_nm', align: 'center' },
        { header: '상태', name: 'st_nm', align: 'center', width: 100 },
    ];
    // 데이터
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

/**
 * pagingCallback : 페이징 콜백
 */
const pagingCallback = (returnPage) => {
    page.currentPage = returnPage;
    search();
};

const pageMove = (data) => {
    setParamter();
    location.href = `/page/mng/dtHis/`+data.dt_gb_cd+`/`+data.file_nm+`/`+data.strt_dt;
};

const step1 = () => {
    setCodeSelBoxCall('dtGbCd', 'DT_GB_CD', 'ALL', sessionParam.dt_gb_cd, step2);
}

const step2 = () => {
    setCodeSelBoxCall('grdCd', 'DT_GRD_CD', 'ALL', sessionParam.grd_cd, step3);
}

const step3 = () => {
    setCodeSelBoxCall('stCd', 'DT_ST_CD', 'ALL', sessionParam.st_cd, backSearch);
}

/**
 * setParamter : 검색 파라미터 세팅
 */
const setParamter= () => {

    const params = serializeFormJson('dtHisFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;
    params.user_idntf_key = window.sessionStorage.getItem("userIdntfKey");

    window.sessionStorage.setItem("params", JSON.stringify(params));

    return params;
}


$(document).ready(() => {

    setBasicDataRange('start_date', 'end_date', 'today');

    // 그리드 세팅
    grid = setGridLayout();

    // 페이징 세팅
    pagination = setPagination(page, pagingCallback);

    // 검색버튼
    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    const option = {
        oTxt: 'corp_svc_nm',
        oVal: 'corp_svc_cd',
    };

    const params = {};

    const status = $("#status").val();

    if(status === 'init'){

        window.sessionStorage.removeItem("params");

        setCodeSelBox('dtGbCd', 'DT_GB_CD', 'ALL', '');

        setCommSelBox(
            'corpSvcCd',
            '/api/shop/corpSvc/all',
            'POST',
            'ALL',
            '',
            params,
            option
        );

        setCodeSelBox('grdCd', 'DT_GRD_CD', 'ALL', '');

        setCodeSelBox('stCd', 'DT_ST_CD', 'ALL', '');

    }else {

        sessionParam = JSON.parse(window.sessionStorage.getItem("params"));

        $('input[name=start_date]').val(sessionParam.start_date);
        $('input[name=end_date]').val(sessionParam.end_date);

        page.currentPage = sessionParam.current_page;
        page.page_per = sessionParam.page_per;

        $("#fileNm").val(sessionParam.file_nm);
        $("#tbNm").val(sessionParam.tb_nm);

        setCommSelBoxCall(
            'corpSvcCd',
            '/api/shop/corpSvc/all',
            'POST',
            'ALL',
            sessionParam.corp_svc_cd,
            params,
            option,
            step1
        );
    }

    const fileNmInput = document.getElementById("fileNm");

    fileNmInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("searchBtn").click();
        }
    });

    const tbNmInput = document.getElementById("tbNm");

    tbNmInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("searchBtn").click();
        }
    });

});
