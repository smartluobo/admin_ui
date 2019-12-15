<template>
    <el-dialog 
    :title="title" 
    :visible.sync="dialogFormVisible" 
    :close-on-click-modal="false" 
    :close-on-press-escape="false"
    :append-to-body="true"
    :before-close="dialogClose"
    width="600px">
        <el-form :model="form" ref="form" class="discount">
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-form-item 
                    label="活动名称" 
                    :label-width="formLabelWidth" 
                    prop="couponsName"            
                    :rules="[
                        { required: true, message: '商品名称不能为空'}
                    ]">
                        <el-input v-model="form.couponsName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="活动类型" prop="couponsType">
                        <el-radio-group v-model="form.couponsType" @change="typeChange">
                            <el-radio label="折扣券"></el-radio>
                            <el-radio label="满减券"></el-radio>
                            <el-radio label="团购券"></el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="form.couponsType=='1' || form.couponsType=='折扣券'">
                    <el-form-item 
                    label="活动折扣" 
                    :label-width="formLabelWidth" 
                    prop="couponsRatio"
                    :rules="[
                        { required: true, message: '商品折扣不能为空'}
                    ]">
                        <el-input v-model="form.couponsRatio"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="form.couponsType=='2' || form.couponsType=='满减券'">
                    <el-form-item 
                    label="消费金额" 
                    :label-width="formLabelWidth" 
                    prop="consumeAmount" 
                    :rules="[
                        { required: true, message: '消费金额不能为空'}
                    ]">
                        <el-input v-model="form.consumeAmount"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="form.couponsType=='2' || form.couponsType=='满减券'">
                    <el-form-item 
                    label="减免金额" 
                    :label-width="formLabelWidth" 
                    prop="reduceAmount" 
                    :rules="[
                        { required: true, message: '减免金额不能为空'}
                    ]">
                        <el-input v-model="form.reduceAmount"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8" v-if="form.couponsType=='3' || form.couponsType=='团购券'">
                    <el-form-item 
                    label="消费数量" 
                    :label-width="formLabelWidth" 
                    prop="consumeCount">
                        <el-input v-model="form.consumeCount"></el-input>
                    </el-form-item>   
                </el-col>
                <el-col :span="8" v-if="form.couponsType=='3' || form.couponsType=='团购券'">       
                    <el-form-item 
                    label="赠送数量" 
                    :label-width="formLabelWidth" 
                    prop="giveCount">
                        <el-input v-model="form.giveCount"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item 
                    label="使用范围" 
                    :label-width="formLabelWidth" 
                    prop="useScope">
                        <el-input v-model="form.useScope" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item 
                    label="使用规则" 
                    :label-width="formLabelWidth" 
                    prop="useRules" 
                    :rules="[
                        { required: true, message: '使用规则不能为空'}
                    ]">
                        <el-input v-model="form.useRules" auto-complete="off"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>  
        </el-form>    
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelBtn">取 消</el-button>
            <el-button type="primary" @click="submitBtn">确 定</el-button>
        </div>
    </el-dialog>
</template>
<script>
export default {
    props:{
        discountData: {
            type: Object,
            required: true
        }
    },
    components: {
        
    },
    data(){
        return {
            title: "新增优惠券",
            dialogFormVisible: true,
            formLabelWidth: "80px",
            form: {
                "couponsName": "",
                "couponsRatio": "0.88",
                "couponsType": "1",
                "consumeAmount": "",
                "reduceAmount": "",
                "consumeCount": "",
                "giveCount": "",
                "couponsPoster": "",
                "useRules": "",
                "useScope": ""
            },
            activity: {
                "1": "折扣券",
                "2": "满减券",
                "3": "团购券"
            },
            activity1: {
                "折扣券": "1",
                "满减券": "2",
                "团购券": "3"
            }
        }
    },
    methods:{
        typeChange(){
            this.$refs["form"].clearValidate(); // 清除整个表单的校验
        },
        cancelBtn(){
            this.$emit("addActivityResult",{"status": "cancel"});
        },
        submitBtn(){
            var _this = this;
            var params = JSON.parse(JSON.stringify(this.form));
            params.couponsType = this.activity[this.form.couponsType]?this.activity[this.form.couponsType]:this.form.couponsType;
            var url = "";
            if(this.discountData.type == "modify"){
                params.id = this.discountData.data.id;
                url = _this.$urlHost+'/chaomes/cms/coupons/update';            
            }else{
                url = _this.$urlHost+'/chaomes/cms/coupons/create';
            }
            // console.log(params,url);
            // return false;
            this.$refs["form"].validate((valid) => {
                if (valid) {
                    _this.$post(url, params).then((res) => {
                        if(res.code == 200){
                            _this.$emit("addActivityResult",{"status": "success"});
                        }else{
                            _this.$emit("addActivityResult",{"status": "fail"});
                            _this.$alert('操作失败：'+res.msg, '提示', {
                                confirmButtonText: '确定'
                            });
                        }
                    })
                } else {
                    return false;
                }
            });
        },
        dialogClose(){
            this.$emit("addActivityResult",{"status": "cancel"});
        },
        getActivityDetail(){
            var _this = this;
            if(this.discountData.type == "modify" && this.discountData.data){
                var id = this.discountData.data.id;
                var url = '/chaomes/cms/coupons/findInfo?id=';
                this.$fetch(_this.$urlHost+ url + id).then((res) => {
                    if(res.code == 200){

                    }else{
                        _this.$alert('获取活动详情数据失败：'+res.msg, '提示', {
                            confirmButtonText: '确定'
                        });
                    }
                    _this.form.couponsType = _this.activity[_this.form.couponsType];
                })
            }
        }
    },
    mounted(){
        if(this.discountData.type == "modify"){
            this.title = "修改优惠券";
            this.getActivityDetail();
        }else if(this.discountData.type == "add"){
            this.title = "新增优惠券";
            this.form.couponsType = this.activity[this.form.couponsType];
        }
    }
}
</script>
<style rel="stylesheet" scoped>
@import '../../../../assets/css/common.css'; /*引入公共样式*/
</style>