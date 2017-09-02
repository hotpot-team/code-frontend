<style scoped>
    #tabCustomConfig .tab-content{
        width:auto;
        min-width:0px
    }
    #tabCustomConfig .menu-tab-left{
        float:left;
        width:260px;
        height:100%;
        border-right: 1px solid #dddee1;
    }
    #tabCustomConfig .centerContent{
        height: 100%;
        position: absolute;
        right: 0px;
        left: 273px;
        padding-top:10px;
   }
   #tabCustomConfig .topCon{
       height:100%;
        border:1px solid #dddee1;
        border-radius: 5px;
        min-width:1380px;
        position: relative;
   }
   #tabCustomConfig .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
        border-right: 2px solid #2d8cf0 !important;
   }

</style>
   
<style>
    #tabCustomConfig .ivu-tabs-content{
        height: calc(100% - 32px);
    }
</style>
<template>
    <div id="tabCustomConfig" style="height:100%; position:relative">
        <div class="tab-content">
        <div class="topCon">
            <div class="menu-tab-left">
                <Button style='margin: 5px 24px;margin-top: 22px;' @click="modelShow = true"  icon="plus" type="info">新增配置</Button>
                <div class="menubox">
                <Menu active-name="0"  width="auto"  @on-select="showContent">
                    <Menu-item :name="index" :key="menuItem.id"  v-for="(menuItem,index) in ulList" >
                       <span class="layout-text">{{menuItem.id}}</span>
                    </Menu-item>
                </Menu>
                </div>
            </div>
            <div class="centerContent">
            <Tabs value="tabConfig" >
                <Tab-pane style="padding: 10px;" label="表格配置" name="tabConfig" id="_table_config">
                    <tab-config v-if="configShow"  @saveData="saveData" :configData="currentData" ></tab-config>
                </Tab-pane>
                <Tab-pane style="padding:0px 10px;" label="表单配置" name="formConfig">
                    <form-config v-if="configShow"  @saveData="saveData" :configData="currentData"></form-config>
                </Tab-pane>
            </Tabs>
                
            </div>
        </div>
        </div>
    
        <Modal
            v-model="modelShow"
            title="新增表格配置"
            @on-ok="saveConfig"
            width="700"
            ok-text="保存"
            @on-cancel="">
            <Form :model="formItem" :label-width="80" style="padding-right:20px">
                <Form-item label="配置名称">
                    <Input v-model="formItem.configName" placeholder="请输入"></Input>
                </Form-item>
                <Form-item label="选择表">
                    <Select v-model="formItem.tab" placeholder="请选择" @on-change="setPath">
                        <Option v-for="(item, index) in tabApis" :value="item.id">{{item.name}}</Option>
                    </Select>
                </Form-item>
                <!--<div style="background: #fafafa;margin-top: -7px;margin-bottom: 20px;line-height: 26px;text-align: center;color: #60aeed;margin-right: -20px;">url配置</div>-->
                <Form-item label="添加数据">
                    <Select v-model="formItem.add" placeholder="请选择">
                        <Option v-for="(item, index) in pathList" :value="item.id">{{item.uri}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="修改数据">
                    <Select v-model="formItem.modify" placeholder="请选择">
                        <Option v-for="(item, index) in pathList" :value="item.id">{{item.uri}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="查询数据">
                    <Select v-model="formItem.search" placeholder="请选择">
                        <Option v-for="(item, index) in pathList" :value="item.id">{{item.uri}}</Option>
                    </Select>
                </Form-item>
                <Form-item label="删除数据">
                    <Select v-model="formItem.delete" placeholder="请选择">
                        <Option v-for="(item, index) in pathList" :value="item.id">{{item.uri}}</Option>
                    </Select>
                </Form-item>

            </Form>
        </Modal>

    </div>
    
</template>
<script>
    import TableConfig from './tabCustomConfig'
    import FormConfig from './formCustomConfig'
    
    export default {
        data() {
            return {
               url:"http://baidu.com/das",
               configShow:false,
               modelShow:false,
               tabAction: [],
               prjId:"",
               current:0,
               formItem: {
                    configName:"",
                    tab:"",
                    search:"",
                    add:"",
                    modify:"",
                    delete:""
                },
                tabApis:[],
                pathList:[],
                ulList:[
                ],
                currentData:{}
            }
        },
        created: function () {
            this.prjId = this.getData()
            this.getTabApis();
            this.refreshMenu();
            //this.getEntityData(prjId);
        },
        props: ["getData"],
        components : {
           'tab-config' : TableConfig,
           'form-config' : FormConfig,
        },
        watch: {

        },
        methods: {
            getTabApis(){
                var url = "/codegen/api/v1/viewconfig/"+this.prjId+"/dtoApiList";
                this.$http.get(url).then((response) => {
                    if (response.data.statusCode == 200) {
                        this.initData(response.data.tableApis)
                    };  
                }).catch(function(err){
                    console.log(err);
                });
            },
            initData(params){
                this.tabApis = params;
            },
            setPath(value){
                var self = this;
                this.tabApis.forEach(function(item, index){
                    if(item.id == value){
                        self.pathList = item.pathList;
                        return ;
                    }

                })
            },
            saveConfig(){
                var url = "/codegen/api/v1/viewconfig/save";
                var data = {};
                data.projectId = this.prjId;
                data.savePath = this.formItem.add;
                data.searchPath = this.formItem.search;
                data.deletePath = this.formItem.delete;
                data.updatePath = this.formItem.modify;
                this.$http.post(url, data).then((response) => {  
                   // console.log(response); 
                   if (response.data.statusCode == 200) {
                        this.refreshMenu();
                    }
                }).catch(function(err){
                    console.log(err);
                });
            },
            refreshMenu(){
                var url = "/codegen/api/v1/viewconfig/"+this.prjId+"/show";
                this.$http.get(url).then((response) => { 
                    if (response.data.statusCode == 200) { 
                       this.ulList = response.data.apiViews;
                       if(this.ulList.length>0){
                        //this.configShow = true;
                       }
                   }
                }).catch(function(err){
                    console.log(err);
                }); 
            },
            showContent(index){
                this.configShow = true;
                this.currentData = this.ulList[index];

           },
           saveData(data){
                console.log(data);
           },
           
        }
    }
</script>