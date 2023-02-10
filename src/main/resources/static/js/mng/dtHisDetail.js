import { setCodeSelBox } from '../module/component';
import { mainViewTokenInvalidate, setAccessToken } from "../module/router";
import { serializeFormJson } from "../module/json";
import { spinnerHide, spinnerShow } from "../module/spinner";

/**
 * search : 조회
 */
const search = () => {

    spinnerShow();

    const params = serializeFormJson('frm');
    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/dtHis/detail',
        type: 'POST',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            const data = result.data;

            if($("#dtGbCdKey").val() === 'C') {
                setDtInfo(data);
            }else {
                setRfInfo(data);
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

const setDtInfo = (data) => {
    $("#fileNm").val(data.file_nm);
    setCodeSelBox('corpSvcCd', 'CORP_SVC_CD', '', data.corp_svc_cd);
    $("#infoLineYmd").val(data.info_line_ymd);
    $("#strtDt").val(data.strt_dt);
    $("#endDt").val(data.end_dt);
    setCodeSelBox('stCd', 'DT_ST_CD', '', data.st_cd);
    setCodeSelBox('grdCd', 'DT_GRD_CD', '', data.grd_cd);
    setCodeSelBox('dbCd', 'DT_DB_CD', '', data.db_cd);
    setCodeSelBox('dtTmplCd', 'TMPL_CD', '', data.tmpl_cd);
    $("#dtFileCnt").val(data.file_cnt);
    $("#dtTpTbClCnt").val(data.tp_tb_cl_cnt);
    $("#dtInsTbClCnt").val(data.ins_tb_cl_cnt);
    $("#dtUptTbClCnt").val(data.upt_tb_cl_cnt);
    $("#dtDelTbClCnt").val(data.del_tb_cl_cnt);
    $("#dtTbNm").val(data.tb_nm);
    $("#dtFileSeq").val(data.file_seq);
    $("#wrkDtlLog").html(data.wrk_dtl_log);
}

const setRfInfo = (data) => {

    $("#fileNm").val(data.file_nm);
    setCodeSelBox('corpSvcCd', 'CORP_SVC_CD', '', data.corp_svc_cd);
    $("#infoLineYmd").val(data.info_line_ymd);
    $("#strtDt").val(data.strt_dt);
    $("#endDt").val(data.end_dt);
    setCodeSelBox('stCd', 'DT_ST_CD', '', data.st_cd);
    setCodeSelBox('grdCd', 'DT_GRD_CD', '', data.grd_cd);
    setCodeSelBox('dbCd', 'DT_DB_CD', '', data.db_cd);
    $("#rfTpTbClCnt").val(data.tp_tb_cl_cnt);
    $("#rfShopMapCnt").val(data.shop_map_cnt);
    $("#rfCmplCnt").val(data.rf_cmpl_cnt);
    setCodeSelBox('rfTmplCd', 'TMPL_CD', '', data.tmpl_cd);
    $("#rfTbNm").val(data.tb_nm);
    $("#rfFileSeq").val(data.file_seq);
    $("#wrkDtlLog").html(data.wrk_dtl_log);
    $("#tpRfHisCnt").val(data.tp_rf_his_cnt);
    $("#shopMapMstCnt").val(data.shop_map_mst_cnt);
    $("#shopMapMstSubCnt").val(data.shop_map_mst_sub_cnt);
    $("#shopMapMstHisCnt").val(data.shop_map_mst_his_cnt);
    $("#valCnt").val(data.val_cnt);
    $("#shopMapInputCnt").val(data.shop_map_input_cnt);
    $("#dupCnt").val(data.dup_cnt);
}


const pageMove = () => {
    location.href = '/page/mng/dtHis/back';
}

$(document).ready(() => {

    search();

    //뒤로가기
    $('#backBtn').click(() => {
        pageMove();
    });

    //다시조회
    $('#refreshBtn').click(() => {
        search();
    });

});
