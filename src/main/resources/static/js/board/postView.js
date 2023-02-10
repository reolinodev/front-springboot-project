import { setBasicViewer } from '../module/editor';
import { setCodeSelBox } from '../module/component';

let content = '';
const userIdntfKey = window.sessionStorage.getItem("userIdntfKey");

$(document).ready(() => {

    const boardKey = $("#boardKey").val();

    content = $('#postText').val();

    setBasicViewer('viewer', content);

    setCodeSelBox('useYn', 'USE_YN', '', $('#use').val());

    $('#backBtn').click(() => {
        let url = `/page/board/post/back`;
        if(boardKey !== ''){
            url = `/page/board/post/back/`+boardKey
        }

        location.href = url;
    });

    $('#editBtn').click(() => {
        let url = `/page/board/post/edit/${$('#postId').val()}`;
        if(boardKey !== ''){
            url = `/page/board/post/edit/${$('#postId').val()}/`+boardKey
        }

        location.href = url;
    });

    if(userIdntfKey === $("#sysRegId").val()){
        $("#editBtnArea").show();
    }else {
        $("#editBtnArea").hide();
    }
});
