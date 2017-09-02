<style scoped>
    .btnclass{
        margin: 16px 15px;
   }
</style>
<template>
    <div>
        <div style="padding:16px 0px 8px ">

            <span style="margin-left:17px; margin-bottom:10px">添加数据地址：</span>
            <Select v-model="selectTwo" style="width:220px" placeholder="请选择" :value="selectTwo">
                <Option v-bind:value="href" v-for="(href,index) in hrefs">{{href}}</Option>
            </Select>
            <span style="margin-left:20px">删除数据地址：</span>
            <Select v-model="selectTwo" style="width:220px" placeholder="请选择" :value="selectTwo">
                <Option v-bind:value="href" v-for="(href,index) in hrefs">{{href}}</Option>
            </Select>
            <br/>
            <Button class="btnclass" type="primary">重置数据</Button>
            <Button class="btnclass" style="margin:0px" type="primary" @click="saveTabConfig">保存配置</Button>
            <Button class="btnclass" type="primary" @click="previewTab">预览表格</Button>
            <CheckboxGroup  style="display:inline-block; margin-left:15px">
                <Checkbox v-model="tabConfigData.isAdd" size="large" label="add"><span>可新增</span></Checkbox>
                <Checkbox v-model="tabConfigData.isModify" size="large" label="update"><span>可修改</span></Checkbox>
                <Checkbox v-model="tabConfigData.isDelete" size="large" label="delete"><span>可删除</span></Checkbox>
                <Checkbox v-model="tabConfigData.isPage" size="large" label="pageFlag"><span>分页</span></Checkbox>
            </CheckboxGroup>
        </div>
        <div style="padding-right:15px">
            <Table width='100%' id="sortTable" :columns="columns1" :data="columnsData"></Table>
        </div>
        <Modal
            v-model="modelShow"
            title="表格预览"
            width="1000"
            @on-ok=""
            ok-text="确定"
            @on-cancel="">
            <con-table v-if="modelShow" :tableConfig="tabConfigData"></con-table>
        </Modal>
    </div> 
</template>
<script>
    import ConTable from '../../template/vueTable'
    export default {
        data() {
            return {
                // url:"http://baidu.com",
                tabAction: [],
                modelShow:false,
                selectOne:'add',
                selectTwo:'http://www.baidu222',
                hrefs:[
                    'http://www.baidu111',
                    'http://www.baidu222',
                    'http://www.baidu333',
                ],
                tabConfigData:{isAdd:false, isModify:false, isDelete:false, isPage:false},
                columnsData:[],
                columns1: [
                    {
                        title: '显示',
                         key: 'isShow',
                        fixed: 'left',
                        width:100,
                        render: (h, params) => {
                            return h('Checkbox', {
                                props: {
                                     value:params.row.isShow,
                                    
                                },
                                on: {
                                    'on-change': () => {
                                        this.setShow(params.index)
                                    }
                                }
                            })
                        }
                    },
                    {
                        title: '字段名称',
                        key: 'comments',
                       
                    },
                    {
                        title: '字段类型',
                        key: 'javaType',
                    },{
                        title: '字段键值',
                        key: 'javaField',
                    },{
                        title: '列排序',
                        key: 'index',
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                on:{
                                        'click':()=>{
                                            this.sortTable(params.index)
                                        }
                                    }} ,[
                                h('Icon', {
                                    props: {
                                        type: 'arrow-up-a',
                                        size:'20'
                                    },
                                    style:{
                                        padding:'13px',
                                        cursor:'pointer',
                                        marginLeft:'-16px',
                                        color: '#2196F3'
                                    },    
                            }),h('strong', params.index+1)]);
                        }
                    },
                    {
                        title: '可查询',
                        width:100,
                        key: 'isSearch',
                        render: (h, params) => {
                            return h('Checkbox', {
                                props: {
                                     value:params.row.isSearch,
                                    
                                },
                                on: {
                                    'on-change': () => {
                                        this.setSearch(params.index)
                                    }
                                }
                            })
                        }
                    }
                ],
                tabData:[],
                data: {}
            }
        },
        name:'TableConfig',
        components : {
            'con-table':ConTable
        },
        props:["url", "configData"],
        beforeMount(){
            if(this.configData){
                this.setConfigData(this.configData);
                this.getData();
                return ;
            }
            //  this.$http.get('./data.json').then((response) => {  
            //        console.log(response);  
            //        this.initData(response.data.properties)
            // }).catch(function(err){
            //     console.log(err);
            // });
  
            
        },
        computed:{

        },
        watch: {
            configData:function(newData, oldData){
                if(newData != oldData){
                    this.setConfigData(newData);
                    this.getData();
                }
            }
        },
        methods: {
            getData(){
                var url = "/codegen/api/v1/viewconfig/49f8549c-0b6f-460a-9698-4c0da295e645/tableConfigs";
                this.$http.get(url).then((response) => { 
                    if (response.data.statusCode == 200) { 
                       this.initData(response.data.tableConfigs);
                    }
                }).catch(function(err){
                    console.log(err);
                });
            },
            setConfigData(data){
                if(data.isAdd == true || data.isAdd == "true"){
                    this.tabConfigData.isAdd = true;
                }else{
                    this.tabConfigData.isAdd = false;
                }
                if(data.isModify == true || data == "true"){
                    this.tabConfigData.isModify = true;
                }else{
                    this.tabConfigData.isModify = false;
                }
                if(data.isDelete == true || data.isDelete == "true"){
                    this.tabConfigData.isDelete = true;
                }else{
                    this.tabConfigData.isDelete = false;
                }
                if(data.isPage == true || data.isPage == "true"){
                    this.tabConfigData.isPage = true;
                }else{
                    this.tabConfigData.isPage = false;
                }
            },
            initData(data){
                this.tabData = [];
                this.columnsData = data;
                var self = this;
                data.forEach(function(item, index){
                    self.columnsData[index].title = item.comments;
                })
                // for(var key in data){
                //     let obj = {};
                //     var colobj = {};

                //     obj.code = key;
                    
                //     //colobj.key = key;
                //     for(var h in data[key]){
                //         obj[h] = data[key][h];
                //     }
                //     //if(obj.comments){
                //         //colobj.title = obj.description;
                //         obj.title = obj.comments;
                //         //this.tabData.push(obj);
                //         this.columnsData.push(obj);
                //     //}   
                    
                // } 
            },
            setHref(){

            },
            setShow (index) {
                this.columnsData[index].isShow = ! this.columnsData[index].isShow;
                // this.tabData[index].isShow = ! this.tabData[index].isShow;
            },
            setSearch(index){
                this.columnsData[index].isSearch = ! this.columnsData[index].isSearch;
                // this.tabData[index].isSearch = ! this.tabData[index].isSearch;
            },
            sortTable(index){
                if(index==0){
                    return ;
                }
                // let _tabData = this.tabData;
                // let data = _tabData[index];
                // _tabData[index] = _tabData[index-1];
                // _tabData[index-1] = data;
                // this.tabData =  _tabData.slice(0); 

                let _columnsData = this.columnsData;
                let dataTwo = _columnsData[index];
                _columnsData[index] = _columnsData[index-1];
                _columnsData[index-1] = dataTwo;
                this.columnsData =  _columnsData.slice(0); 
            },
            saveTabConfig(){
                this.$emit('saveData', {"name":"tabConfig", data:this.data, action:this.tabAction});
           },
           previewTab(){
            var colData = [];
            var searchData = [];
            this.columnsData.forEach(function(item, index){
                if(item.isShow){
                    colData.push(item);
                }
                if(item.isSearch){
                    // let seaObj = {};
                    // seaObj.title = item.title;
                    // seaObj.key = item.key;
                    // seaObj.type = item.type;
                    // seaObj.value = "";
                    searchData.push(item);
                }
            })
            // var dataLen = this.tabData.length;
            // for (var i = 0; i < dataLen; i++) {
            //     if(this.tabData[i].isSearch){
                    
            //         searchData.push(this.tabData[i]);
            //     }
            // };

            if(colData.length == 0){
                this.$Message.warning('请选择显示字段！');
                return ;
            } 
                var arr= [];
                if(this.tabConfigData.isModify){
                    let obj = {};
                    obj.text = "修改";
                    obj.type = "primary";
                    arr.push(obj);
                }
                if(this.tabConfigData.isDelete){
                    let obj = {};
                    obj.text = "删除";
                    obj.type = "error";
                    arr.push(obj);
                }
                if(arr.length>0){
                    var obj = {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', arr.map(item => {
                              return h('Button', {
                                        props: {
                                            type: item.type,
                                            size: 'small'
                                        },
                                        style: {
                                            marginRight: '5px'
                                        },
                                        on: {
                                            click: () => {
                                                alert("message")
                                            }
                                        }
                                }, item.text)
                            }))
                        }
                    }
                     colData.push(obj);
                }
            // this.columns2 = colData;
            this.tabConfigData.searchForm = searchData;
            this.tabConfigData.tableColumns = colData;
            this.modelShow = true;

           }
        }
    }
</script>