<template>
    <el-form :model="form" ref="skuForm" :inline="true" label-width="80px" class="typeList">
        <el-form-item 
        v-for="(item, index) in skuTypeArr" 
        :key="index" 
        :label="item.skuTypeName">
            <el-checkbox
            v-for="(items, indexs) in item.skuDetailList" 
            :key="indexs"
            :value="items.isSelect=='1'?true:false"
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
    props:{
        skuTypeList: {}
    },
    watch:{
        skuTypeList:{
            handler(val){
                this.skuTypeGet();
            }
        }
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
            this.skuTypeArr = this.skuTypeList?this.skuTypeList:[];
        },
        skuChoose(val,items){
            if(items.isSelectFlag){
                if(val){
                    items.isSelect = 1;
                }else{
                    items.isSelect = 0;
                }
                this.$emit("skuTypeResult",this.skuTypeArr);
            }else{
               items.isSelectFlag = true; 
            }
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