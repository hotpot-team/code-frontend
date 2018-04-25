<style scoped lang="scss">
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

    .tab-content-block {
        background: #f5f7f9;
        width: 100%;
        height: 100%;
        border: 1px solid #dddee1;
        border-radius: 4px;
    }

    .mag-buttons button{
        margin-right: 8px;
    }

    ul.ivu-menu {
        height: 100%;
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

    .ivu-card {
        position: initial !important;
    }

    .table-autoHeight {
        position: absolute;
        top: 125px;
        bottom: 0px;
        left: 16px;
        right: 16px;
    }

    .relation-row{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin: 8px 0;
        background: #fff;
        padding: 4px;
    }

    .relation-info{
        font-size: 14px;
        font-weight: normal;
        color: #aaa;
    }
    .relation-info span{
        margin: 0 8px;
        font-weight: bold;
    }

    .relation-row .relation-del{
        margin: auto 0;
        width: 35px;
    }

    .relation-row .relation-del:hover{
        cursor: pointer;
    }

     .line{
        height: 10px;
        border-bottom: 1px solid #dddee1;
        margin-left: -16px;
        width: calc(100% + 32px);
        display: inline-block;
    }

    .sqlList{
        padding: 16px;
        border: 1px solid #e9eaec;
        border-top: none;
        background: #fff;
        display: flex;
        justify-content: space-between;
        &:first-of-type{
            margin-top: 16px;
            border-top: 1px solid #e9eaec;
        }
    }
</style>
<style lang="scss">
#datamag{
    .ivu-card-head{
        border: none;
    }
    .ivu-card{
        height: 100%;
        .ivu-card-body{
            height: calc(100% - 104px);
            .ivu-table-wrapper{
                height: 100%;
            }
        }
    }
}
</style>
<template>
    <div class="tab-content" id="datamag" style="overflow: hidden;position: relative">
        <Row>
            <Col span="15"  class="tab-content-col" style="padding-right: 16px;">
                <div class="tab-content-block">
                    <Card :bordered="false" style="background: #f5f7f9" dis-hover>
                        <div slot="title">
                            <div v-if="displayData.dbName != null && displayData.dbName != ''">
                                <Select v-model="activeName" @on-select="menuSelected" style="width: 120px">
                                    <Option v-for="item in menus" :key="item.id" :value="item.id" :label="item.name"></Option>
                                </Select>
                                <Button type="primary" @click="syncDB" style="margin-left: 16px;" icon="refresh">同步</Button>
                                <Button type="primary" @click="autoCrud">激活CRUD API</Button>
                                <Button type="primary" @click="inAutoCrud">停止CRUD API</Button>
                            </div>
                        </div>
                        <Table
                        :data="displayData.dbData"
                        :columns="tableColumns1"
                        @on-selection-change="selectRows"
                        @on-current-change="clickRow"
                        highlight-row
                        stripe >
                        </Table>
                        <!--<div style="margin: 10px;overflow: hidden">-->
                            <!--<div style="float: right;">-->
                                <!--<Page ref="pages" :total="totalNum" :page-size="pageSize" :current="currentPage" @on-change="changePage" show-total placement="top"></Page>-->
                            <!--</div>-->
                        <!--</div>-->
                    </Card>
                </div>
            </Col>
            <Col span="9"  class="tab-content-col">
                <div class="tab-content-block" style="padding: 16px">
                    <Form>
                        <div style="padding-bottom: 8px;margin-bottom: 3px">
                            <h3>编辑 {{rightForm.name}}</h3>
                        </div>
                        <Form-item>
                            <Input v-model="rightForm.comments.comments" type="textarea" :rows="4" placeholder="描述"></Input>
                        </Form-item>
                        <Form-item>
                            <Button type="primary" @click="cmtTabEdit">提交</Button>
                        </Form-item>
                    </Form>
                    <div v-if="rightForm.isAutoCrud == 1">
                        <Tabs value="relTab1">
                            <TabPane label="resultFul关联" name="relTab1">
                                <Table :data="tableRelations" :columns="relationColumns" style="margin-top: 16px"></Table>
                                <Button type="primary" @click="handleAdd" icon="plus-round" style="margin-top: 16px">新增</Button>
                            </TabPane>
                            <TabPane label="高级关联" name="relTab2">
                                <!--<Table :data="tableRelations" :columns="relationColumns" style="margin-top: 16px"></Table>-->
                                <div v-for="(item, index) in seniorRelationList" class="sqlList">
                                    <span v-html="item.sql"></span>
                                    <div style="vertical-align: middle; display: inline-flex;">
                                        <Button type="text" @click="seniorEdit(item.id)" icon="edit"></Button>
                                        <Button type="text" @click="seniorDelete(item.id, index)" icon="close"></Button>
                                    </div>
                                </div>
                                <Button type="primary" @click="seniorAdd" icon="plus-round" style="margin-top: 16px">新增</Button>
                            </TabPane>
                        </Tabs>
                    </div>
                </div>
            </Col>
        </Row>
        <Modal v-model="relModel"
                title="关联<(￣3￣)> 表"
                @on-ok="relationOk">
            <Form :model="addRelation" label-position="right" :label-width="80" ref="relationForm">
                <FormItem label="当前表：">
                    {{rightForm.name}}
                </FormItem>
                <FormItem label="关系：" prop="relation">
                    <RadioGroup v-model="addRelation.relation">
                        <Radio label="One to One" value="one_to_one"></Radio>
                        <Radio label="One to Many" value="one_to_many"></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="关联表：" prop="slaveTableId">
                    <Select v-model="addRelation.slaveTableId" placeholder="请选择" @on-change="relTableChange">
                        <Option v-for="(item, index) in displayData.dbData" :key="item.id" :label="item.name" :value="item.id"></Option>
                    </Select>
                </FormItem>
                    <Row>
                        <Col span="12">
                            <FormItem label="关联字段：" prop="masterColumnIndex">
                                <Select v-model="addRelation.masterColumnIndex" placeholder="主表字段" @on-change="masterChange">
                                    <Option v-for="(item, index) in masterColumns" :key="index" :label="item.name" :value="index"></Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span="12">
                            <FormItem prop="slaveColumnIndex">
                                <span slot="label" style="text-align: center; display: inline-block;width: 100%">=</span>
                                <Select v-model="addRelation.slaveColumnIndex"  placeholder="子表表字段" @on-change="slaveChange">
                                    <Option v-for="(item, index) in slaveColumns" :key="index" :label="item.name" :value="index"></Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
            </Form>
        </Modal>
        <Modal v-model="seniorModel"
               title="高级关联表"
               @on-ok="seniorRelationOk" width="700">
            <div>select * from {{rightForm.name}}<Button @click="addTableRelation">新增关联表</Button></div>
            <div v-for="(ite, i) in seniorRelation.relationTables" style="margin-top: 20px">
                <div style="display: flex;justify-content: space-between">
                    <div>
                        <Select v-model="ite.relation" style="width: 150px">
                            <Option label="left join" value="left join"></Option>
                            <Option label="inner join" value="inner join"></Option>
                        </Select>
                        <Select v-model="ite.slaveTableId" placeholder="关联表" @on-change="seniorRelTableChange($event, i)" style="width: 150px">
                            <Option v-for="item in displayData.dbData" :key="item.id" :label="item.name" :value="item.id"></Option>
                        </Select>
                    </div>
                    <div>
                        <Button v-if="i != 0" @click="deleteSenior(seniorRelation.relationTables, i)" icon="trash-a" shape="circle"></Button>
                        <Button @click="addColumnRelation(i)" icon="plus" shape="circle"></Button>
                    </div>
                </div>
                <div v-for="(column, index) in ite.relationColumns" :key="index" style="margin-top: 8px;padding-left: 16px">
                    <div style="display: flex;justify-content: space-between">
                        <div>
                            <span>on {{rightForm.name}}.</span>
                            <Select v-model="column.masterColumnName" placeholder="主表字段" style="width: 150px" @on-change="seniorMasterColumnChange($event, column)">
                                <Option v-for="(item, index) in masterColumns" :key="index" :label="item.name" :value="item.name"></Option>
                            </Select>
                            {{column.operate}} {{ite.slaveTableName?ite.slaveTableName+'.':''}}
                            <Select v-model="column.slaveColumnName"  placeholder="子表表字段" style="width: 150px" @on-change="seniorSlaveColumnChange($event, column, ite.slaveColumns)">
                                <Option v-for="(item, index) in ite.slaveColumns" :key="index" :label="item.name" :value="item.name"></Option>
                            </Select>
                        </div>
                        <Button v-if="index != 0" @click="deleteSenior(ite.relationColumns, index)" icon="trash-a" shape="circle"></Button>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                relModel: false,
                seniorModel: false,
                addRelation: {
                    masterTableId: '',
                    slaveTableId: '',
                    relation: '',
                    masterColumnName: '',
                    slaveColumnName: '',
                    masterColumnType: '',
                    slaveColumnType: '',
                    masterColumnIndex: '',
                    slaveColumnIndex: ''
                },
                seniorRelation: {},
                tableRelations: [],
                masterColumns: [],
                slaveColumns: [],
                seniorRelationList:[],
                tabRows: [],
                dbIndex: '0',
                rightForm: {
                    id: '',
                    comments: '',
                    isAutoCrud: 0,
                    relations: []
                },
                displayData: {
                    dbName: '',
                    dbData: [],
                },
                activeName: '',
                param : {
                    orders: [
                        {
                            fieldName: 'name',
                            orderType: 'ASC'
                        }
                    ],
                    pageParms: {
                        autoRecordCount: true,
                        pageIndex: 0,
                        pageSize: 10000,
                        recordCount: 0
                    }
                },
                searchMenu: '',
                relationColumns:[
                    {
                        key: 'slaveTableName',
                        width: 150,
                        title: '从表'
                    },
                    {
                        key: 'relation',
                        width: 120,
                        title: '关系'
                    },
                    {
                        title: '关联字段',
                        render: (h, param)=>{
                            return h('span', {}, this.rightForm.name + '.' + param.row.masterColumnName + ' = ' + param.row.slaveTableName + '.' + param.row.slaveColumnName);
                        }
                    },
                    {
                        title: '操作',
                        width: 80,
                        render: (h, param)=>{
                            return h('Button', {
                                props: {
                                    size: 'small',
                                    icon: 'close',
                                    type: 'text'
                                },
                                on: {
                                    click: () => {
                                        this.delRelation(param.row.id, param.index);
                                    }
                                }
                            });
                        }
                    },
                ],
                tableColumns1: [
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                    {
                        title: '表名',
                        key: 'name'
                    },
                    {
                        title: '实体(PO)名',
                        key: 'className'
                    },
                    {
                        title: '注释',
                        key: 'comments'
                    },
                    {
                        title: 'CRUD API',
                        render: (h, params) => {
                            if (params.row.isAutoCrud == '0') {
                                return h('span',{},'否');
                            } else {
                                return h('span',{},'是');
                            }
                        }
                    },
                    {
                        title: '操作',
                        width: 400,
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
                                            console.log(params);
                                            this.addTab(params, 'conf-mag')
                                        }
                                    }
                                }, '配置表'),
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.getCode(params.row)
                                        }
                                    }
                                }, '生成实体代码并下载')
                            ]);
                        }
                    }
                ]
            }
        },
        created: function () {
            var prjId = this.getData()
            this.getEntityData(prjId);
        },
        props: ["getData"],
        methods: {
            //编辑高级关联
            seniorEdit(id){
                this.seniorRelation = {};
                this.$http.get('/codegen/api/v1/tables/seniorRelations/'+id).then((response)=>{
                    if (response.data.statusCode == '200') {
                        this.seniorRelation = response.data.seniorRelation;
                        this.seniorRelation.relationTables.forEach((value, index, array)=>{
                            this.$http.get('/codegen/api/v1/tables/'+value.slaveTableId+'/columns').then((res)=>{
                                this.$set(this.seniorRelation.relationTables[index], 'slaveColumns', res.data.columns)
                            });
                        });
                    }
                });
                if (this.masterColumns == null || this.masterColumns.length == 0) {
                    this.$http.get('/codegen/api/v1/tables/'+this.rightForm.id+'/columns').then((response)=>{
                        this.masterColumns = response.data.columns;
                    });
                }
                this.seniorModel = true;
            },
            //删除高级关联
            seniorDelete(id, index){
                this.$http.delete('/codegen/api/v1/tables/seniorRelations/'+id+'/delete').then((response)=>{
                    this.seniorRelationList.splice(index, 1);
                });
            },
            //删除高级关联中的字段或者表
            deleteSenior(columns, index){
                columns.splice(index, 1);
            },
            //高级 从表字段变化
            seniorSlaveColumnChange(slaveColumnName, column, list){
                let scolumn = list.find((db)=>{
                    return db.name == slaveColumnName;
                });
                if (scolumn)
                column.slaveColumnType = scolumn.javaType;
            },
            //高级 主表字段变化
            seniorMasterColumnChange(masterColumnName, column){
                let mcolumn = this.masterColumns.find((db)=>{
                    return db.name == masterColumnName;
                });
                if (mcolumn)
                column.masterColumnType = mcolumn.javaType;
            },
            //保存高级关联
            seniorRelationOk(){
                this.$http.put('/codegen/api/v1/tables/seniorRelations/save', this.seniorRelation).then((response)=>{
                    if (response.data.statusCode == '200') {
                        this.getTableSeniorRelations(this.rightForm.id);
                    }
                });
            },
            //高级关联新增表关联
            addTableRelation(){
                this.seniorRelation.relationTables.push(
                    {
                        relation: 'left join',
                        slaveTableId: '',
                        slaveTableName: '',
                        slaveColumns:[],
                        relationColumns: [
                            {
                                masterTableName:'',
                                slaveTableName:'',
                                masterColumnName:'',
                                slaveColumnName:'',
                                masterColumnType:'',
                                slaveColumnType:'',
                                operate: '='
                            }
                        ]
                    }
                );
            },
            addColumnRelation(i){
                this.seniorRelation.relationTables[i].relationColumns.push(
                    {
                        masterTableName:'',
                        slaveTableName:'',
                        masterColumnName:'',
                        slaveColumnName:'',
                        masterColumnType:'',
                        slaveColumnType:'',
                        operate: '='
                    }
                );
            },
            //新增高级关联
            seniorAdd() {
                this.seniorRelation = {
                    masterTableId : this.rightForm.id,
                    masterTableName : this.rightForm.name,
                    relationTables : [
                        {
                            relation: 'left join',
                            slaveTableId: '',
                            slaveTableName: '',
                            slaveColumns:[],
                            relationColumns: [
                                {
                                    masterTableName:'',
                                    slaveTableName:'',
                                    masterColumnName:'',
                                    slaveColumnName:'',
                                    masterColumnType:'',
                                    slaveColumnType:'',
                                    operate: '='
                                }
                            ]
                        }
                    ]
                };
                this.masterColumns = [];
                this.$http.get('/codegen/api/v1/tables/'+this.rightForm.id+'/columns').then((response)=>{
                    this.masterColumns = response.data.columns;
                    this.seniorModel = true;
                });
            },
            //删除关联关系
            delRelation(id, index){
                this.$http.delete('/codegen/api/v1/tables/relations/'+id+'/delete').then((response)=>{
                    this.tableRelations.splice(index, 1);
                });
            },
            //新增关联
            relationOk(){
                this.$http.put('/codegen/api/v1/tables/relations/save', this.addRelation).then((response)=>{
                    if (response.data.statusCode == '200') {
                        this.tableRelations.push(response.data.tableRelation);
                    }
                });
            },
            //masterChange
            masterChange(index){
                this.addRelation.masterColumnName = this.masterColumns[index].name;
                this.addRelation.masterColumnType = this.masterColumns[index].javaType;
            },
            //slaveChange
            slaveChange(index){
                this.addRelation.slaveColumnName = this.slaveColumns[index].name;
                this.addRelation.slaveColumnType = this.slaveColumns[index].javaType;
            },
            //获取当前表所有关联关系
            getTableRelations(tableId){
                this.$http.get('/codegen/api/v1/tables/'+tableId + '/relations').then((response)=>{
                    this.tableRelations = response.data.tableRelations;
                });
            },
            getTableSeniorRelations(tableId){
                this.$http.get('/codegen/api/v1/tables/'+tableId + '/seniorRelations').then((response)=>{
                    this.seniorRelationList = response.data.seniorRelationList;
                });
            },
            //打开新增关联CRUD Model
            handleAdd(){
                if (this.rightForm.id == null || this.rightForm.id == '') {
                    this.$Message.error('请选择表');
                    return;
                }
                this.$refs['relationForm'].resetFields();
                this.$http.get('/codegen/api/v1/tables/'+this.rightForm.id+'/columns').then((response)=>{
                    this.masterColumns = response.data.columns;
                });
                this.addRelation.masterTableId = this.rightForm.id;
                this.addRelation.masterColumnIndex='';
                this.addRelation.slaveColumnIndex='';
                this.relModel = true;
            },
            relTableChange(id){
                this.$http.get('/codegen/api/v1/tables/'+id+'/columns').then((response)=>{
                    this.slaveColumns = response.data.columns;
                });
            },
            //高级关联 从表变更
            seniorRelTableChange(id, index){
                if (id != null && id != '') {
                    let dbTable = this.displayData.dbData.find((db)=>{
                        return db.id == id;
                    });
                    this.seniorRelation.relationTables[index].slaveTableName = dbTable.name;
                    this.$http.get('/codegen/api/v1/tables/'+dbTable.id+'/columns').then((response)=>{
                        this.seniorRelation.relationTables[index].slaveColumns = response.data.columns;
                    });
                }
            },
            menuSelected (name) {
                var dbIndex
                var _this = this
                for (let i = 0; i < this.menus.length; i++){
                    if (name === this.menus[i].id) {
                        dbIndex = i
                        break
                    }
                }
                this.dbIndex = dbIndex;
                this.editEn (this.dbIndex);
                //this.changePage(1)
            },
            selectRows (rows) {
                this.tabRows = rows
                //console.log(this.tabRows)
            },
            clickRow (row) {
                this.rightForm = {
                    id: row.id,
                    isAutoCrud : row.isAutoCrud,
                    comments: {
                        comments: row.comments
                    }
                };
                this.$set(this.rightForm, "name", row.name);
                if (row.isAutoCrud == 1) {
                    this.getTableRelations(row.id);
                    this.getTableSeniorRelations(row.id);
                }
                //console.log(row)
            },
            cmtTabEdit () {
                var _this = this
                if (this.rightForm.id !=''){
                    this.$http({
                        method: 'put',
                        url: '/codegen/api/v1/tables/' + this.rightForm.id + '/save',
                        data: this.rightForm.comments,
                        showLoading : true
                    }).then((response) => {
                        _this.editEn(_this.dbIndex)
                        _this.$Message.success('提交成功')
                    });
                } else {
                    _this.$Message.error('请选择表')
                }

            },
            autoCrud () {
                var _this = this
                var tabIds = {
                    datasourceId: "",
                    ids: []
                }
                if (this.tabRows.length > 0) {
                    tabIds.datasourceId = this.tabRows[0].datasourceId
                    for (let i = 0; i < this.tabRows.length;i++ ){
                        if (this.tabRows[i].isAutoCrud === '0'){
                            tabIds.ids.push(this.tabRows[i].id)
                        } else {
                            alert('只能选择未激活crud api的表项')
                            return -1
                        }
                    }
                }else {
                    alert('请选择未激活crud api的表项')
                }
                //console.log(tabIds)
                this.$http({
                    method: 'put',
                    url: '/codegen/api/v1/tables/autocrud/change/active',
                    data: tabIds,
                    showLoading : true
                }).then((response) => {
                    _this.editEn(_this.dbIndex)
                    _this.$Message.success('crud api激活成功')
                });
                //console.log('haha')
            },
            inAutoCrud () {
                var _this = this
                var tabIds = {
                    datasourceId: "",
                    ids: []
                }
                if (this.tabRows.length > 0) {
                    tabIds.datasourceId = this.tabRows[0].datasourceId
                    for (let i = 0; i < this.tabRows.length;i++ ){
                        if (this.tabRows[i].isAutoCrud === '1'){
                            tabIds.ids.push(this.tabRows[i].id)
                        } else {
                            alert('只能选择已激活crud api的表项')
                            return -1
                        }
                    }
                } else {
                    alert('请选择已激活crud api的表项')
                }
                this.$http({
                    method: 'put',
                    url: '/codegen/api/v1/tables/autocrud/change/inactive',
                    data: tabIds,
                    showLoading : true
                }).then((response) => {
                    _this.editEn(_this.dbIndex)
                    _this.$Message.info('crud api已停止')
                });
            },
            //同步数据库
            syncDB: function () {
                this.$http({
                    method: 'get',
                    url: '/codegen/api/v1/datasources/' + this.displayData.id + '/tables/sync',
                    data: '',
                    showLoading : true
                }).then((response) => {
                    if (response.data.statusCode == '200') {
                        this.$http.post('/codegen/api/v1/datasources/' + this.displayData.id + '/tables',this.param).then((response) => {
                            this.displayData.dbData = response.data.data;
//                            this.totalNum = response.data.totalElements;
                            this.editEn (this.dbIndex);
//                            this.changePage(1);
                            this.$Message.success('同步成功');
                        });
                    }
                });
            },
            //menu选中
            editEn (index) {
                this.displayData.dbName = this.menus[index].name;
                this.displayData.id = this.menus[index].id;
//                this.param.pageParms.pageSize = this.pageSize;
                this.$http.post('/codegen/api/v1/datasources/' + this.menus[index].id + '/tables',this.param).then((response) => {
                    this.displayData.dbData = response.data.data;
//                    _this.totalNum = response.data.totalElements;
                    //console.log(response.data)
                });
            },
            getEntityData (prjId) {
                var _this = this;
                this.$http.get('/codegen/api/v1/projects/' + prjId + '/show').then((response) => {
                    _this.menus = response.data.project.datasources;
                    if (_this.menus.length > 0) {
                        _this.activeName = _this.menus[0].id;
                        _this.$nextTick(()=>{
//                            _this.$refs['dbList'].updateActiveName();
                        });
                        _this.editEn(0);
                    }
                }).catch(err => {
                    alert(err.message);
                });
            },
            addTab (data, componentType) {
                var _this = this;
                this.$emit('child-addTab', {
                    label : componentType==='conf-mag'?_this.displayData.dbData[data.index].name + '_项目表配置':_this.displayData.dbData[data.index].name + '_Api',
//                        function(){
//                        debugger
//                        switch (componentType) {
//                            case 'conf-mag' :
//                                return  _this.displayData.dbData[data.index].name + '_项目表配置';
//                            case 'api-mag' :
//                                return  _this.displayData.dbData[data.index].name + '_Api';
//                        }
//                    },
                    id : componentType + data.index,
                    componentType : componentType,
                    someData: function(){
                        let ownData = ''
                        switch (componentType) {
                            case 'conf-mag' :
                                ownData =  _this.displayData.dbData[data.index].id
                                return  ownData;
                            case 'api-mag' :
                                return  ownData;
                        }
                    },
                });
            },
            getCode (data) {
                this.$http({
                    method: 'get',
                    url: '/codegen/api/v1/tables/' + data.id + '/generate/code',
                    data: '',
                    showLoading : true
                }).then((response) => {
                    if (response.data.statusCode === '0') {
                        let id = data.id;
                        let url = global.host + response.data.msgData;
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
                                    a.download = data.name + '.zip';
                                    a.href = e.target.result;
                                    body.appendChild(a);
                                    a.click();
                                    body.removeChild(a);
                                }
                            }
                        };
                        xhr.send();

                    } else {
                        this.$Message.error('代码生成失败')
                    }
                })
                //console.log(data)
            },
            remove (index) {
                this.displayData.dbData.splice(index, 1);
            }
        }
    }
</script>
