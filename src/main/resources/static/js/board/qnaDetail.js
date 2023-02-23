import {setBasicEditor, setBasicViewer} from '../module/editor';
import {setCodeSelBox, setCommSelBox} from '../module/component';
import {serializeFormJson} from '../module/json';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi, callDelApi, callGetApi} from '../module/async';

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

/**
 *  setQnaData : qna 데이터 매핑
 */
const setQnaData = data => {
    let content = '';
    let content2 = '';

    setBoardBox(data.board_id);

    $qnaTitle.val(data.qna_title);
    $createdNm.val(data.created_nm);
    $createdAt.val(data.created_at);
    $responseYnNm.val(data.response_yn_nm);
    $responseNm.val(data.response_nm);
    $responseAt.val(data.response_at);
    $questions.val(data.questions);
    $mainText.val(data.main_text);

    if (data.questions != null) {
        content = data.questions;
    }
    setBasicViewer('viewer', content);

    if (data.main_text == null) {
        content2 = '답변대기중';
    } else {
        content2 = data.main_text;
    }

    setBasicViewer('viewer2', content2);
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

$(document).ready(() => {
    search();

    $('#backBtn').click(() => {
        location.href = `/page/board/qna/list/back/${$('#boardId').val()}`;
    });
});
