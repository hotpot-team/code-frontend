<style>
    .tab-content {
        background-color: #fff;
        border: 1px solid #dddee1;
        border-top: none;
        height: calc(100% - 76px);
        width: 100%;
        padding: 16px;
    }
    .add-positon {
        width: 100%;
        text-align: right;
        margin-bottom: 8px;
    }
    .tab-conf-content-block {
        background: #f5f7f9;
        width: 100%;
        height: 100%;
        padding: 16px;
        border: 1px solid #dddee1;
        border-radius: 4px;
        overflow: auto;
    }

    .tab-conf-content-block .ivu-table-wrapper {
        height:100%;
    }

    .regix-show-out {
        display: none;
    }

</style>
<template>
    <div class="tab-content">
        <Row>
            <Col span="18" style="height:100%">
                <div class="tab-conf-content-block">
                    <Table highlight-row @on-current-change="rowSelect" :data="tableData1" :columns="tableColumns1" stripe ></Table>
                </div>
            </Col>
            <Col span="6" style="height:100%">
                <div class="tab-conf-content-block" style="margin:0 10px">
                    <Form ref="formvalid" :rules="formRule" :model="formDispaly">
                        <div style="border-bottom:1px solid #e3e8ee;padding-bottom: 8px;margin-bottom: 5px">
                            <h3>编辑 {{formDispaly.name}} 字段</h3>
                        </div>
                        <!-- <Form-item label="实体属性类型">
                            <Select v-model="formDispaly.javaType" style="width:200px" @on-change="chJavaType">
                                <Option v-for="item in propList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Form-item> -->
                        <Form-item label="是否为空">
                            <Radio-group v-model="formDispaly.isNullable">
                                <Radio label="1">是</Radio>
                                <Radio label="0">否</Radio>
                            </Radio-group>
                        </Form-item>
                        <Form-item label="是否只读">
                            <Radio-group v-model="formDispaly.readOnly">
                                <Radio label="1">是</Radio>
                                <Radio label="0">否</Radio>
                            </Radio-group>
                        </Form-item>
                        <Form-item label="字段描述">
                            <Input v-model="formDispaly.comments" ></Input>
                        </Form-item>
                        <Form-item :label="isString?'最小长度':'最小值'" prop="min" v-show="formDispaly.javaType !== 'Date'">
                            <Input v-model="formDispaly.min"></Input>
                        </Form-item>
                        <Form-item :label="isString?'最大长度':'最大值'" prop="max" v-show="formDispaly.javaType !== 'Date'">
                            <Input v-model="formDispaly.max"></Input>
                        </Form-item>
                        <Form-item :label="isString?'正则表达式':''">
                            <div :class="isString?'':'regix-show-out'">
                                <Input v-model="formDispaly.pattern"></Input>
                            </div>
                        </Form-item>
                        <Form-item>
                            <Row>
                                <Col span="5">
                                    <Button type="primary" @click="commit()">提交</Button>
                                </Col>
                            </Row>
                        </Form-item>
                    </Form>
                </div>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                formRule: {
                    min: [
                        {pattern:/^\d*$/, message: '只能为数字', trigger: 'change'}
                    ],
                    max: [
                        {pattern:/^\d*$/, message: '只能为数字', trigger: 'change'}
                    ]
                },
                propList: [
                    {
                        value: "String",
                        label: "String"
                    },
                    {
                        value: "Integer",
                        label: "Integer"
                    },
                    {
                        value: "LocalDateTime",
                        label: "LocalDateTime"
                    }
                ],
                formDispaly: {
                    name: '',
                    comments: '',
                    isNullable: '',
                    //javaType: '',
                    readOnly: '',
                    max: '',
                    min: '',
                    pattern: ''
                },
                isString: true,
                isEmpty: '1',
                readOnly: '0',
                tableData1: [],
                tableColumns1: [
                    {
                        title: '字段名',
                        key: 'name'
                    },
                    {
                        title: '实体属性名',
                        key: 'javaField'
                    },
                    {
                        title: '字段类型',
                        key: 'jdbcType',
                        //width: 200
                    },
                    {
                        title: '实体属性类型',
                        key: 'javaType',
                        //width: 200,
                    },
                    {
                        title: '字段描述',
                        key: 'comments',
                    },
                    {
                        title: '是否为空',
                        key: 'isNullable',
                        render: (h, params) => {
                            if (params.row.isNullable === '0') {
                                return '否'
                            } else if (params.row.isNullable === '1') {
                                return '是'
                            }
                            //console.log(params)
                        }
                    },
                    {
                        title: '是否只读',
                        key: 'readOnly',
                        render: (h, params) => {
                            if (params.row.readOnly === '0') {
                                return '否'
                            } else if (params.row.readOnly === '1') {
                                return '是'
                            }
                            //console.log(params)
                        }
                    },
                ]
            }
        },
        props: ["getData"],
        created :function () {
            this.mockTableData1();
        },
        methods: {
            // chJavaType (value) {
            //     console.log(value)
            //     if (value === 'String') {
            //         this.isString = true
            //     } else {
            //         this.isString = false
            //     }
            // },
            commit () {
                var disData = {}
                var commitData = {}
                var index
                var _this = this
                disData = this.formDispaly
                if (disData.name === '') {
                    this.$Message.error('请选择字段')
                } else {
                    for (let i = 0; i < this.tableData1.length; i++) {
                        if ( disData.name === this.tableData1[i].name){
                            index = i
                        }
                    }
                    console.log(disData)
                    commitData = this.tableData1[index]
                    //console.log(commitData)
                    commitData.isNullable = disData.isNullable
                    commitData.readOnly = disData.readOnly
                    //commitData.javaType = disData.javaType
                    commitData.comments = disData.comments
                    commitData.tableId = this.getData() //在请求参数中加入tableId
                    commitData.min = disData.min
                    commitData.max = disData.max
                    if ( this.isString === true ) {
                        commitData.pattern = disData.pattern
                    } else {
                        commitData.pattern = ''
                    }
                    for (var i in commitData) {
                        var value = commitData[i];
                        if (value === null) {
                            delete commitData[i];
                        }
                    }
                //var commitJson = JSON.stringify(commitData)
                    console.log(typeof(commitData.min))
                    if (commitData.max !== null && commitData.max !== '' && commitData.max < commitData.min){
                        this.$Message.error('最小值大于最大值')
                    } else {
                        this.$refs['formvalid'].validate((valid) => {
                            if (valid){
                                this.axios({
                                    method: 'post',
                                    url: '/codegen/api/v1/column/save',
                                    data: commitData,
                                    showLoading : true
                                }).then((response) => {
                                    _this.mockTableData1()
                                    _this.$Message.success('提交成功')
                                });
                            } else {
                                this.$Message.error('请正确填写表单')
                            }
                        })
                    }

                }

            },

            rowSelect (curr,pre) {
                console.log(curr)
                var data = {}
                data.name = curr.name
                data.isNullable = curr.isNullable
                data.readOnly = curr.readOnly
                data.javaType = curr.javaType
                data.min = curr.min
                data.max = curr.max
                data.pattern = curr.pattern
                data.comments = curr.comments
                if (curr.javaType === "String") {
                    this.isString = true
                } else {
                    this.isString = false
                }
                this.formDispaly = data
            },
            mockTableData1 () {
                this.$http.get('/codegen/api/v1/tables/'+this.getData()+'/columns').then((response)=>{
                    console.log(response);
                    this.tableData1 = response.data.columns;
                });
            },
        }
    }
</script>
