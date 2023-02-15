import {getApi} from './api';

/**
 * setCommonSelectBox : 공통코드를 사용한 셀렉트 박스 생성
 * 생성할 아이디, 코드, 타입(전체, 선택, ''), 선택된 값('')
 */
export function setCodeSelBox(id, codeGrp, type, selectedValue) {
    let str = '';
    const apiDomain = getApi();

    if (type === 'ALL') str += `<option value="">-- 전체 --</option>`;
    else if (type === 'SEL') str += `<option value="">-- 선택 --</option>`;

    $.ajax({
        url: `${apiDomain}/api/item/code/${codeGrp}`,
        type: 'GET',
    }).then(
        result => {
            const dataList = result.data;

            for (let i = 0; i < dataList.length; i++) {
                if (
                    selectedValue !== '' &&
                    selectedValue === dataList[i].code_val
                ) {
                    str += `<option value="${dataList[i].code_val}" selected> ${dataList[i].code_nm}</option>`;
                } else {
                    str += `<option value="${dataList[i].code_val}"> ${dataList[i].code_nm}</option>`;
                }
            }

            $(`#${id}`).html(str);
        },
        response => {
            const httpStatus = response.status;
            const resJson = response.responseJSON.header;
            resJson.httpStatus = httpStatus;
            console.log(resJson);
        }
    );
}

/**
 * setCommonSelectBox : 공통코드를 사용한 셀렉트 박스 생성
 * 생성할 아이디, 코드, 타입(전체, 선택, ''), 선택된 값('')
 */
export function setCodeSelBoxCall(id, codeGrp, type, selectedValue, callBack) {
    let str = '';
    const apiDomain = getApi();

    if (type === 'ALL') str += `<option value="">-- 전체 --</option>`;
    else if (type === 'SEL') str += `<option value="">-- 선택 --</option>`;

    const accessToken = window.localStorage.getItem('accessToken');

    $.ajax({
        url: `${apiDomain}/api/item/code/${codeGrp}`,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', accessToken);
        },
    }).then(
        result => {
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
        response => {
            const httpStatus = response.status;
            const resJson = response.responseJSON.header;
            resJson.httpStatus = httpStatus;
            console.log(resJson);
        }
    );
}

/**
 * setCommSelBox : 공통코드를 사용하지 않는 경우 셀렉트 박스 생성
 * 생성할 아이디, url, url_type(url 전송 타입) ,타입(전체, 선택, ''), 선택된 값(''), 파라미터(''), option(옵션안에 넣을 텍스트와 value의 값을 추출)
 */
export function setCommSelBox(
    id,
    url,
    url_type,
    type,
    selected_value,
    params,
    option
) {
    let str = '';
    const apiDomain = getApi();

    if (type === 'ALL') str += `<option value="">-- 전체 --</option>`;
    else if (type === 'SEL') str += `<option value="">-- 선택 --</option>`;

    if (params === '') {
        params = {};
    }

    if (url === '') {
        str += '</select>';
        $(`#${id}`).html(str);
    } else {
        $.ajax({
            url: `${apiDomain}${url}`,
            type: url_type,
            data: JSON.stringify(params),
            success(result) {
                const list = result.data;

                if (list.length === 0 && type !== 'ALL') {
                    str += `<option value="">-- 없음 --</option>`;
                }

                for (let i = 0; i < list.length; i++) {
                    if (option !== '') {
                        const {oTxt} = option;
                        const {oVal} = option;

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
            error(response) {
                const httpStatus = response.status;
                const resJson = response.responseJSON.header;
                resJson.httpStatus = httpStatus;
                console.log(resJson);
            },
        });
    }
}

/**
 * setCommSelBoxCall : 공통코드를 사용하지 않는 경우 셀렉트 박스 생성, 콜백함수가 필요한 경우
 * 생성할 아이디, url, url_type(url 전송 타입) ,타입(전체, 선택, ''), 선택된 값(''), 파라미터(''), option(옵션안에 넣을 텍스트와 value의 값을 추출), callback
 */
export function setCommSelBoxCall(
    id,
    url,
    url_type,
    type,
    selected_value,
    params,
    option,
    callback
) {
    let str = '';

    if (type === 'ALL') str += `<option value="">-- 전체 --</option>`;
    else if (type === 'SEL') str += `<option value="">-- 선택 --</option>`;

    if (params === '') {
        params = {};
    }

    if (url === '') {
        str += '</select>';
        $(`#${id}`).html(str);
    } else {
        $.ajax({
            url,
            type: url_type,
            data: JSON.stringify(params),
            success(result) {
                const list = result.data;

                if (list.length === 0 && type !== 'ALL') {
                    str += `<option value="">-- 없음 --</option>`;
                }

                for (let i = 0; i < list.length; i++) {
                    if (option !== '') {
                        const {oTxt} = option;
                        const {oVal} = option;

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
            error(response) {
                const httpStatus = response.status;
                const resJson = response.responseJSON.header;
                resJson.httpStatus = httpStatus;
                console.log(resJson);
            },
        });
    }
}
