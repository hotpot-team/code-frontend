<style>
    div.search-item {
        margin-right: 16px;
        margin-bottom: 16px;
    }
    
</style>
<template>
    <div style="margin: 16px" id="customTable">
        <Form ref="formValidate" v-if="tableConfig.searchForm && tableConfig.searchForm.length > 0"  inline :label-width=70>
            <Form-item v-for="col in tableConfig.searchForm" :key="col.key" :label="col.comments" :prop="col.key">
                <Date-picker :type="col.javaType" :placeholder="col.placeholder" v-model="col.value" v-if="['date','LocalDateTime','datetime','datetimerange','year','month'].indexOf(col.javaType) > -1" :format="col.format"></Date-picker>
                <Time-picker :type="col.javaType" :placeholder="col.placeholder" v-model="col.value" v-else-if="['time','timerange'].indexOf(col.javaType) > -1" :format="col.format"></Time-picker>
                <Select v-model="col.value" v-else-if="col.javaType == 'select'" :multiple="col.multiple" style="width:200px">
                    <Option v-for="item in col.options" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
                <Input v-model="col.value" :placeholder="col.placeholder" v-else></Input>
            </Form-item>
             <Button type="info" @click="search">查询</Button>

        </Form>
        <Button v-if="tableConfig.isAdd" style="margin-bottom: 15px;margin-top: -12px"  type="primary" icon="plus-round">新增</Button>
        <Table :columns="tableConfig.tableColumns" :data="tableData"></Table>
        <div style="margin: 10px;overflow: hidden" v-if="tableConfig.isPage">
            <div style="float: right;">
                <Page :total="totalNum" :page-size="pageSize" :current="currentPage" @on-change="changePage" show-total show-sizer @on-page-size-change="changePageSize" placement="top"></Page>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                totalNum: 0,
                currentPage : 1,
                pageSize: 10,
                tableData: [{id:"1"},{id:"2",},{id:"3"}],
                searchData: {},
                pageFlag : true,
               
            }
        },
        ruleValidate: {},
        props : ['tableConfig'],
        created : function () {
            // this.getTableData(1);
            // if (this.tableConfig.pageTool != null) {
            //     this.pageFlag = this.tableConfig.pageTool;
            // }
        },
        watch: {
  
        },
        methods: {
            getTableData : function (pageNum) {
                var _this = this;
                this.$http.post(this.tableConfig.url + pageNum + '/' + this.pageSize, this.searchData).then(response => {
                    _this.tableData = response.body.list;
                    _this.totalNum = response.body.total;
                    _this.currentPage = pageNum;
                }, response => {
                    // error callback
                });
            },
            search : function(event) {
                for (var i = 0; i < this.tableConfig.searchForm.length; i++) {
                    if (['date','daterange','datetime','datetimerange','year','month'].indexOf(this.tableConfig.searchForm[i].type) > -1 && this.tableConfig.searchForm[i].value != null && this.tableConfig.searchForm[i].value != '') {
                        this.searchData[this.tableConfig.searchForm[i].key] = this.tableConfig.searchForm[i].value.Format("yyyy-MM-dd hh:mm:ss");
                    } else {
                        this.searchData[this.tableConfig.searchForm[i].key] = this.tableConfig.searchForm[i].value;
                    }
                }
                this.getTableData(1);
            },
            changePage (index) {
                // 这里直接更改了模拟的数据，真实使用场景应该从服务端获取数据
                this.tableData = this.getTableData(index);
            },
            changePageSize(size) {
                this.pageSize = size;
                this.tableData = this.getTableData(1);
            }
        }
    }
</script>

