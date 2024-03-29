import { ZCommandObject, ZArgType, ZScriptLevel } from "./zCommandUtil.js";

interface IZVartable {
  [key: string]: ZArgType;
}

export let ZVarTable: IZVartable = {
  VarDef: ZArgType.any,
  VarSet: ZArgType.any,
  RoutineDef: ZArgType.routine,
  MVarDef: ZArgType.varMemoryBlock,
  MemCreate: ZArgType.memoryBlock,
  MemCreateFromFile: ZArgType.memoryBlock,
  zscriptinsert: ZArgType.scriptInsert
};

export let zScriptCmds: ZCommandObject = {
  IButton:
  {
    syntax: '[%s, %s]',
    description: 'Creates an interactive push button (can be placed anywhere but advise <b>Top Level</b>).',
    example: 'Example:\n\n<code>[IButton, "Click Me", , [MessageOK, YouClicked]]</code>\n\nCreates an interactive button with “Click Me” text which will display a “YouClicked” message when pressed (<b>Top Level</b>).\n\n<code>[IButton, ???, "This is a macro button", ...commands...]</code>\n\nThe special Button name <b>???</b> indentifies this as a Macro. If the zscript text file is placed in the ZStartup\\Macros folder, ZBrush will automatically load the zscript; the file name will show as the Button name.',
    args:
      [{ name: 'name', description: 'Button name', type: ZArgType.string },
      { name: 'popupText', description: 'Popup info Text', type: ZArgType.string },
      {
        name: 'command',
        description: 'Commands group to execute when button is pressed',
        type: ZArgType.commandGroup
      },
      {
        name: 'isDisabled',
        description: 'Initially Disabled? (0:Enabled(ByDefault) NonZero:Disabled)',
        type: ZArgType.number
      },
      {
        name: 'width',
        description: 'Button width in pixels (0:AutoWidth NonZero:Specified width)',
        type: ZArgType.number
      },
      { name: 'hotkey', description: 'Optional hotkey', type: ZArgType.string },
      {
        name: 'iconPath',
        description: 'Optional button icon (.psd .bmp + .pct for Mac Systems)',
        type: ZArgType.string
      },
      {
        name: 'height',
        description: 'Button height in pixels (0:AutoHeight NonZero:Specified height)',
        type: ZArgType.number
      }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  ISlider:
  {
    syntax: '[%s, %s]',
    description: 'Creates an interactive slider (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[ISlider, ChangeMe, 12, 1, 0, 100, , [MessageOK, ThankYou]]</code>\n\nCreates an interactive slider with initial value of 12, range of 0 to 100 and “ChangeMe” text which will display a “Thankyou” message when its value is changed',
    args:
      [{ name: 'name', description: 'Slider name', type: ZArgType.string },
      { name: 'curValue', description: 'Current Value', type: ZArgType.number },
      { name: 'step', description: 'Resolution', type: ZArgType.number },
      { name: 'minValue', description: 'Minimum Value', type: ZArgType.number },
      { name: 'maxValue', description: 'Maximum Value', type: ZArgType.number },
      { name: 'popupText', description: 'Popup info Text', type: ZArgType.string },
      {
        name: 'command',
        description: 'Commands group to execute when value is changed',
        type: ZArgType.commandGroup
      },
      {
        name: 'isDisabled',
        description: 'Initially Disabled? (0:Enabled(ByDefault) NonZero:Disabled)',
        type: ZArgType.number
      },
      {
        name: 'width',
        description: 'Slider width in pixels (0:AutoWidth NonZero:Specified width)',
        type: ZArgType.number
      }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  ISwitch:
  {
    syntax: '[%s, %s]',
    description: 'Creates an interactive switch (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[ISwitch, ClickMe, 1, "Info text", [MessageOK, On], [MessageOK, Off]]</code>\n\nCreates an interactive switch with “ClickMe” label which will display an “On” message when pressed and an “Off” message when unpressed.<br>\n<strong>Note</strong>: for zplugins, it is best to use the [IEnable] command for each switch (placed at the end of the zscript) to make sure switches do not become disabled when other plugins are loaded.',
    args:
      [{ name: 'name', description: 'Switch name', type: ZArgType.string },
      {
        name: 'initialSate',
        description: 'Initial state (1:pressed, 0:unpressed)',
        type: ZArgType.number
      },
      { name: 'popupText', description: 'Popup info Text', type: ZArgType.string },
      {
        name: 'commandWhenPressed',
        description: 'Commands group to execute when button is pressed',
        type: ZArgType.commandGroup
      },
      {
        name: 'commandWhenUnpressed',
        description: 'Commands group to execute when button is unpressed',
        type: ZArgType.commandGroup
      },
      {
        name: 'isDisabled',
        description: 'Initially Disabled? (0:Enabled(ByDefault) NonZero:Disabled)',
        type: ZArgType.number
      },
      {
        name: 'width',
        description: 'Switch width in pixels (0:AutoWidth NonZero:Specified width)',
        type: ZArgType.number
      }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  ISubPalette:
  {
    syntax: '[%s, %s]',
    description: 'Adds a subpalette to ZBrush interface. Output: Returns 1 if subpalette added successfully. Returns 0 if subpalette could not be added or if it already exsists.',
    example: 'Example:\n\n<code>[ISubPalette, "ZPlugin:My Plugins"]</code>\n\nCreates a “My Plugins” subpalette within the ZPlugin palette. This command is essential for creating a zscript plugin.',
    args:
      [{ name: 'name', description: 'Subpalette name', type: ZArgType.string },
      {
        name: 'titleMode', type: ZArgType.number,
        description: 'Title mode? (0:Show Title and minimize button(ByDefault) 1:Show Title without minimize button 2:Hide Title )'
      },
      {
        name: 'iconPath', type: ZArgType.string,
        description: 'Optional subpalette gray-scale (8-bits) icon (Standard size of 20x20 pixels)'
      },
      {
        name: 'leftInset', type: ZArgType.number,
        description: 'Left Inset (0:default)'
      },
      {
        name: 'rightInset', type: ZArgType.number,
        description: 'Right Inset (0:default)'
      },
      {
        name: 'leftTop', type: ZArgType.number,
        description: 'Left Top (0:default)'
      },
      {
        name: 'rigthBottom', type: ZArgType.number,
        description: 'Right Bottom (0:default)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  ButtonFind:
  {
    syntax: '[%s, %s]',
    description: 'Locates a ZBrush interface item (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[ButtonFind, Document:Width, Text]</code>\n\nLocates the width button in the Document menu',
    args:
      [{
        name: 'uiPath', type: ZArgType.string,
        description: 'Interface item path'
      },
      { name: 'name', description: 'Button name', type: ZArgType.string },
      {
        name: 'isDisabled', type: ZArgType.number,
        description: 'Initially Disabled? (0:Enabled(ByDefault) NonZero:Disabled)'
      }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  ButtonPress:
  {
    syntax: '[%s, %s]',
    description: 'Locates and presses a ZBrush interface item (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[ButtonPress, Tool:Sphere3D, Text]</code>\n\nLocates the Sphere3D button in the Tool menu and presses it making the Sphere3D the active tool',
    args:
      [{
        name: 'uiPath', type: ZArgType.string,
        description: 'Interface item path'
      },
      { name: 'name', description: 'Button name', type: ZArgType.string },
      {
        name: 'isDisabled', type: ZArgType.string,
        description: 'Initially Disabled? (0:Enabled(ByDefault) NonZero:Disabled)'
      }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  ButtonSet:
  {
    syntax: '[%s, %s]',
    description: 'Locates and sets a new value to a ZBrush interface item (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[ButtonSet, Document:Width, 123, Text]</code>\n\nLocates the Width slider in the Document menu and enters “123” as its value',
    args:
      [{
        name: 'uiPath', type: ZArgType.string,
        description: 'Interface item path'
      },
      { name: 'value', description: 'Value', type: ZArgType.any },
      { name: 'name', description: 'Button name', type: ZArgType.string },
      {
        name: 'isDisabled', type: ZArgType.number,
        description: 'Initially Disabled? (0:Enabled(ByDefault) NonZero:Disabled)'
      }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  ButtonUnPress:
  {
    syntax: '[%s, %s]',
    description: 'Locates and unpresses a ZBrush interface item (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[ButtonUnPress, Layer:Modifiers:W, Text]</code>\n\nLocates the W button in the Modifiers submenu of the Layer menu and unpresses it',
    args:
      [{
        name: 'uiPath', type: ZArgType.string,
        description: 'Interface item path'
      },
      { name: 'name', description: 'Button name', type: ZArgType.string },
      {
        name: 'isDisabled', type: ZArgType.number,
        description: 'Initially Disabled? (0:Enabled(ByDefault) NonZero:Disabled)'
      }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  Note:
  {
    syntax: '[%s, %s]',
    description: 'Displays a note to the user. Output: If the note has UI buttons then the return value of the pressed buttons (1=1st button, 2=2nd button …), otherwise the return value will be zero (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[Note, "Hello There"]</code>\n\nDisplays a message to the user with “Hello There” as the text.',
    args:
      [{ name: 'text', description: 'Text line', type: ZArgType.string },
      {
        name: 'uiPathToPoint', type: ZArgType.string,
        description: 'Optional path of an interface item to be pointed out (default:none)'
      },
      {
        name: 'displayTime', type: ZArgType.number,
        description: 'Display Duration (in seconds) (0:wait for user action(default), -1:combine with next note command)'
      },
      {
        name: 'backgroundColor', type: ZArgType.number,
        description: 'Popup background color (0x000000<->0xffffff, default:0x606060, 0:No Background)'
      },
      {
        name: 'distance', type: ZArgType.number,
        description: 'Prefered distance of the note from the specified interface item (default:48)'
      },
      {
        name: 'width', type: ZArgType.number,
        description: 'Prefered Note width (in pixels, default:400)'
      },
      {
        name: 'markedWindowFillColor', type: ZArgType.number,
        description: 'optional marked windows fill color (0x000000<->0xffffff or (blue+(green*256)+(red*65536))(Omitted value:No fill))'
      },
      {
        name: 'hFrameSize', type: ZArgType.number,
        description: 'Frame horizontal size (1:Max width (default))'
      },
      {
        name: 'vFrameSize', type: ZArgType.number,
        description: 'Frame vertical size (1:Max height (default))'
      },
      {
        name: 'frameLeftSde', type: ZArgType.number,
        description: 'Frame left side (0:left (default), .5:center, 1:right) Omit value for horizontal autocentering'
      },
      {
        name: 'frameTopSide', type: ZArgType.number,
        description: 'Frame top side ( 0:top (default), .5:center, 1:bottom )Omit value for vertical auto-centering'
      },
      {
        name: 'iconPath', type: ZArgType.string,
        description: 'Optional icon file name'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  NoteBar:
  {
    syntax: '[%s, %s]',
    description: 'Displays a note in progress bar (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[NoteBar, "ZScript is calculating, Please wait..."]</code>\n\nDisplays a progress bar note “ZScript is calculating. Please wait…”.',
    args:
      [{
        name: 'message', type: ZArgType.string,
        description: 'The Message that will be shown (use empty string to clear current note)'
      },
      {
        name: 'progressBarValue', type: ZArgType.number,
        description: 'Optional progress-bar value (0:Min, 1:Max)'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  NoteIButton:
  {
    syntax: '[%s, %s]',
    description: 'Defines a button to be included within the next Note to be shown (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[NoteIButton, "OK"] </code>\n\nDefines an “OK” note button.',
    args:
      [{ name: 'name', description: 'Button name', type: ZArgType.string },
      {
        name: 'iconPath', type: ZArgType.string,
        description: 'Optional button icon'
      },
      {
        name: 'isPressed', type: ZArgType.number,
        description: 'Initially Pressed? (default:unpressed)'
      },
      {
        name: 'isDisabled', type: ZArgType.number,
        description: 'Initially Disabled? (default:enabled)'
      },
      {
        name: 'hRelPos', type: ZArgType.number,
        description: 'Optional button H relative position (Positive value:offset from left, Negative value:offset from right, 0:automatic)'
      },
      {
        name: 'vRelPos', type: ZArgType.number,
        description: 'Optional button V relative position (Positive value:offset from top, Negative value:offset from bottom, 0:automatic)'
      },
      {
        name: 'width', type: ZArgType.number,
        description: 'Optional button width in pixels (default:automatic)'
      },
      {
        name: 'height', type: ZArgType.number,
        description: 'Optional button height in pixels (default:automatic)'
      },
      {
        name: 'buttonColor', type: ZArgType.number,
        description: 'Optional button color (0x000000<->0xffffff or (blue+(green*256)+(red*65536)))'
      },
      {
        name: 'textColor', type: ZArgType.number,
        description: 'Optional text color (0x000000<->0xffffff or (blue+(green*256)+(red*65536)))'
      },
      {
        name: 'bgOpacity', type: ZArgType.number,
        description: 'Optional background opacity (default:1)'
      },
      {
        name: 'textOpacity', type: ZArgType.number,
        description: 'Optional text opacity (default:1)'
      },
      {
        name: 'iconOpacity', type: ZArgType.number,
        description: 'Optional image opacity (default:1)'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  NoteIGet:
  {
    syntax: '[%s, %s]',
    description: 'Returns the value of a NoteIButton which was shown in the last displayed Note. Output: The item value.',
    example: 'Example:\n\n<code>[NoteIGet, 1]</code>\n\nReturns the value of the 1st note button or switch.\n\n<code>[NoteIGet, "Double"]</code>\n\nReturns the value of the note button or switch named “Double”.',
    args:
      [{
        name: 'indexOrName', type: ZArgType.any,
        description: 'Note-button index (1:1st) or its name'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  NoteISwitch:
  {
    syntax: '[%s, %s]',
    description: 'Define a switch-button to be included within the next Note to be shown (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[NoteISwitch, "Double Sided"]</code>\n\nDefines a “Double Sided” note switch-button.',
    args:
      [{ name: 'name', description: 'Switch name', type: ZArgType.string },
      {
        name: 'iconPath', type: ZArgType.string,
        description: 'Optional button icon'
      },
      {
        name: 'isPressed', type: ZArgType.number,
        description: 'Initially Pressed? (default:unpressed)'
      },
      {
        name: 'isDisabled', type: ZArgType.number,
        description: 'Initially Disabled ? (default:enabled)'
      },
      {
        name: 'hRelPos', type: ZArgType.number,
        description: 'Optional button H relative position (Positive value:offset from left, Negative value:offset from right, 0:automatic)'
      },
      {
        name: 'vRelPos', type: ZArgType.number,
        description: 'Optional button V relative position (Positive value:offset from top, Negative value:offset from bottom, 0:automatic)'
      },
      {
        name: 'width', type: ZArgType.number,
        description: 'Optional button width in pixels (default:automatic)'
      },
      {
        name: 'height', type: ZArgType.number,
        description: 'Optional button height in pixels (default:automatic)'
      },
      {
        name: 'buttonColor', type: ZArgType.number,
        description: 'Optional button color (0x000000<->0xffffff or (blue+(green*256)+(red*65536)))'
      },
      {
        name: 'textColor', type: ZArgType.number,
        description: 'Optional text color (0x000000<->0xffffff or (blue+(green*256)+(red*65536)))'
      },
      {
        name: 'bgOpacity', type: ZArgType.number,
        description: 'Optional background opacity (default:1)'
      },
      {
        name: 'textOpacity', type: ZArgType.number,
        description: 'Optional text opacity (default:1)'
      },
      {
        name: 'iconOpacity', type: ZArgType.number,
        description: 'Optional image opacity (default:1)'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  MessageOK:
  {
    syntax: '[%s, %s]',
    description: 'Displays a user message with a single OK button',
    example: 'Example:\n\n<code>[MessageOK, "Hello There"]</code>\n\nDisplays a message to the user with “Hello There” as the text, and waits for the user to click the “OK” button (<b>Sub-Level</b> only).',
    args:
      [{
        name: 'message', type: ZArgType.string,
        description: 'The Message that will be shown'
      },
      {
        name: 'tite', type: ZArgType.string,
        description: 'The Title of the message'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  MessageOKCancel:
  {
    syntax: '[%s, %s]',
    description: 'Displays a user message with CANCEL and OK buttons Output: Returns the button that the user clicked. (0=CANCEL, 1=OK)(<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[MessageOKCancel, "Delete this image?"]</code>\n\nDisplays a message to the user with “Delete this image?” as the text, and waits for the user to click the “OK” or “Cancel” button.',
    args:
      [{
        name: 'message', type: ZArgType.string,
        description: 'The Message that will be shown'
      },
      {
        name: 'title', type: ZArgType.string,
        description: 'The Title of the message'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  MessageYesNo:
  {
    syntax: '[%s, %s]',
    description: 'Displays a user message with YES and NO buttons Output: Returns the button that the user clicked (0=NO, 1=YES)(<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[MessageYesNo, "Are you sure?"]</code>\n\nDisplays a message to the user with “Are you sure?” as the text, and waits for the user to click the “YES” or “NO” button.',
    args:
      [{
        name: 'message', type: ZArgType.string,
        description: 'The Message that will be shown'
      },
      {
        name: 'title', type: ZArgType.string,
        description: 'The Title of the message'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  MessageYesNoCancel:
  {
    syntax: '[%s, %s]',
    description: 'Displays a user message with YES, NO and CANCEL buttons Output: Returns the button that the user clicked (0=NO, 1=YES CANCEL=-1)(<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[MessageYesNoCancel, "Are you sure?"]</code>\n\nDisplays a message to the user with “Are you sure?” as the text, and waits for the user to click the “YES”, “NO” or “CANCEL” button.',
    args:
      [{
        name: 'message', type: ZArgType.string,
        description: 'The Message that will be shown'
      },
      {
        name: 'title', type: ZArgType.string,
        description: 'The Title of the message'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  CanvasClick:
  {
    syntax: '[%s, %s]',
    description: 'Emulates a click within the current canvas area',
    example: 'Example:\n\n<code>[CanvasClick, 10, 10, 20, 20]</code>\n\nEmulates a canvas click at 10, 10 with a drag to 20, 20 before releasing the mouse button',
    args:
      [{ name: 'X1', description: 'X1', type: ZArgType.number },
      { name: 'Y1', description: 'Y1', type: ZArgType.number },
      { name: 'X2', description: 'X2', type: ZArgType.number },
      { name: 'Y2', description: 'Y2', type: ZArgType.number },
      { name: 'X3', description: 'X3', type: ZArgType.number },
      { name: 'Y3', description: 'Y3', type: ZArgType.number },
      { name: 'X4', description: 'X4', type: ZArgType.number },
      { name: 'Y4', description: 'Y4', type: ZArgType.number },
      { name: 'X5', description: 'X5', type: ZArgType.number },
      { name: 'Y5', description: 'Y5', type: ZArgType.number },
      { name: 'X6', description: 'X6', type: ZArgType.number },
      { name: 'Y6', description: 'Y6', type: ZArgType.number },
      { name: 'X7', description: 'X7', type: ZArgType.number },
      { name: 'Y7', description: 'Y7', type: ZArgType.number },
      { name: 'X8', description: 'X8', type: ZArgType.number },
      { name: 'Y8', description: 'Y8', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  CanvasGyroHide:
  {
    syntax: '[%s]',
    description: 'Hides the Transformation Gyro',
    example: 'Example:\n\n<code>[CanvasGyroHide]</code>\n\nHides the Transformation Gyro until the next [CanvasGyroShow] is encountered',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  CanvasGyroShow:
  {
    syntax: '[%s]',
    description: 'Shows the Transformation Gyro',
    example: 'Example:\n\n<code>[CanvasGyroShow]</code>\n\nShows the Transformation Gyro hidden by a previous [CanvasGyroHide]',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  CanvasPanGetH:
  {
    syntax: '[%s]',
    description: 'Returns the H pan value of the active document view Output: The current H Pan value.',
    example: 'Example:\n\n<code>[CanvasPanGetH]</code>\n\nReturns the Horizontal pan value of the active document view',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  CanvasPanGetV:
  {
    syntax: '[%s]',
    description: 'Returns the V pan value of the active document view Output: The current V Pan value.',
    example: 'Example:\n\n<code>[CanvasPanGetV]</code>\n\nReturns the Vertical pan value of the active document view',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  CanvasPanSet:
  {
    syntax: '[%s, %s]',
    description: 'Pans (Scrolls) the active document view',
    example: 'Example:\n\n<code>[CanvasPanSet, 320, 240]</code>\n\nScrolls the center of a 640×480 canvas to be at the center of the document view\n\n<code>[CanvasPanSet, 0, 0]</code>\n\nScrolls the top left corner of the canvas to be at the center of the document view',
    args:
      [{
        name: 'hValue', type: ZArgType.number,
        description: 'H value (0:left of document)'
      },
      {
        name: 'vValue', type: ZArgType.number,
        description: 'V value (0:top of document)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  CanvasStroke:
  {
    syntax: '[%s, %s]',
    description: 'Emulates a brush stroke within the current canvas area',
    example: 'Example:\n\n<code>[CanvasStroke, [StrokeGetLast]]</code>\n\nReplays the last stroke',
    args:
      [{ name: 'strokeData', description: 'StrokeData', type: ZArgType.strokeData },
      {
        name: 'delayedUpdate', type: ZArgType.number,
        description: 'Delayed update until end of stroke'
      },
      { name: 'rotation', description: 'Rotation', type: ZArgType.number },
      { name: 'hScale', description: 'HScale', type: ZArgType.number },
      { name: 'vScale', description: 'VScale', type: ZArgType.number },
      { name: 'hOffset', description: 'HOffset', type: ZArgType.number },
      { name: 'vOffset', description: 'VOffset', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  CanvasStrokes:
  {
    syntax: '[%s, %s]',
    description: 'Emulates multiple brush strokes within the current canvas area',
    example: 'Example:\n\n<code>[CanvasStrokes, [Var, loadedStrokes]]</code>\n\nReplays “loadedStrokes” in the canvas area',
    args:
      [{ name: 'strokesData', description: 'StrokesData', type: ZArgType.strokeData },
      {
        name: 'delayedUpdate', type: ZArgType.number,
        description: 'Delayed update until end of stroke'
      },
      { name: 'rotation', description: 'Rotation', type: ZArgType.number },
      { name: 'hScale', description: 'HScale', type: ZArgType.number },
      { name: 'vScale', description: 'VScale', type: ZArgType.number },
      { name: 'hOffset', description: 'HOffset', type: ZArgType.number },
      { name: 'vOffset', description: 'VOffset', type: ZArgType.number },
      { name: 'hRotateCenter', description: 'HRotateCenter', type: ZArgType.number },
      { name: 'vRotateCenter', description: 'VRotateCenter', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  CanvasZoomGet:
  {
    syntax: '[%s]',
    description: 'Returns the zoom value of the active document view Output: The current zoom value.',
    example: 'Example:\n\n<code>[CanvasZoomGet]</code>\n\nReturns the zoom value of the active document view',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  CanvasZoomSet:
  {
    syntax: '[%s, %s]',
    description: 'Sets the zoom factor of the active document view',
    example: 'Example:\n\n<code>[CanvasZoomSet, 2]</code>\n\nSets the zoom value to 2 (each Pixol is shown twice as large)\n\n<code>[CanvasZoomSet, .5]</code>\n\nSets the zoom value to .5 (half-antialiased zoom mode)',
    args: [{ name: 'zoomFactor', description: 'Zoom factor', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  PixolPick:
  {
    syntax: '[%s, %s]',
    description: 'Retrieves information about a specified Pixol Output: The value of the specified Pixol',
    example: 'Example:\n\n<code>[PixolPick, 1, 10, 20]</code>\n\nReturns the Z(depth) value at 10, 20 canvas position.',
    args:
      [{
        name: 'componentIndex', type: ZArgType.number,
        description: 'Component Index: 0:CompositeColor (0x000000<->>0xffffff or (red*65536+green*256+blue)); 1:Z(-32576 to 32576); 2:Red(0 to 255); 3:Green(0 to 255); 4:Blue(0 to 255); 5:MaterialIndex(0 to 255); 6:XNormal(-1 to 1); 7:YNormal(-1 to 1); 8:ZNormal(-1 to 0)'
      },
      { name: 'hPosition', description: 'H Position', type: ZArgType.number },
      { name: 'vPosition', description: 'V Position', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  StrokeGetInfo:
  {
    syntax: '[%s, %s]',
    description: 'Retrieves the information from a specified Stroke-type Variable Output: StrokeInfo resultInfo number: 0=PointsCount 1=IndexedHPos 2=IndexedVPos 3=IndexedPressure 4=MinH<br>\n5=MinV 6=MaxH 7=MaxV 8=MaxRadius 9=MaxRadiusPointlndex 10=MaxDeltaH 11=MaxDeltaV<br>\n12=Total Distance 13=Twirl Count 14=DeducedZValue 15=IndexedkeyPress',
    example: 'Example:\n\n<code>[StrokeGetInfo, [StrokeGetLast], 0]</code>\n\nReturns the number of points in the last drawn brush stroke',
    args:
      [{
        name: 'stroke', type: ZArgType.strokeData,
        description: 'Stroke-type Variable'
      },
      { name: 'infoNumber', description: 'Info number', type: ZArgType.number },
      {
        name: 'ptsIndex', type: ZArgType.number,
        description: 'Point index (0 based)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  StrokeGetLast:
  {
    syntax: '[%s]',
    description: 'Retrieves the last drawn brush stroke Output: StrokeData',
    example: 'Example:\n\n<code>[CanvasStroke, [StrokeGetLast]]</code>\n\nReplays the last drawn brush stroke\n\n<code>[CanvasStroke, [StrokeGetLast], 0, 90, 2, 2]</code>\n\nReplays the last drawn brush stroke rotated 90 degrees and scaled x2.',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.strokeData
  },
  StrokeLoad:
  {
    syntax: '[%s, %s]',
    description: 'Loads a brush-stroke text file Output: StrokeData',
    example: 'Example:\n\n<code>[VarSet, Strokel, [StrokeLoad, "Star.txt"]]</code>\n\nLoads the “Star.txt” file, creates a BrushStroke object and assigns it to “Strokel” variable.\n\n<code>[CanvasStroke, [StrokeLoad, "Star.txt"]]</code>\n\nLoads the “Star.txt” file, creates a BrushStroke object and applies it to the canvas.',
    args: [{ name: 'filePath', description: 'FileName(.txt)', type: ZArgType.string }],
    level: ZScriptLevel.all,
    return: ZArgType.strokeData
  },
  StrokesLoad:
  {
    syntax: '[%s, %s]',
    description: 'Loads a brush-strokes text file Output: StrokesData',
    example: 'Example:\n\n<code>[VarSet, Strokel, [StrokesLoad, "Star.txt"]]</code>\n\nLoads the “Star.txt” file, creates a BrushStrokes object and assigns it to “Strokel” variable.\n\n<code>[CanvasStroke, [StrokesLoad, "Star.txt"]]</code>\n\nLoads the “Star.txt” file, creates a BrushStrokes object and applies it to the canvas.',
    args: [{ name: 'filePath', description: 'FileName(.txt)', type: ZArgType.string }],
    level: ZScriptLevel.all,
    return: ZArgType.strokeData
  },
  TransformGet:
  {
    syntax: '[%s, %s]',
    description: 'Gets current transformation values (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[TransformGet, xPos, yPos, zPos, xSc, ySc, zSc, xRot, yRot, zRot]</code>\n\nsets the variables xPos, yPos, zPos, xSc, ySc, zSc, xRot, yRot and zRot to the 3D Position, Scale and Rotation values of the last drawn object or current floating object.',
    args:
      [{ name: 'xPos', description: 'X Position', type: ZArgType.number },
      { name: 'yPos', description: 'Y Position', type: ZArgType.number },
      { name: 'zPos', description: 'Z Position', type: ZArgType.number },
      { name: 'xScale', description: 'X Scale', type: ZArgType.number },
      { name: 'yScale', description: 'Y Scale', type: ZArgType.number },
      { name: 'zScale', description: 'Z Scale', type: ZArgType.number },
      { name: 'xRot', description: 'X Rotate', type: ZArgType.number },
      { name: 'yRot', description: 'Y Rotate', type: ZArgType.number },
      { name: 'zRot', description: 'Z Rotate', type: ZArgType.number }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  TransformSet:
  {
    syntax: '[%s, %s]',
    description: 'Sets new transformation values (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[TransformSet, (Document:Width*.5), (Document:Height*.5), 0, 100, 100, 100, 0, 0, 0]</code>\n\nsets the 3D values of the last drawn object or current floating object to:<br>\nPosition – XY center of the canvas and Z depth 0<br>\nScale – uniform scale of 100<br>\nRotation – default rotation of 0, 0, 0',
    args:
      [{ name: 'xPos', description: 'X Position', type: ZArgType.number },
      { name: 'yPos', description: 'Y Position', type: ZArgType.number },
      { name: 'zPos', description: 'Z Position', type: ZArgType.number },
      { name: 'xScale', description: 'X Scale', type: ZArgType.number },
      { name: 'yScale', description: 'Y Scale', type: ZArgType.number },
      { name: 'zScale', description: 'Z Scale', type: ZArgType.number },
      { name: 'xRot', description: 'X Rotate', type: ZArgType.number },
      { name: 'yRot', description: 'Y Rotate', type: ZArgType.number },
      { name: 'zRot', description: 'Z Rotate', type: ZArgType.number }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  IClick:
  {
    syntax: '[%s, %s]',
    description: 'Emulates a click within a specified ZBrush interface item (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[IClick, LIGHT:Intensity, 55, 10]</code>\n\nEmulates a click at 55, 10 position\n\n<code>[IClick, LIGHT:Intensity, 55, 10, 10, 20, 10]</code>\n\nEmulates a click at 10, 10 with a drag to 20, 10 before releasing the mouse button',
    args:
      [{
        name: 'InterfaceItemPath', type: ZArgType.string,
        description: 'Interface item path'
      },
      { name: 'X1', description: 'X1', type: ZArgType.number },
      { name: 'Y1', description: 'Y1', type: ZArgType.number },
      { name: 'X2', description: 'X2', type: ZArgType.number },
      { name: 'Y2', description: 'Y2', type: ZArgType.number },
      { name: 'X3', description: 'X3', type: ZArgType.number },
      { name: 'Y3', description: 'Y3', type: ZArgType.number },
      { name: 'X4', description: 'X4', type: ZArgType.number },
      { name: 'Y4', description: 'Y4', type: ZArgType.number },
      { name: 'X5', description: 'X5', type: ZArgType.number },
      { name: 'Y5', description: 'Y5', type: ZArgType.number },
      { name: 'X6', description: 'X6', type: ZArgType.number },
      { name: 'Y6', description: 'Y6', type: ZArgType.number },
      { name: 'X7', description: 'X7', type: ZArgType.number },
      { name: 'Y7', description: 'Y7', type: ZArgType.number }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  IClose:
  {
    syntax: '[%s, %s]',
    description: 'Closes an interface item.',
    example: 'Example:\n\n<code>[IClose, ZScript:Play]</code>\n\ndeletes the ZScript:Play window',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      },
      {
        name: 'doShowZoomRect', type: ZArgType.number,
        description: 'Show Zoom Rectangles?'
      },
      {
        name: 'doTargetParentWin', type: ZArgType.number,
        description: 'Target parent window?'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IColorSet:
  {
    syntax: '[%s, %s]',
    description: 'Sets the active color to a new value',
    example: 'Example:\n\n<code>[IColorSet, 255, 0, 0]</code>\n\nsets the main interface active color to red',
    args:
      [{ name: 'red', description: 'Red (0-255)', type: ZArgType.number },
      { name: 'green', description: 'Green (0-255)', type: ZArgType.number },
      { name: 'blue', description: 'Blue (0-255)', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IConfig:
  {
    syntax: '[%s, %s]',
    description: 'Sets ZBrush internal version-configuration',
    example: 'Example:\n\n<code>[IConfig, 2.0]</code>\n\nsets the interface to 2.0 configuration\n\n<code>[IConfig, 3.1]</code>\n\nsets the interface to 3.1 configuration',
    args:
      [{
        name: 'version', type: ZArgType.number,
        description: 'ZBrush version-configuration'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IDisable:
  {
    syntax: '[%s, %s]',
    description: 'Disables a ZScript interface item (can only be used for ZScript-generated interface items)',
    example: 'Example:\n\n<code>[IDisable, Zscript:DoIt]</code>\n\nDisables the “DoIt” ZScript interface item\n\n<code>[IDisable, l]</code>\n\nDisables the next interface item in the ZScript window',
    args:
      [{ name: 'path', description: 'Window path', type: ZArgType.string },
      {
        name: 'id', type: ZArgType.number,
        description: 'Window ID or relative windowID(-100<->100)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IEnable:
  {
    syntax: '[%s, %s]',
    description: 'Enables a ZScript interface item (can only be used for ZScript-generated interface items)',
    example: 'Example:\n\n<code>[IEnable, ZScript:DoIt]</code>\n\nEnables the “DoIt” ZScript interface item\n\n<code>[IEnable, 1]</code>\n\nEnables the next interface item in the ZScript window',
    args:
      [{ name: 'path', description: 'Window path', type: ZArgType.string },
      {
        name: 'id', type: ZArgType.number,
        description: 'Window ID or relative windowID(-100<->100)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IExists:
  {
    syntax: '[%s, %s]',
    description: 'Verifies that a specified interface item exists. Output: 1 if item exists, 0 otherwise',
    example: 'Example:\n\n<code>[IExists, TOOL:Sphere3D]</code>\n\nreturns 1 if TOOL:Sphere3D exists, returns 0 otherwise.',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  IFadeIn:
  {
    syntax: '[%s, %s]',
    description: 'Fades in ZBrush window from black.',
    example: 'Example:\n\n<code>[IFadeIn, .35]</code>\n\nfade in from black, speed = 0.35 seconds (*ZBrush 3 only).',
    args:
      [{
        name: 'speed', type: ZArgType.number,
        description: 'Fade in speed in secs. (default:.5 secs)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IFadeOut:
  {
    syntax: '[%s, %s]',
    description: 'Fades out ZBrush window to black.',
    example: 'Example:\n\n<code>[IFadeOut, .35]</code>\n\nfade out to black, speed = 0.35 seconds (*ZBrush 3 only).\n&nbsp;',
    args:
      [{
        name: 'speed', type: ZArgType.number,
        description: 'Fade out speed in secs. (default:.5 secs)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IGet:
  {
    syntax: '[%s, %s]',
    description: 'Returns the current value of a ZBrush or ZScript interface item Output: The item value',
    example: 'Example:\n\n<code>[IGet, Draw:Width]</code>\n\nReturns the current value of the Width slider in the Draw menu',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  IGetFlags:
  {
    syntax: '[%s, %s]',
    description: 'Returns the status flags of the specified interface item Output: The flags',
    example: 'Example:\n\n<code>[IGetFlags, windowID]</code>\n\nReturns the info of specified windowID interface item',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  IGetHotkey:
  {
    syntax: '[%s, %s]',
    description: 'Returns the hotkey of the specified interface item Output: The Hotkey',
    example: 'Example:\n\n<code>[IGetHotkey, windowID]</code>\n\nReturns the hotkey of specified windowID interface item',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  IGetID:
  {
    syntax: '[%s, %s]',
    description: 'Returns the window ID code of the specified interface item Output: The Title',
    example: 'Example:\n\n<code>[IGetID, Tool:LoadTool]</code>\n\nReturns the id code of the Tool:LoadTool interface item',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  IGetInfo:
  {
    syntax: '[%s, %s]',
    description: 'Returns the info (popup info) of the specified interface item Output: The info',
    example: 'Example:\n\n<code>[IGetInfo, windowID]</code>\n\nReturns the info of specified windowID interface item',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  IGetMax:
  {
    syntax: '[%s, %s]',
    description: 'Returns the maximum possible value of a ZBrush or ZScript interface item Output: The item maximum value',
    example: 'Example:\n\n<code>[IGetMax, Draw:Width]</code>\n\nReturns the maximum value of the Width slider in the Draw menu',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  IGetMin:
  {
    syntax: '[%s, %s]',
    description: 'Returns the minimum possible value of a ZBrush or ZScript interface item Output: The item minimum value',
    example: 'Example:\n\n<code>[IGetMin, Draw:Width]</code>\n\nReturns the minimum value of the Width slider in the Draw menu',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  IGetSecondary:
  {
    syntax: '[%s, %s]',
    description: 'Returns the the secondary value of a 2D interface item Output: The item value',
    example: 'Example:\n\n<code>[IGetSeconday, Light:LightPlacement]</code>\n\nReturns the secondary value of the Light:LightPlacement control',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  IGetStatus:
  {
    syntax: '[%s, %s]',
    description: 'Returns the Enabled/Disabled status of a ZBrush or ZScript interface item Output: The item status 0=Disabled 1=Enabled',
    example: 'Example:\n\n<code>[IGetStatus, Transform:Move] </code>\n\nReturns the current status of the Move button in the Transform menu',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  IGetTitle:
  {
    syntax: '[%s, %s]',
    description: 'Returns the title of the specified interface item Output: The Title of the button',
    example: 'Example:\n\n<code>[IGetTitle, windowID]</code>\n\nReturns the title of specified windowID interface item',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      },
      {
        name: 'doReturnFullPath', type: ZArgType.number,
        description: 'Return full path? (0:no nonZero:yes)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  IHeight:
  {
    syntax: '[%s, %s]',
    description: 'Returns the pixel-height of an interface item. Output: The height of the interface item.',
    example: 'Example:\n\n<code>[IHeight, Tool:SimpleBrush]</code>\n\nReturns the height of the “Tool:SimpleBrush” interface item',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  IHide:
  {
    syntax: '[%s, %s]',
    description: 'Hides an interface item.',
    example: 'Example:\n\n<code>[IHide, Draw:Width]</code>\n\nHides the “Draw:Width” window',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      },
      {
        name: 'doShowZoomRect', type: ZArgType.number,
        description: 'Show Zoom Rectangles?'
      },
      {
        name: 'doTargetParentWin', type: ZArgType.number,
        description: 'Target parent window?'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IHPos:
  {
    syntax: '[%s, %s]',
    description: 'Returns the H position of the interface item in Canvas or Global coordinates. Output: The H position of the interface item.',
    example: 'Example:\n\n<code>[IHPos, Draw:Width, 1]</code>\n\nReturns the H position of the “Draw:Width” interface Item in Global coordinates',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      },
      {
        name: 'global', type: ZArgType.number,
        description: 'Global coordinates?(set value to non-zero for global coordinates; default:Canvas coordinates)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  IKeyPress:
  {
    syntax: '[%s, %s]',
    description: 'Simulates a key press',
    example: 'Example:\n\n<code>[IKeyPress, \'x\']</code>\n\nSimulates “x” key press\n\n<code>[IKeyPress, CTRL+\'z\']</code>\n\nSimulates “Ctrl+z” key press',
    args:
      [{
        name: 'key', type: ZArgType.string,
        description: 'The key to press (with an optional CTRL/CMD, ALT/OPT, SHIFT or TAB combination.)'
      },
      {
        name: 'commands', type: ZArgType.commandGroup,
        description: 'Commands group to execute while the key is pressed'
      },
      {
        name: 'hPos', type: ZArgType.number,
        description: 'Optional H cursor position prior to key press'
      },
      {
        name: 'vPos', type: ZArgType.number,
        description: 'Optional V cursor position prior to key press'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  ILock:
  {
    syntax: '[%s, %s]',
    description: 'Locks an interface item.',
    example: 'Example:\n\n<code>[ILock, ZScript:DoIt]</code>\n\nlocks the “DoIt” Zscript window interface item (*ZBrush 3 only).\n\n<code>[ILock, 1]</code>\n\nlocks the next interface item (*ZBrush 3 only).\n&nbsp;',
    args:
      [{ name: 'path', description: 'Window path', type: ZArgType.string },
      {
        name: 'id', type: ZArgType.number,
        description: 'Window ID or relative windowID(-100<->100)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IMaximize:
  {
    syntax: '[%s, %s]',
    description: 'Locates an interface item and (if possible) maximize its size.',
    example: 'Example:\n\n<code>[IMaximize, Tool:, 1]</code>\n\nExpand the TOOL palette and all of its sub palettes',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      },
      {
        name: 'doMaximizeSubPalettes', type: ZArgType.number,
        description: 'Maximize all sub palettes? (0:no, NonZero:yes)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IMinimize:
  {
    syntax: '[%s, %s]',
    description: 'Locates an interface item and (if possible) minimize its size.',
    example: 'Example:\n\n<code>[IMinimize, Tool:, 1]</code>\n\nCloses the TOOL palette and all of its sub palettes',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      },
      {
        name: 'doMinimizeSubPalettes', type: ZArgType.number,
        description: 'Minimize all sub palettes? (0:no, NonZero:yes)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IModGet:
  {
    syntax: '[%s, %s]',
    description: 'Returns the current modifiers binary state of a ZBrush or ZScript interface item Output: The item value',
    example: 'Example:\n\n<code>[IModGet, Tool:Modifiers:Deformation:Rotate]</code>\n\nReturns the current modifiers of the Rotate slider in the Tool menu. Each modifier is identified by its binary value such as lst=1, 2nd=2, 3rd=4, 4th=8',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  IModSet:
  {
    syntax: '[%s, %s]',
    description: 'Sets the modifiers binary value of a ZBrush or a ZScript interface item',
    example: 'Example:\n\n<code>[IModSet, Tool:Modifiers:Deformation:Rotate, 2]</code>\n\nSets the modifiers of the Rotate slider in the Tool menu to 2. Each modifier is identified by its binary value such as lst=1, 2nd=2, 3rd=4, 4th=8',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      },
      { name: 'value', description: 'Value', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IPress:
  {
    syntax: '[%s, %s]',
    description: 'Presses a ZBrush or ZScript interface item (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[IPress, Tool:Cube3D]</code>\n\nPresses the Cube3D button in the Tool menu making the Cube3D the active tool',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  IReset:
  {
    syntax: '[%s, %s]',
    description: 'Interface Reset. Output: Returns the button that the user clicked ( 0=NO, 1=YES ) (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[IReset]</code>\n\nResets the interface to a default state',
    args:
      [{
        name: 'item', type: ZArgType.number,
        description: 'Optional item to reset (default:All). (0:All, 1:Interface, 2:Document, 3:Tools, 4:Lights, 5:Materials, 6:Stencil)'
      },
      {
        name: 'version', type: ZArgType.number,
        description: 'Optional ZBrush version-configuration'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  IsDisabled:
  {
    syntax: '[%s, %s]',
    description: 'Returns 1 if the specified ZBrush or ZScript interface item is currently disabled, returns 0 otherwise Output: The item ‘Disabled’ status (1=Disabled 0=Enabled)',
    example: 'Example:\n\n<code>[IsDisabled, Transform:Move]</code>\n\nReturns 1 if the “Transform:Move” interface item is currently disabled, returns 0 otherwise',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  IsEnabled:
  {
    syntax: '[%s, %s]',
    description: 'Returns 1 if the specified ZBrush or ZScript interface item is currently enabled, returns 0 otherwise Output: The item ‘Enabled’ status (1=Enabled 0=Disabled)',
    example: 'Example:\n\n<code>[IsEnabled, Transform:Move]</code>\n\nReturns 1 if the “Transform:Move” interface item is currently enabled, returns 0 otherwise',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  ISet:
  {
    syntax: '[%s, %s]',
    description: 'Sets a new value to a ZBrush or ZScript interface item',
    example: 'Example:\n\n<code>[ISet, Draw:Width, 50]</code>\n\nSets the Width slider in the Draw menu to 50',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      },
      { name: 'value1', description: 'Value', type: ZArgType.number },
      { name: 'value2', description: 'Secondary value', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  ISetHotkey:
  {
    syntax: '[%s, %s]',
    description: 'Sets the hotkey of the specified interface item',
    example: 'Example:\n\n<code>[ISetHotkey, windowID, \'k\']</code>\n\nSets “k” as the hotkey for the specified windowID interface item',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      },
      {
        name: 'hotkey', type: ZArgType.string,
        description: 'Hotkey(0:no Hotkey)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  ISetMax:
  {
    syntax: '[%s, %s]',
    description: 'Sets the maximum value for an ISlider interface item (can only be used for ZScript-generated interface items)',
    example: 'Example:\n\n<code>[ISetMax, Zscript:Counter, 10]</code>\n\nSets the maximum value of “ZScript:Counter” interface item to 10',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      },
      { name: 'value', description: 'New max value', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  ISetMin:
  {
    syntax: '[%s, %s]',
    description: 'Sets the minimum value for an ISlider interface item (can only be used for ZScript-generated interface items)',
    example: 'Example:\n\n<code>[ISetMin, Zscript:Counter, 10]</code>\n\nSets the minimum value of “ZScript:Counter” interface item to 10',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      },
      { name: 'value', description: 'New min value', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IShow:
  {
    syntax: '[%s, %s]',
    description: 'Locates an interface item and makes it visible.',
    example: 'Example:\n\n<code>[IShow, Draw:Width]</code>\n\nMakes the “Draw:Width” item visible. If necessary the “Draw” palette will be opened',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      },
      {
        name: 'doShowZoomRect', type: ZArgType.number,
        description: 'Show Zoom Rectangles?'
      },
      {
        name: 'doTargetParentWin', type: ZArgType.number,
        description: 'Target parent window?'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IShowActions:
  {
    syntax: '[%s, %s]',
    description: 'Temporarily sets the status of ShowActions',
    example: 'Example:\n\n<code>[IShowActions, 0]</code>\n\nTemporarily disables ShowActions',
    args:
      [{
        name: 'status', type: ZArgType.number,
        description: 'The ShowActions status.(0:Disable ShowActions, Positive value:enable show actions, Negative value:Reset ShowActions)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IsLocked:
  {
    syntax: '[%s, %s]',
    description: 'Returns 1 if the specified ZBrush or ZScript interface item is currently locked, returns 0 otherwiseOutput: The item ‘Locked’ status (1=Locked 0=Unlocked)',
    example: 'Example:\n\n<code>[IsLocked, Transform:Move]</code>\n\nreturns 1 if the “Transform:Move” interface item is locked, returns 0 otherwise (*ZBrush 3 only).',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  IStroke:
  {
    syntax: '[%s, %s]',
    description: 'Emulates a brush stroke within an interface item',
    example: 'Example:\n\n<code>[IStroke, [StrokeLoad, "CurvePoints.txt"]]</code>\n\nLoads the “Curvepoints.txt” file, creates a BrushStroke and applies it to the interface item',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      },
      { name: 'strokeData', description: 'Stroke Data', type: ZArgType.strokeData }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IsUnlocked:
  {
    syntax: '[%s, %s]',
    description: 'Returns 1 if the specified ZBrush or ZScript interface item is currently unlocked, returns 0 otherwiseOutput: The item ‘Unlocked’ status (1=Unlocked 0=locked)',
    example: 'Example:\n\n<code>[IsUnLocked, Transform:Move]</code>\n\nreturns 1 if the “Transform:Move” interface item is unlocked, returns 0 otherwise (*ZBrush 3 only).',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  IToggle:
  {
    syntax: '[%s, %s]',
    description: 'Toggles the state of a ZBrush or ZScript interface item',
    example: 'Example:\n\n<code>[IToggle, Draw:ZAdd]</code>\n\nToggles the ZAdd button in the Draw menu turning ZAdd mode on and off',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IUnlock:
  {
    syntax: '[%s, %s]',
    description: 'Unlocks an interface item',
    example: 'Example:\n\n<code>[IUnLock, ZScript:DoIt]</code>\n\nunlocks the “DoIt” Zscript window interface item (*ZBrush 3 only).\n\n<code>[IUnLock, 1]</code>\n\nunlocks the next interface item (*ZBrush 3 only).',
    args:
      [{
        name: 'id', type: ZArgType.number,
        description: 'Window path, Window ID or relative windowID(-100<->100)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IUnPress:
  {
    syntax: '[%s, %s]',
    description: 'Unpresses a ZBrush or ZScript interface item',
    example: 'Example:\n\n<code>[IUnPress, Layer:Modifiers:w]</code>\n\nUnpresses the W button in the Modifiers submenu of the Layer menu',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IUpdate:
  {
    syntax: '[%s, %s]',
    description: 'Updates the ZBrush interface.',
    example: 'Example:\n\n<code>[IUpdate, 5]</code>\n\nExecute 5 interface-update cycles',
    args:
      [{
        name: 'count', type: ZArgType.number,
        description: 'Repeat count (default:1)'
      },
      {
        name: 'doRedrawUI', type: ZArgType.number,
        description: 'Redraw UI? (default:no, 1:yes)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IVPos:
  {
    syntax: '[%s, %s]',
    description: 'Returns the V position of the interface item in Canvas or Global coordinates. Output: The V position of the interface item.',
    example: 'Example:\n\n<code>[IVPos, Draw:Width, 1]</code>\n\nReturns the V position of the “Draw:Width” interface Item in Global coordinates',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      },
      {
        name: 'global', type: ZArgType.number,
        description: 'Global coordinates? (set value to non-zero for global coordinates, default:Canvas coordinates)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  IWidth:
  {
    syntax: '[%s, %s]',
    description: 'Returns the pixel-width of an interface item. Output: The width of the interface item.',
    example: 'Example:\n\n<code>[IWidth, Tool:SimpleBrush]</code>\n\nwith Returns the width of the “Tool:SimpleBrush” interface item.',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  ZBrushInfo:
  {
    syntax: '[%s, %s]',
    description: 'Returns ZBrush info. Output: Result value',
    example: 'Example:\n\n<code>[ZBrushInfo, 6]</code>\n\nreturns the user’s operating system. Useful if there are different requirements for running the zscript on different operating systems.',
    args:
      [{
        name: 'infoType', type: ZArgType.number,
        description: 'The info type. (0:version number 1:Demo/Beta/Full 2:Runtime seconds 3:Mem use 4:VMem Use 5:Free Mem 6:operating system (0:PC 1:Mac 2:MacOSX) 7:Unique session ID 8:Total RAM)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  ZBrushPriorityGet:
  {
    syntax: '[%s]',
    description: 'Returns the task-priority of ZBrush. Output: The current task-priority',
    example: 'Example:\n\n<code>[ZBrushPriorityGet]</code>\n\nReturns current task-priority.',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  ZBrushPrioritySet:
  {
    syntax: '[%s, %s]',
    description: 'Sets the task-priority of ZBrush.',
    example: 'Example:\n\n<code>[ZBrushPrioritySet, 1]</code>\n\nsets ZBrush priority to above normal.',
    args:
      [{
        name: 'priority', type: ZArgType.number,
        description: 'The priority. -2:Low, -1:BelowNormal, 0:normal, 1:Above Normal, 2:High'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  MouseHPos:
  {
    syntax: '[%s, %s]',
    description: 'Returns the current H position of the mouse in Canvas or Global coordinates. Output: The H position of the mouse',
    example: 'Example:\n\n<code>[MouseHPos]</code>\n\nReturns the current H position of the mouse',
    args:
      [{
        name: 'global', type: ZArgType.number,
        description: 'Global coordinates? (set value to non-zero for global coordinates, default:Canvas coordinates)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MouseLButton:
  {
    syntax: '[%s]',
    description: 'Returns the current state of the left mouse button Output: Returns 1 if mouse button is pressed, returns zero if unpressed',
    example: 'Example:\n\n<code>[MouseLButton]</code>\n\nReturns 1 if mouse button is pressed, returns zero if unpressed',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MouseVPos:
  {
    syntax: '[%s, %s]',
    description: 'Returns the current V position of the mouse in Canvas or Global coordinates. Output: The V position of the mouse',
    example: 'Example:\n\n<code>[MouseVPos]</code>\n\nReturns the current V position of the mouse',
    args:
      [{
        name: 'global', type: ZArgType.number,
        description: 'Global coordinates? (set value to non-zero for global coordinates, default:Canvas coordinates)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  BackColorSet:
  {
    syntax: '[%s, %s]',
    description: 'Sets the pen background color (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[BackColorSet, 255, 255, 0]</code>\n\nsets the pen background color to yellow',
    args:
      [{ name: 'red', description: 'Red', type: ZArgType.number },
      { name: 'green', description: 'Green', type: ZArgType.number },
      { name: 'blue', description: 'Blue', type: ZArgType.number }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  Caption:
  {
    syntax: '[%s, %s]',
    description: 'Displays a text line using the current Caption settings (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[Caption, This Is A Caption]</code>\n\ndisplays “ThisIsACaption” using the Caption settings\n&nbsp;',
    args: [{ name: 'text', description: 'Text', type: ZArgType.string }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  FontSetColor:
  {
    syntax: '[%s, %s]',
    description: 'Sets the color of the zscript window font (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[FontSetColor, 255, 0, 0]</code>\n\nsets zscript window font to red\n\n<code>[FontSetColor, 255, 255, 255]</code>\n\nsets zscript window font to white',
    args:
      [{ name: 'red', description: 'Red', type: ZArgType.number },
      { name: 'green', description: 'Green', type: ZArgType.number },
      { name: 'blue', description: 'Blue', type: ZArgType.number }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  FontSetOpacity:
  {
    syntax: '[%s, %s]',
    description: 'Sets the opacity of the zscript window font (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[FontSetOpacity, .25]</code>\n\nsets zscript window font opacity to 25%\n\n<code>[FontSetOpacity, 1]</code>\n\nsets zscript window font opacity to 100%',
    args: [{ name: 'opacity', description: 'Opacity', type: ZArgType.number }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  FontSetSize:
  {
    syntax: '[%s, %s]',
    description: 'Sets the intensity of the zscript window font (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[FontSetSize, 2]</code>\n\nsets zscript window font size to medium\n&nbsp;',
    args:
      [{
        name: 'size', type: ZArgType.number,
        description: 'Size: 1:Small 2:Med 3:Large'
      }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  FontSetSizeLarge:
  {
    syntax: '[%s]',
    description: 'Sets the size of the zscript window font to large (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[FontSetSizeLarge]</code>\n\nsets zscript window font size to large',
    args: [],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  FontSetSizeMedium:
  {
    syntax: '[%s]',
    description: 'Sets the size of the zscript window font to medium (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[FontSetSizeMedium]</code>\n\nsets zscript window font size to medium',
    args: [],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  FontSetSizeSmall:
  {
    syntax: '[%s]',
    description: 'Sets the size of the zscript window font to small.',
    example: 'Example:\n\n<code>[FontSetSizeSmall]</code>\n\nsets zscript window font size to small',
    args: [],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  FrontColorSet:
  {
    syntax: '[%s, %s]',
    description: 'Sets the main interface color to a new value (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[FrontColorSet, Text, 0, 0, 0]</code>\n\nsets the ZBrush interface main front color to black',
    args:
      [{ name: 'text', description: 'Description Text', type: ZArgType.string },
      { name: 'red', description: 'Red', type: ZArgType.number },
      { name: 'green', description: 'Green', type: ZArgType.number },
      { name: 'blue', description: 'Blue', type: ZArgType.number },
      {
        name: 'isDisabled', type: ZArgType.number,
        description: 'Initially Disabled? (0:Enabled(ByDefault) NonZero:Disabled)'
      }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  HotKeyText:
  {
    syntax: '[%s, %s]',
    description: 'Displays a hot-key for the specified interface item (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[HotKeyText, DOCUMENT:UNDO]</code>\n\ndisplays the hot key of the DOCUMENT:UNDO button using the Hotkey text settings',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.string
  },
  Image:
  {
    syntax: '[%s, %s]',
    description: 'Loads and displays an image (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[Image, TestImage.psd]</code>\n\nLoads and displays TestImage.psd in the zscript window, center-aligned (default) in its original size',
    args:
      [{
        name: 'filename', type: ZArgType.string,
        description: 'FileName (.psd .bmp + .pct for Mac Systems)'
      },
      {
        name: 'alignment', type: ZArgType.number,
        description: 'Align (0:center 1:left 2:right)'
      },
      { name: 'width', description: 'Resized Width', type: ZArgType.number }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  ISetStatus:
  {
    syntax: '[%s, %s]',
    description: 'Enables or Disables a ZScript interface item (can only be used for ZScript-generated interface items).',
    example: 'Example:\n\n<code>[ISetStatus, ZScript:DoIt, 1]</code>\n\nEnables the “DoIt” ZScript interface item\n\n<code>[ISetStatus, ZScript:DoIt, 0]</code>\n\nDisables the “DoIt” ZScript interface item',
    args:
      [{
        name: 'path', type: ZArgType.string,
        description: 'Interface item path'
      },
      {
        name: 'status', type: ZArgType.number,
        description: 'New status ( 0:Disable NotZero:Enable )'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  PageSetWidth:
  {
    syntax: '[%s, %s]',
    description: 'Sets the width of the page (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[PageSetWidth, 300]</code>\n\nsets the zscript window display page width to a maximum of 300 pixels',
    args:
      [{
        name: 'width', type: ZArgType.number,
        description: 'Preferred PageWidth'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  PaintBackground:
  {
    syntax: '[%s, %s]',
    description: 'Paints the background using the current background color (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[PaintBackground, 10, 10, 10]</code>\n\nFills the zscript window background with a dark gray color',
    args:
      [{ name: 'red', description: 'Red', type: ZArgType.number },
      { name: 'green', description: 'Green', type: ZArgType.number },
      { name: 'blue', description: 'Blue', type: ZArgType.number }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  PaintBackSliver:
  {
    syntax: '[%s, %s]',
    description: 'Draws a full page-width rectangle using the current background color (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[PaintBackSliver, 20, 255, 255, 0]</code>\n\nDraws a yellow rectangle in the zscript window, full page-width and 20 pixels tall.',
    args:
      [{ name: 'height', description: 'Height', type: ZArgType.number },
      { name: 'red', description: 'Red', type: ZArgType.number },
      { name: 'green', description: 'Green', type: ZArgType.number },
      { name: 'blue', description: 'Blue', type: ZArgType.number }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  PaintPageBreak:
  {
    syntax: '[%s]',
    description: 'Draws a visual page-break (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[PaintPageBreak]</code>\n\nDraws a default page break in the zscript window, which is a special case of the PaintBackSliver command',
    args: [],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  PaintRect:
  {
    syntax: '[%s, %s]',
    description: 'Draws a rectangle (in the ZScript window) using the current pen color (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[PaintRect, 80, 100]</code>\n\nDraws a rectangle in the zscript window, 80 pixels wide and 100 pixels tall using the current pen color.',
    args:
      [{ name: 'width', description: 'Width', type: ZArgType.number },
      { name: 'height', description: 'Height', type: ZArgType.number },
      { name: 'red', description: 'Red', type: ZArgType.number },
      { name: 'green', description: 'Green', type: ZArgType.number },
      { name: 'blue', description: 'Blue', type: ZArgType.number }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  PaintTextRect:
  {
    syntax: '[%s, %s]',
    description: 'Draws a rectangle with imbedded text (<b>Top Level</b>).',
    example: 'Example:\n\n<code>[PaintTextRect, 200, 100, "This is an Example"]</code>\n\nDraws a rectange in the zscript window, 200 pixels wide and 100 tall with “This is an Example” inside it.',
    args:
      [{ name: 'width', description: 'Width', type: ZArgType.number },
      { name: 'height', description: 'Height', type: ZArgType.number },
      { name: 'text', description: 'Text', type: ZArgType.number }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  PD:
  {
    syntax: '[%s]',
    description: 'Moves the pen position to the beginning of the next line (Same as PenMoveDown).',
    example: 'Example:\n\n<code>[PD]</code>\n\nmoves the pen to the beginning of the next line of the zscript window.',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  PenMove:
  {
    syntax: '[%s, %s]',
    description: 'Moves the pen a relative distance.',
    example: 'Example:\n\n<code>[PenMove, 40, 80]</code>\n\nmoves the pen 40 pixels to the right and 80 pixels down in the zscript window.<br>\nNote: useful for arranging interface items in the zscript window.',
    args:
      [{ name: 'hOffset', description: 'Horizontal Offset', type: ZArgType.number, },
      { name: 'vOffset', description: 'Vertical Offset', type: ZArgType.number, }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  PenMoveCenter:
  {
    syntax: '[%s]',
    description: 'Moves the pen position to the horizontal center of the page .',
    example: 'Example:\n\n<code>[PenMoveCenter]</code>\n\nmoves the pen to the center of the zscript window.',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  PenMoveDown:
  {
    syntax: '[%s]',
    description: 'Moves the pen position to the beginning of the next line .',
    example: 'Example:\n\n<code>[PenMoveDown]</code>\n\nmoves the pen to the beginning of the next line in the zscript window.',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  PenMoveLeft:
  {
    syntax: '[%s]',
    description: 'Moves the pen position to the left side of the page .',
    example: 'Example:\n\n<code>[PenMoveLeft]</code>\n\nmoves the pen to the left of the zscript window.',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  PenMoveRight:
  {
    syntax: '[%s]',
    description: 'Moves the pen position to the right side of the page .',
    example: 'Example:\n\n<code>[PenMoveRight]</code>\n\nmoves the pen to the right of the zscript window.',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  PenSetColor:
  {
    syntax: '[%s, %s]',
    description: 'Sets the pen main color .',
    example: 'Example:\n\n<code>[PenSetColor, 128, 128, 128]</code>\n\nsets pen color to medium gray.',
    args:
      [{ name: 'red', description: 'Red', type: ZArgType.number },
      { name: 'green', description: 'Green', type: ZArgType.number },
      { name: 'blue', description: 'Blue', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  PropertySet:
  {
    syntax: '[%s, %s]',
    description: 'Modifies the setting of Title, SubTitle and Caption text.<br>\nProperty Indexes:<br>\n0 = FontSetSize(1=small, 2=med, 3=large)<br>\n1 = alignments(0=center, 1=L, 2=R)<br>\n2 = Opacity(0-1)<br>\n3 = 0x0000000xffffff<br>\n4 = Border size<br>\n5 = BackColor1 (0x0000000xffffff)<br>\n6 = GradientMode (-1=None, 0=Flat, 1=HGrad, 2=VGrad, 3=DHGrad, 4=DVGrad)<br>\n7 = BackColor2 (0x0000000xffffff)',
    example: 'Example:\n\n<code>[PropertySet, Title, 1, 1]</code>\n\nsets left alignment for Title settings.',
    args:
      [{
        name: 'commandName', type: ZArgType.string,
        description: 'The base command name (Title,SubTitle,Caption)'
      },
      { name: 'index', description: 'Property Index', type: ZArgType.number },
      { name: 'value', description: 'The new Value', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  SectionBegin:
  {
    syntax: '[%s, %s]',
    description: 'Begins a collapsible section .',
    example: 'Example:\n\n<code>[SectionBegin, Chapterl2]</code>\n\nBegins a collapsible section in the zscript window with “Chapterl2” as the Title which will expand/collapse to reveal/hide its contents when pressed.',
    args:
      [{ name: 'title', description: 'Section Title', type: ZArgType.string },
      {
        name: 'state', type: ZArgType.number,
        description: 'Initial state (1:Expanded, 0:Collapsed )'
      },
      { name: 'popupInfo', description: 'Popup Info Text', type: ZArgType.string },
      {
        name: 'commandsWhenExpanding', type: ZArgType.commandGroup,
        description: 'Commands group to execute when expanding to reveal content'
      },
      {
        name: 'commandsWhenCollapsing', type: ZArgType.commandGroup,
        description: 'Commands group to execute when collapsing to hide content'
      },
      {
        name: 'isDisabled', type: ZArgType.number,
        description: 'Initially Disabled? (0:Enabled(ByDefault) NonZero:Disabled)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  SectionEnd:
  {
    syntax: '[%s]',
    description: 'Ends a collapsible section .',
    example: 'Example:\n\n<code>[SectionEnd]</code>\n\nends a previously defined collapsible section in the zscript window.',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  SubTitle:
  {
    syntax: '[%s, %s]',
    description: 'Displays a text line using the current SubTitle settings .',
    example: 'Example:\n\n<code>[SubTitle, "Chapter 23"]</code>\n\ndisplays “Chapter 23” in the zscript window using the SubTitle settings.',
    args: [{ name: 'text', description: 'Text', type: ZArgType.string }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  TextCalcWidth:
  {
    syntax: '[%s, %s]',
    description: 'Calculates the pixel-width of the specified string Output: Width of text in pixels .',
    example: 'Example:\n\n<code>[TextCalcWidth, "Test"]</code>\n\nreturns the width in pixels of the string “Test”.',
    args:
      [{
        name: 'text', type: ZArgType.string,
        description: 'The text to be evaluated'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  Title:
  {
    syntax: '[%s, %s]',
    description: 'Displays a text line using the current Title settings .',
    example: 'Example:\n\n<code>[Title, "Hello"]</code>\n\ndisplays “Hello” in the zscript window using the Title settings.',
    args: [{ name: 'text', description: 'Text', type: ZArgType.string }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  VarDef:
  {
    syntax: '[%s, %s]',
    description: 'Defines a variable (advised Top Level).',
    example: 'Example:\n\n<code>[VarDef, xPos, 1]</code>\n\nDefines a variable with the name “xPos” and initializes it to 1.\n\n<code>[VarDef, xPos(100)]</code>\n\nDefines a list variable named “xPos” with 100 items.<br>\nNote: the list index starts at 0, so xPos(99) is the hundredth item.',
    args:
      [{ name: 'name', description: 'Variable name', type: ZArgType.anyVar },
      {
        name: 'value', type: ZArgType.any,
        description: 'Variable defaultValue'
      }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  VarSet:
  {
    syntax: '[%s, %s]',
    description: 'Sets the value of a named variable (can be placed <b>anywhere</b>).',
    example: 'Example:\n\n<code>[VarSet, xPos, 42]</code>\n\nsets variable “xPos” to 42.\n\n<code>[VarSet, xPos, (Document:Width*.5)]</code>\n\nsets variable “xPos” to Document:Width multiplied by 0.5.',
    args:
      [{ name: 'name', description: 'Variable name', type: ZArgType.anyVar },
      { name: 'value', description: 'New Value', type: ZArgType.any }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  VarListCopy:
  {
    syntax: '[%s, %s]',
    description: 'Copies items from a source list to a destination list',
    example: 'Example:\n\n<code>[VarListCopy, destList, 0, sourceList, 4, 3]</code>\n\ncopies items 4-6 from sourceList to items 0-2 of destList.',
    args:
      [{ name: 'destList', description: 'Destination list', type: ZArgType.anyList },
      {
        name: 'destIndex', type: ZArgType.number,
        description: 'Destination initial index'
      },
      { name: 'sourceList', description: 'Source list', type: ZArgType.anyList },
      {
        name: 'sourceIndex', type: ZArgType.number,
        description: 'Source initial index'
      },
      {
        name: 'nbToCopy', type: ZArgType.number,
        description: 'Number of items to copy.(if omitted or it is 0, then all items will be copied)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  VarLoad:
  {
    syntax: '[%s, %s]',
    description: 'Loads variable/s from a file Output: Number of loaded or verfied values',
    example: 'Example:\n\n<code>[VarLoad, userData, tempFile]</code>\n\nSets variable named “userData” to value/s loaded from the “tempFile.zvr” file.',
    args:
      [{ name: 'name', description: 'Variable name', type: ZArgType.anyVar },
      { name: 'filename', description: 'FileName', type: ZArgType.string },
      {
        name: 'onlyVerify', type: ZArgType.number,
        description: 'Verify only (1:Only Verify that a proper saved variable file exists, 0:(default)Verifies and loads values)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  VarSave:
  {
    syntax: '[%s, %s]',
    description: 'Saves variable value/s to file Output: Number of saved values',
    example: 'Example:\n\n<code>[VarSave, userData, tempFile]</code>\n\nSaves the current value/s of “userData” variable to “tempFile.zvr” file.',
    args:
      [{ name: 'name', description: 'Variable name', type: ZArgType.anyVar },
      { name: 'FileName', description: 'FileName', type: ZArgType.string }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  StrAsk:
  {
    syntax: '[%s, %s]',
    description: 'Asks user to input a string. Output: Returns the text typed by user or an empty string if canceled.',
    example: 'Example:\n\n<code>[StrAsk, "Type text in here", "Please enter a file name"]</code>\n\nDisplays a text input dialog and returns the string typed by user. Note: include both initial string and title.',
    args:
      [{ name: 'initialString', description: 'Initial string', type: ZArgType.string },
      { name: 'title', description: 'Title', type: ZArgType.string }],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  StrExtract:
  {
    syntax: '[%s, %s]',
    description: 'Returns specified portion of the input string Output: The extracted portion of the input string.',
    example: 'Example:\n\n<code>[StrExtract, "abcdefgh", 3, 5]</code>\n\nReturns the “def” portion of the input string.',
    args:
      [{ name: 'input', description: 'Input string', type: ZArgType.string },
      {
        name: 'start', type: ZArgType.number,
        description: 'Start character index (0:left)'
      },
      {
        name: 'end', type: ZArgType.number,
        description: 'End character index (0:left)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  StrFind:
  {
    syntax: '[%s, %s]',
    description: 'Locate a string within a string. Output: Returns the starting index of the 1st string within the 2nd string. returns -1 if not found.',
    example: 'Example:\n\n<code>[StrFind, "Br", "ZBrush"]</code>\n\nSearches for “Br” within “ZBrush” and returns 1.\n\n<code>[StrFind, "Ba", "ZBrush"]</code>\n\nSearches for “Ba” within “ZBrush” and returns -1 (not found).',
    args:
      [{ name: 'strToFind', description: 'Find this string', type: ZArgType.string },
      { name: 'string', description: 'In this string', type: ZArgType.string },
      {
        name: 'start', type: ZArgType.number,
        description: 'Optional start search index (default:0)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  StrFromAsc:
  {
    syntax: '[%s, %s]',
    description: 'Returns the character of the specified Ascii value. Output: The character of the specified Ascii value.',
    example: 'Example:\n\n<code>[StrFromAsc, 65]</code>\n\nreturns “A”.',
    args: [{ name: 'asciiValue', description: 'Input Ascii value', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  StrLength:
  {
    syntax: '[%s, %s]',
    description: 'Returns the number of characters in the input string. Output: Number of characters in the input string.',
    example: 'Example:\n\n<code>[StrLength, "Hello"]</code>\n\nReturns 5 as the number of characters in “Hello”.',
    args: [{ name: 'string', description: 'String to evaluate', type: ZArgType.string }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  StrLower:
  {
    syntax: '[%s, %s]',
    description: 'Returns the lowercase version of the input string. Output: The lowercase version of the input string.',
    example: 'Example:\n\n<code>[StrLower, "ZBrush"]</code>\n\nreturns “zbrush”.',
    args: [{ name: 'string', description: 'Input string', type: ZArgType.string }],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  StrMerge:
  {
    syntax: '[%s, %s]',
    description: 'Combines two (or more) strings into one string. Output: The combined string. Note: result string will not exceed 255 characters in length',
    example: 'Example:\n\n<code>[StrMerge, "Texture number ", "15", " is selected"]</code>\n\nreturns the merged string: “Texture number 15 is selected”.\n\n<code>[StrMerge, ZTool, 27, .ztl]</code>\n\nreturns the merged string: “ZTool27.ztl”.',
    args:
      [{ name: 'str1', description: 'Str 1', type: ZArgType.string },
      { name: 'str2', description: 'Str 2', type: ZArgType.string },
      { name: 'optStr3', description: 'Optional Str 3', type: ZArgType.string },
      { name: 'optStr4', description: 'Optional Str 4', type: ZArgType.string },
      { name: 'optStr5', description: 'Optional Str 5', type: ZArgType.string },
      { name: 'optStr6', description: 'Optional Str 6', type: ZArgType.string },
      { name: 'optStr7', description: 'Optional Str 7', type: ZArgType.string },
      { name: 'optStr8', description: 'Optional Str 8', type: ZArgType.string },
      { name: 'optStr9', description: 'Optional Str 9', type: ZArgType.string },
      { name: 'optStr10', description: 'Optional Str 10', type: ZArgType.string },
      { name: 'optStr11', description: 'Optional Str 11', type: ZArgType.string },
      { name: 'optStr12', description: 'Optional Str 12', type: ZArgType.string }],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  StrToAsc:
  {
    syntax: '[%s, %s]',
    description: 'Returns the Ascii value of a character. Output: The Ascii value of a character.',
    example: 'Example:\n\n<code>[StrToAsc, "ZBrush"]</code>\n\nreturns the Ascii value of “Z”.\n\n<code>[StrToAsc, "ZBrush", 2]</code>\n\nreturns the Ascii value of “r”.',
    args:
      [{ name: 'char', description: 'Input string', type: ZArgType.string },
      {
        name: 'charOffset', type: ZArgType.number,
        description: 'Optional character offset (default:0)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  StrUpper:
  {
    syntax: '[%s, %s]',
    description: 'Returns the uppercase version of the input string. Output: The uppercase version of the input string.',
    example: 'Example:\n\n<code>[StrUpper, "ZBrush"]</code>\n\nreturns “ZBRUSH”.',
    args: [{ name: 'string', description: 'Input string', type: ZArgType.string }],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  FileExecute:
  {
    syntax: '[%s, %s]',
    description: 'Executes the specified plugin file (DLL). Output: Returns the result value which was returned by the executed routine. Returns zero if error',
    example: 'Example:\n\n<code>[FileExecute, PluginTest.dll, ShowMsg, "Hi There"]</code>\n\nExecuted the “ShowMsg” routine of the “PluginTest.dll” plugin',
    args:
      [{
        name: 'filename', type: ZArgType.string,
        description: 'File name including the extension (such as plugin.dll )'
      },
      { name: 'routine', description: 'Routine to call', type: ZArgType.string },
      {
        name: 'text', type: ZArgType.string,
        description: 'Optional text input'
      },
      {
        name: 'number', type: ZArgType.number,
        description: 'Optional number input'
      },
      {
        name: 'memBlockInput', type: ZArgType.memoryBlock,
        description: 'Optional memory block input'
      },
      {
        name: 'memBlockOutput', type: ZArgType.memoryBlock,
        description: 'Optional memory block output'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.any
  },
  FileExists:
  {
    syntax: '[%s, %s]',
    description: 'Check if a specific file exists. Output: Returns 1 if file exists. Returns zero if does not exists',
    example: 'Example:\n\n<code>[FileExists, LargeImage.psd]</code>\n\nReturns 1 if “LargeImage.psd” exists or zero if file does not exist',
    args:
      [{
        name: 'filename', type: ZArgType.string,
        description: 'File name including the extension (such as brush1.ztl )'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  FileGetInfo:
  {
    syntax: '[%s, %s]',
    description: 'Retrieve information about a specified file. Output: returns the requested information or zero if the file not found.<br>\nProperty Indexes:<br>\n1 = file size (in mb)<br>\n2 -7 = Creation date: year, month(1-12), day, hour, minutes, seconds<br>\n8 -13 = Modified date: year, month(1-12), day, hour, minutes, seconds<br>\n14 -19 = Access date: year, month(1-12), day, hour, minutes, seconds',
    example: 'Example:\n\n<code>[FileGetInfo, LargeImage.psd, 1]</code>\n\nReturns the file size of the file named LargeImage.psd',
    args:
      [{
        name: 'filename', type: ZArgType.string,
        description: 'File name including extension (such as brush1.ztl)'
      },
      {
        name: 'infoIndex', type: ZArgType.number,
        description: 'The information requested index.'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  FileNameAdvance:
  {
    syntax: '[%s, %s]',
    description: 'Increments the index value contained within a filename string Output: Updated file Name.',
    example: 'Example:\n\n<code>[FileNameAdvance, "image01.psd"]</code>\n\nAdds 1 to the index of the string, i.e. if filename was image0l.psd it will be modified to image02.psd',
    args:
      [{ name: 'baseFilename', description: 'Base file name', type: ZArgType.string },
      {
        name: 'nbDigits', type: ZArgType.number,
        description: 'Number of digits (0-4) (i.e. 3: 001 )'
      },
      {
        name: 'addCopy', type: ZArgType.number,
        description: 'Add \'Copy\' string?(0:no, NonZero:yes)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  FileNameAsk:
  {
    syntax: '[%s, %s]',
    description: 'Asks user for a file name Output: Result file name or an empty string if user canceled operation (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[FileNameAsk, "DXF(*.dxf)|*.dxf|OBJ(*.obj)|*.obj||", , "Please select a file to load..."]</code>\n\nActivates OpenDialog for a *.dxf or *.obj file to load. Sets the dialog title to “Please select a file to load…”\n\n<code>[FileNameAsk, *.zvr, tempFile]</code>\n\nActivates SaveDialog with default “tempFile.zvr” file name.',
    args:
      [{
        name: 'ext', type: ZArgType.string,
        description: 'Extension list (up to 3 extensions)'
      },
      {
        name: 'defaultFilename', type: ZArgType.string,
        description: 'Default fileName for SaveDialog. Name should be omitted for OpenDialog'
      },
      {
        name: 'title', type: ZArgType.string,
        description: 'Optional dialog title'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  FileNameExtract:
  {
    syntax: '[%s, %s]',
    description: 'Extracts filename components. Output: The extracted filename component/s.',
    example: 'Example:\n\n<code>[FileNameExtract, fullFilePath, 2]</code>\n\nreturns the name component of the input file path\n\n<code>[FileNameExtract, fullFilePath, 2+4]</code>\n\nreturns the name+extension components of the input file path',
    args:
      [{
        name: 'filename', type: ZArgType.string,
        description: 'File name (Full path)'
      },
      {
        name: 'component', type: ZArgType.number,
        description: 'Component specifier (1:path, 2:name, 4:ext)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  FileNameGetLastTyped:
  {
    syntax: '[%s]',
    description: 'Retrieves the latest file name that was typed by the user in a Save/Load action Output: Latest file name that was typed by the user. Returned string will be empty if the user has canceled the action.',
    example: 'Example:\n\n<code>[FileNameGetLastTyped]</code>\n\nReturns a string with the latest typed filename',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  FileNameGetLastUsed:
  {
    syntax: '[%s]',
    description: 'Retrieves the latest file name that was used (by the user or by ZBrush) in a Save/Load action Output: Latest file name that was used. Returned string will be empty if the user has canceled the action.',
    example: 'Example:\n\n<code>[FileNameGetLastUsed]</code>\n\nReturns a string with the latest used filename',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  FileNameMake:
  {
    syntax: '[%s, %s]',
    description: 'Combines a base filename with an index number Output: Combined file name Variable',
    example: 'Example:\n\n<code>[FileNameMake, Image.psd, 12]</code>\n\nCreates a string with “Image12.psd” as its value',
    args:
      [{ name: 'baseFilename', description: 'Base file name', type: ZArgType.string },
      { name: 'index', description: 'Index', type: ZArgType.number },
      {
        name: 'nbOfDigit', type: ZArgType.number,
        description: 'Number of numeric digits to use'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  FileNameResolvePath:
  {
    syntax: '[%s, %s]',
    description: 'Resolves local path to full path Output: Full path.',
    example: 'Example:\n\n<code>[FileNameResolvePath, LargeImage.psd]</code>\n\nreturns the full path of the “LargeImage.psd” file which is located within the same directory as the executing ZScript\n\n<code>[FileNameResolvePath, ]</code>\n\nreturns the full path to the executing ZScript',
    args: [{ name: 'localFilename', description: 'Local File Name', type: ZArgType.string }],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  FileNameSetNext:
  {
    syntax: '[%s, %s]',
    description: 'Pre-sets the file name that will be used in the next Save/Load action',
    example: 'Example:\n\n<code>[FileNameSetNext, LargeImage.psd]</code>\n\nsets “LargeImage.psd” as the next file name that will be used in a Save/Load action\n\n<code>[FileNameSetNext, [FileNameMake, Image.psd, 23, 4]]</code>\n\nsets “Image0023.psd” as the next file name that will be used in a Save/Load action',
    args:
      [{
        name: 'filename', type: ZArgType.string,
        description: 'File name including the extension (such as .psd ). If omitted the stored file name will be cleared.'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  ShellExecute:
  {
    syntax: '[%s, %s]',
    description: 'Executes a Shell command',
    example: 'Example:\n\n<code>[ShellExecute, "open image.psd"]</code>\n\nopens file named “image.psd” in the default PSD editor.\n',
    args: [{ name: 'shellCommand', description: 'the Shell command', type: ZArgType.string }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  Interpolate:
  {
    syntax: '[%s, %s]',
    description: 'Performs time-based interpolation Output: Interpolated value or list',
    example: 'Example:\n\n<code>[Interpolate, 0.25, startx, endx]</code>\n\nreturns an interpolated value (startX*(1.0-0.25))+(endX*0.25)\n\n<code>[Interpolate, 0.25, list1, list2, list3]</code>\n\nreturns an interpolated list calculated as a spline at t=.25',
    args:
      [{
        name: 'time', type: ZArgType.numbers,
        description: 'Time (0:AtStart 0.5:half 1:AtEnd)'
      },
      {
        name: 'value1', type: ZArgType.numbers,
        description: 'Value1 (Num, VarName or ListName)'
      },
      {
        name: 'value2', type: ZArgType.numbers,
        description: 'Value2 (Num, VarName or ListName)'
      },
      {
        name: 'value3', type: ZArgType.numbers,
        description: 'Value3 (Num, VarName or ListName)'
      },
      {
        name: 'value4', type: ZArgType.numbers,
        description: 'Value4 (Num, VarName or ListName)'
      },
      {
        name: 'doAngleInterp', type: ZArgType.number,
        description: 'Angle interpolation (0:no(default), 1:yes )'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.numbers
  },
  RGB:
  {
    syntax: '[%s, %s]',
    description: 'Combines 3 color-components into one RGB value Output: Combined RGB',
    example: 'Example:\n\n<code>[RGB, 20, 40, 80]</code>\n\ncalculates and returns (20*65536 + 40*256 + 80) as a combined RGB value to be used in functions that need combined RGB input.',
    args:
      [{ name: 'red', description: 'Red', type: ZArgType.number },
      { name: 'green', description: 'Green', type: ZArgType.number },
      { name: 'blue', description: 'Blue', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  Val:
  {
    syntax: '[%s, %s]',
    description: 'Evaluates the input and returns a numerical value Output: Value of the named variable',
    example: 'Example:\n\n<code>[Val, (xPos*2)+4]</code>\n\nreturns the value of variable “xPos” multiplied by 2, then added to 4.',
    args: [{ name: 'expression', description: 'expression to evaluate', type: ZArgType.numberVar }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  Var:
  {
    syntax: '[%s, %s]',
    description: 'Gets the value of a named variable Output: Value of the named variable',
    example: 'Example:\n\n<code>[Var, myString]</code>\n\nreturns the value of variable “myString”.<br>\nUseful for clearly specifying when a variable name is being used. The special character <b>#</b> can also be used as in #myString.',
    args: [{ name: 'name', description: 'Variable name', type: ZArgType.anyVar }],
    level: ZScriptLevel.all,
    return: ZArgType.any
  },
  VarAdd:
  {
    syntax: '[%s, %s]',
    description: 'Adds a value to an existing variable',
    example: 'Example:\n\n<code>[VarAdd, xPos, 42]</code>\n\nAdds 42 to the “xPos” variable.\n\n<code>[VarAdd, xPos, (Document:Width*.5)]</code>\n\nAdds the value of Document:Width multiplied by 0.5 to the “xPos” variable.',
    args:
      [{ name: 'name', description: 'Variable name', type: ZArgType.numberVar },
      { name: 'value', description: 'Value To Add', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  VarDec:
  {
    syntax: '[%s, %s]',
    description: 'Subtracts 1 from the value of an existing variable',
    example: 'Example:\n\n<code>[VarDec, loopCounter]</code>\n\nsubtracts 1 from the value of the “loopCounter” variable.',
    args: [{ name: 'name', description: 'Variable name', type: ZArgType.numberVar }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  VarDiv:
  {
    syntax: '[%s, %s]',
    description: 'Divides an existing variable by a value',
    example: 'Example:\n\n<code>[VarDiv, xPos, 42]</code>\n\nDivides xPos variable by 42.\n\n<code>[VarDiv, xPos, (Document:Width*.5)]</code>\n\nDivides xPos variable by the value of Document:Width multiplied by 0.5.',
    args:
      [{ name: 'name', description: 'Variable name', type: ZArgType.string },
      { name: 'value', description: 'Value to Divide By', type: ZArgType.numberVar }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  VarInc:
  {
    syntax: '[%s, %s]',
    description: 'Adds 1 to the value of an existing variable',
    example: 'Example:\n\n<code>[VarInc, loopCounter]</code>\n\nadds 1 to the “loopCounter” variable.',
    args: [{ name: 'name', description: 'Variable name', type: ZArgType.numberVar }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  VarMul:
  {
    syntax: '[%s, %s]',
    description: 'Multiplies an existing variable by a value',
    example: 'Example:\n\n<code>[VarMul, myVar, 5]</code>\n\nMultiplies the “myVar” variable by 5.',
    args:
      [{ name: 'name', description: 'Variable name', type: ZArgType.string },
      { name: 'value', description: 'Value To Multiply', type: ZArgType.numberVar }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  VarSize:
  {
    syntax: '[%s, %s]',
    description: 'Returns the number of items in a variable or in a list Output: The number of items in a list or 1 if it is a simple variable',
    example: 'Example:\n\n<code>[VarSize, list1]</code>\n\nreturns the number of items in list1 variable.',
    args: [{ name: 'name', description: 'Variable name', type: ZArgType.anyVar }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  VarSub:
  {
    syntax: '[%s, %s]',
    description: 'Subtracts a value from an existing variable',
    example: 'Example:\n\n<code>[VarSub, xPos, 42]</code>\n\nSubtracts 42 from the xPos variable.\n\n<code>[VarSub, xPos, (Document:Width*.5)]</code>\n\nSubtracts value of Document:Width multiplied by 0.5 from the “xPos” variable.',
    args:
      [{ name: 'name', description: 'Variable name', type: ZArgType.string },
      { name: 'value', description: 'Value To Subtract', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  Assert:
  {
    syntax: '[%s, %s]',
    description: '(ZScript debugging helper) aborts execution if specified condition is not true',
    example: 'Example:\n\n<code>[Assert, [Var, a]<10, "Something is wrong"]</code>\n\nChecks the value of variable “a” and if it is smaller than 10 then displays a message “Something is wrong” and aborts the execution of the ZScript',
    args:
      [{
        name: 'eval', type: ZArgType.any,
        description: 'True Or False Evaluation'
      },
      {
        name: 'message', type: ZArgType.string,
        description: 'Message that will be shown if the first input is false (zero)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  Delay:
  {
    syntax: '[%s, %s]',
    description: 'Delays execution of ZScript for specified amount of time (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[Delay, 1]</code>\n\nDelays 1 second\n\n<code>[Delay, 0.010]</code>\n\nDelays 10 milliseconds',
    args: [{ name: 'seconds', description: 'Delay (in seconds)', type: ZArgType.number }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  Exit:
  {
    syntax: '[%s]',
    description: 'Aborts execution and exits the current ZScript',
    example: 'Example:\n\n<code>[Exit]</code>\n\nCurrent executing ZScript will be aborted and exited',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  If:
  {
    syntax: '[%s, %s]',
    description: 'Provides conditional execution of a commands group (can be placed <b>anywhere</b>).',
    example: 'Example:\n\n<code>[If, MyVariable < 10, [MessageOK, LessThanl0], [MessageOK, l0orMore]]</code>\n\nChecks the variable “MyVariable” and displays a message “LessThanl0” if the value is less than 10 and displays “l0orMore” otherwise',
    args:
      [{
        name: 'eval', type: ZArgType.any,
        description: 'True Or False Evaluation'
      },
      {
        name: 'commandsIfTrue', type: ZArgType.commandGroup,
        description: 'Commands group to be executed if true (not zero)'
      },
      {
        name: 'commandsIfFalse', type: ZArgType.commandGroup,
        description: 'Commands group to be executed if false (is zero)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  IFreeze:
  {
    syntax: '[%s, %s]',
    description: 'Disables interface updates.',
    example: 'Example:\n\n<code>[IFreeze, ...]</code>\n\nExecute inner commands without updating the interface to increase execution speed',
    args:
      [{
        name: 'commands', type: ZArgType.commandGroup,
        description: 'Commands group to be executed without updating the interface'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  Loop:
  {
    syntax: '[%s, %s]',
    description: 'Repeats execution of the specified commands group',
    example: 'Example:\n\n<code>[Loop, 5, [MessageOK, Hi]]</code>\n\nDisplays a message box 5 times\n\n<code>[Loop, n, [VarSet, a, a+1]]</code>\n\nrepeats the process of adding 1 to variable a, n times',
    args:
      [{ name: 'count', description: 'RepeatCount', type: ZArgType.number },
      { name: 'CommandsGroup', description: 'Commands group', type: ZArgType.commandGroup },
      {
        name: 'countVar', type: ZArgType.varName,
        description: 'Optional loop-counter variable (starts at Zero)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  LoopContinue:
  {
    syntax: '[%s]',
    description: 'Continues execution from the beginning of the current Loop',
    example: 'Example:\n\n<code>[LoopContinue]</code>\n\nloops to the first command within the current Loop',
    args: [],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  LoopExit:
  {
    syntax: '[%s]',
    description: 'Exits the current Loop',
    example: 'Example:\n\n<code>[LoopExit]</code>\n\nExits the current Loop. Useful when searching for a particular value which has been found.',
    args: [],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  RoutineCall:
  {
    syntax: '[%s, %s]',
    description: 'Executes the specified defined routine (can be placed <b>anywhere</b>).',
    example: 'Example:\n\n<code>[RoutineCall, testing]</code>\n\nExecutes a routine named “testing”',
    args:
      [{
        name: 'name', type: ZArgType.routine,
        description: 'Name of the routine to be called'
      },
      { name: 'inputVar01', description: 'Input Var01', type: ZArgType.any },
      { name: 'inputVar02', description: 'Input Var02', type: ZArgType.any },
      { name: 'inputVar03', description: 'Input Var03', type: ZArgType.any },
      { name: 'inputVar04', description: 'Input Var04', type: ZArgType.any },
      { name: 'inputVar05', description: 'Input Var05', type: ZArgType.any },
      { name: 'inputVar06', description: 'Input Var06', type: ZArgType.any },
      { name: 'inputVar07', description: 'Input Var07', type: ZArgType.any },
      { name: 'inputVar08', description: 'Input Var08', type: ZArgType.any },
      { name: 'inputVar09', description: 'Input Var09', type: ZArgType.any },
      { name: 'inputVar10', description: 'Input Var10', type: ZArgType.any }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  RoutineDef:
  {
    syntax: '[%s, %s]',
    description: 'Defines a named commands group (can be placed <b>anywhere</b> but generally <b>Top Level</b>).',
    example: 'Example:\n\n<code>[RoutineDef, testing, [MessageOK, Hi][MessageOK, There]]</code>\n\nCreates a routine named “testing” that when called will display 2 messages to the user (“Hi” and then “There”).',
    args:
      [{ name: 'name', description: 'Name of the routine', type: ZArgType.varName },
      {
        name: 'commands', type: ZArgType.commandGroup,
        description: 'Commands group that will be executed when the routine is called'
      },
      { name: 'inputVar01', description: 'Input Var01', type: ZArgType.varName },
      { name: 'inputVar02', description: 'Input Var02', type: ZArgType.varName },
      { name: 'inputVar03', description: 'Input Var03', type: ZArgType.varName },
      { name: 'inputVar04', description: 'Input Var04', type: ZArgType.varName },
      { name: 'inputVar05', description: 'Input Var05', type: ZArgType.varName },
      { name: 'inputVar06', description: 'Input Var06', type: ZArgType.varName },
      { name: 'inputVar07', description: 'Input Var07', type: ZArgType.varName },
      { name: 'inputVar08', description: 'Input Var08', type: ZArgType.varName },
      { name: 'inputVar09', description: 'Input Var09', type: ZArgType.varName },
      { name: 'inputVar10', description: 'Input Var10', type: ZArgType.varName }],
    level: ZScriptLevel.topLevel,
    return: ZArgType.null
  },
  Sleep:
  {
    syntax: '[%s, %s]',
    description: 'Exists ZScript and be awaken by specified event (can be placed <b>anywhere</b>).',
    example: 'Example:\n\n<code>[Sleep, 100, [Note, "LButton pressed"], 4]</code>\n\nSleeps until awakened when left mouse button clicked.',
    args:
      [{
        name: 'time', type: ZArgType.number,
        description: 'Sleep amount in seconds'
      },
      {
        name: 'commands', type: ZArgType.commandGroup,
        description: 'Commands group to execute when awaken'
      },
      {
        name: 'event', type: ZArgType.number,
        description: 'Optional event (default:1) (1:Timer 2:Mouse Moved 4:LButton down 8:LButton up 16:KeyDown 32:keyUp 64:ModifierKeyDown 128:ModifierKeyUp 256:Startup 512:Shut down 1024:InterfaceItem pressed/unpressed 2048:tool selected 4096:texture selected 8192:alpha selected)'
      },
      {
        name: 'eventCodeVar', type: ZArgType.string,
        description: 'Optional output variable which will contain the event code that has awaken the ZScript'
      },
      {
        name: 'windowIdVar', type: ZArgType.string,
        description: 'Optional output variable which will contain the ID of the window pointed by the mouse'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  SleepAgain:
  {
    syntax: '[%s, %s]',
    description: 'Exists ZScript and continues the Sleep command (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[SleepAgain]</code>\n\nSleeps again.',
    args:
      [{
        name: 'newTime', type: ZArgType.number,
        description: 'Optional new Sleep amount in seconds (default:unchanged)'
      },
      {
        name: 'event', type: ZArgType.number,
        description: 'Optional event (default:unchanged) (1:Timer 2:Mouse Moved 4:LButton down 8:LButton up 16:KeyDown 32:keyUp 64:ModifierKeyDown 256:Startup 512:Shut down 1024:InterfaceItem post pressed/unpressed 2048:tool selected 4096:texture selected 8192 alpha selected)'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  zscriptinsert:
  {
    syntax: '<%s, %s>',
    description: 'Inserts all the text and commands of an entire ZScript file. Not strictly a zscript command, it is the only one that does not have square brackets.',
    example: 'Example:\n\n<code><zscriptinsert, "MyZscript.txt"></code>\n\nInserts the entire contents of <i>MyZScript.txt</i> at that point of the zscript. When the zscript is compiled the inserted zscript is included and no further reference is made to the separate file. Useful in some circumstances but can make code difficult to understand. Also note that commenting out can have unpredictable results.',
    args: [{ name: 'filename', description: 'File Name', type: ZArgType.string }],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  MemCopy:
  {
    syntax: '[%s, %s]',
    description: 'Copies data from one memory block into another. Output: Returns the number of bytes moved. (-1 indicates an error)',
    example: 'Example:\n\n<code>[MemCopy, FromMemBlock, 1000, ToMemBlock, 2000, 10000]</code>\n\nMoves 10, 000 bytes from FromMemBlock offset 1000 to ToMemBlock offset 2000. Returns the mumber of bytes moved.',
    args:
      [{
        name: 'sourceMemBlock', type: ZArgType.memoryBlock,
        description: 'From Mem block identifier'
      },
      { name: 'fromOffset', description: 'From offset', type: ZArgType.number },
      {
        name: 'targetMemBlock', type: ZArgType.memoryBlock,
        description: 'To Mem block identifier'
      },
      { name: 'toOffset', type: ZArgType.number, description: 'To offset' },
      {
        name: "byteCount", type: ZArgType.number,
        description: 'Number of bytes to move (if omitted, max possible number of bytes will be copied)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MemCreate:
  {
    syntax: '[%s, %s]',
    description: 'Creates a new memory block. Output: Returns the size of the new memory block or error code…0=Error -1=Memory already exists -2=Can’t create memory block.',
    example: 'Example:\n\n<code>[MemCreate, myTempData, 1000, 0]</code>\n\nCreates a new data block named myTempData of 1000 bytes in size, clears it to 0 and returns the Mem size. Returns 0 if data block could not be created.',
    args:
      [{
        name: 'name', type: ZArgType.string,
        description: 'Mem block identifier'
      },
      {
        name: 'size', type: ZArgType.number,
        description: 'Mem block requested size'
      },
      {
        name: 'fillValue', type: ZArgType.number,
        description: 'Initial fill? (omitted: noFill - faster to create)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MemCreateFromFile:
  {
    syntax: '[%s, %s]',
    description: 'Creates a new memory block from a disk file. Output: Returns the size of the new memory block or error code…0=Error -1=Memory already exists -2=Can’t create memory block -3=File not found.',
    example: 'Example:\n\n<code>[MemCreateFromFile, myTempData, mesh.obj]</code>\n\nLoads the content of “mesh.obj” file into a new data block named “myTempData” and returns the memory block size. Returns zero if error encountered.',
    args:
      [{
        name: 'name', type: ZArgType.string,
        description: 'Mem block identifier'
      },
      {
        name: 'filename', type: ZArgType.string,
        description: 'File name including the extension (such as brush1.ztl )'
      },
      {
        name: 'offset', type: ZArgType.number,
        description: 'Optional start file offset for partial file read (default:0)'
      },
      {
        name: 'byteCount', type: ZArgType.number,
        description: 'Optional max bytes to read (default:all file)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MemDelete:
  {
    syntax: '[%s, %s]',
    description: 'Deletes a memory block. Output: Returns the size of the deleted memory block. Returns 0 if memory block could not be found.',
    example: 'Example:\n\n<code>[MemDelete, myTempData]</code>\n\nDeletes “myTempData” memory block. Be sure to delete memory blocks when you have finished with them, so as to free memory.',
    args:
      [{
        name: 'memBlock', type: ZArgType.memoryBlock,
        description: 'Data block identifier'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MemGetSize:
  {
    syntax: '[%s, %s]',
    description: 'Returns the size of a memory block (Also useful for determining if a memory block already exists. Output: Returns the size of the memory block. Returns 0 if data block could not be found.',
    example: 'Example:\n\n<code>[MemGetSize, myTempData]</code>\n\nReturns the size of the “myTempData” memory block.',
    args:
      [{
        name: 'memBlock', type: ZArgType.memoryBlock,
        description: 'Memory block identifier'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MemMove:
  {
    syntax: '[%s, %s]',
    description: 'Move data within an existing memory block. Output: Returns the mumber of bytes moved.',
    example: 'Example:\n\n<code>[MemMove, myTempData, 1000, 2000, 10000]</code>\n\nMoves 10, 000 bytes from offset 1000 to start at offset 2000. Returns the number of bytes moved.',
    args:
      [{
        name: 'memBlock', type: ZArgType.memoryBlock,
        description: 'Mem block identifier'
      },
      { name: 'fromOffset', description: 'From offset', type: ZArgType.number },
      { name: 'toOffset', description: 'To offset', type: ZArgType.number },
      {
        name: 'byteCount', type: ZArgType.number,
        description: 'Number of bytes to move'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MemMultiWrite:
  {
    syntax: '[%s, %s]',
    description: 'Write data to a memory block. Output: Returns the number of actual bytes written',
    example: 'Example:\n\n<code>[MemMultiWrite, myTempData, 4, 12, 3, 5, 100]</code>\n\nWrites 5 times the value ‘4’ as “signed short” value into “MyTempData” starting at memory offsets “12”, “112”, “212”, “312” and “412”.',
    args:
      [{
        name: 'memBlock', type: ZArgType.memoryBlock,
        description: 'Mem block identifier'
      },
      { name: 'value', description: 'Value to write', type: ZArgType.number },
      {
        name: 'dataFormat', type: ZArgType.number,
        description: 'Data format (0:omitted:float 1:signed char 2:unsigned char 3:signed short 4:unsigned short 5:signed long 6:unsigned long 7:fixed16 (16.16))'
      },
      {
        name: 'startOffset', type: ZArgType.number,
        description: 'Offset (in bytes) into memory block'
      },
      { name: 'count', description: 'Repeat count', type: ZArgType.number },
      {
        name: 'iterOffset', type: ZArgType.number,
        description: 'Offset (in bytes) to subsequent writes'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MemRead:
  {
    syntax: '[%s, %s]',
    description: 'Reads data from a memory block. Output: Returns the number of actual bytes read',
    example: 'Example:\n\n<code>[MemRead, myTempData, width, 12, 3]</code>\n\nReads the value from “MyTempData” at memory offset “12” as “signed short” and stores in variable “width”.',
    args:
      [{
        name: 'memBlock', type: ZArgType.memoryBlock,
        description: 'Mem block identifier'
      },
      { name: 'outputVar', description: 'Read variable', type: ZArgType.string },
      {
        name: 'dataFormat', type: ZArgType.number,
        description: 'Data format (0:omitted:float 1:signed char 2:unsigned char 3:signed short 4:unsigned short 5:signed long 6:unsigned long 7:fixed16 (16.16))'
      },
      {
        name: 'offset', type: ZArgType.number,
        description: 'Offset (in bytes) into memory block'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MemReadString:
  {
    syntax: '[%s, %s]',
    description: 'Reads a string from a memory block. Output: Returns the number of bytes scanned. (may be larger than the actual bytes read)',
    example: 'Example:\n\n<code>[MemReadString, myTempData, tempText, 12, 1]</code>\n\nReads a string from “myTempData” memory block to variable “tempText”, starting at memory offset l2 and break at the end of the line.',
    args:
      [{
        name: 'memBlock', type: ZArgType.memoryBlock,
        description: 'Mem block identifier'
      },
      {
        name: 'stringVar', type: ZArgType.string,
        description: 'The string variable'
      },
      {
        name: 'offset', type: ZArgType.number,
        description: 'Offset (in bytes) into memory block'
      },
      {
        name: 'doBreakAtLineEnd', type: ZArgType.number,
        description: 'Break at line end? (default:no)'
      },
      {
        name: 'doSkipWhiteSpace', type: ZArgType.number,
        description: 'Skip white space? (default:no)'
      },
      {
        name: 'maxLength', type: ZArgType.number,
        description: 'Max read length 1 - 255(default)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MemResize:
  {
    syntax: '[%s, %s]',
    description: 'Resizes an exsiting memory block. Output: Returns the new size of the memory block. Zero indicates an error.',
    example: 'Example:\n\n<code>[MemResize, myTempData, 1000]</code>\n\nResizes the memory block “myTempData” to 1000 bytes in size. Returns 0 if data block could not be resized.',
    args:
      [{
        name: 'memBlock', type: ZArgType.memoryBlock,
        description: 'Mem block identifier'
      },
      { name: 'size', description: 'New size', type: ZArgType.number },
      {
        name: 'fillValue', type: ZArgType.number,
        description: 'Optional byte value to fill the newly added memory? (omitted:no)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MemSaveToFile:
  {
    syntax: '[%s, %s]',
    description: 'Saves an exisiting memory block to a disk file. Output: Returns the size of the new memory block or error code…0=Error -1=Memory does not exist -2=File already exists -3=File write error.',
    example: 'Example:\n\n<code>[MemSaveToFile, myTempData, "mesh.obj"]</code>\n\nSaves the content of “myTempData” memory block into a disk file named “mesh.obj” and returns the number of written bytes. Doesn’t overwrite as existing file of the same name. Returns zero if error encountered.\n\n<code>[MemSaveToFile, myTempData, "mesh.obj",1]</code>\n\nSaves the content of “myTempData” memory block into a disk file named “mesh.obj” and returns the number of written bytes. Overwrites an existing file of the same name. Returns zero if error encountered.',
    args:
      [{
        name: 'memBlock', type: ZArgType.memoryBlock,
        description: 'Mem block identifier'
      },
      {
        name: 'filename', type: ZArgType.string,
        description: 'File name including the extension (such as brush1.ztl )'
      },
      {
        name: 'doOverwrite', type: ZArgType.number,
        description: 'Overwrite if exists? Set to a value (including 0) to save the file even if an identically named file already exists on disk - Default (no argument): do not overwrite'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MemWrite:
  {
    syntax: '[%s, %s]',
    description: 'Write data to a memory block. Output: Returns the number of actual bytes written',
    example: 'Example:\n\n<code>[MemWrite, myTempData, 4, 12, 3]</code>\n\nWrites the value “4” as “signed short” value into “MyTempData” starting at memory offsets “12”.',
    args:
      [{
        name: 'memBlock', type: ZArgType.memoryBlock,
        description: 'Mem block identifier'
      },
      { name: 'value', description: 'Value to write', type: ZArgType.number },
      {
        name: 'dataFormat', type: ZArgType.number,
        description: 'Data format (0:omitted:float 1:signed char 2:unsigned char 3:signed short 4:unsigned short 5:signed long 6:unsigned long 7:fixed16 (16.16))'
      },
      {
        name: 'offset', type: ZArgType.number,
        description: 'Offset (in bytes) into memory block'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MemWriteString:
  {
    syntax: '[%s, %s]',
    description: 'Writes a string into a memory block. Output: Returns the number of bytes written. (including the terminating zero)',
    example: 'Example:\n\n<code>[MemWriteString, myTempData, "Hello There", 12]</code>\n\nWrites “Hello There” string starting at memory offset l2 and break at the end of the line.',
    args:
      [{
        name: 'memBlock', type: ZArgType.memoryBlock,
        description: 'Mem block identifier'
      },
      { name: 'string', description: 'The string', type: ZArgType.string },
      {
        name: 'offset', type: ZArgType.number,
        description: 'Offset (in bytes) into memory block'
      },
      {
        name: 'doWriteEndChar', type: ZArgType.number,
        description: 'Write terminating zero char (if omitted:yes)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MTransformGet:
  {
    syntax: '[%s, %s]',
    description: 'Gets current transformation values into an existing memory block (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[MTransformGet, MyDataBlock, 1]</code>\n\nstore the current 9 transformation values into “MyDataBlock” memory block starting at variable index 1.',
    args:
      [{
        name: 'memBlock', type: ZArgType.memoryBlock,
        description: 'Mem block identifier'
      },
      {
        name: 'index', type: ZArgType.number,
        description: 'Optional variable index (default:0)'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  MTransformSet:
  {
    syntax: '[%s, %s]',
    description: 'Sets new transformation values from an existing memory block (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[MTransformSet, MyDataBlock, 1]</code>\n\nSets all 9 transformation values from “MyDataBlock” memory block starting at variable index 1',
    args:
      [{
        name: 'memBlock', type: ZArgType.memoryBlock,
        description: 'Mem block identifier'
      },
      {
        name: 'index', type: ZArgType.number,
        description: 'Optional variable index (default:0)'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  MVarDef:
  {
    syntax: '[%s, %s]',
    description: 'Defines a new variables memory block. Output: Returns the variables count of the new memory block or error code…0=Error -1=Memory already exists -2=Can’t create memory block.',
    example: 'Example:\n\n<code>[MVarDef, myTempData, 1000, 0]</code>\n\nCreates a new data block named myTempData of 1000 variables in size, clear it to 0 and return the variables count. Returns 0 if data block could not be created.',
    args:
      [{
        name: 'name', type: ZArgType.string,
        description: 'Mem block identifier'
      },
      {
        name: 'size', type: ZArgType.number,
        description: 'Mem block variables count'
      },
      {
        name: 'fillValue', type: ZArgType.number,
        description: 'Initial fill? (omitted:noFill - faster to create)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MVarGet:
  {
    syntax: '[%s, %s]',
    description: 'Reads a float value from a memory block. Output: Returns the float value.',
    example: 'Example:\n\n<code>[MVarGet, myTempData, 1]</code>\n\nReturns the 2nd float value from the “MyTempData” memory block.',
    args:
      [{
        name: 'memBlock', type: ZArgType.varMemoryBlock,
        description: 'Mem block identifier'
      },
      {
        name: 'index', type: ZArgType.number,
        description: 'Variable index (0 based)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MVarSet:
  {
    syntax: '[%s, %s]',
    description: 'Writes a float value to a memory block. Output: Returns the old value of the variable.',
    example: 'Example:\n\n<code>[MVarSet, myTempData, 1, 4]</code>\n\nSets the 2nd float value of the “MyTempData” memory block to 4.',
    args:
      [{
        name: 'memBlock', type: ZArgType.varMemoryBlock,
        description: 'Mem block identifier'
      },
      {
        name: 'index', type: ZArgType.number,
        description: 'Variable index (0 based)'
      },
      { name: 'value', description: 'The value to write', type: ZArgType.number }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  SoundPlay:
  {
    syntax: '[%s, %s]',
    description: 'Plays the sounds loaded into a specified memory block. Output: Returns the zero if command executed successfully (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[SoundPlay, SayHello]</code>\n\nPlays the “SayHello” memory block.',
    args:
      [{
        name: 'memBlock', type: ZArgType.memoryBlock,
        description: 'Mem block identifier'
      },
      {
        name: 'playMode', type: ZArgType.number,
        description: 'Optional play mode (0:Play once, don\'t wait for completion (default); 1:Play once, wait for completion; 2:Play loop, don\'t wait for completion)'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  SoundStop:
  {
    syntax: '[%s, %s]',
    description: 'Stops the currently specified sound. Output: Returns the zero if command executed successfully (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[Soundstop, SayHello]</code>\n\nStops playback of the “SayHello” memory block.',
    args:
      [{
        name: 'memBlock', type: ZArgType.memoryBlock,
        description: 'Mem block identifier'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  TransposeGet:
  {
    syntax: '[%s, %s]',
    description: 'Gets current Transpose Action Line values (<strong>Sub-Level</strong> only).',
    example: 'Example:\n\n<code>[TransposeGet, xPos, yPos, zPos]</code>\n\nSets the variables xPos, yPos and zPos to the 3D position values of the start of the transpose action line.',
    args:
      [{ name: "sXpos", description: "Start xPos", type: ZArgType.number },
      { name: "sYpos", description: "Start yPos", type: ZArgType.number },
      { name: "sZpos", description: "Start zPos", type: ZArgType.number },
      { name: "eXpos", description: "End xPos", type: ZArgType.number },
      { name: "eYpos", description: "End yPos", type: ZArgType.number },
      { name: "eZpos", description: "End zPos", type: ZArgType.number },
      { name: "lineLength", description: "Action Line Length", type: ZArgType.number },
      { name: "xRedAxis", description: "x of red axis", type: ZArgType.number },
      { name: "yRedAxis", description: "y of red axis", type: ZArgType.number },
      { name: "zRedAxis", description: "z of red axis", type: ZArgType.number },
      { name: "xGreenAxis", description: "x of green axis", type: ZArgType.number },
      { name: "yGreenAxis", description: "y of green axis", type: ZArgType.number },
      { name: "zGreenAxis", description: "z of green axis", type: ZArgType.number },
      { name: "xBlueAxis", description: "x of blue axis", type: ZArgType.number },
      { name: "yBlueAxis", description: "y of blue axis", type: ZArgType.number },
      { name: "zBlueAxis", description: "z of blue axis", type: ZArgType.number }
      ],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  TransposeIsShown:
  {
    syntax: '[%s]',
    description: 'Returns status of transpose line. Output: Returns 1 if shown, zero if not (<strong>Sub-Level</strong> only).',
    example: '',
    args: [],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  TransposeSet:
  {
    syntax: '[%s, %s]',
    description: "Sets current Transpose Action Line values (<strong>Sub-Level</strong> only)",
    example: "Example:\n\n<code>[TransposeSet, xPos, yPos, zPos]</code>\n\nSets the start of the transpose action line 3D position to xPos, yPos, zPos.",
    args:
      [{ name: "sXpos", description: "Start xPos", type: ZArgType.number },
      { name: "sYpos", description: "Start yPos", type: ZArgType.number },
      { name: "sZpos", description: "Start zPos", type: ZArgType.number },
      { name: "eXpos", description: "End xPos", type: ZArgType.number },
      { name: "eYpos", description: "End yPos", type: ZArgType.number },
      { name: "eZpos", description: "End zPos", type: ZArgType.number },
      { name: "lineLength", description: "Action Line Length", type: ZArgType.number },
      { name: "xRedAxis", description: "x of red axis", type: ZArgType.number },
      { name: "yRedAxis", description: "y of red axis", type: ZArgType.number },
      { name: "zRedAxis", description: "z of red axis", type: ZArgType.number },
      { name: "xGreenAxis", description: "x of green axis", type: ZArgType.number },
      { name: "yGreenAxis", description: "y of green axis", type: ZArgType.number },
      { name: "zGreenAxis", description: "z of green axis", type: ZArgType.number },
      { name: "xBlueAxis", description: "x of blue axis", type: ZArgType.number },
      { name: "yBlueAxis", description: "y of blue axis", type: ZArgType.number },
      { name: "zBlueAxis", description: "z of blue axis", type: ZArgType.number },
      ],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  CurveAddPoint:
  {
    syntax: '[%s, %s]',
    description: 'Add a new point to the specified curve (<strong>Sub-Level</strong> only). Output: Returns the point index (zero based) or -1 if failed.',
    example: 'Example:\n\n<code>[CurveAddPoint, 1,1,2,3]</code>\n\nAppends a new point (x=1,y=2,z=3) to the second curve in the list.',
    args:
      [{
        name: 'index', type: ZArgType.number,
        description: 'Curve Index (zero based)'
      },
      { name: 'xPos', description: 'x position', type: ZArgType.number },
      { name: 'yPos', description: 'y position', type: ZArgType.number },
      { name: 'zPos', description: 'z position', type: ZArgType.number }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  CurvesCreateMesh:
  {
    syntax: '[%s, %s]',
    description: 'Creates a mesh from the current curves (<strong>Sub-Level</strong> only). Output: Returns the number of points in the new mesh. zero=error, -1=file exists.',
    example: 'Example:\n\n<code>[CurvesCreateMesh, myCurveMesh, 1, 10]</code>\n\nCreates a mesh of 10 units thickness from the current curves and appends it as a new subtool named ‘myCurveMesh’.',
    args:
      [{ name: 'name', description: 'Name', type: ZArgType.string },
      {
        name: 'action', type: ZArgType.number,
        description: ' Action (0(default): Append mesh to the active mesh, 1: Add as a new subtool, 2: Export OBJ file if file does not exist, 3: Export Obj file and overwrite if exists)'
      },
      {
        name: 'thickness', type: ZArgType.number,
        description: ' Thickness (zero: single side mesh)'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  CurvesDelete:
  {
    syntax: '[%s, %s]',
    description: 'Deletes named curves list (Sub-Level only).',
    example: 'Example:\n\n<code>[CurvesDelete, myCurves]</code>\n\nDeletes curves list named ‘myCurves’.',
    args: [{ name: 'name', description: 'Name', type: ZArgType.string }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  CurvesNewCurve:
  {
    syntax: '[%s]',
    description: 'Creates a new curve in the current curves list (<strong>Sub-Level</strong> only). Output: Returns the curve index (zero based) or -1 if failed.',
    example: 'Example:\n\n<code>[CurvesNewCurve]</code>\n\nCreates a new curve in the current curves list.',
    args: [],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  CurvesNew:
  {
    syntax: '[%s, %s]',
    description: 'Creates a new curves list (<strong>Sub-Level </strong>only).',
    example: 'Example:\n\n<code>[CurvesNew, myCurves]</code>\n\nCreates a new curve list named ‘myCurves’.',
    args: [{ name: 'name', description: 'Name', type: ZArgType.string }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  CurvesToUI:
  {
    syntax: '[%s]',
    description: 'Copy the ZScript curves to UI (<strong>Sub-Level</strong> only). Output: Returns zero if OK or -1 if failed.',
    example: 'Example:\n\n<code>[CurvesToUI]</code>\n\nCopies the current zscript curves to the UI so they are visible to the user.',
    args: [],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  DispMapCreate:
  {
    syntax: '[%s, %s]',
    description: 'Creates DisplacementMap Output: Returns zero if executed successfully. Any other value indicates an error',
    example: 'Example:\n\n<code>[DispMapCreate, 1024, 1024, 1, 7, 2]</code>\n\nCreates a DispMap, image size 1024×124, smooth=yes, border=7, UVTi1e index=2',
    args:
      [{ name: 'imgWidth', description: 'Image Width', type: ZArgType.number },
      { name: 'imgHeight', description: 'Image Height', type: ZArgType.number, },
      {
        name: 'smooth', type: ZArgType.number,
        description: 'Smooth (default:yes)'
      },
      {
        name: 'subPoly', type: ZArgType.number,
        description: 'SubPoly (default:0)'
      },
      { name: 'border', description: 'Border (default:8)', type: ZArgType.number },
      {
        name: 'uvTileIndex', type: ZArgType.number,
        description: 'UVTile index (default:ignores UV tiles)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  Mesh3DGet:
  {
    syntax: '[%s, %s]',
    description: 'Gets information about the currently active Mesh3D tool. Output: Returns zero if command executed successfully, any other value indicates and error (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[Mesh3DGet, 0]</code>\n\nreturns the number of vertices.',
    args:
      [{
        name: 'property', type: ZArgType.number,
        description: 'Property: (0:PointsCount 1:FacesCount 2:XYZ bounds 3:UVBounds 4:1stUVTile 5:NxtUVTile 6:PolysInUVTile 7:3DAreaOfUVTile 8:Full3DMeshArea)'
      },
      {
        name: 'index', type: ZArgType.number,
        description: 'Optional input 1 Vertix/Face/Group/UVTile H index (0 based)'
      },
      { name: 'optIn2', description: 'Optional input 2', type: ZArgType.number },
      {
        name: 'optOut1', type: ZArgType.number,
        description: 'Optional output variable1'
      },
      {
        name: 'optOut2', type: ZArgType.number,
        description: 'Optional output variable2'
      },
      {
        name: 'optOut3', type: ZArgType.number,
        description: 'Optional output variable3'
      },
      {
        name: 'optOut4', type: ZArgType.number,
        description: 'Optional output variable4'
      },
      {
        name: 'optOut5', type: ZArgType.number,
        description: 'Optional output variable5'
      },
      {
        name: 'optOut6', type: ZArgType.number,
        description: 'Optional output variable6'
      },
      {
        name: 'optOut7', type: ZArgType.number,
        description: 'Optional output variable7'
      },
      {
        name: 'optOut8', type: ZArgType.number,
        description: 'Optional output variable8'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  NormalMapCreate:
  {
    syntax: '[%s, %s]',
    description: 'Creates NormalMap Output: Returns zero if executed successfully. Any other value indicates an error',
    example: 'Example:\n\n<code>[NormalMapCreate, 1024, 1024, 1, 7, 2]</code>\n\nCreates a Normal Map, image size 1024×124, smooth=yes, border=7, UVTi1e index=2.',
    args:
      [{ name: 'imgWidth', description: 'Image Width', type: ZArgType.number },
      { name: 'imgHeight', description: 'Image Height', type: ZArgType.number },
      {
        name: 'isSmooth', type: ZArgType.number,
        description: 'Smooth (default:yes)'
      },
      {
        name: 'subPoly', type: ZArgType.number,
        description: 'SubPoly (default:0)'
      },
      { name: 'border', description: 'Border (default:8)', type: ZArgType.number },
      {
        name: 'uvTileIndex', type: ZArgType.number,
        description: 'UVTile index (default:ignores UV tiles)'
      },
      {
        name: 'isLocal', type: ZArgType.number,
        description: 'Local(tangent) coordinates? (default:world coordinates)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  ZSphereAdd:
  {
    syntax: '[%s, %s]',
    description: 'Adds new ZSphere to the currently active ZSpheres tool Output: Returns the the index of the new ZSphere or -1 if command failed (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[ZSphereAdd, 0, .5, 1, .1, 0]</code>\n\nAdds a ZSphere located at (0, 0.5, 1) with 0.1 radius and ZSphere #0 as the parent.',
    args:
      [{ name: 'xPos', description: 'xPos', type: ZArgType.number },
      { name: 'yPos', description: 'yPos', type: ZArgType.number },
      { name: 'zPos', description: 'zPos', type: ZArgType.number },
      { name: 'radius', description: 'Radius', type: ZArgType.number },
      {
        name: 'parentIndex', type: ZArgType.number,
        description: 'Parent index (0 based)'
      },
      {
        name: 'color', type: ZArgType.number,
        description: 'Optional Color 0x000000<->0xffffff (RED*65536)+(GREEN*256)+BLUE'
      },
      {
        name: 'mask', type: ZArgType.number,
        description: 'Optional Mask (0:unmasked to 255:fully masked)'
      },
      { name: 'timeStamp', description: 'Optional TimeStamp', type: ZArgType.number },
      {
        name: 'flag', type: ZArgType.number,
        description: 'Optional Flags (0:default, 1:invisible link to parent)'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  ZSphereDel:
  {
    syntax: '[%s, %s]',
    description: 'Deletes a ZSphere from the currently active ZSpheres tool Output: Returns zero if command executed successfully (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[ZSphereDel, 2]</code>\n\nDeletes the 3rd ZSphere.',
    args:
      [{
        name: 'index', type: ZArgType.number,
        description: 'ZSphere index (Sphere 0 can\'t be deleted)'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  ZSphereEdit:
  {
    syntax: '[%s, %s]',
    description: 'Prepares the currently active ZSpheres tool for ZScript editing session. Output: Returns the zero if command executed successfully.',
    example: 'Example:\n\n<code>[ZSphereEdit, ...commands...]</code>\n\nbegins ZSphere edit session and executes …commands…',
    args:
      [{
        name: 'commands', type: ZArgType.commandGroup,
        description: 'ZSpheres editing commands'
      },
      {
        name: 'doStoreUndo', type: ZArgType.number,
        description: 'Store undo? (0:Skip Undo, 1:Store undo)'
      }],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  ZSphereGet:
  {
    syntax: '[%s, %s]',
    description: 'Gets information about the currently active ZSpheres tool. (Must be placed within ZSphereEdit command) Output: Returns the value of the specified property (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[ZSphereGet, 0]</code>\n\nreturns the number of ZSpheres.\n\n<code>[ZSphereGet, 2, 1]</code>\n\nreturns the Y position of the 2nd ZSphere.',
    args:
      [{
        name: 'propertyIndex', type: ZArgType.number,
        description: 'Property: 0:ZSpheres count, 1:xPos, 2:yPos, 3:zPos, 4:radius, 5:color, 6:mask, 7:ParentIndex(-1:none), 8:LastClickedIndex(-1:none), 9:TimeStamp, 10:ChildsCount, 11:ChildIndex (2nd index), 12:TimeStampCount, 13:TimeStampIndex, 14:flags, 15:Twist Angle, 16:Membrane, 17:X Res, 18:Y Res, 19:Z Res'
      },
      {
        name: 'zSphereIndex', type: ZArgType.number,
        description: 'Optional ZSphere index (0 based)'
      },
      {
        name: 'index2', type: ZArgType.number,
        description: 'Optional 2nd index (0 based)'
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  ZSphereSet:
  {
    syntax: '[%s, %s]',
    description: 'Modifies a property of the currently active ZSpheres tool. (Must be placed within ZSphereEdit command) Output: Returns zero if command executed successfully (<b>Sub-Level</b> only).',
    example: 'Example:\n\n<code>[ZSphereSet, 4, 6, .5]</code>\n\nsets the radius of ZSphere index 6 to 0.5.',
    args:
      [{
        name: 'propertyIndex', type: ZArgType.number,
        description: 'Property: 0:unused, 1:xPos, 2:yPos, 3:zPos, 4:radius, 5:color, 6:mask, 7:ParentIndex, 8:unused, 9:TimeStamp, 10:unused, 11:unused, 12:unused, 13:unused, 14:flags, 15:Twist Angle, 16:Membrane, 17:X Res, 18:Y Res, 19:Z Res, 20:XYZ Res, 21:UserValue'
      },
      {
        name: 'zSphereIndex', type: ZArgType.number,
        description: 'ZSphere index (0 based)'
      },
      { name: 'value', description: 'New property value', type: ZArgType.number }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  TLDeleteKeyFrame:
  {
    syntax: '[%s, %s]',
    description:
      'Delete specified key frame index of the active track. Output: Returns the number of available key frames. (<b>Sub Level</b> only)',
    example:
      'Example:\n\n<code>[TLDeleteKeyFrame,1]</code>\n\nDelete the 2nd key frame.\n',
    args:
      [{
        name: 'KeyFrameIndex',
        description: 'Key Frame Index',
        type: ZArgType.number
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  TLGetActiveTrackIndex:
  {
    syntax: '[%s]',
    description:
      'Returns the index of the active track<br>\nOutput: Returns the current active track index -1=None (<b>Sub Level</b> only).',
    example:
      'Example:\n\n<code>[TLGetActiveTrackIndex]</code>\n\nReturns the current active track index.',
    args: [],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  TLGetKeyFramesCount:
  {
    syntax: '[%s]',
    description:
      'Returns the total number of key frames in the active track. Output: Returns the number of key frames in the active track 0=None (<b>Sub Level</b> only).',
    example:
      'Example:\n\n<code>[TLGetKeyFramesCount]</code>\n\nReturns the current number of key frames.',
    args: [],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  TLGetKeyFrameTime:
  {
    syntax: '[%s, %s]',
    description:
      'Get the time of the specified key frame index of the active track Output: Returns the time of the selected key frame or -1 if error. (<b>Sub Level</b> only)',
    example:
      'Example:\n\n<code>[TLDeleteKeyFrame,1]</code>\n\nGet the time of the 2nd key frame.\n',
    args:
      [{
        name: 'KeyFrameIndex',
        description: 'Key Frame Index',
        type: ZArgType.number
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  TLGetTime:
  {
    syntax: '[%s]',
    description:
      'Returns the current TimeLine knob position in  0.0 to 1.0 range Output: Returns the current TimeLine knob time 0=start, 1=end (<b>Sub Level</b> only).',
    example:
      'Example:\n\n<code>[TLGetTime]</code>\n\nReturns the current TimeLine knob time.',
    args: [],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  TLGotoKeyFrameTime:
  {
    syntax: '[%s, %s]',
    description:
      'Move TimeLine knob position to specified key frame index of the active track. Output: Returns the time of the selected key frame or -1 if error. (<b>Sub Level</b> only)',
    example:
      'Example:\n\n<code>[TLGotoKeyFrameTime,1]</code>\n\nMove TimeLine knob position to 2nd key frame.\n',
    args:
      [{
        name: 'KeyFrameIndex',
        description: 'Key Frame Index',
        type: ZArgType.number
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  TLGotoTime:
  {
    syntax: '[%s, %s]',
    description:
      'Sets the current TimeLine knob position in  0.0 to 1.0 range. Output: Returns zero if OK, -1 if error. (<b>Sub Level</b> only)',
    example:
      'Example:\n\n<code>[TLGotoTime,0.5]</code>\n\nMove TimeLine knob mid position.\n',
    args:
      [{
        name: 'Time',
        description: 'Time 0.0 to 1.0 range',
        type: ZArgType.number
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  TLNewKeyFrame:
  {
    syntax: '[%s, %s]',
    description:
      'Create a new key frame in the active track Output: Returns the new key frame index or -1 if error. (<b>Sub Level</b> only)',
    example:
      'Example:\n\n<code>[TLNewKeyFrame,0.5]</code>\n\nCreate a new key frame at mid position.\n',
    args:
      [{
        name: 'Time',
        description: 'Optional time (if omited then use current time)',
        type: ZArgType.number
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  TLSetActiveTrackIndex:
  {
    syntax: '[%s, %s]',
    description:
      'Sets the active track index. Output: Returns zero if OK, -1 if error. (<b>Sub Level</b> only)',
    example:
      'Example:\n\n<code>[TLSetActiveTrackIndex,0]</code>\n\nActivates the main Camera track.\n',
    args:
      [{
        name: 'TrackIndex',
        description: 'Track Index 0=main track',
        type: ZArgType.number
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  TLSetKeyFrameTime:
  {
    syntax: '[%s, %s]',
    description:
      'Set the time of the specified key frame index of the active track<br>\nOutput: Returns the new key frame index or -1 if error.(<b>Sub Level</b> only)',
    example:
      'Example:\n\n<code>[TLSetKeyFrameTime, 1,0.5]</code>\n\nSet the time of the second key frame to 0.5 (the mid position).',
    args:
      [{
        name: 'KeyFrameIndex',
        description: 'Key Frame Index',
        type: ZArgType.number
      },
      {
        name: 'Time',
        description: 'Time 0.0 to 1.0 range',
        type: ZArgType.number
      }],
    level: ZScriptLevel.subLevel,
    return: ZArgType.null
  },
  GetActiveToolPath: {
    syntax: '[%s]',
    description: 'Returns the full path of the active tool (<strong>Sub-Level</strong> only). Output: The path of the active tool.',
    example: '',
    args: [],
    level: ZScriptLevel.subLevel,
    return: ZArgType.string
  },
  SubToolSelect: {
    syntax: '[%s, %s]',
    description: 'Selects the subtool at the specified subtool index (<strong>Sub-Level</strong> only). Output: Returns zero if OK, -1 if error.',
    example: 'Example:\n\n<code>[SubToolSelect, 4]</code>\n\nSelects the 5th subtool.',
    args: [
      {
        name: 'SubtoolIndex',
        description: 'Subtool Index (zero based).',
        type: ZArgType.number
      }
    ],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  SubToolLocate: {
    syntax: '[%s, %s]',
    description: 'Locates a subtool by the specified unique ID (<strong>Sub-Level</strong> only). Output: Returns the index of the located subtool or -1 if error.',
    example: '',
    args: [
      {
        name: 'UniqueSubtoolID',
        description: 'Unique Subtool ID',
        type: ZArgType.number
      }
    ],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  SubToolGetID: {
    syntax: '[%s, %s]',
    description: 'Returns the unique subtool ID (<strong>Sub-Level</strong> only). Output: Returns the unique subtool ID or zero if error. Note that duplicates of meshes have the same ID.',
    example: 'Example:\n' +
      '\n' +
      '<code>[SubToolGetID, 4]</code>\n' +
      '\n' +
      'Returns the unique ID for the 5th subtool.',
    args: [
      {
        name: 'SubtoolIndex',
        description: 'Subtool Index (zero based). If omited then uses the currently selected subtool.',
        type: ZArgType.number
      }
    ],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  SubToolGetActiveIndex: {
    syntax: '[%s]',
    description: 'Returns the index of the active subtool (Sub-Level only). Output: Returns the index of the active subtool (zero based).',
    example: '',
    args: [],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  SubToolGetCount: {
    syntax: '[%s]',
    description: 'Returns the number of subtools in the active tool (<strong>Sub-Level</strong> only). Output: Returns the number of subtools. Return 0 if error.',
    example: '',
    args: [],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  SubToolGetFolderIndex: {
    syntax: '[%s, %s]',
    description: 'Returns the folder index in which this subtool is contained',
    example: 'Output: Returns the folder index or -1 if this subtool is not within a folder.',
    args: [
      {
        name: 'SubtoolIndex',
        description: 'Subtool Index (zero based).  If omited then use the currently selected subtool.',
        type: ZArgType.number
      }
    ],
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  SubToolGetFolderName: {
    syntax: '[%s, %s]',
    description: 'Returns the ffolder name of the specified subtool',
    example: 'Output: Result folder name or empty if subtool is not in a folder.',
    args: [
      {
        name: 'ToolIndex',
        description: 'Tool Index (zero based). If omited then use the currently selected tool.',
        type: ZArgType.number
      }
    ],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  SubToolGetStatus: {
    syntax: '[%s, %s]',
    description: 'Returns the status of a subtool',
    example: 'Output: Returns the status (Subtool Eye=0x01, Folder Eye=0x02, UnionAdd=0x10, UnionSub=0x20, UnionClip=0x40, UnionStart=0x80, ClosedFolder=0x400, OpenedFolder=0x800).',
    args: [
      {
        name: 'SubtoolIndex',
        description: 'Subtool Index (zero based).  If omited then use the currently selected subtool.',
        type: ZArgType.number
      }
    ],
    level: ZScriptLevel.all,
    return: ZArgType.string
  },
  SubToolSetStatus: {
    syntax: '[%s, %s]',
    description: 'Sets the status of a subtool',
    example: '',
    args: [
      {
        name: 'SubtoolIndex',
        description: 'Subtool Index (zero based).  If omited then use the currently selected subtool.',
        type: ZArgType.number
      },
      {
        name: 'SubtoolEye',
        description: 'New Value (Subtool Eye=0x01',
        type: ZArgType.number
      },
      {
        name: 'FolderEye',
        description: 'Folder Eye=0x02',
        type: ZArgType.number
      },
      { name: 'UnionAdd', description: 'UnionAdd=0x10', type: ZArgType.number },
      { name: 'UnionSub', description: 'UnionSub=0x20', type: ZArgType.number },
      {
        name: 'UnionClip',
        description: 'UnionClip=0x40',
        type: ZArgType.number
      },
      {
        name: 'UnionStart',
        description: 'UnionStart=0x80',
        type: ZArgType.number
      },
      {
        name: 'ClosedFolder',
        description: 'ClosedFolder=0x400',
        type: ZArgType.number
      },
      {
        name: 'OpenedFolder',
        description: 'OpenedFolder=0x800)',
        type: ZArgType.number
      }
    ],
    level: ZScriptLevel.all,
    return: ZArgType.null
  },
  ToolGetActiveIndex: {
    syntax: '[%s]',
    description: 'Returns the index of the active tool (<strong>Sub-Level</strong> only). Output: Returns the index of the active tool (zero based).',
    example: '',
    args: [],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  ToolGetCount: {
    syntax: '[%s]',
    description: 'Returns the number of available tools (<strong>Sub-Level</strong> only). Output: Returns the number of available tools.',
    example: '',
    args: [],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  ToolGetPath: {
    syntax: '[%s, %s]',
    description: 'Returns the file path or name of the specified tool (<strong>Sub-Level</strong> only). Output: Result path (without the .ztl). Empty if error.',
    example: 'Example:\n' +
      '\n' +
      '<code>[ToolGetPath, 4]</code>\n' +
      '\n' +
      'Returns the path of the 5th tool.',
    args: [
      {
        name: 'ToolIndex',
        description: 'Tool Index (zero based). If omited then uses the currently selected tool.',
        type: ZArgType.number
      }
    ],
    level: ZScriptLevel.subLevel,
    return: ZArgType.string
  },
  ToolGetSubToolID: {
    syntax: '[%s, %s]',
    description: 'Returns the unique subtool ID (<strong>Sub-Level</strong> only). Output: Returns the unique subtool ID or zero if error. Note that duplicates of meshes have the same ID.',
    example: 'Example:\n' +
      '\n' +
      '<code>[ToolGetSubToolID, 1, 4]</code>\n' +
      '\n' +
      'Returns the unique subtool ID of the 5th subtool in the 2nd tool.',
    args: [
      {
        name: 'ToolIndex',
        description: 'Tool Index (zero based). If omited then use the currently selected tool.',
        type: ZArgType.number
      },
      {
        name: 'SubtoolIndex',
        description: 'Subtool Index (zero based). If omited then uses the selected subtool.',
        type: ZArgType.number
      }
    ],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  ToolGetSubToolsCount: {
    syntax: '[%s, %s]',
    description: 'Returns the number of subtools in the specified tool index (<strong>Sub-Level</strong> only). Output: Returns the number of subtools. Return 0 if error.',
    example: 'Example:\n' +
      '\n' +
      '<code>[ToolGetSubToolsCount, 4]</code>\n' +
      '\n' +
      'Returns the subtool count for the 5th tool.',
    args: [
      {
        name: 'ToolIndex',
        description: 'Tool Index (zero based). If omited then uses the currently selected tool.',
        type: ZArgType.number
      }
    ],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  ToolLocateSubTool: {
    syntax: '[%s, %s]',
    description: 'Locates a subtool by the specified unique ID (<strong>Sub-Level</strong> only). Output: Returns the index of the located tool and subtool or -1 if error.',
    example: '',
    args: [
      {
        name: 'UniqueSubtoolID',
        description: 'Unique Subtool ID',
        type: ZArgType.number
      },
      {
        name: 'OptionalSubtoolIndexResult',
        description: 'Optional subtool index result',
        type: ZArgType.number
      }
    ],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  ToolSelect: {
    syntax: '[%s, %s]',
    description: 'Selects the tool at the specified tool index (<strong>Sub-Level</strong> only). Output: Returns zero if OK, -1 if error.',
    example: 'Example:\n\n<code>[ToolSelect, 4]</code>\n\nSelects the 5th tool.',
    args: [
      {
        name: 'ToolIndex',
        description: 'Tool Index (zero based).',
        type: ZArgType.number
      }
    ],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  },
  ToolSetPath: {
    syntax: '[%s, %s]',
    description: 'Sets the file path or name of the specified tool (<strong>Sub-Level</strong> only). Output: Returns zero if OK, -1 if error.',
    example: 'Example:\n' +
      '\n' +
      '<code>[ToolSetPath, ,[FileNameAdvance,[ToolGetPath]]]</code>\n' +
      '\n' +
      'Advances the file name of the active tool by 1.',
    args: [
      {
        name: 'ToolIndex',
        description: 'Tool Index (zero based). If omited then uses the currently selected tool.',
        type: ZArgType.number
      },
      {
        name: 'NewPath',
        description: 'New Path. Path extension (such as .ztl) will be omited.',
        type: ZArgType.string
      }
    ],
    level: ZScriptLevel.subLevel,
    return: ZArgType.number
  }
};


export let zMathFns: ZCommandObject = {
  INT:
  {
    description: 'Integer Portion of value; removes everything after decimal point',
    args: [{ name: 'value', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  FRAC:
  {
    description: 'Fractional Portion of value; removes everything before decimal point',
    args: [{ name: 'value', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  ABS:
  {
    description: 'Absolute Value (ignores + or – sign)',
    args: [{ name: 'value', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  NEG:
  {
    description: 'Changes the + or – sign of value',
    args: [{ name: 'value', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MIN:
  {
    description: 'Finds the lesser of two values',
    args:
      [{ name: 'value1', description: '', type: ZArgType.number },
      { name: 'value2', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  MAX:
  {
    description: 'Finds the greater of two values',
    args:
      [{ name: 'value1', description: '', type: ZArgType.number },
      { name: 'value2', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  SQRT:
  {
    description: 'Square Root of the value',
    args: [{ name: 'value', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  RAND:
  {
    description: 'Random Number between 0 and value',
    args: [{ name: 'value', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  IRAND:
  {
    description: 'Random Integer between 0 and value',
    args: [{ name: 'value', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  SIN:
  {
    description: 'Trig Sine of the angle, in degrees',
    args: [{ name: 'angle', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  COS:
  {
    description: 'Trig cosine of the angle, in degrees',
    args: [{ name: 'angle', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  TAN:
  {
    description: 'Trig Tangent of the angle, in degrees',
    args: [{ name: 'angle', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  ASIN:
  {
    description: 'Trig ArcSine of the value',
    args: [{ name: 'value', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  ACOS:
  {
    description: 'Trig ArcCosine of the value',
    args: [{ name: 'value', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  ATAN:
  {
    description: 'Trig ArcTangent of the value',
    args: [{ name: 'value', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  ATAN2:
  {
    description: 'Trig ArcTangent of the value (*ZBrush 3 only)',
    args:
      [{ name: 'value', description: '', type: ZArgType.number },
      { name: 'value', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  LOG:
  {
    description: 'Natural Log of the value',
    args: [{ name: 'value', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  LOG10:
  {
    description: 'Base 10 Log of the value',
    args: [{ name: 'value', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  },
  BOOL:
  {
    description: 'Boolean Evaluation',
    args: [{ name: 'value', description: '', type: ZArgType.number }],
    example: '',
    syntax: '%s(%s)',
    level: ZScriptLevel.all,
    return: ZArgType.number
  }
};