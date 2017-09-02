<style>
    .tab-content {
        background-color: #fff;
        border: 1px solid #dddee1;
        border-top: none;
        height: 100%;
        width: 100%;
        padding: 16px;
        min-width: 1640px;
    }
    .add-positon {
        width: 100%;
        text-align: right;
        margin-bottom: 8px;
    }

    ul.ivu-menu {
        height: 100%;
        /*width: 100% !important;*/
        overflow: auto;
        background: none;
    }

    .ivu-menu-vertical.ivu-menu-light:after {
        background:none !important;
    }

    .left-menu{
        height: 100%;
    }

    .left-menu .search-menu{
        height: 100%;
    }

    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
        border:none !important;
    }

    .entity-row:hover .trash-icon {
        display: inline-block;
    }

    .trash-icon:hover {
        color: #2d8cf0;
    }

    .trash-icon {
        display: none;
    }

    .tab-content .ivu-row {
        height: 100%;
    }
    .tab-content .tab-content-col {
        height: 100%;
    }

    .tab-content .tab-content-col .tab-content-left {
        background: #f5f7f9;
        width: 100%;
        height: 100%;
        padding: 16px;
        border: 1px solid #dddee1;
        border-radius: 4px;
    }

    .tab-content .tab-content-center {
        background: #f5f7f9;
        width: 100%;
        border: 1px solid #dddee1;
        border-radius: 4px;
    }

    .tab-content .tab-content-center.center-title {
        height: 60px;
        margin-bottom: 16px;
        padding: 12px 0;
    }

    .tab-content .tab-content-center.center-content {
        height: calc(100% - 76px);
        padding: 16px;
    }

    .tab-content .tab-content-center h3{
        margin: 16px 0 8px 0;
    }

    .tab-content .tab-content-center .add-columns{
        height: 120px;
        width: 100%;
        border: 1px solid #dddee1;
        border-radius: 4px;
        padding: 16px;
    }

    .tab-content .tab-content-col .ivu-table-wrapper {
        height: calc(100% - 194px);
    }

    .tab-content .ivu-table-body {
        height: calc(100% - 40px);
    }

    .ivu-menu-vertical .ivu-menu-item-group-title{
        padding-left: 7px !important;
    }

    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item {
        border: none !important;
    }

</style>
<template>
    <div class="tab-content">
        <Row>
            <Col span="4" class="tab-content-col" style="padding-right: 8px">
                <div class="tab-content-left">
                    <div class="left-menu">
                        <Row class-name="search-menu">
                            <Col span="24">
                                <Input v-model="searchMenu" icon="search" placeholder="请输入..."><Button slot="prepend" icon="plus" @click="addDto"></Button></Input>
                            </Col>
                        </Row>
                        <div style="position: absolute;left: 16px;bottom: 16px;top: 60px;right: 16px">
                            <Menu ref="leftMenu" theme="light" @on-select="menuSelected" :active-name="activeMenu">
                                <Menu-group v-for="dtoList in menus" :key="dtoList.packName" :title="'dto.'+dtoList.packName" v-if="dtoList.packName != 'default'" >
                                    <Menu-item v-show="searchMenu == '' || po.className.indexOf(searchMenu) > -1" v-for="dto in dtoList.data" :key="dto.id" :name="dto.id">
                                        {{dto.className}}
                                    </Menu-item>
                                </Menu-group>
                                <Menu-group v-for="poList in poMenus" :key="poList.packName" :title="'po.'+poList.packName">
                                    <Menu-item v-show="searchMenu == '' || po.className.indexOf(searchMenu) > -1" v-for="po in poList.data" :key="po.id" :name="po.id">
                                        {{po.className}}
                                    </Menu-item>
                                </Menu-group>
                            </Menu>
                        </div>
                    </div>
                </div>
            </Col>
            <Col :span="isDto?14:20" class="tab-content-col" style="padding:0 8px;overflow: auto;">
                <div class="tab-content-center center-title" v-if="isDto">
                    <Form ref="formInline" inline :label-width="60">
                        <Form-item label="class">
                            <Input type="text" v-model="centerForm.className" placeholder="class"></Input>
                        </Form-item>
                        <Form-item label="extends">
                            <Select v-model="centerForm.inheritObjName" style="width: 190px">
                                <div v-for="item in formatList.dto.data">
                                    <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" ></Option>
                                </div>
                            </Select>
                        </Form-item>
                        <Form-item label="是否支持泛型" :label-width="100">
                            <Radio-group v-model="centerForm.isGeneric">
                                <Radio label="1">是</Radio>
                                <Radio label="0">否</Radio>
                            </Radio-group>
                        </Form-item>
                        <Form-item>
                            <Button type="primary" @click="editDto">保存</Button>
                            <Button type="error" @click="delDto">删除</Button>
                        </Form-item>
                    </Form>
                </div>
                <div :class="isDto?'tab-content-center center-content':'tab-content-left'" style="overflow: auto;">
                    <div v-if="isDto">
                        <h3 style="margin-top: 0">新增</h3>
                        <div class="add-columns" >
                            <Form ref="formInline" inline :label-width="60">
                                <Form-item label="属性名">
                                    <Input v-model="newPropForm.name" type="text" placeholder="属性名"></Input>
                                </Form-item>
                                <Form-item label="类型">
                                    <Select v-model="newPropForm.type" style="width: 162px">
                                        <Option v-for="item in propTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                    </Select>
                                </Form-item>
                                <Form-item label="格式">
                                    <Select v-model="newPropForm.format"  v-show="newPropForm.type == 'base'" style="width: 162px">
                                        <Option v-for="(item,index) in formatList.base.data" :value="item" :key="index" >{{ item }}</Option>
                                    </Select>
                                    <Select v-model="newPropForm.format" v-show="newPropForm.type == 'array'" style="width: 162px">
                                        <Option-group label="基本类型">
                                            <Option v-for="(item,index) in formatList.base.data" :value="item" :key="index" >{{ item }}</Option>
                                        </Option-group>
                                        <Option-group label="DTO实体">
                                            <div v-for="item in formatList.dto.data">
                                                <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" ></Option>
                                            </div>
                                        </Option-group>
                                        <Option-group label="PO实体">
                                            <div v-for="item in formatList.po.data">
                                                <Option v-for="(child,index) in item.data" :value="item.packName + '.' +child.className" :key="index" ></Option>
                                            </div>
                                        </Option-group>
                                    </Select>
                                    <Select v-model="newPropForm.format" v-show="newPropForm.type == 'dto'" style="width: 162px">
                                        <div v-for="item in formatList.dto.data">
                                            <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" ></Option>
                                        </div>
                                    </Select>
                                    <Select v-model="newPropForm.format" v-show="newPropForm.type == 'po'" style="width: 162px">
                                        <div v-for="item in formatList.po.data">
                                            <Option v-for="(child,index) in item.data" :value="item.packName + '.' +child.className" :key="index" ></Option>
                                        </div>
                                    </Select>
                                </Form-item>
                                <Form-item label="描述">
                                    <Input v-model="newPropForm.description" type="text" placeholder="描述"></Input>
                                </Form-item>
                                <Form-item>
                                    <Button type="primary" @click="sigAddProp">新增</Button>
                                    <Button @click="batchAddProp">批量添加</Button>
                                </Form-item>
                            </Form>
                        </div>
                    </div>
                    <h3>属性</h3>
                    <Table highlight-row :columns="columns1" :data="centerForm.transferObjField" @on-row-click="rowClick" :style="tableStyle"></Table>
                </div>
            </Col>
            <Col span="6" class="tab-content-col" style="padding-left: 8px;" v-if="isDto">
                <div class="tab-content-left" style="overflow: auto;">
                    <h3 style="margin-bottom: 16px">编辑</h3>
                    <Form :model="rightForm" label-position="top">
                        <Form-item label="属性名">
                            <Input v-model="rightForm.name" placeholder="请输入"></Input>
                        </Form-item>
                        <Form-item label="类型">
                            <Select v-model="rightForm.type" placeholder="请选择">
                                <Option v-for="item in propTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Form-item>
                        <Form-item label="格式">
                            <Select v-model="rightForm.format"  v-show="rightForm.type == 'base'" >
                                <Option v-for="(item,index) in formatList.base.data" :value="item" :key="index" >{{ item }}</Option>
                            </Select>
                            <Select v-model="rightForm.format" v-show="rightForm.type == 'array'" >
                                <Option-group label="基本类型">
                                    <Option v-for="(item,index) in formatList.base.data" :value="item" :key="index" >{{ item }}</Option>
                                </Option-group>
                                <Option-group label="DTO实体">
                                    <div v-for="item in formatList.dto.data">
                                        <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" ></Option>
                                    </div>
                                </Option-group>
                                <Option-group label="PO实体">
                                    <div v-for="item in formatList.po.data">
                                        <Option v-for="(child,index) in item.data" :value="item.packName + '.' +child.className" :key="index" ></Option>
                                    </div>
                                </Option-group>
                            </Select>
                            <Select v-model="rightForm.format" v-show="rightForm.type == 'dto'" >
                                <div v-for="item in formatList.dto.data">
                                    <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" ></Option>
                                </div>
                            </Select>
                            <Select v-model="rightForm.format" v-show="rightForm.type == 'po'" >
                                <div v-for="item in formatList.po.data">
                                    <Option v-for="(child,index) in item.data" :value="item.packName + '.' +child.className" :key="index" ></Option>
                                </div>
                            </Select>
                        </Form-item>
                        <Form-item label="描述">
                            <Input v-model="rightForm.description" placeholder="请输入"></Input>
                        </Form-item>
                        <Form-item :label="(rightForm.format === 'String')?'最小长度':'最小值'">
                            <Input v-model="rightForm.min" ></Input>
                        </Form-item>
                        <Form-item :label="(rightForm.format === 'String')?'最大长度':'最大值'">
                            <Input v-model="rightForm.max"></Input>
                        </Form-item>
                        <Form-item label="正则表达式" v-show="rightForm.format === 'String'">
                            <Input v-model="rightForm.pattern"></Input>
                        </Form-item>
                        <Form-item label="是否为空">
                            <Radio-group v-model="rightForm.isNullable">
                                <Radio label="1">是</Radio>
                                <Radio label="0">否</Radio>
                            </Radio-group>
                        </Form-item>
                        <Form-item label="是否只读">
                            <Radio-group v-model="rightForm.readOnly">
                                <Radio label="1">是</Radio>
                                <Radio label="0">否</Radio>
                            </Radio-group>
                        </Form-item>
                        <Form-item>
                            <Button type="primary" @click="cmtPropEdit">提交</Button>
                            <Button type="error" @click="sigDelProp" style="margin-left: 8px">删除</Button>
                        </Form-item>
                    </Form>
                </div>
            </Col>
        </Row>
        <Modal v-model="batchPop" title="批量添加" width="950px" @on-ok="cmtBatchAdd">
            <div  v-for="(row, index) in batchForm" :key="index">
                <Form inline :label-width="50">
                    <Form-item label="属性名">
                        <Input v-model="row.name" type="text" placeholder="属性名"></Input>
                    </Form-item>
                    <Form-item label="类型">
                        <Select v-model="row.type" style="width: 162px">
                            <Option v-for="item in propTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="格式">
                        <Select v-model="row.format"  v-show="row.type == 'base'" style="width: 162px">
                            <Option v-for="(item,index) in formatList.base.data" :value="item" :key="index" >{{ item }}</Option>
                        </Select>
                        <Select v-model="row.format" v-show="row.type == 'array'" style="width: 162px">
                            <Option-group label="基本类型">
                                <Option v-for="(item,index) in formatList.base.data" :value="item" :key="index" >{{ item }}</Option>
                            </Option-group>
                            <Option-group label="DTO实体">
                                <div v-for="item in formatList.dto.data">
                                    <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" ></Option>
                                </div>
                            </Option-group>
                            <Option-group label="PO实体">
                                <div v-for="item in formatList.po.data">
                                    <Option v-for="(child,index) in item.data" :value="item.packName + '.' +child.className" :key="index" ></Option>
                                </div>
                            </Option-group>
                        </Select>
                        <Select v-model="row.format" v-show="row.type == 'dto'" style="width: 162px">
                            <div v-for="item in formatList.dto.data">
                                <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" ></Option>
                            </div>
                        </Select>
                        <Select v-model="row.format" v-show="row.type == 'po'" style="width: 162px">
                            <div v-for="item in formatList.po.data">
                                <Option v-for="(child,index) in item.data" :value="item.packName + '.' +child.className" :key="index" ></Option>
                            </div>
                        </Select>
                    </Form-item>
                    <Form-item label="描述">
                        <Input v-model="row.description" type="text" placeholder="描述"></Input>
                    </Form-item>
                </Form>
            </div>
            <Button type="primary" @click="batchNewRow"><Icon type="plus"></Icon></Button>
        </Modal>
        <Modal v-model="newEntity" title="新建dto" @on-ok="commitNewDto">
            <Form>
                <Form-item label="class">
                    <Input v-model="newEntityForm.name"></Input>
                </Form-item>
                <Form-item label="package">
                    <Select v-model="newEntityForm.packageName">
                        <Option v-for="item in dtoPackage" :value="item" :key="item">{{item}}</Option >
                    </Select>
                </Form-item>
                <Form-item label="extends">
                    <Select v-model="newEntityForm.inheritObjName">
                        <div v-for="item in formatList.dto.data">
                            <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" ></Option>
                        </div>
                    </Select>
                </Form-item>
                <Form-item label="是否支持泛型">
                    <Radio-group v-model="newEntityForm.isGeneric">
                        <Radio label="1">是</Radio>
                        <Radio label="0">否</Radio>
                    </Radio-group>
                </Form-item>

            </Form>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                isDto: true,
                activeMenu: '',
                //showAdd: false,
                searchMenu: '',
                batchPop: false, //是否弹出批量添加属性
                newEntity: false, //新建dto对话框绑定，当为true时，弹出新建dto对话框
                dtoPackage: [], //dto packaname数据，新建dto时会使用
                propTypeList: [], //属性类型列表，在页面初始时从后台接口获取
                formatList: {
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
                    }
                }, //属性格式，只存放了base，dto，po的格式，当类型选择array时，直接读取整个formatList获取数据
                menus : [], //获取的dto数据，用于左侧选择列表生成
                poMenus: [], //获取的po数据，用于左侧选择列表生成
                tableStyle: { //dto po界面切换时，属性表高度设置
                    height: null,
                },
                rightForm : { //右侧属性编辑表单数据
                    name: '',
                    type: 'base',
                    format: '',
                    description:'',
                    min: '',
                    max: '',
                    isNullable: '',
                    pattern: '',
                    readOnly: ''
                },
                centerForm: {}, //中间表单数据
                newEntityForm: {}, //新建dto时表单数据
                newPropForm: {
                    name: '',
                    type: '',
                    format: '',
                    description:''
                },   //单个增加dto属性
                batchForm: [], //批量增加dto属性
                columns1: [
                    {
                        title: '属性名',
                        key: 'name'
                    },
                    {
                        title: '类型',
                        key: 'type'
                    },
                    {
                        title: '格式',
                        key: 'format'
                    },
                    {
                        title: '描述',
                        key: 'description'
                    },
                ],
            }
        },
        props: ['getData'],
        created: function () {
            this.getEntityData();
            this.getDataType()
            console.log(this.getData());
        },
        watch: {
            isDto: function (val, oldVal) {
                if (val) {
                    this.tableStyle.height = null
                } else {
                    this.tableStyle.height = '97%'
                }
            }
        },
        methods: {
            sigAddProp () {
                //this.newPropForm.transferObjId = this.centerForm.id
                var newProp = this.newPropForm
                var _this = this
                console.log(newProp)
                this.$http.post('/codegen/api/v1/transferobjfield/save',newProp).then((response) => {
                    console.log(response.data)
                    _this.menuSelected(_this.newPropForm.transferObjId)
                });
            },
            batchAddProp () {
                var _this = this
                this.batchForm = [{
                    transferObjId: _this.newPropForm.transferObjId,
                    name: '',
                    type: 'base',
                    format: '',
                    description: ''
                }];
                this.batchPop = true
            },
            batchNewRow () {
                var _this = this
                this.batchForm.push({
                    transferObjId: _this.newPropForm.transferObjId,
                    name: '',
                    type: 'base',
                    format: '',
                    description: ''
                })
            },
            cmtBatchAdd () {
                var _this = this
                var batchPropHere = this.batchForm
                //console.log()
                this.$http.post('/codegen/api/v1/transferobjfields/Save', batchPropHere).then((response) => {
                    console.log(response.data)
                    _this.menuSelected(_this.newPropForm.transferObjId)
                });
                console.log(this.batchForm)
            },
            //menu选中
            menuSelected (entity) {
                //console.log(name);
                var _this = this
                var isDtoHere = false
                for (let i = 0; i < this.menus.length; i++) {
                    var dtoEntity = this.menus[i].data
                    for (let j = 0; j < dtoEntity.length; j++){
                        if (entity === dtoEntity[j].id) {
                            isDtoHere = true
                        }
                    }
                }
                if (isDtoHere) {
                    this.isDto = true
                    this.$http.get('/codegen/api/v1/transferobj/'+ entity +'/show').then((response) => {
                        //debugger
                        //console.log(response.data)
                        var transferObj = response.data.transferObj
                        _this.centerForm = {
                            transferObjField: transferObj.transferObjField,
                            id: transferObj.id,
                            className: transferObj.name,
                            isGeneric: transferObj.isGeneric,
                            inheritObjName: transferObj.inheritObjName
                        }
                        // _this.centerForm.transferObjField = transferObj.transferObjField
                        // _this.centerForm.id = transferObj.id
                        // _this.centerForm.className = transferObj.name
                        // _this.centerForm.isGeneric = transferObj.isGeneric
                        // _this.centerForm.inheritObjName = transferObj.inheritObjName
                        //console.log(_this.centerForm)
                    });
                } else {
                    this.isDto = false
                    this.$http.get('/codegen/api/v1/tables/'+ entity +'/dto').then((response) => {
                        console.log(response.data)
                        var transferObjField = response.data.transferObj.transferObjField
                        _this.centerForm.transferObjField = transferObjField
                    });
                }
                this.rightForm = {
                    name: '',
                    type: 'base',
                    format: '',
                    description:'',
                    min: '',
                    max: '',
                    isNullable: '',
                    pattern: '',
                    readOnly: ''
                }
                this.newPropForm = {
                    transferObjId: entity,
                    name: '',
                    type: 'base',
                    format: '',
                    description: ''
                }
            },
            //table 点击行
            rowClick(data) {
                if (this.isDto) {
                    this.rightForm = {
                        name: data.name,
                        type: data.type,
                        format: data.format,
                        description: data.description,
                        id: data.id,
                        min: data.min,
                        max: data.max,
                        isNullable: data.isNullable,
                        pattern: data.pattern,
                        readOnly: data.readOnly
                    }
                }
                console.log(data);
            },
            cmtPropEdit () {
                var editProp = this.rightForm;
                var _this = this
                this.$http.post('/codegen/api/v1/transferobjfield/save',editProp).then((response) => {
                    console.log(response.data)
                    _this.menuSelected(_this.newPropForm.transferObjId)
                    _this.rightForm = editProp
                    this.$Message.success('提交成功');
                });
                //console.log(this.rightForm)
            },
            sigDelProp () {
                var _this = this
                //console.log()
                var propId = this.rightForm.id
                this.$http.delete('/codegen/api/v1/transferObjField/' + propId + '/Delete').then((response) => {
                    console.log(response.data)
                    _this.menuSelected(_this.newPropForm.transferObjId)
                });
            },
            // save () {
            //     // var id = this.displayData.dtoId
            //     // this.menus[id].dtoName = this.displayData.dtoName
            //     // this.menus[id].isGen = this.displayData.isGen
            //     // this.menus[id].propData = this.displayData.propData
            // },
            addDto () {
                this.newEntity = true
                this.newEntityForm = {
                    name: '',
                    inheritObjName: '',
                    isGeneric: '',
                    packageName: 'other',
                    projectId: this.getData()
                }
                //console.log(this.menus)
            },
            commitNewDto () {
                this.$http.post('/codegen/api/v1/transferobj/save', this.newEntityForm).then((response) => {
                    this.getEntityData ()
                    this.getDataType ()
                });
            },
            editDto () {
                var cmtEdit = {
                    name: this.centerForm.className,
                    id: this.centerForm.id,
                    inheritObjName: this.centerForm.inheritObjName,
                    isGeneric: this.centerForm.isGeneric
                }
                this.$http.post('/codegen/api/v1/transferobj/save', cmtEdit).then((response) => {
                    this.getEntityData ()
                    this.getDataType ()
                    this.menuSelected(cmtEdit.id)
                });

                console.log(cmtEdit)
            },
            delDto () {
                this.$http.delete('/codegen/api/v1/transferObj/' + this.centerForm.id + '/delete').then((response) => {
                    this.getEntityData ()
                    this.getDataType ()
                });


                //console.log(this.centerForm.id)
            },
            getEntityData () {
                this.$http.get('/codegen/api/v1/project/'+this.getData()+'/dto_po').then((response) => {
                    //console.log(response.data)
                    this.menus = response.data.dto.data;
                    this.poMenus = response.data.po.data;
                    //console.log(this.menus)
                    if (this.menus.length > 1) {
                        //debugger
                        for (var i=0; i < this.menus.length; i++) {
                            if (this.menus[i].packName != 'default'){
                                this.activeMenu = this.menus[i].data[0].id;
                                break;
                            }
                        }
                    }
                    if (this.activeMenu == '' && this.poMenus.length > 0) {
                        this.activeMenu = this.poMenus[0].data[0].id;
                    }
                    this.$nextTick(()=>{
                        this.$refs['leftMenu'].updateActiveName();
                    });
                });
                this.centerForm = {
                    id: '',
                    className: '',
                    inheritObjName: '',
                    isGeneric: '',
                    transferObjField: []
                }
            },
            getDataType () {
                var _this = this
                this.dtoPackage = []
                this.propTypeList = []
                this.$http.get('/codegen/api/v1/project/'+this.getData()+'/data_type').then((response) => {
                    console.log(response.data)
                    _this.formatList = response.data;
                    //var data = response.data[key].data
                    var dtoData = response.data.dto.data
                    _this.dtoPackage.push('other')
                    for (let i = 0; i < dtoData.length; i++){
                        if (dtoData[i].packName != 'default') {
                            _this.dtoPackage.push(dtoData[i].packName)
                        }
                    }
                    for (let key in response.data) {
                        if (typeof(response.data[key]) === 'object') {
                            _this.propTypeList.push(
                                {
                                    value: key,
                                    label: key
                                }
                            )
                            //_this.formatList[key] = response.data[key].data
                        }
                        // if (packName != 'default') { //判断不为default，将packname添加到dtoPackage，用于新增dto时选择添加到哪个 dto package
                        //     _this.dtoPackage.push(packName)
                        // }
//                        if (key === "base") {
//                            _this.formatList[key] = response.data[key].data
//                        } else if (key === "po") {
//                            var po = []
//                            var data = response.data[key].data
//                            for (let i = 0; i < data.length; i++ ) {
//                                var packName = data[i].packName
//                                for (let j = 0; j < data[i].data.length; j++) {
//                                    po.push(packName + "." + data[i].data[j].className)
//                                }
//                            }
//                            _this.formatList[key] = po
//                        } else if (key === "dto") {
//                            var dto = []
//                            var data = response.data[key].data
//                            for (let i = 0; i < data.length; i++ ) {
//                                var packName = data[i].packName
//                                if (packName != 'default') { //判断不为default，将packname添加到dtoPackage，用于新增dto时选择添加到哪个 dto package
//                                    _this.dtoPackage.push(packName)
//                                }
//                                for (let j = 0; j < data[i].data.length; j++) {
//                                    dto.push(((packName === 'default')?'':packName + ".") + data[i].data[j].className)
//                                }
//                            }
//                            _this.formatList[key] = dto
//                        } else if (key === "array") {
//                            _this.formatList[key] = response.data[key].data
//                        }
                    }
                    this.newPropForm.type = 'base';
                });
            },

        },

    }
</script>
