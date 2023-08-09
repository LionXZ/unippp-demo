import axios from 'axios'
let downloadLoadingInstance;

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
	// axios中请求配置有baseURL选项，表示请求URL公共部分
	baseURL: "",
	// 超时
	timeout: 10 * 60 * 1000
})
export let isRelogin = {
	show: false
};

axios.defaults.withCredentials = true;

let errorCode = {
	'401': '认证失败，无法访问系统资源',
	'403': '当前操作没有权限',
	'404': '访问资源不存在',
	'default': '系统未知错误，请反馈给管理员'
}

// ================================================================================================ 
/**
 * @description 函数返回唯一的请求key **/
function getRequestKey(config) {
	let {
		method,
		url,
		params,
		data
	} = config;
	// axios中取消请求及阻止重复请求的方法
	// 参数相同时阻止重复请求：
	// return [method, url, JSON.stringify(params), JSON.stringify(data)].join("&");
	// 请求方法相同，参数不同时阻止重复请求
	return [method, url].join("&");
}

/**
 * @description 添加请求信息 **/
let pendingRequest = new Map();

function addPendingRequest(config) {
	let requestKey = getRequestKey(config);
	config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
		if (!pendingRequest.has(requestKey)) {
			pendingRequest.set(requestKey, cancel);
		}
	});
}

/**
 * @description 取消重复请求 **/
function removePendingRequest(config) {
	let requestKey = getRequestKey(config);
	if (pendingRequest.has(requestKey)) {
		// 如果是重复的请求，则执行对应的cancel函数
		let cancel = pendingRequest.get(requestKey);
		cancel(requestKey);
		// 将前一次重复的请求移除
		pendingRequest.delete(requestKey);
	}
}
// ================================================================================================

// request拦截器
service.interceptors.request.use(config => {
	// ================================================================================================
	// 检查是否存在重复请求，若存在则取消已发的请求
	removePendingRequest(config);
	// 把当前请求信息添加到pendingRequest对象中
	addPendingRequest(config);
	// ================================================================================================ 
	// 是否需要设置 token
	const isToken = (config.headers || {}).isToken === false
	if (config?.ContentType) {
		config.headers['Content-Type'] = config?.ContentType
	}
	return config
}, error => {
	Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
		removePendingRequest(res.config);
		// 未设置状态码则默认成功状态
		const code = res.data.code || 200;
		// 获取错误信息
		const msg = errorCode[code] || res.data.msg || errorCode['default']
		// 二进制数据则直接返回
		if (res.request.responseType === 'blob' || res.request.responseType === 'arraybuffer') {
			return res
		}
		if (code === 401) {
			if (!isRelogin.show) {
				isRelogin.show = true;

				uni.showToast({
					title: "登录状态已过期,请重新登录",
					icon: 'none',
					duration: 1000
				})
			}
			Promise.reject('无效的会话，或者会话已过期，请重新登录。')
		} else if (code === 500) {
			uni.showToast({
				title: msg,
				icon: 'none',
				duration: 1000
			})
			return Promise.reject(new Error(msg))
		} else if (code !== 200) {
			uni.showToast({
				title: msg,
				icon: 'none',
				duration: 1000
			})
			return Promise.reject('error')
		} else {
			return res.data
		}
	},
	error => {
		// 从pendingRequest对象中移除请求
		removePendingRequest(error.config || {});
		if (axios.isCancel(error)) {
			return Promise.resolve({})
		}
		let {
			message
		} = error;
		if (message) {
			if (message == "Network Error") {
				message = "后端接口连接异常";
			} else if (message.includes("timeout")) {
				message = "系统接口请求超时";
			} else if (message.includes("Request failed with status code")) {
				if (message.substr(message.length - 3) == 401) {
					let timer = setTimeout(() => {
						removeToken()
						store.dispatch('GOTOLOGIN')
						clearTimeout(timer)
					}, 3000);
					message = "您好，您的当前登录存在异常，系统将自动跳转到登录页面，请重新登录。";
				} else {
					message = "系统接口" + message.substr(message.length - 3) + "异常";
				}
			} else if (message.includes('数据正在处理，请勿频繁操作')) {
				uni.showToast({
					title: message,
					icon: 'none',
					duration: 1000
				})
				return Promise.reject(error)
			}
			uni.showToast({
				title: message,
				icon: 'none',
				duration: 1000
			})
		}
		return Promise.reject(error)
	}
)


export default service