<template>
    <el-dialog 
    title="添加产品" 
    :visible.sync="dialogFormVisible" 
    :close-on-click-modal="false" 
    :close-on-press-escape="false" 
    :before-close="dialogClose"
    width="70%">       
        <el-form :model="form" ref="form" :inline="true">
            <el-tabs>
                <el-tab-pane label="基本信息">
                    <el-form-item label="商品名称" :label-width="formLabelWidth" prop="goodsName"
                    :rules="[
                        { required: true, message: '商品名称不能为空'}
                    ]">
                        <el-input v-model="form.goodsName" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item 
                    label="商品价格" 
                    :label-width="formLabelWidth" 
                    prop="goodsPrice" 
                    :rules="[
                        { required: true, message: '商品价格不能为空'},
                        { type: 'number', message: '商品价格必须为数字值'}
                    ]">
                        <el-input type="age" v-model.number="form.goodsPrice" auto-complete="off"></el-input>
                    </el-form-item>                    
                    <el-form-item 
                    label="商品库存" 
                    :label-width="formLabelWidth" 
                    prop="goodsInventory" 
                    :rules="[
                        { required: true, message: '商品库存不能为空'},
                        { type: 'number', message: '商品库存必须为数字值', trigger: 'blur'}
                    ]">
                        <el-input v-model.number="form.goodsInventory" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品状态" prop="goodsStatus">
                        <el-radio-group v-model="form.goodsStatus">
                            <el-radio label="上架"></el-radio>
                            <el-radio label="下架"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="试用装" prop="isTrial">
                        <el-radio-group v-model="form.isTrial">
                            <el-radio label="是"></el-radio>
                            <el-radio label="否"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="详细介绍">
                    <el-form-item label="卖点介绍" :label-width="formLabelWidth" class="line" prop="sellingPoint">
                        <el-input type="textarea" v-model="form.sellingPoint"></el-input>
                    </el-form-item>
                    <el-form-item label="商品描述" :label-width="formLabelWidth" class="line" prop="simpleDesc">
                        <el-input type="textarea" v-model="form.simpleDesc"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="产品图片">
                    <el-form-item label="商品首页海报" :label-width="width2" class="line">
                        <el-upload
                            :action="$urlHost+'/chaomes/cms/image/upload'"
                            list-type="picture-card"
                            :file-list="form.fileList1"
                            :on-success="productImg1"
                            :limit="1"
                            :on-remove="handleRemove1">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible" size="tiny">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="商品详情轮播图片" :label-width="width2" class="line">
                        <el-upload
                            :action="$urlHost+'/chaomes/cms/image/upload'"
                            list-type="picture-card"
                            :file-list="form.fileList2"
                            :on-success="productImg2"
                            :on-remove="handleRemove2">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible" size="tiny">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="商品详情图片" :label-width="width2" class="line">
                        <el-upload
                            :action="$urlHost+'/chaomes/cms/image/upload'"
                            list-type="picture-card"
                            :file-list="form.fileList3"
                            :on-success="productImg3"
                            :on-remove="handleRemove3">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible" size="tiny">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="产品规格">
                    <productSku @skuTypeResult="skuTypeResult" :skuTypeList="skuTypeList"></productSku>
                </el-tab-pane>
            </el-tabs>
        </el-form>      
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelBtn">取 消</el-button>
            <el-button type="primary" @click="submitBtn">确 定</el-button>
        </div>
    </el-dialog>    
</template>
<script>
import productSku from "@/pages/home/children/product/productSku"
export default {
    components: {
      productSku
    },
    data(){
        return{            
            dialogFormVisible: true,
            formLabelWidth: '80px',
            width2: '130px',
            dialogImageUrl: '',
            dialogVisible: false,
            form: {
                goodsName: '',
                goodsPrice: '',
                goodsInventory: '',
                goodsStatus: '上架',
                isTrial: '是',
                sellingPoint: '',
                simpleDesc: '',
                fileList1: [],
                fileList2: [],
                fileList3: []
            },
            skuTypeList: [],
            skuTypeLists: []
        }
    },
    methods: {
        skuTypeResult(lists){
            this.skuTypeLists = lists;
        },
        cancelBtn(){
            //清空form表单
            this.$refs["form"].resetFields();
            this.$emit("addProductResult",{"status": "cancel"});
        },
        submitBtn(){
            var _this = this;
            //商品图片
            var files1 = [];
            var files2 = [];
            var files3 = [];
            if(this.form.fileList1){
                this.form.fileList1.forEach(function(item){
                    files1.push(item.url);
                });
            }
            if(this.form.fileList2){
                this.form.fileList2.forEach(function(item){
                    files2.push(item.url);
                });
            }
            if(this.form.fileList3){
                this.form.fileList3.forEach(function(item){
                    files3.push(item.url);
                });
            }
            //商品规格
            var skuTypeList = [];
            var list = this.skuTypeLists;
            list.forEach(function(item){
                var obj = {
                    "id": item.id
                };
                var skuDetailList = [];
                item.skuDetailList.forEach(function(items){
                    if(items.isSelect == 1){
                        var obj1 = {
                            "id": items.id
                        };
                        skuDetailList.push(obj1);
                    }
                });
                obj["skuDetailList"] = skuDetailList;
                skuTypeList.push(obj);
            });
            var params = JSON.parse(JSON.stringify(this.form));
            //基本信息
            params.goodsStatus = this.form.goodsStatus=="上架"?"1":"0";
            params.isTrial = this.form.isTrial=="是"?"1":"0";
            //商品图片
            params["goodsPoster"] = files1[0];
            params["goodsCarouselImageList"] = files2;
            params["goodsDetailImagesList"] = files3;
            //商品规格
            params["skuTypeList"] = skuTypeList;
            delete params.fileList1;
            delete params.fileList2;
            delete params.fileList3;
            // console.log(params);
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    var id = this.$store.state.ProductModify.proInfo.id;
                    var url = "";
                    if(id){
                        url = _this.$urlHost+'/chaomes/cms/goods/update';
                    }else{
                        url = _this.$urlHost+'/chaomes/cms/goods/create';
                    }
                    _this.$post(url, params).then((res) => {
                        if(res.code == 200){
                            _this.$message({
                                message: '操作成功！',
                                type: 'success'
                            });
                            _this.$emit("addProductResult",{"status": "success"});
                        }else{
                            _this.$emit("addProductResult",{"status": "fail"});
                            _this.$alert('操作失败：'+res.msg, '提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    })
                } else {
                    // console.log('error submit!!');
                    return false;
                }
            });
        },
        dialogClose(){
            this.$emit("addProductResult",{"status": "cancel"});
        },
        getGoodInfo(id){
            var $that = this;
            var url = this.$urlHost+"/chaomes/cms/goods/findInfo?id="+id;
            this.$fetch(url).then((res) => {
                if(res.code==200 && res.data){
                    for(var name in res.data){
                        $that.form[name] = res.data[name];
                    }
                    $that.skuTypeList = res.data["skuTypeList"];
                    $that.defaultData();
                }else{
                    $that.$alert("获取商品信息失败："+res.msg, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            })
        },
        productImg1(data){//商品海报
            var obj = {};
            obj.url = data;
            this.form.fileList1[0] = obj;
        },
        productImg2(data){//商品轮播
            var obj = {
                url: data
            };
            this.form.fileList2 = this.form.fileList2?this.form.fileList2:[];
            this.form.fileList2.push(obj)
        },
        productImg3(data){//商品详情
            var obj = {
                url: data
            };
            this.form.fileList3 = this.form.fileList3?this.form.fileList3:[];
            this.form.fileList3.push(obj)
        },
        handleRemove1(file, fileList) {
            this.form.fileList1 = [];
        },
        handleRemove2(file, fileList) {
            var lists = [];
            fileList.forEach(function(item){
                var obj = {
                    url: item.url
                };
                lists.push(obj);
            });
            this.form.fileList2 = lists;
        },
        handleRemove3(file, fileList) {
            var lists = [];
            fileList.forEach(function(item){
                var obj = {
                    url: item.url
                };
                lists.push(obj);
            });
            this.form.fileList3 = lists;
        },
        defaultData(){//数据初始化            
            if(this.form.goodsStatus == 0){
                this.form.goodsStatus = '下架';
            }else{
                this.form.goodsStatus = '上架';
            }
            if(this.form.isTrial == 0){
                this.form.isTrial = '否';
            }else{
                this.form.isTrial = '是';
            }
            if(this.form.goodsPrice){
                this.form.goodsPrice = parseInt(this.form.goodsPrice);
            }
            if(this.form.goodsInventory){
                this.form.goodsInventory = parseInt(this.form.goodsInventory);
            }
            if(this.form["goodsPoster"]){
                var poster = this.form["goodsPoster"];
                var list1 = [];
                var obj = {
                        url: poster
                    };
                list1.push(obj);
                this.form["fileList1"] = list1;
            }            
            if(this.form["goodsCarouselImageList"]){
                var fileList2 = this.form["goodsCarouselImageList"];
                var list2 = [];
                fileList2.forEach(function(item){
                    var obj = {
                        url: item
                    };
                    list2.push(obj);
                });
                this.form["fileList2"] = list2;
            }
            if(this.form["goodsDetailImagesList"]){
                var fileList3 = this.form["goodsDetailImagesList"];
                var list3 = [];
                fileList3.forEach(function(item){
                    var obj = {
                        url: item
                    };
                    list3.push(obj);
                });
                this.form["fileList3"] = list3;
            }
        }
    },
    mounted(){
        var id = this.$store.state.ProductModify.proInfo.id;
        if(id){
            this.getGoodInfo(id);
        }
    }
}
</script>
<style scoped>
    .el-dialog__wrapper >>> .el-dialog__body{
        padding: 0 20px;
    }
    .el-form--inline .el-form-item{
        width: calc(33.33% - 13px);
    }
    .el-form--inline .el-form-item__content{
        width: calc(100% - 80px);
    }
    .el-select{
        width: 100%;
    }
    .upload-demo .el-upload__tip{
        padding-left: 10px;
        display: inline-block;
    }
    .line{
        display: block;
        width: 100%!important;
    }
    .el-form--inline>>>.line .el-form-item__content{
        width: calc(100% - 130px);
    }
    .el-form-item >>> .el-upload-list--picture-card .el-upload-list__item,
    .el-form-item >>> .el-upload--picture-card{
        width: 80px;
        height: 80px;
        line-height: 80px;
    }
</style>