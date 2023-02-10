import { setBasicEditor } from '../module/editor';
import { setCommSelBox } from '../module/component';
import { serializeFormJson } from '../module/json';
import { mainViewTokenInvalidate, setAccessToken } from "../module/router";
import { spinnerHide, spinnerShow } from "../module/spinner";

let editor;
let content = '';

/**
 *  saveProc : 게시글 등록
 */
const saveProc = () => {
    let msg = '';

    if ($('#boardId').val() === '') {
        msg = '게시판을 선택하세요';
        alert(msg);
        $('#boardId').focus();
        return;
    }
    if ($('#postTitle').val() === '') {
        msg = '제목을 입력하세요..';
        alert(msg);
        $('#title').focus();
        return;
    }

    content = editor.getMarkdown();

    $('#postText').val(content);

    spinnerShow();

    const params = serializeFormJson('postWriteFrm');

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: '/api/post/',
        type: 'PUT',
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
    }).then(
        (data) => {
            if (data.header.resultCode === 'ok') {
                alert(data.header.message);

                const boardKey = $("#boardKey").val();
                let url = '/page/board/post/init';
                if(boardKey !== ''){
                    url = `/page/board/post/init/`+boardKey;
                }

                spinnerHide();

                location.href = url;
            } else {
                alert(data.header.message);
            }

            spinnerHide();
        },
        (request, status, error) => {
            if (request.status === 500) {
                console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);
            } else if (request.status === 400) {
                const { errorList } = request.responseJSON;
                if (errorList !== undefined) {
                    if (errorList.lengh !== 0) {
                        const { message } = errorList[0];
                        alert(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    alert(data.message);
                }
            } else if(request.status === 401){
                setAccessToken(request.responseJSON);
                saveProc();
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }

            spinnerHide();
        }
    );
};

$(document).ready(() => {
    const boardKey = $("#boardKey").val();

    if(boardKey !== '') {
        $("#boardKeyDiv").hide();
    }

    const option = {
        oTxt: 'board_title',
        oVal: 'board_idntf_key',
    };

    const params = {};

    setCommSelBox(
        'boardId',
        '/api/board/select',
        'POST',
        'SEL',
        boardKey,
        params,
        option
    );

    editor = setBasicEditor('editor', content, 500);

    $('#backBtn').click(() => {
        let url = '/page/board/post/back';
        if(boardKey !== ''){
            url = `/page/board/post/back/`+boardKey
        }

        location.href = url;
    });

    $('#saveBtn').click(() => {
        saveProc();
    });
});
