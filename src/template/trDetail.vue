<style scoped>
    
</style>
<style>
    #trDetail .readonly .ivu-input{
        background:#eee;
    }
</style>
<template>
    <div style="padding:15px" id="trDetail">
        <div style="text-align: center;margin-bottom: 26px;font-size: 16px;">字段详情</div>  
        <Form inline :label-width="80">
            <FormItem label="字段名称">
                <Input class="readonly" style="width:100px;" :value="trData.comments" readonly ></Input>
            </FormItem>
            <FormItem label="字段类型">
                <Input class="readonly" style="width:100px;" :value="trData.javaType" readonly ></Input>
            </FormItem>
            <FormItem label="字段键值">
                <Input  class="readonly" style="width:100px;" :value="trData.javaField" readonly ></Input>
            </FormItem>
            <FormItem label="是否必填">
                <Select style="width:100px" v-model="trData.isNullable" value="trData.isNullable" >
                    <Option v-for="item in selectData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="是否只读">
                <Select style="width:100px" v-model="trData.readOnly" value="trData.readOnly" >
                    <Option v-for="item in selectData" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
            <FormItem label="正则表达式">
                <Input style="width:100px" v-model="trData.pattern" :value="trData.pattern" ></Input>
            </FormItem>
            <FormItem label="最小值">
                <Input style="width:100px" v-model="trData.min" :value="trData.min" ></Input>
            </FormItem>
            <FormItem label="最大值">
                <Input style="width:100px" v-model="trData.max" :value="trData.max" ></Input>
            </FormItem>
            <FormItem label="排序">
                <Input style="width:100px" v-model="trData.sortIndex" :value="trData.sortIndex" ></Input>
            </FormItem>
            <FormItem label="时间格式" v-if="['date','daterange','datetime','datetimerange','year','month'].indexOf(trData.type) > -1">
                <Input style="width:100px" v-model="trData.format" :value="trData.format" ></Input>
            </FormItem>
            <div v-if="trData.type == 'select'">
                <p>选项配置</p>
                <FormItem label="选项label" >
                    <Input style="width:100px" v-model="trData.optValue" :value="trData.optValue" ></Input>
                </FormItem>
                <FormItem label="选项value">
                    <Input style="width:100px" v-model="trData.optLabel" :value="trData.optLabel" ></Input>
                </FormItem>
                <p style="font-size: 12px;color: #b4b4b4;margin-top: -15px">多个选项请用逗号隔开</p>
            </div>
            
        </Form>
        <Button style="margin-left: 30px;" @click="saveData" type="primary">保存</Button>
    </div> 
</template>
<script>
 export default {
    data() {
        return {
            selectData: [
                    {
                        value: '1',
                        label: '是'
                    },
                    {
                        value: '0',
                        label: '否'
                    }
                ],
                trData:{},
                oldIndex:0
        }
        
    },
    props : ['rowData'],
    created : function () {
        
        this.trData = this.rowData
        this.oldIndex = this.trData.sortIndex
        // this.getTableData(1);
        // if (this.tableConfig.pageTool != null) {
        //     this.pageFlag = this.tableConfig.pageTool;
        // }
    },
    watch: {
        rowData:function(newData, oldData){
            this.trData = newData;
            this.oldIndex = this.trData.sortIndex
        }
    },
    methods: {
        saveData(){ 
            var data = this.trData;
            if(data.optLabel){
                var labelData = data.optLabel.split(",");
                var valueData = data.optValue.split(",");
                var len = labelData.length;
                if(len != valueData.length){
                    return ;
                }
                data.options = [];
                for (var i = 0; i < len; i++) {
                    data.options[i] = {};
                    data.options[i].label = labelData[i];
                    data.options[i].value = valueData[i];

                };
                // delete data.optValue;
                // delete data.optLabel; 
            }
            if( this.oldIndex !=  this.trData.sortIndex){
                this.$emit('saveTrData', {data:data, oldIndex: this.oldIndex});
                this.oldIndex = this.trData.sortIndex;
            }else{
                this.$emit('saveTrData', {data:data});
            }
            
        },

    }
}
</script>