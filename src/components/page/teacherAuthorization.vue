<template>
    <div class="table">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-tickets"></i> 名师审核列表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>

        <div class="container">
            <!--筛选框-->
            <div class="handle-box">
                <!--<el-button type="primary" icon="delete" class="handle-del mr10" @click="delAll">批量删除</el-button>-->
                <span>主要领域分类:</span>
                <el-select v-model="pageRequest.condition.domain" placeholder="领域分类" class="handle-select mr10">
                    <el-option label="全部" value="" key=""></el-option>
                    <el-option
                        v-for="item in domainSel"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
                <span>审核状态:</span>
                <el-select v-model="pageRequest.condition.state"placeholder="审核状态" class="handle-select mr10">
                    <el-option  label="全部" value="" key=""></el-option>
                    <el-option  label="未审核" value=0 key=0></el-option>
                    <el-option  label="已审核" value=1 key=1></el-option>
                    <el-option  label="未通过" value=2 key=2></el-option>
                </el-select>
                <span>城市:</span>
                <el-select v-model="pageRequest.condition.city" placeholder="城市" class="handle-select mr10">
                    <el-option label="全部" value="" key=""></el-option>
                    <el-option
                        v-for="item in cityArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id" >
                    </el-option>
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
                <el-button type="primary" icon="search" @click="search">搜索</el-button>
            </div>
            <span>共计{{total}}条</span>
            <el-table :data="data" border style="width: 100%"   :cell-style="tableRowClassName" @selection-change="handleSelectionChange">
                <el-table-column type="index" label="序号" align="center"></el-table-column>
                <el-table-column prop="createTime" align="center" label="申请日期" :formatter="formatDate"  sortable width="150">
                </el-table-column>
                <el-table-column prop="domainString" label="主要领域" align="center" width="120">
                </el-table-column>
                <el-table-column prop="realName" label="真实姓名" align="center">
                </el-table-column>
                <el-table-column prop="idCardNo" label="证件号码" align="center">
                </el-table-column>
                <el-table-column prop="checkedUserName" label="审查人" align="center" width="120">
                </el-table-column>
                <el-table-column prop="state" label="状态" align="center" :formatter="formatState" width="120">
                </el-table-column>
                <el-table-column label="操作" align="center" width="180">
                    <template slot-scope="scope">
                        <el-button size="small" @click="detail(scope.$index, scope.row)">查看</el-button>
                        <el-button size="small" @click="userMessage(scope.$index, scope.row)">用户信息</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" layout="prev, pager, next" :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog title="用户详情"  width="20%"  :visible.sync="userDialogForm">
            <div >
                <el-form :model="userData" label-position="center" label-width="120px">
                    <el-form-item label="头像:">
                        <div>
                            <img style="width: 19%" :src="userData.headImg |formatUrl" alt=""/>
                        </div>
                    </el-form-item>
                    <el-form-item label="用户名:">
                        <span>{{userData.name}}</span>
                    </el-form-item>
                    <el-form-item label="邮箱:">
                        <span>{{userData.email}}</span>
                    </el-form-item>
                    <el-form-item label="手机号:">
                        <span>{{userData.phone}}</span>
                    </el-form-item>
                    <el-form-item label="生日:">
                        <span>{{userData.birthday}}</span>
                    </el-form-item>
                    <el-form-item label="注册时间:">
                        <span>{{userData.createTime |formatTime}}</span>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <el-dialog title="详情" :visible.sync="dialogForm">
            <el-dialog :title="title" :visible.sync="resultVisible" append-to-body>
                <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="authorizationApply.checkResult">
                </el-input>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submit(2)">提交</el-button>
                    <el-button  @click="cancel()">取消</el-button>
                  </span>
            </el-dialog>
            <div  class="b-shadow">
                <el-form  :model="authorizationApply" label-position="center" label-width="80px">
                    <el-form-item label="真实姓名">
                        <span>{{authorizationApply.realName}}</span>
                    </el-form-item>
                    <el-form-item label="申请时间">
                        <span>{{authorizationApply.createTime |formatTime}}</span>
                    </el-form-item>
                    <el-form-item label="主要领域">
                        <span>{{authorizationApply.domainString}}</span>
                    </el-form-item>
                    <el-form-item label="证件号码">
                        <span>{{authorizationApply.idCardNo}}</span>
                    </el-form-item>
                    <el-form-item label="证件照片" >
                        <el-row>
                            <el-col :span="8">
                                <el-card :body-style="{ padding: '0px' }">
                                    <div style="padding: 14px;">
                                        <span>证件正面图</span>
                                    </div>
                                    <img :src="authorizationApply.idCardFrontImg |formatUrl" class="image">
                                </el-card>
                            </el-col>
                            <el-col :span="8" style="margin-left:20px">
                                <el-card :body-style="{ padding: '0px' }">
                                    <div style="padding: 14px;">
                                        <span>证件背面图</span>
                                    </div>
                                    <img :src="authorizationApply.idCardBackImg |formatUrl" class="image">
                                </el-card>
                            </el-col>
                        </el-row>
                    </el-form-item>
                    <el-form-item label="其他信息">
                        <el-row>
                            <el-col :span="8" v-for="(item, index) in authorizationApply.otherImages" :key="item">
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
            <div class="footer">
                <el-button align="center" v-if="this.authorizationApply.state==0" @click="pass()" type="primary">通过</el-button>
                <el-button align="center" v-if="this.authorizationApply.state==0"   @click="refuse()" type="primary">未通过</el-button>
                <el-button align="center"  v-else-if="this.authorizationApply.state==1" type="success" disabled>已审核</el-button>
                <el-button align="center" v-else="this.authorizationApply.state==2"  type="danger" disabled>未通过</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {formatDate} from "../common/formatDate.js";
    import {formatUrl} from "../common/formatUrl.js";
    import request from "../../api/teacher";
    import dictionary from "../../api/ditionary"
    import userApi from "../../api/user"
    export default {
        name: "teacherAuthorization",
        data(){
            return{
                pageRequest:{
                    nowPage:1,
                    pageSize:10,
                    orderCondition:[],
                    desc:true,
                    condition:{
                        state:'',
                        createTime:'',
                        domain:'',
                        city:'',
                    }
                },
                resultVisible:false,
                authorizationApply:{},
                multipleSelection: [],
                checkResult:'',
                title:"",
                state:0,
                data:[],
                total:0,
                dialogForm:false,
                userData:{},
                userDialogForm:false,
                domainSel:[],
                cityArr:[]
            };
        },
        mounted(){
            this.getDomain();
            this.getCity();
          this.getData();
        },
        filters:{
            formatTime (time) {
                let date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            },
            formatUrl(url){
                if (url&&url.indexOf("http:")==0){
                    return url;
                } else{
                    return formatUrl(url);
                }
            }
        },
        methods:{
            //格式化状态
            formatState(row){
                switch (row.state){
                    case 0:
                        return "待审核";
                    case 1:
                        return "已审核";
                    case 2:
                        return "未通过";
                    default:
                        return "其他";
                }
            },
            getDomain(){
                dictionary.pageByParentId({
                    condition: {parentId: 6},
                    nowPage: 1,
                    pageSize: 20
                }).then(res=>{
                    if (res.data.result=="00000000"){
                        this.domainSel=res.data.data.list;
                    }
                })
            },
            getCity(){
                dictionary.pageByParentId({
                    condition: {parentId: 102},
                    nowPage: 1,
                    pageSize: 20
                }).then(res=>{
                    if (res.data.result=="00000000"){
                        this.cityArr=res.data.data.list;
                    }
                })
            },
            search(){
              this.getData();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            //格式化日期
            formatDate(row,column) {
                let date = new Date(row.createTime);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            },
            //用户信息
            userMessage(index,row){
                if (!row.hasOwnProperty("userMessage")) {
                    userApi.getUser(row.userId).then(res=>{
                        if (res.data.code=='000000'&&res.data.data){
                            row.userMessage=res.data.data;
                            this.userData=res.data.data;
                            this.userDialogForm=true;
                        } else{
                            this.$message.warning(res.data.msg)
                        }
                    })
                }else{
                    this.userData=row.userMessage;
                    this.userDialogForm=true;
                }



            },
            detail(index,row){
                this.authorizationApply=row;
                request.detail(row.id).then(res=>{
                    if (res.data.code=="000000"){
                        this.authorizationApply.otherImages=res.data.data.otherImages
                    }else{
                        this.$message.error(res.data.msg);
                    }
                });
                this.dialogForm=true
            },
            //获取数据
            getData(){
                request.loadData(this.pageRequest).then(res=>{
                    if (res.data.code=="000000"){
                        this.data=res.data.data.list
                        this.total=res.data.data.total;
                    } else{
                        this.$message.error(res.data.msg);
                    }
                })
            },
            pass(){
                this.resultVisible=true;
                this.title="用户成就"
                this.state=1;
            },
            update(){
                request.update({
                    id:this.authorizationApply.id,
                    state:this.state,
                    checkResult:this.authorizationApply.checkResult,
                    achievement:this.authorizationApply.checkResult,
                }).then(res=>{
                    if (res.data.code=="000000"){
                        this.authorizationApply.state=this.state;
                        this.dialogForm=false;
                        this.resultVisible=false;
                    }else if (res.data.code="999999"){
                        this.$router.push('/login')
                    }else{
                        this.$message.error(res.data.msg)
                    }
                }).catch(error => {
                    this.$message.error(error.response);
                })
            },
            refuse(){
                this.resultVisible=true;
                this.title="不通过原因"
                this.state=2;
            },
            //取消不通过审核
            cancel(){
                this.resultVisible=false;
                this.title="";
                this.state=0;
                this.authorizationApply.checkResult="";
            },
            //提交
            submit(){
                this.update();
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
            // 分页导航
            handleCurrentChange(val) {
                this.pageRequest.nowPage=val;
                this.getData();
            },
        }
    }
</script>

<style scoped>
    .b-shadow {
        box-shadow: 0px 0px 10px #e1e2e5;
        overflow: auto;
        height: 600px;
    }
    .footer{
        height: 25px;
        margin-top: 15px;
        text-align: center;
    }
    .image {
        width: 100%;
        display: block;
    }
</style>
