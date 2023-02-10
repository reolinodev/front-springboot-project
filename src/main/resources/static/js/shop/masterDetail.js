import { setCodeSelBox } from '../module/component';
import { focustGridFirstRow, setBasicGrid } from '../module/grid';
import { mainViewTokenInvalidate, setAccessToken } from "../module/router";
import { spinnerHide, spinnerShow } from "../module/spinner";

let grid;
const authIdntfKey = window.sessionStorage.getItem("authIdntfKey");

/**
 * search : 조회
 */
const search = () => {

    spinnerShow();

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/mast/'+$("#masterFrm #msKey").val(),
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
           const data = result.data;
           setMaster(data);
           const sublist = result.subList;
           setMasterSub(sublist);

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

const setMaster = (data) => {
    $("#masterFrm #mastKey").val(data.mast_key);
    $("#masterFrm #shopNm").val(data.shop_nm);
    $("#masterFrm #brno").val(data.brno);
    $("#masterFrm #shopAddr").val(data.shop_addr);

    setCodeSelBox('mastActvYn', 'ACTV_YN', '', data.mast_actv_yn);
    setCodeSelBox('svcCd', 'SVC_YN', '', data.svc_yn);

    if(authIdntfKey !== 'AT00000001'){
        $("#svcCd").prop('disabled',true);
    }
}

const setMasterSub = (data) => {
    grid.resetData(data);

    if(authIdntfKey !== 'AT00000001'){
        $("#saveBtn").hide();
    }
}

/**
 * setGridLayout : 그리드 구성
 */
const setGridLayout = () => {
    // 헤더 생성
    const columns = [
        { header: '계열사서비스', name: 'corp_svc_nm', align: 'center' },
        { header: '식별키', name: 'idntf_key', width: 100,  align: 'center' },
        { header: '매장명', name: 'shop_nm', align: 'center' },
        { header: '사업자등록번호', name: 'brno', width: 100, align: 'center' },
        { header: '주소', name: 'rf_rod_addr', align: 'center' },
        { header: '가맹점 최초등록일시', name: 'shop_frst_reg_dt', width: 100, align: 'center' },
        { header: '활동여부', name: 'shop_actv_yn_nm', width: 90,  align: 'center' },
        {
            header: '서비스여부',
            name: 'svc_yn',
            align: 'center',
            formatter: 'listItemText',
            width: 90,
            editor: {
                type: 'select',
                options: {
                    listItems: [
                        { text: '활성화', value: 'Y' },
                        { text: '비활성화', value: 'N' },
                    ],
                },
            },
            renderer: { styles: {color: '#e83e8c', textDecoration : 'underline', cursor: 'pointer'}}
        },
    ];
    // 데이터
    const gridData = [];

    return setBasicGrid(columns, gridData);
};

const pageMove = () => {
    location.href = '/page/shop/master/back';
}

/**
 *  updateMasterProc : 마스터DB 서비스여부 수정
 */
const updateMasterProc = () => {

    spinnerShow();

    const accessToken = window.localStorage.getItem("accessToken");

    const params = {
        mast_key: $('#msKey').val(),
        svc_yn: $('#svcCd').val(),
    };

    $.ajax({
        url: '/api/mast/update/master',
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
            } else if(request.status === 401){
                setAccessToken(request.responseJSON);
                updateMasterProc();
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
}

/**
 *  updateMasterSubProc : 마스터SUbDB 사용여부 수정
 */
const updateMasterSubProc = () => {

    focustGridFirstRow(grid);

    const rows = grid.getModifiedRows();

    const { updatedRows } = rows;

    if (updatedRows.length === 0) {
        alert('변경된 내용이 없습니다.');
        return;
    }

    spinnerShow();

    const accessToken = window.localStorage.getItem("accessToken");

    const params = {
        mast_key: $('#msKey').val(),
        updated_rows: updatedRows,
    };

    $.ajax({
        url: '/api/mast/update/masterSub',
        type: 'PUT',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            if (result.header.resultCode === 'ok') {
                alert(result.header.message);
            }

            spinnerHide();
        },
        error(request, status, error) {
            if (request.status === 500) {
                console.log(
                    `code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`
                );
            } else if (request.status === 400) {
                const { errorList } = request.responseJSON;
                if (errorList !== undefined) {
                    if (errorList.lengh !== 0) {
                        const { message } = errorList[0];
                        alert(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    alert(data.message);
                }
            }else if(request.status === 401){
                setAccessToken(request.responseJSON);
                updateMasterSubProc();
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        },
    });
}

$(document).ready(() => {
    // 그리드 세팅
    grid = setGridLayout();

    //뒤로가기
    $('#backBtn').click(() => {
        pageMove();
    });

    //서비스여부 변경시 검색
    $('#svcCd').change(() => {
        updateMasterProc();
    });

    //저장버튼
    $('#saveBtn').click(() => {
        updateMasterSubProc();
    });

    search();
});
