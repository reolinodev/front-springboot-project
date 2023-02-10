/**
 * checkEmail : 이메일 양식 체크
 * email: 이메일
 */
export function checkEmail(email) {
    const reg = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;

    if (!reg.test(email)) return false;
    return true;
}

/**
 * checkPw : 비밀번호 체크
 * pw: 패스워드 (조건에 맞게 주석을 풀어서 사용하세요)
 */
export function checkPw(pw) {
    // 최소 8 자, 하나 이상의 문자와 하나의 숫자 정규식
    // const reg = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    // 최소 8 자, 하나 이상의 대문자, 하나의 소문자 및 하나의 숫자 정규식
    // const reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    // 최소 8 자, 하나 이상의 대문자, 하나의 소문자, 하나의 숫자 및 하나의 특수 문자 정규식
    // const reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    // 최소 8 자 및 최대 10 자, 하나 이상의 대문자, 하나의 소문자, 하나의 숫자 및 하나의 특수 문자 정규식
    // const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,10}$/;

    // 최소 8 자, 하나 이상의 문자, 하나의 숫자 및 하나의 특수 문자 정규식
    // const reg = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    //
    // if(!reg.test(pw)) return false;
    // else return true;
    return true;
}

/**
 * checkKr : 한글 체크
 * str: 한글 입력시 false 출력
 */
export function checkKr(str) {
    const reg = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;

    return !reg.test(str) ? false : true;
}

/**
 * checkDuplicateList : 리스트 내에서 중복된 값이 존재 여부 체크
 * list : 데이터, key : 검증할 오브젝트의 키
 */
export function checkDuplicateList(list, key) {
    let result = true;
    const arr = [];
    for (const obj of list){
        arr.push(obj[key]);
    }
    const set = new Set(arr);
    if(arr.length !== set.size){
        result = false;
    }

    return result;
}

/**
 * checkNullList : 리스트 내에서 널값이 있는지를 체크한다.
 * list : 데이터, key : 검증할 오브젝트의 키
 */
export function checkNullList(list, key) {
    let result = true;
    for (const obj of list){
        if(obj[key] === ''){
            result = false;
        }
    }

    return result;
}

