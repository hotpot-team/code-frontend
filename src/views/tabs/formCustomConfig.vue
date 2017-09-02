<style scoped>


    .btnclass{
        margin: 10px 15px;
   }
   tr{
    cursor:pointer
   }
</style>
<template>
    <div style="height:100%">
        <Row style="height:100%; position:relative">
            <Col span="17" style="height: 100%;overflow-y: auto;">
                <div style=" padding:16px 0px">
                  <span>添加和修改地址：</span>
                   <Select v-model="selectHref" style="width:220px" placeholder="请选择" :value="selectHref">
                      <Option v-bind:value="href" v-for="(href,index) in hrefs">{{href}}</Option>
                  </Select>
                    <Button class="btnclass" type="primary">重置数据</Button>
                    <Button class="btnclass" style="margin:0px" type="primary" @click="saveConfig">保存配置</Button>
                    <Button class="btnclass" type="primary" @click="previewForm">预览表单</Button>
                </div>
                <div style="padding-right:15px">
                    <Table @on-row-click="showDetail" width='100%' id="sortTable" :columns="columns1" :data="tabData"></Table>
                </div>
            </Col>
            <Col span="7" style="height:100%; border-left:1px solid #ddd">
                <tr-detail @saveTrData="saveTrData" :rowData="trData"></tr-detail>
            </Col>
        </Row>
        
        <Modal
            v-model="modelShow"
            title="新增配置"
            @on-ok=""
            width="600"
            ok-text="保存"
            @on-cancel="">
            <div>
                <con-form v-if="modelShow" :formData="tabData"></con-form>
            </div>
            
        </Modal>
    </div> 
</template>
<script>
import ConForm from '../../template/vueForm'
import TrDetail from '../../template/trDetail'

    export default {
        data() {
            return {
               // url:"http://baidu.com",
               modelShow:false,
               trData:{},
               selectHref:'http://www.baidu111',
                hrefs:[
                    'http://www.baidu111',
                    'http://www.baidu222',
                    'http://www.baidu333',
                ],
               columns1: [
                    {
                        title: '显示',
                         key: 'isShow',
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
                       
                      
                    },
                    {
                        title: '字段键值',
                        key: 'javaField',
                       
                    },
                    {
                        title: '表单排序',
                        key: 'sortIndex',
                        /*sortable: true,*/
                        align: 'center',
                        render: (h, params) => {
                            return h('div', {
                                on:{
                                      'click':(event)=>{
                                          this.sortTable(params.index)
                                          event.stopPropagation();
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
                            }),h('strong', params.row.sortIndex)]);
                        }
                    },
                    {
                        title: '是否验证',
                        width:100,
                        align: 'center',
                        key: 'isValidate',
                        render: (h, params) => {
                            return h('Checkbox', {
                                props: {
                                     value:params.row.isValidate,
                                    
                                },
                                on: {
                                    'on-change': () => {
                                        this.setValidate(params.index)
                                    }
                                }
                            })
                        }
                    }
                ],
                tabData:[],
                data: {
                }
            }
        },
        name:'FormConfig',
        props:["url", "configData"],
        components : {
          'con-form':ConForm,
          'tr-detail':TrDetail
        },
        computed:{

        },
        beforeMount(){
            if(this.configData){
                this.getData();
                return ;
            }
            

        },
        watch: {
            configData:function(newData, oldData){
                if(newData != oldData){
                    this.getData();
                }
            }
        },
        methods: {
            getData(){
                var url = "/codegen/api/v1/viewconfig/49f8549c-0b6f-460a-9698-4c0da295e645/formConfigs";
                this.$http.get(url).then((response) => { 
                    if (response.data.statusCode == 200) { 
                       this.initData(response.data.formConfigs);
                    }
                }).catch(function(err){
                    console.log(err);
                });
            },
            showDetail(data){
                this.trData = data;
            },
            initData(data){
              this.tabData = data;
              var self = this;
              data.forEach(function(item, index){
                self.tabData[index].sortIndex = index+1;
                if(self.tabData[index].isValidate == "0"){
                  self.tabData[index].isValidate = false;
                }else{
                  self.tabData[index].isValidate = true;
                }
                
              })

            },
            setShow (index) {
                this.tabData[index].isShow = ! this.tabData[index].isShow;
                console.log(this.tabData[index].isShow)
                event.stopPropagation();
            },
            setValidate(index){
                this.tabData[index].isValidate = ! this.tabData[index].isValidate;
                event.stopPropagation();
            },
            sortTable(index, upIndex){
                if(index==0 && !upIndex){
                    return ;
                }
                if(!upIndex && upIndex!=0){
                    upIndex = index-1;
                }
                let _tabData = this.tabData;
                let data = _tabData[index];
                let indexOne = _tabData[index].sortIndex;
                let indexTwo = _tabData[upIndex].sortIndex;

                _tabData[index] = _tabData[upIndex];
                _tabData[index].sortIndex = data.sortIndex
                _tabData[upIndex] = data;
                _tabData[upIndex].sortIndex = indexTwo;
                _tabData[index].sortIndex = indexOne;

                this.tabData =  _tabData.slice(0); 
            },
           saveConfig(){
                this.$emit('saveData', {"name":"formConfig", data:this.tabData});
           },
           saveTrData(trData){
            var index = trData.oldIndex?trData.oldIndex:trData.data.sortIndex;
            if(this.tabData[index-1].sortIndex == index){
                for (var key in trData.data) {
                  if(key != "sortIndex"){
                    this.tabData[index-1][key] = "";
                    this.tabData[index-1][key] = trData.data[key]
                  }   
                };
            }
            if(trData.oldIndex){
              this.sortTable(trData.oldIndex-1, Number(trData.data.sortIndex)-1);
            } 
            this.$Message.success('保存成功');
           },
           previewForm(){
            var data = [];
            this.tabData.forEach(function(item){
              if(item.isShow){
                data.push(item);
              }
            })
            if(data.length == 0){
              this.$Message.warning('请选择需要显示的字段！');
              return ;
            }
            this.modelShow = true;
            // this.tableShow = !this.tableShow;
           }
        }
    }
</script>