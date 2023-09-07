export function isMobile() {
  var uA = navigator.userAgent.toLowerCase();
  var ipad = uA.match(/ipad/i) != null;
  var iphone = uA.match(/iphone os/i) != null;
  var midp = uA.match(/midp/i) != null;
  var uc7 = uA.match(/rv:1.2.3.4/i) != null;
  var uc = uA.match(/ucweb/i) != null;
  var android = uA.match(/android/i) != null;
  var windowsCe = uA.match(/windows ce/i) != null;
  var windowsMobile = uA.match(/windows mobile/i) != null;

  if (
    ipad ||
    iphone ||
    midp ||
    uc7 ||
    uc ||
    android ||
    windowsCe ||
    windowsMobile
  ) {
    // PC
    return true;
  } else {
    // Mobile
    return false;
  }
}
