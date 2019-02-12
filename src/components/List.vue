<template>
  <div>
    <h2>問題一覧</h2>
    <ul v-for="item in questionLinks" :key="item.name">
      <li>
        <router-link :to="{path:item.path}">
          Q.{{item.name.split("ans").join("")}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import ItemComponent from '@/router/questions.js'


export default {
  name: 'HelloWorld',
  data () {
    return {
      questionLinks : ItemComponent
    }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  /* display: inline-block; */
  margin: 0 10px;
}
</style>
