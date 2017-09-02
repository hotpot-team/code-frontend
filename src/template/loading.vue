<style>
    .demo-spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
        font-size: 26px !important;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }

    .vertical-center-modal{
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .loading-modal .ivu-modal {
        top:0;
    }
    .loading-modal .ivu-modal-content {
        background: transparent;
    }

    .loading-modal .ivu-spin-fix {
        background: transparent;
    }
    .loading-modal .ivu-modal-footer {
        display: none;
    }
    .loading-modal .ivu-spin-text {
        color: #eee;
    }
</style>
<template>
    <Modal v-model="loading" :closable="false" :mask-closable="false" class-name="vertical-center-modal loading-modal" width="110">
        <Spin fix>
            <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
            <div>Loading</div>
        </Spin>
    </Modal>
</template>
<script>
    export default {
        data () {
            return {
            }
        },
        props : ['loading']
    };
</script>