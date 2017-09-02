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

    .tab-content-block {
        background: #f5f7f9;
        width: 100%;
        height: 100%;
        padding: 16px;
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

</style>
<template>
    <div class="tab-content" style="overflow: hidden;position: relative">
        <Row>
            <Col span="4" class="tab-content-col" style="padding-right: 8px">
                <div class="tab-content-block">
                    <div class="search-menu">
                        <Input v-model="searchMenu" icon="search" placeholder="请输入..."></Input>
                    </div>
                    <div style="position: absolute;left: 16px;bottom: 16px;top: 60px;">
                        <Menu ref="dbList" theme="light" :active-name="activeName" @on-select="menuSelected">
                            <Menu-item v-show="searchMenu == '' || item.name.indexOf(searchMenu) > -1" v-for="(item, index) in menus" :key="item.id" :name="item.id">
                                <div class="entity-row"  @click="editEn(index)">
                                    <Row>
                                        <Col span="8">
                                        <div>
                                            {{item.name}}
                                        </div>
                                        </Col>
                                    </Row>
                                </div>
                            </Menu-item>
                        </Menu>
                    </div>
                </div>
            </Col>
            <Col span="20"  class="tab-content-col" style="padding-left: 8px;">
                <div class="tab-content-block">
                    <Card :bordered="false" style="background: #f5f7f9" dis-hover>
                        <div slot="title">
                            <div v-if="displayData.dbName != null && displayData.dbName != ''">
                                {{displayData.dbName}}
                                <Button type="primary" @click="syncDB" style="margin-left: 16px;" icon="refresh">同步</Button>
                                <Button type="primary" @click="autoCrud">激活CRUD API</Button>
                                <Button type="primary" @click="inAutoCrud">停止CRUD API</Button>
                            </div>
                        </div>
                        <Table :data="displayData.dbData" :columns="tableColumns1" @on-selection-change="selectRows" stripe ></Table>
                    </Card>
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                tabRows: [],
                dbIndex: '',
                displayData: {
                    dbName: '',
                    dbData: [],
                },
                activeName: '',
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
                        pageSize: 5,
                        recordCount: 0
                    }
                },
                menus : [],
                searchMenu: '',
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
                        key: 'isAutoCrud',
                        render: (h, params) => {
                            if (params.row.isAutoCrud == 0) {
                                return '否';
                            } else
                                return '是';
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
                                            this.addTab(params, 'conf-mag')
                                        }
                                    }
                                }, '配置表'),
                                // h('Button', {
                                //     props: {
                                //         size: 'small'
                                //     },
                                //     on: {
                                //         click: () => {
                                //             this.show(params.index)
                                //         }
                                //     }
                                // }, '自动创建CRUD API'),
                                h('Button', {
                                    props: {
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.show(params.index)
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
            menuSelected (name) {
                for (let i = 0; i < this.menus.length; i++){
                    if (name === this.menus[i].id) {
                        this.dbIndex = i
                        break
                    }
                }
                console.log(this.dbIndex)
            },
            selectRows (rows) {
                this.tabRows = rows
                console.log(this.tabRows)
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
                this.$http.put('/codegen/api/v1/tables/autocrud/change/active', tabIds).then((response)=>{
                    _this.editEn(_this.dbIndex)
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
                this.$http.put('/codegen/api/v1/tables/autocrud/change/inactive', tabIds).then((response)=>{
                    _this.editEn(_this.dbIndex)
                });
            },
            //同步数据库
            syncDB: function () {
                this.$http.get('/codegen/api/v1/datasources/'+this.displayData.id+'/tables/sync').then((response)=>{
                    if (response.data.statusCode == '200') {
                        this.$http.post('/codegen/api/v1/datasources/' + this.displayData.id + '/tables',this.param).then((response) => {
                            this.displayData.dbData = response.data.data;
                        });
                    }
                });
            },
            //menu选中
            editEn (index) {
                this.displayData.dbName = this.menus[index].name;
                this.displayData.id = this.menus[index].id;
                this.$http.post('/codegen/api/v1/datasources/' + this.menus[index].id + '/tables',this.param).then((response) => {
                    this.displayData.dbData = response.data.data;
                });
            },
            getEntityData (prjId) {
                var _this = this;
                this.$http.get('/codegen/api/v1/projects/' + prjId + '/show').then((response) => {
                    _this.menus = response.data.project.datasources;
                    if (_this.menus.length > 0) {
                        _this.activeName = _this.menus[0].id;
                        _this.$nextTick(()=>{
                            _this.$refs['dbList'].updateActiveName();
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
                    label : function(){
                        switch (componentType) {
                            case 'conf-mag' :
                                return  _this.displayData.dbData[data.index].name + '_项目表配置';
                            case 'api-mag' :
                                return  _this.displayData.dbData[data.index].name + '_Api';
                        }
                    },
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
            remove (index) {
                this.displayData.dbData.splice(index, 1);
            }
        }
    }
</script>
