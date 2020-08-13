<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th width="14%" class="text-center">วันที่สอบ</th>
          <th width="14%" class="text-center">ผู้สอบ</th>
          <th width="3%" class="text-center">คะแนน</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in desserts" :key="item.id">
          <td>{{ item.timestamp | formatdate }}</td>
          <td>{{ item.account.name }}</td>
          <td class="text-right">{{ item.score }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>
<script>
import { msalMixin } from "vue-msal";
var moment = require("moment");

export default {
  mixins: [msalMixin],
  filters: {
    formatdate: function(date) {
      return moment(date).format("DD MMMM YYYY hh:mm");
    },
  },
  data() {
    return {
      desserts: [],
      account: {},
    };
  },
  mounted() {
    this.getlist();
    setTimeout(() => this.getlist(), 3000);
  },
  methods: {
    getlist: async function() {
      let token = await this.$msal.acquireToken();
      this.account = token.account;
      console.log(this.account);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token.accessToken}`;
      let res = await axios({
        method: "get",
        url: process.env.VUE_APP_DATAANS,
      });
      let account = this.account.accountIdentifier;
      this.desserts = res.data.filter((r) => r.account);
    },
  },
};
</script>
