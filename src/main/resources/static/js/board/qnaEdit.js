import { setBasicEditor } from '../module/editor';
import { setCodeSelBox } from '../module/component';
import { Alert, AlertMove } from '../module/alert';
import { serializeFormJson } from '../module/json';

let editor;
let editor2;
let content = '';
let content2 = '';

/**
 *  saveProc : 게시글 수정
 */
const saveProc = () => {
    let msg = '';

    if ($('#title').val() === '') {
        msg = '제목을 입력하세요.';
        Alert(msg);
        $('#title').focus();
        return;
    }

    content = editor.getMarkdown();
    content2 = editor2.getMarkdown();

    $('#questions').val(content);
    $('#mainText').val(content2);

    const params = serializeFormJson('qnaEditFrm');

    $.ajax({
        url: `/api/admin/qna/${$('#qnaId').val()}`,
        type: 'PUT',
        data: JSON.stringify(params),
        headers: { 'Content-Type': 'application/json' },
    }).then(
        (data) => {
            if (data.header.resultCode === 'ok') {
                AlertMove(data.header.message, '/admin/board/qna');
            } else {
                Alert(data.header.message);
            }
        },
        (request, status, error) => {
            if (request.status === 500) {
                console.log(
                    `code:${request.status}\n` +
                        `message:${request.responseText}\n` +
                        `error:${error}`
                );
            } else if (request.status === 400) {
                const { errorList } = request.responseJSON;
                if (errorList !== undefined) {
                    if (errorList.lengh !== 0) {
                        const { message } = errorList[0];
                        Alert(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    Alert(data.message);
                }
            }
        }
    );
};

$(document).ready(() => {
    content = $('#questions').val();
    content2 = $('#mainText').val();
    editor = setBasicEditor('editor', content, 300);
    editor2 = setBasicEditor('editor2', content2, 300);

    setCodeSelBox('useYn', 'USE_YN', '', $('#use').val());
    setCodeSelBox('hiddenYn', 'HIDDEN_YN', '', $('#hidden').val());

    if ($('#hidden').val() == 'Y') {
        $('#qnaPwRow').show();
    } else {
        $('#qnaPwRow').hide();
    }

    $('#hiddenYn').change(() => {
        if ($('#hiddenYn').val() == 'Y') {
            $('#qnaPwRow').show();
        } else {
            $('#qnaPwRow').hide();
        }
    });

    $('#backBtn').click(() => {
        location.href = '/admin/board/qna';
    });

    $('#saveBtn').click(() => {
        saveProc();
    });
});
