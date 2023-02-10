/**
 * getDeviceInfo
 * : 디바이스의 정보를 가져온다.
 */
// eslint-disable-next-line import/prefer-default-export
export function getDeviceInfo() {
    const deviceInfo = {};
    let device = 'PC';
    const ua = navigator.userAgent;

    // eslint-disable-next-line no-use-before-define
    const mobileCheck = isMobile(ua);
    if(mobileCheck)  {
        // eslint-disable-next-line no-use-before-define
        device = checkMobile(ua);
    }

    // eslint-disable-next-line no-use-before-define
    const browser = checkBrowser(ua);

    deviceInfo.device = device;
    deviceInfo.browser = browser;

    return deviceInfo;
}

/**
 * isMobile
 * : 접속 환경이 모바일인지 PC인지 체크
 */
function isMobile(ua) {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
}

/**
 * checkMobile
 * : 모바일 기기의 종류를 체크
 */
function checkMobile(ua) {
    const device = ua.toLowerCase();

    if ( device.indexOf('android') > -1) {
        return "ANDROID";
    } 
    if ( device.indexOf("iphone") > -1||device.indexOf("ipad") > -1||device.indexOf("ipod") > -1 ) {
        return "IOS";
    } 
    return "OTHER";
}

/**
 * checkBrowser
 * : 모바일 기기의 종륲를 체크
 */
// eslint-disable-next-line consistent-return
function checkBrowser(ua) {
    const agt = ua.toLowerCase();
    if (agt.indexOf("chrome") !== -1) return 'Chrome';
    if (agt.indexOf("opera") !== -1) return 'Opera';
    if (agt.indexOf("staroffice") !== -1) return 'Star Office';
    if (agt.indexOf("webtv") !== -1) return 'WebTV';
    if (agt.indexOf("beonex") !== -1) return 'Beonex';
    if (agt.indexOf("chimera") !== -1) return 'Chimera';
    if (agt.indexOf("netpositive") !== -1) return 'NetPositive';
    if (agt.indexOf("phoenix") !== -1) return 'Phoenix';
    if (agt.indexOf("firefox") !== -1) return 'Firefox';
    if (agt.indexOf("safari") !== -1) return 'Safari';
    if (agt.indexOf("skipstone") !== -1) return 'SkipStone';
    if (agt.indexOf("netscape") !== -1) return 'Netscape';
    if (agt.indexOf("mozilla/5.0") !== -1) return 'Mozilla';
    if (agt.indexOf("msie") !== -1) {
        let rv = -1;
        if (navigator.appName === 'Microsoft Internet Explorer') {
            const re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null)
                rv = parseFloat(RegExp.$1);
        }
        return `Internet Explorer ${rv}`;
    }
}

