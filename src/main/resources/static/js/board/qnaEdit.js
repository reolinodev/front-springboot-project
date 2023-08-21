import {setBasicEditor, setBasicViewer} from '../module/editor';
import {setCodeSelBox, setCommSelBox} from '../module/component';
import {serializeFormJson} from '../module/json';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi, callApiWithoutBody} from '../module/async';

const qnaId = $('#qnaId').val(); //게시글식별키
const $qnaTitle = $('#qnaTitle');
const $createdNm = $('#createdNm');
const $createdAt = $('#createdAt');
const $responseYnNm = $('#responseYnNm');
const $responseNm = $('#responseNm');
const $responseAt = $('#responseAt');
const $questions = $('#questions');
const $mainText = $('#mainText');
const $useYn = $('#useYn');
const $qnaPw = $('#qnaPw');

let editor;

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
    if (result.header.resultCode === 'ok') {
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
    $useYn.val(data.useYn);
    $qnaPw.val(data.qnaPw);

    if (data.questions != null) {
        content = data.questions;
    }
    editor = setBasicEditor('editor', content, 400);

    if (data.mainText == null) {
        content2 = '답변대기중';
    } else {
        content2 = data.mainText;
    }

    setBasicViewer('viewer', content2);

    setCodeSelBox('hiddenYn', 'HIDDEN_YN', '', data.hiddenYn);

    if(data.hiddenYn==="Y"){
        $('#qnaPw').show();
    }else{
        $('#qnaPw').hide();
    }
};

/**
 *  save : 게시글 수정
 */
const save = () => {
    let msg = '';

    if ($qnaTitle.val() === '') {
        msg = '제목을 입력하세요.';
        alert(msg);
        $qnaTitle.focus();
        return;
    }

    $questions.val(editor.getMarkdown());

    let url = `/api/qna/user/${qnaId}`;
    const type = 'PUT';
    const params = serializeFormJson('qnaEditFrm');
    callApi(url, type, params, saveSuccess, saveError);
};

/**
 *  searchSuccess : search successCallback
 */
const saveSuccess = result => {
    if (result.header["resultCode"] === 'ok') {
        alert(result.header.message);
        location.href = `/page/board/qna/list/back/${$('#boardId').val()}`;
    }
    spinnerHide();
};

/**
 *  searchError : search errorCallback
 */
const saveError = response => {
    spinnerHide();

    let errorMessage = '';
    if(response["errorList"] !== undefined && response["errorList"].length !== 0){
        errorMessage = response["errorList"][0].message;
    }else{
        errorMessage = response.message;
    }

    console.log(errorMessage);
};

const deleteProc = () => {
    callApiWithoutBody(
        `/api/qna/${qnaId}`,
        'DELETE',
        deleteProcSuccess,
        deleteProcError
    );
};

/**
 *  deleteProcSuccess : deleteProc successCallback
 */
const deleteProcSuccess = result => {
    if (result.header["resultCode"] === 'ok') {
        alert(result.header.message);
        location.href = `/page/board/qna/list/back/${$('#boardId').val()}`;
    }
    spinnerHide();
};

/**
 *  deleteProcError : deleteProc errorCallback
 */
const deleteProcError = response => {
    spinnerHide();
    console.log(response.message);
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

    $('#saveBtn').click(() => {
        save();
    });

    $('#deleteBtn').click(() => {
        if (confirm('QNA를 삭제하시겠습니까?')) {
            deleteProc();
        }
    });



    $('#hiddenYn').change(() => {
        $('#qnaPw').val("");

        if($('#hiddenYn').val()==="Y"){
            $('#qnaPw').show();
        }else{
            $('#qnaPw').hide();
        }
    });
});
