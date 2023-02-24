import {
    setCodeSelBox,
    setCodeSelBoxCall,
    setCommSelBox,
} from '../module/component';
import {setBasicTree} from '../module/tree';
import {checkKr} from '../module/validation';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi, callGetApi} from '../module/async';

let tree;

const $authRole = $('#authRole'); //권한구분
const $menuId = $('#menuId'); //메뉴식별키
const $menuLv = $('#menuLv'); //메뉴레벨
const $menuNm = $('#menuNm'); //메뉴명
const $url = $('#url'); //url
const $useYn = $('#useYn'); //사용여부
const $ord = $('#ord'); //순서
const $boardVal = $('#boardVal'); //게시판식별키
const $mainYn = $('#mainYn'); //메인여부
const $prnMenuId = $('#prnMenuId'); //상위메뉴
const $menuType1 = $('#menuType1'); //메뉴타입 - 도메인
const $menuType2 = $('#menuType2 '); //메뉴타입 - 게시판

/**
 * search : 메뉴트리 조회
 */
const search = () => {
    spinnerShow();
    const url = `/api/menu/tree/${$authRole.val()}`;
    callGetApi(url, searchSuccess, searchError);
};

/**
 *  searchSuccess : search successCallback
 */
const searchSuccess = result => {
    if (result.header.result_code === 'ok') {
        setMenuTree(result.data);
    }
    spinnerHide();
};

/**
 *  searchError : search errorCallback
 */
const searchError = response => {
    spinnerHide();
    console.log(response);
};

/**
 * setMenuList : 조회된 데이터 트리 데이터로 정제 후 트리컴퍼넌트 호출
 */
const setMenuTree = list => {
    const menu = [];

    for (const data of list) {
        if (data.menu_lv === 1) {
            const obj1 = {};
            const children = [];

            obj1.text = data.menu_nm;
            obj1.target = data.menu_id;

            for (const data2 of list) {
                if (data.menu_id === data2.prn_menu_id) {
                    const obj2 = {};
                    obj2.text = data2.menu_nm;
                    obj2.target = data2.menu_id;
                    children.push(obj2);
                }
            }
            obj1.children = children;
            menu.push(obj1);
        }
    }

    tree = setBasicTree(menu, getMenuData);
};

/**
 * getMenuData : 메뉴 상세 정보 조회하기
 */
const getMenuData = menuId => {
    spinnerShow();

    const url = `/api/menu/${menuId}`;
    callGetApi(url, getMenuDataSuccess, getMenuDataError);
};

/**
 *  getMenuDataSuccess : getMenuData successCallback
 */
const getMenuDataSuccess = result => {
    if (result.header.result_code === 'ok') {
        setMenuData(result.data);
    }
    spinnerHide();
};

/**
 *  getMenuDataError : getMenuData errorCallback
 */
const getMenuDataError = response => {
    spinnerHide();
    console.log(response);
};

/**
 * setMenuData : 조회된 메뉴 데이터 화면에 매핑
 */
const setMenuData = data => {
    $menuId.val(data.menu_id);
    $menuLv.val(data.menu_lv);
    $menuNm.val(data.menu_nm);
    $url.val(data.url);
    $useYn.val(data.use_yn);
    $ord.val(data.ord);

    if (data.menu_type === 'URL') {
        $menuType1.prop('checked', true);
        $menuType2.prop('checked', false);
        $boardVal.val('');
        $boardVal.hide();
    } else {
        $menuType1.prop('checked', false);
        $menuType2.prop('checked', true);
        $boardVal.val(data.board_val);
        $boardVal.show();
    }

    if (data.main_yn === 'Y') {
        $mainYn.prop('checked', true);
    } else {
        $mainYn.prop('checked', false);
    }

    if (data.menu_lv === 1) {
        const str = '<option value="0">-- 없음 --</option>';
        $prnMenuId.html(str);
    } else {
        setPrnMenuSelectBox('', data.prn_menu_id);
    }

    $menuLv.attr('disabled', true);
    $prnMenuId.attr('disabled', true);
};

/**
 * initMenuAdd : 메뉴 등록 초기화 하기
 */
const initMenuAdd = () => {
    $menuId.val('');
    $menuLv.val(1);

    const str = '<option value="0">-- 없음 --</option>';
    $prnMenuId.html(str);

    $menuType1.prop('checked', true);
    $menuNm.val('');
    $url.val('');
    $useYn.val('Y');
    $ord.val('');
    $mainYn.prop('checked', false);

    $menuLv.attr('disabled', false);
    $prnMenuId.attr('disabled', false);
};

/**
 * save : 메뉴 저장
 */
const save = () => {
    let msg = '';

    if ($menuLv.val() === '2' && $prnMenuId.val() === '') {
        msg = '상위 메뉴를 선택하세요.';
        alert(msg);
        $prnMenuId.focus();
        return;
    }
    if ($menuNm.val() === '') {
        msg = '메뉴명을 입력하세요.';
        alert(msg);
        $url.focus();
        return;
    }
    if (checkKr($url.val())) {
        msg = 'URL은 한글로 입력하실 수 없습니다.';
        alert(msg);
        $url.focus();
        return;
    }

    let mainYn = 'N';
    if ($('input[name="main_yn"]').is(':checked')) {
        mainYn = 'Y';
    }

    spinnerShow();

    let url = '/api/menu';
    if ($menuId.val() !== '') {
        url = `/api/menu/${$menuId.val()}`;
    }

    const type = 'PUT';
    const params = {
        menu_lv: $menuLv.val(),
        prn_menu_id: $prnMenuId.val(),
        menu_nm: $menuNm.val(),
        menu_type: $("input[name='menu_type']:checked").val(),
        url: $url.val(),
        use_yn: $useYn.val(),
        ord: $ord.val(),
        main_yn: mainYn,
        auth_role: $authRole.val(),
        board_val: $boardVal.val(),
    };

    callApi(url, type, params, saveSuccess, saveError);
};

/**
 *  saveSuccess : save successCallback
 */
const saveSuccess = result => {
    alert(result.header.message);
    if (result.header.result_code === 'ok') {
        search();
    }

    spinnerHide();
};

/**
 *  saveError : save errorCallback
 */
const saveError = response => {
    console.log(response);
    spinnerHide();
};

/**
 * menuDelete : 메뉴 삭제
 */
const menuDelete = () => {
    spinnerShow();

    let url = '/api/menu';

    const type = 'DELETE';

    const params = {
        menu_id: $('#menuId').val(),
        menu_lv: $('#menuLv').val(),
    };

    callApi(url, type, params, menuDeleteSuccess, menuDeleteError);
};

/**
 *  menuDeleteSuccess : menuDelete successCallback
 */
const menuDeleteSuccess = result => {
    alert(result.header.message);
    if (result.header.result_code === 'ok') {
        search();
    }

    spinnerHide();
};

/**
 *  menuDeleteError : menuDelete errorCallback
 */
const menuDeleteError = response => {
    alert(response.message);
    spinnerHide();
};

const initSelectBox = () => {
    setCodeSelBox('useYn', 'USE_YN', '', 'Y');

    setCodeSelBox('menuLv', 'MENU_LV', '', 'Y');

    setBoardBox('');
};

const setBoardBox = selected => {
    const option = {
        oTxt: 'board_title',
        oVal: 'board_val',
    };

    const params = {};

    setCommSelBox(
        'boardVal',
        '/api/item/board/ALL/Y',
        'POST',
        'SEL',
        selected,
        params,
        option
    );
};

const setPrnMenuSelectBox = (type, prnMenuId) => {
    const params = {};
    const option = {
        oTxt: 'menu_nm',
        oVal: 'menu_id',
    };
    setCommSelBox(
        'prnMenuId',
        `/api/item/menu/prn-menu/${$authRole.val()}`,
        'POST',
        type,
        prnMenuId,
        params,
        option
    );
};

$(document).ready(() => {
    //권한구분 설정 및 트리조회
    setCodeSelBoxCall('authRole', 'AUTH_ROLE', '', '', search);

    // 권한구분 변경 이벤트
    $('#authRole').change(() => {
        search();
    });

    //입력폼 셀렉트박스 초기화
    initSelectBox();

    // 메뉴 레벨 변경시 상위 메뉴 검색
    $('#menuLv').change(() => {
        if ($('#menuLv').val() === '2') {
            setPrnMenuSelectBox('SEL', '');
        } else {
            const str = '<option value="0">-- 없음 --</option>';
            $('#prnMenuId').html(str);
        }
    });

    // 저장 버튼 클릭 이벤트
    $('#saveBtn').click(() => {
        save();
    });

    // 추가 버튼 클릭 이벤트
    $('#addBtn').click(() => {
        initMenuAdd();
    });

    // 삭제 버튼 클릭 이벤트
    $('#delBtn').click(() => {
        if ($('#menuId').val() === '') {
            alert('선택된 메뉴가 없습니다.');
            return;
        }

        if (confirm('선택된 메뉴를 삭제하시겠습니까?')) {
            menuDelete();
        }
    });

    $("input[name='menu_type']").change(() => {
        const menuType = $("input[name='menu_type']:checked").val();
        $url.val('');
        $boardVal.val('');
        if (menuType === 'URL') {
            $boardVal.hide();
        } else {
            $boardVal.show();
        }
    });

    // 게시판식별키 변경 이벤트
    $('#boardVal').change(() => {
        const boardId = $boardVal.val();

        if (boardId !== '') {
            const arr = boardId.split('/');
            const boardIdStr = arr[0];
            const boardTypeStr = arr[1];

            $('#url').val(
                `/page/board/${boardTypeStr}/list/init/` + boardIdStr
            );
        }
    });
});
