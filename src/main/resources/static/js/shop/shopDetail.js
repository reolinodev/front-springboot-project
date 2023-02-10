import { setCodeSelBox } from '../module/component';
import { focustGridFirstRow, setCheckBoxGridId } from '../module/grid';
import { mainViewTokenInvalidate, setAccessToken } from "../module/router";
import { serializeFormJson } from "../module/json";
import { setBasicDatePicker } from "../module/datePicker";
import { checkDuplicateList, checkNullList } from "../module/validation";
import { spinnerHide, spinnerShow } from "../module/spinner";

let grid;

/**
 * search : 조회
 */
const search = () => {

    spinnerShow();

    const params = serializeFormJson('frm');
    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/shop/detail',
        type: 'POST',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            const masterInfo = result.masterInfo;
            const shopInfo = result.shopInfo;
            const trmList = result.trmList;
            const txSlsInfo = result.txSlsData;
            const txYmList = result.txYmList;
            setMasterInfo(masterInfo);
            setShopInfo(shopInfo);
            grid.resetData(trmList);
            setTxYm(txYmList);
            setTxSlsInfo(txSlsInfo);

            grid.on('afterChange', ev => {
                const changeData = ev.changes[0];

                if(changeData.columnName === 'trm_no') {
                    const prevValue = changeData.prevValue;
                    const currentValue = changeData.value;
                    const rawData = grid.getRow(changeData.rowKey);
                    const trmNoOld = rawData.trm_no_old;

                    if(trmNoOld !== null && trmNoOld !== currentValue){
                        alert('기존 단말기 번호는 수정할 수 없습니다.');
                        grid.setValue(changeData.rowKey, "trm_no", prevValue, false);
                    }
                }
            });

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
 * setMasterInfo : 마스터정보 화면 입력
 */
const setMasterInfo = (data) => {
    $("#msMastKey").val(data.mast_key);
    $("#msShopNm").val(data.shop_nm);
    $("#msBrno").val(data.brno);
    $("#msShopAddr").val(data.shop_addr);
    setCodeSelBox('msMastActvYn', 'ACTV_YN', '', data.mast_actv_yn);
    setCodeSelBox('msSvcCd', 'SVC_YN', '', data.svc_yn);
}

/**
 * setShopInfo : 매장정보 화면 입력
 */
const setShopInfo = (data) => {

    $("#shopFrm #idntfKey").val(data.idntf_key);
    $("#shopFrm #corpSvcNm").val(data.corp_svc_nm);
    $("#shopFrm #corpSvcCd").val(data.corp_svc_cd);
    $("#shopFrm #shopNm").val(data.rf_bf_shop_nm);
    $("#shopFrm #brno").val(data.brno);

    $("#shopFrm #shopAddr").val(data.shop_addr);
    $("#shopFrm #shopDaddr").val(data.shop_daddr);
    $("#shopFrm #shopTelno").val(data.shop_telno);

    setBasicDatePicker('shopCtrtBgngYmd', 'shop_ctrt_bgng_ymd', data.shop_ctrt_bgng_ymd);
    setBasicDatePicker('shopCtrtEndYmd', 'shop_ctrt_end_ymd', data.shop_ctrt_end_ymd);

    setCodeSelBox('shopStCd', 'SHOP_ST_CD', 'SEL', data.shop_st_cd);
    setCodeSelBox('vanCd', 'VAN_CD', 'SEL', data.van_cd);

    $("#shopFrm #agnCd").val(data.agn_cd);
    $("#shopFrm #agnNm").val(data.agn_nm);
    $("#shopFrm #prnAgnCd").val(data.prn_agn_cd);
    $("#shopFrm #prnAgnNm").val(data.prn_agn_nm);

    setCodeSelBox('trmDiv', 'TRM_DIV', 'SEL', data.trm_div);
    setCodeSelBox('trmStCd', 'TRM_ST_CD', 'SEL', data.trm_st_cd);
    setCodeSelBox('srvDiv', 'SRV_DIV', 'SEL', data.srv_div);
    $("#shopFrm #shopBizNm").val(data.shop_biz_nm);

    $("#shopFrm #shopFrstRegDt").val(data.shop_frst_reg_dt);
    $("#shopFrm #shopLastMdfcnDt").val(data.shop_last_mdfcn_dt);
    $("#shopFrm #delYnNm").val(data.del_yn_nm);
}

/**
 * setTxYm : 거래매출 셀렉트박스 등록
 */
const  setTxYm = (dataList) => {
    let str = '';

    if(dataList.length === 0){
        str += `<option value="">-- 없음 --</option>`
        $("#txDivUseY").hide();
    }else{
        for (let i = 0; i < dataList.length; i++) {
            str += `<option value="${dataList[i].tx_ym}"> ${dataList[i].tx_ym_val}</option>`;
        }
        $("#txDivUseY").show();
    }

    $(`#txYm`).html(str);
}

/**
 * setTxSlsInfo : 거래매출정보 등록
 */
const setTxSlsInfo = (data) => {
    $("#txSlsDayCnt").val(data.tx_sls_day_cnt);
    $("#txCorpSvcCd").val(data.corp_svc_cd);
    $("#txIdntfKey").val(data.idntf_key);

    setBasicDatePicker('txBgngYmd', 'tx_bgng_ymd', data.tx_bgng_ymd);
    setBasicDatePicker('txLastYmd', 'tx_last_ymd', data.tx_last_ymd);

    $("#txAprvCnt").val(data.tx_aprv_cnt);
    $("#txAprvAmt").val(data.tx_aprv_amt);
    $("#txCnclCnt").val(data.tx_cncl_cnt);
    $("#txCnclAmt").val(data.tx_cncl_amt);
    $("#txFailCnt").val(data.tx_fail_cnt);
    $("#txFailAmt").val(data.tx_fail_amt);
    $("#txCashCnt").val(data.tx_cash_cnt);
    $("#txCashAmt").val(data.tx_cash_amt);
    $("#txRcptCnt").val(data.tx_rcpt_cnt);
    $("#txRcptAmt").val(data.tx_rcpt_amt);
    $("#txCardCnt").val(data.tx_card_cnt);
    $("#txCardAmt").val(data.tx_card_amt);
    $("#txEasyCnt").val(data.tx_easy_cnt);
    $("#txEasyAmt").val(data.tx_easy_amt);
    $("#txEtcCnt").val(data.tx_etc_cnt);
    $("#txEtcAmt").val(data.tx_etc_amt);
    $("#pkgNtslCnt").val(data.pkg_ntsl_cnt);
    $("#pkgNtslAmt").val(data.pkg_ntsl_amt);
    $("#dlvrNtslCnt").val(data.dlvr_ntsl_cnt);
    $("#dlvrNtslAmt").val(data.dlvr_ntsl_amt);
}

/**
 * setGridLayout : 그리드 구성
 */
const setGridLayout = () => {
    const columns = [
        { name: 'corp_svc_cd', hidden: true},
        { name: 'trm_no_old', hidden: true},
        { name: 'idntf_key', hidden: true},
        { header: '단말기번호', name: 'trm_no', align: 'left', editor: 'text', validation: { required: true }},
        {
            header: 'VAN사코드',
            name: 'van_cd',
            align: 'center',
            formatter: 'listItemText',
            validation: { required: true },
            editor: {
                type: 'select',
                options: {
                    listItems: [
                        { text: '나이스정보통신', value: '01' },
                        { text: 'KIS정보통신', value: '02' },
                        { text: 'JTNET', value: '17' },
                        { text: '--선택--', value: '' },
                    ],
                },
            },
        },
    ];
    const gridData = [];
    return setCheckBoxGridId(columns, gridData, 'grid');
};

/**
 * pageMove : 화면 이동
 */
const pageMove = () => {
    location.href = '/page/shop/shop/back';
}

const $shopNm = $("#shopFrm #shopNm");
const $brno = $("#shopFrm #brno");
const $shopAddr = $("#shopFrm #shopAddr");
const $shopDaddr= $("#shopFrm #shopDaddr");
const $shopCtrtBgngYmd= $("#shopFrm #shopCtrtBgngYmd");
const $shopCtrtEndYmd= $("#shopFrm #shopCtrtEndYmd");

/**
 * saveShop : 매장정보 저장
 */
const saveShop = () => {
    let msg = '';

    if ($shopNm.val() === '') {
        msg = '매장명을 입력하세요.';
        alert(msg);
        $shopNm.focus();
        return;
    }

    if ($brno.val() === '') {
        msg = '사업자등록번호를 입력하세요.';
        alert(msg);
        $brno.focus();
        return;
    }

    if ($shopAddr.val() === '') {
        msg = '주소를 입력하세요.';
        alert(msg);
        $shopAddr.focus();
        return;
    }

    if ($shopDaddr.val() === '') {
        msg = '상세주소를 입력하세요.';
        alert(msg);
        $shopDaddr.focus();
        return;
    }

    if ($shopCtrtBgngYmd.val() !== '' && $shopCtrtEndYmd.val() !== '' && $shopCtrtBgngYmd.val() > $shopCtrtEndYmd.val()) {
        msg = '계약시작일이 계약종료일보다 클수 없습니다.';
        alert(msg);
        $("#writeShopCtrtBgngYmd").focus();
        return;
    }

    spinnerShow();

    const params = serializeFormJson('shopFrm');
    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/shop/update',
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
                        alert(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    alert(data.message);
                }
            } else if(request.status === 401){
                setAccessToken(request.responseJSON);
                saveShop();
            }  else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
}

/**
 * saveTxSls : 거래매출정보 저장
 */
const saveTxSls = () => {

    if($("#txYm").val()===''){
        alert('거래실적연월이 없습니다.');
        return;
    }

    spinnerShow();

    const params = serializeFormJson('txFrm');
    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/shop/update/txSls',
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
                        alert(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    alert(data.message);
                }
            }else if(request.status === 401){
                setAccessToken(request.responseJSON);
                saveTxSls();
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
}

const saveTrm = () => {

    focustGridFirstRow(grid);

    const rows = grid.getModifiedRows();
    const data = grid.getData();

    const { createdRows } = rows;
    const { updatedRows } = rows;
    const { deletedRows } = rows;

    if (
        createdRows.length === 0 &&
        updatedRows.length === 0 &&
        deletedRows.length === 0
    ) {
        alert('변경된 내용이 없습니다.');
        return;
    }

    if (!checkNullList(data, 'trm_no')) {
        alert('단말기번호가 비어있습니다.');
        return;
    }

    if (!checkNullList(data, 'van_cd')) {
        alert('VAN사코드가 비어있습니다.');
        return;
    }

    if (!checkDuplicateList(data, 'trm_no')) {
        alert('단말기번호가 중복입니다.');
        return;
    }

    spinnerShow();

    const params = {
        idntf_key: $("#idntfKey").val(),
        corp_svc_cd: $("#corpSvcCd").val(),
        created_rows: createdRows,
        updated_rows: updatedRows,
        deleted_rows: deletedRows,
    };

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/shop/update/trm',
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
                        alert(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    alert(data.message);
                }
            } else if(request.status === 401){
                setAccessToken(request.responseJSON);
                saveTrm();
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
}

/**
 * getTxSls : 거래정보를 가져온다.
 */
const  getTxSls = () => {

    spinnerShow();

    const params = {
        corp_svc_cd: $("#txCorpSvcCd").val(),
        idntf_key: $("#txIdntfKey").val(),
        tx_ym: $("#txYm").val()
    };

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/shop/detail/txsls/',
        type: 'POST',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            const data = result.data;
            setTxSlsInfo(data);

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

}

$(document).ready(() => {
    // 그리드 세팅
    grid = setGridLayout();

    search();

    //뒤로가기
    $('#topBackBtn, #bottomBackBtn').click(() => {
        pageMove();
    });

    // 추가 버튼 클릭 이벤트
    $('#trmAddBtn').click(() => {
        const row = {
            trm_no: '',
            van_cd: '',
        };
        grid.appendRow(row);
    });

    // 삭제 버튼 클릭 이벤트
    $('#trmDelBtn').click(() => {
        const checkedRows = grid.getCheckedRows();
        if (checkedRows.length === 0) {
            alert('선택한 항목이 없습니다.');
            return;
        }

        grid.removeCheckedRows();
    });

    $('#shopSaveBtn').click(() => {
        saveShop();
    });

    $('#trmSaveBtn').click(() => {
        saveTrm();
    });

    $('#txSaveBtn').click(() => {
        saveTxSls();
    });

    $('#txBgngYmdDel').click(() => {
        $("#txBgngYmd").val('');
    });

    $('#txLastYmdDel').click(() => {
        $("#txLastYmd").val('');
    });

    $('#shopCtrtBgngYmdDel').click(() => {
        $("#shopCtrtBgngYmd").val('');
    });

    $('#shopCtrtEndYmdDel').click(() => {
        $("#shopCtrtEndYmd").val('');
    });

    $('#txYm').change(() => {
        getTxSls();
    });
});
