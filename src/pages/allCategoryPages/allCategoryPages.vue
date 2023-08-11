<template>
	<view class="allCategoryPages">
		<scroll-view class="nav" :scroll-y="true" :scroll-into-view="`nav_item${activeId}`">
			<view class="nav_item" :id="'nav_item' + it?.id" v-for="it of proData?.list" :key="it?.id" @click="choosen(it)">
				<view class="name" :class="{ active: activeId == it?.id }">
					<view class="text">
						{{ it?.name }}
					</view>
				</view>
			</view>
		</scroll-view>
		<scroll-view class="content" :scroll-y="true" :scroll-into-view="`content_item${activeId}`" @scroll="scrollRight">
			<view class="content_item" v-for="it of proData?.list" :key="it?.id" :id="'content_item' + it?.id">
				<view class="title">
					{{ it?.name }}
				</view>
				<view class="list">
					<view class="list_item" v-for="(el, index) of it?.children" :key="el?.id" @click="toList(it, el, index)">
						<image lazy-load :src="getSrc(el)" class="img"></image>
						<view class="text">
							{{ el?.name }}
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
import { queryCategories } from '@/api/index';
import { nextTick } from 'process';
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';

const proData = reactive<any>({
	list: [],
	scroNum: [] //记录商品的高度
});
const activeId = ref<string>('');
const choosen = (it: any) => {
	activeId.value = it?.id;
};
const getCategories = async () => {
	const data = await queryCategories();
	proData.list = data?.data;
	activeId.value = data?.data[0]?.id || '';
	nextTick(() => {
		loadScroNum();
	});
};
const getSrc = (el: any): string => {
	return `http://sit-store.lai-do.com/storeservice/fileStore/downloadFile.json?id=${el?.storeId}`;
};
onMounted(() => {
	getCategories();
});
const allHeightNum = ref<number>(0);
const instance: any = getCurrentInstance();

//初始化右边商品的高度、起始高度数组，便于右边滑动，左边跟着动
const loadScroNum = (): void => {
	for (let item of proData.list) {
		uni.createSelectorQuery()
			.in(instance)
			.select(`#content_item${item?.id}`)
			.fields(
				{
					id: true,
					rect: true,
					size: true
				},
				(res: any) => {
					proData.scroNum.push({
						id: res?.id?.replace('content_item', '').trim(),
						top: res?.top,
						bot: res?.top + res?.height
					});
				}
			)
			.exec();
	}
};
// 监听右侧商品栏滑动事件，如果当前滑动的长度达到某个个区间内，则该区间的菜单为高亮
const scrollRight = (e: any) => {
	let now = parseInt(e?.detail?.scrollTop) + 44;
	for (let i = 0; i < proData?.scroNum?.length; i++) {
		if (now > proData.scroNum[i]?.top && now < proData.scroNum[i]?.bot) {
			activeId.value = proData.scroNum[i]?.id;
			return;
		}
	}
};

//跳转列表
const toList = (it: any, el: any, index: number): void => {
	let params = [`data=${JSON.stringify(it)}`, `name=${el?.name}`, `id=${el?.id}`, `index=${index}`].join('&');
	uni.navigateTo({
		url: '/pages/productList/productList?' + params,
		animationType: 'pop-in',
		animationDuration: 200
	});
};
</script>

<style lang="scss">
.allCategoryPages {
	display: flex;
	justify-content: flex-start;
	background-color: #ededed;
	height: calc(100vh - 44px);
	.nav {
		width: 62px;
		display: flex;
		flex-direction: column;
		height: calc(100vh - 44px);
		.nav_item {
			height: 48px;
			cursor: pointer;
			padding: 16px, 0px, 16px, 0px;
			box-sizing: border-box;
			font-size: 12px;
			line-height: 16px;
			display: flex;
			align-items: center;
			justify-content: center;
			font-weight: 400;
			.name {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				.text {
					width: 24px;
				}
				&.active {
					color: #a85ee7;
					border-left: 1px solid #a85ee7;
				}
			}
		}
	}
	.content {
		width: 296px;
		margin-left: 8px;
		.content_item {
			background-color: #fff;
			padding: 16px 8px;
			box-sizing: border-box;
			border-radius: 16px;
			margin-bottom: 10px;
			.title {
				padding: 0px, 8px, 0px, 8px;
				height: 18px;
				line-height: 18px;
				font-size: 13px;
			}
			.list {
				margin-top: 20px;
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				.list_item {
					display: flex;
					flex-direction: column;
					justify-content: center;
					text-align: center;
					width: 88px;
					margin-right: 4px;
					margin-bottom: 16px;
					.img {
						width: 88px;
						height: 88px;
					}
					.text {
						font-size: 12px;
						margin-top: 4px;
					}
				}
			}
		}
	}
}
</style>
