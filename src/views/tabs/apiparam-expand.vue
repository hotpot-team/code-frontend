<style>

</style>
<template>
    <div>
        <Row class="expand-row">
            <Col span="8">
                <span class="expand-key">必需：</span>
                <span class="expand-value">{{ row.isRequired == '1' ? '是' : '否'}}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">类型：</span>
                <span class="expand-value">{{ row.type }}</span>
            </Col>
            <Col span="8">
                <span class="expand-key">格式：</span>
                <span class="expand-value">{{ row.type == 'array' ? row.format.substring(row.format.indexOf('.')+1,row.format.length) : row.format }}</span>
            </Col>
        </Row>
    </div>
</template>
<script>
    export default {
        props: {
            row: Object
        }
    };
</script>
