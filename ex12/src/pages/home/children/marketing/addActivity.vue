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
            <el-form-item 
            label="活动名称" 
            :label-width="formLabelWidth" 
            prop="activityName"            
            :rules="[
                { required: true, message: '商品名称不能为空'}
            ]">
                <el-input v-model="form.activityName" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="活动类型" prop="activityType">
                <el-radio-group v-model="form.activityType">
                    <el-radio label="全场折扣"></el-radio>
                    <el-radio label="限时折扣"></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item 
            label="活动日期" 
            :label-width="formLabelWidth" 
            prop="date"
            :rules="[
                { required: true, message: '活动日期不能为空'}
            ]">
                 <el-date-picker
                    v-model="form.date"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item 
            label="活动时间" 
            :label-width="formLabelWidth" 
            prop="hour"
            :rules="[
                { required: true, message: '活动时间不能为空'}
            ]">
                <el-time-picker
                    is-range
                    v-model="form.hour"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    placeholder="选择时间范围">
                </el-time-picker>
            </el-form-item>                               
            <el-form-item 
            label="活动折扣" 
            :label-width="formLabelWidth" 
            prop="activityRatio" 
            :rules="[
                { required: true, message: '商品折扣不能为空'}
            ]">
                <el-input v-model="form.activityRatio" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="活动商品" v-if="form.activityType=='1'||form.activityType=='限时折扣'">
                <ul class="discountPro">
                    <li v-for="(item, indexs) in form.goodsList">
                        <img v-bind:src="item.goodsPoster?$urlHost+'/chaomes/image/'+item.goodsPoster:item.goodsPoster" alt="" />
                    </li>
                    <li class="addProductBtn el-icon-plus" @click="addProducFn"></li>
                </ul>
            </el-form-item>
        </el-form>    
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelBtn">取 消</el-button>
            <el-button type="primary" @click="submitBtn">确 定</el-button>
        </div>
        <AddDiscountPro v-if="addProVisible" @addProLists="addProLists"></AddDiscountPro>
    </el-dialog>
</template>
<script>
import AddDiscountPro from "@/pages/home/children/marketing/discountProductLists"
export default {
    props:{
        discountData: {
            type: Object,
            required: true
        }
    },
    components: {
        AddDiscountPro
    },
    data(){
        return {
            title: "新增活动",
            dialogFormVisible: true,
            formLabelWidth: "80px",
            form: {
                "activityName": "活动1",
                "activityType": "0",
                "date": [
                    new Date(),
                    new Date()
                ],
                "startDate": '',
                "endDate": '',
                "hour": [
                    new Date(2016, 9, 10, 0, 0),
                    new Date()
                ],
                "startHour": 14,
                "endHour": 24,
                "activityPoster": null,
                "createTime": null,
                "updateTime": null,
                "activityRatio": "0.88",
                "cmsUserId": 0,
                "cmsUserName": null,
                "goodsList": []
            },
            activity: {
                "0": "全场折扣",
                "1": "限时折扣"
            },
            activity1: {
                "全场折扣": "0",
                "限时折扣": "1"
            },
            addProVisible: false,
            productLists: []//优惠产品
        }
    },
    methods:{
        cancelBtn(){
            this.$emit("addActivityResult",{"status": "cancel"});
        },
        submitBtn(){
            var _this = this;
            var params = {
                "activityName": this.form.activityName,
                "activityType": this.activity1[this.form.activityType]?this.activity1[this.form.activityType]:this.form.activityType,
                "startDate": this.form.date[0],
                "endDate": this.form.date[1],
                "startHour": new Date(this.form.hour[0]).getHours(),
                "endHour": new Date(this.form.hour[1]).getHours(),
                "activityPoster": this.goodsList,
                "createTime": null,
                "updateTime": null,
                "activityRatio": this.form.activityRatio,
                "cmsUserId": 0,
                "cmsUserName": null,
                "goodsList": this.form.goodsList
            };
            var url = "";
            if(this.discountData.type == "modify"){
                params.id = this.discountData.data.id;
                url = _this.$urlHost+'/chaomes/cms/activity/update';             
            }else{
                url = _this.$urlHost+'/chaomes/cms/activity/create'
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
                            _this.$alert('新增失败：'+res.msg, '提示', {
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
            this.$emit("addActivityResult",{"status": "cancel"});
        },
        getActivityDetail(){
            var _this = this;
            if(this.discountData.type == "modify" && this.discountData.data){
                var id = this.discountData.data.id;
                var url = '';
                url = '/chaomes/cms/activity/findInfo?id='
                this.$fetch(_this.$urlHost+ url + id).then((res) => {
                    if(res.code == 200){
                        _this.form = JSON.parse(JSON.stringify(res.data));
                        var date = [];
                        date.push(new Date(res.data.startDate));
                        date.push(new Date(res.data.endDate));
                        _this.form.date = date;
                        var hour = [];
                        hour.push(_this.timeSet(res.data.startHour,"start"));
                        hour.push(_this.timeSet(res.data.endHour,"end"));
                        _this.form.date = date;
                        _this.form.hour = hour;
                        _this.form.goodsList = JSON.parse(JSON.stringify(res.data.goodsList));
                    }else{
                        _this.$alert('获取活动详情数据失败：'+res.msg, '提示', {
                            confirmButtonText: '确定'
                        });
                    }
                    _this.form.activityType = _this.activity[_this.form.activityType];
                })
            }
        },
        dataSet(date){
            return new Date(date);
        },
        timeSet(time,type){
            if(type=="start"){
                var year = new Date().getFullYear(this.form.startDate);
                var month = new Date().getMonth(this.form.startDate)+1;
                var date = new Date().getDate(this.form.startDate);
            }else if(type=="end"){
                var year = new Date().getFullYear(this.form.endDate);
                var month = new Date().getMonth(this.form.endDate)+1;
                var date = new Date().getDate(this.form.endDate);
            }
            return new Date(year,month,date,time,0);
        },
        addProducFn(){
            this.addProVisible = true;
        },
        addProLists(obj){//新增产品结果
            this.addProVisible = false;
            // var lists = [];
            // if(obj && obj != "cancel" && obj.length>0){
            //     obj.forEach(function(item,i){
            //         var pro = {};
            //         pro.id = item.id?item.id:'';
            //         pro.goodsName = item.goodsName?item.goodsName:'';
            //         pro.goodsPrice = item.goodsPrice?item.goodsPrice:'';
            //         lists.push(pro);
            //     });
            // }
            this.form.goodsList = JSON.parse(JSON.stringify(obj));
        }
    },
    mounted(){
        // console.log(this.discountData);
        if(this.discountData.type == "modify"){
            this.title = "修改活动";
            this.getActivityDetail();
        }else if(this.discountData.type == "add"){
            this.title = "新增活动";
            this.form.activityType = this.activity[this.form.activityType];
        }
        // console.log(this.title);
    }
}
</script>
<style rel="stylesheet" scoped>
@import '../../../../assets/css/common.css'; /*引入公共样式*/
</style>