<template>
  <div id="product-management">
      <div class="flex-sb right-top lrpadd-10 bg-fff">
			<div class="fcc">
				<div class="f14 weight4 pd-l-10">
					产品/产品管理
				</div>
			</div>
			<div class="pd-r-20">
				<el-button size="small" icon="el-icon-refresh" class="blue" @click="refreshFn">刷新</el-button>
			</div>
		</div>
    <el-divider class="el-divider-margin"></el-divider>
    <div class="pd-30" v-loading="loading">
        <div class="fontN">
          <el-button type="primary" size="small" @click="addProduct">添加产品</el-button>
          <el-button type="primary" size="small" @click="deleteProduct">删除产品</el-button>
					<el-table :data="listData" border style="width: 100%" 
          @selection-change="handleSelectionChange"
          @cell-click="cellClick">
            <el-table-column type="selection" fixed width="55">
            </el-table-column>
            <el-table-column fixed label="操作" width="100">
              <template slot-scope="scope">
                <el-button type="text" size="small" 
                @click.native.prevent="modifyRow(scope.$index, listData)">编辑</el-button>
              </template>
            </el-table-column>
						<el-table-column prop="goodsName" label="产品名称">
						</el-table-column>
						<el-table-column prop="goodsPrice" label="产品价格">
						</el-table-column>
						<el-table-column prop="goodsPoster" label="产品图片">
              <template slot-scope="scope">
                <img :src="scope.row.goodsPoster" alt="" class="goodsPosterImg" />
              </template>
						</el-table-column>
						<el-table-column prop="goodsStatus" label="上架状态">
              <template slot-scope="scope">
                <span :class='scope.row.goodsStatus == "0" ? "green" : "red"'>{{scope.row.goodsStatus == "0" ? "√" : "×"}}</span>
              </template>
						</el-table-column>
						<el-table-column prop="createTime" label="录入时间">
						</el-table-column>
						<el-table-column prop="updateTime" label="更新时间">
						</el-table-column>
					</el-table>
				</div>
    </div>
    <div class="block fcc mg-t-40">
      <el-pagination @size-change="handleSizeChange" :current-page="currentpage" @current-change="handleCurrentChange" :page-sizes="$pagingArr" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total_count">
      </el-pagination>
    </div>
    <AddProduct @addProductResult="addProductResult" v-if="addFlag"></AddProduct>
  </div>
</template>

<script>
  import AddProduct from "@/pages/home/children/product/addProduct"
  export default {
    components: {
      AddProduct
    },
    data () {
      return {
        loading: false,
        addFlag: false,
        pagesize: 10,
        currentpage: 1,
        total_count: 10,
				listData:[],
        selectedLists: []//已勾选
      };
    },
    methods: {
      refreshFn(){
        this.getLists();
      },
      addProduct(){
        this.addFlag = true;
        this.$store.dispatch('updateProInfo', {"id": ""});
      },
      addProductResult(obj){
        if(obj.status != "fail"){
          this.addFlag = false;
        }else{
          this.addFlag = true;
        }
        if(obj.status == "success"){
          this.getLists();
        }
      },
      deleteProduct(){
        //获取勾选项
        var lists = this.selectedLists;
        var $that = this;
        for(var i=0;i<lists.length;i++){
          (function(i){
            var item = lists[i];
            var url = $that.$urlHost+"/chaomes/cms/goods/delete?id="+item.id;
            $that.$post(url,{}).then((res) => {
              if(res.code=="200" && res.msg == "success"){
                $that.$message({
                  message: "删除成功！",
                  type: 'success'
                });
                $that.getLists();
              }else{
                $that.$alert('删除失败：'+res.msg, '提示', {
                  confirmButtonText: '确定'
                });
              }
            })
          })(i)
        }
      },
      handleSelectionChange(val){
        this.selectedLists = val;
      },
      cellClick(row, column, cell, event){
        if(column.property == "goodsStatus"){
          var $that = this;
          var url = $that.$urlHost+"/chaomes/cms/goods/update";
          $that.$post(url,{id:row.id}).then((res) => {
            if(res.code=="200" && res.msg == "success"){
              $that.$message({
                message: "更新成功！",
                type: 'success'
              });
              $that.getLists();
            }else{
              $that.$alert('更新失败：'+res.msg, '提示', {
                confirmButtonText: '确定'
              });
            }
          })
        }
      },
      handleCurrentChange(val) {
				let that = this
				that.currentpage = val
				that.refreshFn()
      },
      handleSizeChange(val) {
				let that = this
				that.pagesize = val
				that.currentpage = 1
				that.refreshFn()
      },
      getLists(){
          var $that = this;
          var url = this.$urlHost+"/chaomes/cms/goods/findPage?pageNum="+
          $that.currentpage+"&pageSize="+$that.pagesize;
          var params = {
            goodsName: ''
          };
          this.$post(url,params).then((res) => {
            if(res.list){
                $that.listData = res.list;
					      $that.total_count = res.total;
            }else{
              $that.$alert(res.msg, '提示', {
                confirmButtonText: '确定'
              });
            }
          })
      },
      modifyRow(i,lists){
        this.$store.dispatch('updateProInfo', {"id": lists[i]["id"]});
        this.addFlag = true;
      }
    },
    mounted(){
      this.getLists();
    }
  }
</script>
<style rel="stylesheet" scoped>
@import '../../../../assets/css/common.css'; /*引入公共样式*/
</style>