<template>
    <div style="text-align:center">
        <h1>Error</h1>
        {{error.message}} {{error.statusCode}}
    </div>
</template>

<script>
    export default {
        head(){
            return{
                title: 'Not found'
            }
        },
        props:{
            error:{
                type: Object,
                required: true
            }
        }
    }
</script>