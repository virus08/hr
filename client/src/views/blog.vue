<template>
  <div>
    <div class="header">
      <h2>{{ blog.name }}</h2>
    </div>

    <v-row>
      <div class="leftcolumn">
        <div v-for="item in blog.contents" :key="item.id" class="card">
          <v-hover v-slot:default="{ hover }">
            <v-card class="mx-auto" color="grey lighten-4">
              <v-img :src="'http://localhost:8081' + item.himage.url">
                <v-expand-transition>
                  <div
                    v-if="hover"
                    class="d-flex transition-fast-in-fast-out black darken-4 v-card--reveal white--text"
                    style="height: 100%;padding: 45px;"
                  >
                    <p>
                      <span style="padding: 15px;"> &emsp;&ensp;</span
                      >{{ item.shot_content }}
                    </p>
                  </div>
                </v-expand-transition>
              </v-img>
              <v-card-text class="pt-6" style="position: relative;">
                <v-btn
                  absolute
                  color="orange"
                  class="white--text"
                  fab
                  large
                  right
                  top
                >
                  <v-icon @click.native="$router.push('/content/' + item.id)"
                    >mdi-file-word</v-icon
                  >
                </v-btn>
                <h3 class="display-1 font-weight-light orange--text mb-2">
                  {{ item.title_heading }}
                </h3>
                <div class="font-weight-light title mb-2">
                  {{ item.title_description }}
                </div>
              </v-card-text>
              <v-card-actions>
                <v-spacer />
                <i class="grey--text"> {{ item.created_at | datesimple }}</i>
              </v-card-actions>
            </v-card>
          </v-hover>
          <br />
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
import axios from "axios";
var moment = require("moment");

export default {
  name: "Blog",
  filters: {
    datesimple: function(value) {
      if (!value) return "";
      return moment(value).format("MMMM Do YYYY");
    },
  },
  components: {
    // HelloWorld
  },
  data: () => ({
    blog: { name: null },
  }),
  methods: {
    async init() {
      let res = await axios({
        method: "get",
        url: process.env.VUE_APP_DATAAPI + "blogs/" + this.$route.params.name,
      });
      this.blog = res.data;

      //console.log(res.data);
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style scoped>
body {
  font-family: Arial;
  padding: 20px;
  background: #f1f1f1;
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
/* Header/Blog Title */
.header {
  padding: 30px;
  font-size: 40px;
  text-align: center;
  background: #f1f1f1;
}

/* Create two unequal columns that floats next to each other */
/* Left column */
.leftcolumn {
  height: 600px;
  overflow: auto;
  padding-left: 12px;
  float: left;
  width: 75%;
}

/* Right column */
.rightcolumn {
  padding: 10px;
  float: left;
  width: 25%;
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
