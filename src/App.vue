<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
body {
  padding-bottom: 40px;
  background-color: #f6f6f6;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.auto-img {
  width:100%;
  display: block;
}
.fl {
  float: left;
}
.fr {
  float: right;
}
.clear::after {
  content: '';
  display: block;
  clear: both;
}
</style>
