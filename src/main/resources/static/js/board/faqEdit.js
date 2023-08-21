import {setBasicEditor} from '../module/editor';
import {setCodeSelBox, setCommSelBox} from '../module/component';
import {serializeFormJson} from '../module/json';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi, callApiWithoutBody} from '../module/async';

let editor;

const faqId = $('#faqId').val(); //게시글식별키
const $faqTitle = $('#faqTitle'); //게시글제목
const $createdNm = $('#createdNm'); //작성자명
const $createdAt = $('#createdAt'); //작성시간
const $createdId = $('#createdId'); //작성자식별키
const returnUrl = '/page/board/faq/list/back';

/**
 * search : 게시판 수정 화면 호출
 */
const search = () => {
    spinnerShow();
    callApiWithoutBody(`/api/faq/${faqId}`, 'GET', searchSuccess, searchError);
};

/**
 *  searchSuccess : search successCallback
 */
const searchSuccess = result => {
    if (result.header["resultCode"] === 'ok') {
        setFaqData(result.data);
    }
    spinnerHide();
};

/**
 *  searchError : search errorCallback
 */
const searchError = response => {
    spinnerHide();
    console.log(response.message);
};

const setFaqData = data => {
    setBoardBox(data.boardId);

    $faqTitle.val(data.faqTitle);
    $createdNm.val(data.createdIdLabel);
    $createdAt.val(data.createdAtLabel);
    $createdId.val(data.createdId);

    editor = setBasicEditor('editor', data.mainText, 500);

    setCodeSelBox('useYn', 'USE_YN', '', data.useYn);

    $('#boardId').prop('disabled', true);
};

const setBoardBox = boardId => {
    const option = {
        oTxt: 'boardTitle',
        oVal: 'boardId',
    };

    const params = {};

    setCommSelBox(
        'boardId',
        '/api/item/board/FAQ',
        'POST',
        '',
        boardId,
        params,
        option
    );
};

/**
 *  update : 게시글 수정
 */
const update = () => {
    let msg = '';

    if ($faqTitle.val() === '') {
        msg = '제목을 입력하세요.';
        alert(msg);
        $faqTitle.focus();
        return;
    }

    $('#mainText').val(editor.getMarkdown());

    let url = `/api/faq/${faqId}`;
    const type = 'PUT';
    const params = serializeFormJson('faqEditFrm');
    callApi(url, type, params, updateSuccess, updateError);
};

/**
 *  updateSuccess : update successCallback
 */
const updateSuccess = result => {
    if (result.header["resultCode"] === 'ok') {
        alert(result.header.message);
        location.href = returnUrl;
    } else {
        alert(result.header.message);
    }

    spinnerHide();
};

/**
 *  updatError : update errorCallback
 */
const updateError = response => {
    spinnerHide();

    let errorMessage;
    if(response["errorList"] !== undefined && response["errorList"].length !== 0){
        errorMessage = response["errorList"][0].message;
    }else{
        errorMessage = response.message;
    }
    alert(errorMessage);
};

$(document).ready(() => {
    search();

    $('#backBtn').click(() => {
        location.href = returnUrl;
    });

    $('#updateBtn').click(() => {
        update();
    });
});
