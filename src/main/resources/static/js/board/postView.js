import {setBasicViewer} from '../module/editor';
import {setCodeSelBox, setCommSelBox} from '../module/component';
import {spinnerHide, spinnerShow} from '../module/spinner';
import {callGetApi} from '../module/async';

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
    const url = `/api/post/${postId}`;
    callGetApi(url, searchSuccess, searchError);
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

const setPostData = data => {
    setBoardBoxCall(data.board_id);

    $postTitle.val(data.post_title);
    $createdNm.val(data.created_nm);
    $createdAt.val(data.created_at);
    $createdId.val(data.created_id);

    setBasicViewer('viewer', data.main_text);

    setCodeSelBox('useYn', 'USE_YN', '', data.use_yn);

    $('#boardId').prop('disabled', true);

    if (userId === $createdId.val()) {
        $('#updateBtnArea').show();
    } else {
        $('#updateBtnArea').hide();
    }
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
