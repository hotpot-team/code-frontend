<style scoped lang="scss">
    .role-model {
        padding: 16px;
        .role-model-left{
            height: 100%;
            border: 1px solid #dddee1;
            .content-title{
                width: 100%;
                height: 50px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                text-align: left;
                padding:0 10px;
                border-bottom: 1px solid #dddee1;
                background: #f8f8f9;
                display: flex;
                span{
                    font-size: 16px;
                }
            }
            .left-form{
                padding: 16px;
            }

            .too{
                .people-button {
                    text-align: right;
                    margin-bottom: 16px;
                }

                .tab-pane{
                    border: 1px solid #dddee1;
                    padding: 16px;
                    border-top: none;
                }
            }
        }
    }
    .el-tree{
        border: none;
    }
</style>
<style lang="scss">
    .role-model{
        .too{
            .ivu-tabs-bar{
                margin: 0;
            }
        }
    }
</style>
<template>
    <div>
        <!--添加人员对话框-->
        <Modal v-model="addPersonModal"
               width="900"
               :closable="false"
               :mask-closable="false">
            <p slot="header" class="title">
                <span>人员选择器</span>
            </p>
            <div>
                <div>
                    <Form :model="addPersonSearch" class="addPerson" inline>
                        <FormItem>
                            <i-input v-model="addPersonSearch.organizationName" placeholder="公司" readonly>
                            <Button slot="append" icon="share" @click="modal6=true"></Button>
                            </i-input>
                        </FormItem>
                        <FormItem>
                            <i-input v-model="addPersonSearch.departmentName" placeholder="部门" readonly>
                            <Button slot="append" icon="share" @click="addPersonDepShow"></Button>
                            </i-input>
                        </FormItem>
                        <FormItem>
                            <i-input v-model="addPersonSearch.name" placeholder="姓名或账号"></i-input>
                        </FormItem>
                        <FormItem>
                            <Button @click="refreshPersonSearch" type="info" style="float: right;">
                                <Icon type="refresh"></Icon>
                                <span>刷新</span>
                            </Button>
                            <Button @click="searchPerson(0, 50)" type="info" style="float: right;margin-right:10px">
                                <Icon type="search"></Icon>
                                <span>查询</span>
                            </Button>
                        </FormItem>
                    </Form>
                </div>
                <Table ref="personSelectTable" @on-row-dblclick="personSelect($event)" border :loading="addPersonSearch.loading" :columns="personColumns" :data="addPersonModalData" :height="350"></Table>
                <Page :total="addPersonSearch.total" show-total :page-size="50" @on-change="personPageChange" style="margin-top: 16px"></Page>
            </div>
            <div slot="footer">
                <i-button @click="cancel1">关闭</i-button>
            </div>
        </Modal>
        <!--添加人员对话框中公司对话框-->
        <Modal v-model="modal6"
               :mask-closable="false">
            <p slot="header" class="title">
                <span>公司名单</span>
            </p>
            <div>
                <Table border :columns="addCompanyContent" :data="addCompanyContentData" :height="350" @on-row-dblclick="addCompanySelect($event)"></Table>
            </div>
            <div slot="footer"></div>
        </Modal>
        <!--添加人员对话框中部门对话框-->
        <Modal v-model="modal7"
               :mask-closable="false">
            <p slot="header" class="title">
                <span>选部门</span>
            </p>
            <div style="display: flex;justify-content: space-between">
                <Select v-model="depOrgSearch" :disabled="isDepOrgSearch" style="width:200px" @on-change="depOrgChange">
                    <Option v-for="item in addCompanyContentData" :value="item.organizationId" :key="item.organizationId">{{ item.organizationName }}</Option>
                </Select>
                <Button type="info" @click="addPersonDepSelect">确认选择</Button>
            </div>
            <div style="height: 350px;overflow: auto;margin-top: 16px">
                <el-tree
                        :data="depTree"
                        :props="depTreeProps"
                        :load="loadDepNode"
                        highlight-current
                        @current-change="depCurrentChange"
                        lazy>
                </el-tree>
            </div>
            <div slot="footer"></div>
        </Modal>
    </div>
</template>
<script type="text/ecmascript-6">
    import Util from '../../libs/util';
    export default {
        props:[
            'addPersonModal',//控制框出现的变量
        ],
        data() {
            return {
                modal6: false,//选择公司弹出框
                modal7: false,//选择部门弹出框
                addPersonModalData: [],//新增人员对话框数据
                addCompanyContentData: [],//添加人员中查询公司对话框数据,
                depTree: [],
                depTreeProps: {
                    label: 'departmentName'
                },
                depOrgSearch:'',//部门选择界面-公司
                isDepOrgSearch: false,
                currentDep: {}, //当前选中node
                addPersonSearch: { //新增人员查询
                    organizationId: '',
                    organizationName: '',
                    departmentId: '',
                    departmentName: '',
                    name: '',
                    loading: false,
                    total: 0
                },
//                选择的管理员信息
                admins : {
                    adminId:'',
                    adminName:'',
                    adminDepart:''
                },
//                //添加人员对话框表格
                personColumns: [
                    {
                        title: '姓名',
                        key: 'userFullName'
                    },
                    {
                        title: '部门',
                        key: 'departmentName',
                        render: (h, params) => {
                            let userInfo = JSON.parse(this.base64.decode(params.row.userDesc));
                            let depFull = userInfo.departmentName;
                            return depFull.replace(/_/g, '/');
                        }
                    },
                    {
                        title: '组织',
                        key: 'companyName',
                        render: (h, params) => {
                            let userInfo = JSON.parse(this.base64.decode(params.row.userDesc));
                            return userInfo.companyName;
                        }
                    }
                ],
                addCompanyContent: [
                    {
                        title: '公司编码',
                        width: 100,
                        key: 'organizationCode'
                    },
                    {
                        title: '公司名称',
                        key: 'organizationName'
                    }
                ],
            }
        },
        created(){
            this.companyInit();
        },
        methods: {
            //人员选择 刷新
            refreshPersonSearch(){
                this.addPersonSearch.organizationId = this.addCompanyContentData[0].organizationId;
                this.addPersonSearch.organizationName =  this.addCompanyContentData[0].organizationName;
                this.addPersonSearch.departmentName = '';
                this.addPersonSearch.departmentId = '';
                this.addPersonSearch.name = '';
                this.searchPerson(0, 50);
            },
            //人员选择 翻页
            personPageChange(pageNum) {
                this.searchPerson(pageNum-1, 50);
            },
            //人员选择 查询
            searchPerson(pageIndex, pageSize){
                this.addPersonSearch.loading = true;
                Util.resAjax.get('/rescenter-rest/ResCenterApi/getUserListBySearch',{
                    params:{
                        identityToken: this.getToken(),
                        keyWords: this.addPersonSearch.name,
                        organizationID: this.addPersonSearch.organizationId,
                        departmentID: this.addPersonSearch.departmentId,
                        allChild: false,
                        pageIndex: pageIndex,
                        pageSize: pageSize
                    }
                }).then((response)=>{
                    this.addPersonSearch.loading = false;
                    if (response.data.result == 1) {
                        this.addPersonModalData = response.data.data.userList;
                        this.addPersonSearch.total = response.data.data.recordCount;
                    }
                });
            },
            cancel1(){
                this.$emit("setback");
            },
            //显示部门选择页面
            addPersonDepShow() {
                this.depOrgSearch = this.addPersonSearch.organizationId;
                this.isDepOrgSearch = true;
                this.departmentInit(this.addPersonSearch.organizationId);
                this.modal7 = true;
            },
            //公司切换 重新查询部门
            depOrgChange(orgId){
                this.departmentInit(orgId);
            },
            //部门节点选中监听
            depCurrentChange(data, node){
                console.log(data);
                this.currentDep = Object.assign({}, this.currentDep, data);
            },
            addCompanySelect(param){
                this.addPersonSearch.organizationId = param.organizationId;
                this.addPersonSearch.organizationName = param.organizationName;
                this.searchPerson(0, 50);
                this.modal6 = false;
            },
            //人员选择 person选中
            personSelect(param){
                this.admins.adminId = param.userId;
                this.admins.adminName = param.userFullName;
                let userInfo = JSON.parse(this.base64.decode(param.userDesc));
                let depFull = userInfo.departmentName;
                this.admins.adminDepart = depFull.replace(/_/g, '/');
                this.$emit('adminConfig',this.admins);
            },
            addPersonDepSelect(){
                this.addPersonSearch.departmentId =  this.currentDep.departmentId;
                this.addPersonSearch.departmentName =  this.currentDep.departmentName;
                this.modal7 = false;
            },
            //获取所有公司
            companyInit(){
                if (this.addCompanyContentData == null || this.addCompanyContentData.length == 0) {
                    Util.resAjax.get('/rescenter-rest/ResCenterApi/getOrganizationList', {
                        params:{
                            identityToken: this.getToken(),
                            pageIndex: 0,
                            pageSize: 0
                        }
                    }).then((response) => {
                        if (response.data.result == 1) {
                            this.addCompanyContentData = response.data.data.organizationList;
                            this.departmentInit(this.addCompanyContentData[0].organizationId);
                            this.refreshPersonSearch();
                        }
                    });
                }
            },
            //获取所有部门
            departmentInit(organizationId){
                Util.resAjax.get('/rescenter-rest/ResCenterApi/getDepartmentListByOrgID', {
                    params:{
                        identityToken: this.getToken(),
                        organizationId: organizationId,
                        allChild: false,
                        pageIndex: 0,
                        pageSize: 0
                    }
                }).then((response) => {
                    if (response.data.result == 1) {
                        this.depTree = response.data.data.departmentList;
                    }
                });
            },
            loadDepNode(node, resolve) {
                let loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
                let token = loginInfo.authToken;
                if (node.data.hasChildren) {
                    Util.resAjax.get('/rescenter-rest/ResCenterApi/getChildDepartmentList', {
                        params:{
                            identityToken: token,
                            departmentID: node.data.departmentId,
                            allChild: false,
                            pageIndex: 0,
                            pageSize: 0
                        }
                    }).then((response) => {
                        if (response.data.result == 1) {
                            console.log(response.data);
                            resolve(response.data.data.departmentList);
                        }
                    });
                } else {
                    resolve([]);
                }
            },
            getToken(){
                let loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
                let token = loginInfo.authToken;
                return token;
            }
        }
    }

</script>