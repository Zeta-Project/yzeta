import 'yfiles/yfiles.css';

import {
    Class, CreateEdgeInputMode, EdgeRouter,   EdgeRouterScope,
    FreeNodePortLocationModel,
    GraphComponent,
    GraphEditorInputMode,
    ICommand, INode,
    LayoutExecutor,
    License, OrthogonalEdgeEditingContext,
    Point, PolylineEdgeRouterData,
    Rect, Size
} from 'yfiles'

import {bindCommand} from "./utils/Bindings";
import {DragAndDrop} from "./DragAndDrop";
import * as umlModel from './UMLClassModel.js'
import UMLStyle, { UMLNodeStyle, UMLNodeStyleSerializationListener } from './UMLNodeStyle.js'
// Tell the library about the license contents
License.value = require('../../../yFiles-for-HTML-Complete-2.2.0.1-Evaluation/lib/license.json');

// We need to load the yfiles/view-layout-bridge module explicitly to prevent the webpack
// tree shaker from removing this dependency which is needed for 'morphLayout' in this demo.
Class.ensure(LayoutExecutor);


/**
 * A simple yFiles application that creates a GraphComponent and enables basic input gestures.
 */

//move graph inside class YFilesZeta?
let graphComponent = null;

class YFilesZeta {


    constructor() {
        this.initialize();
        this.buildSampleGraph();
    }

    initialize() {
        graphComponent = new GraphComponent('#graphComponent');
        const graph = graphComponent.graph;
        graph.undoEngineEnabled = true

        graphComponent.inputMode = this.createInputMode()

        // configures default styles for newly created graph elements
        graphComponent.graph.nodeDefaults.style = new UMLNodeStyle(new umlModel.UMLClassModel())
        //clone or share styleInstance
        graphComponent.graph.nodeDefaults.shareStyleInstance = false
        graphComponent.graph.nodeDefaults.size = new Size(125, 100)

        // configure and initialize drag and drop panel
        let dragAndDropPanel = new DragAndDrop(graphComponent);

        graphComponent.fitGraphBounds();

        // bind toolbar commands
        this.registerCommands(graphComponent)
    }

    /**
     * Configure interaction.
     */
    createInputMode() {
        const mode = new GraphEditorInputMode({
            orthogonalEdgeEditingContext: new OrthogonalEdgeEditingContext(),
            // we want to adjust the size of new nodes before rendering them
            nodeCreator: (context, graph, location, parent) => {
                const layout = Rect.fromCenter(location, graph.nodeDefaults.size)
                const styleInstance = graph.nodeDefaults.getStyleInstance()
                const node = graph.createNode(parent, layout, styleInstance)
                node.style.adjustSize(node, graphComponent.inputMode)
                return node
            },
            allowAddLabel: false
        })

        // execute a layout after certain gestures
        mode.moveInputMode.addDragFinishedListener((src, args) => routeEdgesAtSelectedNodes())
        mode.handleInputMode.addDragFinishedListener((src, args) => routeEdgesAtSelectedNodes())

        // hide the edge creation buttons when the empty canvas was clicked
        mode.addCanvasClickedListener((src, args) => {
            graphComponent.currentItem = null
        })

        // the UMLNodeStyle should handle clicks itself
        mode.addItemClickedListener((src, args) => {
            if (INode.isInstance(args.item) && args.item.style instanceof UMLNodeStyle) {
                args.item.style.nodeClicked(src, args)
            }
        })

        return mode
    }

    buildSampleGraph() {
        const graph = graphComponent.graph
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

/**
 * Routes all edges that connect to selected nodes. This is used when a selection of nodes is moved or resized.
 */
function routeEdgesAtSelectedNodes() {
    const edgeRouter = new EdgeRouter()
    edgeRouter.scope = EdgeRouterScope.ROUTE_EDGES_AT_AFFECTED_NODES

    const layoutExecutor = new LayoutExecutor({
        graphComponent,
        layout: edgeRouter,
        layoutData: new PolylineEdgeRouterData({
            affectedNodes: node => graphComponent.selection.selectedNodes.isSelected(node)
        }),
        duration: '0.5s',
        updateContentRect: false
    })
    layoutExecutor.start()
}

/**
 * Routes just the given edge without adjusting the view port. This is used for applying an initial layout to newly
 * created edges.
 * @param affectedEdge
 */
function routeEdge(affectedEdge) {
    const edgeRouter = new EdgeRouter()
    edgeRouter.scope = EdgeRouterScope.ROUTE_AFFECTED_EDGES

    const layoutExecutor = new LayoutExecutor({
        graphComponent,
        layout: edgeRouter,
        layoutData: new PolylineEdgeRouterData({
            affectedEdges: edge => edge === affectedEdge
        }),
        duration: '0.5s',
        animateViewport: false,
        updateContentRect: false
    })
    layoutExecutor.start()
}

new YFilesZeta();
