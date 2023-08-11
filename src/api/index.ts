import request from '@/utils/request.js';
/**
 * 手机号+验证码登录
 * @param tel 手机号
 * @param smsCode 验证码
 */
export const loginOrRegForMoblie = (tel: string, smsCode: string): any => {
	let data: any = {
		tel,
		smsCode
	};
	let str = Object.keys(data)
		.map((el) => {
			return `${el}=${data[el]}`;
		})
		.join('&');
	return request({
		url: '/userbusiness-service/userlogin/loginOrRegForMoblie.json?' + str,
		method: 'POST'
	});
};

/**
 * 查询商品全部分类
 */
export const queryCategories = () => {
	return request({
		url: '/inventory-service/assetShopMall/queryCategories.json',
		method: 'GET'
	});
};

/**
 * 按商品分类id分页查询商品
 * @param categoryId 分类id
 * @param pageNum 当前页数
 * @param pageSize 每页条数
 */
export const queryProductsByCategory = (pageNum: number, pageSize: number, categoryId: string) => {
	return request({
		url: '/inventory-service/assetShopMall/getShopGoodsByCategory.json',
		method: 'GET',
		data: {
			pageSize,
			pageNum,
			categoryId
		}
	});
};
