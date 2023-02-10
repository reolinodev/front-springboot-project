import { setCommSelBox } from '../module/component';
import { mainViewTokenInvalidate, framePageRouter, setAccessToken } from "../module/router";

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

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/main/user',
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            const data =  result.data;
            $("#userNm").html(data.user_nm);
            $("#userIdntfKey").val(data.user_idntf_key);
            $("#authIdntfKeySet").val(data.auth_idntf_key);
            setHeader();
        },
        error(request, status, error) {
            console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);

            if(request.status === 401){
                setAccessToken(request.responseJSON);
                getUserData();
            }
            else if(request.status === 403){
                mainViewTokenInvalidate();
            }
        },
    });
};

/**
 * setHeader : 헤더 구성
 */
const setHeader = () => {

    const userIdntfKey = $('#userIdntfKey').val();
    const authIdntfKey = $('#authIdntfKeySet').val();

    const params = {
        user_idntf_key: userIdntfKey,
    };
    const option = {
        oTxt: 'auth_nm',
        oVal: 'auth_idntf_key',
    };

    setCommSelBox(
        'authIdntfKey',
        '/api/auth/mine',
        'POST',
        '',
        authIdntfKey,
        params,
        option
    );

    if ($('#menuType').val() === 'json') {
        $('#authIdntfKey').prop('disabled', true);
    }

    sessionStorage.setItem('userIdntfKey', userIdntfKey);
    sessionStorage.setItem('authIdntfKey', authIdntfKey);

    getNavList();
}

const getNavList = () => {

    const accessToken = window.localStorage.getItem("accessToken");

    const params = {
        auth_idntf_key :  $('#authIdntfKeySet').val()
    }

    $.ajax({
        url: '/api/main/nav',
        type: 'POST',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
        success(result) {
            const data =  result.data;
            setNavigation(data);
        },
        error(request, status, error) {
            console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);

            if(request.status === 401){
                setAccessToken(request.responseJSON);
                getNavList();
            }
            else if(request.status === 403){
                mainViewTokenInvalidate();
            }
        },
    });
}

/**
 * setNavigation : 네비게이션 구성
 */
const setNavigation = (data) => {

    const firstUrl = data.firstUrl;
    mainUrl = firstUrl;
    const menuLv1List = data.menuLv1List;
    const menuLv2List = data.menuLv2List;

    $("#navFrm #menuIdntfKey").val(firstUrl.menu_idntf_key);
    $("#navFrm #menuNm").val(firstUrl.menu_nm);
    $("#navFrm #prnIdntfKey").val(firstUrl.prn_idntf_key);
    $("#navFrm #prnNm").val(firstUrl.prn_nm);
    $("#navFrm #url").val(firstUrl.url);

    $("#mainFrm #mainUrl").val(firstUrl.url);
    $("#mainFrm #mainMenuNm").val(firstUrl.menu_nm);
    $("#mainFrm #mainParentNm").val(firstUrl.prn_nm);

    $("#navUl").html('');

    for(let i=0; i< menuLv1List.length; i++){
        const menu1Data = menuLv1List[i];
        let str1 = '';
        str1 += `<li class="nav-item menu-open" id="li_${menu1Data.menu_idntf_key}">`
        str1 += `    <a href="#" class="nav-link">`
        str1 += `        <i class="nav-icon fas fa-hockey-puck"></i>`
        str1 += `        <p>`
        str1 += `            ${menu1Data.menu_nm}`
        str1 += `            <i class="right fas fa-angle-left"></i>`
        str1 += `        </p>`
        str1 += `    </a>`
        str1 += `</li>`
        $("#navUl").append(str1);
    }

    for(let j=0; j< menuLv2List.length; j++){
        const menu2Data = menuLv2List[j];

        let str2 = '';
        str2 += `    <ul class="nav nav-treeview">`
        str2 += `        <li class= "nav-item">`
        str2 += `            <a href="#" class="nav-link"`
        str2 += `               id="menu_${menu2Data.menu_idntf_key}"`
        str2 += `               data-id="${menu2Data.menu_idntf_key}"`
        str2 += `               data-url="${menu2Data.url}"`
        str2 += `               data-menunm="${menu2Data.menu_nm}"`
        str2 += `               data-parentnm="${menu2Data.prn_nm}"`
        str2 += `            >`
        str2 += `                <i class="far fa-circle nav-icon"></i>`
        str2 += `                <p>${menu2Data.menu_nm}</p>`
        str2 += `            </a>`
        str2 += `        </li>`
        str2 += `    </ul>`
        $("#li_"+menu2Data.prn_idntf_key).append(str2);
    }

    setNaviEvent();

    loadMainPage();
}

/**
 * loadMainPage : 메인페이지 로드
 */
const loadMainPage = () => {
    let url = $("#navFrm #url").val();
    let menuNm = $("#navFrm #menuNm").val();
    let parentNm = $("#navFrm #prnNm").val();

    const sUrl = sessionStorage.getItem('url');
    if(sUrl !== null && sUrl !== 'undefined') url = sUrl;

    const sChildMenuName = sessionStorage.getItem('childMenuName');
    if(sChildMenuName !== null && sChildMenuName !== 'undefined') menuNm = sChildMenuName;

    const sParentMenuName= sessionStorage.getItem('parentMenuName');
    if(sParentMenuName !== null && sParentMenuName !== 'undefined') parentNm = sParentMenuName;

    framePageRouter(url, parentNm, menuNm);
}

/**
 * setNaviEvent : 네비게이션 이벤트
 */
const setNaviEvent = () => {
    $("a[id^='menu_']").click(function() {
        const url = this.getAttribute("data-url");
        const menuNm = this.getAttribute("data-menunm");
        const parentNm = this.getAttribute("data-parentnm");
        framePageRouter(url, parentNm, menuNm);
    });

    $("a[id='menuUrl']").click(function() {
        const url = mainUrl.url;
        const menuNm =  mainUrl.menu_nm;
        const parentNm = mainUrl.prn_nm;
        framePageRouter(url, parentNm, menuNm);
    });
}

/**
 * calcHeight : 프레임 높이 조정
 */
const calcHeight = () => {
    const defaultHeight = 800; // 테스트 필요(브라우저 크기에 따라서)
    const contentHeight = document.getElementById('contentFrame').contentWindow.document.body.scrollHeight;
    document.getElementById('contentFrame').height = defaultHeight >= contentHeight ? defaultHeight : contentHeight;
    document.getElementById('contentFrame').style.overflow = "hidden";
}

$(document).ready(() => {
    calcHeight();

    getUserData();

    // 권한 변경시
    $('#frm #authIdntfKey').change(() => {
        $("#authIdntfKeySet").val($('#frm #authIdntfKey').val())
        sessionStorage.setItem('authIdntfKey', $("#authIdntfKeySet").val());
        getNavList();
    });

    $('#logout').click(() => {
        logout();
    });
});
