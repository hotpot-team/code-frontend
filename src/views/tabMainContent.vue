<style scoped>



</style>
<template>
    <div>
        <div>
            <Form :model="formLeft"  >
                <Form-item label="姓名">
                    <Input v-model="formLeft.input1" style="width: 120px"></Input>
                </Form-item>
                <Form-item label="年龄">
                    <Input v-model="formLeft.input2" style="width: 120px"></Input>
                </Form-item>
                <Form-item label="工作地址">
                    <Input v-model="formLeft.input3" style="width: 120px"></Input>
                </Form-item>
                <Button style="margin-left:10px" type="primary" >查询</Button>
            </Form>
        </div>
            <Table id="tableOne"  :columns="columns2" :data="data2"></Table>
    </div> 
</template>
<script>
    export default {
        data() {
            return {
                formLeft: {
                    input1: '',
                    input2: '',
                    input3: ''
                },
                columns2: [
                    {
                        title: '姓名',
                        key: 'name',
                        
                    },
                    {
                        title: '年龄',
                        key: 'age',
                        sortable: true
                    },
                    {
                        title: '工作地址',
                        key: 'address',
                    },
        
                ],
                data2: [
                    {
                        name: '王小明',
                        age: 18,
                        id:1,
                        address: '北京市朝阳区芍药居',
                        isShow:true,
                    },
                    {
                        name: '张小刚',
                        age: 25,
                        id:2,
                        isShow:true,
                        address: '北京市海淀区西二旗'
                    },
                    {
                        id:3,
                        name: '李小红',
                        age: 30,
                        isShow:true,
                        address: '上海市浦东新区世纪大道'
                    },
                    {
                        id:4,
                        name: '周小伟',
                        age: 26,
                        address: '深圳市南山区深南大道'
                    },
                    {
                        id:5,
                        name: '李红',
                        age: 30,
                        isShow:true,
                        address: '上海市浦东新区世纪大道'
                    },
                    {
                        id:6,
                        name: '周伟',
                        age: 26,
                        isShow:true,
                        address: '深圳市南山区深南大道'
                    },
                   
                ],
               }
        },
        name:'TableConfig',
        components : {
          
        },
        watch: {

        },
        methods: {
            show (index) {
                debugger
                console.log(index)
            },
            showContent(name){
            console.log(name)
           },
           customSort(){
                console.log("asdasd")
           },
           saveTabConfig(){

           },
           createTable(){
            // this.tableShow = !this.tableShow;
           }
        }
    }
</script>