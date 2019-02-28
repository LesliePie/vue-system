<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i> 消息通知</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div>
                <el-button type="primary" @click="addNotify()">添加</el-button>
            </div>
            <el-tabs :v-model="1" @tab-click="tabClick">
                <el-tab-pane :key="item.state" v-for="(item,index) in this.tabs" :label="item.name" :name="item.state.toString()" >
                    <el-table :data="item.children"  style="width: 100%">
                        <!--数据-->
                        <el-table-column  type="index" align="center"></el-table-column>
                        <el-table-column prop="title" align="center" label="消息标题"></el-table-column>
                        <el-table-column prop="content" align="center" label="消息内容"></el-table-column>
                        <el-table-column prop="createTime" align="center" label="创建时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime|formatDate}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createUser" align="center" label="创建人"></el-table-column>
                        <el-table-column v-if="index==0" label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button size="small" @click="updateMessage(scope.row)">发布</el-button>
                                <el-button size="small" @click="deleteMessage(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column width="120">
                             <template slot-scope="scope">
                                 <el-button size="small" @click="handleRead(scope.name)">标为已读</el-button>
                             </template>
                         </el-table-column>-->
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <!--弹出框消息-->
        <el-dialog title="添加通知" :visible.sync="dialogFormVisible">
            <el-input
                type="textarea"
                :rows="1"
                placeholder="请输入标题"
                v-model="title">
            </el-input>
            <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入内容"
                v-model="formData">
            </el-input>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="submitMessage(1)">发布</el-button>
                    <el-button type="primary" @click="submitMessage(0)">保存</el-button>
                    <el-button  @click="cancel()">取消</el-button>
                  </span>
        </el-dialog>
       <!-- <el-dialog title="编辑消息" :visible.sync="dialogFormVisible">
            <el-form :model="formData" :rules="rules" ref="formData">
                <el-form-item label="消息内容" :label-width="formLabelWidth"
                              @keyup.enter.native="submitForm('formData')" prop="name">
                    <el-input v-model="formData.name" placeholder="圈子名"></el-input>
                </el-form-item>
            </el-form>
        </el-dialog>-->
    </div>
</template>

<script>
    import request from '../../api/notify'
    import {formatDate} from "../common/formatDate.js";
    export default {
        name: "NotifyTabs",
        filters:{
            formatDate (time) {
                let date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            }
        },
        data(){
            return {
                dialogFormVisible:false,
                formData:"",
                title:'',
                tabs:[
                    {
                        state:0,
                        name:'待发布',
                        children:[]
                    },
                    {
                        state:1,
                        name:'已发布',
                        children:[]
                    }
                ],
                pageRequest:{
                    nowPage:1,
                    pageSize:10,
                    condition:{
                        state:"0"
                    }
                }
            }
        },
        methods:{
            getData(){
                request.loadData(this.pageRequest).then(res=>{
                   if (res.data.code="000000"){
                       let arr=res.data.data.list;
                       if (this.pageRequest.condition.state=="0"){
                           this.tabs[0].children=arr;
                       } else{
                           this.tabs[1].children=arr;
                       }
                   }
                })
            },
            cancel(){
                this.dialogFormVisible=false;
                this.formData="";
            },
            updateMessage(data){
                request.submit({
                    id:data.id,
                    state:1
                }).then(res=>{
                    if (res.data.code="000000"){
                        const children=this.tabs[0].children;
                        const i = children.findIndex(d => d.id === data.id);
                        if (children&&i){
                            children.splice(i, 1);
                            this.$message({
                                type: 'success',
                                message: '发布成功!'
                            });
                        }
                    } else{
                        this.$message({
                            type:'warning',
                            message:res.msg
                        });
                    }
                })
            },
            deleteMessage(data){
                this.$confirm('此操作将删除该圈子, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(request.submit({
                    id:data.id,
                    state:9
                }).then(res=>{
                    if (res.data.code="000000"){
                        const children=this.tabs[0].children;
                        const i = children.findIndex(d => d.id === data.id);
                        if (children&&i){
                            children.splice(i, 1);
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                        }
                    } else{
                        this.$message({
                            type:'warning',
                            message:res.msg
                        });
                    }
                })).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            submitMessage(data){
                if (this.formData&&this.title){
                    request.submit({
                        content:this.formData,
                        title:this.title,
                        notifyType:1,
                        state:data
                    }).then(res=>{
                        if (res.data.code=="000000"){
                            this.$message({
                                type: 'success',
                                message: '发布成功!'
                            });
                            this.formData="";
                            this.dialogFormVisible=false;
                        }
                    })
                } else{
                    this.$message({
                        type:'warning',
                        message:'内容,标题不能为空'
                    });
                }

            },
            tabClick(data){
              this.pageRequest.condition.state=data.name;
              this.getData();
            },
            addNotify(){
                this.formData="";
                this.dialogFormVisible=true;
            }
        },
        mounted(){
          this.getData();
        },
    }
</script>

<style scoped>
    .message-title{
        cursor: pointer;
    }
    .handle-row{
        margin-top: 30px;
    }
    .pre-img{
        width: 100px;
        height: 100px;
        background: #f8f8f8;
        border: 1px solid #eee;
        border-radius: 5px;
    }
    .crop-demo-btn{
        position: relative;
        width: 100px;
        height: 40px;
        line-height: 40px;
        padding: 0 20px;
        margin-left: 30px;
        background-color: #409eff;
        color: #fff;
        font-size: 14px;
        border-radius: 4px;
        box-sizing: border-box;
    }
    .crop-input{
        position: absolute;
        width: 100px;
        height: 40px;
        left: 0;
        top: 0;
        opacity: 0;
        cursor: pointer;
    }

    .crop-demo{
        display: flex;
        align-items: flex-end;
    }
</style>
