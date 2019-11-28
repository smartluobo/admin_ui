<template>
    <el-dialog title="管理产品参数" 
    :visible.sync="dialogVisible" 
    :close-on-click-modal="false" 
    :close-on-press-escape="false" 
    append-to-body
    :before-close="dialogClose"
    class="customDialog" 
    width="70%">
        <el-button type="primary" @click="addSku">添加产品参数</el-button>
        <el-table
            :data="skuLists"
            style="width: 100%"
            height="250">
            <el-table-column
            prop="skuTypeName"
            label="参数项名称">           
            </el-table-column>            
            <el-table-column
            prop="skuDetailList"
            label="选项值">
                <template slot-scope="scope">
                    <span>{{skuDetailList(scope.row)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" 
                    @click.native.prevent="modifyRow(scope.$index, skuLists)">修改</el-button>           
                    <el-button type="text" size="small" 
                    @click.native.prevent="delRow(scope.$index, skuLists)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ModifySku v-if="modifyFlag" :modifyData="modifyData" @modifySkuTypeResult="modifySkuTypeResult"></ModifySku>
        <AddSkuType v-if="addFlag" @addSkuTypeResult="addSkuTypeResult"></AddSkuType>
    </el-dialog>
</template>
<script>
import ModifySku from "@/pages/home/children/product/modifySku"
import AddSkuType from "@/pages/home/children/product/addSkuType"
export default {
    components:{
        ModifySku,
        AddSkuType
    },
    data(){
        return {
            dialogVisible: true,
            modifyFlag: false,
            addFlag: false,
            skuLists: [],
            modifyData: {}
        }
    },
    methods:{
        skuTypeGet(){
            var $that = this;
            var param = {}
            var url = this.$urlHost+"/chaomes/cms/sku/findTypeList";
            this.$post(url,param).then((res) => {
                if(res.code==200 && res.data){
                    $that.skuLists = res.data;
                }else{
                    $that.$alert("获取商品规格类型相关信息失败："+res.msg, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            })
        },
        modifyRow(i,data){
            this.modifyFlag = true;
            this.modifyData = data[i];
        },
        delRow(i,data){
            var $that = this;
            var param = {}
            var url = this.$urlHost+"/chaomes/cms/sku/deleteType?skuTypeId="+data[i].id;
            this.$post(url,param).then((res) => {
                if(res.code==200){
                    $that.$message({
                        message: '删除成功！',
                        type: 'success'
                    });
                    $that.skuTypeGet();
                }else{
                    $that.$alert("删除失败："+res.msg, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            })
        },
        skuDetailList(row){
            var list = row.skuDetailList?row.skuDetailList:[];
            var str = ""
            list.forEach(element => {
                str += element.cmsView+"、";
            });
            return str;
        },
        addSku(){
            this.addFlag = true;
        },
        addSkuTypeResult(val){
            this.addFlag = false;
        },
        modifySkuTypeResult(val){
            this.modifyFlag = false;
        },
        dialogClose(){
            this.$emit("skuManageClose","cancel");
        }
    },
    mounted(){
        this.skuTypeGet();
    }
}
</script>
<style scoped>
@import '../../../../assets/css/common.css'; /*引入公共样式*/
</style>