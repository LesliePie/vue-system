<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>
<script>
    export default {
        name:'app',
        data(){
            return {
                user: { //保存用户信息
                    login: null,
                    id:null,
                    name:null,
                    roles: [],
                    resources: []
                }
            }
        }
    }
</script>
<style>
    @import "../static/css/main.css";
    @import "../static/css/color-dark.css";     /*深色主题*/
    /*@import "../static/css/theme-green/color-green.css";   浅绿色主题*/
</style>
