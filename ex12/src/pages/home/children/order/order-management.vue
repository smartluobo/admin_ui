<template>
  <div id="product-management">
      <div class="flex-sb right-top lrpadd-10 bg-fff">
			<div class="fcc">
				<div class="f14 weight4 pd-l-10">
					订单/订单管理
				</div>
			</div>
			<div class="pd-r-20">
				<el-button size="small" icon="el-icon-refresh" class="blue" @click="requestList">刷新</el-button>
			</div>
		</div>
    <el-divider class="el-divider-margin"></el-divider>
    <div class="pd-30" v-loading="loading">
		<div class="orderFilter">
			<el-form>
				<el-row>
					<el-col :span="8">
						<el-form-item 
							label="订单编号" 
							:label-width="formLabelWidth">
							<el-input v-model="form.orderNum" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item 
							label="订单类型" 
							:label-width="formLabelWidth">
							<el-select v-model="form.orderType" filterable placeholder="请选择">
								<el-option
								v-for="item in orderTypeLists"
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item 
							label="支付" 
							:label-width="formLabelWidth">
							<el-select v-model="form.payType" filterable placeholder="请选择">
								<el-option
								v-for="item in payTypeLists"
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>					
					</el-col>
					<el-col :span="8">
						<el-form-item 
							label="售后" 
							:label-width="formLabelWidth">
							<el-select v-model="form.serviceType" filterable placeholder="请选择">
								<el-option
								v-for="item in serviceTypeLists"
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>					
					</el-col>
					<el-col :span="8">
						<el-form-item 
							label="配送方式" 
							:label-width="formLabelWidth">
							<el-select v-model="form.sendType" filterable placeholder="请选择">
								<el-option
								v-for="item in sendTypeLists"
								:key="item.value"
								:label="item.label"
								:value="item.value">
								</el-option>
							</el-select>
						</el-form-item>					
					</el-col>
					<el-col :span="8">
						<el-form-item 
						label="时间" 
						:label-width="formLabelWidth" >
							<el-date-picker
								v-model="form.date"
								type="daterange"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期">
							</el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</div>
		<div class="statusLists">
			<a href="javascript:;"
			v-for="(item, index) in statusLists" 
			:class="statusFlag==item.value?'active':''"
			:key="item.value"
			@click="statusChange(item)">{{item.label}}</a>
		</div>
        <div class="fontN">
			<el-table :data="listData" border style="width: 100%">
				<el-table-column type="selection" width="55">
				</el-table-column>
				<el-table-column fixed label="操作" width="130">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click="orderDetailFn(scope.row,'scan')">查看订单</el-button>
						<el-button type="text" size="small" @click="orderDetailFn(scope.row,'modify')">修改</el-button>
						<el-button type="text" size="small" @click="orderStatusFn(scope.row)">编辑状态</el-button>
						<el-button type="text" size="small" @click="orderDelete(scope.row)">删除</el-button>
					</template>
				</el-table-column>				
				<el-table-column prop="orderId" label="订单编号">
				</el-table-column>
				<el-table-column label="产品名称">
					<template slot-scope="scope">
						<div class="proLists">
							<a href="javascript:;"
							v-for="(item, index) in scope.row.orderDetails">
								{{item.goodsName}}
							</a>
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="goodsAmount" label="单价/数量">
					<template slot-scope="scope">
						<div class="proLists">
							<a href="javascript:;"
							v-for="(item, index) in scope.row.orderDetails">
								{{'￥' + item.goodsPrice + ' × ' + item.goodsNum}}
							</a>
						</div>
					</template>					
				</el-table-column>
				<el-table-column prop="apiUserNick" label="买家">
				</el-table-column>
				<el-table-column prop="paymentAmount" label="实付金额">
				</el-table-column>
				<el-table-column prop="orderStatus" label="订单状态">
					<template slot-scope="scope"><span>{{ orderStatus[scope.row.orderStatus] }}</span></template>
				</el-table-column>			
				<el-table-column prop="create_time" label="订单创建时间">
				</el-table-column>
				<el-table-column prop="apiUserMessage" label="备注"></el-table-column>
			</el-table>
		</div>
    </div>
    <div class="block fcc mg-t-40">
		<el-pagination @size-change="handleSizeChange" :current-page="currentpage" @current-change="handleCurrentChange" :page-sizes="$pagingArr" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total_count">
		</el-pagination>
	</div>
	<orderDetail v-bind:orderInfo="orderInfo" @orderModify="orderMsgGet" v-if="orderDetailFlag"></orderDetail>
	<statusModify v-bind:orderInfo="orderInfo" @statusModify="statusModifyFn" v-if="orderStatusFlag"></statusModify>
  </div>
</template>

<script>
import orderDetail from "@/pages/home/children/order/orderDetail.vue"
import statusModify from "@/pages/home/children/order/modifyStatus.vue"
export default {
	components: {
		orderDetail,
		statusModify
	},
    data () {
      return {
        loading: false,
        pagesize: 10,
		listData:[],
        currentpage: 1,
		total_count: 10,
		formLabelWidth: '80px',
		form: {
			"orderNum": '',
			"orderType": '',
			"payType": '',
			"serviceType": '',
			"sendType": '',
			"data": ''
		},
		orderTypeLists: [],
		payTypeLists: [],
		serviceTypeLists: [],
		sendTypeLists: [],
		orderStatus: {
			"0": '未支付',
			"1": '支付成功，待发货',
			"2": '已发货',
			"3": '已经签收',
			"4": '超时关闭',
			"5": '订单取消',
		},
		statusFlag: '0',
		statusLists: [
			{"label": '所有订单',"value": '0'},
			{"label": '待付款',"value": '1'},
			{"label": '待发货',"value": '2'},
			{"label": '已发货',"value": '3'},
			{"label": '交易完成',"value": '4'},
			{"label": '交易关闭',"value": '5'}
		],
		orderDetailFlag: false,
		orderInfo: {},
		orderStatusFlag: false,
      };
    },
    methods: {
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
		var url = this.$urlHost+"/chaomes/cms/order/findPage";
		var params = {
			"pageNum": this.currentpage, // 页码
			"pageSize": this.pagesize, // 显示条数
		};
		this.$post(url,params).then((res) => {
			if(res.list){
				this.listData = res.list;
				this.total_count = res.total;
			}else{
				$that.$alert(res.msg, '提示', {
					confirmButtonText: '确定'
				});
			}
		})
	  },
	  statusChange(item){
		  this.statusFlag = item.value;
	  },
	  orderDetailFn(order,type){
		  this.orderInfo.type = type;
		  this.orderInfo.data = JSON.parse(JSON.stringify(order));
		  this.orderDetailFlag = true;
	  },
	  orderMsgGet(val){
		//   console.log(val);
		  if(val != "fail"){
			  this.orderDetailFlag = false;
		  }
		  if(val == "success"){
			  this.requestList();
		  }
	  },
	  orderDelete(row){
		  var orderId = row.orderId;
		  if(orderId){
			  	var $that = this;
                var url = this.$urlHost+"/chaomes/cms/order/delete?orderId="+ orderId;
                this.$post(url,{}).then((res) => {
                    if(res.code == 200){
                        $that.requestList();
                    }else{
                        $that.$alert(res.msg, '提示', {
                            confirmButtonText: '确定'
                        });
                    }
                })
            }
	  },
	  orderStatusFn(order){
		  this.orderInfo.data = JSON.parse(JSON.stringify(order));
		  this.orderStatusFlag = true;
	  },
	  statusModifyFn(val){
		//   console.log(val)
		if(val == "success"){
			this.requestList();
		}
		this.orderStatusFlag = false;
	  }
	},
	mounted(){
		this.requestList();
	}
}
</script>
<style rel="stylesheet" scoped>
@import '../../../../assets/css/common.css'; /*引入公共样式*/
@import '../../../../assets/css/orderLists.css'; /*引入公共样式*/
</style>