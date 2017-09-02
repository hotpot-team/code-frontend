<style scoped>

</style>
<template>
    <div>
        <Form  :label-width="80" >
            <Form-item v-bind:label="item.comments" v-for="(item,index) in formData" v-if="item.isShow">
            <Row>
                <Col span="22">
                    <Date-picker style="width:100%" :type="item.javaType" :placeholder="item.placeholder" v-if="['date','daterange','datetime','LocalDateTime','year','month'].indexOf(item.javaType) > -1" :format="item.format"></Date-picker>
                    <Time-picker :type="item.javaType" :placeholder="item.placeholder" v-else-if="['time','timerange'].indexOf(item.javaType) > -1" :format="item.format"></Time-picker>
                    <Select v-else-if="item.javaType == 'select'" :multiple="item.multiple" style="width:100%">
                        <Option v-for="opt in item.options" :value="opt.value" :key="opt.value">{{ opt.label }}</Option>
                    </Select>
                    <Input :placeholder="item.placeholder" v-else></Input>
                </Col>
            </Row>
                
            </Form-item>
        </Form>
    </div> 
</template>
<script>
 export default {
    data() {
        return {
            
        }
    },
    props : ['formData'],
    created : function () {
        // this.getTableData(1);
        // if (this.tableConfig.pageTool != null) {
        //     this.pageFlag = this.tableConfig.pageTool;
        // }
    },
    watch: {

    },
    methods: {

    }
}
</script>