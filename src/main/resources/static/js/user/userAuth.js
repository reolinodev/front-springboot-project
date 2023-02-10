import { setCodeSelBox, setCommSelBox } from '../module/component';
import Page, { setPagination } from '../module/pagination';
import { setCheckBoxGrid } from '../module/grid';
import { serializeFormJson } from '../module/json';
import { mainViewTokenInvalidate, setAccessToken } from "../module/router";
import { spinnerHide, spinnerShow } from "../module/spinner";

let page = new Page(1, false, 10, 0);
let grid;
let pagination;

/**
 * setGridLayout : 그리드 구성
 */
const setGridLayout = () => {
    // 헤더 생성
    const columns = [
        { header: 'No', name: 'rnum', width: 100, align: 'center' },
        { header: '권한 식별자', name: 'auth_idntf_key', align: 'center', hidden: true },
        { header: '사용자 식별자', name: 'user_idntf_key', align: 'center', hidden: true },
        { header: '권한명', name: 'auth_nm', align: 'center' },
        { header: '아이디', name: 'login_id', align: 'center' },
        { header: '이름', name: 'user_nm', align: 'center' },
        { header: '계열사', name: 'corp_nm', align: 'center' },
    ];
    // 데이터
    const gridData = [];

    return setCheckBoxGrid(columns, gridData);
};

/**
 * pagingCallback : 페이징 콜백
 */
const pagingCallback = (returnPage) => {
    page.currentPage = returnPage;
    search();
};

/**
 * search : 조회
 */
const search = () => {

    spinnerShow();

    const params = serializeFormJson('authUserViewFrm');
    params.current_page = page.currentPage;
    params.page_per = page.pagePer;

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/userAuth/',
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

            if (page.pageInit === false) {
                pagination.reset(result.total);
                page.pageInit = true;
            }

            if ($('#viewAuthId').val() !== '') {
                $('#deleteBtn').show();
            } else {
                $('#deleteBtn').hide();
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

const pageInit = () => {
    page = new Page(1, false, Number($('#pagePer').val()), 0);
};

const delProc = () => {
    const checkedRows = grid.getCheckedRows();
    if (checkedRows.length === 0) {
        alert('선택된 항목이 없습니다.');
        return;
    }

    const userArr = [];

    for (const obj of checkedRows) {
        userArr.push(obj.user_idntf_key);
    }

    spinnerShow();

    const params = {
        auth_idntf_key: $('#viewAuthId').val(),
        user_arr: userArr,
    };

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/userAuth/',
        type: 'DELETE',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
    }).then(
        (data) => {
            if (data.header.resultCode === 'ok') {
                alert(data.header.message);
                pageInit();
                search();
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
                delProc();
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

$(document).ready(() => {
    const params = {};
    const option = {
        oTxt: 'auth_nm',
        oVal: 'auth_idntf_key',
    };
    setCommSelBox(
        'viewAuthId',
        '/api/auth/useAuth',
        'POST',
        'ALL',
        '',
        params,
        option
    );

    setCodeSelBox('viewCorpCd', 'CORP_CD', 'ALL', '');

    /**
     * 사용자 권한 등록
     */
    $('#writeBtn').click(() => {
        location.href = '/page/user/userAuth/write';
    });

    // 검색버튼
    $('#searchBtn').click(() => {
        pageInit();
        search();
    });

    // 사용여부, 페이지 개수 변경시 검색
    $('#deleteBtn').click(() => {
        confirm('사용자 권한을 삭제할까요?', delProc());
    });

    // 그리드 세팅
    grid = setGridLayout();

    // 페이징 세팅
    pagination = setPagination(page, pagingCallback);

    const searchStrInput = document.getElementById("searchStr");

    searchStrInput.addEventListener("keyup", function (event) {
        if (event.keyCode === 13) {
            event.preventDefault();
            document.getElementById("searchBtn").click();
        }
    });

    // 검색
    search();
});
