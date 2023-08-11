const requestConfig = {
	baseUrl: '',
	timeout: 5 * 1000,
	headers: {
		'Accept-Language': 'zh-CN',
	},
};

export default function request({
	method,
	url,
	data = {},
	config = {}
}) {
	const {
		baseUrl = '',
			timeout = 0,
			headers = {},
	} = {
		...requestConfig,
		...config
	};

	uni.addInterceptor('request', (options) => {
		return options;
	});

	return new Promise((resolve, reject) => {
		uni.request({
			method,
			url: `${baseUrl}${url}`,
			data,
			header: {
				...headers,
				'content-type': 'application/json',
				'lx-cors-request': 'true',
				'lx-ticket': localStorage.getItem("ticket") || ''
			},
			timeout,
			success: (res) => {
				if (res.statusCode === 200) {
					resolve(res.data);
				} else {
					reject(new Error(res.statusCode));
				}
			},
			fail: (err) => {
				let errorMessage = '';

				if (err.errMsg.includes('timeout')) {
					errorMessage = '请求超时，请稍后重试！';
				} else if (err.errMsg.includes('abort')) {
					errorMessage = '请求数据错误，请重试！';
				} else {
					errorMessage = '网络请求错误，请检查网络连接！';
				}

				reject(new Error(errorMessage));
			},
		});
	});
}