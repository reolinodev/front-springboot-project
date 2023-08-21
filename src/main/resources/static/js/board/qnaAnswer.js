import {setBasicEditor, setBasicViewer} from '../module/editor';
import {setCodeSelBox, setCommSelBox} from '../module/component';
import {serializeFormJson} from '../module/json';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi, callApiWithoutBody} from '../module/async';

let editor;
let content = '';

const qnaId = $('#qnaId').val(); //게시글식별키
const $qnaTitle = $('#qnaTitle');
const $createdNm = $('#createdNm');
const $createdAt = $('#createdAt');
const $responseYnNm = $('#responseYnNm');
const $responseNm = $('#responseNm');
const $responseAt = $('#responseAt');
const $questions = $('#questions');
const $mainText = $('#mainText');
const $qnaPw = $('#qnaPw');


/**
 * search : 게시판 수정 화면 호출
 */
const search = () => {
    spinnerShow();
    callApiWithoutBody(`/api/qna/${qnaId}`, 'GET', searchSuccess, searchError);
};

/**
 *  searchSuccess : search successCallback
 */
const searchSuccess = result => {
    if (result.header["resultCode"] === 'ok') {
        setQnaData(result.data);
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

const setQnaData = data => {
    setBoardBox(data.boardId);

    $qnaTitle.val(data.qnaTitle);
    $createdNm.val(data.createdIdLabel);
    $createdAt.val(data.createdAtLabel);
    $responseYnNm.val(data.responseLabel);
    $responseNm.val(data.responseIdLabel);
    $responseAt.val(data.responseAtLabel);
    $questions.val(data.questions);
    $mainText.val(data.mainText);
    $qnaPw.val(data.qnaPw);

    if(data.hiddenYn === 'N'){
        $('#qnaPwBtn').hide();
    }

    setBasicViewer('viewer', data.questions);

    if (data.mainText != null) {
        content = data.mainText;
    }
    editor = setBasicEditor('editor', content, 400);

    setCodeSelBox('useYn', 'USE_YN', '', data.useYn);
    setCodeSelBox('hiddenYn', 'HIDDEN_YN', '', data.hiddenYn);

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
        '/api/item/board/QNA',
        'POST',
        '',
        boardId,
        params,
        option
    );
};

/**
 *  save : 게시글 수정
 */
const save = () => {
    $('#mainText').val(editor.getMarkdown());

    let url = `/api/qna/admin/${qnaId}`;
    const type = 'PUT';
    const params = serializeFormJson('qnaAnswerFrm');
    callApi(url, type, params, saveSuccess, saveError);
};

/**
 *  saveSuccess : save successCallback
 */
const saveSuccess = result => {
    if (result.header["resultCode"] === 'ok') {
        alert(result.header.message);
        location.href = '/page/board/qna/list/init';
    }
    spinnerHide();
};

/**
 *  saveError : save errorCallback
 */
const saveError = response => {
    spinnerHide();
    console.log(response.message);
};


/**
 *  initQnaPw : Qna 패스워드변경
 */
const initQnaPw = () => {

    callApiWithoutBody(
        `/api/qna/init-qna-pw/${qnaId}`,
        'GET',
        initQnaPwSuccess,
        initQnaPwError
    );
};

/**
 *  initQnaPwSuccess : initQnaPw successCallback
 */
const initQnaPwSuccess = result => {
    if (result.header["resultCode"] === 'ok') {
        alert(result.header.message);
    }
    spinnerHide();
};

/**
 * initQnaPwError : initQnaPw errorCallback
 */
const initQnaPwError = response => {
    spinnerHide();
    console.log(response.message);
};



$(document).ready(() => {
    $('#backBtn').click(() => {
        location.href = '/page/board/qna/list/back';
    });

    $('#saveBtn').click(() => {
        save();
    });

    $('#qnaPwBtn').click(() => {
        initQnaPw();
    });

    search();
});
