<!-- Vue Component -->
<template>
    <div>
        <!--外层容器-->
        <el-container>
            <!--顶部容器-->
            <el-header>
                <!--<span @click="deletexx(testData,'x_0_1_0')">test</span>
                头部-->
            </el-header>
            <!--主要区域-->
            <el-main>
                <el-container>
                    <el-aside>
                            <div>
                                <el-input
                                    placeholder="输入关键字进行过滤"
                                    v-model="filterText">
                                </el-input>
                                <el-tree
                                    class="filter-tree"
                                    node-key="id"
                                    :data="nodeData"
                                    :highlight-current="true"
                                    :empty-text="emptyText"
                                    :props="defaultProps"
                                    :filter-node-method="filterNode"
                                    :draggable="true"
                                    :expand-on-click-node="false"
                                    :render-content="renderContent"
                                    ref="tree2"
                                    :show-checkbox="true">
                                     <span class="custom-tree-node" slot-scope="{ node, data }">
                                        <span>{{ node.label }}</span>
                                        <span>

                                        </span>
                                      </span>
                                </el-tree>
                            </div>
                    </el-aside>
                    <el-main>
                        <div class="">
                            用于显示div
                        </div>
                    </el-main>
                </el-container>
            </el-main>
        </el-container>
        <!--编辑弹出框diaLog-->
        <el-dialog title="编辑字典" :visible.sync="dialogFormVisible"  >
            <el-form :model="formData" :rules="rules" ref="formData">
                <el-form-item label="字典名" :label-width="formLabelWidth"
                              @keyup.enter.native="submitForm('formData')" prop="name">
                    <el-input v-model="formData.name" placeholder="字典名"></el-input>
                </el-form-item>
                <!--是否创建于根目录-->
                <el-form-item label="字典节点" :label-width="formLabelWidth" v-if="!this.isEdit">
                    <el-switch
                        v-model="formData.isRoot"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        :active-value="true"
                        :inactive-value="false"
                        active-text="创建在根目录">
                    </el-switch>
                </el-form-item>
                <el-form-item label="字典代码" :label-width="formLabelWidth" v-if="this.isEdit">
                    <el-input v-model="formData.id" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="字典图标" prop="file" :label-width="formLabelWidth">
                    <div class="crop-demo">
                        <img :src="cropImg" v-model="formData.iconUrl" v-if="cropImg" class="pre-img">
                        <div class="crop-demo-btn">选择图片
                            <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage"/>
                        </div>

                    </div>
                </el-form-item>
                <el-form-item label="创建时间" :label-width="formLabelWidth" v-if="this.isEdit">
                    <span>{{formData.createTime | formatDate}}</span>
                </el-form-item>
                <el-form-item label="创建人" :label-width="formLabelWidth" v-if="this.isEdit">
                    <span>{{formData.createUserName}}</span>
                </el-form-item>
                <el-form-item label="修改时间" v-if="formData.updateTime&&this.isEdit" :label-width="formLabelWidth" >
                    <span>{{formData.updateTime | formatDate}}</span>
                </el-form-item>
                <el-form-item label="修改人" v-if="formData.updateUserName&&this.isEdit" :label-width="formLabelWidth" >
                    <span>{{formData.updateUserName}}</span>
                </el-form-item>
                <el-form-item label="状态" :label-width="formLabelWidth">
                    <el-switch
                        v-model="formData.state"
                        active-color="#13ce66"
                        active-text="开启字典"
                        inactive-text="关闭字典"
                        :active-value=0
                        :inactive-value=1
                        inactive-color="#ff4949">
                    </el-switch>
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
    import axios from 'axios'
    import {formatDate} from "../common/formatDate.js";
    import { Loading } from 'element-ui';
    import VueCropper  from 'vue-cropperjs';
    import {formatUrl} from "../common/formatUrl.js";
    import request from "../../api/ditionary";
    export default {
        name:"TreePage",
        watch: {
            filterText(val) {
                this.$refs.tree2.filter(val);
            },
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
            //筛选节点
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            //添加节点
            append(node,data) {
                this.dialogFormVisible=true;
                this.parentId=data.id;
                console.log("node",node)
                console.log("appendData",data)
                console.log("parentId",this.parentId)
                this.formData= {
                        id:null,
                        name:'',
                        state:"0",
                        createTime:null,
                        updateTime:null,
                        createUserName:'',
                        updateUserName:'',
                        file:'',
                        fix:null,
                        isRoot:false,
                        iconUrl:'',
                };
            },
            //移除节点
            remove(node, data) {
                console.log("data",node)
                if (node&&data){
                    if (!node.isLeaf){
                        this.$message.warning("根节点不能删除")
                    }else {
                        this.deleteDic(data,node);
                    }
                }
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
            },
            cancelEdit(){
                this.dialogFormVisible=false;
                this.isEdit=false;
                this.cropImg=null;
                this.parentId=null;
               this.formData={
                        id:null,
                        name:'',
                        state:"1",
                        createTime:null,
                        updateTime:null,
                        createUserName:'',
                        updateUserName:'',
                        file:'',
                        isRoot:false,
                        fix:null,
                        iconUrl:'',
                }
            },
            edit(data){
                this.isEdit=true;
                if (data&&data.id){
                    let nodeData=this.$refs.tree2.getNode(data.id).data;
                    console.log(nodeData);
                    this.formData.id=nodeData.id
                    this.formData.name=nodeData.name;
                    this.formData.createTime=nodeData.createTime;
                    this.formData.state=nodeData.state;
                    this.formData.updateTime=nodeData.updateTime;
                    this.dialogFormVisible=true;
                    console.log("formData",this.formData)
                    if (nodeData.iconUrl){
                        if (nodeData.iconUrl.indexOf("/img/")==-1){
                            this.cropImg=nodeData.iconUrl;
                        } else {
                            this.cropImg=formatUrl(nodeData.iconUrl);
                        }
                    }
                    if (!data.createUserName){
                        request.detail(data.id).then(res=>{
                            if (res.data.code="000000") {
                                let dictionary=res.data.data;
                                this.formData.createUserName=dictionary.createUserName;
                                this.formData.updateUserName=dictionary.updateUserName;
                                nodeData.iconUrl=dictionary.iconUrl;
                                if (dictionary.iconUrl) {
                                    this.cropImg=formatUrl(dictionary.iconUrl)
                                }
                            }else {
                                this.$message.warning(res.data.msg);
                            }
                        });
                    }else{
                        this.formData.createUserName=nodeData.createUserName;
                        this.formData.updateUserName=nodeData.updateUserName;
                    }

                }
            },
            submitForm(formData){
                //提交修改
                this.$refs[formData].validate((valid)=>{
                    if (valid){
                        let fileData=new FormData();
                        fileData.append("id",this.formData.id);
                        fileData.append("name",this.formData.name);
                        fileData.append("state",this.formData.state);
                        fileData.append("file",this.formData.file);
                        if (this.formData.id){
                            request.update(fileData).then(res=>{
                                if (res.data.code="000000"){
                                    //关闭弹窗
                                    this.dialogFormVisible=false;
                                    this.isEdit=false;
                                    this.cropImg=null;
                                    let node=this.$refs.tree2.getNode(this.formData.id);
                                    node.data.name=this.formData.name;
                                    node.data.state=this.formData.state;
                                    node.data.iconUrl=this.cropImg;

                                } else {
                                    this.$message.warning(res.data.msg);
                                }
                            });
                        }else{
                            console.log("root",this.formData.isRoot)
                            if (!this.formData.isRoot){
                                console.log("parentId",this.parentId)
                                fileData.append("parentId",this.parentId);
                            }
                            request.add(fileData).then(res=>{
                                if (res.data.code="000000"){
                                    //关闭弹窗
                                    this.dialogFormVisible=false;
                                    this.isEdit=false;
                                    let data= res.data.data;
                                    if (this.formData.isRoot){
                                        this.$refs.tree2.append(data,this.$refs.tree2.root);
                                    }else {
                                        //追加子节点
                                        this.$refs.tree2.append(data,this.parentId);
                                    }
                                        this.cropImg=null;
                                     this.parentId=null;
                                    //修改成功
                                } else {
                                    this.$message.warning(res.data.msg);
                                }
                            })
                        }

                    }
                });
            }/*,
            deletexx(data,id){
                console.log('data',this.testData)
                if (data&&data.length>0){
                    let  index=data.findIndex(d =>d.id ===id);
                    if (index==-1){
                        for (let i=0;i<data.length;i++){
                            this.deletexx(data[i].children,id);
                        }
                    } else{
                     let deleteId=data[index].id;
                        data.splice(index,1)
                    }
                }
            }*/,
            deleteDic(data,node){
                this.$confirm('此操作将删除该字典, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(request.delete(data.id)).then(res=>{
                    if (res.data.code="000000"){
                        const parent=node.parent;
                        const children=parent.childNodes;
                        const index = children.findIndex(d => d.id === node.id);
                        children.splice(index, 1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    }else {
                        this.$message.warning(res.data.msg);
                    }
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            //添加button内容
            renderContent(h, { node, data, store }) {
                return (
                    <span class="custom-tree-node">
                    <span>{node.label}</span>
                <span>
                <el-button size="mini" type="text" on-click={ () => this.edit(data) }><i class="el-icon-edit"></i></el-button>
                <el-button size="mini" type="text" on-click={ () => this.append(node,data) }><i class="el-icon-plus"></i></el-button>
                <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }><i class="el-icon-delete"></i></el-button>
                </span>
                </span>);
            },
           loadData(){
               request.tree().then(res=>{
                   if (res.data.code="000000"){
                     this.nodeData=res.data.data;
                   }else {
                       this.$message.warning(res.data.msg);
                   }
               });
           }
        },
        mounted(){
         this.loadData();
        },
        data() {
            return {
                parentId:null,
                defaultSrc: './static/img/img.jpg',
                //是否为编辑操作
                isEdit:false,
                //是否创建在根目录
                activeDic:"0",
                inactiveDic:"1",
                imgSrc: '',
                cropImg:'',
                dialogVisible: false,
                filterText: '',
                diaLogTitle:'',
                rootNode:{},
                formLabelWidth: '120px',
                dialogFormVisible:false,
                emptyText:"数据加载中",
                defaultProps: {
                    label: 'name',
                    isLeaf: 'leaf'
                },
                 /*testData:[
                    {
                        id:"x_0",
                        children:[
                            {
                                id:'x_0_0',
                                children:[]
                            },
                            {
                                id:'x_0_1',
                                children:[
                                    {
                                        id:'x_0_1_0',
                                        children:[]
                                    }
                                ]
                            }
                        ]
                    },{
                        id:'x_1',
                        children:[
                            {
                                id:'x_1_0',
                                children:[
                                    {
                                        id:'x_1_0_0',
                                        children:[]
                                    }
                                ]
                            }
                        ]
                    }
                ],*/
                nodeData:[],
                formData: {
                    id:null,
                    name:'',
                    state:"1",
                    createTime:null,
                    updateTime:null,
                    createUserName:'',
                    updateUserName:'',
                    file:'',
                    isRoot:false,
                    fix:null,
                    iconUrl:'',
                },
                rules:{
                    name:[
                        { required: true, message: '请输入字典名称', trigger: ['blur','change'] },
                        { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: ['blur','change'] }
                    ]
                }
            };
        },
    };
</script>

<style scoped>
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
