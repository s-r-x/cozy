// https://stackoverflow.com/questions/11381673/detecting-a-mobile-browser
function detectmob() { 
	if( navigator.userAgent.match(/Android/i)
		|| navigator.userAgent.match(/webOS/i)
		|| navigator.userAgent.match(/iPhone/i)
		|| navigator.userAgent.match(/iPad/i)
		|| navigator.userAgent.match(/iPod/i)
		|| navigator.userAgent.match(/BlackBerry/i)
		|| navigator.userAgent.match(/Windows Phone/i)
	){
		return true;
	}
	else {
		return false;
	}
} 

export const isMobile = detectmob();

export const isPortrait = window.innerHeight < window.innerWidth;

export const IMAGES_BASE_URL = '/images';
