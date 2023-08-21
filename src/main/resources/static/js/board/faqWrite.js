import {setBasicEditor} from '../module/editor';
import {setCommSelBox} from '../module/component';
import {serializeFormJson} from '../module/json';
import {spinnerHide} from '../module/spinner';
import {callApi} from '../module/async';

let editor;
let content = '';

const $boardId = $('#boardId');
const $faqTitle = $('#faqTitle');

/**
 *  save : 게시글 등록
 */
const save = () => {
    let msg = '';

    if ($boardId.val() === '') {
        msg = '게시판을 선택하세요.';
        alert(msg);
        $boardId.focus();
        return;
    }
    if ($faqTitle.val() === '') {
        msg = '제목을 입력하세요.';
        alert(msg);
        $faqTitle.focus();
        return;
    }

    $('#mainText').val(editor.getMarkdown());

    let url = `/api/faq`;
    const type = 'PUT';
    const params = serializeFormJson('faqWriteFrm');
    callApi(url, type, params, saveSuccess, saveError);
};

const saveSuccess = result => {
    if (result.header.resultCode === 'ok') {
        alert(result.header.message);
        spinnerHide();
        location.href = '/page/board/faq/list/init';
    } else {
        alert(result.header.message);
    }

    spinnerHide();
};

/**
 *  saveError : save errorCallback
 */
const saveError = response => {
    spinnerHide();

    let errorMessage = '';
    if(response["errorList"] !== undefined && response["errorList"].length !== 0){
        errorMessage = response["errorList"][0].message;
    }else{
        errorMessage = response.message;
    }
    alert(errorMessage);
};

const setBoardBox = () => {
    const option = {
        oTxt: 'boardTitle',
        oVal: 'boardId',
    };

    const params = {};

    setCommSelBox(
        'boardId',
        '/api/item/board/FAQ',
        'POST',
        'SEL',
        '',
        params,
        option
    );
};

$(document).ready(() => {
    setBoardBox();

    editor = setBasicEditor('editor', content, 500);

    $('#backBtn').click(() => {
        location.href = '/page/board/faq/list/init';
    });

    $('#saveBtn').click(() => {
        save();
    });
});
