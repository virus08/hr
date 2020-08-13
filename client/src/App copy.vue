
<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" app>
      <v-list dense>
        <template v-for="item in items">
          <v-row v-if="item.heading" :key="item.heading" align="center">
            <v-col cols="6">
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-col>
            <v-col cols="6" class="text-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-col>
          </v-row>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item v-for="(child, i) in item.children" :key="i" link>
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ child.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="item.text" link>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
      <v-list>
        <v-list-item>
          <v-row v-if="token">
            <v-spacer />
            <center>
              <v-btn @click="logout">logout</v-btn>
            </center>
            <v-spacer />
          </v-row>
          <v-row v-else>
            <v-spacer />
            <center>
              <v-btn @click="login">login</v-btn>
            </center>
            <v-spacer />
          </v-row>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" app color="blue darken-3" dark>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">{{title}}</span>
      </v-toolbar-title>

      <v-spacer />
   
      <v-btn icon large>
        <v-avatar size="63px" item>
          <v-img :src="avatar" alt="Vuetify" />
        </v-avatar>
      </v-btn>
      <v-btn icon />
    </v-app-bar>
    <v-content>
      <v-container class="fill-height" fluid>
        <router-view />
      </v-container>
    </v-content>
    
  </v-app>
</template>

<script>
const myStorage = window.localStorage;
const localstorage = window.localStorage;
import qs from "qs";
export default {
  props: {
    source: String
  },
  data() {
    return {
      avatar:"https://cdn.vuetifyjs.com/images/logos/logo.svg",
      title: process.env.VUE_APP_TITLE,
      token: localStorage.getItem("TOKEN"),
      
      drawer: null,
      loginurl: "",
      user: {
        name: ""
      },
      items: []
    };
  },
  methods: {
    checklogin: function() {
      if (this.token) {
        this.getuser();
      } else {
        this.login();
      }
    },
    login: function() {
      this.loginurl =
        "https://login.microsoftonline.com/" +
        process.env.VUE_APP_TENANT +
        "/oauth2/v2.0/authorize?client_id=" +
        process.env.VUE_APP_CLIENT_ID +
        "&response_type=code&redirect_uri=" +
        process.env.VUE_APP_REDIRECT_URI +
        "&response_mode=query&scope=" +
        process.env.VUE_APP_SCOPE +
        "&state=12345";
      window.location.replace(this.loginurl);
    },
    logout: async function() {
      let logouturl =
        "https://login.microsoftonline.com/" +
        process.env.VUE_APP_TENANT +
        "/oauth2/v2.0/logout?post_logout_redirect_uri=" +
        process.env.VUE_APP_LOGOUT;
      localStorage.clear();
      window.location.replace(logouturl);
    },
    getuser: async function() {
      this.drawer = false;
      const graphEndpoint = "https://graph.microsoft.com/v1.0/me/photo/$value";
      const response = await axios(graphEndpoint, {
        headers: { Authorization: `Bearer ${this.token}` },
        responseType: "arraybuffer"
      });
      const avatar = new Buffer(response.data, "binary").toString("base64");
      // console.log(avatar);
      this.avatar = "data:image/png;base64, "+ avatar;
      this.items = [
        { icon: "mdi-contacts", text: "Contacts" },
        { icon: "mdi-history", text: "Frequently contacted" },
        { icon: "mdi-content-copy", text: "Duplicates" },
        {
          icon: "mdi-chevron-up",
          "icon-alt": "mdi-chevron-down",
          text: "Labels",
          model: true,
          children: [{ icon: "mdi-plus", text: "Create label" }]
        },
        {
          icon: "mdi-chevron-up",
          "icon-alt": "mdi-chevron-down",
          text: "More",
          model: false,
          children: [
            { text: "Import" },
            { text: "Export" },
            { text: "Print" },
            { text: "Undo changes" },
            { text: "Other contacts" }
          ]
        },
        { icon: "mdi-settings", text: "Settings" },
        { icon: "mdi-message", text: "Send feedback" },
        { icon: "mdi-help-circle", text: "Help" },
        { icon: "mdi-cellphone-link", text: "App downloads" },
        { icon: "mdi-keyboard", text: "Go to the old version" }
      ];
    },
    registertoken: async function() {
      this.url =
        "http://localhost:8080/" +
        process.env.VUE_APP_TENANT +
        "/oauth2/v2.0/token?" +
        "client_id=" +
        process.env.VUE_APP_CLIENT_ID +
        "&scope=" +
        process.env.VUE_APP_SCOPE +
        "&code=" +
        this.code +
        "&redirect_uri=" +
        process.env.VUE_APP_REDIRECT_URI +
        "&grant_type=authorization_code" +
        "&client_secret=" +
        process.env.VUE_APP_SECRET;

      this.data = {
        client_id: process.env.VUE_APP_CLIENT_ID,
        scope:
          "openid profile offline_access User.Read Mail.Read Calendars.Read Contacts.Read",
        code: this.code,
        redirect_uri: process.env.VUE_APP_REDIRECT,
        grant_type: "authorization_code",
        client_secret: process.env.VUE_APP_SECRET
      };
      const options = {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        data: qs.stringify(this.data),
        url: this.url
      };
      axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";
      //axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
      //axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
      let resp = await axios(options);
      // console.log(resp);
      this.token = resp.data.access_token;
      localStorage.clear();
      localstorage.setItem("TOKEN", this.token);
      localstorage.setItem("REFRESH_TOKEN", resp.data.refresh_token);
      this.getuser();
      this.$router.push("/");
    }
  },
  mounted() {
    this.code = this.$route.query.code;
    if (this.code) {
      this.registertoken();
    } else {
      this.checklogin();
    }
  }
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
