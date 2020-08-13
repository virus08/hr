<template>
  <v-container fluid fill-height>
    <v-layout child-flex>
      <v-card color="darken-1" :loading="isUpdating">
        <template v-slot:progress>
          <v-progress-linear absolute color="green lighten-3" height="4" indeterminate></v-progress-linear>
        </template>
        <v-toolbar>
          <v-toolbar-title>{{data.title}}</v-toolbar-title>
          <v-spacer></v-spacer>Fillter
          <div class="example" data-v-f3f3eg9>
            <v-select
              cols="5"
              multiple
              chips
              :items="['Open', 'Progress', 'Close', 'Win', 'Lost', 'Cancel']"
              v-model="chkstatus"
              @change="getProject"
            />
          </div>
          <v-spacer></v-spacer>
          <v-text-field
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
            class="hidden-sm-and-down"
          />

          <v-btn icon>
            <v-icon>mdi-bell</v-icon>
          </v-btn>
        </v-toolbar>

        <v-card-text class="grey lighten-5">
          <v-expansion-panels>
            <v-expansion-panel v-for="proj in projectlist" :key="proj.id">
              <v-expansion-panel-header v-slot="{ open }">
                <v-row no-gutters>
                  <v-col cols="6">
                    <v-row>
                      <span class="title indigo--text">{{proj.Name}}</span>
                    </v-row>
                    <v-row>
                      <span v-if="open" class="subtitle-1">{{proj.Desc}}</span> 
                      <span v-else class="subtitle-1">{{proj.Desc | cuttext }}</span>
                    </v-row>
                  </v-col>
                  <v-col cols="5" class="text--secondary">
                    <v-fade-transition leave-absolute>
                      <span v-if="open">See Overview</span>
                      <v-row v-else no-gutters style="width: 100%">
                        <v-chip class="ma-2" color="primary">{{proj.Status}}</v-chip>
                        <v-chip class="ma-2" color="primary">PROJECT ID: ({{proj.id}})</v-chip>
                        <v-spacer />
                      </v-row>
                    </v-fade-transition>
                  </v-col>
                  <v-col cols="1">
                    <v-btn v-if="!open" small color="primary" @click="editproject(proj)">Edit</v-btn>
                  </v-col>
                </v-row>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <joblist :project="proj" />
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card-text>
      </v-card>
      <v-btn bottom color="pink" fab fixed right @click="addnewproject()">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-dialog v-model="projectdialog" width="800px">
        <v-card>
          <v-card-title class="grey darken-2">{{action}}</v-card-title>
          <v-container>
            <v-layout child-flex>
              <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                <v-container>
                  <v-row>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="projtmp.p_assign"
                        label="Select"
                        :items="ulist"
                        item-text="Fullname"
                        item-value="MSID"
                        chips
                        multiple
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="projtmp.Name"
                        :counter="90"
                        :rules="nameRules"
                        label="Project Name"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        rows="3"
                        v-model="projtmp.Desc"
                        :counter="240"
                        label="Project Detail"
                      />
                    </v-col>
                    <v-col cols="4">
                      <v-select :items="['Internal', 'External']" v-model="projtmp.Type" />
                    </v-col>
                    <v-col cols="8">
                      <v-select :items="slist" v-model="projtmp.Status" />
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-layout>
          </v-container>
          <v-card-actions>
            <v-spacer />
            <v-btn text color="primary" @click="ProjCancel">Cancel</v-btn>
            <v-btn text @click="ProjSave">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
  </v-container>
</template>

<script>
import { msalMixin } from "vue-msal";
import joblist from "@/components/joblist.vue";
export default {
  props: ["data"],
  mixins: [msalMixin],
  components: {
    joblist
  },
  filters: {
    cuttext: function(val) {
      if (val && val.length > 60) {
        return val.substring(0, 60) + "...";
      } else return val;
    }
  },
  data() {
    return {
      valid: true,
      lazy: false,
      user: {},
      ulist: [
        { name: "wanchai", id: 1 },
        { name: "wanchai1", id: 2 }
      ],
      nameRules: [
        v => !!v || "Name is required",
        v => (v && v.length <= 90) || "Name must be less than 90 characters"
      ],
      projectdialog: false,
      action: "Add New Project",
      projectlist: [],
      isUpdating: true,
      chkstatus: ["Open", "Progress"],
      projtmp: {
        p_assign: [],
        Create_date: null,
        Desc: "",
        Modify_date: null,
        Name: "",
        Status: "Open",
        Type: "Internal",
        UID: "",
        accountname: ""
      }
      // statuslist: ["Open", "Progress", "Close"]

      // chkstatus: ["Open", "Progress", "Close", "Win", "Lost"]
    };
  },
  watch: {},
  methods: {
    getProject: async function() {
      let UID = this.msal.user.accountIdentifier;
      let url =
        process.env.VUE_APP_DATA +
        "/api/projects?filter[where][UID]=" +
        UID +
        "&filter[order]=Status%20DESC";
      // console.log(this.data.user.accountIdentifier)
      let allproject = await axios.get(url);
      this.projectlist = allproject.data.filter(item => {
        if (this.chkstatus.includes(item.Status)) {
          return item;
        }
      });
      if (this.msal.accessToken) {
        this.getuser();
      } else {
        this.isUpdating = true;
        this.getProject();
      }

      this.isUpdating = false;
    },
    editproject: function(pj) {
      let dnow = new Date().toISOString();
      this.action = "Edit Project: " + pj.Name;
      this.projtmp = pj;
      this.projtmp.Modify_date = dnow;
      this.projectdialog = true;
    },
    addnewproject: function() {
      this.action = "Add New Project";
      let dnow = new Date().toISOString();
      this.projtmp.Name = "";
      this.projtmp.Desc = "";
      (this.projtmp.Status = "Open"),
        (this.projtmp.Type = "Internal"),
        (this.projtmp.Create_date = dnow);
      this.projtmp.Modify_date = dnow;
      this.projtmp.accountname = this.user.givenName + " " + this.user.surname;
      this.projectdialog = true;
    },
    ProjSave: async function() {
      let url = process.env.VUE_APP_DATA + "/api/projects";
      if (this.action == "Add New Project") {
        await axios.post(url, this.projtmp);
        this.projectdialog = false;
        this.getProject();
      } else {
        url = url + "/" + this.projtmp.id;
        await axios.put(url, this.projtmp);
        this.projectdialog = false;
        this.getProject();
      }
    },
    getuser: async function() {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${this.msal.accessToken}`;
      this.projtmp.UID = this.msal.user.accountIdentifier;
      let resp = await axios.get("https://graph.microsoft.com/v1.0/me/");
      this.user = resp.data;
      this.getalluser();
    },
    getalluser: async function() {
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${this.msal.accessToken}`;
      this.projtmp.UID = this.msal.user.accountIdentifier;
      let resp = await axios.get(process.env.VUE_APP_DATA+"/api/profiles?filter[where][Active]=1");
      //console.log(resp.data)
      this.ulist = resp.data;
    },
    ProjCancel: function(){
      this.getProject();
      this.projectdialog=false;
    }
  },
  async mounted() {
    this.getProject();
  },
  computed: {
    slist: function() {
      if (this.projtmp.Type == "Internal") {
        return ["Open", "Progress", "Close"];
      } else {
        return ["Open", "Progress", "Cancel", "Win", "Lost"];
      }
    }
  }
};
</script>
<style scoped>
.example[data-v-f3f3eg9] {
  max-width: 450px !important;
}

.v-btn--absolute.v-btn--right,
.v-btn--fixed.v-btn--right {
  right: 80px;
}
.v-btn--absolute.v-btn--bottom,
.v-btn--fixed.v-btn--bottom {
  bottom: 100px;
}
</style>
