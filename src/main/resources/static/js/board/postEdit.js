import {setBasicEditor} from '../module/editor';
import {setCodeSelBox, setCommSelBox} from '../module/component';
import {serializeFormJson} from '../module/json';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApi, callApiWithoutBody} from '../module/async';

let editor;
const $postId = $('#postId'); //게시글식별키
const $postTitle = $('#postTitle'); //게시글제목
const postType = $('#postType').val();

/**
 * search : 게시판 수정 화면 호출
 */
const search = () => {
    spinnerShow();
    callApiWithoutBody(
        `/api/post/${$postId.val()}`,
        'GET',
        searchSuccess,
        searchError
    );
};

/**
 *  searchSuccess : search successCallback
 */
const searchSuccess = result => {
    if (result.header.result_code === 'ok') {
        setPostData(result.data);
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
 *  setPostData : 게시판 화면세팅
 */
const setPostData = data => {
    setBoardBoxCall(data.board_id);
    $postTitle.val(data.post_title);

    editor = setBasicEditor('editor', data.main_text, 500);

    setCodeSelBox('useYn', 'USE_YN', '', data.use_yn);

    $('#boardId').prop('disabled', true);
};

/**
 *  save : 게시글 수정
 */
const save = () => {
    let msg = '';

    if ($postTitle.val() === '') {
        msg = '제목을 입력하세요.';
        alert(msg);
        $postTitle.focus();
        return;
    }

    $('#mainText').val(editor.getMarkdown());

    spinnerShow();

    let url = `/api/post/${$postId.val()}`;
    const type = 'PUT';
    const params = serializeFormJson('postEditFrm');
    callApi(url, type, params, saveSuccess, saveError);
};

/**
 *  saveSuccess : save successCallback
 */
const saveSuccess = result => {
    if (result.header.result_code === 'ok') {
        alert(result.header.message);
        pageMove();
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

const pageMove = () => {
    let url = `/page/board/post/list/back`;
    if (postType !== 'manage') {
        url = `/page/board/post/list/back/${$('#boardId').val()}`;
    }

    location.href = url;
};

const setBoardBoxCall = boardId => {
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
};

$(document).ready(() => {
    search();

    $('#backBtn').click(() => {
        pageMove();
    });

    $('#saveBtn').click(() => {
        save();
    });
});
