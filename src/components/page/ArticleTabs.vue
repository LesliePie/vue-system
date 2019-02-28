<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 看法/心情列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--筛选框div-->
            <div class="handle-box">
                <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
                <el-cascader
                    expand-trigger="click"
                    :options="resourceTypeArr"
                    :props="props"
                    change-on-select
                    placeholder="圈子分类"
                    clearable
                    @change="handleChange">
                </el-cascader>
                <el-select v-model="pageRequest.condition.articleType" placeholder="类型" class="handle-select mr10">
                    <el-option  label="全部" value="" key=""></el-option>
                    <el-option  label="看法" value=1 key=0></el-option>
                    <el-option  label="提问" value=2 key=1></el-option>
                   <!-- <el-option  label="心情" value=3 key=2></el-option>-->
                </el-select>
               <!-- <el-select v-model="pageRequest.condition.typeGrandFather"  :onchange="getTypeParent()" placeholder="一级资源" class="handle-select mr10">
                    <el-option v-for="item in resourceTypeArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
                <el-select v-model="pageRequest.condition.typeFather"  placeholder="二级资源" class="handle-select mr10">
                    <el-option v-for="item in parentArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
                <el-select v-model="pageRequest.condition.typeChild" placeholder="三级资源" class="handle-select mr10">
                    <el-option v-for="item in childArr" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>-->
                <el-date-picker
                    v-model="pageRequest.condition.staTime"
                    type="datetime"
                    placeholder="开始时间"
                    align="right"
                    value-format="timestamp"
                    :picker-options="pickerOptions2">
                </el-date-picker>
                <span>-----</span>
                <el-date-picker
                    v-model="pageRequest.condition.endTime"
                    type="datetime"
                    placeholder="截止时间"
                    align="right"
                    value-format="timestamp"
                    :picker-options="pickerOptions2">
                </el-date-picker>
             <!--   <el-input v-model="select_word" placeholder="筛选关键词" class="handle-input mr10"></el-input>-->
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <span>共计{{total}}条</span>
            <el-table :data="articleArr" border style="width: 100%"   :cell-style="tableRowClassName" @selection-change="handleSelectionChange">
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="createTime" align="center" label="日期" :formatter="formatDate"  sortable width="150">
                </el-table-column>
                <el-table-column prop="articleType" label="类型" align="center" width="120" :formatter="formatType">
                </el-table-column>
                <el-table-column prop="title" label="标题" align="center">
                </el-table-column>
                <el-table-column prop="collectCount" label="收藏量" align="center" width="120">
                </el-table-column>
                <el-table-column prop="viewCount" label="查看量" align="center" width="120">
                </el-table-column>
                <el-table-column prop="commentCount" label="评论量" align="center" width="120">
                </el-table-column>
                <el-table-column label="操作" align="center" width="280">
                    <template v-if="scope.row.articleType!=3" slot-scope="scope">
                        <el-button size="small" @click="detail(scope.$index, scope.row)">查看</el-button>
                        <el-button size="small"  @click="addToRecommend(scope.row)">添加到推荐</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" :background="true"  layout="prev, pager, next" :total="total" :current-page="pageRequest.nowPage">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="详情" top="3vh" :visible.sync="dialogFormVisible">
            <div  class="b-shadow">
                <div  class="left">
                    <div  class="sourcetitle">
                        <h3 >{{article.title}}</h3>
                        <span >{{article.createTime |formatTime}}</span>
                        <div class="type">
                            <span ><i  class="el-icon-view">&nbsp;{{article.viewCount}}</i> <i  class="el-icon-star-on">&nbsp;{{article.collectCount}}</i></span>
                        </div>
                    </div>
                    <div  class="sourcecontent"><img  :src="this.article.titleImage |formatUrl" alt="">
                        <div class="content">
                            <p>{{article.content}}</p>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {formatDate} from "../common/formatDate.js";
    import {formatUrl} from "../common/formatUrl.js";
    import request from "../../api/circleArticle";
    import circle from '../../api/circle'
    export default {
        name: 'basetable',
        filters:{
            formatTime (time) {
                let date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            },
            formatUrl(url){
                return formatUrl(url);
            }
        },
        data() {
            return {
                pickerOptions2: {
                    shortcuts: [{
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    }, {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    }, {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }]
                },
                //文章数组列表
                articleArr:[],
                //圈子分类
                resourceTypeArr:[{
                    id:'',
                    name:'全部',
                    children:[]
                }
                ],
                parentArr:[],
                childArr:[],
                //分页请求
                pageRequest:{
                    nowPage:1,
                    pageSize:10,
                    orderCondition:[],
                    desc:true,
                    condition:{
                        circleId:'',
                        articleType:'',
                        staTime:'',
                        endTime:''
                    }
                },
                props:{
                    value:'id',
                    label:'name',
                    children:'children'
                },
                //总条数
                total:0,
                //查看文章框状态
                dialogFormVisible:false,
                article:{},
                multipleSelection: [],
                select_word: '',
                form: {
                    name: '',
                    date: '',
                    address: ''
                },
                idx: -1
            }
        },
        mounted() {
            this.getResourceType();
            this.getData();
        },
        methods: {
            //状态style
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
                if (data&&data.id){
                    request.addRecommend(data.id).then(res=>{
                        if (res.data.code=="000000"){
                            this.$message.success("添加成功");
                        } else{
                            this.$message.warning(res.data.msg);
                        }
                    })
                }
            },
            handleChange(value){
                this.pageRequest.condition.circleId='';
              if (value&&value.length>0){
                  this.pageRequest.condition.circleId=value[value.length-1]
              }
            },
            //获取圈子列表
            getResourceType(){
                circle.loadData().then(res=>{
                    if (res.data.result='00000000'){
                        let result=res.data.data;
                        if (result&&result.length>0){
                            this.resourceTypeArr=this.resourceTypeArr.concat(result)
                        }
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            },
            // 分页导航
            handleCurrentChange(val) {
                this.pageRequest.nowPage=val;
                this.getData();
            },
            //格式化类型
            formatType(row){
                if (row.articleType==1){
                    return "看法"
                }else if (row.articleType==2){
                    return "提问"
                } else if (row.articleType==3) {
                    return "心情"
                }else {
                    return "未知";
                }
            },
            //格式化日期
            formatDate(row,column) {
                let date = new Date(row.createTime)
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            },
            // 获取数据
            getData() {
               request.loadData(this.pageRequest).then(res=>{
                   if (res.data.code="000000"){
                       this.articleArr=res.data.data.list;
                       this.total=res.data.data.total;
                   } else if (res.data.code="999999"){
                       this.$router.push('/login')
                   } else {
                       this.$message.warning(res.data.msg)
                   }
               }).catch(error=>{
                   if (error.response){
                       this.$message.warning(error.response.msg);
                   }else{
                       this.$message.warning("网络错误");
                   }
               })
            },
            search(){
                //时间判断
                if (this.pageRequest.condition.staTime&&this.pageRequest.condition.endTime){
                    if (this.pageRequest.condition.staTime>this.pageRequest.condition.endTime){
                        this.$message.warning("开始时间不能大于结束时间");
                        return;
                    }
                }
                this.pageRequest.nowPage=1
               this.getData();
            },
            //资源详情
            detail(index, row) {
                this.dialogFormVisible=true;
                this.article=row;
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
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
