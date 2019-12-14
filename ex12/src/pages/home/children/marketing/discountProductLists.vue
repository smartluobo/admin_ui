<template>
    <el-dialog 
        title="选择活动产品" 
        :visible.sync="visible" 
        :close-on-click-modal="false" 
        :close-on-press-escape="false"
        :append-to-body="true"
        :before-close="dialogClose"
        width="700px">
        <el-form :model="productForm" ref="productForm" label-width="90px">
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-form-item label="产品库">
                        <el-select v-model="productForm.productLibrary" filterable placeholder="请选择">
                            <el-option
                            v-for="item in productLibraryList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>                    
                </el-col>
                <el-col :span="8">
                    <el-form-item label="分类">
                        <el-select v-model="productForm.type" filterable placeholder="请选择">
                            <el-option
                            v-for="item in typeLists"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="标签">
                        <el-select v-model="productForm.label" filterable placeholder="请选择">
                            <el-option
                            v-for="item in labelLists"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="名称搜索">
                        <el-input v-model="productForm.name"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item :label="productForm.chooseAll?'本页全不选':'本页全选'">
                        <el-checkbox-group v-model="productForm.chooseAll">
                            <el-checkbox label="" name="chooseAll"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>   
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancelBtn">取 消</el-button>
            <el-button type="primary" @click="submitBtn">确 定</el-button>
        </div>
        <chooseProLists v-bind:searchCondition="productForm" @chooseProduct="chooseProduct"></chooseProLists>
    </el-dialog>
</template>
<script>
import chooseProLists from "@/pages/home/children/marketing/chooseProLists"
export default {
    components: {
        chooseProLists
    },
    data(){
        return {
            visible: true,
            productForm: {
                productLibrary: "all",
                type: "all",
                label: "all",
                name: '',
                chooseAll: ''
            },
            productLibraryList: [
                {"label":"全部","value":"all"},
                {"label":"产品1","value":"1"}
            ],
            typeLists: [
                {"label":"全部","value":"all"}
            ],
            labelLists: [
                {"label":"全部","value":"all"}
            ]
        }
    },
    methods:{
        dialogClose: function(){
            this.visible = false;
            this.$emit("addProLists","cancel");
        },
        cancelBtn: function(){
            this.visible = false;
            this.$emit("addProLists","cancel");
        },
        submitBtn: function(){    
            this.visible = false; 
            this.$emit("addProLists","submit");
        },
        chooseProduct: function(val){
            console.log(val);
        }
    }
}
</script>
<style scoped>
</style>