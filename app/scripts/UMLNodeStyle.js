import {
    Class,
    DefaultLabelStyle,
    Fill,
    Font,
    FontStyle,
    GraphEditorInputMode,
    HorizontalTextAlignment,
    IClipboardHelper,
    IEditLabelHelper,
    INode,
    INodeSizeConstraintProvider,
    IRenderContext,
    Insets,
    InteriorStretchLabelModel,
    InteriorStretchLabelModelPosition,
    ItemClickedEventArgs,
    LabelEditingEventArgs,
    MarkupExtension,
    NodeStyleBase,
    Point,
    Rect,
    ShapeNodeStyle,
    SimpleLabel,
    SimpleNode,
    Size,
    SolidColorFill,
    Stroke,
    SvgVisual,
    TextRenderSupport,
    TypeAttribute,
    VerticalTextAlignment,
    Visual,
    YObject
} from 'yfiles'

import { UMLClassModel } from './UMLClassModel.js'
// additional spacing after certain elements
const VERTICAL_SPACING = 2

// empty space before the text elements
const LEFT_SPACING = 25

