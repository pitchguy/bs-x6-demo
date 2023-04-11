<template>
  <div id="graph-demo" style="width: 100vw; height: 100vh; overflow: hidden">
    <section class="section-cot" style="width: 100%; height: 100%">
      <!-- 顶部操作区域 -->
      <div class="action-bar">
        <Button type="primary" @click="saveFn()">获取json</Button>
        <Button type="primary" @click="parseFn()">解析json</Button>
      </div>
      <div id="draw-cot" />
    </section>
  </div>
</template>

<script>
import Vue from "vue";
import { Graph, Node, Path, Cell, Markup } from "@antv/x6";
import "@antv/x6-vue-shape";

import database from "./components/nodeTheme/database.vue";
import condition from "./components/nodeTheme/condition.vue";
import onlyout from "./components/nodeTheme/onlyOut.vue";
import onlyin from "./components/nodeTheme/onlyIn.vue";

import DataJson from "./data";
import { nodeStatusList } from "./constant";

export default {
  name: "graph",
  data() {
    return {
      graph: "",
      timer: "",
      isLock: false,
      showContextMenu: false,
    };
  },
  mounted() {
    // 初始化 graph
    this.initGraph();
    // 按钮绑定
    this.keyBindFn();
    // 执行
    this.startFn();
    // 监听事件
    this.graphEventListen();
  },
  methods: {
    initGraph() {
      const markup = [
        // {
        //   tagName: "text",
        //   selector: "label",
        // },
        {
          tagName: "foreignObject",
          selector: "foContent",
        },
      ];

      const attrs = {
        // label: {
        //   fill: "#A2B1C3",
        //   fontSize: 12,
        // },
        foContent: {
          style: {
            width: 200,
            height: 200,
          },
        },
      };

      // 注册节点
      Graph.registerNode(
        "dag-condition",
        {
          inherit: "vue-shape",
          width: 180,
          height: 36,
          component: {
            template: `<condition />`,
            components: {
              condition,
            },
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
              bottom: {
                position: "bottom",
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
          },
        },
        true
      );

      Graph.registerNode(
        "dag-output",
        {
          inherit: "vue-shape",
          width: 180,
          height: 36,
          component: {
            template: `<onlyout />`,
            components: {
              onlyout,
            },
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
              bottom: {
                position: "bottom",
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
          },
        },
        true
      );

      Graph.registerNode(
        "dag-onlyIn",
        {
          inherit: "vue-shape",
          width: 180,
          height: 36,
          component: {
            template: `<onlyin />`,
            components: {
              onlyin,
            },
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
              bottom: {
                position: "bottom",
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
          },
        },
        true
      );

      Graph.registerNode(
        "dag-node",
        {
          inherit: "vue-shape",
          width: 190,
          height: 40,
          component: {
            // 使用 render函数来创建组件
            render: h =>
              h(database, {
                on: {
                  // 监听 database组件触发的事件，获取传递出来的数据
                  myEvent: data => {
                    this.handleMyEvent(data);
                  },
                },
              }),
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
              bottom: {
                position: "bottom",
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
          },
        },
        true
      );

      Graph.registerEdge(
        "dag-edge",
        {
          inherit: "edge",
          labels: [
            {
              markup,
              attrs,
              position: {
                distance: 0.3,
                args: {
                  keepGradient: true,
                  ensureLegibility: true,
                },
              },
            },
          ],
          attrs: {
            line: {
              stroke: "#c3c3c3",
              strokeWidth: 2,
              targetMarker: {
                name: "block",
                width: 12,
                height: 8,
              },
            },
          },
          label: {
            attrs: {
              label: {
                fill: "#A2B1C3",
                fontSize: 12,
              },
            },
          },
        },
        true
      );

      Graph.registerConnector(
        "algo-connector",
        (s, e) => {
          const offset = 4;
          const deltaY = Math.abs(e.y - s.y);
          const control = Math.floor((deltaY / 3) * 2);

          const v1 = { x: s.x, y: s.y + offset + control };
          const v2 = { x: e.x, y: e.y - offset - control };

          return Path.normalize(
            `M ${s.x} ${s.y}
           L ${s.x} ${s.y + offset}
           C ${v1.x} ${v1.y} ${v2.x} ${v2.y} ${e.x} ${e.y - offset}
           L ${e.x} ${e.y}
          `
          );
        },
        true
      );

      const graph = new Graph({
        grid: {
          size: 10,
          visible: true,
          type: "dot", // 'dot' | 'fixedDot' | 'mesh'
          args: {
            color: "#a05410", // 网格线/点颜色
            thickness: 1, // 网格线宽度/网格点大小
          },
        },
        background: {
          color: "#fff", // 设置画布背景颜色
        },
        container: document.getElementById("draw-cot"),
        panning: {
          enabled: true,
          eventTypes: ["leftMouseDown", "mouseWheel"],
        },
        mousewheel: {
          enabled: true,
          modifiers: "ctrl",
          factor: 1.1,
          maxScale: 1.5,
          minScale: 0.5,
        },
        highlighting: {
          magnetAdsorbed: {
            name: "stroke",
            args: {
              attrs: {
                fill: "#fff",
                stroke: "#31d0c6",
                strokeWidth: 4,
              },
            },
          },
        },
        connecting: {
          snap: true,
          allowBlank: false,
          allowLoop: false,
          highlight: true,
          connector: "algo-connector",
          connectionPoint: "anchor",
          anchor: "center",
          validateMagnet({ magnet }) {
            // return magnet.getAttribute('port-group') !== 'top'

            // 限制连线配置
            return true;
          },
          createEdge() {
            return graph.createEdge({
              shape: "dag-edge",
              attrs: {
                line: {
                  strokeDasharray: "5 5",
                  targetMarker: {
                    name: "block",
                    width: 12,
                    height: 8,
                  },
                },
              },
              zIndex: -1,
            });
          },
        },
        selecting: {
          enabled: true,
          multiple: true,
          rubberEdge: true,
          rubberNode: true,
          modifiers: "shift",
          rubberband: true,
        },
        keyboard: true,
        clipboard: true,
        history: true,
        onEdgeLabelRendered: args => {
          const { label, container, selectors } = args;
          // 在 Label 容器中渲染一个命名为foContent的foreignObject元素来承载 HTML 元素或 React 组件或 VUE组件

          // 使用 render函数来创建组件
          const content = selectors.foContent;

          console.log(selectors);
          if (content) {
            let vueComp = new Vue({
              // template: `<onlyin />`,
              // components: {
              //   onlyin,
              // },
              render: h =>
                h(onlyin, {
                  on: {
                    // 监听 database组件触发的事件，获取传递出来的数据
                    myEvent: data => {
                      this.handleMyEvent(data);
                    },
                  },
                }),
              provide() {
                return {
                  getGraph: () => this.graph,
                  getNode: () => this.node,
                };
              },
            });
            vueComp.$mount(content);
          }
        },
        //也就是这俩一定要搭配起来用
        markup: Markup.getForeignObjectMarkup(),
      });
      this.graph = graph;

      graph.on("edge:contextmenu", ({ e, x, y, edge, view }) => {
        this.showContextMenu = true;
        this.$nextTick(() => {
          this.$refs.menuBar.initFn(e.offsetX, e.offsetY, {
            type: "edge",
            item: edge,
          });
        });
      });

      graph.on("node:contextmenu", ({ e, x, y, node, view }) => {
        this.showContextMenu = true;

        this.$nextTick(() => {
          // this.$refs.menuBar.setItem({ type: 'node', item: node })
          const p = graph.localToPage(x, y);
          this.$refs.menuBar.initFn(p.x, p.y, { type: "node", item: node });
        });
      });

      graph.on("edge:connected", ({ edge }) => {
        const source = graph.getCellById(edge.source.cell);
        const target = graph.getCellById(edge.target.cell);

        // 只允许输入
        if (target.data.type == "output") {
          return graph.removeEdge(edge.id);
        }

        // 只允许输出
        if (source.data.type == "onlyIn") {
          return graph.removeEdge(edge.id);
        }

        // 如果线源头的一端链接桩只允许输入
        if (/in/.test(edge.source.port)) {
          return graph.removeEdge(edge.id);
        }

        // 目标一端链接桩只允许输出
        if (/out/.test(edge.target.port)) {
          return graph.removeEdge(edge.id);
        }

        if (source.data.type == "condition") {
          console.log(source);
          console.log(target);
          console.log(edge);
          if (target.data.t === edge.id || target.data.f === edge.id) {
            return graph.removeEdge(edge.id);
          }
          this.$refs.dialogCondition.visible = true;
          this.$refs.dialogCondition.init(source.data, edge);
        }

        edge.attr({
          line: {
            strokeDasharray: "",
          },
        });
      });

      graph.on("node:change:data", ({ node }) => {
        const edges = graph.getIncomingEdges(node);
        const { status } = node.getData();
        edges?.forEach(edge => {
          if (status === "running") {
            edge.attr("line/strokeDasharray", 5);
            edge.attr(
              "line/style/animation",
              "running-line 30s infinite linear"
            );
          } else {
            edge.attr("line/strokeDasharray", "");
            edge.attr("line/style/animation", "");
          }
        });
      });

      graph.on("edge:dblclick", ({ edge }) => {
        123;
        console.log(edge);
      });
    },
    keyBindFn() {
      // copy cut paste
      this.graph.bindKey(["meta+c", "ctrl+c"], () => {
        const cells = this.graph.getSelectedCells();
        if (cells.length) {
          this.graph.copy(cells);
        }
        return false;
      });
      this.graph.bindKey(["meta+x", "ctrl+x"], () => {
        const cells = this.graph.getSelectedCells();
        if (cells.length) {
          this.graph.cut(cells);
        }
        return false;
      });
      this.graph.bindKey(["meta+v", "ctrl+v"], () => {
        if (!this.graph.isClipboardEmpty()) {
          const cells = this.graph.paste({ offset: 32 });
          this.graph.cleanSelection();
          this.graph.select(cells);
        }
        return false;
      });

      // undo redo
      this.graph.bindKey(["meta+z", "ctrl+z"], () => {
        if (this.graph.history.canUndo()) {
          this.graph.history.undo();
        }
        return false;
      });
      // 节点删除监听
      this.graph.bindKey(["delete", "backspace"], () => {
        const select = this.graph.getSelectedCells();
        console.log(select);
        select?.forEach(item => {
          if (/edge/.test(item.shape)) {
            this.graph.removeEdge(item.id);
          } else {
            this.graph.removeNode(item.id);
          }
        });
        return false;
      });
    },
    startFn(item) {
      this.timer && clearTimeout(this.timer);
      this.init(item || DataJson);
      // this.showNodeStatus(Object.assign([], nodeStatusList));
      this.graph.centerContent();
    },
    // 初始化节点/边
    init(data = []) {
      const cells = [];
      data.forEach(item => {
        if (item.shape === "dag-edge") {
          cells.push(this.graph.createEdge(item));
        } else {
          delete item.component;
          cells.push(this.graph.createNode(item));
        }
      });
      this.graph.resetCells(cells);
    },
    saveFn() {
      let x6Json = this.graph.toJSON({ diff: true });

      this.$Notice.info({
        title: "json",
        desc: JSON.stringify(x6Json),
      });
      localStorage.setItem("x6Json", JSON.stringify(x6Json));
    },
    parseFn() {
      console.log(
        this.graph.parseJSON(JSON.parse(localStorage.getItem("x6Json")))
      );
    },
    graphEventListen() {
      this.graph.on("selection:changed", args => {
        console.log(args);
        if (args.added.length) {
          let nodeAdded = this.graph.getCellById(args.added[0].id);
          let nodeAddedData = args.added[0].data;

          nodeAdded &&
            nodeAdded.setData(
              Object.assign({}, nodeAddedData, { selected: true })
            );
        }
        if (args.removed.length) {
          let nodeRemoved = this.graph.getCellById(args.removed[0].id);
          let nodeRemovedData = args.removed[0].data;

          nodeRemoved &&
            nodeRemoved.setData(
              Object.assign({}, nodeRemovedData, { selected: false })
            );
        }
      });
    },
    handleMyEvent(data) {
      console.log("emit函数, 执行的操作是" + data);
    },
  },
};
</script>

<style lang="less">
#graph-demo {
  width: 100vw;
  height: 100vh;
  .action-bar {
    padding: 10px 0;
    .ivu-btn {
      margin-right: 10px;
    }
  }
  .section-cot #draw-cot {
    width: 100%;
    height: 100%;
  }
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

// .x6-node-selected .node {
//   border-color: #1890ff;
//   border-radius: 2px;
//   box-shadow: 0 0 0 4px #d4e8fe;
// }

// .x6-node-selected .node.success {
//   border-color: #52c41a;
//   border-radius: 2px;
//   box-shadow: 0 0 0 4px #ccecc0;
// }

// .x6-node-selected .node.failed {
//   border-color: #ff4d4f;
//   border-radius: 2px;
//   box-shadow: 0 0 0 4px #fedcdc;
// }

.x6-edge:hover path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1px;
}

.x6-edge-selected path:nth-child(2) {
  stroke: #1890ff;
  stroke-width: 1.5px !important;
}
</style>
