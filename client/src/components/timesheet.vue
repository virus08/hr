<template>
  <v-container fluid fill-height>
    <v-layout child-flex>
      
    </v-layout>
    <v-btn bottom color="pink" dark fab fixed right @click="dialog = !dialog">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
    <v-dialog v-model="dialog" width="800px">
      <v-card>
        <v-card-title class="grey darken-2">Create contact</v-card-title>
        <v-container></v-container>
        <v-card-actions>
          <v-btn text color="primary">More</v-btn>
          <v-spacer />
          <v-btn text color="primary" @click="dialog = false">Cancel</v-btn>
          <v-btn text @click="dialog = false">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import * as moment from 'moment';
import { msalMixin } from "vue-msal";
export default {
  mixins: [msalMixin],
  data() {
    return {
      dialog: false,
      options: {
        fillter: {
          start: "2020-01",
          limit: 100,
          order: "id%20DESC"
        },
        table:[
          { text:"id", value:"id",align: 'left', sortable: true, enable:true },
          { text:"Job Header",class:'col-md-4', value:"Job_Header", enable:true },
          { text:"Job Detail",class:'col-md-4', value:"Job_detail", enable:true },
          { text:"Job Create", value:"create_date", enable:false},
          { text:"Deadline", value:"Job_date", enable:true},
          { text:"Hours", value:"Job_Hours", enable:true},
          { text:"Brands", value:"Brands", enable:false},          
          { text:"Job_SOW", value:"Job_SOW", enable:false},
          { text:"Tech Group", value:"Base_Technology", enable:false},
          { text:"Action",class:'col-md-3',value:"action", enable:true}, 
        ]
      },
      desserts: [],
      header:[]
    };
  },
  mounted() {
    this.getTimesheet();

    this.header = this.options.table.filter(function(item) {
      return item.enable==true ;
    });
  },
  methods: {
    getTimesheet: async function() {
      let geturl =
        process.env.VUE_APP_DATA +
        process.env.VUE_APP_TIMESHEET +
        "?filter[where][Name_Surname]=Wanchai Fuangmali" +
        "&filter[where][create_date][gt]=" +
        this.options.fillter.start +
        "&filter[where][Job_date][gt]=" +
        this.options.fillter.start +
        "&filter[order]=" +
        this.options.fillter.order +
        "&filter[limit]=" +
        this.options.fillter.limit;

      let timesheets = await axios.get(geturl);
      this.desserts = timesheets.data;
      // console.log(timesheets);
    }
  }
};
</script>
