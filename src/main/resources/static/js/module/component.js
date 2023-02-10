import { mainViewTokenInvalidate, setAccessToken } from "./router";

/**
 * setCommonSelectBox : 공통코드를 사용한 셀렉트 박스 생성
 * 생성할 아이디, 코드, 타입(전체, 선택, ''), 선택된 값('')
 */
export function setCodeSelBox(id, codeGrp, type, selectedValue) {
    let str = '';

    if (type === 'ALL') str += `<option value="">-- 전체 --</option>`;
    else if (type === 'SEL') str += `<option value="">-- 선택 --</option>`;

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: `/api/mng/code/item/${codeGrp}`,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
    }).then(
        (result) => {
            const dataList = result.data;

            for (let i = 0; i < dataList.length; i++) {
                if (
                    selectedValue !== '' &&
                    selectedValue === dataList[i].cd_val
                ) {
                    str += `<option value="${dataList[i].cd_val}" selected> ${dataList[i].cd_nm}</option>`;
                } else {
                    str += `<option value="${dataList[i].cd_val}"> ${dataList[i].cd_nm}</option>`;
                }
            }

            $(`#${id}`).html(str);
        },
        (request, status, error) => {
            if (request.status === 500) {
                console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);
            } else if (request.status === 400) {
                const { errorList } = request.responseJSON;
                if (errorList !== undefined) {
                    if (errorList.lengh !== 0) {
                        const { message } = errorList[0];
                        $('#msg').html(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#msg').html(data.message);
                }
            } else if(request.status === 401){
                setAccessToken(request.responseJSON);
                setCodeSelBox(id, codeGrp, type, selectedValue);
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }
        }
    );
}

/**
 * setCommonSelectBox : 공통코드를 사용한 셀렉트 박스 생성
 * 생성할 아이디, 코드, 타입(전체, 선택, ''), 선택된 값('')
 */
export function setCodeSelBoxCall(id, codeGrp, type, selectedValue, callBack) {

    let str = '';

    if (type === 'ALL') str += `<option value="">-- 전체 --</option>`;
    else if (type === 'SEL') str += `<option value="">-- 선택 --</option>`;

    const accessToken = window.localStorage.getItem("accessToken");

    $.ajax({
        url: `/api/mng/code/item/${codeGrp}`,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Content-type","application/json");
            xhr.setRequestHeader("Authorization",accessToken);
        },
    }).then(
        (result) => {
            const dataList = result.data;

            for (let i = 0; i < dataList.length; i++) {
                if (
                    selectedValue !== '' &&
                    selectedValue === dataList[i].cd_val
                ) {
                    str += `<option value="${dataList[i].cd_val}" selected> ${dataList[i].cd_nm}</option>`;
                } else {
                    str += `<option value="${dataList[i].cd_val}"> ${dataList[i].cd_nm}</option>`;
                }
            }

            $(`#${id}`).html(str);

            callBack();
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
                        $('#msg').html(message);
                    }
                } else {
                    const data = request.responseJSON.header;
                    $('#msg').html(data.message);
                }
            } else if(request.status === 401){
                setAccessToken(request.responseJSON);
                setCodeSelBoxCall(id, codeGrp, type, selectedValue, callBack);
            } else if(request.status === 403){
                mainViewTokenInvalidate();
            }
        }
    );
}

/**
 * setCommSelBox : 공통코드를 사용하지 않는 경우 셀렉트 박스 생성
 * 생성할 아이디, url, url_type(url 전송 타입) ,타입(전체, 선택, ''), 선택된 값(''), 파라미터(''), option(옵션안에 넣을 텍스트와 value의 값을 추출)
 */
export function setCommSelBox(id, url, url_type, type, selected_value, params, option) {
    let str = '';

    if (type === 'ALL') str += `<option value="">-- 전체 --</option>`;
    else if (type === 'SEL') str += `<option value="">-- 선택 --</option>`;

    if (params === '') {
        params = {};
    }
    const accessToken = window.localStorage.getItem("accessToken");

    if (url === '') {
        str += '</select>';
        $(`#${id}`).html(str);
    } else {
        $.ajax({
            url,
            type: url_type,
            data: JSON.stringify(params),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-type","application/json");
                xhr.setRequestHeader("Authorization",accessToken);
            },
            success(result) {
                const list = result.data;

                if (list.length === 0 && type !== 'ALL') {
                    str += `<option value="">-- 없음 --</option>`;
                }

                for (let i = 0; i < list.length; i++) {
                    if (option !== '') {
                        const { oTxt } = option;
                        const { oVal } = option;

                        if (selected_value !== '') {
                            if (
                                list[i][oVal].toString() ===
                                selected_value.toString()
                            ) {
                                str += `<option value="${list[i][oVal]}" selected> ${list[i][oTxt]}</option>`;
                            } else {
                                str += `<option value="${list[i][oVal]}"> ${list[i][oTxt]}</option>`;
                            }
                        } else {
                            str += `<option value="${list[i][oVal]}"> ${list[i][oTxt]}</option>`;
                        }
                    }
                }

                $(`#${id}`).html(str);
            },
            error(request, status, error) {
                console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);

                if(request.status === 401){
                    setAccessToken(request.responseJSON);
                    setCommSelBox(id, url, url_type, type, selected_value, params, option);
                }
                else if(request.status === 403){
                    mainViewTokenInvalidate();
                }
            },
        });
    }
}


/**
 * setCommSelBox : 공통코드를 사용하지 않는 경우 셀렉트 박스 생성
 * 생성할 아이디, url, url_type(url 전송 타입) ,타입(전체, 선택, ''), 선택된 값(''), 파라미터(''), option(옵션안에 넣을 텍스트와 value의 값을 추출)
 */
export function setCommSelBoxCall(id, url, url_type, type, selected_value, params, option, callback) {
    let str = '';

    if (type === 'ALL') str += `<option value="">-- 전체 --</option>`;
    else if (type === 'SEL') str += `<option value="">-- 선택 --</option>`;

    if (params === '') {
        params = {};
    }
    const accessToken = window.localStorage.getItem("accessToken");

    if (url === '') {
        str += '</select>';
        $(`#${id}`).html(str);
    } else {
        $.ajax({
            url,
            type: url_type,
            data: JSON.stringify(params),
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Content-type","application/json");
                xhr.setRequestHeader("Authorization",accessToken);
            },
            success(result) {
                const list = result.data;

                if (list.length === 0 && type !== 'ALL') {
                    str += `<option value="">-- 없음 --</option>`;
                }

                for (let i = 0; i < list.length; i++) {
                    if (option !== '') {
                        const { oTxt } = option;
                        const { oVal } = option;

                        if (selected_value !== '') {
                            if (
                                list[i][oVal].toString() ===
                                selected_value.toString()
                            ) {
                                str += `<option value="${list[i][oVal]}" selected> ${list[i][oTxt]}</option>`;
                            } else {
                                str += `<option value="${list[i][oVal]}"> ${list[i][oTxt]}</option>`;
                            }
                        } else {
                            str += `<option value="${list[i][oVal]}"> ${list[i][oTxt]}</option>`;
                        }
                    }
                }

                $(`#${id}`).html(str);
                callback();
            },
            error(request, status, error) {
                console.log(`code:${request.status}\n` + `message:${request.responseText}\n` + `error:${error}`);

                if(request.status === 401){
                    setAccessToken(request.responseJSON);
                    setCommSelBoxCall(id, url, url_type, type, selected_value, params, option, callback)
                }
                else if(request.status === 403){
                    mainViewTokenInvalidate();
                }
            },
        });
    }
}
