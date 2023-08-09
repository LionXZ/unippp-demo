import request from '@/utils/request2.js';
/**
 * 手机号+验证码登录
 * @param tel 手机号
 * @param smsCode 验证码
 */
export const loginOrRegForMoblie = (tel: string, smsCode: string): any => {
	return request({
		url: '/api/userbusiness-service/userlogin/loginOrRegForMoblie.json',
		method: 'post',
		params: {
			tel,
			smsCode
		}
	});
};

/**
 * 查询商品全部分类
 */
export const queryCategories = () => {
	return request({
		url: '/api/inventory-service/assetShopMall/queryCategories.json',
		method: 'get'
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
		url: '/api/inventory-service/assetShopMall/getShopGoodsByCategory.json',
		method: 'get',
		params: {
			pageSize,
			pageNum,
			categoryId
		}
	});
};

/**
 * 封面图
 */
export const getCoverImage = (id: string) => {
	return request({
		url: '/api/storeservice/fileStore/downloadFile.json',
		method: 'get',
		params: {
			id
		}
	});
};
