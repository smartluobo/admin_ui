<template>
  <div id="product-management">
      <div class="flex-sb right-top lrpadd-10 bg-fff">
			<div class="fcc">
				<div class="f14 weight4 pd-l-10">
					营销/优惠活动
				</div>
			</div>
			<div class="pd-r-20">
				<el-button size="small" icon="el-icon-refresh" class="blue" @click="requestList">刷新</el-button>
			</div>
		</div>
    <el-divider class="el-divider-margin"></el-divider>
    <div class="pd-30" v-loading="loading">
        <div class="fontN">
			<el-button type="primary" size="small" @click="addDisCount">新增优惠券</el-button>
				<el-table :data="listData" border style="width: 100%">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column fixed label="操作" width="140">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="delActivity(scope.row)">删除</el-button>
						<el-button type="text" size="small" @click="modifyActivity(scope.row)">编辑</el-button>
					</template>
					</el-table-column>
					<el-table-column prop="activityName" label="活动名称">
					</el-table-column>
					<el-table-column prop="nickname" label="使用条件">
						<template slot-scope="scope"></template>
					</el-table-column>
					<el-table-column prop="mobile" label="活动时间">
					</el-table-column>
					<el-table-column prop="mobile" label="剩余券数">
					</el-table-column>
					<el-table-column prop="mobile" label="已领券数">
					</el-table-column>
					<el-table-column prop="zhimacreditstate" label="活动状态">
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div class="block fcc mg-t-40">
			<el-pagination 
			@size-change="handleSizeChange" 
			:current-page="currentpage" 
			@current-change="handleCurrentChange" 
			:page-sizes="$pagingArr" 
			:page-size="pagesize" 
			layout="total, sizes, prev, pager, next, jumper" 
			:total="total_count">
			</el-pagination>
		</div>
		<AddDiscount v-if="discountFlag" :discountData="discountData" @addActivityResult="addActivityResult"></AddDiscount>
  	</div>
</template>

<script>
  import AddDiscount from "@/pages/home/children/discount/addDiscount"
  export default {
    components: {
      AddDiscount
    },
    data () {
      return {
        loading: false,
        pagesize: 10,
		listData:[],
        currentpage: 1,
		total_count: 10,
		listData:[],
		discountFlag: false,
		discountData: {}
      };
    },
    methods: {
		addDisCount(){
			this.discountFlag = true;
			this.discountData.type = "add";
			this.discountData.activityType = "discount";
		},
		modifyActivity(row){
			this.discountData.type = "modify";
			this.discountData.activityType = "discount";
			this.discountData.data = row;
			this.discountFlag = true;
		},
		delActivity(row){
			var $that = this;
			var url = this.$urlHost+"/chaomes/cms/coupons/delete?id="+row.id;
			this.$post(url).then((res) => {
				if(res.code == 200 && res.msg=="success"){
					this.requestList();
					$that.$alert("删除成功！", '提示', {
						confirmButtonText: '确定'
					});
				}else{
					$that.$alert("删除失败："+res.msg, '提示', {
						confirmButtonText: '确定'
					});
				}
			})
		},
		handleCurrentChange(val) {
			let that = this
			that.currentpage = val
			that.requestList()
		},
		handleSizeChange(val) {
			let that = this
			that.pagesize = val
			that.currentpage = 1
			that.requestList()
		},
		requestList(){
			var $that = this;
			var url = this.$urlHost+"/chaomes/cms/coupons/findPage";
			var params = {
				"pageNum": this.currentpage, // 页码
				"pageSize": this.pagesize, // 显示条数
			};
			this.$post(url,params).then((res) => {
				if(res.list){
					this.listData = res.list;
					this.total_count = res.total;
				}else{
				this.$alert(res.msg, '提示', {
					confirmButtonText: '确定'
				});
				}
			})
		},
		addActivityResult(obj){
			if(obj.status != "fail"){
				this.discountFlag = false;
			}else{
				this.discountFlag = true;
			}
			if(obj.status == "success"){
				this.requestList();
			}
		}
	},
	mounted(){
		this.requestList();
	}
  }

</script>
<style rel="stylesheet" scoped>
@import '../../../../assets/css/common.css'; /*引入公共样式*/
</style>