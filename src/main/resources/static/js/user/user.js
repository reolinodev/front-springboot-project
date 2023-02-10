import { setCodeSelBox } from '../module/component';
import Page, { setPagination } from '../module/pagination';
import { serializeFormJson } from '../module/json';
import { setBasicGrid, setGridClickEvent } from '../module/grid';
import { checkKr } from '../module/validation';
import { mainViewTokenInvalidate, setAccessToken } from "../module/router";
import { spinnerHide, spinnerShow } from "../module/spinner";

let page = new Page(1, false, 10, 0);
let grid;
let pagination;

const pageInit = () => {
    page = new Page(1, false, Number($('#pagePer').val()), 0);
};

let writeCompArr =[];
let editCompArr =[];

/**
 * search : 조회
 */
const search = () => {

    spinnerShow();

    const params = serializeFormJson('userViewFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/user/',
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

            setGridClickEvent(grid, 'login_id', 'user_idntf_key', userEdit);

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
 * setGridLayout : 그리드 구성
 */
const setGridLayout = () => {
    // 헤더 생성
    const columns = [
        { header: 'No', name: 'rnum', width: 50, align: 'center' },
        { header: 'SEQ', name: 'user_idntf_key', width: 100, align: 'center', hidden: true},
        { header: '아이디', name: 'login_id', align: 'center', renderer: { styles: {color: '#0863c8', textDecoration : 'underline', cursor: 'pointer'}}},
        { header: '이름', name: 'user_nm', align: 'center'},
        { header: '계열사', name: 'corp_nm', align: 'center' },
        { header: '사용여부', name: 'use_yn_nm', width: 150, align: 'center' },
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

const $writeLoginId = $('#writeLoginId');
const $writeUserNm = $('#writeUserNm');
const $writeCompGrCd = $('#writeCompGrCd');

/**
 * signUpCheck : 아이디 체크
 */
const signUpCheck = () => {

    spinnerShow();

    const accessToken = window.localStorage.getItem("accessToken");

    if ($writeLoginId.val() === '') {
        $('#writeMsg').html('아이디를 입력하세요.');
        return;
    }

    $.ajax({
        url: `/api/user/check/${$writeLoginId.val()}`,
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
    }).then(
        (data) => {
            if (data.header.resultCode === 'ok') {
                $('#signUpChk').val('Y');
                $('#writeMsg').html(data.header.message);
            }

            spinnerHide();
        },
        (request, status, error) => {

            console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);

            if (request.responseJSON.header.resultCode === 'fail') {
                $('#signUpChk').val('N');
                $('#writeMsg').html(request.responseJSON.header.message);
            }

            if(request.status === 401){
                setAccessToken(request.responseJSON);
                signUpCheck();
            }
            else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

/**
 * initUserMngWrite : 등록화면의 값 초기화
 */
const initUserMngWrite = () => {
    $writeLoginId.val('');
    $writeUserNm.val('');
    $writeCompGrCd.val('');
    writeCompArr = [];
    setCompCd('write', '');
    $('#writeMsg').html('');
};

/**
 *  signUpProc : 사용자 등록
 */
const signUpProc = () => {
    let msg = '';
    writeCompArr =[];

    $('#userWriteFrm input:checkbox[name=corp_svc_cd]').each(function (index) {
        if($(this).is(":checked") === true){
            writeCompArr.push($(this).val());
        }
    });

    if ($writeLoginId.val() === '') {
        msg = '아이디를 입력하세요.';
        $('#writeMsg').html(msg);
        $writeLoginId.focus();
        return;
    }
    if (checkKr($writeLoginId.val())) {
        msg = '아이디는 한글을 사용할 수 없습니다.';
        $('#writeMsg').html(msg);
        $writeLoginId.focus();
        return;
    }
    if ($('#signUpChk').val() === 'N') {
        msg = '아이디 확인을 하세요.';
        $('#writeMsg').html(msg);
        $writeLoginId.focus();
        return;
    }
    if ($writeUserNm.val() === '') {
        msg = '이름을 입력하세요.';
        $('#writeMsg').html(msg);
        $writeUserNm.focus();
        return;
    }
    if ($writeCompGrCd.val() === '') {
        msg = '계열사를 선택하세요.';
        $('#writeMsg').html(msg);
        $writeCompGrCd.focus();
        return;
    }
    if (writeCompArr.length === 0) {
        msg = '계열사 서비스를 선택하세요.';
        $('#writeMsg').html(msg);
        return;
    }

    spinnerShow();

    const param = {
        login_id: $writeLoginId.val(),
        user_nm: $writeUserNm.val(),
        corp_cd: $writeCompGrCd.val(),
        comp_cd_arr: writeCompArr,
        user_pw: $writeLoginId.val(),
    };

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/user/',
        type: 'PUT',
        data: JSON.stringify(param),
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
                signUpProc();
            }
            else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

const $editLoginId = $('#editLoginId');
const $editUserIdntfKey = $('#editUserIdntfKey');
const $editUserNm = $('#editUserNm');
const $editCompGrCd = $('#editCompGrCd');
const $editUseYn = $('#editUseYn');

/**
 * userEdit : 사용자 수정 화면 호출
 */
const userEdit = (userIdntfKey) => {

    const accessToken = window.localStorage.getItem("accessToken");

    spinnerShow();

    $.ajax({
        url: `/api/user/${userIdntfKey}`,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            setEditData(result.data, result.compData);

            spinnerHide();
        },
        error(request, status, error) {
            console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`
            );

            if(request.status === 401){
                setAccessToken(request.responseJSON);
                userEdit(userIdntfKey);
            }
            else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        },
    });
};

/**
 * setEditData : 에디트 데이터 셋
 */
const setEditData = (data, compData) => {

    setCodeSelBox('editUseYn', 'USE_YN', '', data.use_yn);
    setCodeSelBox('editCompGrCd', 'CORP_CD', '', data.corp_cd);
    setCompCd('edit', compData);

    $editLoginId.val(data.login_id);
    $editUserIdntfKey.val(data.user_idntf_key);
    $editUserNm.val(data.user_nm);

    window.$('#userEdit').modal('show');
};

/**
 *  editProc : 사용자 수정
 */
const editProc = () => {
    let msg = '';
    editCompArr = [];

    $('#userEditFrm input:checkbox[name=corp_svc_cd]').each(function (index) {
        if($(this).is(":checked") === true){
            editCompArr.push($(this).val());
        }
    });

    if ($editUserNm.val() === '') {
        msg = '이름을 입력하세요.';
        $('#editMsg').html(msg);
        $editUserNm.focus();
        return;
    }

    if (editCompArr.length === 0) {
        msg = '계열사 서비스를 선택하세요.';
        $('#editMsg').html(msg);
        return;
    }

    spinnerShow();

    const accessToken = window.localStorage.getItem("accessToken");

    const param = {
        user_nm: $editUserNm.val(),
        comp_gr_cd: $editCompGrCd.val(),
        comp_cd_arr: editCompArr,
        use_yn: $editUseYn.val(),
    };

    $.ajax({
        url: `/api/user/${$editUserIdntfKey.val()}`,
        type: 'PUT',
        data: JSON.stringify(param),
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
                $('#editMsg').html(data.header.message);
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
                        $('#editMsg').html(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#editMsg').html(data.message);
                }
            }else if(request.status === 401){
                setAccessToken(request.responseJSON);
                editProc();
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

/**
 *  setCompCd : 계열사 서비스 코드 세팅
 */
const setCompCd = (type, compList) => {

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: `/api/mng/code/item/CORP_SVC_CD`,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
    }).then(
        (result) => {
            const dataList = result.data;
            let str = '';

            if(type === "edit") {
                $("#editCompArea").html('');

                for (let i = 0; i < dataList.length; i++) {
                    const data = dataList[i];
                    let equalFlg = false;

                    for (let j = 0; j < compList.length; j++) {
                        const compData = compList[j];
                        if(data.cd_val === compData.corp_svc_cd){
                            equalFlg = true;
                        }
                    }

                    if(equalFlg){
                        str = `<div className="custom-control custom-checkbox">
                                    <input className="custom-control-input" type="checkbox" name="corp_svc_cd" value="${data.cd_val}" checked>
                                    <label className="custom-control-label">${data.cd_nm}</label>
                               </div>`;
                    }else {
                        str = `<div className="custom-control custom-checkbox">
                                    <input className="custom-control-input" type="checkbox" name="corp_svc_cd" value="${data.cd_val}">
                                    <label className="custom-control-label">${data.cd_nm}</label>
                                </div>`;
                    }

                    $("#editCompArea").append(str);
                }
            }else{
                $("#writeCompArea").html('');

                for (let i = 0; i < dataList.length; i++) {
                    const data = dataList[i];
                    str = `<div className="custom-control custom-checkbox">
                                <input className="custom-control-input" type="checkbox" name="corp_svc_cd" value="${data.cd_val}">
                                <label className="custom-control-label">${data.cd_nm}</label>
                            </div>`;
                    $("#writeCompArea").append(str);
                }
            }
        },
        (request, status, error) => {
            if (request.status === 500) {
                console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);
            } else if (request.status === 400) {
                const { errorList } = request.responseJSON;
                if (errorList !== undefined) {
                    if (errorList.lengh !== 0) {
                        const { message } = errorList[0];
                        console.log(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#msg').html(data.message);
                }
            }else if(request.status === 401){
                setAccessToken(request.responseJSON);
                setCompCd(type, compList);
            }else if(request.status === 403){
                mainViewTokenInvalidate();
            }
        }
    );
}

/**
 *  lockClear : 패스워드 잠금 해제
 */
const lockClear = () => {

    spinnerShow();

    const accessToken = window.localStorage.getItem("accessToken");

    const param = {
        login_id : $editLoginId.val(),
        user_idntf_key : $editUserIdntfKey.val(),
    };

    $.ajax({
        url: `/api/user/updatePwFailCnt`,
        type: 'PUT',
        data: JSON.stringify(param),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
    }).then(
        (data) => {
            if (data.header.resultCode === 'ok') {
                alert(data.header.message);
            } else {
                $('#editMsg').html(data.header.message);
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
                        $('#editMsg').html(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#editMsg').html(data.message);
                }
            } else if(request.status === 401){
                setAccessToken(request.responseJSON);
                lockClear();
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
}

/**
 *  pwInit : 비밀번호 초기화
 */
const pwInit = () => {

    const accessToken = window.localStorage.getItem("accessToken");

    const param = {
        login_id : $editLoginId.val(),
        user_idntf_key : $editUserIdntfKey.val(),
    };

    spinnerShow();

    $.ajax({
        url: `/api/user/updatePwInit`,
        type: 'PUT',
        data: JSON.stringify(param),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
    }).then(
        (data) => {
            if (data.header.resultCode === 'ok') {
                alert(data.header.message);
            } else {
                $('#editMsg').html(data.header.message);
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
                        $('#editMsg').html(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#editMsg').html(data.message);
                }
            } else if(request.status === 401){
                setAccessToken(request.responseJSON);
                pwInit();
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
}

/**
 * closeModal : 모달 닫기
 */
const closeModal = () => {
    window.$('#userWrite').modal('hide');
    window.$('#userEdit').modal('hide');
};

$(document).ready(() => {
    setCodeSelBox('viewCompGrCd', 'CORP_CD', 'ALL', '');

    setCodeSelBox('writeCompGrCd', 'CORP_CD', 'SEL', '');

    setCodeSelBox('viewUseYn', 'USE_YN', 'ALL', '');

    setCompCd('write', '');

    // 그리드 세팅
    grid = setGridLayout();

    // 페이징 세팅
    pagination = setPagination(page, pagingCallback);

    // 검색버튼
    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    // 등록버튼 클릭시 모달을 초기화한다.
    $('#writeBtn').click(() => {
        initUserMngWrite();
    });

    // 아이디 체크
    $('#signUpCheckBtn').click(() => {
        signUpCheck();
    });

    $("#writeCompAll").click(function() {
        if($("#writeCompAll").is(":checked")) $("#userWriteFrm input[name=corp_svc_cd]").prop("checked", true);
        else $("#userWriteFrm input[name=corp_svc_cd]").prop("checked", false);
    });

    $("#editCompAll").click(function() {
        if($("#editCompAll").is(":checked")) $("#userEditFrm input[name=corp_svc_cd]").prop("checked", true);
        else $("#userEditFrm input[name=corp_svc_cd]").prop("checked", false);
    });

    // 사용자를 등록한다.
    $('#submitBtn').click(() => {
        signUpProc();
    });

    // 사용자를 수정한다.
    $('#editBtn').click(() => {
        editProc();
    });

    //  잠금해제 한다.
    $('#lockClearBtn').click(() => {
        lockClear();
    });

    //  비밀번호 초기화 한다.
    $('#pwInitBtn').click(() => {
        pwInit();
    });

    const searchStrInput = document.getElementById("searchStr");

    searchStrInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("searchBtn").click();
        }
    });

    search();
});
