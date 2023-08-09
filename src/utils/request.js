export const baseUrl = ''

function getHeaders() {

	let header = {
		'Content-Type': 'application/json; charset=UTF-8',
	}
	return header
}


export default {
	get(url, param) {
		return new Promise((resolve, reject) => {
			uni.request({
				method: 'GET',
				url: baseUrl + url,
				data: param,
			}).then(res => {
				switch (res.data.code) {
					case 0:
						console.log(res.data, '请求成功')
						resolve(res.data)
						break
					case 100:
						resolve(res.data)
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 4000
						})
						break
					default:
						resolve(res.data)
				}
			}).catch(
				(response) => {
					reject(response)
				}
			)
		})
	},

	post(url, param) {
		return new Promise((resolve, reject) => {
			uni.request({
				method: 'POST',
				url: baseUrl + url,
				data: param,
			}).then(res => {
				switch (res.data.code) {
					case 0:
						console.log(res.data, '请求成功')
						resolve(res.data)
						break
					case 100:
						resolve(res.data)
						uni.showToast({
							title: res.data.msg,
							icon: 'none',
							duration: 4000
						})
						break
					default:
						resolve(res.data)
				}
			}).catch(
				(response) => {
					reject(response)
				}
			)
		})
	},
}