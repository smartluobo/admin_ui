<template>
    <el-form :model="form" ref="skuForm" :inline="true" label-width="80px" class="typeList">
        <el-form-item 
        v-for="(item, index) in skuTypeArr" 
        :key="index" 
        :label="item.skuTypeName">
            <el-checkbox
            v-for="(items, indexs) in item.skuDetailList" 
            :key="indexs"
            :value="items.isSelect==1?true:false"
            @change="checked=>skuChoose(checked, items)">
                {{items.skuDetailName}}
            </el-checkbox>
        </el-form-item>
        <el-button type="primary" @click="typeManage">参数管理</el-button>
        <ManageSku v-if="manageFlag" @skuManageClose="skuManageClose"></ManageSku>
    </el-form>
</template>
<script>
import ManageSku from "@/pages/home/children/product/skuTypeManage"
export default {
    components: {
      ManageSku
    },
    data(){
        return {
            manageFlag: false,
            form:{
                skuType: ''
            },
            skuTypeArr: [],
        }
    },
    methods:{
        skuTypeGet(){
            var $that = this;
            var url = this.$urlHost+"/chaomes/cms/sku/findTypeList";
            this.$post(url,{}).then((res) => {
                if(res.code==200 && res.data){
                    $that.skuTypeArr = res.data;
                }else{
                    $that.$alert("获取商品规格类型相关信息失败："+res.msg, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            })
        },
        skuChoose(val,items){
            if(val){
                items.isSelect = 1;
            }else{
                items.isSelect = 0;
            }
            this.$emit("skuTypeResult",this.skuTypeArr);
        },
        typeManage(){
            this.manageFlag = true;
        },
        skuManageClose(val){
            this.manageFlag = false;
        }
    },
    mounted(){
        this.skuTypeGet();
    }
}
</script>
<style scoped>
.typeList>>>div.el-form-item{
    display: block;
}
</style>