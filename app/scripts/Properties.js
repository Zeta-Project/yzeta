import {
    INode,

} from "yfiles";

import {UMLNodeStyle} from "./UMLNodeStyle";

export class Properties {

    constructor(graphComponent) {
        // retrieve the panel element
        this.divField = document.getElementById('properties-panel')

        this.graphComponent = graphComponent
        //this.graphComponent.selection.addItemSelectionChangedListener(this.updateProperties)
        //console.log(this.graphComponent)
    }

    get div() {
        return this.divField
    }
    set div(div) {
        this.divField = div
    }

    updateProperties(sender, args) {
        console.log('update')
        let div = this.div

        if (args == null) {

            return;
        }


        let item = args.item
        let model = item.style.model

        if (INode.isInstance(item) && item.style instanceof UMLNodeStyle) {
            //There is a node and it is type of UMLNodeStyle
            if (!div.hasChildNodes()) {
                this.div = buildUMLNodeProperties(model, div)
            }
        }
        //updateUMLNodeProperties(model, div)
    }
}



function updateUMLNodeProperties(model, container) {

    container.pMeta.class = model.className
    container.pAttributes.class = model.attributes

}

function buildUMLNodeProperties(model, container) {
console.log('building')
    let accordionMeta = document.createElement('button')
    accordionMeta.className = 'accordion'
    accordionMeta.innerHTML = 'Attributes'
    let pMeta = document.createElement('p')
    pMeta.class = model.className

    let accordionAttributes = document.createElement('button')
    accordionAttributes.className = 'accordion'
    accordionAttributes.innerHTML = 'Attributes'
    let pAttributes = document.createElement('p')
    pAttributes.class = model.attributes

    let accordionOperations = document.createElement('button')
    accordionOperations.className = 'accordion'
    accordionOperations.innerHTML = 'Operations'
    let pOperations = document.createElement('p')
    pOperations.class = model.operations


    container.appendChild(accordionMeta)
    container.appendChild(pMeta)
    container.appendChild(accordionAttributes)
    container.appendChild(pAttributes)
    container.appendChild(accordionOperations)
    container.appendChild(pOperations)

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
    return container
}

/**
 * 1. build empty properties-panel
 * 2. onClick Node -> send node
 * 3. build apropriate accordion
 *
 *
 *
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
 *
 *
 *         this.pMeta.innerHTML = this.item.style.model.className
 this.pAttributes.innerHTML = this.item.style.model.attributes.toString()
 this.pOperations.innerHTML = this.item.style.model.operations.toString()
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