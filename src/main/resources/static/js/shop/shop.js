import {
    setCodeSelBox,
    setCodeSelBoxCall,
    setCommSelBox, setCommSelBoxCall
} from '../module/component';
import Page, { setPagination } from '../module/pagination';
import { serializeFormJson } from '../module/json';
import { setBasicGrid, setGridClickRowEvent } from '../module/grid';
import { mainViewTokenInvalidate, setAccessToken } from "../module/router";
import { setBasicDatePicker } from "../module/datePicker";
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
        url: '/api/shop/',
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

            setGridClickRowEvent(grid, 'rf_bf_shop_nm', 'idntf_key', pageMove);

            if (page.pageInit === false) {
                pagination.reset(result.total);
                page.pageInit = true;
            }

            $("#downloadBtn").attr("disabled", false);

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
        url: '/api/shop/',
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

            setGridClickRowEvent(grid, 'rf_bf_shop_nm', 'idntf_key', pageMove);

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
        { header: '식별키', name: 'idntf_key', width: 100, align: 'center' },
        { header: '계열사서비스', name: 'corp_svc_nm', width: 'auto', align: 'center' },
        { header: '매장명', name: 'rf_bf_shop_nm', align: 'center', renderer: { styles: {color: '#0863c8', textDecoration : 'underline', cursor: 'pointer'}} },
        { header: '사업자등록번호', name: 'brno', width: 100, align: 'center' },
        { header: '주소', name: 'rf_addr', align: 'center'},
        { header: '마스터키', name: 'mast_key', width: 100, align: 'center' },
        { header: '정제매장명', name: 'shop_nm', align: 'center' },
        { header: '삭제여부', name: 'del_yn_nm', width: 'auto', align: 'center' },
    ];
    // 데이터
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

const pageMove = (data) => {
    setParamter();
    location.href = `/page/shop/shop/detail/`+data.idntf_key+`?mast_key=`+data.mast_key+`&corp_svc_cd=`+data.corp_svc_cd+`&idntf_key=`+data.idntf_key;
}

/**
 * setParamter : 검색 파라미터 세팅
 */
const setParamter= () => {
    const params = serializeFormJson('shopViewFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;
    params.idntf_key = params.idntf_key.toUpperCase();
    params.brno = params.brno.toUpperCase();
    params.rf_bf_shop_nm = params.rf_bf_shop_nm.toUpperCase();
    params.mast_key = params.mast_key.toUpperCase();
    params.user_idntf_key = window.sessionStorage.getItem("userIdntfKey");

    window.sessionStorage.setItem("params", JSON.stringify(params));

    return params;
}

/**
 * pagingCallback : 페이징 콜백
 */
const pagingCallback = (returnPage) => {
    page.currentPage = returnPage;
    search();
};

const $writeCorpSvcCd = $('#writeCorpSvcCd');
const $writeShopNm = $('#writeShopNm');
const $writeIdntfKey = $('#writeIdntfKey');
const $writeBrno = $('#writeBrno');
const $writeShopTelno = $('#writeShopTelno');
const $writeShopAddr = $('#writeShopAddr');
const $writeShopDaddr = $('#writeShopDaddr');
const $writeShopBizNm = $('#writeShopBizNm');

/**
 * initUserMngWrite : 등록화면의 값 초기화
 */
const initAdd = () => {

    setCodeSelBox('writeCorpSvcCd', 'CORP_SVC_VIEW', 'SEL', '');
    $writeShopNm.val('');
    $writeIdntfKey.val('');

    $writeBrno.val('');
    $writeShopTelno.val('');
    setCodeSelBox('writeShopStCd', 'SHOP_ST_CD', 'SEL', '');
    setCodeSelBox('writeVanCd', 'VAN_CD', 'SEL', '');

    $writeShopAddr.val('');
    $writeShopDaddr.val('');

    setBasicDatePicker('writeShopCtrtBgngYmd', 'shop_ctrt_bgng_ymd', '');
    setBasicDatePicker('writeShopCtrtEndYmd', 'shop_ctrt_end_ymd', '');
    $writeShopBizNm.val('');

    setCodeSelBox('writeTrmDiv', 'TRM_DIV', 'SEL', '');
    setCodeSelBox('writeTrmStCd', 'TRM_ST_CD', 'SEL', '');
    setCodeSelBox('writeSrvDiv', 'SRV_DIV', 'SEL', '');

    $('#writeMsg').html('');
};

/**
 * inputProc : 등록 프로세스
 */
const inputProc = () => {

    let msg = '';

    $('#writeMsg').html('');

    if ($writeCorpSvcCd.val() === '') {
        msg = '계열사서비스를 입력하세요.';
        $('#writeMsg').html(msg);
        $writeCorpSvcCd.focus();
        return;
    }

    if ($writeShopNm.val() === '') {
        msg = '매장명을 입력하세요.';
        $('#writeMsg').html(msg);
        $writeShopNm.focus();
        return;
    }

    if ($writeIdntfKey.val() === '') {
        msg = '매장식별키를 입력하세요.';
        $('#writeMsg').html(msg);
        $writeIdntfKey.focus();
        return;
    }

    if ($writeBrno.val() === '') {
        msg = '매장식별키를 입력하세요.';
        $('#writeMsg').html(msg);
        $writeBrno.focus();
        return;
    }

    if ($writeShopAddr.val() === '') {
        msg = '주소를 입력하세요.';
        $('#writeMsg').html(msg);
        $writeShopAddr.focus();
        return;
    }

    if ($writeShopDaddr.val() === '') {
        msg = '상세주소를 입력하세요.';
        $('#writeMsg').html(msg);
        $writeShopDaddr.focus();
        return;
    }

    if ($("#writeShopCtrtBgngYmd").val() !== '' && $("#writeShopCtrtEndYmd").val() !== '' && $("#writeShopCtrtBgngYmd").val() > $("#writeShopCtrtEndYmd").val()) {
        msg = '계약시작일이 계약종료일보다 클수 없습니다.';
        $('#writeMsg').html(msg);
        $("#writeShopCtrtBgngYmd").focus();
        return;
    }

    spinnerShow();

    const params = serializeFormJson('shopWriteFrm');

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/shop/',
        type: 'PUT',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
    }).then(
        (data) => {
            if (data.header.resultCode === 'ok') {
                alert(data.header.message);
                search();
                closeModal();
            } else {
                $('#writeMsg').html(data.header.message);
            }

            spinnerHide();
        },
        (request, status, error) => {
            if (request.status === 500) {
                console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);
            } else if (request.status === 400) {
                const { errorList } = request.responseJSON;
                if (errorList !== undefined) {
                    if (errorList.lengh !== 0) {
                        const { message } = errorList[0];
                        $('#writeMsg').html(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#writeMsg').html(data.message);
                }
            }else if(request.status === 401){
                setAccessToken(request.responseJSON);
                inputProc();
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
}

/**
 * downProc : 다운로드 프로세스
 */
const downProc = () => {

    const corpSvcCd = $("#corpSvcCd").val();
    if(corpSvcCd === '') {
        alert('계열사서비스를 선택하세요.');
        return;
    }

    $("#downloadBtn").attr("disabled", true);

    const userIdntfKey=  window.sessionStorage.getItem("userIdntfKey");

    $("#shopViewFrm").attr("method", "post");
    $("#shopViewFrm").attr("action", "/download/shop/"+userIdntfKey);
    $("#shopViewFrm").submit();
}

/**
 * closeModal : 모달 닫기
 */
const closeModal = () => {
    window.$('#shopWrite').modal('hide');
};

/**
 * step1 : 돌아오기 버튼으로 화면에 진입시 화면 세팅
 */
const step1 = () => {
    setCodeSelBoxCall('delYn', 'DEL_YN', 'ALL', sessionParam.del_yn, backSearch);
}

$(document).ready(() => {

    const option = {
        oTxt: 'corp_svc_nm',
        oVal: 'corp_svc_cd',
    };

    const params = {};

    // 그리드 세팅
    grid = setGridLayout();

    // 페이징 세팅
    pagination = setPagination(page, pagingCallback);

    // 검색버튼
    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    // 추가버튼 클릭시 모달을 초기화한다.
    $('#writeBtn').click(() => {
        initAdd();
    });

    // 추가버튼 클릭시 모달을 초기화한다.
    $('#submitBtn').click(() => {
        inputProc();
    });

    $('#downloadBtn').click(() => {
        downProc();
    });

    const status = $("#status").val();

    if(status === 'init'){
        window.sessionStorage.removeItem("params");

        setCommSelBox(
            'corpSvcCd',
            '/api/shop/corpSvc',
            'POST',
            'ALL',
            '',
            params,
            option
        );

        setCodeSelBox('delYn', 'DEL_YN', 'ALL', '');
    }else {
        sessionParam = JSON.parse(window.sessionStorage.getItem("params"));

        page.currentPage = sessionParam.current_page;
        page.page_per = sessionParam.page_per;

        $("#idntfKey").val(sessionParam.idntf_key);
        $("#brno").val(sessionParam.brno);
        $("#mastKey").val(sessionParam.mast_key);
        $("#rfBfShopNm").val(sessionParam.rf_bf_shop_nm);

        setCommSelBoxCall(
            'corpSvcCd',
            '/api/shop/corpSvc',
            'POST',
            'ALL',
            sessionParam.corp_svc_cd,
            params,
            option,
            step1
        );
    }

    const idntfKeyInput = document.getElementById("idntfKey");

    idntfKeyInput.addEventListener("keyup", function (event) {
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

    const rfBfShopNmInput = document.getElementById("rfBfShopNm");

    rfBfShopNmInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("searchBtn").click();
        }
    });

    const mastKeyInput = document.getElementById("mastKey");

    mastKeyInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("searchBtn").click();
        }
    });
});
