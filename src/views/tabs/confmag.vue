<style scoped>
    .tab-content {
        background-color: #fff;
        border: 1px solid #dddee1;
        border-top: none;
        height: calc(100% - 76px);
        width: 100%;
        padding: 16px;
    }
    .add-positon {
        width: 100%;
        text-align: right;
        margin-bottom: 8px;
    }
    .tab-conf-content-block {
        background: #f5f7f9;
        width: 100%;
        height: 100%;
        padding: 16px;
        border: 1px solid #dddee1;
        border-radius: 4px;
        overflow: auto;
    }

    .tab-conf-content-block .ivu-table-wrapper {
        height:100%;
    }

    .regix-show-out {
        display: none;
    }
</style>
<style>
    .test .ivu-modal-wrap{
        z-index: 1001;
    }
</style>
<template>
    <div>
        <Modal v-model="dictModal"
               @on-cancel="dictCancel"
               :mask-closable="false">
            <p slot="header" class="title">
                <span>字典表value配置</span>
            </p>
            <div>
                <Row>
                    <Col span="24">
                    <div style="margin-bottom: 2px; margin-top: 2px;padding-right: 2px;float: right;display: inline-block;">
                        <Button style="margin-bottom: 15px" @click="newModels">
                            <span>新增</span>
                        </Button>
                    </div>
                    </Col>
                </Row>
                <Table :key="keys" border :columns="valuecolumns" :data="valuedata"></Table>
            </div>
            <div slot="footer">
                <i-button @click="dictCommit">提交</i-button>
                <i-button @click="dictCancel">取消</i-button>
            </div>
        </Modal>
        <Modal v-model="modal2"
               @on-cancel="cancel2('formItem2')"
               :mask-closable="false"
                class="test">
            <p slot="header" class="title">
                <span>{{title}}</span>
            </p>
            <div>
                <Form ref="formItem2" :model="formItem2" :rules="ruleValidate2" :label-width="80">
                    <FormItem label="value" prop="value">
                        <i-input v-model="formItem2.value" style="width: 250px"></i-input>
                    </FormItem>
                    <FormItem label="name" prop="name">
                        <i-input v-model="formItem2.name" style="width: 250px"></i-input>
                    </FormItem>
                    <FormItem label="sort" prop="sort">
                        <i-input v-model="formItem2.sort" style="width: 250px"></i-input>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <i-button type="primary" @click="submit('formItem2')">保存</i-button>
                <i-button @click="cancel2('formItem2')">取消</i-button>
            </div>
        </Modal>
        <div class="tab-content">
            <Row>
                <Col span="18" style="height:100%">
                <div class="tab-conf-content-block">
                    <Table highlight-row @on-current-change="rowSelect" :data="tableData1" :columns="tableColumns1" stripe ></Table>
                </div>
                </Col>
                <Col span="6" style="height:100%">
                <div class="tab-conf-content-block" style="margin:0 10px">
                    <Form ref="formvalid" :rules="formRule" :model="formDispaly">
                        <div style="border-bottom:1px solid #e3e8ee;padding-bottom: 8px;margin-bottom: 5px">
                            <h3>编辑 {{formDispaly.name}} 字段</h3>
                        </div>
                        <!-- <Form-item label="实体属性类型">
                            <Select v-model="formDispaly.javaType" style="width:200px" @on-change="chJavaType">
                                <Option v-for="item in propList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Form-item> -->
                        <Form-item label="是否为空">
                            <Radio-group v-model="formDispaly.isNullable">
                                <Radio label="1">是</Radio>
                                <Radio label="0">否</Radio>
                            </Radio-group>
                        </Form-item>
                        <Form-item label="是否只读">
                            <Radio-group v-model="formDispaly.readOnly">
                                <Radio label="1">是</Radio>
                                <Radio label="0">否</Radio>
                            </Radio-group>
                        </Form-item>
                        <Form-item label="字段描述">
                            <i-input v-model="formDispaly.comments" ></i-input>
                        </Form-item>
                        <Form-item :label="isString?'最小长度':'最小值'" prop="min" v-show="formDispaly.javaType !== 'Date'">
                            <Input v-model="formDispaly.min"></Input>
                        </Form-item>
                        <Form-item :label="isString?'最大长度':'最大值'" prop="max" v-show="formDispaly.javaType !== 'Date'">
                            <Input v-model="formDispaly.max"></Input>
                        </Form-item>
                        <Form-item :label="isString?'正则表达式':''">
                            <div :class="isString?'':'regix-show-out'">
                                <i-input v-model="formDispaly.pattern"></i-input>
                            </div>
                        </Form-item>
                        <FormItem label="字典值" v-if="dictFlag">
                            <Button v-if="addDict==false" type="dashed" style="border: none;float: right" @click="addDict=true" title="添加字典值">
                                <Icon type="plus-round" size="12"></Icon>
                            </Button>
                            <Button v-else="addDict" type="dashed" style="border: none;float: right" @click="addDict=false" title="取消添加字典值">
                                <Icon type="minus-round"></Icon>
                            </Button>
                            <Select :key="keys1" v-if="addDict==false" placement="top" v-model="formDispaly.dictCode" filterable>
                                <Option v-for="item in dictList" :value="item.code" :label="item.code" :key="item.code">
                                    <span>{{item.code}}</span>
                                    <span style="float:right;">{{item.name}}</span>
                                </Option>
                            </Select>
                        </FormItem>
                        <FormItem v-if="addDict" label="code" prop="dictCodes" :label-width="80">
                            <i-input v-model="formDispaly.dictCodes"></i-input>
                        </FormItem>
                        <FormItem v-if="addDict" label="name":label-width="80">
                            <i-input v-model="formDispaly.dictNames"></i-input>
                        </FormItem>
                        <Button v-if="dictFlag && addDict && (formDispaly.dictCodes !== '')" style="margin-bottom:24px " @click="deploy">字典表value配置</Button>
                        <Button v-if="dictFlag && addDict && (formDispaly.dictCodes === '')" disabled style="margin-bottom:24px " @click="deploy">字典表value配置</Button>
                        <Button v-if="dictFlag && !addDict && (formDispaly.dictCode !== '无字典值')&& (formDispaly.dictCode !== '')" style="margin-bottom:24px " @click="deploy">字典表value配置</Button>
                        <Button v-if="dictFlag && !addDict && ((formDispaly.dictCode === '无字典值') || (formDispaly.dictCode === ''))" disabled style="margin-bottom:24px " @click="deploy">字典表value配置</Button>
                        <Form-item>
                            <Row>
                                <Col span="5">
                                <Button type="primary" @click="commit">提交</Button>
                                </Col>
                            </Row>
                        </Form-item>
                    </Form>
                </div>
                </Col>
            </Row>
        </div>
    </div>
</template>
<script type="text/ecmascript-6">
    import util from '../../libs/util';
    export default {
        data () {
            return {
                formItem2: {
                    value: '',
                    name: '',
                    sort:''
                },
                addDict:false,
                dictList:[],
                keys:1,
                keys1:1,
                index:'',
                ruleValidate2: {
                    value: [
                        { required: true, message: 'value不能为空', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: 'name不能为空', trigger: 'blur' }
                    ],
                    sort: [
                        { required: true, message: 'sort不能为空', trigger: 'blur' },
                        {pattern:/^\d*$/, message: '只能为数字', trigger: 'change'}
                    ]
                },
                dictModal:false,
                modal2:false,
                valuesCopy:'',
                namesCopy:'',
                sortsCopy:'',
                title:'',
                valuecolumns:[
                    {
                        title: 'value',
                        key: 'value'
                    },
                    {
                        title: 'name',
                        key: 'name'
                    },
                    {
                        title: '排序',
                        key: 'sort',
                        sortable: true
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        //type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.index=params.index;
                                            this.valuesCopy=params.row.value;
                                            this.namesCopy=params.row.name;
                                            this.sortsCopy=params.row.sort;
                                            this.updateModels();
                                        }
                                    }
                                }, '修改'),
                                h('Button', {
                                    props: {
                                        //type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.delete(params.index)
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                valuedata:[],
                formRule: {
                    min: [
                        {pattern:/^\d*$/, message: '只能为数字', trigger: 'change'}
                    ],
                    max: [
                        {pattern:/^\d*$/, message: '只能为数字', trigger: 'change'}
                    ],
                    dictCodes:[
                        { required: true, message: 'code不能为空', trigger: 'change' }
                    ]
                },
                propList: [
                    {
                        value: "String",
                        label: "String"
                    },
                    {
                        value: "Integer",
                        label: "Integer"
                    },
                    {
                        value: "LocalDateTime",
                        label: "LocalDateTime"
                    }
                ],
                formDispaly: {
                    name: '',
                    comments: '',
                    isNullable: '',
                    //javaType: '',
                    readOnly: '',
                    max: '',
                    min: '',
                    pattern: '',
                    dictCode:'',
                    dictCodes:'',
                    dictNames:''
                },
                isString: true,
                isEmpty: '1',
                readOnly: '0',
                tableData1: [],
                dictFlag:false,
                dicts:'',
                tableColumns1: [
                    {
                        title: '字段名',
                        key: 'name'
                    },
                    {
                        title: '实体属性名',
                        key: 'javaField'
                    },
                    {
                        title: '字段类型',
                        key: 'jdbcType',
                        //width: 200
                    },
                    {
                        title: '实体属性类型',
                        key: 'javaType',
                        //width: 200,
                    },
                    {
                        title: '字段描述',
                        key: 'comments',
                    },
                    {
                        title: '是否为空',
                        key: 'isNullable',
                        render: (h, params) => {
                            if (params.row.isNullable === '0') {
                                return '否'
                            } else if (params.row.isNullable === '1') {
                                return '是'
                            }
                        }
                    },
                    {
                        title: '是否只读',
                        key: 'readOnly',
                        render: (h, params) => {
                            if (params.row.readOnly === '0') {
                                return '否'
                            } else if (params.row.readOnly === '1') {
                                return '是'
                            }
                        }
                    }
                ]
            }
        },
        props: ["getData"],
        created :function () {
            this.mockTableData1();
            //this.queryDict();
        },
        watch:{
            dictFlag:function(){
                this.initAction();
                this.queryDict();
            },
            "formDispaly.dictCode":function(){
                if(this.formDispaly.dictCode===''){
                    this.formDispaly.dictCode="无字典值";
                }
            },
            dicts:function(){
                this.formDispaly.dictCode=this.dicts;
            },
        },
        methods: {
            deploy(){
                this.valuedata=[];
                var tableId=this.getData();
                var codes='';
                if(this.addDict){
                    codes=this.formDispaly.dictCodes;
                }else{
                    codes=this.formDispaly.dictCode;
                }
                util.ajax.post('/demo/api/v1/table/'+tableId+'/dict_type/'+codes).then((res)=>{
                    this.valuedata=res.data.dictValues;
                }).catch((error)=>{
                });
                this.dictModal=true;
            },
            delete(index){
                this.valuedata.splice(index, 1);
                this.keys=-this.keys;
            },
            findI(dictCode){
                for(var i=0;i<this.dictList.length;i++){
                    if(this.dictList[i].code===dictCode)
                            return i;
                }
            },
            dictCommit(){
                var tableId=this.getData();
                var dictCode='';
                var dictName='';
                var dictId='';
                if(this.addDict){
                    dictCode=this.formDispaly.dictCodes;
                    dictName=this.formDispaly.dictNames;
                    dictId='';
                }else{
                    dictCode=this.formDispaly.dictCode;
                    var i=this.findI(dictCode);
                    dictName=this.dictList[i].name;
                    dictId=this.dictList[i].id;
                }
                util.ajax.post('/demo/api/v1/table/'+tableId+'/dict_type/'+dictCode+'/dict_values',{
                    "dictType": {
                        "code": dictCode,
                        "id": dictId,
                        "name": dictName
                    },
                    "dictValues": this.valuedata
                }).then((res)=>{
                    this.$Message.info('字典表value配置成功')
                    this.dictModal=false;
                    this.valuedata=[];
                    this.queryDict();
                }).catch((error)=>{
                });
            },
            queryDict(){
                var tableId=this.getData();
                var obj={
                    code:"无字典值",
                    name:''
                };
                this.dictList = [];
                util.ajax.get('/demo/api/v1/table/'+tableId+'/dict_type').then((res)=>{
                    this.dictList=res.data.dictTypes;
                    this.dictList.unshift(obj);
                    this.keys1=-this.keys1;
                    this.formDispaly.dictCode=this.dicts;
                }).catch((error)=>{
                });
            },
            submit(name){
                if(this.title=='新建value模型'){
                    this.$refs[name].validate((valid) => {
                        if (valid) {
                            this.modal2= false;
                            this.valuedata.push(this.formItem2);
                            this.keys=-this.keys;
                            this.formItem2 = {value: '', name: '', sort: ''}
                        } else {
                            this.$Message.error('请正确填写表单')
                        }
                    })
                }
                else if(this.title=='修改value模型'){
                    this.$refs[name].validate((valid) => {
                        if (valid) {
                            this.modal2 = false;
                            this.valuedata[this.index]=this.formItem2;
                            this.keys=-this.keys;
                            this.formItem2 = {value: '', name: '', sort: ''}
                        } else {
                            this.$Message.error('请正确填写表单')
                        }
                    })
                }
            },
            updateModels () {
                this.modal2= true;
                this.title='修改value模型';
                this.formItem2.value=this.valuesCopy;
                this.formItem2.name=this.namesCopy;
                this.formItem2.sort=this.sortsCopy.toString();
            },
            newModels () {
                this.modal2= true;
                this.title='新建value模型';
            },
            dictCancel(){
              this.dictModal=false;
            },
            cancel2(name){
                this.modal2= false;
                this.$refs[name].resetFields();
            },
            commit () {
                var tableId=this.getData();
                var disData = {};
                var commitData = {};
                var index;
                var _this = this;
                disData = this.formDispaly;
                if (disData.name === '') {
                    this.$Message.error('请选择字段')
                } else {
                    let j;
                    for (j = 0; j < this.tableData1.length; j++) {
                        if ( disData.name === this.tableData1[j].name){
                            index = j
                        }
                    }
                    commitData = this.tableData1[index];
                    commitData.isNullable = disData.isNullable;
                    commitData.readOnly = disData.readOnly;
                    commitData.comments = disData.comments;
                    commitData.tableId = this.getData(); //在请求参数中加入tableId
                    commitData.min = disData.min;
                    commitData.max = disData.max;
                    if(this.dictFlag){
                        if(this.addDict){
                            commitData.dictTypeCode = disData.dictCodes
                        }else{
                            if(this.formDispaly.dictCode==='无字典值'){
                                commitData.dictTypeCode=''
                            }else{
                                commitData.dictTypeCode = disData.dictCode
                            }
                        }
                    }
                    if ( this.isString === true ) {
                        commitData.pattern = disData.pattern
                    } else {
                        commitData.pattern = ''
                    }
                    for (var k in commitData) {
                        var value = commitData[k];
                        if (value === null) {
                            delete commitData[k];
                        }
                    }
                    //var commitJson = JSON.stringify(commitData)
                    //console.log(typeof(commitData.min))
                    if (commitData.max !== null && commitData.max !== '' && commitData.max < commitData.min){
                        this.$Message.error('最小值大于最大值')
                    } else {
                        this.$refs['formvalid'].validate((valid) => {
                            if (valid){
                                if(this.dictFlag){
                                    var dictCode='';
                                    var dictName='';
                                    var dictId='';
                                    if(this.addDict){
                                        dictCode=this.formDispaly.dictCodes;
                                        if(this.formDispaly.dictNames)
                                            dictName=this.formDispaly.dictNames;
                                        else dictName='';
                                        dictId='';
                                    }else{
                                        dictCode=this.formDispaly.dictCode;
                                        if(dictCode){
                                            if(this.formDispaly.dictCode==='无字典值'){
                                                dictCode='';
                                                dictName='';
                                            }else{
                                                var i = 0;
                                                i=this.findI(dictCode);
                                                dictName=this.dictList[i].name;
                                                dictId=this.dictList[i].id;
                                            }
                                        }
                                    }
                                    this.dicts=dictCode;
                                    util.ajax.post('/codegen/api/v1/table/'+tableId+'/column/dict/save',{
                                        "column":commitData,
                                        "dictType":{
                                            "code": dictCode,
                                            "id": dictId,
                                            "name": dictName
                                        }
                                    }).then((res)=>{
                                        _this.mockTableData1();
                                        _this.$Message.success('提交成功');

                                        if(dictCode){
//                                            this.dicts=dictCode;
                                        }
                                        else{
                                            this.formDispaly.dictCode='';
                                        }
                                        _this.addDict=false;
                                        _this.formDispaly.dictCodes='';
                                        _this.formDispaly.dictNames='';
                                        _this.queryDict();
                                    }).catch((error)=>{
                                    });
                                }
                                else{
                                    this.axios({
                                        method: 'post',
                                        url: '/codegen/api/v1/column/save',
                                        data: commitData,
                                        showLoading : true
                                    }).then((response) => {
                                        _this.mockTableData1();
                                        _this.$Message.success('提交成功');
                                        _this.formDispaly.dictCodes='';
                                        _this.formDispaly.dictNames='';
                                        _this.queryDict();
                                    });
                                }

                            } else {
                                this.$Message.error('请正确填写表单')
                            }
                        })
                    }

                }

            },
            rowSelect (curr,pre) {
                this.addDict=false;
                var data = {};
                data.name = curr.name;
                data.isNullable = curr.isNullable;
                data.readOnly = curr.readOnly;
                data.javaType = curr.javaType;
                data.min = curr.min;
                data.max = curr.max;
                data.pattern = curr.pattern;
                data.comments = curr.comments;
                if(curr.dictTypeCode){
                    data.dictCode=curr.dictTypeCode;
                }else{
                    data.dictCode="无字典值";
                }
                data.dictCodes='';
                data.dictNames='';
                if (curr.javaType === "String") {
                    this.isString = true
                } else {
                    this.isString = false
                }
                this.formDispaly = data
            },
            mockTableData1 () {
                this.$http.get('/codegen/api/v1/tables/'+this.getData()+'/columns').then((response)=>{
                    this.tableData1 = response.data.columns;
                    this.dictFlag=response.data.dictFlag;
                });
            },
            initAction(){
                if(this.dictFlag){
                    var obj ={
                        title: '字典表配置',
                        key: 'dictTypeCode'
                    };
                    this.tableColumns1.push(obj);
                }else{
                    for(var i=0;i<this.tableColumns1.length;i++){
                        if(this.tableColumns1[i].key===dictTypeCode)
                            this.tableColumns1.splice(i, 1);
                    }
                }
            }
        }
    }
</script>
