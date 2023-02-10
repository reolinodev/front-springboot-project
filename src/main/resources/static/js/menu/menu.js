import { setCodeSelBox, setCommSelBox } from '../module/component';
import { setBasicTree } from '../module/tree';
import { checkKr } from '../module/validation';
import { mainViewTokenInvalidate, setAccessToken } from "../module/router";
import { spinnerHide, spinnerShow } from "../module/spinner";

let tree;

/**
 * search : 메뉴트리 조회
 */
const search = () => {

    spinnerShow();

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: `/api/menu/menu/tree`,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            setMenuList(result.data);

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
 * setMenuList : 조회된 데이터 트리 데이터로 정제 후 트리컴퍼넌트 호출
 */
const setMenuList = (list) => {
    const menu = [];

    for (const data of list) {
        if (data.menu_lv === 1) {
            const obj1 = {};
            const children = [];

            obj1.text = data.menu_nm;
            obj1.target = data.menu_idntf_key;

            for (const data2 of list) {
                if (data.menu_idntf_key === data2.prn_idntf_key) {
                    const obj2 = {};
                    obj2.text = data2.menu_nm;
                    obj2.target = data2.menu_idntf_key;
                    children.push(obj2);
                }
            }
            obj1.children = children;
            menu.push(obj1);
        }
    }

    tree = setBasicTree(menu, searchMenuInfo);
};

/**
 * searchMenuInfo : 메뉴 상세 정보 조회하기
 */
const searchMenuInfo = (menuIdntfKey) => {

    spinnerShow();

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: `/api/menu/menu/${menuIdntfKey}`,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            setMenuData(result.data);
            spinnerHide();
        },
        error(request, status, error) {
            console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);

            if(request.status === 401){
                setAccessToken(request.responseJSON);
                searchMenuInfo(menuIdntfKey);
            }
            else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        },
    });
};

/**
 * setMenuData : 조회된 메뉴 데이터 화면에 매핑
 */
const setMenuData = (data) => {
    $('#menuIdntfKey').val(data.menu_idntf_key);
    $('#menuLv').val(data.menu_lv);
    $('#menuNm').val(data.menu_nm);
    $('#url').val(data.url);
    $('#useYn').val(data.use_yn);
    $('#ord').val(data.ord);

    if (data.menu_type === 'URL') {
        $('#menuType1').prop('checked', true);
        $('#boardId').val('');
        $('#boardId').hide();
    } else {
        $('#menuType2').prop('checked', true);
        const url = data.url;
        const boardKey = url.substring(url.lastIndexOf('/') + 1);
        if(boardKey !== '' ){
            $('#boardId').val(boardKey);
        }
        $('#boardId').show();
    }

    if (data.main_yn === 'Y') {
        $('#mainYn').prop('checked', true);
    } else {
        $('#mainYn').prop('checked', false);
    }

    if (data.menu_lv === 1) {
        const str = '<option value="0">-- 없음 --</option>';
        $('#prnIdntfKey').html(str);
    } else {
        const params = {
            prn_idntf_key: data.prn_idntf_key,
        };
        const option = {
            oTxt: 'menu_nm',
            oVal: 'menu_idntf_key',
        };
        setCommSelBox(
            'prnIdntfKey',
            '/api/menu/menu/parent',
            'POST',
            '',
            '',
            params,
            option
        );
    }

    $('#menuLv').attr('disabled', true);
    $('#prnIdntfKey').attr('disabled', true);
};

/**
 * initMenuAdd : 메뉴 등록 초기화 하기
 */
const initMenuAdd = () => {
    $('#menuIdntfKey').val('');
    $('#menuLv').val(1);

    const str = '<option value="0">-- 없음 --</option>';
    $('#prnIdntfKey').html(str);

    $('#menuType1').prop('checked', true);
    $('#menuNm').val('');
    $('#url').val('');
    $('#useYn').val('Y');
    $('#ord').val('');
    $('#mainYn').prop('checked', false);

    $('#menuLv').attr('disabled', false);
    $('#prnIdntfKey').attr('disabled', false);
};

/**
 * delMenuProc : 메뉴 삭제
 */
const delMenuProc = () => {

    spinnerShow();

    const param = {
        menu_idntf_key: $('#menuIdntfKey').val(),
        menu_lv: $('#menuLv').val(),
    };

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/menu/menu/',
        type: 'DELETE',
        data: JSON.stringify(param),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
    }).then(
        (data) => {
            alert(data.header.message);
            if (data.header.resultCode === 'ok') {
                search();
            }

            spinnerHide();
        },
        (request, status, error) => {
            if (request.status === 500) {
                console.log(
                    `code:${request.status}\n` +
                    `message:${request.responseText}\n` +
                    `error:${error}`
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
            } else if(request.status === 401){
                setAccessToken(request.responseJSON);
                delMenuProc();
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

/**
 * saveMenuProc : 메뉴 저장
 */
const saveMenuProc = () => {
    let msg = '';

    if ($('#menuLv').val() === '2' && $('#prnIdntfKey').val() === '') {
        msg = '상위 메뉴를 선택하세요.';
        alert(msg);
        $('#prnIdntfKey').focus();
        return;
    }
    if ($('#menuNm').val() === '') {
        msg = '메뉴명을 입력하세요.';
        alert(msg);
        $('#url').focus();
        return;
    }
    if (checkKr($('#url').val())) {
        msg = 'URL은 한글로 입력하실 수 없습니다.';
        alert(msg);
        $('#url').focus();
        return;
    }

    let mainYn = 'N';
    if ($('input[name="main_yn"]').is(':checked')) {
        mainYn = 'Y';
    }

    spinnerShow();

    const param = {
        menu_lv: $('#menuLv').val(),
        prn_idntf_key: $('#prnIdntfKey').val(),
        menu_nm: $('#menuNm').val(),
        menu_type: $("input[name='menu_type']:checked").val(),
        url: $('#url').val(),
        use_yn: $('#useYn').val(),
        ord: $('#ord').val(),
        main_yn: mainYn,
    };

    let url = '/api/menu/menu/';

    if ($('#menuIdntfKey').val() !== '') {
        url = `/api/menu/menu/${$('#menuIdntfKey').val()}`;
    }

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url,
        type: 'PUT',
        data: JSON.stringify(param),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
    }).then(
        (data) => {
            alert(data.header.message);
            if (data.header.resultCode === 'ok') {
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
                saveMenuProc();
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
}

$(document).ready(() => {
    setCodeSelBox('useYn', 'USE_YN', '', 'Y');

    const option = {
        oTxt: 'board_title',
        oVal: 'board_idntf_key',
    };

    const params = {};

    setCommSelBox(
        'boardId',
        '/api/board/select',
        'POST',
        'SEL',
        '',
        params,
        option
    );

    search();

    // 메뉴 레벨 변경시 상위 메뉴 검색
    $('#menuLv').change(() => {
        if ($('#menuLv').val() === '2') {
            const params = {
            };
            const option = {
                oTxt: 'menu_nm',
                oVal: 'menu_idntf_key',
            };
            setCommSelBox(
                'prnIdntfKey',
                '/api/menu/menu/parent',
                'POST',
                'SEL',
                '',
                params,
                option
            );
        } else {
            const str = '<option value="0">-- 없음 --</option>';
            $('#prnIdntfKey').html(str);
        }
    });

    // 저장 버튼 클릭 이벤트
    $('#saveBtn').click(() => {
        saveMenuProc();
    });

    // 추가 버튼 클릭 이벤트
    $('#addBtn').click(() => {
        initMenuAdd();
    });

    // 삭제 버튼 클릭 이벤트
    $('#delBtn').click(() => {
        if ($('#menuIdntfKey').val() === '') {
            alert('선택된 메뉴가 없습니다.');
            return;
        }

        if(confirm("선택된 메뉴를 삭제하시겠습니까?")){
            delMenuProc();
        }
    });

    $("input[name='menu_type']").change(() => {
        const menuType = $("input[name='menu_type']:checked").val();
        $("#url").val('');
        $("#boardId").val('');
        if(menuType === 'URL') {
            $("#boardId").hide();
        }else {
            $("#boardId").show();
        }
    });

    // 추가 버튼 클릭 이벤트
    $('#boardId').change(() => {
        const boardId = $('#boardId').val();

        if(boardId !== ''){
            $("#url").val(`/page/board/post/`+boardId);
        }
    });

});
