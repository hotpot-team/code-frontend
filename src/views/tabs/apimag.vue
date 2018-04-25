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
    .ivu-card.ivu-card-bordered.active{
        background: #ebf7ff;
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
                        <Select v-model="model1" @on-change="selectVersions" v-if="apiBases.length > 0">
                            <Option v-for="item in versionNameSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                        <Select v-model="model1" @on-change="selectVersions" v-else>
                            <Option v-for="item in versionNameSelect" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Form-item>
                    </Col>
                    <Col span="5" >
                    <Button type="primary" style="margin-right: 20px;margin-left: 20px" @click="addVersionNameBasePath">新增</Button>
                    <Button type="primary" @click="updateVersionNameAndBasePath">修改</Button>
                    <Button type="error" style="margin-left: 20px;" @click="showDeleteApiModel" :disabled="disabledApi">删除</Button>
                    </Col>
                    <!--版本名-->
                    <Col span="4" offset="1">
                    <Form-item label="版本名" prop="versionName">
                        <Input   style="width: 200px" placeholder="V1.0" v-model="newClass.versionName" :disabled="disabled"></Input>
                    </Form-item>
                    </Col>
                    <!--BasePath-->
                    <Col span="4" offset="1">
                    <Form-item label="basePath" prop="basePath">
                        <Input   style="width: 200px" placeholder="/cmp/contact/api/v1"  v-model="newClass.basePath" :disabled="disabled"></Input>
                    </Form-item>
                    </Col>
                    <Col span="1" offset="1">
                    <Button type="primary" @click="saveVersionNameBasePath" v-show="isSave">保存</Button>
                    </Col>
                </Row>
            </Form>
        </div>
        <div class="Construction-api" style="height: calc(100% - 76px);">
            <Row>
                <Col span="14" style="padding-right: 8px" class="tab-content-col">
                <div class="addition-api tab-content-left" style="overflow: auto;">
                    <div v-for="(api, index) in apiObjs" :key="api.id" @click="apiDetials(index, $event)" style="margin-bottom: 5px;" >
                        <Card :padding=10 :class="{active:showColor==index}">
                            <Row class-name="left-api" >
                                <Col span="4"  class-name="left-api-col"><Tag style="width: 63px;" :color="tagColor(api.requestMethod)">{{api.requestMethod}}</Tag></Col>
                                <Col span="12"  class-name="left-api-col"><Tag style="width: 85%;"><b>{{api.uri}}</b></Tag></Col>
                                <Col span="8" class-name="left-api-col"><Tag style="width: 100%;" type="border" :color="tagColor(api.requestMethod)">{{api.summary}}</Tag></Col>
                            </Row>
                        </Card>
                    </div>
                    <div style="margin-top: 16px">
                        <Button type="primary" @click="addRow" :disabled="disabledAddApi">添加API</Button>
                    </div>
                </div>
                </Col>
                <Col span="10" class="tab-content-col">
                <div class="validate-hide tab-content-left" style="overflow: auto;">
                    <h3 style="margin-bottom: 16px">编辑<span v-show="isShow">(自动生成的)</span></h3>
                    <Form ref="methodTop" :model="formTop" label-position="left" :rules="ruleValidate" :label-width="80">
                        <Form-item label="uri" prop="uri" >
                            <Input v-model="formTop.uri" :disabled="disabledApiOpj"></Input>
                        </Form-item>
                        <Form-item label="请求方法" prop="requestMethod" >
                            <Select v-model="formTop.requestMethod" placeholder="请选择" :disabled="disabledApiOpj">
                                <Option  v-for="item in requestMethod" :value="item.value" :key="item.value" >{{ item.value }}</Option>
                            </Select>
                        </Form-item>
                        <Form-item label="概述" prop="summary" >
                            <Input v-model="formTop.summary" :disabled="disabledApiOpj"></Input>
                        </Form-item>
                        <Form-item label="描述" >
                            <Input v-model="formTop.description" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入..." :disabled="disabledApiOpj"></Input>
                        </Form-item>
                        <Form-item label="标签" >
                            <Input v-model="formTop.tag" :disabled="disabledApiOpj"></Input>
                        </Form-item>
                        <Form-item label=" 参数" >
                            <Table :columns="columns1" :data="formTop.data1"></Table>
                            <Button type="primary" @click="addProp" :disabled="disabledApiOpj" style="margin-top: 20px;">新增参数</Button>
                        </Form-item>
                    </Form>
                    <Form ref="responseObjGenericTypeAndFormat" :model="formTop" label-position="left" :rules="ruleValidate" :label-width="80">
                        <Row>
                            <Col :span="span">
                            <Form-item label="返回值" prop="responseObjName" >
                                <Select  v-model="formTop.responseObjName" placeholder="请选择" @on-change="returnValueChange" :disabled="disabledApiOpj" placement="top">
                                    <div v-for="item in ResponseObjName.dto.data">
                                        <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" :disabled="disabledApiOpj"></Option>
                                    </div>
                                </Select>
                            </Form-item>
                            </Col>
                            <Col span="8">
                            <Form-item label="泛型类型"  prop="responseObjGenericType" v-if="isResponseObjGeneric"  style="margin-left: 8%">
                                <Select placeholder="请选择" v-model="formTop.responseObjGenericType"  :disabled="disabledApiOpj"  placement="top">
                                    <Option v-for="item in propTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Form-item>
                            </Col>
                            <Col span="8"  >
                            <Form-item label="泛型格式" prop="responseObjGenericFormat" v-if="isResponseObjGeneric"  style="margin-left: 8%">
                                <Select placeholder="请选择"  v-model="formTop.responseObjGenericFormat" v-if="formTop.responseObjGenericType == 'base'" :disabled="disabledApiOpj"  placement="top">
                                    <!--基础类型下的内容-->
                                    <Option v-for="(item,index) in baseTypeList.base.data" :value="item" :key="index" >{{ item }}</Option>
                                </Select>
                                <!--集合类型下的内容-->
                                <Select placeholder="请选择"  v-model="formTop.responseObjGenericFormat" v-if="formTop.responseObjGenericType == 'array'" :disabled="disabledApiOpj"  placement="top">
                                    <Option-group label="基本类型">
                                        <Option v-for="(item,index) in baseTypeList.base.data" :value="'base.'+item" :key="index" >{{ item }}</Option>
                                    </Option-group>
                                    <Option-group label="DTO实体">
                                        <div v-for="item in baseTypeList.dto.data">
                                            <Option v-for="(child,index) in item.data" :value="'dto.'+(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" >
                                                {{(item.packName == 'default'?'':item.packName + '.') +child.className}}
                                            </Option>
                                        </div>
                                    </Option-group>
                                    <Option-group label="PO实体">
                                        <div v-for="item in baseTypeList.po.data">
                                            <Option v-for="(child,index) in item.data" :value="'po.'+item.packName + '.' +child.className" :key="index" >
                                                {{item.packName + '.' +child.className}}
                                            </Option>
                                        </div>
                                    </Option-group>
                                </Select>
                                <Select placeholder="请选择"  v-model="formTop.responseObjGenericFormat" v-if="formTop.responseObjGenericType == 'dto'" :disabled="disabledApiOpj"  placement="top">
                                    <div v-for="item in baseTypeList.dto.data">
                                        <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" ></Option>
                                    </div>
                                </Select>
                                <Select placeholder="请选择"  v-model="formTop.responseObjGenericFormat" v-if="formTop.responseObjGenericType == 'po'" :disabled="disabledApiOpj"  placement="top">
                                    <div v-for="item in baseTypeList.po.data">
                                        <Option v-for="(child,index) in item.data" :value="item.packName + '.' +child.className" :key="index" ></Option>
                                    </div>
                                </Select>
                            </Form-item>
                            </Col>
                        </Row>
                    </Form>
                    <div >
                        <Button type="primary" style="margin-top: 10px;" @click="commit" :disabled="disabledApiOpj" >保存修改</Button>
                        <Button type="error" style="margin-left: 20px;margin-top: 10px;" @click="showDeleteApiObjModel" :disabled="disabledApiOpj">删除</Button>
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
                @on-cancel="cancel" >
            <Form ref="updatePropForm" label-position="top" :model="formTop.propData" :rules="ruleValidate">
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
                <Form-item label="是否必需" prop="isRequired">
                    <Radio-group v-model="formTop.propData.isRequired">
                        <Radio label="0">否</Radio>
                        <Radio label="1">是</Radio>
                    </Radio-group>
                </Form-item>
                <Form-item label="类型" prop="type" v-if="propTypeList.length > 0">
                    <Select v-model="formTop.propData.type" >
                        <Option v-for="item in propTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                    </Select>
                </Form-item>
                <Form-item label="格式" prop="format" v-if="propTypeList.length > 0">
                    <Select placeholder="请选择"  v-model="formTop.propData.format" v-if="formTop.propData.type == 'base'">
                    <!--基础类型下的内容-->
                        <Option v-for="(item,index) in baseTypeList.base.data" :value="item" :key="index" >{{ item }}</Option>
                    </Select>
                    <!--集合类型下的内容-->
                    <Select placeholder="请选择"  v-model="formTop.propData.format" v-if="formTop.propData.type == 'array'">
                        <Option-group label="基本类型">
                            <Option v-for="(item,index) in baseTypeList.base.data" :value="'base.'+item" :key="index" >{{ item }}</Option>
                        </Option-group>
                        <Option-group label="DTO实体">
                            <div v-for="item in baseTypeList.dto.data">
                                <Option v-for="(child,index) in item.data" :value="'dto.'+(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" >
                                    {{(item.packName == 'default'?'':item.packName + '.') +child.className}}
                                </Option>
                            </div>
                        </Option-group>
                        <Option-group label="PO实体">
                            <div v-for="item in baseTypeList.po.data">
                                <Option v-for="(child,index) in item.data" :value="'po.'+item.packName + '.' +child.className" :key="index" >
                                    {{item.packName + '.' +child.className}}
                                </Option>
                            </div>
                        </Option-group>
                    </Select>
                    <Select placeholder="请选择"  v-model="formTop.propData.format" v-if="formTop.propData.type == 'dto'">
                        <div v-for="item in baseTypeList.dto.data">
                            <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" ></Option>
                        </div>
                    </Select>
                    <Select placeholder="请选择"  v-model="formTop.propData.format" v-if="formTop.propData.type == 'po'">
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
                <p>内容即将被删除！</p>
                <p>是否继续删除？</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long  @click="remove(index)">删除</Button>
            </div>
        </Modal>
        <Modal
                v-model="addVersionNameAndBasePath"
                title="新增版本名及basePath"
                @on-ok="addVersionNameAndBasePathOk"
                @on-cancel="cance3">
            <Form ref="addVersionAndBasePath" :model="modelClass" label-position="top" :rules="ruleValidate">
                <Form-item label="版本名" prop="versionName">
                    <Input v-model="modelClass.versionName" placeholder="v1" ></Input>
                </Form-item>
                <Form-item label="basePath" prop="basePath">
                    <Input v-model="modelClass.basePath" placeholder="/hotpot"></Input>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
    import expandRow from './apiparam-expand.vue';
    export default {
        components: {expandRow},
        data () {
            return {
                deleteState :0,
                model1: '',
                span:0,
                //显示“自动生成的”字样
                isShow :false,
                //返回值不为resultPageDTO是泛型的状态
                isResponseObjGeneric:false,
                showColor:0,
                //输入框禁用模式状态
                disabled:true,
                disabledApi:true,
                disabledAddApi:true,
                disabledApiOpj:true,
                //新增版本名和BasePath的状态
                addVersionNameAndBasePath:false,
                //保存版本名和BasePath的状态
                isSave:false,
                //未点击删除按钮时的状态
                deleteParam:false,
                //未点击修改按钮时的状态
                updateParam:false,
                //未点击新增参数按钮时的状态
                addParam:false,
                //获取apiBaseId
                apiBaseId:'',
                // 参数对话框名
                addOrUpdate:'',
                //当前版本
                currentValue:'',
                //属性类型列表，在页面初始时从后台接口获取
                propTypeList: [],
                index:0,
                versionNameSelect: [],
                //从后台接收版本名和basePath
                newClass:{
                    //版本名
                    versionName:'',
                    basePath:''
                },
                //存放对话框版本名和basePath
                modelClass:{
                    versionName:'',
                    basePath:''
                },
                apiobjId:'',
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
                    //接收泛型类型数据
                    responseObjGenericType:'',
                    //接收泛型格式数据
                    responseObjGenericFormat:'',
                    responseObjGenericArrayType:'',
                    data1: [{
                            name: '',
                            form: '',
                            description: '',
                            isRequired: '',
                            type: '',
                            format: [],
                            arrayType:''
                    },
                       ],
                    //接收修改后的数据
                    propData: {
                        name: '',
                        form: 'query',
                        description: '',
                        isRequired:'0',
                        type:'',
                        format:[],
                        arrayType:''
                    },
                },
                ruleValidate : {
                    uri: [
                        { required: true, message: 'uri不能为空', trigger: 'change' },
                        {pattern :/^\//,message: '请以"/"开头', trigger: 'change'}
                    ],
                    requestMethod: [
                        { required: true, message: '请求方法不能为空', trigger: 'change' },
                    ],
                    summary: [
                        { required: true, message: '概述不能为空', trigger: 'change' },
                    ],
                    responseObjGenericType: [
                        { required: true, message: '泛型类型不能为空', trigger: 'change' },
                    ],
                    responseObjGenericFormat: [
                        { required: true, message: '泛型格式不能为空', trigger: 'change' },
                    ],
                    versionName: [
                        { required: true, message: '版本名不能为空', trigger: 'change' },
                        {pattern :/^v\d+$/,message: '版本名格式不正确，应为“v”+数字', trigger: 'change'}
                    ],
                    basePath: [
                        { required: true, message: 'BasePath不能为空', trigger: 'change' },
                        {pattern :/^(\/[^A-Z]+|\/)$/,message: '请以"/"开头,不要填写大写字母', trigger: 'change'}
                    ],
                    name: [
                        { required: true, message: '参数名不能为空', trigger: 'blur' },
                        {pattern :/^([a-z]+|[a-z][a-zA-Z]+)$/,message: '请使用驼峰命名法命名，不要添加特殊字符', trigger: 'change'}
                    ],
                    type: [
                        { required: true, message: '类型不能为空', trigger: 'change' },
                    ],
                    format: [
                        { required: true, message: '格式不能为空', trigger: 'change' },
                    ],
                    form: [
                        { required: true, message: '型式不能为空', trigger: 'change' },
                    ],
                    responseObjName: [
                        { required: true, message: '返回值不能为空', trigger: 'blur' },
                    ],
                },
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
                        value: 'cookie',
                        label: 'cookie'
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
                return h('div', {}, [
                        h('Button', {
                            props: {
                                type:'primary',
                                size: 'small',
                                disabled:this.disabledApiOpj
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
                            },
                        }, '修改'),
                        h('Button', {
                            props: {
                                size: 'small',
                                type:'error',
                                disabled:this.disabledApiOpj
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
            //接收返回值数据
            ResponseObjName:{
                dto:{
                    data:[]
                }
            },
        }
        },
        props: ["getData"],
        created: function () {
            var prjId = this.getData();
            this.getEntityData(prjId);
            this.getbaseTypeList();
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
            //获取版本信息及类型数据
            getbaseTypeList (){
                this.$http.get('/codegen/api/v1/project/'+this.getData()+'/data_type').then((response)=>{
                    this.baseTypeList = response.data;
                    for (let key in response.data) {
                        if (typeof(response.data[key]) === 'object') {
                            this.propTypeList.push(
                                    {
                                        value: key,
                                        label: key
                                    }
                            )
                        }
                    }
               })
            },
            //获取版本信息
            getEntityData (prjId) {
                var api = '/codegen/api/v1/apibases/'+prjId+'/show';
                this.$http.get(api).then((response) => {
                    this.versionNameSelect=[];
                    var versionNameList={};
                    this.apiBases = response.data.apiBases;
                    this.$nextTick(function () {
                        if (this.apiBases.length > 0) {
                            for(let i=0;i<this.apiBases.length;i++) {
                                this.versionNameSelect.push(versionNameList={
                                    value: this.apiBases[i].versionName,
                                    label: this.apiBases[i].versionName
                                });
                            }
                            this.disabledApi=false;
                            this.model1=this.apiBases[0].versionName;
                        }else{
                            this.disabledApi=true;
                            this.$refs['topAPI'].resetFields();
                            this.model1=''
                        }
                    });
                });
            },
            //选择不同版本号显示相应内容
            selectVersions(value){
                if(this.apiBases.length>0){
                    this.disabledAddApi=false;
                    this.disabledApiOpj = true;
                }
                for(let i=0;i<this.apiBases.length;i++){
                    if(value==this.apiBases[i].versionName){
                        this.currentValue = i;
                        this.newClass.versionName = this.apiBases[i].versionName;
                        this.newClass.basePath = this.apiBases[i].basePath;
                        this.apiBaseId = this.apiBases[i].id;
                        //获取相应版本的所有API
                        this.getApiBases(this.apiBaseId);
                    }
                }
            },
            //获取相应版本的所有API
            getApiBases(apiBaseId){
                var api = '/codegen/api/v1/apiobjs/'+apiBaseId+'/show';
                this.$http.get(api).then((response) => {
                    //获取返回值数据
                    this.getResponseObjName();
                    this.apiObjs = response.data.apiObjs;
                    this.disabled=true;
                    this.isSave=false;
                if (this.apiObjs.length > 0) {
                        this.apiDetials(this.showColor);
                    }else{
                        this.isShow = false;
                        this.disabledApiOpj = true;
                        this.$refs['methodTop'].resetFields();
                        this.formTop.uri= '';
                        this.formTop.requestMethod= '';
                        this.formTop.summary= '';
                        this.formTop.description= '';
                        this.formTop.tag= '';
                        this.formTop.responseObjName= '';
                        this.formTop.responseObjGenericType= '';
                        this.formTop.responseObjGenericFormat='';
                        this.formTop.data1=[];
                    }
                });
            },
            //获取API详细信息
            apiDetials(index){
                this.showColor=index;
                if(this.apiObjs.length>0){
                    if (this.apiObjs[index].responseObjName == 'ResultPageDTO') {
                        this.isResponseObjGeneric = true;
                        this.span = 8
                    } else {
                        this.isResponseObjGeneric = false;
                        this.span = 24;
                    }
                }
                if (this.apiObjs[index].genBasedTableId == null) {
                    this.disabledApiOpj = false;
                    this.isShow=false;
                } else {
                    this.isShow=true;
                    this.disabledApiOpj = true;
                }
                this.apiobjId = this.apiObjs[index].id;
                this.formTop.uri = this.apiObjs[index].uri;
                this.formTop.requestMethod = this.apiObjs[index].requestMethod;
                this.formTop.summary = this.apiObjs[index].summary;
                this.formTop.description = this.apiObjs[index].description;
                this.formTop.tag = this.apiObjs[index].tag;
                this.formTop.responseObjName = this.apiObjs[index].responseObjName;
                this.formTop.responseObjGenericType = this.apiObjs[index].responseObjGenericType;
                if (this.formTop.responseObjGenericType == 'array') {
                    this.formTop.responseObjGenericFormat = this.apiObjs[index].responseObjGenericArrayType + '.' + this.apiObjs[index].responseObjGenericFormat;
                } else {
                    this.formTop.responseObjGenericFormat = this.apiObjs[index].responseObjGenericFormat;
                }
                var api = '/codegen/api/v1/apiparams/' + this.apiObjs[index].id + '/show';
                this.$http.get(api).then((response) => {
                    this.formTop.data1 = response.data.apiParams;
                    for (let i = 0; i < response.data.apiParams.length; i++) {
                        if (this.formTop.data1[i].type == 'array') {
                            this.formTop.data1[i].format = response.data.apiParams[i].arrayType + '.' + response.data.apiParams[i].format;
                        }
                    }
                });
            },
            //保存和修改版本号和BasePath
            saveVersionNameBasePath(){
                var prjId = this.getData();
                this.$refs['topAPI'].validate((valid) => {
                    if(valid){
                        let message={}
                        var addMessage ={
                            projectId: prjId,
                            basePath: this.newClass.basePath,
                            versionName:  this.newClass.versionName
                        };
                        var updeteMessage ={
                            projectId: prjId,
                            id: this.apiBaseId,
                            basePath: this.newClass.basePath,
                            versionName:  this.newClass.versionName
                        };
                        if(this.apiBaseId==null){
                            message=addMessage
                        }else{
                            message=updeteMessage
                        }
                        this.$http({
                            method: 'post',
                            url: '/codegen/api/v1/apibase/save',
                            data: message,
                            showLoading : true
                        }).then((response) => {
                            if(response.data.statusCode == '200'){
                                this.getEntityData(prjId);
                                if(this.apiBases.length>0){
                                    this.disabledAddApi=false;
                                }
                                this.$Message.success('保存成功')
                        }else{
                                this.$Message.error('保存失败')
                            }
                         });
                    }
                })
            },
            //批量提交
            commit(){
                this.$refs['methodTop'].validate((valid) => {
                    if(valid){
                        this.$refs['responseObjGenericTypeAndFormat'].validate((valid) => {
                            if(valid){
                                var prjId = this.getData();
                                var api = '/codegen/api/v1/apibases/'+prjId+'/show';
                                this.$http.get(api).then((response) => {
                                    this.seveMesAndPar(response.data.apiBases);
                                });
                            }
                        })
                    }
                });
            },
            //保存和修改方法，参数
            seveMesAndPar(arr){
                var apiBaseId=arr[this.currentValue].id;
                var message={};
                var addMessage ={
                    apiBaseId:apiBaseId,
                    apiParams: this.formTop.data1,
                    description: this.formTop.description,
                    requestMethod: this.formTop.requestMethod,
                    responseObjGenericType: this.formTop.responseObjGenericType,
                    responseObjGenericFormat: this.formTop.responseObjGenericFormat,
                    responseObjName: this.formTop.responseObjName,
                    summary: this.formTop.summary,
                    tag: this.formTop.tag,
                    uri: this.formTop.uri
                };
                var updateMessage ={
                    apiBaseId:apiBaseId,
                    apiParams: this.formTop.data1,
                    description: this.formTop.description,
                    requestMethod: this.formTop.requestMethod,
                    responseObjGenericType: this.formTop.responseObjGenericType,
                    responseObjGenericFormat: this.formTop.responseObjGenericFormat,
                    responseObjName: this.formTop.responseObjName,
                    summary: this.formTop.summary,
                    tag: this.formTop.tag,
                    uri: this.formTop.uri,
                    id: this.apiobjId
                };
                if(this.apiobjId==undefined){
                    message=addMessage
                }else{
                    message=updateMessage
                }
                this.$http({
                    method: 'post',
                    url: '/codegen/api/v1/apiobj/save',
                    data: message,
                    showLoading : true
                }).then((response) => {
                    if(response.data.statusCode == '200'){
                        if(this.apiBases.length>0){
                            this.disabledAddApi=false;
                        }
                        this.getApiBases(this.apiBaseId);
                        this.$Message.success('保存成功')
                    }else{
                        this.$Message.error('保存失败')
                    }
                });
            },
            //删除api
            deleteApi(){
                var api = '/codegen/api/v1/apibase/'+this.apiBaseId+'/delete';
                this.$http.delete(api).then((response) => {
                    if(response.data.statusCode == '200'){
                        this.$Message.success('删除成功')
                    }else{
                        this.$Message.error('删除失败')
                    }
            });
            },
            //删除apiObj
            deleteApiObj(){
                var api = '/codegen/api/v1/apiobj/'+this.apiobjId+'/delete';
                this.$http.delete(api).then((response) => {
                    if(response.data.statusCode == '200'){
                        this.$Message.success('删除成功')
                    }else{
                        this.$Message.error('删除失败')
                    }
            });
            },
            //点击版本名及basePath和api的删除按钮时弹出对应的对话框
            showDeleteApiModel(){
                this.deleteParam=true;
                this.deleteState=1;
            },
            showDeleteApiObjModel(){
                this.deleteParam=true;
                this.deleteState=2;
            },
            remove () {
                switch (this.deleteState)
                {
                    case 1:
                        this.deleteApi();
                        this.deleteParam = false;
                        break;
                    case 2:
                        this.deleteApiObj();
                        this.deleteParam = false;
                        break;
                    default:
                        this.formTop.data1.splice(this.index, 1);
                        this.deleteParam = false;
                }
            },
            //获取返回值数据
            getResponseObjName(){
                this.$http.get('/codegen/api/v1/project/'+this.getData()+'/dto_po').then((response) => {
                        this.ResponseObjName = response.data;
                });
            },
            ok(){
                if(this.addOrUpdate=='新增参数'){
                    this.newData();
                }else {
                    this.modifyData();
                }
            },
            cancel(){
                this.$refs['updatePropForm'].resetFields();
            },
            cance3(){
                this.disabled=true;
                this.isSave=false;
            },
            cance2 () {
                this.remove();
                this.$refs['addform'].resetFields();
            },
            //新增数据
            addProp(){
                this.addOrUpdate='新增参数';
                this.updateParam=true;
                this.$refs['updatePropForm'].resetFields();
                this.$refs['updatePropForm'].validate((valid) => {
                    if(valid){
                    }
                })
            },
            //新增后的数据给data1
            newData() {
                this.$refs['updatePropForm'].validate((valid) => {
                    if(valid){
                        var data = {};
                        data.name = this.formTop.propData.name;
                        data.form = this.formTop.propData.form;
                        data.description = this.formTop.propData.description;
                        data.isRequired = this.formTop.propData.isRequired;
                        data.type = this.formTop.propData.type;
                        data.format = this.formTop.propData.format;
                        this.formTop.data1.push(data);
                    }
                });
            },
            // 修改后数据保存到data1
            modifyData() {
                this.$refs['updatePropForm'].validate((valid) => {
                    if(valid){
                        let index=this.index;
                        this.formTop.data1[index].name = this.formTop.propData.name;
                        this.formTop.data1[index].form = this.formTop.propData.form;
                        this.formTop.data1[index].description = this.formTop.propData.description;
                        this.formTop.data1[index].isRequired = this.formTop.propData.isRequired;
                        this.formTop.data1[index].type = this.formTop.propData.type;
                        this.formTop.data1[index].format = this.formTop.propData.format;
                    }
                });
            },
            //data1的数据给propData
            show (index){
                this.formTop.propData.name = this.formTop.data1[index].name;
                this.formTop.propData.form = this.formTop.data1[index].form;
                this.formTop.propData.description = this.formTop.data1[index].description;
                this.formTop.propData.isRequired = this.formTop.data1[index].isRequired;
                this.formTop.propData.type = this.formTop.data1[index].type;
                this.formTop.propData.format = this.formTop.data1[index].format;
                this.$refs['updatePropForm'].validate((valid) => {
                    if(valid){
                    }
                })
            },
            returnValueChange(){
                if(this.formTop.responseObjName=='ResultPageDTO'){
                    this.span=8;
                    this.isResponseObjGeneric=true;
                    this.$refs['responseObjGenericTypeAndFormat'].validate((valid) => {
                        if(valid){
                        }
                    })
                }else{
                    this.span=24;
                    this.isResponseObjGeneric=false;
                    this.formTop.responseObjGenericType='';
                    this.formTop.responseObjGenericFormat=''
                }
            },
            addRow(){
                var formTopList = {
                    description: '',
                    tag: '',
                    responseObjName: 'ResultDTO',
                    responseObjGenericType: '',
                    data1: [],
                    responseObjGenericFormat:'',
                    uri: '',
                    summary: '',
                    requestMethod: ''
                };
                this.apiObjs.push(formTopList);
                this.$refs['methodTop'].resetFields();
                this.apiDetials(this.apiObjs.length-1);
                this.disabledAddApi=true;
            },
            addVersionNameBasePath(){
                this.$refs['addVersionAndBasePath'].resetFields();
                this.addVersionNameAndBasePath=true;
                this.$refs['addVersionAndBasePath'].validate((valid) => {
                    if(valid){

                    }
                })
            },
            addVersionNameAndBasePathOk(){
                this.$refs['addVersionAndBasePath'].validate((valid) => {
                    if(valid){
                        this.disabled=false;
                        this.newClass.versionName=this.modelClass.versionName;
                        this.newClass.basePath= this.modelClass.basePath;
                        this.apiBaseId='';
                        this.disabledAddApi=true;
                        this.saveVersionNameBasePath()
                    }
                });
            },
            updateVersionNameAndBasePath(){
                if(this.apiBases.length>0){
                    this.disabled=false;
                    this.isSave=true;
                }
            },
        }
    };
</script>
