import {
    DragDropEffects,
    GraphComponent, INode,
    INodeStyle,
    Insets,
    NodeDropInputMode,
    PanelNodeStyle,
    Rect,
    SimpleNode,
    SvgExport
} from "yfiles";
import {UMLNodeStyle} from "./UMLNodeStyle";

export class Properties {



    constructor(graphComponent) {
        // retrieve the panel element
        this.divField = document.getElementById('properties-panel')
        this.graphComponent = graphComponent
        //check if there already is something to build
        if(this.graphComponent.currentItem != null) {
            console.log('drawItConstr')
            this.item = this.graphComponent.currentItem
        } else {
            return
        }
        if(INode.isInstance(this.item) && this.item.style instanceof UMLNodeStyle) {
            this.buildUMLNodeProperties()
            this.updateProperties()
        }

    }

    get div() {
        return this.divField
    }
    updateProperties() {
        this.pMeta.innerHTML = this.item.style.model.className
        this.pAttributes.innerHTML = this.item.style.model.attributes.toString()
        this.pOperations.innerHTML = this.item.style.model.operations.toString()

    }

    updateVisual() {
        if(this.graphComponent.currentItem !== null) {
            this.item = this.graphComponent.currentItem
        } else {
            return
        }
        if(INode.isInstance(this.item) && this.item.style instanceof UMLNodeStyle) {
            this.updateProperties()
        }
    }


    buildUMLNodeProperties() {
        this.accordionMeta = document.createElement('button')
        this.accordionMeta.className = 'accordion'
        this.accordionMeta.innerHTML = 'Attributes'
        this.pMeta = document.createElement('p')
        this.pMeta.class = 'panel'

        this.accordionAttributes = document.createElement('button')
        this.accordionAttributes.className = 'accordion'
        this.accordionAttributes.innerHTML = 'Attributes'
        this.pAttributes = document.createElement('p')
        this.pAttributes.class = 'panel'

        this.accordionOperations = document.createElement('button')
        this.accordionOperations.className = 'accordion'
        this.accordionOperations.innerHTML = 'Operations'
        this.pOperations = document.createElement('p')
        this.pOperations.class = 'panel'



        this.div.appendChild(this.accordionMeta)
        this.div.appendChild(this.pMeta)
        this.div.appendChild(this.accordionAttributes)
        this.div.appendChild(this.pAttributes)
        this.div.appendChild(this.accordionOperations)
        this.div.appendChild(this.pOperations)

        let acc = document.getElementsByClassName('accordion'); //cant find Elements
        for (let i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {
                /* Toggle between adding and removing the "active" class,
                to highlight the button that controls the panel */
                this.classList.toggle("active");

                /* Toggle between hiding and showing the active panel */
                let panel = this.nextElementSibling;
                if (panel.style.display === "block") {
                    panel.style.display = "none";
                } else {
                    panel.style.display = "block";
                }
            });
        }
    }
}


/**
 * 1. build empty properties-panel
 * 2. onClick Node -> send node
 * 3. build apropriate accordion
 *
 *
 *  <button class="accordion">Section 1</button>
 <div class="panel">
 <p>Lorem ipsum...</p>
 </div>

 <button class="accordion">Section 2</button>
 <div class="panel">
 <p>Lorem ipsum...</p>
 </div>

 <button class="accordion">Section 3</button>
 <div class="panel">
 <p>Lorem ipsum...</p>
 </div>
 *
 * const div = document.createElement('div')
 div.setAttribute('class', 'dndPanelItem')
 div.appendChild(visual)
 *
 *

 constructor(graphComponent) {
        // Obtain the input mode for handling dropped nodes from the GraphEditorInputMode.
        const nodeDropInputMode = graphComponent.inputMode.nodeDropInputMode
        // By default the mode available in GraphEditorInputMode is disabled, so first enable it.
        nodeDropInputMode.enabled = true
        // Certain nodes should be created as group nodes. In this case we distinguish them by their style.
        nodeDropInputMode.isGroupNodePredicate = draggedNode =>
            draggedNode.style instanceof PanelNodeStyle
        // When dragging the node within the GraphComponent, we want to show a preview of that node.
        nodeDropInputMode.showPreview = true

        initializeDragAndDropPanel(graphComponent)
    }
 }

 /**
 * Initializes the palette of nodes that can be dragged to the graph component.

function initializeDragAndDropPanel(graphComponent) {
    // retrieve the panel element
    const panel = document.getElementById('drag-and-drop-panel')
    // prepare node styles for the palette
    const defaultNodeStyle = graphComponent.graph.nodeDefaults.style
    const nodeStyles = [defaultNodeStyle]

    // add a visual for each node style to the palette
    nodeStyles.forEach((style) => {
        addNodeVisual(style, panel, graphComponent)
    })

}*/