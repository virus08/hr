<template>
  <div>
    <div class="header">
      <h2>Blog Name</h2>
    </div>

    <v-row>
      <div class="leftcolumn">
        <div v-for="item in [0, 1, 2, 3]" :key="item" class="card">
          <h2>TITLE HEADING</h2>
          <h5>Title description, Dec 7, 2017</h5>
          <div class="fakeimg" style="height:200px;">Image</div>
          <p>Some text..</p>
        </div>
      </div>
      <div class="rightcolumn">
        <div class="card">
          <h2>About Me</h2>
          <div class="fakeimg" style="height:100px;">Image</div>
          <p>Some text about me in culpa qui officia deserunt mollit anim..</p>
        </div>

        <div class="card">
          <h3>Follow Me</h3>
          <p>Some text..</p>
        </div>
      </div>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "home",
  components: {
    // HelloWorld
  },
};
</script>
<style scoped>
body {
  font-family: Arial;
  padding: 20px;
  background: #f1f1f1;
}

/* Header/Blog Title */
.header {
  padding: 10px;
  font-size: 20px;
  text-align: center;
  background: #f1f1f1;
}

/* Create two unequal columns that floats next to each other */
/* Left column */
.leftcolumn {
  height: 530px;
  overflow: auto;
  padding-left: 12px;
  float: left;
  width: 80%;
}

/* Right column */
.rightcolumn {
  padding: 10px;
  float: left;
  width: 20%;
}

/* Fake image */
.fakeimg {
  background-color: #aaa;
  width: 100%;
  padding: 20px;
}

/* Add a card effect for articles */
.card {
  background-color: white;
  padding: 20px;
  margin-top: 20px;
}

/* Clear floats after the columns */
.row:after {
  content: "";
  display: table;
  clear: both;
}

/* Footer */
.footer {
  padding: 20px;
  text-align: center;
  background: #ddd;
  margin-top: 20px;
}

/* Responsive layout - when the screen is less than 800px wide, make the two columns stack on top of each other instead of next to each other */
@media screen and (max-width: 800px) {
  .leftcolumn,
  .rightcolumn {
    width: 100%;
    padding: 0;
  }
}
</style>
