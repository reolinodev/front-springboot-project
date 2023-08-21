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
                    selectedValue === dataList[i].codeVal
                ) {
                    str += `<option value="${dataList[i].codeVal}" selected> ${dataList[i].codeNm}</option>`;
                } else {
                    str += `<option value="${dataList[i].codeVal}"> ${dataList[i].codeNm}</option>`;
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

    $.ajax({
        url: `${apiDomain}/api/item/code/${codeGrp}`,
        type: 'GET',
    }).then(
        result => {
            const dataList = result.data;

            for (let i = 0; i < dataList.length; i++) {
                if (
                    selectedValue !== '' &&
                    selectedValue === dataList[i].codeVal
                ) {
                    str += `<option value="${dataList[i].codeVal}" selected> ${dataList[i].codeNm}</option>`;
                } else {
                    str += `<option value="${dataList[i].codeVal}"> ${dataList[i].codeNm}</option>`;
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
 * 생성할 아이디, url, urlType(url 전송 타입) ,타입(전체, 선택, ''), 선택된 값(''), 파라미터(''), option(옵션안에 넣을 텍스트와 value의 값을 추출)
 */
export function setCommSelBox(
    id,
    url,
    urlType,
    type,
    selectedValue,
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
            type: urlType,
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

                        if (selectedValue !== '') {
                            if (
                                list[i][oVal].toString() ===
                                selectedValue.toString()
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
 * 생성할 아이디, url, urlType(url 전송 타입) ,타입(전체, 선택, ''), 선택된 값(''), 파라미터(''), option(옵션안에 넣을 텍스트와 value의 값을 추출), callback
 */
export function setCommSelBoxCall(
    id,
    url,
    urlType,
    type,
    selectedValue,
    params,
    option,
    callback
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
            type: urlType,
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

                        if (selectedValue !== '') {
                            if (
                                list[i][oVal].toString() ===
                                selectedValue.toString()
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
