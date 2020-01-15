const {
    clean,
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
        autoFindInSelection: Enum("EAutoFindInSelection", "never", "always", "multiline"),
        seedSearchStringFromSelection: Boolean(),
    });

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
    });

    const EditorHoverOptions = Class("EditorHoverOptions", {
        delay: Number(),
        enabled: Boolean(),
        sticky: Boolean(),
    });

    const EditorLightbulbOptions = Class("EditorLightbulbOptions", {
        enabled: Boolean(),
    });

    const EditorMinimapOptions = Class("EditorMinimapOptions", {
        enabled: Boolean(),
        maxColumn: Number(),
        renderCharacters: Boolean(),
        scale: Number(),
        showSlider: Enum("EMinimapShowSlider", "always", "mouseover"),
        side: Enum("EMinimapSide", "right", "left"),
    });

    const EditorParameterHints = Class("EditorParameterHints", {
        cycle: Boolean(),
        enabled: Boolean(),
    });

    const EditorScrollbarOptions = Class("EditorScrollbarOptions", {
        alwaysConsumeMouseWheel: Boolean(),
        arrowSize: Number(),
        handleMouseWheel: Boolean(),
        horizontal: Enum("EScrollbarHorizontal", "auto", "visible", "hidden"),
        horizontalHasArrows: Boolean(),
        horizontalScrollbarSize: Number(),
        horizontalSliderSize: Number(),
        useShadows: Boolean(),
        vertical: Enum("EScrollbarVertical", "auto", "visible", "hidden"),
        verticalHasArrows: Boolean(),
        verticalScrollbarSize: Number(),
        verticalSliderSize: Number(),
    });

    const EditorSuggestOptions = Class("EditorSuggestOptions", {
        filterGraceful: Boolean(),
        insertHighlight: Boolean(),
        insertMode: Enum("EInsertMode", "insert", "replace"),
        localityBonus: Boolean(),
        maxVisibleSuggestions: Boolean(),
        shareSuggestSelections: Boolean(),
        showClasses: Boolean(),
        showColors: Boolean(),
        showConstants: Boolean(),
        showConstructors: Boolean(),
        showEnumMembers: Boolean(),
        showEnums: Boolean(),
        showEvents: Boolean(),
        showFields: Boolean(),
        showFiles: Boolean(),
        showFolders: Boolean(),
        showFunctions: Boolean(),
        showIcons: Boolean(),
        showInterfaces: Boolean(),
        showKeywords: Boolean(),
        showMethods: Boolean(),
        showModules: Boolean(),
        showOperators: Boolean(),
        showProperties: Boolean(),
        showReferences: Boolean(),
        showSnippets: Boolean(),
        showStructs: Boolean(),
        showTypeParameters: Boolean(),
        showUnits: Boolean(),
        showValues: Boolean(),
        showVariables: Boolean(),
        showWords: Boolean(),
        snippetsPreventQuickSuggestions: Boolean(),
    });

    const EditorDimension = Class("EditorDimension", {
        height: Number(),
        width: Number(),
    });

    const EditorOptions = Class("EditorOptions", {
        dimension: EditorDimension,
        find: EditorFindOptions,
        gotoLocation: EditorGotoLocationOptions,
        hover: EditorHoverOptions,
        lightbulb: EditorLightbulbOptions,
        minimap: EditorMinimapOptions,
        parameterHints: EditorParameterHints,
        scrollbar: EditorScrollbarOptions,
        suggest: EditorSuggestOptions,

        autoClosingOvertype: Enum("EAutoClosingOvertype", "always", "auto", "never"),
        autoIndent: Enum("EAutoIndent", "none", "keep", "brackets", "advanced", "full"),
        acceptSuggestionOnEnter: Enum("EAcceptSuggestionOnEnter", "on", "smart", "off"),
        accessibilitySupport: Enum("EAccessibilitySupport", "auto", "off", "on"),
        autoClosingBrackets: Enum("EAutoClosingBrackets", "always", "languageDefined", "beforeWhitespace", "never"),
        autoClosingQuotes: Enum("EAutoClosingQuotes", "always", "languageDefined", "beforeWhitespace", "never"),
        autoSurround: Enum("EAutoSurround", "languageDefined", "quotes", "brackets", "never"),
        cursorBlinking: Enum("ECursorBlinking", "blink", "smooth", "phase", "expand", "solid"),
        cursorStyle: Enum("ECursorStyle", "block", "line", "underline", "line-thin", "block-outline", "underline-thin"),
        cursorSurroundingLinesStyle: Enum("ECursorSurroundingLinesStyle", "default", "all"),
        foldingStrategy: Enum("EFoldingStrategy", "auto", "indentation"),
        fontWeight: Enum("EFontWeight", 
            "normal", "bold", "bolder", "lighter",
            "initial", "inherit",
            "100", "200", "300", "400", "500", "600", "700", "800", "900"
        ),
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
        lineNumbers: Enum("ELineNumbers", "on", "off", "relative", "interval"),
        matchBrackets: Enum("EMatchBrackets", "never", "near", "always"),
        mouseStyle: Enum("EMouseStyle", "text", "default", "copy"),
        multiCursorModifier: Enum("EMultiCursorModifier", "ctrlCmd", "alt"),
        multiCursorPaste: Enum("EMultiCursorPaste", "spread", "full"),
        renderLineHighlight: Enum("ERenderLineHighlight", "none", "gutter", "line", "all"),
        renderWhitespace: Enum("ERenderWhitespace", "none", "boundary", "selection", "all"),
        showFoldingControls: Enum("EShowFoldingControls", "always", "mouseover"),
        snippetSuggestions: Enum("ESnippetSuggestions", "top", "bottom", "inline", "none"),
        suggestSelection: Enum("ESuggestSelection", "first", "recentlyUsed", "recentlyUsedByPrefix"),
        tabCompletion: Enum("ETabCompletion", "on", "off", "onlySnippets"),
        theme: Enum("ETheme", "vs", "vs-dark", "hc-black"),
        wordWrap: Enum("EWordWrap", "off", "on", "wordWrapColumn", "bounded"),
        wrappingIndent: Enum("EWrappingIndent", "none", "same", "indent", "deepIndent"),

        rulers: Array(Number()),
        codeActionsOnSave: Map(String(), Boolean()),

        acceptSuggestionOnCommitCharacter: Boolean(),
        autoClosingBrackets: Boolean(),
        automaticLayout: Boolean(),
        codeLens: Boolean(),
        colorDecorators: Boolean(),
        contextmenu: Boolean(),
        copyWithSyntaxHighlighting: Boolean(),
        cursorSmoothCaretAnimation: Boolean(),
        detectIndentation: Boolean(),
        disableLayerHinting: Boolean(),
        disableMonospaceOptimizations: Boolean(),
        dragAndDrop: Boolean(),
        emptySelectionClipboard: Boolean(),
        fixedOverflowWidgets: Boolean(),
        folding: Boolean(),
        fontLigatures: Boolean(),
        formatOnPaste: Boolean(),
        formatOnType: Boolean(),
        glyphMargin: Boolean(),
        hideCursorInOverviewRuler: Boolean(),
        highlightActiveIndentGuide: Boolean(),
        insertSpaces: Boolean(),
        largeFileOptimizations: Boolean(),
        links: Boolean(),
        mouseWheelZoom: Boolean(),
        multiCursorMergeOverlapping: Boolean(),
        occurrencesHighlight: Boolean(),
        overviewRulerBorder: Boolean(),
        parameterHints: Boolean(),
        quickSuggestions: Boolean(),
        readOnly: Boolean(),
        renderControlCharacters: Boolean(),
        renderFinalNewline: Boolean(),
        renderIndentGuides: Boolean(),
        roundedSelection: Boolean(),
        scrollBeyondLastLine: Boolean(),
        selectOnLineNumbers: Boolean(),
        selectionClipboard: Boolean(),
        selectionHighlight: Boolean(),
        showUnused: Boolean(),
        smoothScrolling: Boolean(),
        stablePeek: Boolean(),
        suggestOnTriggerCharacters: Boolean(),
        trimAutoWhitespace: Boolean(),
        useTabStops: Boolean(),
        wordBasedSuggestions: Boolean(),
        wordWrapMinified: Boolean(),

        accessibilityPageSize: Number(),
        codeActionsOnSaveTimeout: Number(),
        cursorSurroundingLines: Number(),
        cursorWidth: Number(),
        fastScrollSensitivity: Number(),
        fontSize: Number(),
        letterSpacing: Number(),
        lineHeight: Number(),
        lineNumbersMinChars: Number(),
        maxTokenizationLineLength: Number(),
        mouseWheelScrollSensitivity: Number(),
        overviewRulerLanes: Number(),
        quickSuggestionsDelay: Number(),
        revealHorizontalRightPadding: Number(),
        scrollBeyondLastColumn: Number(),
        stopRenderingLineAfter: Number(),
        suggestFontSize: Number(),
        suggestLineHeight: Number(),
        tabSize: Number(),
        wordWrapColumn: Number(),

        lineDecorationsWidth: CssSize(),

        accessibilityHelpUrl: String(),
        ariaLabel: String(),
        extraEditorClassName: String(),
        fontFamily: String(),
        wordSeparators: String(),
        wordWrapBreakAfterCharacters: String(),
        wordWrapBreakBeforeCharacters: String(),
        wordWrapBreakObtrusiveCharacters: String(),
    });
})
