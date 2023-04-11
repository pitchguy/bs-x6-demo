<template>
  <div class="node" :class="status">
    <img :src="imgCot.logo" alt="" />
    <span class="label">{{ label }}</span>
    <!-- <span class="status">
      <img :src="imgCot[status]" alt="" />
    </span> -->
    <div class="tool-div" v-if="selected">
      <Icon
        custom="bsfit-icon bsfit-icon-fangda1"
        @click.native="labelAction('add')" />
      <Icon
        custom="bsfit-icon bsfit-icon-bianji2"
        @click.native="labelAction('edit')" />
      <Icon
        custom="bsfit-icon bsfit-icon-shanchu3"
        @click.native="labelAction('remove')" />
    </div>
  </div>
</template>

<script>
export default {
  name: "database",
  inject: ["getGraph", "getNode"],
  data() {
    return {
      status: "logo",
      imgCot: {
        logo: "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*evDjT5vjkX0AAAAAAAAAAAAAARQnAQ",
        success:
          "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*6l60T6h8TTQAAAAAAAAAAAAAARQnAQ",
        failed:
          "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*SEISQ6My-HoAAAAAAAAAAAAAARQnAQ",
        running:
          "https://gw.alipayobjects.com/mdn/rms_43231b/afts/img/A*t8fURKfgSOgAAAAAAAAAAAAAARQnAQ",
      },
      label: "",
      selected: false,
    };
  },
  mounted() {
    const node = this.getNode();
    this.label = node.data.label;

    // 监听数据改变事件
    node.on("change:data", ({ current }) => {
      this.label = current.label;
      this.status = current.status;
      this.selected = current.selected;
    });
  },
  methods: {
    labelAction(type) {
      const { id = "" } = this.getNode();

      this.$emit("myEvent", type);
      switch (type) {
        case "add":
          // 根据类型插入对应节点
          // onlyIn的例子
          const time = new Date().getTime();
          this.getGraph().addNode({
            // x: x,
            // y: y,
            width: 190,
            height: 40,
            shape: "dag-node",
            data: {
              label: "新插入节点",
              selected: false,
            },
            ports: {
              groups: {
                top: {
                  position: "top",
                  attrs: {
                    circle: {
                      r: 4,
                      magnet: true,
                      stroke: "#C2C8D5",
                      strokeWidth: 1,
                      fill: "#fff",
                    },
                  },
                },
              },
              items: [
                {
                  id: `in-${time}`,
                  group: "top", // 指定分组名称
                },
              ],
            },
          });
          break;
        case "edit":
          // 进行编辑操作，通过setData更新数据
          // 例子
          let targetNode = this.getGraph().getCellById(id);

          targetNode.setData(
            Object.assign({}, targetNode.data, { label: "编辑成功" })
          );
          break;
        case "remove":
          this.getGraph().removeEdge(id);
          break;

        default:
          break;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.node {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
  border: 1px solid #c3c3c3;
  border-radius: 20px;
  box-shadow: 0 2px 5px 1px rgba(0, 0, 0, 0.06);
  .tool-div {
    display: flex;
    position: absolute;
    top: -35px;
    left: 50px;
    i {
      display: inline-block;
      width: 22px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      font-size: 12px;
      border-radius: 4px;
      margin-right: 6px;
      color: #fff;
      background: #2a81fd;

      cursor: pointer;
    }
  }
}

.node img {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-left: 8px;
}

.node .label {
  display: inline-block;
  flex-shrink: 0;
  width: 104px;
  margin-left: 8px;
  color: #666;
  font-size: 12px;
}

.node .status {
  flex-shrink: 0;
}

.node.running .status img {
  animation: spin 1s linear infinite;
}

.x6-node-selected .node {
  border-color: #1890ff;
  border-radius: 20px;
  box-shadow: 0 0 0 4px #d4e8fe;
}

.x6-edge:hover path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1px;
}

.x6-edge-selected path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1.5px !important;
}

@keyframes running-line {
  to {
    stroke-dashoffset: -1000;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
