import {setBasicViewer} from '../module/editor';
import {setCommSelBox} from '../module/component';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApiWithoutBody} from '../module/async';

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

/**
 *  setQnaData : qna 데이터 매핑
 */
const setQnaData = data => {
    let content = '';
    let content2 = '';

    setBoardBox(data.boardId);

    $qnaTitle.val(data.qnaTitle);
    $createdNm.val(data.createdIdLabel);
    $createdAt.val(data.createdAtLabel);
    $responseYnNm.val(data.responseLabel);
    $responseNm.val(data.responseIdLabel);
    $responseAt.val(data.responseAtLabel);
    $questions.val(data.questions);
    $mainText.val(data.mainText);

    if (data.questions != null) {
        content = data.questions;
    }
    setBasicViewer('viewer', content);

    if (data.mainText == null) {
        content2 = '답변대기중';
    } else {
        content2 = data.mainText;
    }

    setBasicViewer('viewer2', content2);
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

$(document).ready(() => {
    search();

    $('#backBtn').click(() => {
        location.href = `/page/board/qna/list/back/${$('#boardId').val()}`;
    });
});
