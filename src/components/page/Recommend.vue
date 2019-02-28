<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i> 推荐管理</el-breadcrumb-item>
                <el-button @click="flushData()">刷新数据</el-button>
            </el-breadcrumb>
        </div>
        <div class="container">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <!--提问，看法-->
                <el-tab-pane  label="提问/看法" name="article">
                    <el-table :data="result.article"  style="width: 100%">
                        <!--数据-->
                        <el-table-column  type="index" align="center"></el-table-column>
                        <el-table-column   align="center" label="日期">
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime|formatDate}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column  align="center" label="标题">
                            <template slot-scope="scope">
                                <span>{{scope.row.title|formatTitle}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="collectCount" align="center" label="收藏量"></el-table-column>
                        <el-table-column prop="viewCount" align="center" label="查看量"></el-table-column>
                        <el-table-column prop="commentCount" align="center" label="评论量"></el-table-column>
                        <el-table-column prop="articleType" align="center" label="类型">
                            <template slot-scope="scope">
                                <span>{{scope.row.articleType|formatType}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button size="small" @click="sort(scope.row,'article')">排序</el-button>
                                <el-button size="small" @click="remove(scope.row,'article')">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!--圈子-->
                <el-tab-pane label="圈子" name="circle">
                    <el-table :data="result.circle"  style="width: 100%">
                        <!--数据-->
                        <el-table-column  type="index" align="center"></el-table-column>
                        <el-table-column prop="name"  align="center" label="圈子名"></el-table-column>
                        <el-table-column prop="description" align="center" label="圈子描述"></el-table-column>
                        <el-table-column   label="圈子图标" align="center">
                            <template slot-scope="scope">
                                <img style="width: 10%" :src="scope.row.circleImg |formatUrl" alt=""/>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button size="small" @click="sort(scope.row,'circle')">排序</el-button>
                                <el-button size="small" @click="remove(scope.row,'circle')">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!--名师-->
                <el-tab-pane label="名师" name="user">
                    <el-table :data="result.user"  style="width: 100%">
                        <el-table-column type="index" label="序号" align="center"></el-table-column>
                        <el-table-column prop="name" label="昵称" align="center"></el-table-column>
                        <el-table-column label="头像" align="center">
                            <template slot-scope="scope">
                                <img style="width: 19%" :src="scope.row.headImg |formatHeadUrl" alt=""/>
                            </template>
                        </el-table-column>
                        <el-table-column prop="school" label="学校" align="center"></el-table-column>
                        <el-table-column prop="resourceCount" label="资源量" align="center"></el-table-column>
                        <el-table-column prop="followers" label="粉丝数量" align="center"></el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button size="small" @click="sort(scope.row,'user')">排序</el-button>
                                <el-button size="small" @click="remove(scope.row,'user')">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </div>
        <el-dialog title="修改排序" :visible.sync="dialogFormVisible">
            <el-input
                type="number"
                :rows="1"
                placeholder="请输入顺序"
                v-model="formData.order">
            </el-input>
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="updateOrder()">确定</el-button>
                    <el-button  @click="cancel()">取消</el-button>
                  </span>
        </el-dialog>
    </div>

</template>

<script>
    import request from '../../api/recommend'
    import {formatUrl} from "../common/formatUrl.js";
    import {formatDate} from "../common/formatDate.js";
    import VueCropper  from 'vue-cropperjs';
    export default {
        name: 'tabs',
        data() {
            return {
                formLabelWidth: '120px',
                //显示弹出框
                dialogFormVisible:false,
                //所有分类
                result:{
                    article:[],
                    user:[],
                    circle:[]
                },
                activeName:'article',
                requestData:{
                  nowPage: 1,
                  pageSize:10,
                  condition:{

                  }
                },
                formData:{
                    type:'',
                    order:'',
                    id:''
                },
                showHeader: false
            }
        },
        mounted(){
           this.getTabs();
        },
        filters:{
            formatDate (time) {
                let date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
            },
            formatUrl(url){
                return formatUrl(url);
            },
            formatTitle(data){
                if (data&&data.length>10){
                    return data.substring(0,10)+"..."
                }else{
                    return data;
                }
            },
            formatHeadUrl(url){
                if (url.indexOf("http:")==0){
                    return url;
                } else{
                    return formatUrl(url);
                }
            },
            //格式化类型
            formatType(data){
                if (data=='1'){
                    return "看法"
                }else if (data=='2'){
                    return "提问"
                } else if (data=='3') {
                    return "心情"
                }else {
                    return "未知";
                }
            },
        },
        methods: {
            cancel(){
              this.formData.order='';
              this.formData.id='';
              this.formData.type='';
                this.dialogFormVisible=false;
            },
            flushData(){
                this.getTabs('user');
                this.getTabs('circle');
                this.getTabs('articles')
            },
            sort(data,type){
                this.formData.type=type;
                request.getOrder({
                    id: data.id,
                    type: type
                }).then(res=>{
                    if (res.data.code=="000000"){
                        this.formData.id=res.data.data.id;
                        this.formData.order=res.data.data.orderNum;
                        console.log(this.formData)
                        this.dialogFormVisible=true;
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                })
                //获取他的当前排序

            },
            getTabs(data){
                if (data&&data=='circle'){
                    request.getCircles(this.requestData).then(res=>{
                        if (res.data.result=='00000000'){
                            let result=res.data.data;
                            if (result&&result.list.length>0){
                                this.result.circle=result.list;
                            }
                        }else {
                            this.$message.error(res.data.msg);
                        }
                    })
                } else if (data&&data=='user'){
                    request.getUsers(this.requestData).then(res=>{
                        if (res.data.result=='00000000'){
                            let result=res.data.data;
                            if (result&&result.list.length>0){
                                this.result.user=result.list;
                            }
                        }else {
                            this.$message.error(res.data.msg);
                        }
                    })
                }else {
                    request.getArticles(this.requestData).then(res=>{
                        if (res.data.result='00000000'){
                            let result=res.data.data;
                            if (result&&result.list.length>0){
                                this.result.article=result.list;
                            }
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
                }

            },
            updateOrder(){
                request.update({
                    id:this.formData.id,
                    order:this.formData.order
                }).then(res=>{
                    if (res.data.code="000000") {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                        this.dialogFormVisible=false;
                        this.getTabs(this.formData.type);
                    }
                })
            },
            handleClick(tab,event){
                if (tab.name=='circle'){
                    if (!this.result.circle||this.result.circle.length==0){
                        this.getTabs(tab.name)
                    }
                }else if (tab.name=='user'){
                    if (!this.result.user||this.result.user.length==0){
                        this.getTabs(tab.name)
                    }
                } else{
                    if (!this.result.article||this.result.article.length==0){
                        this.getTabs(tab.name)
                    }
                }

            },
            remove(data,type){
                this.$confirm('此操作将删除该推荐, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(request.delete({
                    id:data.id,
                    type:type
                }).then(res=>{
                    if (res.data.code="000000"){
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getTabs(type);
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
        }
    }

</script>

<style>
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

