<template>
    <el-dialog 
    :title="title" 
    :visible.sync="visible" 
    :close-on-click-modal="false" 
    :close-on-press-escape="false" 
    :before-close="cancelBtn"
    class="detailOrder"
    width="70%">
        <el-form :model="form" ref="form" label-width="120px">
            <h6 class="title">购物清单</h6>
            <el-table :data="form.orderDetails">
                <el-table-column prop="goodsName" label="产品名称">
                </el-table-column>
                <el-table-column prop="goodsPrice" label="价格">
                </el-table-column>
                <el-table-column prop="goodsNum" label="数量">
                    <template slot-scope="scope">
                        <el-form-item :prop="'orderDetails.' + scope.$index + '.goodsNum'" :rules='rules.goodsNum' :label-width="width2">
                            <el-input style="width:80px"  v-model="scope.row.goodsNum" ></el-input>
                        </el-form-item>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsTotalAmount" label="小计">
                    <template slot-scope="scope">
                        <span>{{scope.row.goodsTotalAmount}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="goodsName" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="delGoods(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="邮费(￥)">
                        <el-input v-model="form.orderPostageAmount" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="涨价或减价(￥)">
                        <el-input v-model="form.couponsReduceAmount" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <h6 class="title">收货人信息</h6>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="姓名">
                        <el-input v-model="form.apiUserId" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="地址">
                        <el-input v-model="form.address" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="手机">
                        <el-input v-model="form.phoneNum" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="配送方式">
                        <el-input v-model="form.deliveryType" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <h6 class="title">支付方式</h6>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="支付方式">
                        <el-input v-model="form.paymentType" auto-complete="off"></el-input>
                    </el-form-item>                    
                </el-col>
            </el-row>
            <h6 class="title">买家留言</h6>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="留言信息">
                        <el-input v-model="form.apiUserMessage" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>  
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelBtn" v-if="orderInfo['type']=='modify'">取 消</el-button>
            <el-button @click="cancelBtn" v-if="orderInfo['type']=='scan'">关 闭</el-button>
            <el-button type="primary" @click="submitBtn" v-if="orderInfo['type']=='modify'">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
import { template } from '@babel/core';
export default {
    props: {
        orderInfo: {}
    },
    data(){
        return {
            visible: true,
            title: "订单详情",
            form: {},
            rules: {
                goodsNum:{
                    type:"string",
                    required:true,
                    message:"必填字段",
                    trigger:"change"
                }
            },
            width2: "0"
        }
    },
    methods: {
        delGoods: function(row){
            console.log(row);
        },
        submitBtn: function(){
            var $that = this;
            this.$refs["form"].validate((valid) => {
                if(valid){
                    var url = this.$urlHost+"/chaomes/cms/order/update";
                    this.$post(url,$that.form).then((res) => {
                        // console.log(res.data);
                        if(res.data){
                            $that.$emit("orderModify","success");
                        }else{
                            $that.$emit("orderModify","fail");
                            $that.$alert(res.msg, '提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    })
                }
            })
        },
        cancelBtn: function(){
            this.$emit("orderModify","cancel");
        },
        orderDetailGet: function(){
            var $that = this;
            var orderId = this.orderInfo["data"] && this.orderInfo["data"]["orderId"]?this.orderInfo["data"]["orderId"]:'';
            if(orderId){
                var url = this.$urlHost+"/chaomes/cms/order/findInfo?orderId="+ orderId;
                this.$post(url,{}).then((res) => {
                    // console.log(res.data);
                    if(res.data){
                        $that.form = JSON.parse(JSON.stringify(res.data));
                    }else{
                        $that.$alert(res.msg, '提示', {
                            confirmButtonText: '确定'
                        });
                    }
                })
            }
        }
    },
    mounted(){
        if(this.orderInfo["type"] == "modify"){
            this.orderDetailGet();
        }
        // console.log(this.orderInfo);
    }
}
</script>
<style rel="stylesheet" scoped>
@import '../../../../assets/css/common.css'; /*引入公共样式*/
@import '../../../../assets/css/orderLists.css'; /*引入公共样式*/
</style>