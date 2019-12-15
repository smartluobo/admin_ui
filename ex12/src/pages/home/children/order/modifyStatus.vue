<template>
    <el-dialog 
    title="编辑状态" 
    :visible.sync="visible" 
    :close-on-click-modal="false" 
    :close-on-press-escape="false" 
    :before-close="cancelBtn"
    class="statusModify"
    width="70%">
        <el-form :model="form" ref="form" label-width="120px">
            <el-form-item label="选择状态">
                <el-select v-model="form.status" filterable placeholder="请选择">
                    <el-option
                    v-for="item in statusLists"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
                </el-select>
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
    data(){
        return {
            visible: true,
            form: {
                status: "0"
            },
            statusLists: [
                {"label":"未支付","value":"0"},
                {"label":"支付成功，待发货","value":"1"},
                {"label":"已发货","value":"2"},
                {"label":"已经签收","value":"3"},
                {"label":"超时关闭","value":"4"},
                {"label":"订单取消","value":"5"}
            ]
        }
    },
    methods: {
        cancelBtn(){
            this.$emit("statusModify","cancel");
        },
        submitBtn(){
            this.$emit("statusModify","success");
        }
    }
}
</script>
<style scoped>
.statusModify >>> .el-form{
    height: 120px;
}
</style>