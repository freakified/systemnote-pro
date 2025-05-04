export type PlatformType = 'ios' | 'android' | 'desktop';

export const isAppInstalled = (): boolean => {
	return window.matchMedia('(display-mode: standalone)').matches;
};

export const getPlatformType = (): PlatformType => {
	const ua = navigator.userAgent.toLowerCase();
	if (/iphone|ipad|ipod/.test(ua)) return 'ios';
	if (/android/.test(ua)) return 'android';
	return 'desktop';
};

export const isInstallablePlatform = (): boolean => {
	return getPlatformType() == 'ios' || getPlatformType() == 'android';
};
