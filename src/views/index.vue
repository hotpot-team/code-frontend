<style scoped>
    .wrapper {
        width: 100%;
        height: 100%;
    }

    .index {
        vertical-align: middle;
        text-align: center;
        margin-top: 150px;
    }

    .col-cell {
        border: 1px solid #dddddd;
        height: 250px;
    }

    .row-margin {
        margin: 8px 0;
    }

</style>
<template>
    <div class="wrapper">
        <div class="index">
            <Row type="flex" justify="center" align="middle">
                <Col span="4" class="col-cell">
                    <div style="margin: 16px">
                        <h1 class="row-margin">LOGIN</h1>
                        <Input v-model="username" placeholder="username" class="row-margin"></Input>
                        <Input v-model="password" placeholder="password" class="row-margin"></Input>
                        <Button class="row-margin" v-on:click="login">Login</Button>
                    </div>
                </Col>
            </Row>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                username : '',
                password : ''
            };
        },
        created : function () {
          console.log(global.ajaxUrl);
        },
        methods : {
            login : function() {
                this.$router.push({path:'/main'});
            }
        }
    };
</script>