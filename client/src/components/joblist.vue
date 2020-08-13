<template>
  <div>
    <div v-if="tasklists.length">
      <v-expansion-panels>
        <v-expansion-panel v-for="task in tasklists" :key="task.id">
          <v-expansion-panel-header v-slot="{ open }">
            <v-row no-gutters>
              <v-col cols="7">
                <v-row>
                  <span class="subtitle-1 indigo--text">{{task.Job_Header}}</span>
                </v-row>
                <v-row>
                  <span v-if="open" class="subtitle-1">{{task.Job_detail}}</span>
                  <span v-else class="subtitle-1">{{task.Job_detail|cuttext}}</span>
                </v-row>
              </v-col>
              <v-col cols="5" class="text--secondary">
                <v-fade-transition leave-absolute>
                  <span v-if="open">See Overview</span>
                  <v-row v-else no-gutters style="width: 100%">
                    What to do?
                    <v-chip class="ma-2" color="primary">{{task.Job_SOW}}</v-chip>On
                    <v-chip class="ma-2" color="primary">{{task.Job_date|formatDate }}</v-chip>
                  </v-row>
                </v-fade-transition>
              </v-col>
            </v-row>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <span />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
    <div v-else>
      <v-row>
        <v-spacer />
        <v-btn color="error" @click="delp">Delete</v-btn>
      </v-row>
    </div>
  </div>
</template>
<script>
import * as moment from "moment";
export default {
  props: ["project"],
  filters: {
    formatDate: function(value) {
      if (!value) return "";
      return moment(String(value)).format("D MMMM YYYY");
    },
    formatDateTz: function(value) {
      if (!value) return "";
      let mydate = moment.tz(value, "UTC");
      return mydate
        .clone()
        .tz("Asia/Bangkok")
        .format("D MMMM YY h:mm a");
    },
    cuttext: function(val) {
      if (val && val.length > 60) {
        return val.substring(0, 60) + "...";
      } else return val;
    }
  },
  data: function() {
    return {
      tasklists: {}
    };
  },
  methods: {
    removeproj: function(projid) {},
    removetaskfromproj: function(mytask) {},
    getTimesheet: async function() {
      let url =
        process.env.VUE_APP_DATA +
        process.env.VUE_APP_TIMESHEET +
        "?filter[where][Projid]=" +
        this.project.id;
      // console.log(url);
      let res = await axios.get(url);
      this.tasklists = res.data;
    },
    delp: async function() {
      let url = process.env.VUE_APP_DATA + "/api/projects/" + this.project.id;
      await axios.delete(url);
      this.$parent.$parent.$parent.$parent.$parent.getProject();
    }
  },
  created: function() {
    this.getTimesheet();
  },
  mounted: function() {}
};
</script>