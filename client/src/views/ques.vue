<template>
  <div>
    <div class="header blue lighten-5">
      <h2>Knowledge test</h2>
    </div>

    <v-row>
      <div class="leftcolumn">
        <div v-for="(item, i) in questions" :key="i" class="card">
          <div class="indigo lighten-5">
            <v-row style="padding-left:10px;padding-right:10px;">
              <v-col cols="9"> {{ i + 1 }}. {{ item.question }}</v-col>
              <v-col cols="1"
                ><!-- <span v-if="item.result">True</span>--></v-col
              >
              <v-spacer />
              <v-col cols="2" class="grey--text mb-2 text-right"
                >Select ({{ item.ans.length }})</v-col
              >
            </v-row>
          </div>
          <div v-for="c in item.choices" :key="c.id">
            <v-checkbox
              v-if="showans"
              disabled
              v-model="item.ans"
              :value="c.id"
              color="success"
              :label="c.name"
            />
            <v-checkbox
              v-else
              v-model="item.selected"
              :value="c.id"
              color="success"
              :label="c.name"
              @change="check(i)"
            />
          </div>
        </div>
      </div>
      <div class="rightcolumn">
        <div class="card">
          <h2>จำนวนข้อสอบ ({{ questions.length }}) ข้อ</h2>
          <v-container fluid class="pa-0">
            <v-row>
              <v-col cols="1" v-for="(item, i) in questions" :key="i">
                <v-btn v-if="item.selected.length > 0" icon color="indigo">
                  <v-icon>mdi-star</v-icon>
                </v-btn>
                <v-btn v-else icon color="red">
                  {{ i + 1 }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>
        </div>
        <div class="card">
          <v-row>
            <v-text-field
              v-model="account.name"
              label="ผู้ทำข้อสอบ"
            ></v-text-field>
          </v-row>
          <v-row>
            <!-- <v-switch v-model="showans" label="เฉลย" /> -->
            <v-spacer /><v-btn
              v-if="account.name"
              small
              rounded
              color="primary"
              @click="send"
              >Send</v-btn
            >
          </v-row>
        </div>
      </div>
    </v-row>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from "@/components/HelloWorld.vue";
import { msalMixin } from "vue-msal";
export default {
  name: "question",
  mixins: [msalMixin],
  data: () => ({
    questions: [],
    account: {},
    showans: false,
  }),
  methods: {
    async init() {
      let token = await this.$msal.acquireToken();
      this.account = token.account;
      // console.log(this.account);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token.accessToken}`;
      let res = await axios({
        method: "get",
        url: process.env.VUE_APP_DATAQUE,
      });
      while (res.data.length) {
        let rendom = (Math.random() * res.data.length) | 0;
        let ch = [];
        ch = res.data[rendom].choices;
        let rc = [];
        while (ch.length) {
          let xrc = (Math.random() * ch.length) | 0;
          rc.push(ch[xrc]);
          ch.splice(xrc, 1);
        }
        res.data[rendom].choices = rc;
        res.data[rendom].selected = [];
        this.questions.push(res.data[rendom]);
        res.data.splice(rendom, 1);
      }
    },
    async send() {
      let token = await this.$msal.acquireToken();
      let score = this.questions.filter((r) => r.result).length;
      let worng = this.questions
        .filter((r) => !r.result)
        .map((x) => x.question);
      let timestamp = new Date();
      let answer = {
        account: this.account,
        score,
        worng,
        timestamp,
        raw: this.questions,
      };
      let res = await axios({
        method: "post",
        url: process.env.VUE_APP_DATAANS,
        data: answer,
      });
      this.$router.push("/score");
      //console.log(answer);
    },
    check(id) {
      let result = false;
      let arr1 = this.questions[id].selected.sort();
      let arr2 = this.questions[id].ans.sort();
      let a = arr1.toString();
      let b = arr2.toString();
      if (a == b) result = true;
      else result = false;
      //console.log(result);
      this.questions[id].result = result;
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

/* Header/Blog Title */
.header {
  padding: 10px;
  font-size: 30px;
  text-align: center;
  background: #f1f1f1;
}

/* Create two unequal columns that floats next to each other */
/* Left column */
.leftcolumn {
  height: 440px;
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
