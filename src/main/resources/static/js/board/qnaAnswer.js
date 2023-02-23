import {setBasicEditor, setBasicViewer} from '../module/editor';
import {setCodeSelBox, setCommSelBox} from '../module/component';
import {serializeFormJson} from '../module/json';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi, callGetApi} from '../module/async';

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

/**
 * search : 게시판 수정 화면 호출
 */
const search = () => {
    spinnerShow();
    const url = `/api/qna/${qnaId}`;
    callGetApi(url, searchSuccess, searchError);
};

/**
 *  searchSuccess : search successCallback
 */
const searchSuccess = result => {
    if (result.header.result_code === 'ok') {
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
    setBoardBox(data.board_id);

    $qnaTitle.val(data.qna_title);
    $createdNm.val(data.created_nm);
    $createdAt.val(data.created_at);
    $responseYnNm.val(data.response_yn_nm);
    $responseNm.val(data.response_nm);
    $responseAt.val(data.response_at);
    $questions.val(data.questions);
    $mainText.val(data.main_text);

    setBasicViewer('viewer', data.questions);

    if (data.main_text != null) {
        content = data.main_text;
    }
    editor = setBasicEditor('editor', content, 400);

    setCodeSelBox('useYn', 'USE_YN', '', data.use_yn);
    setCodeSelBox('hiddenYn', 'HIDDEN_YN', '', data.hidden_yn);

    $('#boardId').prop('disabled', true);
};

const setBoardBox = boardId => {
    const option = {
        oTxt: 'board_title',
        oVal: 'board_id',
    };

    const params = {};

    setCommSelBox(
        'boardId',
        '/api/item/board/QNA/Y',
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

    let url = `/api/qna/${qnaId}`;
    const type = 'PUT';
    const params = serializeFormJson('qnaAnswerFrm');
    callApi(url, type, params, saveSuccess, saveError);
};

/**
 *  searchSuccess : search successCallback
 */
const saveSuccess = result => {
    if (result.header.result_code === 'ok') {
        alert(result.header.message);
        location.href = '/page/board/qna/list/init';
    }
    spinnerHide();
};

/**
 *  searchError : search errorCallback
 */
const saveError = response => {
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

    search();
});
