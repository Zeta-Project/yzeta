import {
  ConcurrencyController,
  DefaultPortCandidate,
  DefaultSelectionModel,
  Fill,
  FreeNodePortLocationModel,
  GraphEditorInputMode,
  ICanvasObjectDescriptor,
  IInputMode,
  IInputModeContext,
  IModelItem,
  INode,
  ISelectionIndicatorInstaller,
  InputModeBase,
  ItemSelectionChangedEventArgs,
  ModelManager,
  Point,
  SolidColorFill,
  delegate
} from 'yfiles'

import ButtonVisualCreator from './ButtonVisualCreator.js'

/**
 * An {@link IInputMode} which will provide buttons for edge creation for the graph component's current item.
 * When one of the buttons is dragged, a new edge with the specified style is created.
 */
export default class UMLContextButtonsInputMode extends InputModeBase {
  constructor() {
    super()
    this.buttonNodes = new DefaultSelectionModel()

    // initializes listener functions in order to install/uninstall them
    this.onCurrentItemChangedListener = () => this.onCurrentItemChanged()
    this.onCanvasClickedListener = (sender, evt) => this.onCanvasClicked(evt.location)
    this.onNodeRemovedListener = (sender, evt) => this.onNodeRemoved(evt.item)
    this.startEdgeCreationListener = (sender, evt) => this.startEdgeCreation(evt.location)
  }

  /**
   * Installs the necessary listeners of this input mode.
   * @param {IInputModeContext} context the context to install this mode into
   * @param {ConcurrencyController} controller The {@link InputModeBase#controller} for
   *   this mode.
   */
  install(context, controller) {
    super.install(context, controller)

    // use a selection indicator manager which only "selects" the current item
    // so the buttons are only displayed for one node
    const graphComponent = context.canvasComponent
    this.manager = new MySelectionIndicatorManager(graphComponent, this.buttonNodes)

    // keep buttons updated and their add interaction
    graphComponent.addCurrentItemChangedListener(this.onCurrentItemChangedListener)
    graphComponent.addMouseDragListener(this.startEdgeCreationListener)
    graphComponent.addMouseClickListener(this.startEdgeCreationListener)
    graphComponent.addTouchMoveListener(this.startEdgeCreationListener)
    graphComponent.addTouchDownListener(this.startEdgeCreationListener)
    graphComponent.inputMode.addCanvasClickedListener(this.onCanvasClickedListener)
    graphComponent.graph.addNodeRemovedListener(this.onNodeRemovedListener)
  }

  /**
   * Called when the graph component's current item changed to move the buttons to the current item.
   */
  onCurrentItemChanged() {
    const graphComponent = this.inputModeContext.canvasComponent
    if (INode.isInstance(graphComponent.currentItem)) {
      this.buttonNodes.clear()
      this.buttonNodes.setSelected(graphComponent.currentItem, true)
    } else {
      this.buttonNodes.clear()
    }
  }

  /**
   * Remove the button visuals when the node is deleted.
   * @param {IModelItem} item
   */
  onNodeRemoved(item) {
    this.buttonNodes.setSelected(item, false)
  }

  /**
   * Called when the mouse button is pressed to initiate edge creation in case a button is hit.
   * @param {Point} location
   */
  startEdgeCreation(location) {
    if (this.active && this.canRequestMutex()) {
      const graphComponent = this.inputModeContext.canvasComponent

      // check which node currently has the buttons and invoke create edge input mode to create a new edge
      for (let enumerator = this.buttonNodes.getEnumerator(); enumerator.moveNext(); ) {
        const buttonNode = enumerator.current
        const styleButton = ButtonVisualCreator.getStyleButtonAt(
          graphComponent,
          buttonNode,
          location
        )
        if (styleButton) {
          const parentInputMode = this.inputModeContext.parentInputMode
          if (parentInputMode instanceof GraphEditorInputMode) {
            const createEdgeInputMode = parentInputMode.createEdgeInputMode //currently no edgeinputmode in graphcomponent --> how does it work?

            // initialize dummy edge
            const umlEdgeType = styleButton
            const dummyEdgeGraph = createEdgeInputMode.dummyEdgeGraph
            const dummyEdge = createEdgeInputMode.dummyEdge
            dummyEdgeGraph.setStyle(dummyEdge, umlEdgeType)
            dummyEdgeGraph.edgeDefaults.style = umlEdgeType

            // start edge creation and hide buttons until the edge is finished
            this.buttonNodes.clear()
            createEdgeInputMode.doStartEdgeCreation(
              new DefaultPortCandidate(buttonNode, FreeNodePortLocationModel.NODE_CENTER_ANCHORED)
            )
            const listener = () => {
              graphComponent.selection.clear()
              graphComponent.currentItem = null
              createEdgeInputMode.removeGestureCanceledListener(listener)
              createEdgeInputMode.removeGestureFinishedListener(listener)
            }
            createEdgeInputMode.addGestureFinishedListener(listener)
            createEdgeInputMode.addGestureCanceledListener(listener)
            return
          }
        }
      }
    }
  }

  /**
   * Check whether a context button has been clicked.
   * @param {Point} location
   */
  onCanvasClicked(location) {
    if (this.active && this.canRequestMutex()) {
      const graphComponent = this.inputModeContext.canvasComponent
      for (let enumerator = this.buttonNodes.getEnumerator(); enumerator.moveNext(); ) {
        const buttonNode = enumerator.current
        const contextButton = ButtonVisualCreator.getContextButtonAt(buttonNode, location)
        if (contextButton) {
          if (contextButton === 'interface') {
            const isInterface = buttonNode.style.model.stereotype === 'interface'
            buttonNode.style.model.stereotype = isInterface ? '' : 'interface'
            buttonNode.style.model.constraint = ''
            buttonNode.style.fill = isInterface
              ? new SolidColorFill(0x60, 0x7d, 0x8b)
              : Fill.SEA_GREEN
          } else if (contextButton === 'abstract') {
            const isAbstract = buttonNode.style.model.constraint === 'abstract'
            buttonNode.style.model.constraint = isAbstract ? '' : 'abstract'
            buttonNode.style.model.stereotype = ''
            buttonNode.style.fill = isAbstract ? new SolidColorFill(0x60, 0x7d, 0x8b) : Fill.CRIMSON
          }
          buttonNode.style.model.modify()
          graphComponent.invalidate()
          graphComponent.inputMode.clickInputMode.preventNextDoubleClick()
        }
      }
    }
  }

  /**
   * Removed the installed listeners when they are not needed anymore.
   * @param {IInputModeContext} context - The context to remove this mode from. This is the same
   *   instance that has been passed to {@link InputModeBase#install}.
   */
  uninstall(context) {
    const graphComponent = context.canvasComponent
    graphComponent.removeCurrentItemChangedListener(this.onCurrentItemChangedListener)
    graphComponent.removeMouseDragListener(this.startEdgeCreationListener)
    graphComponent.removeMouseClickListener(this.startEdgeCreationListener)
    graphComponent.removeTouchMoveListener(this.startEdgeCreationListener)
    graphComponent.removeTouchDownListener(this.startEdgeCreationListener)
    graphComponent.inputMode.removeCanvasClickedListener(this.onCanvasClickedListener)
    graphComponent.graph.removeNodeRemovedListener(this.onNodeRemovedListener)
    this.buttonNodes.clear()
    this.manager.dispose()
    this.manager = null
    super.uninstall(context)
  }
}

/**
 * A selection manager that draws the selection visualization in front of the input mode objects, such that
 * the edge creation buttons are drawn on top of the selected etc.
 */
class MySelectionIndicatorManager extends ModelManager {
  constructor(canvas, model) {
    super(canvas)
    this.model = model
    this.buttonGroup = canvas.inputModeGroup.addGroup()
    this.selectionChangedListener = (sender, evt) =>
      this.selectionChanged(evt.item, evt.itemSelected)
    this.model.addItemSelectionChangedListener(this.selectionChangedListener)
  }

  /**
   * @param {T} item The item to find an installer for.
   * @returns {ICanvasObjectInstaller}
   */
  getInstaller(item) {
    return new ISelectionIndicatorInstaller((iCanvasContext, iCanvasObjectGroup, node) =>
      iCanvasObjectGroup.addChild(
        new ButtonVisualCreator(node, this.canvasComponent),
        ICanvasObjectDescriptor.ALWAYS_DIRTY_INSTANCE
      )
    )
  }

  /**
   * @param {T} item The item to find a canvas object group for.
   * @returns {ICanvasObjectGroup}
   */
  getCanvasObjectGroup(item) {
    return this.buttonGroup
  }

  /**
   * Called when the selection of the internal model changes.
   * @param {IModelItem} item The item that is the subject of the event
   * @param {boolean} itemSelected Whether the item is selected
   */
  selectionChanged(item, itemSelected) {
    if (itemSelected) {
      this.add(item)
    } else {
      this.remove(item)
    }
  }

  /**
   * Cleanup the selection manager.
   */
  dispose() {
    this.model.removeItemSelectionChangedListener(this.selectionChangedListener)
    this.buttonGroup.remove()
  }

  onDisabled() {}

  onEnabled() {}
}
