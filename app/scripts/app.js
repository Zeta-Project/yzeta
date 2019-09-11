import 'yfiles/yfiles.css';

import {
  Class,
  FreeNodePortLocationModel,
  GraphComponent,
  GraphEditorInputMode,
  ICommand,
  LayoutExecutor,
  License,
  Point,
  Rect
} from 'yfiles'

import {bindCommand} from "./utils/Bindings";

// Tell the library about the license contents
License.value = require('../../../yFiles-for-HTML-Complete-2.2.0.1-Evaluation/lib/license.json');

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
    graph.undoEngineEnabled = true

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
      allowGroupingOperations: false,

    });

    graphComponent.fitGraphBounds();

    // bind toolbar commands
    this.registerCommands(graphComponent)
  }

  constructor() {
    this.initialize();
  }

  /**
   * Wires up the UI.
   * @param {GraphComponent} graphComponent
   */
  registerCommands(graphComponent) {
    bindCommand("button[data-command='Cut']", ICommand.CUT, graphComponent)
    bindCommand("button[data-command='Copy']", ICommand.COPY, graphComponent)
    bindCommand("button[data-command='Paste']", ICommand.PASTE, graphComponent)
    bindCommand("button[data-command='FitContent']", ICommand.FIT_GRAPH_BOUNDS, graphComponent)
    bindCommand("button[data-command='ZoomOriginal']", ICommand.ZOOM, graphComponent, 1.0)
    bindCommand("button[data-command='Undo']", ICommand.UNDO, graphComponent)
    bindCommand("button[data-command='Redo']", ICommand.REDO, graphComponent)
  }

}

new YFilesZeta();
