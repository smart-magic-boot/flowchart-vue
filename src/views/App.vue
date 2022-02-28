<template>
  <div class="container">
    <h1 class="title">Flowchart Vue</h1>
    <h5 class="subtitle">
      Flowchart & Flowchart designer component for Vue.js.
    </h5>
    <div id="toolbar">
      <button @click="$refs.chart.add({id: +new Date(),x: 10,y: 10,name: 'New',type: 'operation',width: 120,height: 45,cssClass: 'default' })">
        Add（添加节点）
      </button>
      <button @click="$refs.chart.remove()">Delete(删除节点)</button>
      <button @click="$refs.chart.editCurrent()">Edit(编辑节点)</button>
      <button @click="$refs.chart.save()" >Save（保存节点）</button>
      <button @click="handleChartRefresh">Refresh（刷新节点）</button>
      <button @click="handleChartBack" v-bind:disabled="chartBackDisabled">返回</button>
    </div>
    <flowchart
      :nodes="nodes"
      :connections="connections"
      @editnode="handleEditNode"
      :width="'100%'"
      :height="600"
      :readonly="false"
      @editconnection="handleEditConnection"
      @save="handleChartSave"
      @select="handleSelect"
      @selectconnection="handleSelectConnection"
      ref="chart"
    >
    </flowchart>
    <node-dialog
      :visible.sync="nodeDialogVisible"
      :node.sync="nodeForm.target"
    ></node-dialog>
    <connection-dialog
      :visible.sync="connectionDialogVisible"
      :connection.sync="connectionForm.target"
      :operation="connectionForm.operation"
    >
    </connection-dialog>
  </div>
</template>
<script>
/* eslint-disable no-unused-vars */

import ConnectionDialog from "../components/ConnectionDialog";
import NodeDialog from "../components/NodeDialog";
import Flowchart from "../components/flowchart/Flowchart";
import * as d3 from "d3";
import { roundTo20 } from "../utils/math";
import axios from 'axios'

export default {
  components: {
    ConnectionDialog,
    NodeDialog,
    Flowchart,
  },
  data: function () {
    return {
      // nodes: [{"id":"欧拉舆情链路-新闻爬虫","name":"新闻爬虫","type":"dataNode","value":"Allen V","x":70,"y":80,"width":120,"height":45,"borderWidth":"2px","cssClass":"info"},{"id":"欧拉舆情链路-OpenApi","name":"OpenApi","type":"dataNode","value":"Teresa V","x":70,"y":200,"width":120,"height":45,"borderWidth":"2px","cssClass":"info"},{"id":"欧拉舆情链路-gfaceNewsTopicHigh","name":"gfaceNewsTopicHigh","type":"msg","value":"1,2,3,4","x":530,"y":40,"offset":15,"width":140,"height":45,"borderWidth":"2px","cssClass":"default"},{"id":"欧拉舆情链路-gfaceNewsTopicLow","name":"gfaceNewsTopicLow","type":"msg","value":"1234","x":530,"y":130,"offset":15,"width":140,"height":45,"borderWidth":"2px","cssClass":"default"},{"id":"欧拉舆情链路-NewsImport","name":"NewsImport","type":"dataNode","x":70,"y":330,"width":120,"height":45,"borderWidth":"2px","cssClass":"info"},{"id":"欧拉舆情链路-KafkaNewsHighDispatcher","x":330,"y":40,"name":"KafkaNewsHighDispatcher","type":"dataNode","width":150,"height":45,"borderWidth":"2px","cssClass":"info"},{"id":"欧拉舆情链路-KafkaNewsLowDispatcher","x":330,"y":130,"name":"KafkaNewsLowDispatcher","type":"dataNode","width":150,"height":45,"borderWidth":"2px","cssClass":"info"},{"id":"舆情去重模型链路","x":330,"y":210,"name":"舆情去重模型链路","type":"operation","width":150,"height":150,"borderWidth":"2px","cssClass":"info"},{"id":"舆情模型链路","x":530,"y":210,"name":"舆情模型链路","type":"operation","approvers":[],"width":150,"height":150,"borderWidth":"2px","cssClass":"info"},{"id":"欧拉舆情链路-gface_news","name":"gface_news","type":"database","value":"gface_news","x":230,"y":490,"width":120,"height":40,"borderWidth":"2px","cssClass":"default"},{"id":"欧拉舆情链路-duplicate_total_news12","name":"duplicate_total_news12","type":"msg","value":"1,2,3,4","x":750,"y":190,"offset":15,"width":140,"height":45,"borderWidth":"2px","cssClass":"default"},{"id":"欧拉舆情链路-risk_result_yuqing","name":"risk_result_yuqing","type":"msg","value":"1,2,3,4","x":750,"y":340,"offset":15,"width":140,"height":45,"borderWidth":"2px","cssClass":"default"},{"id":"欧拉舆情链路-duplicate_all_total_news_0616","name":"duplicate_all_total_news_0616","type":"msg","value":"1,2,3,4","x":750,"y":490,"offset":15,"width":140,"height":45,"borderWidth":"2px","cssClass":"default"},{"id":"欧拉舆情链路-gface_psp_total_news_all_duplicate_new","name":"gface_psp_total_news_all_duplicate_new","type":"database","value":"gface_psp_total_news_all_duplicate_new","x":430,"y":420,"width":350,"height":40,"borderWidth":"2px","cssClass":"default"},{"id":"欧拉舆情链路-DuplicateNewsKp","x":950,"y":40,"name":"DuplicateNewsKp","type":"dataNode","width":130,"height":45,"borderWidth":"2px","cssClass":"info"},{"id":"欧拉舆情链路-DuplicateTotalNews","x":950,"y":190,"name":"DuplicateTotalNews","type":"dataNode","width":130,"height":45,"borderWidth":"2px","cssClass":"info"},{"id":"欧拉舆情链路-DuplicateAllTotalNews","x":950,"y":490,"name":"DuplicateAllTotalNews","type":"dataNode","width":130,"height":45,"borderWidth":"2px","cssClass":"info"},{"id":"欧拉舆情链路-mdsToPsp_duplicate01","name":"mdsToPsp_duplicate01","type":"msg","value":"1,2,3,4","x":1160,"y":40,"offset":15,"width":140,"height":45,"borderWidth":"2px","cssClass":"default"},{"id":"欧拉舆情链路-TotalNewsListener","x":1170,"y":190,"name":"TotalNewsListener","type":"dataNode","width":130,"height":45,"borderWidth":"2px","cssClass":"info"},{"id":"欧拉舆情链路-RiskResultListener","x":1150,"y":340,"name":"RiskResultListener","type":"dataNode","width":130,"height":45,"borderWidth":"2px","cssClass":"info"}],
      // connections: [{"source":{"id":"欧拉舆情链路-新闻爬虫","position":"bottom"},"destination":{"id":"欧拉舆情链路-OpenApi","position":"top"},"id":1645757112973,"type":"pass","name":"Pass"},{"source":{"id":"欧拉舆情链路-OpenApi","position":"bottom"},"destination":{"id":"欧拉舆情链路-NewsImport","position":"top"},"id":1645757116263,"type":"pass","name":"Pass"},{"source":{"id":"欧拉舆情链路-KafkaNewsHighDispatcher","position":"right"},"destination":{"id":"欧拉舆情链路-gfaceNewsTopicHigh","position":"left"},"id":1645757141849,"type":"pass","name":"Pass"},{"source":{"id":"欧拉舆情链路-KafkaNewsLowDispatcher","position":"right"},"destination":{"id":"欧拉舆情链路-gfaceNewsTopicLow","position":"left"},"id":1645759731296,"type":"pass","name":"Pass"},{"source":{"id":"欧拉舆情链路-NewsImport","position":"bottom"},"destination":{"id":"欧拉舆情链路-gface_news","position":"bottom"},"id":1645764525173,"type":"pass","name":"Pass"},{"source":{"id":"欧拉舆情链路-gface_news","position":"left"},"destination":{"id":"欧拉舆情链路-KafkaNewsHighDispatcher","position":"left"},"id":1645764529525,"type":"pass","name":"Pass"},{"source":{"id":"欧拉舆情链路-gface_news","position":"top"},"destination":{"id":"欧拉舆情链路-KafkaNewsLowDispatcher","position":"left"},"id":1645764532815,"type":"pass","name":"Pass"},{"source":{"id":"舆情模型链路","position":"right"},"destination":{"id":"欧拉舆情链路-duplicate_total_news12","position":"left"},"id":1645764910307,"type":"pass","name":"Pass"},{"source":{"id":"舆情模型链路","position":"right"},"destination":{"id":"欧拉舆情链路-risk_result_yuqing","position":"left"},"id":1645766678621,"type":"pass","name":"Pass"},{"source":{"id":"欧拉舆情链路-duplicate_total_news12","position":"top"},"destination":{"id":"欧拉舆情链路-DuplicateNewsKp","position":"left"},"id":1645775341751,"type":"pass","name":"Pass"},{"source":{"id":"欧拉舆情链路-duplicate_total_news12","position":"right"},"destination":{"id":"欧拉舆情链路-DuplicateTotalNews","position":"left"},"id":1645775485461,"type":"pass","name":"Pass"},{"source":{"id":"欧拉舆情链路-duplicate_all_total_news_0616","position":"right"},"destination":{"id":"欧拉舆情链路-DuplicateAllTotalNews","position":"left"},"id":1645775618143,"type":"pass","name":"Pass"},{"source":{"id":"欧拉舆情链路-gface_news","position":"right"},"destination":{"id":"舆情去重模型链路","position":"left"},"id":1645775997445,"type":"pass","name":"Pass"},{"source":{"id":"欧拉舆情链路-gface_psp_total_news_all_duplicate_new","position":"top"},"destination":{"id":"舆情模型链路","position":"bottom"},"id":1645776006854,"type":"pass","name":"Pass"},{"source":{"id":"舆情去重模型链路","position":"bottom"},"destination":{"id":"欧拉舆情链路-duplicate_all_total_news_0616","position":"left"},"id":1645776020024,"type":"pass","name":"Pass"},{"source":{"id":"欧拉舆情链路-DuplicateAllTotalNews","position":"right"},"destination":{"id":"欧拉舆情链路-gface_psp_total_news_all_duplicate_new","position":"right"},"id":1645776036519,"type":"pass","name":"Pass"},{"source":{"id":"欧拉舆情链路-risk_result_yuqing","position":"right"},"destination":{"id":"欧拉舆情链路-RiskResultListener","position":"left"},"id":1645776486019,"type":"pass","name":"Pass"},{"source":{"id":"欧拉舆情链路-mdsToPsp_duplicate01","position":"bottom"},"destination":{"id":"欧拉舆情链路-TotalNewsListener","position":"top"},"id":1645776490859,"type":"pass","name":"Pass"},{"source":{"id":"欧拉舆情链路-DuplicateNewsKp","position":"right"},"destination":{"id":"欧拉舆情链路-mdsToPsp_duplicate01","position":"left"},"id":1645776504822,"type":"pass","name":"Pass"}],

      nodes: [{"id":1,"x":50,"y":220,"name":"Start","type":"start","borderWidth":"2px","cssClass":"default","value":"Start","width":120,"height":60},{"id":2,"x":630,"y":220,"name":"End","type":"end","borderWidth":"2px","cssClass":"default","value":"End","width":120,"height":60},{"id":3,"x":340,"y":130,"name":"Custom size","type":"database","width":120,"borderWidth":"2px","height":40,"cssClass":"default","value":"database"},{"id":4,"x":240,"y":220,"borderWidth":"2px","name":"Operation","type":"operation","cssClass":"default","value":"operation","width":120,"height":60},{"id":5,"x":440,"y":220,"borderWidth":"2px","name":"Operation","type":"operation","width":120,"height":60}],
      connections: [{"source":{"id":1,"position":"right"},"destination":{"id":4,"position":"left"},"id":1,"type":"pass"},{"source":{"id":4,"position":"right"},"destination":{"id":5,"position":"left"},"id":2,"type":"pass"},{"source":{"id":5,"position":"right"},"destination":{"id":2,"position":"left"},"id":3,"type":"pass"},{"source":{"id":5,"position":"bottom"},"destination":{"id":4,"position":"bottom"},"id":4,"type":"reject"},{"source":{"id":1,"position":"top"},"destination":{"id":3,"position":"left"},"id":5,"type":"pass"},{"source":{"id":3,"position":"right"},"destination":{"id":2,"position":"top"},"id":6,"type":"pass"}],

      flowNodeId:null,
      dataInfo:null,

      nodeForm: { target: null },
      connectionForm: { target: null, operation: null },
      nodeDialogVisible: false,
      connectionDialogVisible: false,
      chartBackDisabled:"disabled"
    };
  },
  async mounted() {
    console.log("-----------mounted-----------");
    this.handleChartRefresh();
  },
  methods: {
    handleSelect(nodes) {
      console.log("-----------handleSelect-----------",nodes);
      if(nodes.length > 0){
        var exp = nodes[0].subNodes;
        if (!exp && typeof(exp) === "undefined" && exp!=0){
          console.log("No sub node to ingore");
        } else {
          console.log("-----------subNodes length-----------",nodes[0].subNodes.nodes.length);
          this.nodes = nodes[0].subNodes.nodes;
          this.connections = nodes[0].subNodes.connections;

          this.flowNodeId = nodes[0].id;
          this.chartBackDisabled = false;
        }
      }
    },
    handleChartBack(){
      this.nodes = this.dataInfo.nodes;
      this.flowNodeId = null;
      this.connections = this.dataInfo.connections;
      this.chartBackDisabled = "disabled";
    },
    handleSelectConnection(connections) {
      console.log("-----handleSelectConnection-------",JSON.stringify(connections));
    },
    async handleChartSave(nodes, connections) {
      let postData = this.dataInfo;
      if(this.flowNodeId){
        for (let i = 0; i < postData.nodes.length; i++) {
          if(this.flowNodeId === postData.nodes[i].id){
            postData.nodes[i].subNodes.nodes = nodes;
            postData.nodes[i].subNodes.connections = connections;
          }
        }
      } else {
        postData = {
          nodes: nodes,
          connections: connections
        }
      }

      axios.post("/flow-data/save", postData).then(resp => {
      //   this.nodes = resp.nodes;
      //   this.connections = resp.connections;
      //   // Flowchart will refresh after this.nodes and this.connections changed
        console.log("------handleChartSave resp------------",JSON.stringify(resp));
      });
      console.log("------handleChartSave nodes------------",JSON.stringify(nodes));
      console.log("------handleChartSave connections------",JSON.stringify(connections));
    },
    handleChartRefresh() {
      console.log("-----------handleChartRefresh-----------", JSON.stringify(this.nodes));
      this.flowNodeId = null;
      axios
        .get('/flow-data/get')
        .then(response => {
          console.log("-----------response-----------",JSON.stringify(response));
          this.dataInfo = {
            nodes:response.data.nodes,
            connections:response.data.connections
          };
          this.nodes = this.dataInfo.nodes;
          this.connections = this.dataInfo.connections;
        })
        .catch(function (error) { // 请求失败处理
          console.log(error);
        });
    },
    handleEditNode(node) {
      this.nodeForm.target = node;
      this.nodeDialogVisible = true;
    },
    handleEditConnection(connection) {
      this.connectionForm.target = connection;
      this.connectionDialogVisible = true;
    },
  },
};
</script>
<style scoped>
#toolbar {
  margin-bottom: 10px;
}

.title {
  margin-top: 10px;
  margin-bottom: 0;
}

.subtitle {
  margin-bottom: 10px;
}

#toolbar > button {
  margin-right: 4px;
}

.container {
  width: 1400px;
  //margin: auto;
}
</style>
