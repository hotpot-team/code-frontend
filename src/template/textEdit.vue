<template>
    <div v-if="type == 'select'">
        <span v-if="showflag" @click="spanClick" class="span-show">{{val}}</span>
        <Select v-model="val" v-if="!showflag" @on-change="showSpan">
            <Option v-for="item in options" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
    </div>
    <div v-else>
        <span v-if="showflag" @click="spanClick" class="span-show">{{val}}</span>
        <Input v-model="val" placeholder="请输入..." v-if="!showflag" @on-blur.stop="showSpan"></Input>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                showflag : true,
                val : '',
                key : ''
            }
        },
        created : function () {
           this.val = this.tableData[this.params.index][this.params.column.key];
        },
        props : ['tableData','params','type','options'],
        components : {
        },
        methods: {
            spanClick : function () {
                this.showflag = false;
                document.addEventListener('click', this.docClick);
            },
            docClick : function (e) {
                this.tableData[this.params.index][this.params.column.key] = this.val;
                if(!this.$el.contains(e.target) && e.target.className != 'span-show') {
                    this.showflag = true;
                    document.removeEventListener('click', this.docClick);
                }
            },
            showSpan : function () {
                this.showflag = true;
                this.tableData[this.params.index][this.params.column.key] = this.val;
            }
        }
    };
</script>