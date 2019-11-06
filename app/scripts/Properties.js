import {
    DragDropEffects,
    GraphComponent,
    INodeStyle,
    Insets,
    NodeDropInputMode,
    PanelNodeStyle,
    Rect,
    SimpleNode,
    SvgExport
} from "yfiles";

export class Properties {



    constructor(graphComponent) {
        // retrieve the panel element
        this.divField = document.getElementById('properties-panel')

        const accordionMeta = document.createElement('button')
        accordionMeta.className = 'accordion'
        accordionMeta.innerHTML = 'Attributes'
        const pMeta = document.createElement('p')
        pMeta.class = 'panel'
        pMeta.innerHTML = 'Some Meta Information'

        const accordionAttributes = document.createElement('button')
        accordionAttributes.className = 'accordion'
        accordionAttributes.innerHTML = 'Attributes'

        const pAttributes = document.createElement('p')
        pAttributes.class = 'panel'
        pAttributes.innerHTML = 'InnerTestP'

        const accordionOperations = document.createElement('button')
        accordionOperations.className = 'accordion'
        accordionOperations.innerHTML = 'Operations'

        const pOperations = document.createElement('p')
        pOperations.class = 'panel'
        pOperations.innerHTML = 'SomeOperations'



        this.div.appendChild(accordionMeta)
        this.div.appendChild(pMeta)
        this.div.appendChild(accordionAttributes)
        this.div.appendChild(pAttributes)
        this.div.appendChild(accordionOperations)
        this.div.appendChild(pOperations)

        let acc = document.getElementsByClassName('accordion'); //cant find Elements
        console.log(acc.length)
        for (let i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function() {
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

    get div() {
        return this.divField
    }


    updateProperties() {

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