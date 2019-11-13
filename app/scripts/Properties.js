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
        let div = this.div
        if (args == null) return
        let item = args.item
        let model = item.style.model

        if (INode.isInstance(item) && item.style instanceof UMLNodeStyle) {
            //There is a node and it is type of UMLNodeStyle
            if (!div.hasChildNodes()) {
                //update properties
            }
            //rebuild properties
            this.div.innerHTML = ""
            this.div = this.buildUMLNodeProperties(model, div) //not sure where to set object.div

            //this.div = this.updateUMLNodeProperties(model, div)
        }
        else {
            this.div.removeAll()
            console.log(item)
        }
    }


    buildUMLNodeProperties(model, container) {
        let div = container
        let accordionMeta = document.createElement('button')
        accordionMeta.className = 'accordion'
        accordionMeta.innerHTML = 'MetaInformation'
        let pMeta = document.createElement('p')
        pMeta.class = 'panel'
        let titleBox = document.createElement("INPUT");
        titleBox.setAttribute("type", "text");
        titleBox.setAttribute("value", model.className);
        titleBox.class = "input"
        titleBox.oninput = function(){
            console.log(model.className = titleBox.value)
        }
        pMeta.appendChild(titleBox)

        let accordionAttributes = document.createElement('button')
        accordionAttributes.className = 'accordion'
        accordionAttributes.innerHTML = 'Attributes'
        let pAttributes = document.createElement('p')
        pAttributes.class = 'panel'
        for(let i = 0; i < model.attributes.length; i++) {
            let textBox = document.createElement("INPUT");
            textBox.setAttribute("type", "text");
            textBox.setAttribute("value", model.attributes[i].toString())
            textBox.oninput = function(){
                model.attributes[i] = textBox.value
            }
            pAttributes.appendChild(textBox);
        }


        pAttributes.className = model.attributes.toString()

        let accordionOperations = document.createElement('button')
        accordionOperations.className = 'accordion'
        accordionOperations.innerHTML = 'Operations'
        let pOperations = document.createElement('p')
        pOperations.class = 'panel'
        for(let i = 0; i < model.operations.length; i++) {
            let textBox = document.createElement("INPUT");
            textBox.setAttribute("type", "text");
            textBox.setAttribute("value", model.operations[i].toString())
            textBox.oninput = function(){
                model.operations[i] = textBox.value
            }
            pOperations.appendChild(textBox);
        }


        div.appendChild(accordionMeta)
        div.appendChild(pMeta)
        div.appendChild(accordionAttributes)
        div.appendChild(pAttributes)
        div.appendChild(accordionOperations)
        div.appendChild(pOperations)

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
        return div
    }
}