/**
 *  Alert : 얼럿
 *  msg : 메세지
 */
import Swal from "sweetalert2";

export function Alert(msg) {
    Swal.fire({
        title: msg,
        showConfirmButton: true,
        timer: 1500,
    });
}

/**
 *  AlertMove : 얼럿 이동
 *  msg : 메세지, url : 이동 URL
 */
export function AlertMove(msg, url) {
    Swal.fire({
        title: msg,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK',
    }).then(() => {
        window.location.href = url;
    });
}

/**
 *  AlertMove : 얼럿 이동
 *  msg : 메세지, url : 이동 URL
 */
export function AlertCallback(msg, callBackFunc) {
    Swal.fire({
        title: msg,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK',
    }).then(() => {
        callBackFunc();
    });
}

/**
 *  Confirm : 확인 얼럿
 *  msg : 메세지, callBackFunc : 콜백
 */
export function Confirm(msg, callBackFunc) {
    Swal.fire({
        title: msg,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'OK',
        showCancelButton: true,
    }).then((result) => {
        if (result.isConfirmed) {
            callBackFunc();
        }
    });
}

/**
 *  SubmitAlert : 입력 얼럿
 *  msg : 메세지, callBackFunc : 콜백
 */
export function InputAlert(msg, type, key, callBackFunc) {
    Swal.fire({
        title: msg,
        input: type,
        showCancelButton: true,
        confirmButtonText: 'OK',
    }).then((result) => {
        if (result.isConfirmed) {
            callBackFunc(key, result.value);
        }
    });
}
