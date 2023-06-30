import {getApi} from './api';
import {mainViewTokenInvalidate, setAccessToken} from './router';

/*
 * callApiWithoutToken
 * : 토큰 없이 API를 호출
 */
export function callApiWithoutToken(
    url,
    type,
    params,
    successCallback,
    errorCallback
) {
    const apiDomain = getApi();

    $.ajax({
        url: `${apiDomain}${url}`,
        type: type,
        data: JSON.stringify(params),
        headers: {'Content-Type': 'application/json'},
        success(result) {
            successCallback(result);
        },
        error(response) {
            errorResponse(
                response,
                url,
                type,
                params,
                successCallback,
                errorCallback,
                'callApiWithoutToken'
            );
        },
    });
}

/*
 * callApi
 * : API를 호출(Body가 있는 경우)
 */
export function callApi(url, type, params, successCallback, errorCallback) {
    const apiDomain = getApi();
    const accessToken = localStorage.getItem('accessToken');

    $.ajax({
        url: `${apiDomain}${url}`,
        type: type,
        data: JSON.stringify(params),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', accessToken);
        },
        success(result) {
            successCallback(result);
        },
        error(response) {
            errorResponse(
                response,
                url,
                type,
                params,
                successCallback,
                errorCallback,
                'callApi'
            );
        },
    });
}

/*
 * callApiWithoutBody
 * : API를 호출(Body가 없는 경우)
 */
export function callApiWithoutBody(url, type, successCallback, errorCallback) {
    const apiDomain = getApi();
    const accessToken = localStorage.getItem('accessToken');

    $.ajax({
        url: `${apiDomain}${url}`,
        type: type,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', accessToken);
        },
        success(result) {
            successCallback(result);
        },
        error(response) {
            errorResponse(
                response,
                url,
                type,
                '',
                successCallback,
                errorCallback,
                'callApiWithoutBody'
            );
        },
    });
}

const errorResponse = (
    response,
    url,
    type,
    params,
    successCallback,
    errorCallback,
    apiName
) => {
    const httpStatus = response.status;
    const resJson = response.responseJSON.header;
    resJson.httpStatus = httpStatus;

    //서버에러
    if (httpStatus === 500) {
        console.log(resJson);
    }
    //토큰 만료시
    else if (httpStatus === 403 && resJson.result_code === 'tokenInvalid') {
        mainViewTokenInvalidate();
    }
    //리프레시토큰은 유효하고 토큰은 만료된 경우
    else if (httpStatus === 401 && resJson.result_code === 'newToken') {
        setAccessToken(resJson);
        if (apiName === 'callApiWithoutBody') {
            callApiWithoutBody(url, type, successCallback, errorCallback);
        } else if (apiName === 'callApi') {
            callApi(url, type, params, successCallback, errorCallback);
        }
    }
    //유효값이 맞지 않는 경우
    else if (httpStatus === 400 && resJson.result_code === 'invalid') {
        const errorList = resJson.error_list;
        if (errorList !== undefined && errorList.length !== 0) {
            errorList[0].httpStatus = httpStatus;
            errorCallback(errorList[0]);
        }
    }
    //그밖에
    else {
        errorCallback(resJson);
    }
};
