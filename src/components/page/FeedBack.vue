<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i>用户反馈列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <!--筛选框-->
            <div class="handle-box">
                <span>反馈类型:</span>
                <el-select v-model="pageRequest.condition.type" placeholder="反馈类型" class="handle-select mr10">
                    <el-option label="全部" value="" key=""></el-option>
                    <el-option
                        v-for="item in typeData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
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
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
                </div>
            <span>共计{{total}}条</span>
            <el-table :data="feedbackData" border style="width: 100%"   :cell-style="tableRowClassName" @selection-change="handleSelectionChange">
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="createTime" align="center" label="提交日期" :formatter="formatDate" sortable width="150px"></el-table-column>
                <el-table-column prop="type" align="center" label="反馈类型" sortable width="150px" :formatter="formateType"></el-table-column>
                <el-table-column prop="userName" align="center" label="用户名"></el-table-column>
                <el-table-column prop="description" align="center" label="反馈内容" width="150px" :formatter="formatContent"></el-table-column>
                <el-table-column prop="resolve" align="center" label="改进建议" :formatter="formatContent"></el-table-column>
                <el-table-column align="center" label="用户头像">
                    <template slot-scope="scope">
                        <img style="width: 5%" :src="scope.row.userHeadImg |formatUrl" alt=""/>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="detail(scope.$index, scope.row)">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="详情" width="30%" :visible.sync="dialogForm">
            <div  class="b-shadow">
                <el-form  :model="feedback" label-position="center" label-width="130px">
                    <el-form-item label="用户名">
                        <span>{{feedback.userName}}</span>
                    </el-form-item>
                    <el-form-item label="用户头像">
                        <template slot-scope="scope">
                            <img style="width: 5%" :src="feedback.userHeadImg |formatUrl" alt=""/>
                        </template>
                    </el-form-item>
                    <el-form-item label="提交时间">
                        <span>{{feedback.createTime |formatTime}}</span>
                    </el-form-item>
                    <el-form-item label="反馈类型">
                        <span>{{feedback.typeName}}</span>
                    </el-form-item>
                    <el-form-item label="反馈内容">
                        <span>{{feedback.description}}</span>
                    </el-form-item>
                    <el-form-item label="改进意见">
                        <span>{{feedback.resolve}}</span>
                    </el-form-item>
                    <el-form-item label="截图信息" v-if="feedback.imgArr&&feedback.imgArr.length>0">
                        <el-row>
                            <el-col :span="8" v-for="(item, index) in feedback.imgArr" :key="item">
                                <el-card :body-style="{ padding: '0px' }">
                                    <div style="padding: 14px;">
                                        <span>{{index+1}}</span>
                                    </div>
                                    <img :src="item|formatUrl" class="image">
                                </el-card>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {formatDate} from "../common/formatDate.js";
    import {formatUrl} from "../common/formatUrl.js";
    import request from "../../api/feedback";
    import dictionary from "../../api/ditionary"
    export default {
        name: "FeedBack",
        data(){
            return{
                //总共条数
                total:0,
                //数据
                feedbackData:[],
                typeData:[],
                feedback:{},
                multipleSelection: [],
                dialogForm:false,
                pageRequest:{
                    nowPage:1,
                    pageSize:10,
                    condition:{
                        type:'',
                        staTime:null,
                        endTime:null
                    }
                },
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
                value5: ''
            }
        },
        filters:{
            formatUrl(url){
                if (url){
                    if (url.indexOf("http:")==0||url.indexOf("https:")==0){
                        return url;
                    } else{
                        return formatUrl(url);
                    }
                }else{
                    return;
                }
            },
            formatTime (time) {
                let date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            }
        },
        methods:{
            //格式化日期
            formatDate(row,column,cellValue,index) {
                let date = new Date(cellValue);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            },
            formateType(row,column,cellValue,index){
                if (this.typeData&&this.typeData.length>0){
                    for (let i=0;i<this.typeData.length;i++){
                        if (cellValue==this.typeData[i].id){
                            return this.typeData[i].name;
                        }
                    }
                }else{
                    return '未知';
                }
            },
            detail(index,row){
              this.feedback=row;
                this.feedback.typeName=this.formateType(row,null,row.type,null);
              this.dialogForm=true;
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
                this.loadData();
            },
            formatContent(row,column,cellValue,index){
                if (cellValue&&cellValue.length>10){
                    let content=cellValue.substring(0,9)+"...";
                    return content;
                } else{
                    return cellValue;
                }
            },
            //获取数据
            loadData(){
                request.getData(this.pageRequest).then(res=>{
                    if (res.data.code=="000000"){
                        this.feedbackData=res.data.data.list;
                        this.total=res.data.data.total;
                    } else{
                        this.$message.warning(res.data.msg);
                    }
                })
            },
            getTypeData(){
              dictionary.pageByParentId({
                  condition: {parentId: 197},
                  nowPage: 1,
                  pageSize: 20
              }).then(res=>{
                  if (res.data.result=="00000000"){
                      this.typeData=res.data.data.list;
                  }else{
                      this.$message.warning(res.data.msg)
                  }
              })
            },
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
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            // 分页导航
            handleCurrentChange(val) {
                this.pageRequest.nowPage=val;
                this.loadData();
            },
        },
        mounted(){
            this.getTypeData();
            this.loadData();
        }

    }
</script>

<style scoped>

</style>
