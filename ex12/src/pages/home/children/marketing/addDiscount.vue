<template>
    <el-dialog 
    :title="title" 
    :visible.sync="dialogFormVisible" 
    :close-on-click-modal="false" 
    :close-on-press-escape="false"
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
                    <el-radio label="限时"></el-radio>
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
            <el-form-item label="商品详情图片" :label-width="width2" class="line">
                        <el-upload
                            :action="$urlHost+'/chaomes/cms/image/upload'"
                            :limit="10"
                            list-type="picture-card"
                            :file-list="form.fileList"
                            :on-success="productImg"
                            :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible" size="tiny">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
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
    data(){
        return {
            title: "新增优惠券",
            dialogFormVisible: true,
            formLabelWidth: "80px",
            dialogImageUrl: '',
            dialogVisible: false,
            width2: '100px',
            form: {
                "activityName": "全场折扣",
                "activityType": "全场折扣",
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
                "fileList": [],
                "createTime": null,
                "updateTime": null,
                "activityRatio": "0.88",
                "cmsUserId": 0,
                "cmsUserName": null
            }
        }
    },
    methods:{
        productImg(data){
            var obj = {};
            obj.url = data;
            this.form.fileList[0] = obj;
        },
        handleRemove(){},
        cancelBtn(){},
        submitBtn(){
            var _this = this;
            var activity = {
                "全场折扣": "0",
                "限时": "1"
            };
            var params = {
                "activityName": this.form.activityName,
                "activityType": activity[this.form.activityName],
                "startDate": this.form.date[0],
                "endDate": this.form.date[1],
                "startHour": new Date(this.form.hour[0]).getHours(),
                "endHour": new Date(this.form.hour[1]).getHours(),
                "activityPoster": this.form.fileList[0]&&this.form.fileList[0]["url"]?this.form.fileList[0]["url"]:"",
                "createTime": null,
                "updateTime": null,
                "activityRatio": this.form.activityRatio,
                "cmsUserId": 0,
                "cmsUserName": null
            };
            var url = "";
            if(this.discountData.type == "modify"){
                url = _this.$urlHost+'/chaomes/cms/activity/update';
            }else{
                url = _this.$urlHost+'/chaomes/cms/activity/create'
            }
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
            _this.$fetch(_this.$urlHost+'chaomes/cms/activity/findInfo?id=5').then((res) => {
                if(res.code == 200){
                   
                }else{
                    _this.$alert('获取活动详情数据失败：'+res.msg, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            })
        }
    },
    mounted(){
        // console.log(this.discountData);
        if(this.discountData.type == "modify"){
            this.getActivityDetail();
            this.title = "修改优惠券";
        }        
    }
}
</script>
<style rel="stylesheet" scoped>
@import '../../../../assets/css/common.css'; /*引入公共样式*/
</style>