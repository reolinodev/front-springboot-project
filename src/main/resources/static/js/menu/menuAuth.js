import {setBasicTree} from '../module/tree';
import {focustGridFirstRow, setBasicGrid} from '../module/grid';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {setCodeSelBoxCall} from '../module/component';
import {callApi, callGetApi} from '../module/async';

let tree;
let grid;

const $authRole = $('#authRole'); //권한구분
const $menuId = $('#menuId'); //메뉴식별키

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

    tree = setBasicTree(menu, setAuthData);
};

/**
 * setGridLayout : 권한 그리드 구성
 */
const setGridLayout = () => {
    const columns = [
        {header: 'Auth Id', name: 'auth_id', align: 'center', hidden: true},
        {header: '권한명', name: 'auth_nm', align: 'left'},
        {
            header: '사용여부',
            name: 'use_yn',
            align: 'center',
            formatter: 'listItemText',
            editor: {
                type: 'select',
                options: {
                    listItems: [
                        {text: '사용', value: 'Y'},
                        {text: '미사용', value: 'N'},
                    ],
                },
            },
            renderer: {
                styles: {
                    color: '#e83e8c',
                    textDecoration: 'underline',
                    cursor: 'pointer',
                },
            },
        },
        {header: '수정된 날짜', name: 'updated_at', align: 'left'},
        {header: '수정자', name: 'updated_nm', align: 'center'},
    ];
    const gridData = [];
    return setBasicGrid(columns, gridData);
};
const setAuthData = menuId => {
    $menuId.val(menuId);
    getAuthData();
};

/**
 * getAuthData : 권한 조회하기
 */
const getAuthData = () => {
    spinnerShow();

    const url = `/api/menuAuth/${$menuId.val()}`;
    callGetApi(url, getAuthDataSuccess, getAuthDataError);
};

/**
 *  getAuthDataSuccess : getAuthData successCallback
 */
const getAuthDataSuccess = result => {
    if (result.header.result_code === 'ok') {
        const gridData = result.data;
        grid.resetData(gridData);
    }
    spinnerHide();
};

/**
 *  getAuthDataError : getAuthData errorCallback
 */
const getAuthDataError = response => {
    spinnerHide();
    console.log(response);
};

/**
 * save : 메뉴 권한 저장
 */
const save = updatedRows => {
    spinnerShow();

    let url = '/api/menuAuth';

    const type = 'PUT';
    const params = {
        menu_id: $menuId.val(),
        updated_rows: updatedRows,
    };

    callApi(url, type, params, saveSuccess, saveError);
};

/**
 *  saveSuccess : save successCallback
 */
const saveSuccess = result => {
    alert(result.header.message);
    if (result.header.result_code === 'ok') {
        getAuthData();
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

$(document).ready(() => {
    //권한구분 설정 및 트리조회
    setCodeSelBoxCall('authRole', 'AUTH_ROLE', '', '', search);

    grid = setGridLayout();

    // 저장 버튼 클릭 이벤트
    $('#saveBtn').click(() => {
        focustGridFirstRow(grid);

        const rows = grid.getModifiedRows();
        const {updatedRows} = rows;

        if ($menuId.val() === '') {
            alert('선택된 메뉴가 없습니다.');
            return;
        }

        if (updatedRows.length === 0) {
            alert('변경된 내용이 없습니다.');
            return;
        }

        save(updatedRows);
    });
});
