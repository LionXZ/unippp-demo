<template>
	<view class="List">
		<scroll-view scroll-y="true" class="scroll_view">
			<view class="content">
				<view class="item" v-for="(it, index) of props.data?.items" :key="it.id">
					<image lazy-load class="img" :src="`http://sit-store.lai-do.com/storeservice/fileStore/downloadFile.json?id=${it.storeId}`"></image>
					<view class="desc">
						<view class="text">{{ it.name }}</view>
						<view class="price">
							<view class="discountPrice">
								{{ it?.discountPrice }}
							</view>
							<view class="sellPrice">
								{{ it?.sellPrice }}
							</view>
						</view>
						<view class="tags">
							<view class="tag" v-if="it?.saleTag">
								{{ it?.saleTag }}
							</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="props.status" IconType="auto" @clickLoadMore="clickLoadMore"></uni-load-more>
		</scroll-view>
	</view>
</template>

<script setup lang="ts">
// 定义props
const props = withDefaults(
	defineProps<{
		data: any;
		status: string;
	}>(),
	{
		data: {},
		status: 'more'
	}
);
const emit = defineEmits<{
	(e: 'clickLoadMore'): void;
}>();
const clickLoadMore = (e: any): void => {
	emit('clickLoadMore');
};
</script>

<style lang="scss">
.List {
	background-color: #f3f3f3;
	.scroll_view {
		height: calc(100vh - 44px - 68px);
		.content {
			padding-left: 8px;
			padding-bottom: 20px;
			margin-top: 10px;
			// display: flex;
			// flex-wrap: wrap;
			// align-items: flex-start;
			column-count: 2;
			column-width: 175px;
			column-gap: 5px;

			.item {
				break-inside: avoid;
				width: 175px;
				display: flex;
				flex-direction: column;
				justify-content: center;
				padding: 0px, 0px, 16px, 0px;
				border-radius: 8px;
				background-color: #fff;
				margin-bottom: 10px;
				.img {
					width: 175px;
					height: 175px;
					border-radius: 8px 8px 0 0;
				}
				// &:nth-child(2n) {
				// 	margin-left: 10px;
				// }
				.desc {
					padding: 10px;
					.text {
						font-size: 13px;
						color: #333333;
					}
					.price {
						display: flex;
						align-items: center;
						line-height: 21px;
						height: 30px;
						.discountPrice {
							font-size: 16px;
							color: #1a1a1a;
							font-weight: 600;
						}
						.sellPrice {
							margin-left: 5px;
							font-size: 11px;
							line-height: 13px;
							color: #999999;
							text-decoration: line-through;
						}
					}
					.tags {
						display: flex;
						align-items: center;
						.tag {
							color: #f23030;
							font-size: 8px;
							border: 1px solid #f23030;
							padding: 2px;
							border-radius: 2px;
						}
					}
				}
			}
		}
	}
}
</style>
