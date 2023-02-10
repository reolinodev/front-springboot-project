import { setBasicTree } from '../module/tree';
import {
    focustGridFirstRow,
    setBasicGrid
} from '../module/grid';
import { mainViewTokenInvalidate, setAccessToken } from "../module/router";
import { spinnerHide, spinnerShow } from "../module/spinner";

let tree;
let grid;

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

    tree = setBasicTree(menu, setMenuId);
};

/**
 * setGridLayout : 권한 그리드 구성
 */
const setGridLayout = () => {
    const columns = [
        { header: 'Auth Id', name: 'auth_idntf_key', align: 'center', hidden: true },
        { header: '권한명', name: 'auth_nm', align: 'left' },
        {
            header: '사용여부',
            name: 'use_yn',
            align: 'center',
            formatter: 'listItemText',
            editor: {
                type: 'select',
                options: {
                    listItems: [
                        { text: '사용', value: 'Y' },
                        { text: '미사용', value: 'N' },
                    ],
                },
            },
            renderer: { styles: {color: '#e83e8c', textDecoration : 'underline', cursor: 'pointer'}}
        },
        { header: '수정된 날짜', name: 'sys_mdfcn_dt', align: 'left' },
        { header: '수정자', name: 'sys_mdfcn_nm', align: 'center' },
    ];
    const gridData = [];
    return setBasicGrid(columns, gridData);
};
const setMenuId = (menuId) => {
    $('#menuIdntfKey').val(menuId);

    searchAuthMenu();
};

/**
 * searchMenuInfo : 메뉴 상세 정보 조회하기
 */
const searchAuthMenu = () => {

    spinnerShow();

    const params = {
        menu_idntf_key: $('#menuIdntfKey').val(),
    };

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/menu/authMenu/',
        type: 'POST',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            const gridData = result.data;
            grid.resetData(gridData);

            spinnerHide();
        },
        error(request, status, error) {
            console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);

            if(request.status === 401){
                setAccessToken(request.responseJSON);
                searchAuthMenu();
            }
            else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        },
    });
};

/**
 * saveProc : 메뉴 권한 저장
 */
const saveProc = (updatedRows) => {

    spinnerShow();

    const param = {
        menu_idntf_key: $('#menuIdntfKey').val(),
        updated_rows: updatedRows,
    };

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/menu/authMenu/',
        type: 'PUT',
        data: JSON.stringify(param),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
    }).then(
        (data) => {
            searchAuthMenu();
            alert(data.header.message);

            spinnerHide();
        },
        (request, status, error) => {
            console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);

            if(request.status === 401){
                setAccessToken(request.responseJSON);
                saveProc(updatedRows);
            }
            else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

$(document).ready(() => {

    search();

    grid = setGridLayout();

    // 저장 버튼 클릭 이벤트
    $('#saveBtn').click(() => {
        focustGridFirstRow(grid);

        const rows = grid.getModifiedRows();
        const { updatedRows } = rows;

        if ($('#menuIdntfKey').val() === '') {
            alert('선택된 메뉴가 없습니다.');
            return;
        }

        if (updatedRows.length === 0) {
            alert('변경된 내용이 없습니다.');
            return;
        }

        saveProc(updatedRows);
    });
});
