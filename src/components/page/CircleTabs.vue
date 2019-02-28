<template>
    <div class="">
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-message"></i> 圈子管理</el-breadcrumb-item>
            </el-breadcrumb>

        </div>
        <div class="container">
            <div>
                <el-button type="primary" @click="addCircle()">添加</el-button>
            </div>
            <el-tabs v-model="activeId">
                <el-tab-pane :key="item.id"  v-for="(item,index) in this.tables" :label="item.name" :name="item.id.toString()">
                    <el-table :data="item.children"  style="width: 100%">
                        <!--数据-->
                        <el-table-column  type="index" align="center"></el-table-column>
                        <el-table-column prop="name"  align="center" label="圈子名"></el-table-column>
                        <el-table-column prop="description" align="center" label="圈子描述"></el-table-column>
                        <el-table-column prop="createTime" align="center" label="圈子创建时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime|formatDate}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createUserName" align="center" label="圈子创建人"></el-table-column>
                        <el-table-column prop="updateTime" align="center" label="圈子修改时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.updateTime|formatDate}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="updateUserName" align="center" label="圈子修改人"></el-table-column>
                        <el-table-column   label="圈子图标" align="center">
                            <template slot-scope="scope">
                                <img style="width: 10%" :src="scope.row.circleImg |formatUrl" alt=""/>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.row)">编辑</el-button>
                                <el-button size="small" @click="deleteCircle(scope.row,index)">删除</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column label="推荐" align="center">
                            <template slot-scope="scope">
                                <el-button size="small" @click="addToRecommend(scope.row)">推荐</el-button>
                            </template>
                        </el-table-column>
                       <!-- <el-table-column width="120">
                            <template slot-scope="scope">
                                <el-button size="small" @click="handleRead(scope.name)">标为已读</el-button>
                            </template>
                        </el-table-column>-->
                    </el-table>
                </el-tab-pane>
               <!-- <el-tab-pane :label="`已读消息(${read.length})`" name="second">
                    <template v-if="message === 'second'">
                        <el-table :data="read" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">删除全部</el-button>
                        </div>
                    </template>
                </el-tab-pane>
                <el-tab-pane :label="`回收站(${recycle.length})`" name="third">
                    <template v-if="message === 'third'">
                        <el-table :data="recycle" :show-header="false" style="width: 100%">
                            <el-table-column>
                                <template slot-scope="scope">
                                    <span class="message-title">{{scope.row.title}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="date" width="150"></el-table-column>
                            <el-table-column width="120">
                                <template slot-scope="scope">
                                    <el-button @click="handleRestore(scope.$index)">还原</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="handle-row">
                            <el-button type="danger">清空回收站</el-button>
                        </div>
                    </template>
                </el-tab-pane>-->
            </el-tabs>

        </div>
        <el-dialog title="编辑圈子" :visible.sync="dialogFormVisible"  >
            <el-form :model="formData" :rules="rules" ref="formData">
                <el-form-item label="圈子名" :label-width="formLabelWidth"
                              @keyup.enter.native="submitForm('formData')" prop="name">
                    <el-input v-model="formData.name" placeholder="圈子名"></el-input>
                </el-form-item>
                <el-form-item label="所属类型" :label-width="formLabelWidth"
                              @keyup.enter.native="submitForm('formData')" prop="parentType">
                    <el-select v-model="formData.parentType" placeholder="所属类型">
                        <el-option v-for="item in tables" :key="item.id" :label="item.name"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="圈子描述" :label-width="formLabelWidth"
                              @keyup.enter.native="submitForm('formData')" prop="description">
                    <el-input v-model="formData.description" placeholder="圈子描述"></el-input>
                </el-form-item>
                <el-form-item label="圈子图标" prop="file" :label-width="formLabelWidth">
                    <div class="crop-demo">
                        <img :src="cropImg" v-model="formData.circleImg" v-if="cropImg" class="pre-img">
                        <div class="crop-demo-btn">选择图片
                            <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="创建时间"  v-if="formData.createTime" :label-width="formLabelWidth">
                    <span>{{formData.createTime | formatDate}}</span>
                </el-form-item>
                <el-form-item label="创建人"  v-if="formData.createUserName" :label-width="formLabelWidth">
                    <span>{{formData.createUserName}}</span>
                </el-form-item>
                <el-form-item label="修改时间" v-if="formData.updateTime" :label-width="formLabelWidth" >
                    <span>{{formData.updateTime | formatDate}}</span>
                </el-form-item>
                <el-form-item label="修改人"  v-if="formData.updateUserName" :label-width="formLabelWidth" >
                    <span>{{formData.updateUserName}}</span>
                </el-form-item>
            </el-form>
            <div slot="footer"  class="dialog-footer">
                <el-button @click="cancelEdit()">取 消</el-button>
                <el-button type="primary" @click="submitForm('formData')">确 定</el-button>
            </div>
        </el-dialog>
        <!--裁剪图片弹出框-->
        <el-dialog title="裁剪图片" :visible.sync="dialogVisible" width="30%">
            <vue-cropper ref='cropper' :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage" style="width:100%;height:300px;"></vue-cropper>
            <span slot="footer" class="dialog-footer">
                    <el-button @click="cancelCrop">取 消</el-button>
                    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                </span>
        </el-dialog>
    </div>

</template>

<script>
    import request from '../../api/circle'
    import {formatUrl} from "../common/formatUrl.js";
    import {formatDate} from "../common/formatDate.js";
    import VueCropper  from 'vue-cropperjs';
    export default {
        name: 'tabs',
        data() {
            return {
                formLabelWidth: '120px',
                //未启用用
                activeDic:"0",
                //启用
                inactiveDic:"1",
                //显示弹出框
                dialogFormVisible:false,
                activeId:"99",
                imgSrc: '',
                cropImg:'',
                dialogVisible: false,
                //所有分类
                tables:[],
                //当前对象
                formData:{
                    id:'',
                    name:'',
                    state:1,
                    description:"",
                    parentType:99,
                    createTime:null,
                    updateTime:null,
                    createUserName:'',
                    updateUserName:'',
                    file:'',
                    circleImg:'',
                    fix:null,
                },
                rules:{
                    name:[
                        { required: true, message: '请输入字典名称', trigger: ['blur','change'] },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: ['blur','change'] }
                    ],
                    description:[
                        { required: true, message: '请输入圈子描述', trigger: ['blur','change'] },
                    ]
                },
                activeData:[],
                message: 'first',
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
            }
        },
        methods: {
            deleteCircle(data,index){
                console.log("index",index);
                this.$confirm('此操作将删除该圈子, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(request.delete(data.id).then(res=>{
                    if (res.data.code="000000"){
                        const children=this.tables[index].children;
                        const i = children.findIndex(d => d.id === data.id);
                        children.splice(i, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }else {
                        this.$message.warning(res.data.msg);
                    }
                })).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
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
            submitForm(data){
                this.$refs[data].validate((valid)=>{
                    if (valid){
                        let fileData=new FormData();
                        fileData.append("id",this.formData.id);
                        fileData.append("name",this.formData.name);
                        fileData.append("description",this.formData.description);
                        fileData.append("file",this.formData.file);
                        fileData.append("parentType",this.formData.parentType.valueOf());
                        request.saveOrUpdate(fileData).then(res=>{
                            if (res.data.code="000000") {
                                //关闭弹窗
                                this.dialogFormVisible=false;
                                this.cropImg=null;
                                let resData=res.data.data
                                if (this.formData.id!=''){
                                    this.formData.circleImg=resData.circleImg;
                                    this.formData.updateUserName=resData.updateUserName;
                                    this.formData.updateTime=resData.updateTime;
                                }else{
                                    for (let i=0;i<this.tables.length;i++){
                                        if (resData.parentType==this.tables[i].id){
                                            this.tables[i].children.push(resData);
                                        }
                                    }
                                }
                            }else{
                                this.$message.warning(res.data.msg);
                            }
                        })
                    }
                });
            },
            setImage(e){
                const file = e.target.files[0];
                if (!file.type.includes('image/')) {
                    return;
                }
                this.formData.file=file;
                const reader = new FileReader();
                reader.onload = (event) => {
                    this.dialogVisible = true;
                    this.imgSrc = event.target.result;
                    this.$refs.cropper && this.$refs.cropper.replace(event.target.result);
                };
                reader.readAsDataURL(file);
            },
            cropImage () {
                this.cropImg = this.$refs.cropper.getCroppedCanvas().toDataURL();
            },
            cancelCrop(){
                this.dialogVisible = false;
                if (this.formData.circleImg){
                    this.cropImg=formatUrl(this.formData.circleImg);
                }else {
                    this.cropImg="";
                }
            },
            cancelEdit(){
              this.dialogFormVisible=false;
              this.cropImg="";
            },
            getTabs(){
                request.loadData().then(res=>{
                    if (res.data.result='00000000'){
                        this.tables=res.data.data;
                        console.log("table",this.tables)
                    } else {
                        this.$message.error(res.data.msg);
                    }
                })
            },
            addCircle(){
                this.dialogFormVisible=true;
                this.formData={
                    id:'',
                    name:'',
                    state:0,
                    description:"",
                    parentType:99,
                    createTime:null,
                    updateTime:null,
                    createUserName:'',
                    updateUserName:'',
                    file:'',
                    circleImg:'',
                    fix:null,
                };
                this.cropImg="";
            },
            handleRead(data) {
                this.dialogFormVisible=true;
                this.formData=data;
                this.cropImg=formatUrl(data.circleImg);
            }
        },
        computed: {
            unreadNum(){
                return this.unread.length;
            }
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

