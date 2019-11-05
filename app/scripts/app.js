import 'yfiles/yfiles.css';

import {
    Class, EdgeRouter, EdgeRouterScope, Fill, GridSnapTypes,
    FreeNodePortLocationModel,
    GraphComponent,
    GraphEditorInputMode, GraphSnapContext, HierarchicLayout, HierarchicLayoutData,
    ICommand, IGraph as graph, INode,
    LayoutExecutor,
    License, List, OrthogonalEdgeEditingContext,
    Point, PolylineEdgeRouterData,
    Rect, SimpleNode, Size, SolidColorFill, LabelSnapContext
} from 'yfiles'

import {bindAction, bindCommand} from "./utils/Bindings";
import {DragAndDrop_old} from "./DragAndDrop_old";
import {Properties} from "./Properties";
import {DragAndDrop} from "./DragAndDrop";
import * as umlModel from './UMLClassModel.js'
import {UMLNodeStyle} from './UMLNodeStyle.js'
import UMLContextButtonsInputMode from './UMLContextButtonsInputMode.js'
import definition from '../graphData/definition.js'
//JSON workaround until REST GET functions
import shapeJson from '../graphData/shape.js';
import diagramJson from '../graphData/diagram.js';
import styleJson from '../graphData/style.js';

// Tell the library about the license contents
License.value = require('../../../yFiles-for-HTML-Complete-2.2.0.2/lib/license.json');

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
        //this.getBrowserData();
        this.initialize();

    }

    initialize() {

//myJson.diagrams[0].name
        //maybe build configuration object to quickly access attributes
        //
        //diagram: show selection of witch project to access --> yfiles inherited methods?
        //shape: build nodes and edges to show on Palette
        //style?? suspiciously scarce options
        //
        //const text = JSON.stringify(shapeJson.shapes.edges);
        //console.log("Local JSON: " + text);




        graphComponent = new GraphComponent('#graphComponent');
        const graph = graphComponent.graph;
        graph.undoEngineEnabled = true
        graphComponent.inputMode = createInputMode()

        // configures default styles for newly created graph elements
        graphComponent.graph.nodeDefaults.style = new UMLNodeStyle(new umlModel.UMLClassModel())
        //clone or share styleInstance
        graphComponent.graph.nodeDefaults.shareStyleInstance = false
        graphComponent.graph.nodeDefaults.size = new Size(125, 100)

        // configure and initialize drag and drop panel

        let dragAndDropPanel2 = new DragAndDrop(graphComponent);

        buildGraphFromDefinition(graph)
        //this.buildSampleGraph();

        // bootstrap the sample graph
        executeLayout().then(() => {
            // the sample graph bootstrapping should not be undoable
            graphComponent.graph.undoEngine.clear()
        })

        //graphComponent.fitGraphBounds();

        // bind toolbar commands
        this.registerCommands(graphComponent)
    }

    // TODO: remove unused method
    buildSampleGraph() {
        const graph = graphComponent.graph
        //create a node based on UMLClassModel for storing data and UMLNodeStyle
        const node1 = graph.createNode({
            style: new UMLNodeStyle(
                new umlModel.UMLClassModel({
                    className: 'Customer',
                    attributes: ['name', 'address', 'email', 'phone', 'creditcardInfo', 'shippingInfo'],
                    operations: ['register()', 'login()', 'search()']
                })
            )
        })

        const node2 = graph.createNode({
            style: new UMLNodeStyle(
                new umlModel.UMLClassModel({
                    className: 'Customer',
                    attributes: ['name', 'address', 'email', 'phone', 'creditcardInfo', 'shippingInfo'],
                    operations: ['register()', 'login()', 'search()']
                })
            )
        })

        const edge1 = graph.createEdge(node1, node2);

        graph.nodes.forEach(node => {
            if ( node.style instanceof UMLNodeStyle) {
                node.style.adjustSize(node, graphComponent.inputMode)
            }
        })
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

        bindAction('#snapping-button', () => {
            const snappingEnabled = document.querySelector('#snapping-button').checked
            graphComponent.inputMode.snapContext.enabled = snappingEnabled
            graphComponent.inputMode.labelSnapContext.enabled = snappingEnabled
        })
    }

    async getBrowserData() {

        //const jData =

        //const response = await fetch("graphData.json")
        //const data = await response.json()

        //console.log(data)
        //console.log(jData.shapes[0])

        //const response = await fetch("http://zeta-dev.syslab.in.htwg-konstanz.de/rest/v1/meta-models");
        //const jData = await response.json()
        //const jData = JSON.parse(response)
        //console.log(jData.toString())
    }
}

/**
 * Configure interaction.
 */
function createInputMode() {
    console.log("createMode")
    const mode = new GraphEditorInputMode({
        orthogonalEdgeEditingContext: new OrthogonalEdgeEditingContext(),
        allowAddLabel: false,
        allowGroupingOperations: false,
        allowCreateNode: false,
        labelSnapContext: new LabelSnapContext({
            enabled: false
        }),
        snapContext: new GraphSnapContext({
            nodeToNodeDistance: 30,
            nodeToEdgeDistance: 20,
            snapOrthogonalMovement: false,
            snapDistance: 10,
            snapSegmentsToSnapLines: true,
            snapBendsToSnapLines: true,
            gridSnapType: GridSnapTypes.ALL,
            enabled: false
        })
    })

    // add input mode that handles the edge creations buttons
    const umlContextButtonsInputMode = new UMLContextButtonsInputMode()
    umlContextButtonsInputMode.priority = mode.clickInputMode.priority - 1
    mode.add(umlContextButtonsInputMode)

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

/**
 * Sets new HierarchicLayout, target nodes are drawn on top
 * This method gets executed after building the sampleGraph since the nodes got no coordinates
 * @returns {Promise<any>}
 */
function executeLayout() {
    // configures the hierarchic layout
    const layout = new HierarchicLayout({
        orthogonalRouting: true
    })
    layout.edgeLayoutDescriptor.minimumFirstSegmentLength = 100
    layout.edgeLayoutDescriptor.minimumLastSegmentLength = 100
    layout.edgeLayoutDescriptor.minimumDistance = 100

    const layoutData = new HierarchicLayoutData({
        // mark all inheritance edges (generalization, realization) as directed so their target nodes
        // will be placed above their source nodes
        // all other edges are treated as undirected
        edgeDirectedness: edge => ( 0),
        // combine all inheritance edges (generalization, realization) in edge groups according to
        // their line type
        // do not group the other edges
        sourceGroupIds: edge => getGroupId(edge, 'src'),
        targetGroupIds: edge => getGroupId(edge, 'tgt')
    })

    return graphComponent.morphLayout(layout, '500ms', layoutData)
}

function buildGraphFromDefinition(graph) {
    const classes = definition.classes
    const references = definition.references
    const nodeList = new List()

    //create a node for each class
    //fill them with existing attributes, operations and names
    classes.forEach(function(node) {
        const attributeNames = new Array()
        for(let i = 0; i < node.attributes.length; i++) {
            attributeNames[i] = node.attributes[i].name
        }
        const methodNames = new Array()
        for(let i = 0; i < node.methods.length; i++) {
            methodNames[i] = node.methods[i].name
        }
        var tempNode = (graph.createNode({
            style: new UMLNodeStyle(
                new umlModel.UMLClassModel({
                    className: node.name.toString(),
                    attributes: attributeNames,
                    operations: methodNames
                })
            )
        }))
        if (node.abstractness == true) {
            const isAbstract = tempNode.style.model.constraint === 'abstract'
            tempNode.style.model.constraint = isAbstract ? '' : 'abstract'
            tempNode.style.model.stereotype = ''
            tempNode.style.fill = isAbstract ? new SolidColorFill(0x60, 0x7d, 0x8b) : Fill.CRIMSON
        }
        nodeList.add(tempNode)
        console.log(nodeList.size)
    });



    graph.nodes.forEach(node => {
        if ( node.style instanceof UMLNodeStyle) {
            node.style.adjustSize(node, graphComponent.inputMode)
        }
    })

    //connect each class
    let source = null;
    let target = null;
    //const nodes = graph.getNodeArray() --> not a function???
    references.forEach(function(reference) {
        nodeList.forEach(function(node) {
            if(node.style.model.className == reference.sourceClassName) {
                source = node
            }
            if(node.style.model.className == reference.targetClassName) {
                target = node
            }
        })
        if(source != null && target != null) {
            const edge = graph.createEdge(source, target);
            // add a label to the node
            if(reference.name != '') {
                graph.addLabel(edge, reference.name)
            }

        }
        source = null
        target = null

    })


}



/**
 * Returns an edge group id according to the edge style.
 * @param {IEdge} edge
 * @param {string} marker
 * @return {object|null}
 */
function getGroupId(edge, marker) {
    /*
    if (edge.style instanceof PolylineEdgeStyle) {
        const edgeStyle = edge.style
        return isInheritance(edgeStyle) ? edgeStyle.stroke.dashStyle + marker : null
    }

     */
    return null
}

new YFilesZeta();
