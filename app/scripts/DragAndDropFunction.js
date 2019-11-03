import {
    DefaultLabelStyle, DragDropEffects,
    GraphEditorInputMode,
    GraphSnapContext, InteriorStretchLabelModel,
    ListEnumerable,
    NodeDropInputMode,
    PanelNodeStyle,
    Rect, SimpleLabel,
    SimpleNode,
    GridSnapTypes
} from "yfiles";

import {DragAndDropPanel} from "./utils/DndPanel";
import {passiveSupported} from "./utils/Workarounds";
import {DemoGroupStyle, DemoNodeStyle} from "../styles/demo-styles";
import {addClass, removeClass} from "./utils/Bindings";
//import {addClass, removeClass} from "./utils/demo-app";
//import {addClass, removeClass} from "../../../yFiles-for-HTML-Complete-2.2.0.2/demos/resources/demo-app";

export class DragAndDropFunction {

    constructor(graphComponent) {
        yZetaConfigureInputModes(graphComponent)
        yZetaInitializeDnDPanel()
    }
}

function yZetaConfigureInputModes(graphComponent) {
    // configure the snapping context
    const yZetaMode = new GraphEditorInputMode({
        allowGroupingOperations: true,
        snapContext: new GraphSnapContext({
            nodeToNodeDistance: 30,
            nodeToEdgeDistance: 20,
            snapOrthogonalMovement: false,
            snapDistance: 10,
            snapSegmentsToSnapLines: true,
            snapBendsToSnapLines: true,
            gridSnapType: GridSnapTypes.ALL
        })
    })

    // create a new NodeDropInputMode to configure the drag and drop operation
    const yZetaNodeDropInputMode = new NodeDropInputMode()
    // enables the display of the dragged element during the drag
    yZetaNodeDropInputMode.showPreview = true
    // initially disables snapping fo the dragged element to existing elements
    yZetaNodeDropInputMode.snappingEnabled = true
    // by default the mode available in GraphEditorInputMode is disabled, so first enable it
    yZetaNodeDropInputMode.enabled = true
    // nodes that have a DemoGroupStyle assigned have to be created as group nodes
    //yZetaNodeDropInputMode.isGroupNodePredicate = draggedNode =>
    //   draggedNode.style instanceof DemoGroupStyle
    yZetaNodeDropInputMode.isGroupNodePredicate = draggedNode =>
        draggedNode.style instanceof PanelNodeStyle
    yZetaMode.nodeDropInputMode = yZetaNodeDropInputMode
/*
    const yZetaLabelDropInputMode = new LabelDropInputMode()
    yZetaLabelDropInputMode.showPreview = true
    yZetaLabelDropInputMode.snappingEnabled = false
    yZetaLabelDropInputMode.enabled = true
    yZetaLabelDropInputMode.useBestMatchingParameter = true
    // allow for nodes and edges to be the new label owner
    yZetaLabelDropInputMode.isValidLabelOwnerPredicate = labelOwner =>
        INode.isInstance(labelOwner) || IEdge.isInstance(labelOwner) || IPort.isInstance(labelOwner)
    yZetaMode.labelDropInputMode = yZetaLabelDropInputMode

    const yZetaPortDropInputMode = new PortDropInputMode()
    yZetaPortDropInputMode.showPreview = true
    yZetaPortDropInputMode.snappingEnabled = false
    yZetaPortDropInputMode.enabled = true
    yZetaPortDropInputMode.useBestMatchingParameter = true
    // allow only for nodes to be the new port owner
    yZetaPortDropInputMode.isValidPortOwnerPredicate = portOwner => INode.isInstance(portOwner)
    yZetaMode.portDropInputMode = yZetaPortDropInputMode
*/
    // configure the edge drop input mode
    //TODO: edge inputMode
    // configureEdgeDropInputMode(yZetaMode)

    graphComponent.inputMode = yZetaMode
}

function yZetaInitializeDnDPanel(graphComponent) {

    // initialize panel for yFiles drag and drop
    let yZetaDragAndDropPanel = new DragAndDropPanel(document.getElementById('drag-and-drop-panel'), passiveSupported)

    // Set the callback that starts the actual drag and drop operation
    yZetaDragAndDropPanel.beginDragCallback = (element, data) => {
        const dragPreview = element.cloneNode(true)
        dragPreview.style.margin = '0'
        let dragSource
/*
        if (ILabel.isInstance(data)) {
            dragSource = LabelDropInputMode.startDrag(
                element,
                data,
                DragDropEffects.ALL,
                true,
                dragPreview
            )
        } else if (IPort.isInstance(data)) {
            dragSource = PortDropInputMode.startDrag(
                element,
                data,
                DragDropEffects.ALL,
                true,
                dragPreview
            )
        } else if (IEdge.isInstance(data)) {
            new DragSource(element).startDrag(
                new DragDropItem('yfiles.graph.IEdge', data),
                DragDropEffects.ALL
            )
        } else {
                dragSource = NodeDropInputMode.startDrag(
                element,
                data,
                DragDropEffects.ALL,
                true,
                dragPreview
            )
        }
*/
        dragSource = NodeDropInputMode.startDrag(
            element,
            data,
            //DragDropEffects.ALL,
            DragDropEffects.ALL,
            true,
            dragPreview
        )

        // TODO: Activate with the correct import
        // let the GraphComponent handle the preview rendering if possible
        if (dragSource) {
            dragSource.addQueryContinueDragListener((src, args) => {
                if (args.dropTarget === null) {
                    removeClass(dragPreview, 'hidden')
                } else {
                    addClass(dragPreview, 'hidden')
                }
            })
        }


    }

    yZetaDragAndDropPanel.maxItemWidth = 160
    yZetaDragAndDropPanel.populatePanel(createDnDPanelItems)
}

function createDnDPanelItems() {
    const itemContainer = []

    // Create some nodes
    //TODO: Eigener Style einbinden
    const groupNodeStyle = new DemoGroupStyle()

    // A label model with insets for the expand/collapse button
    const groupLabelModel = new InteriorStretchLabelModel({ insets: 4 })

    const groupLabelStyle = new DefaultLabelStyle({
        textFill: 'white'
    })


    const groupNode = new SimpleNode()
    groupNode.layout = new Rect(0, 0, 80, 80)
    groupNode.style = groupNodeStyle

    //TODO Lable activate
/*
    const groupLabel = new SimpleLabel(
        groupNode,
        '123 Group Node',
        groupLabelModel.createParameter(InteriorStretchLabelModelPosition.NORTH)
    )

    groupLabel.style = groupLabelStyle
    groupNode.labels = new ListEnumerable([groupLabel])

    */
    itemContainer.push({ element: groupNode, tooltip: 'Group Node' })

    const demoStyleNode = new SimpleNode()
    demoStyleNode.layout = new Rect(0, 0, 60, 40)
    demoStyleNode.style = new DemoNodeStyle()
    itemContainer.push({ element: demoStyleNode, tooltip: 'Demo Node' })

    /*
    const shapeStyleNode = new SimpleNode()
    shapeStyleNode.layout = new Rect(0, 0, 60, 40)
    shapeStyleNode.style = new ShapeNodeStyle({
        shape: ShapeNodeShape.ROUND_RECTANGLE,
        stroke: 'rgb(255, 140, 0)',
        fill: 'rgb(255, 140, 0)'
    })
    itemContainer.push({ element: shapeStyleNode, tooltip: 'Shape Node' })
    // PUSH - Element in Container schieben

    const shinyPlateNode = new SimpleNode()
    shinyPlateNode.layout = new Rect(0, 0, 60, 40)
    shinyPlateNode.style = new ShinyPlateNodeStyle({
        fill: 'rgb(255, 140, 0)',
        drawShadow: false
    })
    itemContainer.push({ element: shinyPlateNode, tooltip: 'Shiny Plate Node' })
// PUSH
    const imageStyleNode = new SimpleNode()
    imageStyleNode.layout = new Rect(0, 0, 60, 60)
    imageStyleNode.style = new ImageNodeStyle('resources/y.svg')
    itemContainer.push({ element: imageStyleNode, tooltip: 'Image Node' })

    const portNode = new SimpleNode()
    portNode.layout = new Rect(0, 0, 5, 5)
    portNode.style = new VoidNodeStyle()
    const port = new SimplePort(portNode, FreeNodePortLocationModel.NODE_CENTER_ANCHORED)
    port.style = new NodeStylePortStyleAdapter(
        new ShapeNodeStyle({
            fill: 'darkblue',
            stroke: 'cornflowerblue',
            shape: 'ellipse'
        })
    )
    portNode.tag = port
    portNode.ports = new ListEnumerable([port])
    itemContainer.push({ element: portNode, tooltip: 'Port' })

    const labelNode = new SimpleNode()
    labelNode.layout = new Rect(0, 0, 5, 5)
    labelNode.style = new VoidNodeStyle()

    const labelStyle = new DefaultLabelStyle({
        backgroundStroke: 'rgb(101, 152, 204)',
        backgroundFill: 'white',
        insets: [3, 5, 3, 5]
    })

    const label = new SimpleLabel(
        labelNode,
        'label',
        FreeNodeLabelModel.INSTANCE.createDefaultParameter()
    )
    label.style = labelStyle
    label.preferredSize = labelStyle.renderer.getPreferredSize(label, labelStyle)
    labelNode.tag = label
    labelNode.labels = new ListEnumerable([label])
    itemContainer.push({ element: labelNode, tooltip: 'Label' })

    const edge1 = new SimpleEdge({
        style: new PolylineEdgeStyle({
            smoothingLength: 100,
            targetArrow: 'triangle'
        })
    })
    const edge2 = new SimpleEdge({
        style: new PolylineEdgeStyle({
            sourceArrow: 'triangle',
            targetArrow: 'triangle'
        })
    })
    const edge3 = new SimpleEdge({
        style: new PolylineEdgeStyle({
            stroke: '2px dashed gray'
        })
    })

    itemContainer.push({ element: edge1, tooltip: 'Default' })
    itemContainer.push({ element: edge2, tooltip: 'Bidirectional' })
    itemContainer.push({ element: edge3, tooltip: 'Dashed' })
*/
    return itemContainer
}