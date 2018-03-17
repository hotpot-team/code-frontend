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
        padding: 12px 32px;
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
        overflow-x: hidden;
    }

    .ivu-menu-vertical .ivu-menu-item-group-title{
        padding-left: 7px !important;
    }

    .ivu-menu-light.ivu-menu-vertical .ivu-menu-item {
        border: none !important;
    }

    .propsig {
        margin-bottom: 8px;
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
                        <Menu ref="leftMenu" theme="light" @on-select="menuSelected" :active-name="activeMenu" width="auto">
                            <Menu-group v-for="dtoList in menus" :key="dtoList.packName" :title="'dto.'+dtoList.packName" >
                                <Menu-item v-show="searchMenu == '' || dto.className.indexOf(searchMenu) > -1" v-for="dto in dtoList.data" :key="dto.id" :name="dto.id">
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
                <Form ref="centervalid" :model='centerForm' :rules='centerRule' inline :label-width="60">
                    <Form-item label="class" prop="className">
                        <Input type="text" v-model="centerForm.className" placeholder="class"></Input>
                    </Form-item>
                    <Form-item label="extends">
                        <Select v-model="centerForm.inheritObjName" style="width: 190px">
                            <div v-for="item in formatList.dto.data">
                                <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" ></Option>
                            </div>
                        </Select>
                    </Form-item>
                    <!--<Form-item label="是否支持泛型" :label-width="90">-->
                        <!--<Radio-group v-model="centerForm.isGeneric">-->
                            <!--<Radio label="1">是</Radio>-->
                            <!--<Radio label="0">否</Radio>-->
                        <!--</Radio-group>-->
                    <!--</Form-item>-->
                    <!--<Form-item label="高级DTO" :label-width="80">-->
                        <!--<Radio-group v-model="centerForm.isSenior">-->
                            <!--<Radio label="1">是</Radio>-->
                            <!--<Radio label="0">否</Radio>-->
                        <!--</Radio-group>-->
                    <!--</Form-item>-->
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
                        <Form ref="sigaddvalid" :model="newPropForm" :rules="sigAddRule" inline :label-width="60" >
                            <Form-item label="属性名" prop="name">
                                <Input v-model="newPropForm.name" type="text" placeholder="属性名"></Input>
                            </Form-item>
                            <Form-item label="类型" prop="type" v-if="propTypeList.length > 0">
                                <Select v-model="newPropForm.type" style="width: 162px" @on-change="function() {newPropForm.format = ''}">
                                    <Option v-for="item in propTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </Form-item>
                            <Form-item label="格式" prop="format" v-if="propTypeList.length > 0">
                                <Select v-model="newPropForm.format"  v-show="newPropForm.type == 'base'" style="width: 162px">
                                    <Option v-for="(item,index) in formatList.base.data" :value="item" :key="index" >{{ item }}</Option>
                                </Select>
                                <Select v-model="newPropForm.format" v-show="newPropForm.type == 'array'" style="width: 162px">
                                    <Option-group label="基本类型">
                                        <Option v-for="(item,index) in formatList.base.data" :value="'base.' + item" :key="index" >{{ item }}</Option>
                                    </Option-group>
                                    <Option-group label="DTO实体">
                                        <div v-for="item in formatList.dto.data">
                                            <Option v-for="(child,index) in item.data" :value="'dto.' + (item.packName == 'default'?'':item.packName + '.') + child.className" :key="index" >
                                                {{(item.packName == 'default'?'':item.packName + '.') +child.className}}
                                            </Option>
                                        </div>
                                    </Option-group>
                                    <Option-group label="PO实体">
                                        <div v-for="item in formatList.po.data">
                                            <Option v-for="(child,index) in item.data" :value="'po.' + item.packName + '.' +child.className" :key="index" >
                                                {{item.packName + '.' +child.className}}
                                            </Option>
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
                                <Button type="primary" @click="batchAddProp">批量添加</Button>
                                <Button type="primary" @click="cpFromPo">复制PO属性</Button>
                            </Form-item>
                        </Form>
                    </div>
                </div>
                <div :class="isDto?'':'propsig'" >
                    <h3 style="display: inline-block">属性</h3>
                    <Button type="primary" @click="refProp" size="small" style="display:inline-block;margin-left:90%"><Icon type="refresh"></Icon>刷新</Button>
                </div>
                <Table highlight-row :columns="columns1" :data="centerForm.transferObjField" @on-row-click="rowClick" :style="tableStyle"></Table>
            </div>
            </Col>
            <Col span="6" class="tab-content-col" style="padding-left: 8px;" v-if="isDto">
            <div class="tab-content-left" style="overflow: auto;">
                <div style="border-bottom:1px solid #e3e8ee;padding-bottom: 5px;margin-bottom: 8px">
                    <h3>编辑</h3>
                </div>
                <Form ref="rightvalid" :rules="rightRule" :model="rightForm" label-position="right" :label-width="80">
                    <Form-item label="属性名" prop="name">
                        <Input v-model="rightForm.name" placeholder="请输入"></Input>
                    </Form-item>
                    <Form-item label="类型" prop="type" v-if="propTypeList.length > 0">
                        <Select v-model="rightForm.type" placeholder="请选择">
                            <Option v-for="item in propTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="格式" prop="format" v-if="propTypeList.length > 0">
                        <Select v-model="rightForm.format"  v-show="rightForm.type == 'base'" >
                            <Option v-for="(item,index) in formatList.base.data" :value="item" :key="index" >{{ item }}</Option>
                        </Select>
                        <Select v-model="rightForm.format" v-show="rightForm.type == 'array'" >
                            <Option-group label="基本类型">
                                <Option v-for="(item,index) in formatList.base.data" :value="'base.' + item" :key="index" >{{ item }}</Option>
                            </Option-group>
                            <Option-group label="DTO实体">
                                <div v-for="item in formatList.dto.data">
                                    <Option v-for="(child,index) in item.data" :value="'dto.' + (item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" >
                                        {{(item.packName == 'default'?'':item.packName + '.') +child.className}}
                                    </Option>
                                </div>
                            </Option-group>
                            <Option-group label="PO实体">
                                <div v-for="item in formatList.po.data">
                                    <Option v-for="(child,index) in item.data" :value="'po.' + item.packName + '.' + child.className" :key="index" >
                                        {{item.packName + '.' +child.className}}
                                    </Option>
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
                    <div v-if="rightForm.format == 'String' || rightForm.format == 'Integer' || rightForm.format == 'Long'">
                        <Form-item :label="(rightForm.format === 'String')?'最小长度':'最小值'" prop="min">
                            <Input v-model="rightForm.min"></Input>
                        </Form-item>
                        <Form-item :label="(rightForm.format === 'String')?'最大长度':'最大值'" prop="max">
                            <Input v-model="rightForm.max"></Input>
                        </Form-item>
                        <Form-item label="正则表达式" v-if="rightForm.format === 'String'">
                            <Input v-model="rightForm.pattern"></Input>
                        </Form-item>
                    </div>
                    <div v-if="rightForm.type == 'base'">
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
                    </div>
                </Form>
                <Button type="primary" @click="cmtPropEdit">提交</Button>
                <Button type="error" @click="sigDelProp" style="margin-left: 8px">删除</Button>
            </div>
            </Col>
        </Row>
        <Modal v-model="batchPop" title="批量添加" width="970px" @on-ok="cmtBatchAdd">
            <div  v-for="(row, index) in batchForm" :key="index">
                <Form :rules="sigAddRule" :model="row" inline :label-width="58">
                    <Form-item label="属性名" prop="name">
                        <Input v-model="row.name" type="text" placeholder="属性名"></Input>
                    </Form-item>
                    <Form-item label="类型" prop="type" >
                        <Select v-model="row.type" style="width: 162px" @on-change="function() {row.format = ''}">
                            <Option v-for="item in propTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                        </Select>
                    </Form-item>
                    <Form-item label="格式" prop="format">
                        <Select v-model="row.format"  v-show="row.type == 'base'" style="width: 162px">
                            <Option v-for="(item,index) in formatList.base.data" :value="item" :key="index" >{{ item }}</Option>
                        </Select>
                        <Select v-model="row.format" v-show="row.type == 'array'" style="width: 162px">
                            <Option-group label="基本类型">
                                <Option v-for="(item,index) in formatList.base.data" :value="'base.' + item" :key="index" >{{ item }}</Option>
                            </Option-group>
                            <Option-group label="DTO实体">
                                <div v-for="item in formatList.dto.data">
                                    <Option v-for="(child,index) in item.data" :value="'dto.' + (item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" >
                                        {{(item.packName == 'default'?'':item.packName + '.') + child.className}}
                                    </Option>
                                </div>
                            </Option-group>
                            <Option-group label="PO实体">
                                <div v-for="item in formatList.po.data">
                                    <Option v-for="(child,index) in item.data" :value="'po.' + item.packName + '.' + child.className" :key="index" >
                                        {{item.packName + '.' +child.className}}
                                    </Option>
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
            <Button type="error" @click="batchDelRow"><Icon type="minus"></Icon></Button>
        </Modal>
        <Modal v-model="newEntity" title="新建dto">
            <Form ref="newentityvalid" :rules="newEntityRule" :model="newEntityForm" :label-width="90">
                <Form-item label="class" prop="name">
                    <Input v-model="newEntityForm.name"></Input>
                </Form-item>
                <Form-item label="package">
                    <Select v-model="newEntityForm.packageName" v-if="dtoPackage.length > 0">
                        <Option v-for="item in dtoPackage" :value="item" :key="item">{{item}}</Option >
                    </Select>
                </Form-item>
                <Form-item label="extends" v-if="formatList.dto.data.length > 0">
                    <Select v-model="newEntityForm.inheritObjName">
                        <div v-for="item in formatList.dto.data">
                            <Option v-for="(child,index) in item.data" :value="(item.packName == 'default'?'':item.packName + '.') +child.className" :key="index" ></Option>
                        </div>
                    </Select>
                </Form-item>
                <!--<Form-item label="是否支持泛型">-->
                    <!--<Radio-group v-model="newEntityForm.isGeneric">-->
                        <!--<Radio label="1">是</Radio>-->
                        <!--<Radio label="0">否</Radio>-->
                    <!--</Radio-group>-->
                <!--</Form-item>-->
                <!--<Form-item label="高级DTO">-->
                    <!--<Radio-group v-model="newEntityForm.isSenior">-->
                        <!--<Radio label="1">是</Radio>-->
                        <!--<Radio label="0">否</Radio>-->
                    <!--</Radio-group>-->
                <!--</Form-item>-->
            </Form>
            <div slot="footer">
                <Button type="text" @click="newEntity = false">取消</Button>
                <Button type="primary" @click="commitNewDto">提交</Button>
            </div>
        </Modal>
        <Modal v-model="isCpFromPo" title="复制PO属性" width="650px" @on-ok="cmtCpFromPo">
            <Form>
                <Form-item>
                    <Select v-model="copyPoForm.poName"  @on-change="selCpPo">
                        <Option-group v-for="pack in poMenus" :label="pack.packName" :key="pack.id">
                            <Option v-for="po in pack.data" :value="po.id" :key="po.id">{{ po.className }}</Option>
                        </Option-group>
                    </Select>
                </Form-item>
                <Form-item>
                    <div style="max-height: 380px; overflow:auto;">
                        <Table :columns="poCpCol" :data="copyPoForm.poPropTab" @on-selection-change="selCpPoProp"></Table>
                    </div>
                </Form-item>
            </Form>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                isDto: true, //当前选中的实体，是否为dto，根据这个值，页面会有相应调整
                activeMenu: '', //初始化时，左侧的列表选中的项
                searchMenu: '',
                isCpFromPo: false, //是否弹出复制po属性对话框
                batchPop: false, //是否弹出批量添加属性
                newEntity: false, //新建dto对话框绑定，当为true时，弹出新建dto对话框
                dtoPackage: [], //dto packaname数据，新建dto时会使用
                propTypeList: [], //属性类型列表，在页面初始时从后台接口获取
                copyPoForm: {},//复制po属性对话框内容，点击‘复制po属性’时会赋予初始key与其对应空值
                propToCommit: [],
                poCpCol: [ //从po复制属性，表格的列名
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
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
                formatList: { //属性格式
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
                },
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
                newPropForm: { //单个增加dto属性
                    name: '',
                    type: '',
                    format: '',
                    description:''
                },
                batchForm: [], //批量增加dto属性
                columns1: [ //属性表格的列名
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
                rightRule: {
                    name: [
                        {required: true, message: '属性名不能为空', trigger: 'blur'},
                        {pattern: /^[a-z][a-zA-Z0-9]*$/, message: '属性名必须小写字母开头，不能包含特殊字符', trigger: 'change'}
                    ],
                    type: [
                        {required: true, message: '类型不能为空', trigger: 'change'}
                    ],
                    format: [
                        {required: true, message: '格式不能为空', trigger: 'change'}
                    ],
                    min: [
                        {pattern:/^\d*$/, message: '只能为数字', trigger: 'change'}
                    ],
                    max: [
                        {pattern:/^\d*$/, message: '只能为数字', trigger: 'change'}
                    ]
                },
                centerRule: {
                    className: [
                        {required: true, message: '类名不能为空', trigger: 'blur'},
                        {pattern: /^[A-Z][a-zA-Z0-9]*$/, message: '类名必须大写字母开头，不能包含特殊字符', trigger: 'change'}
                    ]
                },
                sigAddRule: {
                    name: [
                        {required: true, message: '属性名不能为空', trigger: 'blur'},
                        {pattern: /^[a-z][a-zA-Z0-9]*$/, message: '属性名必须小写字母开头，不能包含特殊字符', trigger: 'change'}
                    ],
                    type: [
                        {required: true, message: '类型不能为空', trigger: 'change'}
                    ],
                    format: [
                        {required: true, message: '格式不能为空', trigger: 'change'}
                    ],
                },
                newEntityRule: {
                    name: [
                        {required: true, message: '类名不能为空', trigger: 'blur'},
                        {pattern: /^[A-Z][a-zA-Z0-9]*$/, message: '类名必须大写字母开头，不能包含特殊字符', trigger: 'change'}
                    ]
                }
            }
        },
        props: ['getData'],
        created: function () {
            this.getEntityData();
            this.getDataType();
            //this.menuSelected(this.activeMenu)
            //console.log(this.getData());
        },
        watch: {
            isDto: function (val, oldVal) {
                if (val) {
                    this.tableStyle.height = null
                } else {
                    this.tableStyle.height = '95%'
                }
            },
            activeMenu: function (val) { //初始时，选择menu第一行的实例
                this.menuSelected(val)
            }
        },
        methods: {
            refProp() {
                this.menuSelected(this.newPropForm.transferObjId);
            },
            cpFromPo () {
                this.isCpFromPo = true
                this.copyPoForm = {
                    poName: '',
                    poPropTab: []
                }
            },
            selCpPo (poId) {
                if (poId != ''){
                    this.$http.get('/codegen/api/v1/tables/'+ poId +'/dto').then((response) => {
                        let poObj = response.data.transferObj
                        let existProp = this.centerForm.transferObjField
                        for (let i = 0; i < existProp.length; i++ ) { //当po的属性名字与现有的属性名相同时，将从poObj.transferObjField这个数组排除
                            let name = existProp[i].name
                            for (let j = 0; j < poObj.transferObjField.length; j++) {
                                if (poObj.transferObjField[j].name === name){
                                    poObj.transferObjField.splice(j,1);
                                }
                            }
                        }
                        this.copyPoForm.poPropTab = poObj.transferObjField;
                    });
                }
            },
            selCpPoProp (propSet) {
                let _this = this
                let propToCommit = [];
                for (let i = 0; i < propSet.length; i++ ){
                    propToCommit.push({
                        description: propSet[i].description,
                        format: propSet[i].format,
                        name: propSet[i].name,
                        transferObjId: _this.newPropForm.transferObjId,
                        type: propSet[i].type
                    })
                }
                this.propToCommit = propToCommit;
            },
            cmtCpFromPo() {
                var _this = this;
                var poPropHere = this.propToCommit;
                this.$http.post('/codegen/api/v1/transferobjfields/Save', poPropHere).then((response) => {
                    _this.menuSelected(_this.newPropForm.transferObjId);
                });
            },
            sigAddProp () {
                //this.newPropForm.transferObjId = this.centerForm.id
                var newProp = this.newPropForm;
                var _this = this;
                this.$refs['sigaddvalid'].validate((valid) => {
                    if (valid) {
                        _this.$http.post('/codegen/api/v1/transferobjfield/save',newProp).then((response) => {
                            //console.log(response.data)
                            _this.menuSelected(_this.newPropForm.transferObjId);
                            _this.$Message.success('新增成功');
                        });
                    } else {
                        this.$Message.error('请正确填写表单');
                    }
                })
            },
            batchAddProp () {
                var _this = this
                this.batchForm = [];
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
            batchDelRow () {
                this.batchForm.pop()
            },
            cmtBatchAdd () {
                var _this = this
                var batchPropHere = this.batchForm
                //console.log()
                this.$http.post('/codegen/api/v1/transferobjfields/Save', batchPropHere).then((response) => {
                    //console.log(response.data)
                    _this.menuSelected(_this.newPropForm.transferObjId)
                });
            },
            //menu选中
            menuSelected (entity) {
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
                    this.$http({
                        method: 'get',
                        url: '/codegen/api/v1/transferobj/'+ entity +'/show',
                        data: '',
                        showLoading : true
                    }).then((response) => {
                        var transferObj = response.data.transferObj
                        _this.centerForm = {
                            transferObjField: transferObj.transferObjField,
                            id: transferObj.id,
                            className: transferObj.name,
                            isGeneric: transferObj.isGeneric,
                            isSenior : transferObj.isSenior,
                            inheritObjName : transferObj.inheritObjName
                        }
                    });
                } else {
                    this.isDto = false
                    this.$http({
                        method: 'get',
                        url: '/codegen/api/v1/tables/'+ entity +'/dto',
                        data: '',
                        showLoading : true
                    }).then((response) => {
                        var transferObjField = response.data.transferObj.transferObjField
                        _this.centerForm = {
                            transferObjField: transferObjField
                        }
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
                };
                this.newPropForm = {
                    transferObjId: entity,
                    name: '',
                    type: 'base',
                    format: '',
                    description: ''
                };
                if (this.isDto){
                    this.$nextTick(()=>{
                        this.$refs['sigaddvalid'].resetFields();
                        this.$refs['rightvalid'].resetFields();
                    })
                }
            },
            //table 点击行
            rowClick(data) {
                if (this.isDto) {
                    let formatHere = data.format
                    if (data.type === 'array') {
                        formatHere = data.arrayType + '.' + formatHere;
                    }
                    this.rightForm = {
                        name: data.name,
                        type: data.type,
                        format: formatHere,
                        description: data.description,
                        id: data.id,
                        min: data.min,
                        max: data.max,
                        isNullable: data.isNullable,
                        pattern: data.pattern,
                        readOnly: data.readOnly
                    }
                }
            },
            cmtPropEdit () {
                var editProp = {
                    description: this.rightForm.description,
                    format: this.rightForm.format,
                    id: this.rightForm.id,
                    isNullable: this.rightForm.isNullable,
                    max: this.rightForm.max,
                    min: this.rightForm.min,
                    name: this.rightForm.name,
                    pattern: this.rightForm.pattern,
                    readOnly: this.rightForm.readOnly,
                    type: this.rightForm.type
                };
                //var _this = this
                console.log(editProp)
                if (editProp.max !== null && editProp.max !== '' && editProp.max < editProp.min){
                    this.$Message.error('最小值大于最大值')
                } else {
                    this.$refs['rightvalid'].validate((valid) => {
                        if (valid) {
                            this.$http({
                                method: 'post',
                                url: '/codegen/api/v1/transferobjfield/save',
                                data: editProp,
                                showLoading : true
                            }).then((response) => {
                                this.$nextTick(()=>{
                                    this.menuSelected(this.newPropForm.transferObjId)
                                })
                                this.$Message.success('提交成功');
                            });
                        } else {
                            this.$Message.error('请选择属性并正确填写表单');
                        }
                    })
                }
            },
            sigDelProp () {
                var _this = this;
                var propId = this.rightForm.id;
                if (propId === "") {
                    this.$Message.error('请选择属性')
                } else {
                    this.$http({
                        method: 'delete',
                        url: '/codegen/api/v1/transferObjField/' + propId + '/Delete',
                        data: '',
                        showLoading : true
                    }).then((response) => {
                        _this.menuSelected(_this.newPropForm.transferObjId)
                        this.$Message.info('已删除');
                    });
                }

            },
            addDto () {
                this.newEntity = true
                this.$refs['newentityvalid'].resetFields()
                this.newEntityForm = {
                    name: '',
                    inheritObjName: '',
                    isGeneric: 0,
                    isSenior: 0,
                    packageName: 'other',
                    projectId: this.getData()
                }
            },
            commitNewDto () {
                this.$refs['newentityvalid'].validate((valid) => {
                    if (valid) {
                        this.$http.post('/codegen/api/v1/transferobj/save', this.newEntityForm).then((response) => {
                            this.getEntityData ();
                            this.getDataType ();
                            this.newEntity = false;
                        });
                    } else {
                        this.$Message.error('请正确填写表单');
                    }
                })

            },
            editDto () {
                this.$refs['centervalid'].validate((valid) => {
                    if (valid) {
                        var cmtEdit = {
                            name: this.centerForm.className,
                            id: this.centerForm.id,
                            inheritObjName: this.centerForm.inheritObjName,
                            isGeneric: this.centerForm.isGeneric,
                            isSenior : this.centerForm.isSenior,
                        };
                        this.$http({
                            method: 'post',
                            url: '/codegen/api/v1/transferobj/save',
                            data: cmtEdit,
                            showLoading : true
                        }).then((response) => {
                            this.getEntityData ()
                            //this.getDataType ()
                            this.menuSelected(cmtEdit.id)
                            this.$Message.success('保存成功')
                        });
                    } else {
                        this.$Message.error('请正确填写表单')
                    }
                })
            },
            delDto () {
                this.$http.delete('/codegen/api/v1/transferObj/' + this.centerForm.id + '/delete').then((response) => {
                    this.getEntityData ()
                    this.getDataType ()
                    this.$Message.success('已删除')
                });
            },
            getEntityData () {
                this.$http.get('/codegen/api/v1/project/'+this.getData()+'/dto_po').then((response) => {
                    this.menus = response.data.dto.data;
                    this.poMenus = response.data.po.data;
                    if (this.menus.length > 1) {
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
                    isGeneric: 0,
                    isSenior: 0,
                    transferObjField: []
                }
            },
            getDataType () {
                var _this = this
                this.dtoPackage = []
                this.propTypeList = []
                this.$http.get('/codegen/api/v1/project/'+this.getData()+'/data_type').then((response) => {
                    _this.formatList = response.data;
                    var dtoData = response.data.dto.data
                    _this.dtoPackage.push('other')
                    for (let i = 0; i < dtoData.length; i++){
                        if (dtoData[i].packName != 'default' && dtoData[i].packName != 'other') {
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
                        }
                    }
                    this.newPropForm.type = 'base';
                });
            },

        },

    }
</script>
