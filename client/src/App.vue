<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
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
          <v-row v-if="user">
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

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      color="blue darken-3"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title style="width: 300px" class="ml-0 pl-4">
        <span class="hidden-sm-and-down">{{ title }}</span>
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon large>
        <v-avatar size="63px" item>
          <v-img :src="avatar" alt="Vuetify" />
        </v-avatar>
      </v-btn>
      <v-btn icon />
    </v-app-bar>
    <div>
      <div style="height: 60px;" />

      <router-view />
    </div>
  </v-app>
</template>

<script>
import { msalMixin } from "vue-msal";
export default {
  mixins: [msalMixin],
  data() {
    return {
      avatar: "https://cdn.vuetifyjs.com/images/logos/logo.svg",
      title: process.env.VUE_APP_TITLE,
      drawer: false,
      items: [],
    };
  },
  methods: {
    checklogin: function() {
      console.log(this.msal.accessToken);
      /*if (this.msal.accessToken) {
        this.getuser();
      } else {
        this.login();
      }*/
    },
    login: function() {
      this.$msal.signIn();
    },
    logout: async function() {
      localStorage.clear();
      this.$msal.signOut();
    },
    getuser: async function() {
      this.drawer = false;
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${this.msal.accessToken}`;
      const graphEndpoint = "https://graph.microsoft.com/v1.0/me/photo/$value";
      const response = await axios(graphEndpoint, {
        responseType: "arraybuffer",
      });
      const avatar = new Buffer(response.data, "binary").toString("base64");
      // console.log(avatar);
      this.avatar = "data:image/png;base64, " + avatar;
      let profileuri =
        process.env.VUE_APP_DATA +
        "/api/profiles?filter[where][MSID]=" +
        this.user.accountIdentifier;
      // console.log(profileuri);
      let esprofiles = await axios.get(profileuri);
      // console.log (esprofiles.data.length)
      if (esprofiles.data.length) {
        // console.log("Have");
      } else {
        let meuri = "https://graph.microsoft.com/v1.0/me";
        let rest = await axios(meuri);
        //console.log(rest.data);
        let profiledata = {
          Name: rest.data.givenName,
          uid: rest.data.id,
          MSID: rest.data.id,
          Sname: rest.data.surname,
          Fullname: rest.data.givenName + " " + rest.data.surname,
          position: rest.data.jobTitle,
          picture: "img/001.jpg",
          Active: 1,
        };
        //console.log(profiledata);
        await axios.post(
          process.env.VUE_APP_DATA + "/api/profiles",
          profiledata
        );
        //console.log(profiledata);
      }
      this.items = [
        { icon: "mdi-contacts", text: "Contacts" },
        { icon: "mdi-history", text: "Frequently contacted" },
        { icon: "mdi-content-copy", text: "Duplicates" },
        {
          icon: "mdi-chevron-up",
          "icon-alt": "mdi-chevron-down",
          text: "Labels",
          model: true,
          children: [{ icon: "mdi-plus", text: "Create label" }],
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
            { text: "Other contacts" },
          ],
        },
        { icon: "mdi-settings", text: "Settings" },
        { icon: "mdi-message", text: "Send feedback" },
        { icon: "mdi-help-circle", text: "Help" },
        { icon: "mdi-cellphone-link", text: "App downloads" },
        { icon: "mdi-keyboard", text: "Go to the old version" },
      ];
    },
  },
  mounted() {
    this.checklogin();
  },
  computed: {
    user() {
      let user = null;
      if (this.msal.isAuthenticated) {
        // Note that the dollar sign ($) is missing from this.msal
        user = {
          ...this.msal.user,
          profile: {},
        };
        if (this.msal.graph && this.msal.graph.profile) {
          user.profile = this.msal.graph.profile;
        }
      }
      if (this.msal.accessToken) {
        this.getuser();
      }
      return user;
    },
  },
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
