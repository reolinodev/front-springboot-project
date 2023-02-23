import {getApi} from './api';
import {mainViewTokenInvalidate, setAccessToken} from './router';

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
            console.log('aaa', result);
            successCallback(result);
        },
        error(response) {
            console.log('ccc', response);

            const httpStatus = response.status;
            const resJson = response.responseJSON.header;
            resJson.httpStatus = httpStatus;

            console.log('dddd', resJson);

            if (httpStatus === 500) {
                console.log(resJson);
            } else if (httpStatus === 400 && resJson.result_code === 'valid') {
                const errorList = resJson.error_list;
                if (errorList !== undefined && errorList.length !== 0) {
                    errorList[0].httpStatus = httpStatus;
                    errorCallback(errorList[0]);
                } else {
                    errorCallback(resJson);
                }
            } else {
                errorCallback(resJson);
            }
        },
    });
}

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
            console.log('aaa', result);

            successCallback(result);
        },
        error(response) {
            console.log('ccc', response);

            const httpStatus = response.status;
            const resJson = response.responseJSON.header;
            resJson.httpStatus = httpStatus;

            if (httpStatus === 500) {
                console.log(resJson);
            } else if (
                httpStatus === 400 &&
                resJson.result_code === 'invalid'
            ) {
                const errorList = resJson.error_list;
                if (errorList !== undefined && errorList.length !== 0) {
                    errorList[0].httpStatus = httpStatus;
                    errorCallback(errorList[0]);
                }
            } else {
                errorCallback(resJson);
            }
        },
    });
}

export function callGetApi(url, successCallback, errorCallback) {
    const apiDomain = getApi();
    const accessToken = localStorage.getItem('accessToken');

    $.ajax({
        url: `${apiDomain}${url}`,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', accessToken);
        },
        success(result) {
            successCallback(result);
        },
        error(response) {
            const httpStatus = response.status;
            const resJson = response.responseJSON.header;
            resJson.httpStatus = httpStatus;

            if (httpStatus === 500) {
                console.log(resJson);
            } else if (
                httpStatus === 400 &&
                resJson.result_code === 'invalid'
            ) {
                const errorList = resJson.error_list;
                if (errorList !== undefined && errorList.length !== 0) {
                    errorList[0].httpStatus = httpStatus;
                    errorCallback(errorList[0]);
                }
            } else {
                errorCallback(resJson);
            }
        },
    });
}

export function callDelApi(url, successCallback, errorCallback) {
    const apiDomain = getApi();
    const accessToken = localStorage.getItem('accessToken');

    $.ajax({
        url: `${apiDomain}${url}`,
        type: 'DELETE',
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Content-type', 'application/json');
            xhr.setRequestHeader('Authorization', accessToken);
        },
        success(result) {
            successCallback(result);
        },
        error(response) {
            const httpStatus = response.status;
            const resJson = response.responseJSON.header;
            resJson.httpStatus = httpStatus;

            if (httpStatus === 500) {
                console.log(resJson);
            } else if (
                httpStatus === 400 &&
                resJson.result_code === 'invalid'
            ) {
                const errorList = resJson.error_list;
                if (errorList !== undefined && errorList.length !== 0) {
                    errorList[0].httpStatus = httpStatus;
                    errorCallback(errorList[0]);
                }
            } else {
                errorCallback(resJson);
            }
        },
    });
}

// if (request.status === 401) {
//     setAccessToken(request.responseJSON);
//     getUserData();
// } else if (request.status === 403) {
//     mainViewTokenInvalidate();
// }
