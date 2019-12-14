<template>
    <div>
        <div class="lists">
            <div class="list" 
            v-for="(item,index) in  lists" 
            :key="item.id"
            @click="choosePro(item)">
                <img v-bind:src="item.imgUrl" alt="" />
                <span v-show="item.choose">已参加其他活动</span>
            </div>
        </div>
		<div class="block fcc mg-t-40">
			<el-pagination 
			@size-change="handleSizeChange" 
			:current-page="currentpage" 
			@current-change="handleCurrentChange" 
			:page-sizes="$pagingArr" 
			:page-size="pagesize" 
			layout="total, sizes, prev, pager, next, jumper" 
			:total="total_count">
			</el-pagination>
		</div>
    </div>
</template>
<script>
export default {
    props: {
        searchCondition: {

        }
    },
    watch: {
        searchCondition:{
            handler: function(condition){
                // console.log(condition);
                if(condition.chooseAll){
                    this.chooseAll();
                }else{
                    this.cancelChooseAll();
                }
            },
            deep: true
        }
    },
    data(){
        return {
            lists: [//当前页产品列表
                {'id':'1', 'imgUrl': '', 'choose': false},
                {'id':'2', 'imgUrl': '', 'choose': false},
                {'id':'3', 'imgUrl': '', 'choose': false},
                {'id':'4', 'imgUrl': '', 'choose': false},
                {'id':'5', 'imgUrl': '', 'choose': false},
                {'id':'6', 'imgUrl': '', 'choose': false}
            ],
            chooseLists: [],//已选产品列表
            currentpage: 1,
            pagesize: 10,
            total_count: 10,
        }
    },
    methods: {        
		handleCurrentChange(val) {
			that.currentpage = val
		},
		handleSizeChange(val) {
			that.pagesize = val
			that.currentpage = 1
        },
        choosePro(pro){
            var chooseLists = JSON.parse(JSON.stringify(this.chooseLists))
            var newChooseLists = [];
            if(pro.choose){//已选择的产品退出选择
                chooseLists.forEach(function(item,i){
                    if(item.id != pro.id){
                        newChooseLists.push(item);
                    }
                })
                pro.choose = false;
                this.chooseLists = JSON.parse(JSON.stringify(newChooseLists));
            }else{//未选择过的产品插入选择列表
                pro.choose = true;
                chooseLists.push(pro);
                this.chooseLists = JSON.parse(JSON.stringify(chooseLists));
            }
            // console.log(this.chooseLists);
            this.$emit("chooseProduct",this.chooseLists);
        },
        chooseAll: function(){//本页全选
            var lists = JSON.parse(JSON.stringify(this.lists));
            var chooseLists = JSON.parse(JSON.stringify(this.chooseLists));
            lists.forEach(function(item,i){
                var flag = false;
                chooseLists.forEach(function(items,i){
                    if(item.id == items.id){
                        flag = true;//列表中已存在该产品，不需要再加
                    }
                });
                item.choose = true;
                if(!flag){//列表中不存在该产品，添加该产品
                    chooseLists.push(item);
                }                
            });
            this.lists = JSON.parse(JSON.stringify(lists));
            this.chooseLists = JSON.parse(JSON.stringify(chooseLists));
            this.$emit("chooseProduct",this.chooseLists);
        },
        cancelChooseAll: function(){//取消所有选择
            var lists = JSON.parse(JSON.stringify(this.lists));
            var chooseLists = JSON.parse(JSON.stringify(this.chooseLists));
            var newChooseLists = [];
            
            chooseLists.forEach(function(items,i){
                var flag = false;//默认该产品不存在当前页
                lists.forEach(function(item,i){
                    item.choose = false;
                    if(item.id == items.id){
                        flag = true;//列表中已存在该产品
                    }              
                });
                if(!flag){//列表中不存在该产品，添加该产品
                    newChooseLists.push(item);
                }  
            });
            this.lists = JSON.parse(JSON.stringify(lists));
            this.chooseLists = JSON.parse(JSON.stringify(newChooseLists));
            this.$emit("chooseProduct",this.chooseLists);
        }
    },
    mounted(){}
}
</script>
<style scoped>
.lists{
    border: 1px solid #dedede;
    padding: 10px 0 10px 10px;
}
.list{
    display: inline-block;
    vertical-align: top;
    width: 80px;
    height: 80px;
    margin-right: 10px;
    border: 1px solid #dedede;
    overflow: hidden;
    position: relative;
    cursor: pointer;
}
.list span{
    width: 60px;
    height: 60px;
    line-height: 18px;
    background: rgba(0,0,0,0.5);
    color: #fff;
    font-size: 12px;
    position: absolute;
    left: 10px;
    top: 10px;
    border-radius: 50%;
    padding: 12px 4px;
    text-align: center;
}
</style>
