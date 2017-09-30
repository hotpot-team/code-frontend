<style>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        height: 100%;
    }
    .layout-logo{
        width: 100px;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 15px;
        left: 20px;
    }
    .layout-header{
        height: 60px;
        background: #fff;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-content {
        display: block;
        width: 100%;
        height: calc(100% - 86px);
        padding: 16px;
        position: relative;
    }

    .layout-copy{
        text-align: center;
        padding: 10px 0 20px;
        color: #9ea7b4;
    }
    .layout-ceiling{
        background: #464c5b;
        padding: 10px 0;
        overflow: hidden;
    }
    .layout-ceiling-main{
        float: right;
        margin-right: 15px;
    }
    .layout-ceiling-main a{
        color: #9ba7b5;
    }

    .ivu-tabs-bar {
        margin-bottom: 0px !important;
    }

    .layout-content .ivu-tabs{
        height: 100%;
    }

    .ivu-tabs .ivu-tabs-tabpane {
        height: 100%;
        overflow: auto;
    }

    .ivu-tabs-content{
        height: calc(100% - 32px);
    }

    .tab-content {
        background-color: #fff;
        border: 1px solid #dddee1;
        border-top: none;
        height: 100%;
        width: 100%;
        padding: 16px;
        overflow: auto;
    }
</style>
<template>
    <div class="layout">
        <div class="layout-ceiling">
            <div class="layout-ceiling-main">
                <a href="#">注册登录</a> |
                <a href="#">帮助中心</a> |
                <a href="#">安全中心</a> |
                <a href="#">服务大厅</a>
            </div>
        </div>
        <div class="layout-content">
            <Tabs type="card" @on-tab-remove="handleTabRemove" v-model="acTab" :animated="false">
                <Tab-pane label="项目管理" name="pojMag"><poj-mag v-on:child-addTab="addTab"></poj-mag></Tab-pane>
                <Tab-pane v-for="tab in tabList" :key="tab.id" v-bind:label="tab.label" v-bind:name="tab.id" closable>
                    <component v-bind:is="tab.componentType" @child-addTab="addTab" :getData="someData"></component>
                </Tab-pane>
            </Tabs>
            <Button v-show="showX > 0" type="text" icon="chevron-left" style="position: absolute;top: 20px;left: 0px;z-index: 9999;width: 16px;padding: 0;" @click="leftTab"></Button>
            <Button v-show="showX > 0" type="text" icon="chevron-right" style="position: absolute;top: 20px;right: 0px;z-index: 9999;width: 16px;padding: 0;" @click="rightTab"></Button>
        </div>
        <div class="layout-copy">
            2011-2016 &copy; TalkingData
        </div>
        <Loading :loading="showLoading"></Loading>
    </div>
</template>
<script>
    import Loading from '../template/loading.vue'
    import {mapGetters} from 'vuex'
    import PojMag from './tabs/pojmag.vue'
    import DataMag from './tabs/datamag.vue'
    import ApiMag from './tabs/apimag.vue'
    import ConfMag from './tabs/confmag.vue'
    import EntiMag from './tabs/entimag.vue'
    export default {
        data() {
            return {
                indexX: 0,
                showX: 0,
                acTab : 'pojMag',
                tabList : [],
                someData: ''
            }
        },
        components : {
            'poj-mag' : PojMag,
            'data-mag' : DataMag,
            'api-mag' : ApiMag,
            'conf-mag' : ConfMag,
            'enti-mag' : EntiMag,
            'Loading' : Loading
        },
        computed: mapGetters(
            ['showLoading']
        ),
        watch: {
            acTab: function (val, olval) {
                for (var i = 0; i < this.tabList.length; i++) {
                    if (this.tabList[i].id == val) {
                        this.someData = this.tabList[i].someData
                        //切换标签时，传入对应标签的someData字段到this.someData,将由组件的getData属性获得并传入组件，一般传入的内容为组件发起页面内容初始化时，request请求所需的内容
                    }
                }
            },
            tabList : function () {
                console.log(1);
                this.$nextTick(function () {
                    let fw = document.getElementsByClassName('ivu-tabs-nav-scroll')[0].clientWidth;
                    let cw = document.getElementsByClassName('ivu-tabs-nav')[0].clientWidth;
                    if (cw > fw) {
                        this.showX++;
                    } else {
                        this.showX = 0;
                    }
                });
            }
        },
        methods: {
            handleTabRemove (tabId) {
                for (var i = 0; i < this.tabList.length; i++) {
                    if (this.tabList[i].id == tabId) {
                        this.tabList.splice(i, 1);
                        if (tabId == this.acTab) {
                            if (this.tabList.length > 0) {
                                this.acTab = this.tabList[i].id;
                            } else {
                                this.acTab = 'poj-mag';
                            }
                        }
                        break;
                    }
                }
            },
            addTab : function (data) {
                if (!tabContains(this.tabList, data)) {
                    this.acTab = data.id;
                    this.tabList.push(data);
                } else {
                    this.acTab = data.id;
                }
            },
            leftTab() {
                if (this.indexX > 0) {
                    let obj = document.getElementsByClassName('ivu-tabs-nav')[0];
                    let x = 0;
                    this.indexX --;
                    for (let i=0; i < this.indexX; i++) {
                        x += document.getElementsByClassName('ivu-tabs-tab')[i].offsetWidth;
                    }
                    obj.style.webkitTransform="translate(-"+x+"px)";
                }
            },
            rightTab() {
                if (this.indexX < this.showX) {
                    let obj = document.getElementsByClassName('ivu-tabs-nav')[0];
                    let x = 0;
                    this.indexX ++;
                    for (let i=0; i < this.indexX; i++) {
                        x += document.getElementsByClassName('ivu-tabs-tab')[i].offsetWidth;
                    }
                    obj.style.webkitTransform="translate(-"+x+"px)";
                }
            }
        }
    }
    function tabContains(list, obj) {
        var i = list.length;
        while (i > 0) {
            i--;
            if (list[i].id == obj.id) {
                return true;
            }
        }
        return false;
    }
</script>
