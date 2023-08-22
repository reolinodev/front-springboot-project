import {setCommSelBox} from '../module/component';
import {framePageRouter} from '../module/router';
import {callApiWithoutBody} from '../module/async';

let mainUrl;

/**
 *  logout : 로그아웃
 */
const logout = () => {
    sessionStorage.clear();
    location.href = '/';
};

/**
 * getUser : 사용자 정보조회(토큰 내용 가져오기)
 */
const getUser = () => {
    callApiWithoutBody(
        '/api/main/user',
        'GET',
        getUserSuccess,
        getUserError
    );
};

/**
 *  getUserSuccess : getUser successCallback
 *  :
 */
const getUserSuccess = result => {
    const data = result.data;

    $('#userNm').html(data.userNm);
    $('#userId').val(data.userId);

    sessionStorage.setItem('userId', data.userId);
    sessionStorage.setItem('authId', data.authId);

    setMyAuthItem();
    getNavList(data.authId);
};

/**
 *  getUserError : getUser errorCallback
 */
const getUserError = response => {
    console.log(response);
};

/**
 * setMyAuthItem : 내가 가진 권한을 셀렉트박스에 표현
 */
const setMyAuthItem = () => {
    const userId = $('#userId').val();

    const params = {};
    const option = {
        oTxt: 'authNm',
        oVal: 'authId',
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
    const url = `/api/main/nav/${authId}`;
    const type = 'GET';

    callApiWithoutBody(url, type, getNavListSuccess, getNavListError);
};

/**
 *  getNavListSuccess : getNavList successCallback
 *  :
 */
const getNavListSuccess = result => {
    setNavis(result.data);
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
const setNavis = data => {
    console.log('aaa', data);
    const menuUrl = data.menuUrl;
    mainUrl = menuUrl;
    const menuLv1List = data.menuLv1List;
    const menuLv2List = data.menuLv2List;

    $('#navFrm #menuId').val(menuUrl.menuId);
    $('#navFrm #menuNm').val(menuUrl.menuNm);
    $('#navFrm #prnMenuId').val(menuUrl.prnMenuId);
    $('#navFrm #prnMenuNm').val(menuUrl.prnMenuNm);
    $('#navFrm #url').val(menuUrl.url);

    $('#navUl').html('');

    for (let i = 0; i < menuLv1List.length; i++) {
        const menu1Data = menuLv1List[i];
        let str1 = '';
        str1 += `<li class="nav-item menu-open" id="li_${menu1Data.menuId}">`;
        str1 += `    <a href="javascript:" class="nav-link">`;
        str1 += `        <i class="nav-icon fas fa-hockey-puck"></i>`;
        str1 += `        <p>`;
        str1 += `            ${menu1Data.menuNm}`;
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
        str2 += `               id="menu_${menu2Data.menuId}"`;
        str2 += `               data-id="${menu2Data.menuId}"`;
        str2 += `               data-url="${menu2Data.url}"`;
        str2 += `               data-menunm="${menu2Data.menuNm}"`;
        str2 += `               data-parentnm="${menu2Data.prnMenuNm}"`;
        str2 += `            >`;
        str2 += `                <i class="far fa-circle nav-icon"></i>`;
        str2 += `                <p>${menu2Data.menuNm}</p>`;
        str2 += `            </a>`;
        str2 += `        </li>`;
        str2 += `    </ul>`;
        $('#li_' + menu2Data.prnMenuId).append(str2);
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
        const menuNm = mainUrl.menuNm;
        const prnMenuNm = mainUrl.prnMenuNm;
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

    getUser();

    // 권한 변경시
    $('#frm #authId').change(() => {
        const authId = $('#frm #authId').val();
        sessionStorage.setItem('authId', authId);
        sessionStorage.removeItem('url');
        sessionStorage.removeItem('childMenuName');
        sessionStorage.removeItem('parentMenuName');

        getNavList(authId);
    });

    $('#logout').click(() => {
        logout();
    });
});
