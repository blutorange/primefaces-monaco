const {
    clean,
    Doc,
    Array,
    Boolean,
    Class,
    CssSize,
    Enum,
    Map,
    Number,
    String
} = require("./util");

clean(err => {
    if (err) throw err;

    const EGoToLocationValues = Enum("EGoToLocationValues", "peek", "gotoAndPeek", "goto");

    const EditorFindOptions = Class("EditorFindOptions", {
        addExtraSpaceOnTop: Boolean(),

        [Doc()]: "Controls if Find in Selection flag is turned on in the editor.",
        autoFindInSelection: Enum("EAutoFindInSelection", "never", "always", "multiline"),

        [Doc()]: "Controls if we seed search string in the Find Widget with editor selection.",
        seedSearchStringFromSelection: Boolean(),
    }, "Configuration options for editor find widget");

    const EditorGotoLocationOptions = Class("EditorGotoLocationOptions", {
        alternativeDeclarationCommand: String(),
        alternativeDefinitionCommand: String(),
        alternativeImplementationCommand: String(),
        alternativeReferenceCommand: String(),
        alternativeTypeDefinitionCommand: String(),
        multiple: EGoToLocationValues,
        multipleDeclarations: EGoToLocationValues,
        multipleDefinitions: EGoToLocationValues,
        multipleImplementations: EGoToLocationValues,
        multipleReferences: EGoToLocationValues,
        multipleTypeDefinitions: EGoToLocationValues,
    }, "Configuration options for go to location");

    const EditorHoverOptions = Class("EditorHoverOptions", {
        [Doc()]: "Delay for showing the hover. Defaults to 300.",
        delay: Number(),

        [Doc()]: "Enable the hover. Defaults to {@code true}.",
        enabled: Boolean(),

        [Doc()]: "Is the hover sticky such that it can be clicked and its contents selected? Defaults to {@code true}.",
        sticky: Boolean(),
    }, "Configuration options for editor hover");

    const EditorLightbulbOptions = Class("EditorLightbulbOptions", {
        [Doc()]: "Enable the lightbulb code action. Defaults to {@code true}.",
        enabled: Boolean(),
    }, "Configuration options for editor lightbulb");

    const EditorMinimapOptions = Class("EditorMinimapOptions", {
        [Doc()]: "Enable the rendering of the minimap. Defaults to {@code true}.",
        enabled: Boolean(),

        [Doc()]: "Limit the width of the minimap to render at most a certain number of columns. Defaults to {@code 120}.",
        maxColumn: Number(),

        [Doc()]: "Render the actual text on a line (as opposed to color blocks). Defaults to {@code true}.",
        renderCharacters: Boolean(),

        [Doc()]: "Relative size of the font in the minimap. Defaults to {@code 1}.",
        scale: Number(),

        [Doc()]: "Control the rendering of the minimap slider. Defaults to {@code mouseover}.",
        showSlider: Enum("EMinimapShowSlider", "always", "mouseover"),

        [Doc()]: "Control the side of the minimap in editor. Defaults to {@code right}.",
        side: Enum("EMinimapSide", "right", "left"),
    }, "Configuration options for editor minimap");

    const EditorParameterHints = Class("EditorParameterHints", {
        [Doc()]: "Enable cycling of parameter hints. Defaults to {@code false}.",
        cycle: Boolean(),

        [Doc()]: "Enable parameter hints. Defaults to {@code true}.",
        enabled: Boolean(),
    }, "Configuration options for parameter hints");

    const EditorScrollbarOptions = Class("EditorScrollbarOptions", {
        [Doc()]: "Always consume mouse wheel events (always call {@code preventDefault()} and {@code stopPropagation()} on the browser events). Defaults to {@code true}.",
        alwaysConsumeMouseWheel: Boolean(),

        [Doc()]: "The size of arrows (if displayed). Defaults to {@code 11}.",
        arrowSize: Number(),

        [Doc()]: "Listen to mouse wheel events and react to them by scrolling. Defaults to {@code true}.",
        handleMouseWheel: Boolean(),

        [Doc()]: "Render horizontal scrollbar. Defaults to {@code auto}.",
        horizontal: Enum("EScrollbarHorizontal", "auto", "visible", "hidden"),

        [Doc()]: "Render arrows at the left and right of the horizontal scrollbar. Defaults to {@code false}.",
        horizontalHasArrows: Boolean(),

        [Doc()]: "Height in pixels for the horizontal scrollbar. Defaults to {@code 10} (px).",
        horizontalScrollbarSize: Number(),

        [Doc()]: "Height in pixels for the horizontal slider. Defaults to {@code horizontalScrollbarSize}.",
        horizontalSliderSize: Number(),

        [Doc()]: "Cast horizontal and vertical shadows when the content is scrolled. Defaults to {@code true}.",
        useShadows: Boolean(),

        [Doc()]: "Render vertical scrollbar. Defaults to {@code auto}.",
        vertical: Enum("EScrollbarVertical", "auto", "visible", "hidden"),

        [Doc()]: "Render arrows at the top and bottom of the vertical scrollbar. Defaults to {@code false}.",
        verticalHasArrows: Boolean(),

        [Doc()]: "Width in pixels for the vertical scrollbar. Defaults to {@code 10} (px).",
        verticalScrollbarSize: Number(),

        [Doc()]: "Width in pixels for the vertical slider. Defaults to {@code verticalScrollbarSize}.",
        verticalSliderSize: Number(),
    }, "Configuration options for editor scrollbars");

    const EditorSuggestOptions = Class("EditorSuggestOptions", {
        [Doc()]: "Enable graceful matching. Defaults to {@code true}.",
        filterGraceful: Boolean(),

        [Doc()]: "Controls the visibility of the status bar at the bottom of the suggest widget.",
        hideStatusBar: Boolean(),

        [Doc()]: "Show a highlight when suggestion replaces or keep text after the cursor. Defaults to {@code false}.",
        insertHighlight: Boolean(),

        [Doc()]: "Overwrite word ends on accept. Default to {@code false}.",
        insertMode: Enum("EInsertMode", "insert", "replace"),

        [Doc()]: "Favours words that appear close to the cursor.",
        localityBonus: Boolean(),

        [Doc()]: "Max suggestions to show in suggestions. Defaults to {@code 12}.",
        maxVisibleSuggestions: Boolean(),

        [Doc()]: "Enable using global storage for remembering suggestions.",
        shareSuggestSelections: Boolean(),

        [Doc()]: "Show class-suggestions.",
        showClasses: Boolean(),

        [Doc()]: "Show color-suggestions.",
        showColors: Boolean(),

        [Doc()]: "Show constant-suggestions.",
        showConstants: Boolean(),

        [Doc()]: "Show constructor-suggestions.",
        showConstructors: Boolean(),

        [Doc()]: "Show enumMember-suggestions.",
        showEnumMembers: Boolean(),

        [Doc()]: "Show enum-suggestions.",
        showEnums: Boolean(),

        [Doc()]: "Show event-suggestions.",
        showEvents: Boolean(),

        [Doc()]: "Show field-suggestions.",
        showFields: Boolean(),

        [Doc()]: "Show file-suggestions.",
        showFiles: Boolean(),

        [Doc()]: "Show folder-suggestions.",
        showFolders: Boolean(),

        [Doc()]: "Show function-suggestions.",
        showFunctions: Boolean(),

        [Doc()]: "Enable or disable icons in suggestions. Defaults to {@code true}.",
        showIcons: Boolean(),

        [Doc()]: "Show interface-suggestions.",
        showInterfaces: Boolean(),

        [Doc()]: "Show keyword-suggestions.",
        showKeywords: Boolean(),

        [Doc()]: "Show method-suggestions.",
        showMethods: Boolean(),

        [Doc()]: "Show module-suggestions.",
        showModules: Boolean(),

        [Doc()]: "Show operator-suggestions.",
        showOperators: Boolean(),

        [Doc()]: "Show property-suggestions.",
        showProperties: Boolean(),

        [Doc()]: "Show reference-suggestions.",
        showReferences: Boolean(),

        [Doc()]: "Show snippet-suggestions.",
        showSnippets: Boolean(),

        [Doc()]: "Show struct-suggestions.",
        showStructs: Boolean(),

        [Doc()]: "Show typeParameter-suggestions.",
        showTypeParameters: Boolean(),

        [Doc()]: "Show unit-suggestions.",
        showUnits: Boolean(),

        [Doc()]: "Show value-suggestions.",
        showValues: Boolean(),

        [Doc()]: "Show variable-suggestions.",
        showVariables: Boolean(),

        [Doc()]: "Show text-suggestions.",
        showWords: Boolean(),

        [Doc()]: "Prevent quick suggestions when a snippet is active. Defaults to true.",
        snippetsPreventQuickSuggestions: Boolean(),
    }, "Configuration options for editor suggest widget");

    const EditorDimension = Class("EditorDimension", {
        height: Number(),
        width: Number(),
    }, "The initial editor dimension (to avoid measuring the container).");

    const EditorCommentsOptions = Class("EditorCommentsOptions", {
        [Doc()]: "Insert a space after the line comment token and inside the block comments tokens. Defaults to true {@code} .",
        insertSpace: Boolean(),
    }, "Configuration options for editor comments");

    const EditorQuickSuggestionsOptions = Class("EditorQuickSuggestionsOptions", {
        comments: Boolean(),
        other: Boolean(),
        strings: Boolean(),
    }, "Configuration options for quick suggestions");

    const EditorOptions = Class("EditorOptions", {
        [Doc()]: "Control the behaviour of comments in the editor.",
        comments: EditorCommentsOptions,

        [Doc()]: "The initial editor dimension (to avoid measuring the container).",
        dimension: EditorDimension,

        [Doc()]: "Control the behavior of the find widget.",
        find: EditorFindOptions,

        gotoLocation: EditorGotoLocationOptions,

        [Doc()]: "Configure the editor's hover.",
        hover: EditorHoverOptions,

        [Doc()]: "Control the behavior and rendering of the code action lightbulb.",
        lightbulb: EditorLightbulbOptions,

        [Doc()]: "",
        minimap: EditorMinimapOptions,

        [Doc()]: "",
        parameterHints: EditorParameterHints,

        [Doc()]: "Enable quick suggestions (shadow suggestions) Defaults to true {@code} ",
        quickSuggestions: EditorQuickSuggestionsOptions,

        [Doc()]: "Control the behavior and rendering of the scrollbars.",
        scrollbar: EditorScrollbarOptions,

        [Doc()]: "Suggest options.",
        suggest: EditorSuggestOptions,

        [Doc()]: "Options for typing over closing quotes or brackets.",
        autoClosingOvertype: Enum("EAutoClosingOvertype", "always", "auto", "never"),

        [Doc()]: "Controls whether the editor should automatically adjust the indentation when users type, paste, move or indent lines. Defaults to {@code advanced}.",
        autoIndent: Enum("EAutoIndent", "none", "keep", "brackets", "advanced", "full"),
        
        [Doc()]: "Accept suggestions on ENTER. Defaults to {@code on}.",
        acceptSuggestionOnEnter: Enum("EAcceptSuggestionOnEnter", "on", "smart", "off"),
        
        [Doc()]: "Configure the editor's accessibility support. Defaults to {@code auto}. It is best to leave this to {@code auto}.",
        accessibilitySupport: Enum("EAccessibilitySupport", "auto", "off", "on"),

        [Doc()]: "Options for auto closing brackets. Defaults to language defined behavior.",
        autoClosingBrackets: Enum("EAutoClosingBrackets", "always", "languageDefined", "beforeWhitespace", "never"),

        [Doc()]: "Options for auto closing quotes. Defaults to language defined behavior.",
        autoClosingQuotes: Enum("EAutoClosingQuotes", "always", "languageDefined", "beforeWhitespace", "never"),

        [Doc()]: "Options for auto surrounding. Defaults to always allowing auto surrounding.",
        autoSurround: Enum("EAutoSurround", "languageDefined", "quotes", "brackets", "never"),

        [Doc()]: "Control the cursor animation style, possible values are {@code blink}, {@code smooth}, {@code phase}, {@code expand} and {@code solid}. Defaults to {@code blink}.",
        cursorBlinking: Enum("ECursorBlinking", "blink", "smooth", "phase", "expand", "solid"),

        [Doc()]: "Control the cursor style, either {@code block} or {@code line}. Defaults to {@code line}.",
        cursorStyle: Enum("ECursorStyle", "block", "line", "underline", "line-thin", "block-outline", "underline-thin"),

        [Doc()]: "Controls when {@code cursorSurroundingLines} should be enforced Defaults to {@code default}, {@code cursorSurroundingLines} is not enforced when cursor position is changed by mouse.",
        cursorSurroundingLinesStyle: Enum("ECursorSurroundingLinesStyle", "default", "all"),

        [Doc()]: "Selects the folding strategy. 'auto' uses the strategies contributed for the current document, 'indentation' uses the indentation based folding strategy. Defaults to 'auto'.",
        foldingStrategy: Enum("EFoldingStrategy", "auto", "indentation"),

        [Doc()]: "The font weight",
        fontWeight: Enum("EFontWeight", 
            "normal", "bold", "bolder", "lighter",
            "initial", "inherit",
            "100", "200", "300", "400", "500", "600", "700", "800", "900"
        ),

        [Doc()]: "The initial language of the auto created model in the editor. To not create automatically a model, use {@code model: null}.",
        language: Enum("ELanguage", true,
            "abap",
            "aes",
            "apex",
            "azcli",
            "bat",
            "c", 
            "clojure", 
            "coffeescript", 
            "cpp", 
            "csharp", 
            "csp", 
            "css", 
            "dockerfile",
            "fsharp", 
            "go", 
            "graphql", 
            "handlebars", 
            "html", 
            "ini", 
            "java", 
            "javascript", 
            "json", 
            "kotlin", 
            "less",
            "lua", 
            "markdown", 
            "mips",
            "msdax", 
            "mysql", 
            "objective-c", 
            "pascal", 
            "pascaligo",
            "perl", 
            "pgsql", 
            "php", 
            "plaintext",
            "postiats", 
            "powerquery", 
            "powershell", 
            "pug", 
            "python", 
            "r", 
            "razor", 
            "redis", 
            "redshift", 
            "ruby", 
            "rust",
            "sb", 
            "scheme", 
            "scss", 
            "shell", 
            "sol", 
            "sql", 
            "st", 
            "swift", 
            "tcl", 
            "twig",
            "typescript", 
            "vb", 
            "xml", 
            "yaml"
        ),

        [Doc()]: "Control the rendering of line numbers. If it is a function, it will be invoked when rendering a line number and the return value will be rendered. Otherwise, if it is a truey, line numbers will be rendered normally (equivalent of using an identity function). Otherwise, line numbers will not be rendered. Defaults to {@code on}.",
        lineNumbers: Enum("ELineNumbers", "on", "off", "relative", "interval"),

        [Doc()]: "Enable highlighting of matching brackets. Defaults to {@code always}.",
        matchBrackets: Enum("EMatchBrackets", "never", "near", "always"),

        [Doc()]: "Control the mouse pointer style, either 'text' or 'default' or 'copy' Defaults to {@code text}",
        mouseStyle: Enum("EMouseStyle", "text", "default", "copy"),

        [Doc()]: "The modifier to be used to add multiple cursors with the mouse. Defaults to {@code alt}",
        multiCursorModifier: Enum("EMultiCursorModifier", "ctrlCmd", "alt"),

        [Doc()]: "Configure the behaviour when pasting a text with the line count equal to the cursor count. Defaults to {@code spread}.",
        multiCursorPaste: Enum("EMultiCursorPaste", "spread", "full"),

        [Doc()]: "Controls whether to focus the inline editor in the peek widget by default. Defaults to {@code false}.",
        peekWidgetDefaultFocus: Enum("EPeekWidgetDefaultFocus", "tree", "editor"),

        [Doc()]: "Enable rendering of current line highlight. Defaults to {@code all}.",
        renderLineHighlight: Enum("ERenderLineHighlight", "none", "gutter", "line", "all"),

        [Doc()]: "Should the editor render validation decorations. Defaults to {@code editable}.",
        renderValidationDecorations: Enum("ERenderValidationDecorations", "editable", "on", "off"),

        [Doc()]: "Enable rendering of whitespace. Defaults to {@code none}.",
        renderWhitespace: Enum("ERenderWhitespace", "none", "boundary", "selection", "all"),

        [Doc()]: "Controls whether the fold actions in the gutter stay always visible or hide unless the mouse is over the gutter. Defaults to {@code mouseover}.",
        showFoldingControls: Enum("EShowFoldingControls", "always", "mouseover"),

        [Doc()]: "Enable snippet suggestions. Defaults to 'inline'.",
        snippetSuggestions: Enum("ESnippetSuggestions", "top", "bottom", "inline", "none"),

        [Doc()]: "Keep peek editors open even when double clicking their content or when hitting Escape. Defaults to {@code false}.",
        suggestSelection: Enum("ESuggestSelection", "first", "recentlyUsed", "recentlyUsedByPrefix"),

        [Doc()]: "Enable tab completion.",
        tabCompletion: Enum("ETabCompletion", "on", "off", "onlySnippets"),

        [Doc()]: "Initial theme to be used for rendering. The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black'. You can create custom themes via {@code monaco.editor.defineTheme}. To switch a theme, use {@code monaco.editor.setTheme}",
        theme: Enum("ETheme", "vs", "vs-dark", "hc-black"),

        [Doc()]: "Control the wrapping of the editor. When {@code wordWrap} = {@code off}, the lines will never wrap. When {@code wordWrap} = {@code on}, the lines will wrap at the viewport width. When {@code wordWrap} = {@code wordWrapColumn}, the lines will wrap at {@code wordWrapColumn}. When {@code wordWrap} = {@code bounded}, the lines will wrap at {@code min(viewport width, wordWrapColumn)}. Defaults to {@code off}.",
        wordWrap: Enum("EWordWrap", "off", "on", "wordWrapColumn", "bounded"),

        [Doc()]: "Control indentation of wrapped lines. Can be: {@code none}, {@code same}, {@code indent} or {@code deepIndent}. Defaults to {@code same} in vscode and to {@code none} in monaco-editor.",
        wrappingIndent: Enum("EWrappingIndent", "none", "same", "indent", "deepIndent"),

        [Doc()]: "Controls the wrapping strategy to use. Defaults to {@code simple}.",
        wrappingStrategy: Enum("EWrappingStrategy", "simple", "advanced"),

        [Doc()]: "Render vertical lines at the specified columns. Defaults to empty array.",
        rulers: Array(Number()),

        [Doc()]: "Accept suggestions on provider defined characters. Defaults to true {@code} .",
        acceptSuggestionOnCommitCharacter: Boolean(),

        [Doc()]: "Options for auto closing brackets. Defaults to language defined behavior.",
        autoClosingBrackets: Boolean(),

        [Doc()]: "Enable that the editor will install an interval to check if its container dom node size has changed. Enabling this might have a severe performance impact. Defaults to {@code false}.",
        automaticLayout: Boolean(),

        [Doc()]: "Show code lens Defaults to true {@code} .",
        codeLens: Boolean(),

        [Doc()]: "Enable inline color decorators and color picker rendering.",
        colorDecorators: Boolean(),

        [Doc()]: "Enable custom contextmenu. Defaults to true {@code} .",
        contextmenu: Boolean(),

        [Doc()]: "Syntax highlighting is copied.",
        copyWithSyntaxHighlighting: Boolean(),

        [Doc()]: "Enable smooth caret animation. Defaults to {@code false}.",
        cursorSmoothCaretAnimation: Boolean(),

        [Doc()]: "Controls whether {@code tabSize} and {@code insertSpaces} will be automatically detected when a file is opened based on the file contents. Defaults to true {@code} .",
        detectIndentation: Boolean(),
      
        [Doc()]: "Disable the use of transform: translate3d(0px, 0px, 0px) for the editor margin and lines layers. The usage of transform: translate3d(0px, 0px, 0px) acts as a hint for browsers to create an extra layer. Defaults to {@code false}.",
        disableLayerHinting: Boolean(),
       
        [Doc()]: "Disable the optimizations for monospace fonts. Defaults to {@code false}.",
        disableMonospaceOptimizations: Boolean(),

        [Doc()]: "Controls if the editor should allow to move selections via drag and drop. Defaults to {@code false}.",
        dragAndDrop: Boolean(),

        [Doc()]: "Copying without a selection copies the current line",
        emptySelectionClipboard: Boolean(),

        [Doc()]: "Display overflow widgets as {@code fixed}. Defaults to {@code false}",
        fixedOverflowWidgets: Boolean(),

        [Doc()]: "Enable code folding. Defaults to true {@code} ",
        folding: Boolean(),

        [Doc()]: "Enable highlight for folded regions. Defaults to true {@code} ",
        foldingHighlight: Boolean(),

        [Doc()]: "Enable font ligatures. Defaults to {@code false}",
        fontLigatures: Boolean(),

        [Doc()]: "Enable format on paste. Defaults to {@code false}",
        formatOnPaste: Boolean(),

        [Doc()]: "Enable format on type. Defaults to {@code false}",
        formatOnType: Boolean(),

        [Doc()]: "Enable the rendering of the glyph margin. Defaults to true {@code}  in vscode and to {@code false} in monaco-editor",
        glyphMargin: Boolean(),

        [Doc()]: "Should the cursor be hidden in the overview ruler. Defaults to {@code false}",
        hideCursorInOverviewRuler: Boolean(),

        [Doc()]: "Enable highlighting of the active indent guide. Defaults to true {@code} ",
        highlightActiveIndentGuide: Boolean(),

        [Doc()]: "Insert spaces when pressing {@code Tab}. This setting is overridden based on the file contents when {@code detectIndentation} is on. Defaults to true {@code} ",
        insertSpaces: Boolean(),

        [Doc()]: "Special handling for large files to disable certain memory intensive features. Defaults to true {@code} ",
        largeFileOptimizations: Boolean(),

        [Doc()]: "Enable detecting links and making them clickable. Defaults to true {@code} ",
        links: Boolean(),

        [Doc()]: "Zoom the font in the editor when using the mouse wheel in combination with holding Ctrl. Defaults to {@code false}",
        mouseWheelZoom: Boolean(),

        [Doc()]: "Merge overlapping selections. Defaults to true {@code} ",
        multiCursorMergeOverlapping: Boolean(),

        [Doc()]: "Enable semantic occurrences highlight. Defaults to true {@code} ",
        occurrencesHighlight: Boolean(),

        [Doc()]: "Controls if a border should be drawn around the overview ruler. Defaults to true {@code} ",
        overviewRulerBorder: Boolean(),

        [Doc()]: "Parameter hint options",
        parameterHints: Boolean(),

        [Doc()]: "Should the editor be read only. Defaults to {@code false}",
        readOnly: Boolean(),

        [Doc()]: "Enable rendering of control characters. Defaults to {@code false}",
        renderControlCharacters: Boolean(),

        [Doc()]: "Render last line number when the file ends with a newline. Defaults to true {@code} ",
        renderFinalNewline: Boolean(),

        [Doc()]: "Enable rendering of indent guides. Defaults to true {@code} ",
        renderIndentGuides: Boolean(),

        [Doc()]: "Render the editor selection with rounded borders. Defaults to true {@code} ",
        roundedSelection: Boolean(),

        [Doc()]: "Enable that scrolling can go one screen size after the last line. Defaults to true {@code} ",
        scrollBeyondLastLine: Boolean(),

        [Doc()]: "Should the corresponding line be selected when clicking on the line number? Defaults to true {@code} ",
        selectOnLineNumbers: Boolean(),

        [Doc()]: "Enable Linux primary clipboard. Defaults to true {@code} ",
        selectionClipboard: Boolean(),

        [Doc()]: "Enable selection highlight. Defaults to true {@code} ",
        selectionHighlight: Boolean(),

        [Doc()]: "Controls fading out of unused variables",
        showUnused: Boolean(),

        [Doc()]: "Enable that the editor animates scrolling to a position. Defaults to {@code false}",
        smoothScrolling: Boolean(),

        [Doc()]: "Keep peek editors open even when double clicking their content or when hitting Escape. Defaults to {@code false}",
        stablePeek: Boolean(),

        [Doc()]: "Enable the suggestion box to pop-up on trigger characters. Defaults to true {@code} ",
        suggestOnTriggerCharacters: Boolean(),

        [Doc()]: "Remove trailing auto inserted whitespace. Defaults to true {@code} .",
        trimAutoWhitespace: Boolean(),

        [Doc()]: "Inserting and deleting whitespace follows tab stops.",
        useTabStops: Boolean(),

        [Doc()]: "Controls whether completions should be computed based on words in the document. Defaults to true {@code} .",
        wordBasedSuggestions: Boolean(),

        [Doc()]: "Force word wrapping when the text appears to be of a minified/generated file. Defaults to {@code true}.",
        wordWrapMinified: Boolean(),

        [Doc()]: "Controls the number of lines in the editor that can be read out by a screen reader",
        accessibilityPageSize: Number(),
        
        [Doc()]: "Timeout for running code actions on save.",
        codeActionsOnSaveTimeout: Number(),

        [Doc()]: "Controls the minimal number of visible leading and trailing lines surrounding the cursor. Defaults to {@code 0}.",
        cursorSurroundingLines: Number(),

        [Doc()]: "Control the width of the cursor when cursorStyle is set to {@code line}",
        cursorWidth: Number(),

        [Doc()]: "FastScrolling mulitplier speed when pressing {@code Alt} Defaults to {@code 5}.",
        fastScrollSensitivity: Number(),

        [Doc()]: "The font size",
        fontSize: Number(),

        [Doc()]: "The letter spacing",
        letterSpacing: Number(),

        [Doc()]: "The line height",
        lineHeight: Number(),

        [Doc()]: "Control the rendering of line numbers. If it is a function, it will be invoked when rendering a line number and the return value will be rendered. Otherwise, if it is a truey, line numbers will be rendered normally (equivalent of using an identity function). Otherwise, line numbers will not be rendered. Defaults to {@code on}.",
        lineNumbersMinChars: Number(),

        [Doc()]: "Lines above this length will not be tokenized for performance reasons. Defaults to {@code 20000}.",
        maxTokenizationLineLength: Number(),

        [Doc()]: "A multiplier to be used on the {@code deltaX} and {@code deltaY} of mouse wheel scroll events. Defaults to {@code 1}.",
        mouseWheelScrollSensitivity: Number(),

        [Doc()]: "The number of vertical lanes the overview ruler should render. Defaults to {@code 3}.",
        overviewRulerLanes: Number(),

        [Doc()]: "Quick suggestions show delay (in ms) Defaults to {@code 10} (ms)",
        quickSuggestionsDelay: Number(),

        [Doc()]: "When revealing the cursor, a virtual padding (px) is added to the cursor, turning it into a rectangle. This virtual padding ensures that the cursor gets revealed before hitting the edge of the viewport. Defaults to {@code 30} (px).",
        revealHorizontalRightPadding: Number(),

        [Doc()]: "Enable that scrolling can go beyond the last column by a number of columns. Defaults to {@code 5}.",
        scrollBeyondLastColumn: Number(),

        [Doc()]: "Performance guard: Stop rendering a line after x characters. Defaults to {@code 10000}. Use {@code -1} to never stop rendering",
        stopRenderingLineAfter: Number(),

        [Doc()]: "The font size for the suggest widget. Defaults to the editor font size.",
        suggestFontSize: Number(),

        [Doc()]: "The line height for the suggest widget. Defaults to the editor line height.",
        suggestLineHeight: Number(),

        [Doc()]: "The number of spaces a tab is equal to. This setting is overridden based on the file contents when {@code detectIndentation} is on. Defaults to {@code 4}.",
        tabSize: Number(),

        [Doc()]: "Control the wrapping of the editor. When {@code wordWrap} = {@code off}, the lines will never wrap. When {@code wordWrap} = {@code on}, the lines will wrap at the viewport width. When {@code wordWrap} = {@code wordWrapColumn}, the lines will wrap at wordWrapColumn. When {@code wordWrap} = {@code bounded}, the lines will wrap at min(viewport width, wordWrapColumn). Defaults to {@code 80}.",
        wordWrapColumn: Number(),

        [Doc()]: "The width reserved for line decorations (in px). Line decorations are placed between line numbers and the editor content. You can pass in a string in the format floating point followed by {@code ch}. e.g. 1.3ch. Defaults to 10.",
        lineDecorationsWidth: CssSize(),

        [Doc()]: "An URL to open when Ctrl+H (Windows and Linux) or Cmd+H (OSX) is pressed in the accessibility help dialog in the editor.",
        accessibilityHelpUrl: String(),

        [Doc()]: "The aria label for the editor's textarea (when it is focused).",
        ariaLabel: String(),

        [Doc()]: "Class name to be added to the editor.",
        extraEditorClassName: String(),

        [Doc()]: "The font family",
        fontFamily: String(),

        [Doc()]: "A string containing the word separators used when doing word navigation. Defaults to `~!@#$%^&*()-=+[{]}\|;:'\",.<>/?",
        wordSeparators: String(),

        [Doc()]: "Configure word wrapping characters. A break will be introduced after these characters. Defaults to '\t})]?|/&.,;¢°′″‰℃、。｡､￠，．：；？！％・･ゝゞヽヾーァィゥェォッャュョヮヵヶぁぃぅぇぉっゃゅょゎゕゖㇰㇱㇲㇳㇴㇵㇶㇷㇸㇹㇺㇻㇼㇽㇾㇿ々〻ｧｨｩｪｫｬｭｮｯｰ”〉》」』】〕）］｝｣'.",
        wordWrapBreakAfterCharacters: String(),

        [Doc()]: "Configure word wrapping characters. A break will be introduced before these characters. Defaults to '([{‘“〈《「『【〔（［｛｢£¥＄￡￥+＋'.",
        wordWrapBreakBeforeCharacters: String(),

    }, "The options to create an editor");
})
