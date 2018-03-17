<style>
    .tab-content {
        background-color: #fff;
        border: 1px solid #dddee1;
        border-top: none;
        height: 100%;
        width: 100%;
        padding: 16px;
    }
    .add-positon {
        width: 100%;
        text-align: right;
        margin-bottom: 8px;
    }

    .mag-buttons button{
        margin-right: 8px;
    }

    .validate-hide .ivu-form-item-required .ivu-form-item-label:before {
        display: none;
    }

    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }

    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .loading-modal .ivu-modal {
        top:0px;
    }
    .loading-modal .ivu-modal-content {
        background: transparent;
    }

    .loading-modal .ivu-spin-fix {
        background: transparent;
    }
    .loading-modal .ivu-modal-footer {
        display: none;
    }
    .loading-modal .ivu-spin-text {
        color: #eee;
    }
</style>
<template>
    <div class="tab-content" style="overflow: auto">
        <div class="add-positon">
            <Button type="primary" style="width: 80px" @click="createPro">新增</Button>
        </div>
        <Table :data="tableData1" :columns="tableColumns1" stripe></Table>
        <div style="margin: 10px;overflow: hidden">
            <div style="float: right;">
                <Page :total="totalNum" :page-size="pageSize" :current="currentPage" @on-change="changePage" show-total placement="top"></Page>
            </div>
        </div>
        <Modal v-model="addModal" title="新增项目" width="800">
            <Steps :current="stepCurrent">
                <Step title="步骤1"></Step>
                <Step title="步骤2"></Step>
                <Step title="步骤3"></Step>
            </Steps>
            <div style="margin: 16px 0; width: 100%;">
                <Form ref="form1" :model="formTop" :rules="ruleValidate" label-position="top" v-show="stepCurrent == 0">
                    <Form-item label="项目名" prop="name">
                        <i-input v-model="formTop.name" placeholder="demo"></i-input>
                    </Form-item>
                    <Form-item label="项目包名" prop="packages">
                        <i-input v-model="formTop.packages" placeholder="com.changan.demo"></i-input>
                    </Form-item>
                    <Form-item label="标题">
                        <i-input v-model="formTop.description" placeholder="请输入标题"></i-input>
                    </Form-item>
                </Form>
                <Form ref="addform" :model="formDb" :rules="ruleValidate"  label-position="top" v-show="stepCurrent == 1" class="validate-hide">
                    <Form-item label="数据库类型" prop="dbtype">
                        <Select v-model="formDb.dbtype" placeholder="请选择">
                            <Option value="mysql">mysql</Option>
                            <Option value="oracle">oracle</Option>
                        </Select>
                    </Form-item>
                    <Row>
                        <Col span="11">
                        <Form-item label="数据库地址" prop="dburl">
                            <i-input v-model="formDb.dburl" placeholder=""></i-input>
                        </Form-item>
                        </Col>
                        <Col span="2">&nbsp;</Col>
                        <Col span="11">
                        <Form-item label="数据库名称" prop="dbname">
                            <i-input v-model="formDb.dbname" placeholder=""></i-input>
                        </Form-item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="11">
                        <Form-item label="数据库用户名" prop="dbuser">
                            <i-input v-model="formDb.dbuser" placeholder=""></i-input>
                        </Form-item>
                        </Col>
                        <Col span="2">&nbsp;</Col>
                        <Col span="11">
                        <Form-item label="数据库密码" prop="dbpassword">
                            <i-input v-model="formDb.dbpassword" placeholder=""></i-input>
                        </Form-item>
                        </Col>
                    </Row>
                    <div class="add-positon">
                        <Button type="primary" size="small" style="width: 80px" @click="addDbInfo">添加</Button>
                    </div>
                    <Table :columns="dbColumns" :data="formTop.datasources" border v-show="formTop.datasources.length > 0"></Table>
                </Form>
                <Form ref="form3" :model="formTop" :rules="ruleValidate" label-position="top" v-show="stepCurrent == 2">
                    <div v-if="categories.length > 0" v-for="item in categories" :key="item.category" style="margin: 8px">
                        <Form-item :label="item.category" prop="componentMap">
                            <CheckboxGroup v-if="item.isMultiSelect == 1" v-model="formTop.componentMap[item.category]">
                                <Checkbox :label="check.code" v-for="check in item.components" :key="check.code">
                                    {{check.cname}}
                                </Checkbox>
                            </CheckboxGroup>
                            <RadioGroup v-if="item.isMultiSelect == 0" v-model="formTop.componentMap[item.category]">
                                <Radio :label="check.code" v-for="check in item.components" :key="check.code">
                                    {{check.cname}}
                                </Radio>
                            </RadioGroup>
                        </Form-item>
                    </div>
                    <div v-if="formTop.componentMap['安全组件'] === 'rescentersecurity'" style="display: inline-flex;">
                        <Button v-if="!formTop.userName" style="margin: 8px" type="primary"  @click="modalh = true">管理员配置</Button>
                        <Button v-else style="margin: 8px" type="primary"  disabled>管理员配置</Button>
                        <p style="margin: 16px" v-if="formTop.userName">管理员:{{formTop.userName}}   ({{formTop.departmentName}})</p>
                    </div>
                </Form>
            </div>
            <div slot="footer">
                <Button type="text" @click="cancel">取消</Button>
                <Button @click="prevStep" v-if="stepCurrent != 0">上一步</Button>
                <Button type="primary"  @click="nextStep">{{stepCurrent != 2 ? '下一步' : '完成'}}</Button>
            </div>
        </Modal>
        <modal
                v-on:setback="cancel1"
                v-on:adminConfig="adminConfigs"
                :addPersonModal="modalh">
        </modal>
        <Modal
                v-model="loading" :closable="false" :mask-closable="false" class-name="vertical-center-modal loading-modal" width="110">
                <Spin fix>
                    <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                    <div>Loading</div>
                </Spin>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import modal from './addRole.vue';
    export default {
        data () {
            return {
                modalh:false,//控制框
                param : {
                    orders: [
                        {
                            fieldName: 'createdAt',
                            orderType: 'DESC'
                        }
                    ],
                    pageParms: {
                        autoRecordCount: true,
                        pageIndex: 0,
                        pageSize: 0,
                        recordCount: 0
                    }
                },
                //dictGroup:'否',
                loading : false,
                totalNum : 0,//总条数
                currentPage : 1, //当前页
                pageSize: 10,
                stepCurrent : 0,
                addModal : false,
                tableData1: [],
                categories : [],
                formDb: {
                    dbpassword: '',
                    dbtype: '',
                    dburl: '',
                    dbuser: '',
                    dbname: ''
                },
                formTop: {
                    id : '',
                    components: '',
                    datasources: [],
                    componentMap: {},
                    description: '',
                    name: '',
                    packages: '',
                    securityConfig: 0,
                    userId: '',
                    userName: '',
                    departmentName: '',
                },
                ruleValidate : {
                    name: [
                        { required: true, message: '项目名不能为空', trigger: 'blur' }
                    ],
                    packages: [
                        { required: true, message: '项目包名不能为空', trigger: 'blur' }
                    ],
                    dbtype: [
                        { required: true, message: '请选择数据库类型', trigger: 'no'}
                    ],
                    dbname: [
                        { required: true, message: '数据库名称不能为空', trigger: 'no'}
                    ],
                    dbuser: [
                        { required: true, message: '数据库用户名不能为空', trigger: 'no' }
                    ],
                    dburl: [
                        { required: true, message: '数据库地址不能为空', trigger: 'no' }
                    ],
                    dbpassword: [
                        { required: true, message: '数据库密码不能为空', trigger: 'no' }
                    ]
                },
                dbColumns : [{
                    title : '数据库类型',
                    key : 'dbtype',
                    width : 100
                },{
                    title : '数据库地址',
                    key : 'dburl',
                    width : 367
                },{
                    title : '数据库名称',
                    key : 'name',
                    width : 100
                },{
                    title : '数据库用户',
                    key : 'dbuser',
                    width : 100
                },{
                    title : '操作',
                    width : 100,
                    render: (h, params) => {
                        return h('Button', {
                            props: {
                                size: 'small'
                            },
                            on: {
                                click: () => {
                                    this.removeDbInfo(params);
                                }
                            }
                        }, '移除');
                    }
                }],
                tableColumns1: [
                    {
                        title: '项目名',
                        key:'name',
                        width:"12%"
                    },
                    {
                        title: '标题',
                        key:'description',
                        width:"12%"
                    },
                    {
                        title: '包路径',
                        key: 'packages',
                        width:"16%"
                    },
                    {
                        title: '创建时间',
                        key: 'createdAt',
                        width:"16%"
                    },
                    {
                        title: '更新时间',
                        key: 'updatedAt',
                        width:"16%"
                    },
                    {
                        title: '操作',
                        render: (h, params) => {
                            return h('div', {
                                class: 'mag-buttons'
                            },[
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.updatePro(params.index);
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.addTab(params, 'data-mag')
                                        }
                                    }
                                }, '数据库信息'),
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.addTab(params, 'api-mag')
                                        }
                                    }
                                }, 'API'),
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.addTab(params, 'enti-mag')
                                        }
                                    }
                                }, '实体配置'),
                        h('Dropdown',{//div>Dropdown标签
                            props:{
                                trigger:'hover'
                            },
                            style: {
                                marginRight: 'margin-left: 20px'
                            }
                        },[
                            h('Button',{
                                props: {
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '7px'
                                },
                            },['生成代码并下载',
                                h('Icon',{
                                    props: {
                                        type:'arrow-down-b'
                                    },
                                })
                            ]),
                            h('Dropdown-menu',{
                                slot:'list',
                            },[h('Dropdown-item',{},
                            [h('span',{
                                    on: {
                                        click: () => {
                                            this.genBackCo(params.row.id, params.row.name);
                                        }
                                    }
                                 },'生成后端代码并下载')]),
                                 h('Dropdown-item',{
                                 } ,[h('span',{
                                    on: {
                                        click: () => {
                                            this.genFrontCo(params.row.id, params.row.name);
                                        }
                                    }
                                },'生成前端代码并下载')])]),
                                ])
                            ]);
                        }
                    }
                ]
            }
        },
        created: function () {
            this.getTableData(1);
            this.getComponents();
        },
        components:{
            modal
        },
        methods: {
            //生成后端代码
            genBackCo (prjId, name) {
                this.$http({
                    method: 'get',
                    url: '/codegen/api/v1/projects/'+ prjId +'/generate/code',
                    data: '',
                    showLoading : true
                }).then((response) => {
                    if (response.status === 200) {
                        let url = global.host + response.data.msgData;
                        let fileName = name + '.zip';
                        this.download(url, fileName);
                    } else {
                        this.$Message.error('代码生成失败')
                    }
                });
            },
            //生成前端代码
            genFrontCo (prjId, name) {
                let url = global.host +  '/codegen/api/v1/projects/'+prjId+'/downloadUI';
                let fileName = name + '-ui.zip';
                this.download(url, fileName);
            },
            download(url, fileName){
                let xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.setRequestHeader('AUTH_TOKEN', this.$store.getters.loginInfo.authToken);
                xhr.setRequestHeader('CURRENT_USER', this.$store.getters.loginInfo.loginId);
                xhr.responseType = "blob";
                xhr.onload = function () {
                    if (this.status === 200) {
                        let blob = this.response;
                        let reader = new FileReader();
                        reader.readAsDataURL(blob);    // 转换为base64，可以直接放入a表情href
                        reader.onload = function (e) {
                            // 转换完成，创建一个a标签用于下载
                            let body = document.body;
                            let a = document.createElement('a');
                            a.download = fileName;
                            a.href = e.target.result;
                            body.appendChild(a);
                            a.click();
                            body.removeChild(a);
                        }
                    }
                }
                xhr.send();
            },
            getComponents() {
                this.$http.get('/codegen/api/v1/projects/components/default').then((response)=>{
                    this.categories = response.data.categories;
                    var componentsMap={};
                    for (let i = 0; i < this.categories.length; i++) {
                        if (this.categories[i].isMultiSelect == 1) {
                            componentsMap[this.categories[i].category] = [];
                        } else {
                            componentsMap[this.categories[i].category] = '';
                        }
                    }
                    this.formTop.componentsMap = Object.assign({}, this.formTop.componentsMap, componentsMap);
//                    console.log(this.formTop.componentsMap);
                });
            },
            //后台获取数据
            getTableData : function (pageNum) {
                var _this = this;
                this.param.pageParms.pageIndex = pageNum - 1;
                this.param.pageParms.pageSize = this.pageSize;
                this.$http.post('/codegen/api/v1/projects',this.param).then((response) => {
                    _this.tableData1 = response.data.data;
                    _this.totalNum = response.data.totalElements;
                    _this.currentPage = pageNum;
                });
            },
            //翻页
            changePage (index) {
                // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
                this.tableData = this.getTableData(index);
            },
            //修改项目
            updatePro: function(index) {
                this.stepCurrent = 0;
                this.$http.get('/codegen/api/v1/projects/'+this.tableData1[index].id + '/show').then((response) => {
                    this.formTop.datasources = response.data.project.datasources;
                    this.formTop.name = response.data.project.name;
                    this.formTop.packages = response.data.project.packages;
                    this.formTop.description = response.data.project.description;
                    this.formTop.securityConfig = response.data.project.securityConfig;
                    this.formTop.components = response.data.project.components;
                    this.formTop.id = response.data.project.id;
                    this.formTop.userId = response.data.project.userId;
                    this.formTop.userName = response.data.project.userName;
                    this.formTop.departmentName = response.data.project.departmentName;
                    this.formTop.componentMap = Object.assign({}, this.formTop.componentsMap, response.data.project.componentsMap);
                });
                this.addModal = true;
            },
            //新增项目
            createPro: function () {
                this.cancel();
                this.addModal = true;
            },
            addTab (data, componentType) {
                var _this = this;
                this.$emit('child-addTab', {
                    label : function(){
                        switch (componentType) {
                            case 'data-mag' :
                                return  _this.tableData1[data.index].name + '_项目数据库';
                            case 'enti-mag' :
                                return  _this.tableData1[data.index].name + '_实体配置';
                            case 'api-mag' :
                                return  _this.tableData1[data.index].name + '_Api';
                            case 'view-mag' :
                                return  _this.tableData1[data.index].name + '_页面配置';
                        }
                    },
                    id : componentType + data.index,
                    componentType : componentType,
                    someData: function(){
                        let ownData = '';
                        switch (componentType) {
                            case 'data-mag' :
                                ownData = _this.tableData1[data.index].id;
                                return  ownData;
                            case 'enti-mag' :
                                ownData = _this.tableData1[data.index].id;
                                return  ownData;
                            case 'api-mag' :
                                ownData = _this.tableData1[data.index].id;
                                return  ownData;
                            case 'view-mag' :
                                return  ownData = _this.tableData1[data.index].id
                        }
                    },
                });
            },
            show (index) {
                this.$Modal.info({
                    title: '用户信息',
                    content: `sssss`
                })
            },
            remove (index) {
                this.tableData1.splice(index, 1);
            },
            cancel () {
                this.$refs['form1'].resetFields();
                this.$refs['addform'].resetFields();
                this.$refs['form3'].resetFields();
                this.formTop.description = '';
                this.formTop.id = '';
                this.formTop.userId = '';
                this.formTop.userName = '';
                this.formTop.departmentName = '';
                this.formTop.datasources = [];
                this.stepCurrent = 0;
                this.addModal = false;
                this.formTop.componentMap = {};
            },
            prevStep() {
                if (this.stepCurrent > 0) {
                    this.stepCurrent--;
                }
            },
            nextStep () {
                if (this.stepCurrent == 2) {
                    this.stepCurrent = 0;
                    this.addModal = false;
                    let components = '';
                    for (let key in this.formTop.componentMap) {
                        if (this.formTop.componentMap[key] != null) {
                            components += this.formTop.componentMap[key].toString() + ',';
                        }
                    }
                    components = components.substr(0, components.length - 1);
                    this.formTop.components = components;
                    //添加
                    this.$http({
                        method: 'post',
                        url: '/codegen/api/v1/project/save',
                        data: this.formTop,
                        showLoading : true
                    }).then((response) => {
                        this.formTop = {
                            id : '',
                            components: '',
                            datasources: [],
                            componentMap: {},
                            description: '',
                            name: '',
                            packages: '',
                            securityConfig: 0,
                            userId: '',
                            userName: '',
                            departmentName: '',
                        };
                        this.getTableData(1);
                    });
                } else {
                    if (this.$refs['form'+ (this.stepCurrent + 1)]) {
                        this.$refs['form'+ (this.stepCurrent + 1)].validate((valid) => {
                            if (valid) {
                                this.stepCurrent += 1;
                            }
                        });
                    } else {
                        this.stepCurrent += 1;
                    }
                }
            },
            cancel1(){
                this.modalh= false;
            },
            adminConfigs(data){
                this.formTop.userId = data.adminId;
                this.formTop.userName = data.adminName;
                this.formTop.departmentName = data.adminDepart;
                this.modalh= false;
            },
            // 添加数据库信息
            addDbInfo () {
                this.$refs['addform'].validate((valid) => {
                    if (valid) {
                        var db = {
                            name : this.formDb.dbname,
                            dbtype : this.formDb.dbtype,
                            dburl : this.formDb.dburl,
                            dbuser : this.formDb.dbuser,
                            dbpassword : this.formDb.dbpassword
                        };
                        this.$http.post('/codegen/api/v1/datasource/check', db).then((response) => {
                            if (response.data.statusCode == '200') {
                                this.formTop.datasources.push({
                                    name : this.formDb.dbname,
                                    dbtype : this.formDb.dbtype,
                                    dburl : this.formDb.dburl,
                                    dbuser : this.formDb.dbuser,
                                    dbpassword : this.formDb.dbpassword
                                });
                                this.$refs['addform'].resetFields();
                            }
                        });
                    }
                });
            },
            // 删除数据库信息
            removeDbInfo (params) {
                this.formTop.datasources.splice(params.index, 1);
            }
        }
    }
</script>
