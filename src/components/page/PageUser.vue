<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 用户列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--搜索-->
            <div class="handle-box">
                <el-input v-model="pageRequest.condition.userName" placeholder="筛选关键词" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="search" @click="loadData">搜索</el-button>
            </div>
            <span>共计{{total}}条</span>
            <!--表格-->
            <el-table :data="userArr"  border style="width: 100%"   :cell-style="tableRowClassName" @selection-change="handleSelectionChange">
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="name" label="昵称" align="center"></el-table-column>
                <el-table-column label="头像" align="center">
                    <template slot-scope="scope">
                        <img style="width: 19%" :src="scope.row.headImg |formatUrl" alt=""/>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
                <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
                <el-table-column prop="isAuthorization" label="是否为名师" align="center" :formatter="formatState"></el-table-column>
                <el-table-column prop="resourceCount" label="资源量" align="center"></el-table-column>
                <el-table-column prop="followers" label="粉丝数量" align="center"></el-table-column>
                <el-table-column prop="createTime" label="注册时间" align="center" :formatter="formatDate"></el-table-column>
                <el-table-column prop="weiChatOpenId" label="绑定微信" align="center" :formatter="formatThirdState"></el-table-column>
                <el-table-column prop="weiBoOpenId" label="绑定微博" align="center" :formatter="formatThirdState"></el-table-column>
                <el-table-column label="推荐" align="center">
                    <template slot-scope="scope" v-if="scope.row.isAuthorization==1">
                        <el-button size="small"  @click="addToRecommend(scope.row)">推荐</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!--分页-->
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" :background="true"  layout="prev, pager, next" :total="total" :current-page="pageRequest.nowPage">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import {formatDate} from "../common/formatDate.js";
    import {formatUrl} from "../common/formatUrl.js";
    import request from "../../api/user";
    export default {
        name: "PageUser",
        data(){
            return{
                total:0,
                userArr:[],
                multipleSelection: [],
                pageRequest:{
                    nowPage:1,
                    pageSize:10,
                    condition:{
                        staTime:'',
                        endTime:'',
                        isAuthorization:'',
                        userName:''
                    },
                    orderCondition:['createTime'],
                    desc:true
                }
            }
        },
        filters:{
            formatTime (time) {
                let date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            },
            formatUrl(url){
                if (url.indexOf("http:")==0){
                    return url;
                } else{
                    return formatUrl(url);
                }
            }
        },
        mounted(){
            this.loadData();
        },
        methods:{
            tableRowClassName({row, column, rowIndex, columnIndex}) {
                if (column.property=="state"){
                    switch (row.state){
                        case 0:
                            return  {  'color': '#1914fd' };
                        case 1:
                            return  {  'color': '#5abd12' }
                        case 2:
                            return  {  'color': '#fd6516' }
                        default:
                            return ''
                    }
                } else{
                    return '';
                }
            },
            addToRecommend(data){
                request.addRecommend(data.id).then(res=>{
                    if (res.data.code=='000000'){
                        this.$message.success("添加成功")
                    }else{
                        this.$message.warning(res.data.msg)
                    }
                })
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 分页导航
            handleCurrentChange(val) {
                this.pageRequest.nowPage=val;
                this.loadData();
            },
            //格式化日期
            formatDate(row,column) {
                let date = new Date(row.createTime)
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            },
            formatState(row,column){
                if (row.isAuthorization=="0"){
                    return "否"
                } else{
                    return "是"
                }
            },
            formatThirdState(row,column,cellValue,index){
                if (cellValue&&cellValue!=null){
                    return "是"
                } else{
                    return "否"
                }
            },
            loadData(){
                request.loadData(this.pageRequest).then(res=>{
                    if (res.data.code=="000000"){
                        this.userArr=res.data.data.list;
                        this.total=res.data.data.total
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .handle-box {
        margin-bottom: 20px;
    }
    .footer{
        height: 25px;
        margin-top: 15px;
        text-align: center;
    }
    .handle-select {
        width: 120px;
    }

    .handle-input {
        width: 300px;
        display: inline-block;
    }
    .del-dialog-cnt{
        font-size: 16px;
        text-align: center
    }
    .b-shadow {
        box-shadow: 0px 0px 10px #e1e2e5;
        overflow: auto;
        height: 658px;
    }
    .left {
        text-align: left;
    }
    .left .sourcetitle {
        padding: 20px;
        border-bottom: 1px solid #bbb;
    }
    .left .sourcetitle {
        position: relative;
    }
    .left .sourcetitle .type {
        position: absolute;
        right: 20px;
        bottom: 20px;
    }
    .left .sourcetitle .type span i {
        padding-left: 35px;
        font-size: 0.8rem;
    }
    .left .sourcetitle h3 {
        color: #444;
        font-size: 1.4rem;
        margin: 0px 0px 24px 0;
    }
    .left .sourcetitle span {
        font-size: 0.4rem;
        color: #bbb;
    }
    .left .sourcecontent {
        padding: 26px;
    }
    .left .sourcecontent img {
        margin-left: auto;
        margin-right: auto;
        display: block;
        width: 70%;
        height: auto;
        margin-bottom: 5px;
    }
    .left .sourcecontent .content p {
        line-height: 26px;
        font-size: 0.6rem;
        letter-spacing: 1px;
        text-indent: 35px;
        margin: 0px;
    }


    .b-shadow .operation span {
        border: 1px solid #ddd;
        padding: 9px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
    }
</style>
