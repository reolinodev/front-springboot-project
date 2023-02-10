import { setCodeSelBox, setCodeSelBoxCall } from '../module/component';
import Page, { setPagination } from '../module/pagination';
import { serializeFormJson } from '../module/json';
import { setBasicGrid, setGridClickEvent } from '../module/grid';
import { mainViewTokenInvalidate, setAccessToken } from "../module/router";
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
        url: '/api/mast/',
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

            setGridClickEvent(grid, 'shop_nm', 'mast_key', pageMove);

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
        url: '/api/mast/',
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

            setGridClickEvent(grid, 'shop_nm', 'mast_key', pageMove);

            const sessionData = JSON.parse(window.sessionStorage.getItem("params"));
            pagination.reset(result.total);
            pagination.movePageTo(sessionData.current_page);

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
        { header: '마스터키', name: 'mast_key', width: 100, align: 'center' },
        { header: '매장명', name: 'shop_nm', align: 'center', renderer: { styles: {color: '#0863c8', textDecoration : 'underline', cursor: 'pointer'}}},
        { header: '사업자등록번호', name: 'brno', width: 100, align: 'center' },
        { header: '주소', name: 'shop_addr', align: 'center'},
        { header: '계열사서비스코드', name: 'corp_svc_cd_arr', align: 'center', width: 'auto' },
        { header: '서비스여부', name: 'svc_yn_nm', width: 100, align: 'center' },
    ];
    // 데이터
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

const pageMove = (mastKey) => {
    setParamter();
    location.href = '/page/shop/master/detail/'+mastKey;
}

/**
 * pagingCallback : 페이징 콜백
 */
const pagingCallback = (returnPage) => {
    page.currentPage = returnPage;
    search();
};


/**
 * setParamter : 검색 파라미터 세팅
 */
const setParamter= () => {
    const params = serializeFormJson('masterViewFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;
    params.mast_key = params.mast_key.toUpperCase();
    params.brno = params.brno.toUpperCase();

    window.sessionStorage.setItem("params", JSON.stringify(params));

    return params;
}

$(document).ready(() => {

    setCodeSelBox('viewSvcYn', 'SVC_YN', 'ALL', '');

    // 그리드 세팅
    grid = setGridLayout();

    // 페이징 세팅
    pagination = setPagination(page, pagingCallback);

    // 검색버튼
    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    const status = $("#status").val();

    if(status === 'init'){
        window.sessionStorage.removeItem("params");
    }else {
        sessionParam = JSON.parse(window.sessionStorage.getItem("params"));
        page.currentPage = sessionParam.current_page;
        page.page_per = sessionParam.page_per;

        $("#mastKey").val(sessionParam.mast_key);
        $("#brno").val(sessionParam.brno);
        setCodeSelBoxCall('viewSvcYn', 'SVC_YN', 'ALL', sessionParam.svc_yn, backSearch);
    }


    const mastKeyInput = document.getElementById("mastKey");

    mastKeyInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("searchBtn").click();
        }
    });

    const brnoInput = document.getElementById("brno");

    brnoInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("searchBtn").click();
        }
    });

});
