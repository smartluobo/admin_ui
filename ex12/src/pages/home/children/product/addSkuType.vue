<template>
    <el-dialog title="添加产品参数" 
    :visible.sync="dialogVisible" 
    :close-on-click-modal="false" 
    :close-on-press-escape="false" 
    append-to-body
    :before-close="dialogClose"
    class="customDialog"
    width="70%">
        <el-form 
        label-position="right" 
        :rules="rules" 
        :model="form" 
        ref="form"
        :inline="true">
            <el-form-item label="选项名" :label-width="formLabelWidth" class="line" prop="skuTypeName">
                <el-input v-model="form.skuTypeName"></el-input>
            </el-form-item>
            <el-button type="primary" @click="addskuDetailName" class="addBtn">添加选项值</el-button>
            <el-table 
            :data="form.skuLists"
            height="300">
                <el-table-column label="选项值" align="center">
                    <template slot-scope="scope">
                        <el-form-item 
                        :prop="'skuLists.' + scope.$index + '.skuDetailName'"
                        :rules='rules.skuDetailName'>
                            <el-input
                            v-model="scope.row.skuDetailName" 
                            @change="skuDetailNameChange(scope.row)"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>               
                <el-table-column label="价格" align="center">
                    <template slot-scope="scope">
                        <el-form-item 
                        :prop="'skuLists.' + scope.$index + '.skuDetailPrice'"
                        :rules='rules.skuDetailPrice'>
                            <el-input
                            v-model="scope.row.skuDetailPrice"></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">         
                        <el-button type="text" size="small" 
                        @click.native.prevent="delRow(scope.$index, scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <div style="text-align:center">
            <el-button @click.native.prevent="cancelBtn">取消</el-button>           
            <el-button type="primary" @click.native.prevent="submitBtn">确定</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    data(){
        return {
            dialogVisible: true,
            formLabelWidth: '80px',
            form:{
                skuLists: [],
                skuTypeName: ''
            },
            rules:{
                skuDetailName: [
                    { required: true, message: '选项值不能为空', trigger: 'blur' }
                ],
                skuTypeName: [
                    { required: true, message: '参数项名称不能为空', trigger: 'blur' }
                ],
                skuDetailPrice: [
                    { required: true, message: '价格不能为空', trigger: 'blur' }
                ]
            },
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
        delRow(i,lists){
            this.form.skuLists.splice(i,1);
        },
        addskuDetailName(){            
            this.$prompt('请输入产品参数', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
                inputErrorMessage: '必填'
            }).then(({ value }) => {
                var lists = this.form.skuLists;
                var dataObj = {
                    id: lists.length,
                    skuDetailName: value
                };
                lists.push(dataObj);
                this.$message({
                    type: 'success',
                    message: '添加成功！'
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消添加！'
                });       
            });
        },
        skuDetailNameChange(row){
            console.log(row);
        },
        dialogClose(){
            this.$emit("addSkuTypeResult","cancel");
        },
        cancelBtn(){
            this.$emit("addSkuTypeResult","cancel");
        },
        submitBtn(){
            var $that = this;
            var skuTypeName = this.form.skuTypeName;
            var lists = this.form.skuLists;
            lists.forEach(function(item){
                item.id = item.id + "";
                item.skuDetailPrice = parseInt(item.skuDetailPrice);
            });
            var param = {
                    "skuTypeName": skuTypeName,
                    "skuDetailList": lists
                }
            var url = this.$urlHost+"/chaomes/cms/sku/createType";
            this.$post(url,param).then((res) => {
                if(res.code==200 && res.msg=='success'){
                    $that.$emit("addSkuTypeResult","submit");
                }else{
                    $that.$alert("获取商品规格类型相关信息失败："+res.msg, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            })            
        }
    },
    mounted(){
        this.skuTypeGet();
    }
}
</script>
<style rel="stylesheet" scoped>
@import '../../../../assets/css/common.css'; /*引入公共样式*/
.addBtn{
    margin-top: 4px;
}
</style>