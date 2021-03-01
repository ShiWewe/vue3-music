import request from '@/utils/request'

// 发送验证码
export const sendCodePhone = (params) => {
	return request.get('/captcha/sent', {
		params
	})
}

// 手机验证码登陆
export const loginPhoneCode = (params) => {
	return request.get('/captcha/verify', {
		params
	})
}
