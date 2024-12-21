// 判断是否是 Telegram Mini App 环境
const isTelegramMiniApp = (): boolean => {
  return window.Telegram && window.Telegram.WebApp ? true : false;
};

// 判断是否是 App 内嵌页面
const isInAppBrowser = (userAgent: string): boolean => {
  return (
    /android|iphone|ipad|ipod/.test(userAgent.toLowerCase()) && !window.Telegram
  );
};

// 判断是否是移动端 H5 页面
const isMobileH5 = (userAgent: string): boolean => {
  return /android|iphone|ipad|ipod/.test(userAgent.toLowerCase());
};

// 获取当前运行环境
const isPC = (): boolean => {
  const userAgent = navigator.userAgent || navigator.vendor;

  if (isTelegramMiniApp()) {
    return false;
  }

  if (isInAppBrowser(userAgent)) {
    return false;
  }

  if (isMobileH5(userAgent)) {
    return false;
  }

  return true;
};

export { isTelegramMiniApp, isInAppBrowser, isMobileH5, isPC };
