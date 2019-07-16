import 'yfiles/yfiles.css';

import {
  License,
  GraphComponent,
  FreeNodePortLocationModel,
  GraphEditorInputMode,
  Class,
  LayoutExecutor,
  Point,
  Rect
} from 'yfiles'

// Tell the library about the license contents
License.value = {
  "comment": "58be556f-690c-426d-9470-8c00f780021a",
  "date": "06/18/2019",
  "distribution": false,
  "domains": [
    "*"
  ],
  "expires": "08/18/2019",
  "fileSystemAllowed": true,
  "licensefileversion": "1.1",
  "localhost": true,
  "oobAllowed": true,
  "package": "complete",
  "product": "yFiles for HTML",
  "type": "eval",
  "version": "2.2",
  "watermark": "yFiles HTML Evaluation License (expires in ${license-days-remaining} days)",
  "key": "7135f82cd617f4f66f4c965c801a2878888a6f2c"
};

// We need to load the yfiles/view-layout-bridge module explicitly to prevent the webpack
// tree shaker from removing this dependency which is needed for 'morphLayout' in this demo.
Class.ensure(LayoutExecutor);


/**
* A simple yFiles application that creates a GraphComponent and enables basic input gestures.
*/
class YFilesZeta {

  initialize() {
    const graphComponent = new GraphComponent('#graphComponent');
    const graph = graphComponent.graph;

    const node1 = graph.createNode(new Rect(0, 0, 30, 30));
    const node2 = graph.createNode(new Rect(100, 0, 30, 30));
    const node3 = graph.createNode(new Rect(300, 300, 60, 30));

    const edge1 = graph.createEdge(node1, node2);
    const edge2 = graph.createEdge(node2, node3);

    const bend1 = graph.addBend(edge2, new Point(330, 15));

    const portAtNode1 = graph.addPort(node1);
    const portAtNode3 = graph.addPort(node3, FreeNodePortLocationModel.NODE_LEFT_ANCHORED);
    const edgeAtPorts = graph.createEdge(portAtNode1, portAtNode3);

    const ln1 = graph.addLabel(node1, 'n1');
    const ln2 = graph.addLabel(node2, 'n2');
    const ln3 = graph.addLabel(node3, 'n3');
    const le3 = graph.addLabel(edgeAtPorts, 'edgeAtPorts');

    graphComponent.inputMode = new GraphEditorInputMode({
      allowGroupingOperations: true
    });

    graphComponent.fitGraphBounds();
  }

  constructor() {
    this.initialize();
  }

}

new YFilesZeta();
