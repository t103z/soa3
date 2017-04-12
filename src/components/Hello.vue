<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <h2>You Can</h2>
    <ul>
      <li><b-link to="/register">Register</b-link></li>
      <li>or</li>
      <li><b-link to="/login">Login</b-link></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Welcome to Used Car Evaluation Platform'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

h2 {
  font-size: x-large;
  margin-top: 30px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
