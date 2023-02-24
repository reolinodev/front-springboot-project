import {setBasicEditor} from '../module/editor';
import {setCommSelBox} from '../module/component';
import {serializeFormJson} from '../module/json';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi} from '../module/async';

let editor;
let content = '';

const $boardId = $('#boardId');
const $postTitle = $('#postTitle');
const boardKey = $('#boardKey').val();
const postType = $('#postType').val();

/**
 *  save : 게시글 등록
 */
const save = () => {
    let msg = '';

    if ($boardId.val() === '') {
        msg = '게시판을 선택하세요';
        alert(msg);
        $boardId.focus();
        return;
    }
    if ($postTitle.val() === '') {
        msg = '제목을 입력하세요..';
        alert(msg);
        $postTitle.focus();
        return;
    }

    content = editor.getMarkdown();

    $('#boardId').prop('disabled', false);
    $('#mainText').val(content);

    spinnerShow();

    let url = `/api/post`;
    const type = 'PUT';
    const params = serializeFormJson('postWriteFrm');
    callApi(url, type, params, saveSuccess, saveError);
};

/**
 *  saveSuccess : save successCallback
 */
const saveSuccess = result => {
    if (result.header.result_code === 'ok') {
        alert(result.header.message);
        spinnerHide();
        location.href = returnPage();
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
    alert(response.message);
};

const setBoardBox = () => {
    let boardId = '';

    if (postType !== 'manage') {
        boardId = boardKey;
    }

    const option = {
        oTxt: 'board_title',
        oVal: 'board_id',
    };

    const params = {};

    setCommSelBox(
        'boardId',
        '/api/item/board/post/Y',
        'POST',
        'SEL',
        boardId,
        params,
        option
    );

    if (postType !== 'manage') {
        $('#boardId').prop('disabled', true);
    }
};

const returnPage = () => {
    let url = '/page/board/post/list/back';
    if (postType !== 'manage') {
        url = `/page/board/post/list/back/` + boardKey;
    }
    return url;
};

$(document).ready(() => {
    setBoardBox();

    editor = setBasicEditor('editor', content, 500);

    $('#backBtn').click(() => {
        location.href = returnPage();
    });

    $('#saveBtn').click(() => {
        save();
    });
});
