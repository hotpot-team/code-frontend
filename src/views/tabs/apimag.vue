<style>
    .version-info{
        background-color: #f8f8f9;
        border-top-width: 30px;
        margin-bottom: 16px;
        padding: 16px;
        border: 1px solid #dddee1;
    }
    .addition-api{

        margin-right: 16px;

    }
    .tab-content {
        background-color: #fff;
        border: 1px solid #dddee1;
        border-top: none;
        height: 100%;
        width: 100%;
        padding: 16px;
        overflow:hidden;
    }

    .left-api .left-api-col .col-method{
        border: 1px solid #dddee1;
        border-radius: 3px;
        line-height: 25px;
        text-align: center;
    }

    .left-api .left-api-col .col-method.request-method{
        width: 80%;
        margin-right: 20px;
        background-color: #2dd9fc;
    }
    .left-api .left-api-col .col-method.relative-path{
        width: 90%;
        float:left;
    }
    .left-api .left-api-col .col-method.address-book{
        width: 100%;
        background-color: #95f78b;
        float:right;
    }
    .validate-hide .ivu-form-item-required .ivu-form-item-label:before {
        display: none;
    }
</style>
<template>
       <div class="tab-content">
           <!--顶部-->
           <div class="tab-content-center center-title">
               <Form ref="topAPI" :model="newClass" label-position="right" :label-width="100" :rules="ruleValidate" class="validate-hide">
                   <Row>
                       <Col span="5">
                       <Form-item label="API版本">
                           <Select  placeholder="请选择" v-model="newClass.key" @on-change="selectVersions">
                               <Option  v-for="(item, index) in apiBases" :value="index" :key="index">{{item.versionName}}</Option>
                           </Select>
                       </Form-item>
                       </Col>
                       <Col span="3" >
                           <Button type="primary" style="margin-right: 20px;margin-left: 20px" @click="addClass">新增</Button>
                           <Button type="primary" @click="addClass">修改</Button>
                       </Col>
                           <!--版本名-->
                       <Col span="4" offset="1">
                           <Form-item label="版本名" prop="versionName">
                               <Input   style="width: 200px" placeholder="V1.0" v-model="newClass.versionName"></Input>
                           </Form-item>
                       </Col>
                           <!--BasePath-->
                       <Col span="4" offset="1">
                           <Form-item label="basePath" prop="basePath">
                               <Input   style="width: 200px" placeholder="/cmp/contact/api/v1"  v-model="newClass.basePath"></Input>
                           </Form-item>
                       </Col>
                   </Row>
               </Form>
           </div>
           <div class="Construction-api" style="height: calc(100% - 76px);">
               <Row>
                   <Col span="14" style="padding-right: 8px" class="tab-content-col">
                   <div class="addition-api tab-content-left" style="overflow: auto;">
                     <div v-for="(api, index) in apiObjs" :key="api.id" @click="apiDetials(index, $event)" style="margin-bottom: 5px;">
                       <Card :padding=10>
                           <Row class-name="left-api">
                               <Col span="4"  class-name="left-api-col"><Tag style="width: 63px;" :color="tagColor(api.requestMethod)">{{api.requestMethod}}</Tag></Col>
                               <Col span="12"  class-name="left-api-col"><b>{{api.uri}}</b></Col>
                               <Col span="8" class-name="left-api-col"><Tag style="width: 100%;" type="border" :color="tagColor(api.requestMethod)">{{api.summary}}</Tag></Col>
                           </Row>
                       </Card>
                     </div>
                       <div style="margin-top: 16px">
                         <Button type="primary" @click="addRow">添加API</Button>
                       </div>
                   </div>
                   </Col>
                   <Col span="10" class="tab-content-col">
                     <div class="validate-hide tab-content-left" style="overflow: auto;">
                         <h3 style="margin-bottom: 16px">编辑</h3>
                         <Form ref="methodTop" :model="formTop" label-position="top" :rules="ruleValidate">
                             <Form-item label="uri" prop="uri">
                                 <Input v-model="formTop.uri"></Input>
                             </Form-item>
                             <Form-item label="请求方法" prop="requestMethod">
                                 <Select v-model="formTop.requestMethod" placeholder="请选择">
                                     <Option  v-for="item in requestMethod" :value="item.value" :key="item.value">{{ item.value }}</Option>
                                 </Select>
                             </Form-item>
                             <Form-item label="概述" prop="summary">
                                 <Input v-model="formTop.summary"></Input>
                             </Form-item>
                             <Form-item label="描述">
                                 <Input v-model="formTop.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..."></Input>
                             </Form-item>
                             <Form-item label="标签">
                                 <Input v-model="formTop.tag"></Input>
                             </Form-item>
                             <Button type="primary" style="float:right;" @click="addProp">新增参数</Button>
                             <Form-item label=" 参数">
                                 <Table :columns="columns1" :data="formTop.data1" style="margin-top: 20px;"></Table>
                             </Form-item>
                         </Form>
                         <Form ref="responseObjGenericType" :model="formTop" label-position="top" :rules="ruleValidate">
                             <Row>
                                 <Col span="8">
                                     <Form-item label="返回值" prop="responseObjName">
                                         <Select v-model="formTop.responseObjName"  placeholder="请选择" style="width:200px;" v-for="item in ResponseObjName" >
                                             <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" ></Option>
                                         </Select>
                                     </Form-item>
                                 </Col>
                                 <Col span="12" style="margin-left: 24px;">
                                     <Form-item label="泛型"  prop="responseObjGenericType" >
                                         <Input  placeholder="ContactUserPO" style="width: 200px;" v-model="formTop.responseObjGenericType"></Input>
                                     </Form-item>
                                 </Col>
                             </Row>
                         </Form>
                         <div >
                             <Button type="primary" style="margin-top: 10px;" @click="commit">保存修改</Button>
                         </div>
                     </div>
                   </Col>
               </Row>
           </div>
           <!--新增和修改参数对话框-->
           <Modal
                   v-model="updateParam"
                   :title=addOrUpdate
                   @on-ok="ok"
                   @on-cancel="cancel">
               <Form ref="updatePropForm" label-position="top" :model="formTop.propData">
                   <Form-item label="名称" prop="name">
                       <Input v-model="formTop.propData.name"></Input>
                   </Form-item>
                   <Form-item label="形式" prop="form">
                       <Select  placeholder="请选择" v-model="formTop.propData.form">
                           <Option  v-for="item in parametricForm" :value="item.value" :key="item.value">{{ item.label }}</Option>
                       </Select>
                   </Form-item>
                   <Form-item label="描述" prop="description">
                       <Input v-model="formTop.propData.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..." ></Input>
                   </Form-item>
                   <Form-item label="是否必须" prop="isRequired">
                       <Radio-group v-model="formTop.propData.isRequired">
                           <Radio label="0">否</Radio>
                           <Radio label="1">是</Radio>
                       </Radio-group>
                   </Form-item>
                   <Form-item label="类型" prop="type">
                       <Select placeholder="请选择" v-model="formTop.propData.type">
                           <Option value="base">base</Option>
                           <Option value="array">array</Option>
                           <Option value="dto">dto</Option>
                           <Option value="po">po</Option>
                       </Select>
                   </Form-item>
                   <Form-item label="格式" prop="format">
                       <Select placeholder="请选择"  v-model="formTop.propData.format" v-show="formTop.propData.type == 'base'">
                           <!--基础类型下的内容-->
                           <Option v-for="(item,index) in baseTypeList.base.data" :value="item" :key="index" >{{ item }}</Option>
                       </Select>
                       <!--集合类型下的内容-->
                       <Select placeholder="请选择"  v-model="formTop.propData.format" v-show="formTop.propData.type == 'array'">
                           <Option-group label="基本类型">
                               <Option v-for="(item,index) in baseTypeList.base.data" :value="item" :key="index" >{{ item }}</Option>
                           </Option-group>
                           <Option-group label="DTO实体">
                               <div v-for="item in baseTypeList.dto.data">
                                   <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" ></Option>
                               </div>
                           </Option-group>
                           <Option-group label="PO实体">
                               <div v-for="item in baseTypeList.po.data">
                                   <Option v-for="(child,index) in item.data" :value="item.packName + '.' +child.className" :key="index" ></Option>
                               </div>
                           </Option-group>
                       </Select>
                       <Select placeholder="请选择"  v-model="formTop.propData.format" v-show="formTop.propData.type == 'dto'">
                           <div v-for="item in baseTypeList.dto.data">
                               <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" ></Option>
                           </div>
                       </Select>
                       <Select placeholder="请选择"  v-model="formTop.propData.format" v-show="formTop.propData.type == 'po'">
                           <div v-for="item in baseTypeList.po.data">
                               <Option v-for="(child,index) in item.data" :value="item.packName + '.' +child.className" :key="index" ></Option>
                           </div>
                       </Select>
                   </Form-item>
               </Form>
           </Modal>
           <!--删除参数-->
           <Modal v-model="deleteParam" width="360">
               <p slot="header" style="color:#f60;text-align:center">
                   <Icon type="information-circled"></Icon>
                   <span>删除确认</span>
               </p>
               <div style="text-align:center">
                   <p>参数内容将被删除！</p>
                   <p>是否继续删除？</p>
               </div>
               <div slot="footer">
                   <Button type="error" size="large" long  @click="remove(index)">删除</Button>
               </div>
           </Modal>
       </div>
</template>
<script>
    import expandRow from './apiparam-expand.vue';
    export default {
        components: {expandRow},
        data () {
            return {

                isBase:false,
                isArray:false,
                isRefobj:false,
                animal: '是',
                //未点击删除按钮时的状态
                deleteParam:false,
                //未点击修改按钮时的状态
                updateParam:false,
                //未点击新增参数按钮时的状态
                addParam:false,
                addOrUpdate:'',
                prop:'',
                index:0,
                //apiVersions:'',
                newClass:{
                    key:'',
                    //版本名
                    versionName:'',
                    basePath:'',
                },
                //接收返回值数据
                ResponseObjName:[],
                apiBasesKey:'',
                apiobjId:'',
                aipClassObj:[],
                ApiParams:[],
                data2:[],
                formTwo:{
                    uri:'',
                    //接收请求方法信息
                    requestMethod: '',
                    //接收概述信息
                    summary: '',
                },
                formTop:{
                    uri:'',
                    //接收请求方法信息
                    requestMethod: '',
                    //接收概述信息
                    summary: '',
                    //接收描述信息
                    description:'',
                    //接收标签内容
                    tag:'',
                    //接收返回值数据
                    responseObjName:'',
                    //接收泛型数据
                    responseObjGenericType:'',
                    data1: [
                        {
                            name: '',
                            form: '',
                            description: '',
                            isRequired:'',
                            type:'',
                            format:[],
                        },
                    ],
                    //接收修改后的数据
                    propData: {
                        name: '',
                        form: '',
                        description: '',
                        isRequired:'',
                        type:'',
                        format:[],
                    },
                },
                ruleValidate : {
                    uri: [
                        { required: true, message: 'uri不能为空', trigger: 'change' },
                    ],
                    requestMethod: [
                        { required: true, message: '请求方法不能为空', trigger: 'change' },
                    ],
                    summary: [
                        { required: true, message: '概述不能为空', trigger: 'change' },
                    ],
                    responseObjGenericType: [
                        { required: true, message: '泛型不能为空', trigger: 'no' },
                    ],
                    versionName: [
                        { required: true, message: '版本名不能为空', trigger: 'change' },
                    ],
                    basePath: [
                        { required: true, message: 'BasePath不能为空', trigger: 'change' },
                    ],
                },
                isRequired:[
                    {
                        key:'0',
                        value:'否'
                    },
                    {
                        key:'1',
                        value:'是'
                    }
                ],
                //请求方法下拉选内容
                requestMethod: [
                    {
                        value: 'GET',
                        label: 'GET'
                    },
                    {
                        value: 'POST',
                        label: 'POST'
                    },
                    {
                        value: 'PUT',
                        label: 'PUT'
                    },
                    {
                        value: 'DELETE',
                        label: 'DELETE'
                    },
                ],
                //形式下拉选内容
                parametricForm: [
                    {
                        value: 'header',
                        label: 'header'
                    },
                    {
                        value: 'query',
                        label: 'query'
                    },
                    {
                        value: 'path',
                        label: 'path'
                    },
                    {
                        value: 'body',
                        label: 'body'
                    },
                    {
                        value: 'form',
                        label: 'form'
                    },
                ],
                columns1: [
                  {
                      type: 'expand',
                      width: 50,
                      render: (h, params) => {
                          return h(expandRow, {
                              props: {
                                  row: params.row
                              }
                          })
                      }
                  },
                    {
                        title: '名称',
                        key: 'name'
                    },
                    {
                        title: '形式',
                        key: 'form'
                    },
                    {
                        title: '描述',
                        key: 'description'
                    },
                    {
                        title: '操作',
                        key: 'operation',
                        render: (h, params) => {
                        return h('div', {
                        },[
                            h('Button', {
                                props: {
                                    type:'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        this.addOrUpdate='修改参数';
                                        this.updateParam = true;
                                        this.index=params.index;
                                        this.show(params.index);

                                    }
                                }
                            }, '修改'),
                            h('Button', {
                                props: {
                                    size: 'small',
                                    type:'error'
                                },
                                on: {
                                    click: () => {
                                    this.index=params.index;
                                 this.deleteParam=true;
                            }
                        }
                        }, '删除'),
                        ]);
                      }
                    }
                ],
                //版本list
                apiBases: [],
                //apiobjList
                apiObjs: [],
                //所有类型,格式
                baseTypeList: {
                    base :{
                        data:[]
                    },
                    array :{
                        data:[]
                    },
                    dto :{
                        data:[]
                    },
                    po :{
                        data:[]
                    },
                },
            }
        },
        props: ["getData"],
        created: function () {
            var prjId = this.getData();
            this.getEntityData(prjId);
        },
        methods: {
          // 依据request method获取不同颜色
          tagColor: function(rm) {
            if (rm == 'PUT') {
              return 'yellow';
            } else if (rm == 'POST') {
              return 'green';
            } else if (rm == 'GET') {
              return 'blue';
            } else {
              return 'red';
            }
          },
            //获取版本信息
            getEntityData (prjId) {
                var api = '/codegen/api/v1/apibases/'+prjId+'/show';
//                console.log(prjId);
                this.$http.get(api).then((response) => {
                    this.apiBases = response.data.apiBases;
                    if (this.apiBases.length > 0) {
                        this.newClass.key = 0;
                    }
                });
            },
            //选择不同版本号显示相应内容
            selectVersions(value){
                this.apiBasesKey=value;
                this.newClass.versionName = this.apiBases[value].versionName;
                this.newClass.basePath = this.apiBases[value].basePath;
                //获取相应版本的所有API
                this.getApiBases(this.apiBases[value].id);
            },
            //获取相应版本的所有API
            getApiBases(apiBasesId){
                var api = '/codegen/api/v1/apiobjs/'+apiBasesId+'/show';
                this.$http.get(api).then((response) => {
//                    console.log(response.data);
                    this.apiObjs = response.data.apiObjs;
                    if (this.apiObjs.length > 0) {
                        this.apiDetials(0);
                        this.getResponseObjName();
                    }else{
                        this.$refs['methodTop'].resetFields();
                        this.formTop.uri= '';
                        this.formTop.requestMethod= '';
                        this.formTop.summary= '';
                        this.formTop.description= '';
                        this.formTop.tag= '';
                        this.formTop.responseObjName= '';
                        this.formTop.responseObjGenericType= '';
                        this.formTop.data1=[];
                    }
                });
            },
            //获取API详细信息
            apiDetials(index, event){
              if (event != undefined) {
                console.log(event.target);
              }
//                this.$refs['methodTop'].resetFields();
                this.apiobjId=this.apiObjs[index].id;
                this.formTop.uri= this.apiObjs[index].uri;
                this.formTop.requestMethod= this.apiObjs[index].requestMethod;
                this.formTop.summary= this.apiObjs[index].summary;
                this.formTop.description= this.apiObjs[index].description;
                this.formTop.tag= this.apiObjs[index].tag;
                this.formTop.responseObjName= this.apiObjs[index].responseObjName;
                this.formTop.responseObjGenericType= this.apiObjs[index].responseObjGenericType;
                var api = '/codegen/api/v1/apiparams/'+this.apiObjs[index].id+'/show';
                this.$http.get(api).then((response) => {
                    this.formTop.data1=response.data.apiParams;
                });
            },
            //新增数据
            addProp(){
                this.addOrUpdate='新增参数';
                this.updateParam=true;
                this.cancel();
                this.$http.get('/codegen/api/v1/project/'+this.getData()+'/data_type').then((response)=>{
                    console.log(response.data);
                    this.baseTypeList = response.data;
                    this.formTop.propData.type = '';
                });
            },
            cancel(){
                this.$refs['updatePropForm'].resetFields();
            },
            //保存和修改版本号和BasePath
            addClass(){
//                this.$refs['topAPI'].resetFields();
                var prjId = this.getData();
                this.$refs['topAPI'].validate((valid) => {
                    if(valid){
                        var Message ={
                            projectId: prjId,
                            basePath: this.newClass.basePath,
                            versionName:  this.newClass.versionName
                        };
                        this.$http.post('/codegen/api/v1/apibase/save',Message).then((response) => {
//                            console.log(response.data.Message)
                            this.$Message.success('保存成功')
                        });
                    }
                })
            },
            //批量提交
            commit(){
                    this.$refs['methodTop'].validate((valid) => {
                        if(valid){
                            var prjId = this.getData();
                            var api = '/codegen/api/v1/apibases/'+prjId+'/show';
                            this.$http.get(api).then((response) => {
                                this.seveMesAndPar(response.data.apiBases);
                            console.log(response.data.apiBases)
                                this.$Message.success('保存成功');
                            });
                        }
                    });
            },
            //保存和修改方法，参数
            seveMesAndPar(arr){
                var prjId = this.getData();
                var apiBaseId;
                console.log(this.apiBasesKey)
                if(arr.length>1){
                    apiBaseId=arr[this.apiBasesKey].id
                }
                var Message ={
                    apiParam: this.formTop.data1,
                    description: this.formTop.description,
                    requestMethod: this.formTop.requestMethod,
                    responseObjGenericType: this.formTop.responseObjGenericType,
                    responseObjName: this.formTop.responseObjName,
                    summary: this.formTop.summary,
                    tag: this.formTop.tag,
                    uri: this.formTop.uri,
                    id: this.apiobjId
                };
                this.$http.post('/codegen/api/v1/apiobj/save',Message).then((response) => {
                    console.log(response.data)

                });
            },
            //获取返回值数据
            getResponseObjName(){
                this.$http.get('/codegen/api/v1/project/'+this.getData()+'/dto_po').then((response) => {
                    this.ResponseObjName = response.data.dto.data;
                    if (this.ResponseObjName.length > 1) {
                        //debugger
                        for (var i=0; i < this.ResponseObjName.length; i++) {
                            if (this.ResponseObjName[i].packName != 'default'){
                                this.activeMenu = this.ResponseObjName[i].data[0].id;
                                break;
                            }
                        }
                    };
              });
            },
            ok(){
                this.$Message.info('点击了确定');
                if(this.addOrUpdate=='新增参数'){
                    this.newData();
                }else {
                    this.modifyData();
                }
            },
            cance2 () {
                    this.remove();
                this.$refs['addform'].resetFields();
            },
            remove () {
                this.formTop.data1.splice(this.index, 1);
                this.deleteParam = false;
                this.$Message.success('删除成功');
            },
            // 修改后数据保存到data1
            modifyData() {
                let index=this.index;
                this.formTop.data1[index].name = this.formTop.propData.name;
                this.formTop.data1[index].form = this.formTop.propData.form;
                this.formTop.data1[index].description = this.formTop.propData.description;
                this.formTop.data1[index].isRequired = this.formTop.propData.isRequired;
                this.formTop.data1[index].type = this.formTop.propData.type;
                this.formTop.data1[index].format = this.formTop.propData.format;
            },
            newData() {
                var data = {};
                data.name = this.formTop.propData.name;
                data.form = this.formTop.propData.form;
                data.description = this.formTop.propData.description;
                data.isRequired = this.formTop.propData.isRequired;
                data.type = this.formTop.propData.type;
                data.format = this.formTop.propData.format
                this.formTop.data1.push(data)
                console.log(this.formTop.data1)
            },
            //data1的数据给propData
            show (index){
                this.cancel();
                this.$http.get('/codegen/api/v1/project/'+this.getData()+'/data_type').then((response)=>{
                this.baseTypeList = response.data;
                this.formTop.propData.type = '';
            });
                this.formTop.propData.name=this.formTop.data1[index].name;
                this.formTop.propData.form=this.formTop.data1[index].form;
                this.formTop.propData.description=this.formTop.data1[index].description;
                this.formTop.propData.isRequired=this.formTop.data1[index].isRequired;
                this.formTop.propData.format=this.formTop.data1[index].format;
                this.formTop.propData.type=this.formTop.data1[index].type;
            },
            showOptions(){
              if(this.formTop.propData.type=='base'){
                  this.isArray=false;
                  this.isRefobj=false;
                  this.isBase=true;
              }  else if(this.formTop.propData.type=='array'){
                  this.isRefobj=false;
                  this.isBase=false;
                  this.isArray=true;
                }else {
                  this.isArray=false;
                  this.isBase=false;
                  this.isRefobj=true;
                }
            },
            returnValueChange(){
                if(this.formTop.responseObjName=='ResultPageDTO'){
                    this.$refs['responseObjGenericType'].validate((valid) => {
                        if(valid){

                        }
                    })

                }
            },
            addRow(){
                this.formTop.description= '';
                this.formTop.tag= '';
                this.formTop.responseObjName= '';
                this.formTop.responseObjGenericType= '';
                this.formTop.data1=[];
                this.$refs['methodTop'].resetFields();
                this.$refs['methodTop'].validate((valid) => {
                    if(valid){
                    }
                })
            },
        }
    };
</script>
