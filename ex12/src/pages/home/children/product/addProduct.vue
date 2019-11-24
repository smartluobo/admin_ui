<template>
    <el-dialog title="添加产品" :visible.sync="dialogFormVisible" :close-on-click-modal="false" :close-on-press-escape="false" width="70%">       
        <el-form :model="form" ref="form" :inline="true">
            <el-tabs>
                <el-tab-pane label="基本信息">
                    <el-form-item label="商品名称" :label-width="formLabelWidth" prop="name"
                    :rules="[
                        { required: true, message: '商品名称不能为空'}
                    ]">
                        <el-input v-model="form.name" autocomplete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="商品价格" :label-width="formLabelWidth" prop="goodsPrice" 
                    :rules="[
                        { required: true, message: '商品价格不能为空'},
                        { type: 'number', message: '商品价格必须为数字值'}
                    ]">
                        <el-input v-model="form.goodsPrice" autocomplete="off"></el-input>
                    </el-form-item>                    
                    <el-form-item label="商品库存" :label-width="formLabelWidth" prop="goodsInventory" 
                    :rules="[
                        { required: true, message: '商品库存不能为空'},
                        { type: 'number', message: '商品库存必须为数字值'}
                    ]">
                        <el-input v-model="form.goodsInventory" autocomplete="off"></el-input>
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
                    <el-form-item label="卖点介绍" :label-width="formLabelWidth" class="line" prop="sellingPpoint">
                        <el-input type="textarea" v-model="form.sellingPpoint"></el-input>
                    </el-form-item>
                    <el-form-item label="商品描述" :label-width="formLabelWidth" class="line" prop="simpleDesc">
                        <el-input type="textarea" v-model="form.simpleDesc"></el-input>
                    </el-form-item>
                </el-tab-pane>
                <el-tab-pane label="产品图片">
                    <el-form-item label="商品首页海报" :label-width="width2" class="line">
                        <el-upload
                            action="https://jsonplaceholder.typicode.com/posts/"
                            list-type="picture-card"
                            :file-list="fileList1"
                            :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible" size="tiny">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="商品详情轮播图片" :label-width="width2" class="line">
                        <el-upload
                            action="https://jsonplaceholder.typicode.com/posts/"
                            list-type="picture-card"
                            :file-list="fileList2"
                            :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible" size="tiny">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                    <el-form-item label="商品详情图片" :label-width="width2" class="line">
                        <el-upload
                            class="upload-demo"
                            ref="upload3"
                            action="https://jsonplaceholder.typicode.com/posts/"
                            :on-remove="handleRemove"
                            :file-list="fileList3">
                            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件</div>
                        </el-upload>
                    </el-form-item>
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
export default {
    props: {
        addProductDialog: {
            type: Number,
            required: true
        }
    },
    data(){
        return{            
            dialogFormVisible: false,
            formLabelWidth: '80px',
            width2: '130px',
            dialogImageUrl: '',
            dialogVisible: false,
            form: {
                name: '',
                goodsPrice: '',
                goodsInventory: '',
                goodsStatus: '上架',
                isTrial: '是',
                sellingPpoint: '',
                simpleDesc: '',
            },
            fileList1: [
                {
                    name: 'food.jpeg', 
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }, 
                {
                    name: 'food2.jpeg', 
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }
            ],
            fileList2: [
                {
                    name: 'food.jpeg', 
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }, 
                {
                    name: 'food2.jpeg', 
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }
            ],
            fileList3: [
                {
                    name: 'food.jpeg', 
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }, 
                {
                    name: 'food2.jpeg', 
                    url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
                }
            ],
        }
    },
    watch: {
        addProductDialog: {
            handler(val){
                console.log("aaa");
                this.dialogFormVisible = true;
            }
        }
    },
    methods: {
        cancelBtn(){
            //清空form表单
            this.$refs["form"].resetFields();
            this.dialogFormVisible = false;
        },
        submitBtn(){
            var _this = this;
            var params = {
            "goodsName": "测试商品",
            "goodsCarouselImageList": ["http//baidu1", "http//baidu2", "http//baidu3"],
            "goodsDetailImagesList": ["http//baidu4", "http//baidu5", "http//baidu6"],
            "skuTypeList": [
                { 
                "id": 1,
                "skuDetailList": [{ "id": 1 },  { "id": 2 }, { "id": 3 }]
                },
                {
                "id": 2,
                "skuDetailList": [{ "id": 4 }, { "id": 5 }, { "id": 6 }]
                }, 
                {
                "id": 3,
                "skuDetailList": [{ "id": 7 }, { "id": 8 }, { "id": 9 }]
                }
            ]
            };
            _this.$post('https://www.eecup.cn/chaomes/cms/goods/create', params).then((res) => {
                console.log(res);
            })
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        }
    },
    mounted(){
        this.$fetch("https://www.eecup.cn/chaomes/cms/goods/findInfo?id=1").then((res) => {
            console.log(res)
        })
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