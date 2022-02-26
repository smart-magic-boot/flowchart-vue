<template>
    <div>
        <div class="modal" v-if="visible" style="width: 320px">
            <div class="header">
                <span>Edit</span>
            </div>
            <div class="body">
                <label for="id">id</label>
                <input class="form-control" id="id" v-model="nodeForm.id"/>
                <label for="name">Name</label>
                <input class="form-control" id="name" v-model="nodeForm.name"/>
                <label for="width">Width</label>
                <input class="form-control" id="width" v-model="nodeForm.width"/>
                <label for="height">Height</label>
                <input class="form-control" id="height" v-model="nodeForm.height"/>
                <label for="type">Type</label>
                <select class="form-control" id="type" v-model="nodeForm.type">
                    <option :key="'node-type-' + item.id" :value="item.id"
                            v-for="item in [ { name: 'Start', id: 'start' }, { name: 'End', id: 'end' }, { name: 'Operation', id: 'operation' }, { name: 'Data Node', id: 'dataNode' }, { name: 'Message', id: 'msg' } ]"
                    >
                        {{item.name}}
                    </option>
                </select>
                <label for="offset">Offset</label>
                <input class="form-control" id="offset" v-model="nodeForm.offset"/>
                <label for="cssClass">Css Class</label>
                <select class="form-control" id="cssClass" v-model="nodeForm.cssClass">
                    <option :key="'node-type-' + item.id" :value="item.id"
                            v-for="item in [ { name: 'Default', id: 'default' }, { name: 'Info', id: 'info' }, { name: 'Success', id: 'success' }, { name: 'Warning', id: 'warning' }, { name: 'Error', id: 'error' } ]"
                    >
                        {{item.name}}
                    </option>
                </select>
            </div>
            <div class="footer">
                <button @click="handleClickCancelSaveNode">Cancel</button>
                <button @click="handleClickSaveNode">Ok</button>
            </div>
        </div>
    </div>
</template>
<script>
  import '../assets/modal.css';

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      node: {
        type: Object,
        default: null,
      },
    },
    data: function() {
      return {
        nodeForm: {name: null, id: null, type: null, offset:null, width: null, height: null, cssClass: null },
       };
    },
    methods: {
      handleClickSaveNode() {
        this.$emit('update:node', Object.assign(this.node, {
          name: this.nodeForm.name,
          type: this.nodeForm.type,
          offset: this.nodeForm.offset,
          width: this.nodeForm.width,
          height: this.nodeForm.height,
          cssClass: this.nodeForm.cssClass,
        }));
        this.$emit('update:visible', false);
      },
      handleClickCancelSaveNode() {
        this.$emit('update:visible', false);
      },
      handleChangeApprover(e) {
        this.nodeForm.approver = this.approvers.filter(i => i.id === parseInt(e.target.value))[0];
      },
    },
    watch: {
      node: {
        immediate: true,
        handler(val) {
          if (!val) { return; }
          this.nodeForm.id = val.id;
          this.nodeForm.name = val.name;
          this.nodeForm.type = val.type;
          this.nodeForm.offset = val.offset;
          this.nodeForm.width = val.width;
          this.nodeForm.height = val.height;
          this.nodeForm.cssClass = val.cssClass;
        },
      },
    },
  };
</script>