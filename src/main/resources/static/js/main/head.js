import {setCommSelBox} from '../module/component';
import {framePageRouter} from '../module/router';
import {callApi, callApiWithoutBody} from '../module/async';

let mainUrl;

/**
 *  logout : 로그아웃
 */
const logout = () => {
    sessionStorage.clear();
    location.href = '/';
};

/**
 * getUserData : 사용자 정보조회(토큰 내용 가져오기)
 */
const getUserData = () => {
    callApiWithoutBody(
        '/api/main/user',
        'GET',
        getUserDataSuccess,
        getUserDataError
    );
};

/**
 *  getUserDataSuccess : getUserData successCallback
 *  :
 */
const getUserDataSuccess = result => {
    const data = result.data;

    $('#userNm').html(data.user_nm);
    $('#userId').val(data.user_id);

    sessionStorage.setItem('userId', data.user_id);
    sessionStorage.setItem('authId', data.auth_id);

    setMyAuthItem();
    getNavList(data.auth_id);
};

/**
 *  getUserDataError : getUserData errorCallback
 */
const getUserDataError = response => {
    console.log(response);
};

/**
 * setMyAuthItem : 내가 가진 권한을 셀렉트박스에 표현
 */
const setMyAuthItem = () => {
    const userId = $('#userId').val();

    const params = {};
    const option = {
        oTxt: 'auth_nm',
        oVal: 'auth_id',
    };

    setCommSelBox(
        'authId',
        `/api/item/auth/mine/${userId}`,
        'POST',
        '',
        '',
        params,
        option
    );
};

/**
 * getNavList : 네비게이션 리스트 조회
 */
const getNavList = authId => {
    const url = '/api/main/nav';
    const type = 'POST';
    const params = {
        auth_id: authId,
    };

    callApi(url, type, params, getNavListSuccess, getNavListError);
};

/**
 *  getNavListSuccess : getNavList successCallback
 *  :
 */
const getNavListSuccess = result => {
    setNaviList(result.data);
};

/**
 *  getNavListError : getNavList errorCallback
 */
const getNavListError = response => {
    console.log(response);
};

/**
 * setNavigation : 네비게이션 구성
 */
const setNaviList = data => {
    const menuUrl = data.menuUrl;
    mainUrl = menuUrl;
    const menuLv1List = data.menuLv1List;
    const menuLv2List = data.menuLv2List;

    $('#navFrm #menuId').val(menuUrl.menu_id);
    $('#navFrm #menuNm').val(menuUrl.menu_nm);
    $('#navFrm #prnMenuId').val(menuUrl.prn_menu_id);
    $('#navFrm #prnMenuNm').val(menuUrl.prn_menu_nm);
    $('#navFrm #url').val(menuUrl.url);

    $('#navUl').html('');

    for (let i = 0; i < menuLv1List.length; i++) {
        const menu1Data = menuLv1List[i];
        let str1 = '';
        str1 += `<li class="nav-item menu-open" id="li_${menu1Data.menu_id}">`;
        str1 += `    <a href="javascript:" class="nav-link">`;
        str1 += `        <i class="nav-icon fas fa-hockey-puck"></i>`;
        str1 += `        <p>`;
        str1 += `            ${menu1Data.menu_nm}`;
        str1 += `            <i class="right fas fa-angle-left"></i>`;
        str1 += `        </p>`;
        str1 += `    </a>`;
        str1 += `</li>`;
        $('#navUl').append(str1);
    }

    for (let j = 0; j < menuLv2List.length; j++) {
        const menu2Data = menuLv2List[j];

        let str2 = '';
        str2 += `    <ul class="nav nav-treeview">`;
        str2 += `        <li class= "nav-item">`;
        str2 += `            <a href="javascript:" class="nav-link"`;
        str2 += `               id="menu_${menu2Data.menu_id}"`;
        str2 += `               data-id="${menu2Data.menu_id}"`;
        str2 += `               data-url="${menu2Data.url}"`;
        str2 += `               data-menunm="${menu2Data.menu_nm}"`;
        str2 += `               data-parentnm="${menu2Data.prn_menu_nm}"`;
        str2 += `            >`;
        str2 += `                <i class="far fa-circle nav-icon"></i>`;
        str2 += `                <p>${menu2Data.menu_nm}</p>`;
        str2 += `            </a>`;
        str2 += `        </li>`;
        str2 += `    </ul>`;
        $('#li_' + menu2Data.prn_menu_id).append(str2);
    }

    setNaviEvent();

    loadMainPage();
};

/**
 * loadMainPage : 메인페이지 로드
 */
const loadMainPage = () => {
    let url = $('#navFrm #url').val();
    let menuNm = $('#navFrm #menuNm').val();
    let prnMenuNm = $('#navFrm #prnMenuNm').val();

    const sUrl = sessionStorage.getItem('url');
    if (sUrl !== null && sUrl !== 'undefined') url = sUrl;

    const sChildMenuName = sessionStorage.getItem('childMenuName');
    if (sChildMenuName !== null && sChildMenuName !== 'undefined')
        menuNm = sChildMenuName;

    const sParentMenuName = sessionStorage.getItem('parentMenuName');
    if (sParentMenuName !== null && sParentMenuName !== 'undefined')
        prnMenuNm = sParentMenuName;

    framePageRouter(url, prnMenuNm, menuNm);
};

/**
 * setNaviEvent : 네비게이션 이벤트
 */
const setNaviEvent = () => {
    $("a[id^='menu_']").click(function () {
        const url = this.getAttribute('data-url');
        const menuNm = this.getAttribute('data-menunm');
        const prnMenuNm = this.getAttribute('data-parentnm');
        framePageRouter(url, prnMenuNm, menuNm);
    });

    $("a[id='menuUrl']").click(function () {
        const url = mainUrl.url;
        const menuNm = mainUrl.menu_nm;
        const prnMenuNm = mainUrl.prn_menu_nm;
        framePageRouter(url, prnMenuNm, menuNm);
    });
};

/**
 * calcHeight : 프레임 높이 조정
 */
const calcHeight = () => {
    const defaultHeight = 800; // 테스트 필요(브라우저 크기에 따라서)
    const contentHeight =
        document.getElementById('contentFrame').contentWindow.document.body
            .scrollHeight;
    document.getElementById('contentFrame').height =
        defaultHeight >= contentHeight ? defaultHeight : contentHeight;
    document.getElementById('contentFrame').style.overflow = 'hidden';
};

$(document).ready(() => {
    calcHeight();

    getUserData();

    // 권한 변경시
    $('#frm #authId').change(() => {
        const authId = $('#frm #authId').val();
        sessionStorage.setItem('authId', authId);
        getNavList(authId);
    });

    $('#logout').click(() => {
        logout();
    });
});
