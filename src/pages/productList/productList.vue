<template>
	<view class="productList">
		<!-- 一级 -->
		<scroll-view class="tab" :scroll-x="true" :scroll-into-view="`tab_item${activeId1}`">
			<view class="tab_item" :class="{ active: activeId1 == 'All' }" :id="`tab_itemAll`" @click="choosen('All')">
				<view class="tab_item_content">
					<view class="text">全部</view>
					<view class="border" :class="{ show: activeId1 == 'All' }"></view>
				</view>
			</view>
			<view
				class="tab_item"
				:class="{ active: activeId1 == it?.id }"
				:id="`tab_item${it?.id}`"
				v-for="(it, index) of proData?.data?.children"
				:key="it?.id"
				@click="choosen(it?.id, index)"
			>
				<view class="tab_item_content">
					<view class="text">
						{{ it?.name }}
					</view>
					<view class="border" :class="{ show: activeId1 == it?.id }"></view>
				</view>
			</view>
		</scroll-view>
		<!-- 二级 -->
		<scroll-view class="subclass" :scroll-x="true" :scroll-into-view="`subclass_item${activeId2}`">
			<view class="subclass_item" :class="{ active: activeId2 == activeId1 + 'All' }" :id="`subclass_item${activeId1 + 'All'}`" @click="choosen2(activeId1 + 'All')">
				<view class="subclass_item_content">
					<view class="text">不限</view>
				</view>
			</view>
			<view
				class="subclass_item"
				:class="{ active: activeId2 == it?.id }"
				:id="`subclass_item${it?.id}`"
				v-for="(it, index) of proData?.data?.children[largeCategoryIndex]?.children"
				:key="it?.id"
				@click="choosen2(it?.id, index)"
			>
				<view class="subclass_item_content">
					<view class="text">
						{{ it?.name }}
					</view>
				</view>
			</view>
		</scroll-view>
		<!-- 列表区域 -->
		<view class="main">
			<swiper class="swiper-box" easing-function="easeInOutCubic" :current="currentIndex" :acceleration="false" @change="changeSwiper">
				<swiper-item :item-id="activeId1 + 'All'" @touchstart="touchstartAll" @touchend="touchendAll">
					<scroll-view scroll-y class="list">
						<List :data="proData.secondaryData" :status="status" @clickLoadMore="clickLoadMore"></List>
					</scroll-view>
				</swiper-item>
				<swiper-item
					v-for="(it, index) of proData?.data?.children[largeCategoryIndex]?.children"
					:key="it?.id"
					:item-id="it?.id"
					@touchstart="touchstart"
					@touchend="touchend"
				>
					<scroll-view scroll-y class="list">
						<List :data="proData.secondaryData" :status="status" @clickLoadMore="clickLoadMore"></List>
						<!-- {{ it?.name }} -->
					</scroll-view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script setup lang="ts">
import { queryProductsByCategory } from '@/api/index';
import { onLoad, onPullDownRefresh } from '@dcloudio/uni-app';
import { onMounted, ref, reactive } from 'vue';

// const List = defineAsyncComponent(() => import('./components/List.vue'));
import List from './components/List.vue';

interface Params {
	pageNum: number;
	pageSize: number;
	categoryId: string;
}
interface Page {
	pageNum: number;
	pageSize: number;
}
const page: Page = reactive({
	pageNum: 1,
	pageSize: 10
});
//当前分类或小类
const categoryId = ref<string>('All');
//初始进入的index
//当前分类（大类）
const largeCategoryIndex = ref<number>(-1);
//小类
const subclassIndex = ref<number>(-1);
//数据对象
const proData = reactive<any>({
	data: [],
	secondaryData: []
});
const activeId1 = ref<string>('All');
const activeId2 = ref<string>('All');
//获取路由参数
onLoad((params: any) => {
	uni.setNavigationBarTitle({
		title: JSON.parse(params?.data)?.name || ''
	});
	//初始大类id
	categoryId.value = params?.id;
	//初始大类选中
	activeId1.value = params?.id;
	activeId2.value = activeId1.value + 'All';
	//初始大类index
	largeCategoryIndex.value = params?.index;
	proData.data = JSON.parse(params?.data);
});
onMounted(() => {
	getData({
		pageNum: page.pageNum,
		pageSize: page.pageSize,
		categoryId: categoryId.value
	});
});
//下拉刷新
onPullDownRefresh(() => {
	page.pageNum = 1;
	page.pageSize = 10;
	getData({
		pageNum: page.pageNum,
		pageSize: page.pageSize,
		categoryId: categoryId.value
	});
});

const status = ref<string>('more');
//加载更多
const clickLoadMore = async () => {
	status.value = 'loading';
	page.pageNum++;
	const res = await queryProductsByCategory(page?.pageNum, page?.pageSize, categoryId.value);
	if (res?.data?.items?.length <= 0) {
		status.value = 'no-more';
	} else {
		status.value = 'more';
	}
	proData.secondaryData = {
		...proData.secondaryData,
		items: [...proData.secondaryData?.items, ...res?.data?.items]
	};
};

//切换tab
const choosen = (id: string, i: number = -1): void => {
	activeId1.value = id;
	categoryId.value = id == 'All' ? proData.data?.id : id;
	largeCategoryIndex.value = i;
	activeId2.value = activeId1.value + 'All';
	subclassIndex.value = -1;
	currentIndex.value = 0;
	getData({
		pageNum: page.pageNum,
		pageSize: page.pageSize,
		categoryId: categoryId.value
	});
};
//查询数据
const getData = async (params: Params) => {
	const res = await queryProductsByCategory(params?.pageNum, params?.pageSize, params?.categoryId);
	proData.secondaryData = res?.data;
	uni.stopPullDownRefresh();
};
//二级切换tab
const choosen2 = (id: string, i: number = -1): void => {
	activeId2.value = id;
	categoryId.value = id == 'All' ? proData.data?.children[largeCategoryIndex.value]?.id : id;
	subclassIndex.value = i;
	currentIndex.value = i + 1;
	getData({
		pageNum: page.pageNum,
		pageSize: page.pageSize,
		categoryId: categoryId.value
	});
};

const currentIndex = ref<number>(0);
const startPosition = ref<number>(0);
const endPosition = ref<number>(0);

//Swiper切换
const changeSwiper = (e: any) => {
	page.pageNum = 1;
	page.pageSize = 10;
	currentIndex.value = e?.detail?.current;
	if (currentIndex.value == 0) {
		activeId2.value = activeId1.value + 'All';
	} else {
		activeId2.value = e?.detail?.currentItemId;
	}
	categoryId.value = activeId2.value == activeId1.value + 'All' ? activeId1.value : activeId2.value;
	getData({
		pageNum: page.pageNum,
		pageSize: page.pageSize,
		categoryId: categoryId.value
	});
	// console.log(e);
};

//不限
const touchstartAll = (e: any): void => {
	startPosition.value = e?.changedTouches[0]?.clientX;
};
const touchendAll = (e: any): void => {
	endPosition.value = e?.changedTouches[0]?.clientX;
	// console.log(endPosition.value - startPosition.value);
	//向右滑动-切换一级类目
	if (endPosition.value - startPosition.value > 0) {
		if (largeCategoryIndex.value > 0) {
			//大类index--
			largeCategoryIndex.value--;
			activeId1.value = proData?.data?.children[largeCategoryIndex.value]?.id;
			let data = proData?.data?.children[largeCategoryIndex.value]?.children;
			//小类设为最后一个
			activeId2.value = data[data.length - 1]?.id;
			subclassIndex.value = data.length - 1;
			//当前index  = length
			currentIndex.value = data.length;

			//右滑不会触发changeSwiper
			categoryId.value = activeId2.value;
			getData({
				pageNum: page.pageNum,
				pageSize: page.pageSize,
				categoryId: categoryId.value
			});
		}
	}
};
//其他
const touchstart = (e: any): void => {
	startPosition.value = e?.changedTouches[0]?.clientX;
};
const touchend = (e: any): void => {
	endPosition.value = e?.changedTouches[0]?.clientX;
	// console.log(endPosition.value - startPosition.value);
	//向左滑动-切换一级类目
	if (currentIndex.value >= proData?.data?.children[largeCategoryIndex.value]?.children?.length) {
		if (endPosition.value - startPosition.value < 0) {
			if (largeCategoryIndex.value < proData?.data?.children.length - 1) {
				//大类index++
				largeCategoryIndex.value++;
				activeId1.value = proData?.data?.children[largeCategoryIndex.value]?.id;
				//小类设为不限
				subclassIndex.value = -1;
				activeId2.value = activeId1.value + 'All';
				currentIndex.value = 0;
			}
		}
	}
};
</script>

<style lang="scss">
.productList {
	.tab {
		width: 100vw;
		height: 40px;
		display: flex;
		flex-direction: row;
		white-space: nowrap;
		padding: 0 20px;
		background-color: #f3f3f3;
		.tab_item {
			display: inline-block;
			height: 26px;
			font-size: 12px;
			margin-right: 30px;
			line-height: 26px;
			color: #999;
			&.active {
				color: #333;
			}
			.tab_item_content {
				display: flex;
				flex-direction: column;
				align-items: center;
				.border {
					width: 20px;
					height: 2px;
					border-radius: 17px;
					background-color: #a85ee7;
					opacity: 0;
					&.show {
						opacity: 1;
					}
				}
			}
		}
	}
	.subclass {
		width: 100vw;
		height: 28px;
		display: flex;
		flex-direction: row;
		white-space: nowrap;
		padding: 0 20px;
		background-color: #f3f3f3;
		.subclass_item {
			display: inline-block;
			height: 16px;
			font-size: 12px;
			margin-right: 20px;
			line-height: 16px;
			color: 999;
			padding: 2px 6px;
			background-color: #e4e4e4;
			border-radius: 10px;
			color: #666666;
			&.active {
				font-family: OPPOSans;
				font-weight: 400;
				color: #dc7601;
			}
			.subclass_item_content {
				display: flex;
				flex-direction: column;
				align-items: center;
			}
		}
	}
	.main {
		background-color: #fff;
		height: calc(100vh - 44px - 68px);
		.swiper-box {
			height: 100%;
		}
	}
}
</style>
