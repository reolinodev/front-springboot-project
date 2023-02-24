import {setBasicEditor} from '../module/editor';
import {setCodeSelBox, setCommSelBox} from '../module/component';
import {serializeFormJson} from '../module/json';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi} from '../module/async';

let editor;
let content = '';

const $qnaTitle = $('#qnaTitle');
const boardKey = $('#boardKey').val();
const returnPage = `/page/board/qna/list/init/${boardKey}`;

/**
 *  save : 게시글 등록
 */
const save = () => {
    let msg = '';

    if ($qnaTitle.val() === '') {
        msg = '제목을 입력하세요.';
        alert(msg);
        $qnaTitle.focus();
        return;
    }

    content = editor.getMarkdown();

    if (content === '') {
        msg = '문의내용을 입력하세요.';
        alert(msg);
        return;
    }

    $('#questions').val(content);

    spinnerShow();

    let url = `/api/qna`;
    const type = 'PUT';
    const params = serializeFormJson('qnaWriteFrm');
    callApi(url, type, params, saveSuccess, saveError);
};

/**
 *  saveSuccess : save successCallback
 */
const saveSuccess = result => {
    if (result.header.result_code === 'ok') {
        alert(result.header.message);
        spinnerHide();
        location.href = `/page/board/qna/list/init/` + boardKey;
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
    const option = {
        oTxt: 'board_title',
        oVal: 'board_id',
    };

    const params = {};

    setCommSelBox(
        'boardId',
        '/api/item/board/qna/Y',
        'POST',
        'SEL',
        boardKey,
        params,
        option
    );
};

$(document).ready(() => {
    setBoardBox();

    editor = setBasicEditor('editor', content, 400);

    setCodeSelBox('hiddenYn', 'HIDDEN_YN', '', 'N');

    $('#backBtn').click(() => {
        location.href = returnPage;
    });

    $('#saveBtn').click(() => {
        save();
    });
});
