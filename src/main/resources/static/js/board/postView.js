import {setBasicViewer} from '../module/editor';
import {setCodeSelBox, setCommSelBox} from '../module/component';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callApiWithoutBody} from '../module/async';

const userId = window.sessionStorage.getItem('userId'); //사용자식별키
const postId = $('#postId').val(); //게시글식별키
const postType = $('#postType').val(); //게시글유형

const $postTitle = $('#postTitle'); //게시글제목
const $createdNm = $('#createdNm'); //작성자명
const $createdAt = $('#createdAt'); //작성시간
const $createdId = $('#createdId'); //작성자식별키

/**
 * search : 게시판 수정 화면 호출
 */
const search = () => {
    spinnerShow();
    callApiWithoutBody(
        `/api/post/${postId}`,
        'GET',
        searchSuccess,
        searchError
    );
};

/**
 *  searchSuccess : search successCallback
 */
const searchSuccess = result => {
    if (result.header["resultCode"] === 'ok') {
        setPostData(result.data, result.myPost);
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

const setPostData = (data, myPost) => {
    setBoardBoxCall(data.boardId);

    $postTitle.val(data.postTitle);
    $createdNm.val(data.createdIdLabel);
    $createdAt.val(data.createdAtLabel);
    $createdId.val(data.createdId);

    setCodeSelBox('useYn', 'USE_YN', '', data.useYn);

    setBasicViewer('viewer', data.mainText);

    $('#boardId').prop('disabled', true);

    if (myPost) {
        $('#updateBtnArea').show();
    } else {
        $('#updateBtnArea').hide();
    }
};

const setBoardBoxCall = boardId => {
    const option = {
        oTxt: 'boardTitle',
        oVal: 'boardId',
    };

    const params = {};

    setCommSelBox(
        'boardId',
        '/api/item/board/POST',
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
        let url = `/page/board/post/list/back`;
        if (postType !== 'manage') {
            url = `/page/board/post/list/back/${$('#boardId').val()}`;
        }
        location.href = url;
    });

    $('#updateBtn').click(() => {
        location.href = `/page/board/post/edit/${postType}/${postId}`;
    });
});
