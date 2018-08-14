const {
    clean,
    Array,
    Boolean,
    Class,
    CssSize,
    Enum,
    Number,
    String
} = require("./util");

clean(err => {
    if (err) throw err;

    const EditorScrollbarOptions = Class("EditorScrollbarOptions", {
        arrowSize: Number,
        handleMouseWheel: Boolean,
        horizontal: String,
        horizontalHasArrows: Boolean,
        horizontalScrollbarSize: Number,
        horizontalSliderSize: Number,
        useShadows: Boolean,
        vertical: String,
        verticalScrollbarSize: Number,
        verticalSliderSize: Number,
    });

    const EditorMinimapOptions = Class("EditorMinimapOptions", {
        enabled: Boolean,
        maxColumn: Number,
        renderCharacters: Boolean,
        showSlider: Enum("EMinimapShowSlider", "always", "mouseover"),
        side: Enum("EMinimapSide", "right", "left"),
    });

    const EditorLightbulbOptions = Class("EditorLightbulbOptions", {
        enabled: Boolean,
    });

    const EditorHoverOptions = Class("EditorHoverOptions", {
        delay: Number,
        enabled: Boolean,
        sticky: Boolean,
    });

    const EditorFindOptions = Class("EditorFindOptions", {
        autoFindInSelection: Boolean,
        seedSearchStringFromSelection: Boolean,
    });

    const EditorSuggestOptions = Class("EditorSuggestOptions", {
        filterGraceful: Boolean,
        snippetsPreventQuickSuggestions: Boolean,
    });

    const EditorOptions = Class("EditorOptions", {
        find: EditorFindOptions,
        hover: EditorHoverOptions,
        lightbulb: EditorLightbulbOptions,
        minimap: EditorMinimapOptions,
        scrollbar: EditorScrollbarOptions,
        suggest: EditorSuggestOptions,

        acceptSuggestionOnEnter: Enum("EAcceptSuggestionOnEnter", "on", "smart", "off"),
        accessibilitySupport: Enum("EAccessibilitySupport", "auto", "off", "on"),
        cursorBlinking: Enum("ECursorBlinking", "blink", "smooth", "phase", "expand", "solid"),
        cursorStyle: Enum("ECursorStyle", "block", "line"),
        foldingStrategy: Enum("EFoldingStrategy", "auto", "indentation"),
        fontWeight: Enum("EFontWeight", "bold", "bolder", "light", "lighter", "inherit", "initial", "100", "200", "300", "400", "500", "600", "700", "800", "900"),
        language: Enum("ELanguage", "css", "html", "json", "typescript", "javascript", "csharp", "fsharp", "handlebars", "ini", "less", "markdown", "msdax", "objective-c", "php", "powershell", "python", "razor", "redshift", "rust", "scss", "sql", "swift", "xml", "coffee", "cpp", "csp", "dockerfile", "go", "java", "lua", "mysql", "pgsql", "postiats", "pug", "r", "redis", "ruby", "sb", "solidity", "st", "vb", "yaml"),
        lineNumbers: Enum("ELineNumbers", "on", "off", "relative", "interval"),
        multiCursorModifier: Enum("EMultiCursorModifier", "ctrlCmd", "alt"),
        renderLineHighlight: Enum("ERenderLineHighlight", "none", "gutter", "line", "all"),
        renderWhitespace: Enum("ERenderWhitespace", "none", "boundary", "all"),
        showFoldingControls: Enum("EShowFoldingControls", "always", "mouseover"),
        snippetSuggestions: Enum("ESnippetSuggestions", "top", "bottom", "inline", "none"),
        suggestSelection: Enum("ESuggestSelection", "first", "recentlyUsed", "recentlyUsedByPrefix"),
        theme: Enum("ETheme", "vs", "vs-dark", "hc-black"),
        wordWrap: Enum("EWordWrap", "off", "on", "wordWrapColumn", "bounded"),
        wrappingIndent: Enum("EWrappingIndent", "none", "same", "indent", "deepIndent"),

        rulers: Array(Number),
        codeActionsOnSave: Array(String),

        acceptSuggestionOnCommitCharacter: Boolean,
        autoClosingBrackets: Boolean,
        autoIndent: Boolean,
        automaticLayout: Boolean,
        codeLens: Boolean,
        colorDecorators: Boolean,
        contextmenu: Boolean,
        disableLayerHinting: Boolean,
        disableMonospaceOptimizations: Boolean,
        dragAndDrop: Boolean,
        emptySelectionClipboard: Boolean,
        fixedOverflowWidgets: Boolean,
        folding: Boolean,
        fontLigatures: Boolean,
        formatOnPaste: Boolean,
        formatOnType: Boolean,
        glyphMargin: Boolean,
        hideCursorInOverviewRuler: Boolean,
        highlightActiveIndentGuide: Boolean,
        iconsInSuggestions: Boolean,
        links: Boolean,
        matchBrackets: Boolean,
        mouseWheelZoom: Boolean,
        multiCursorMergeOverlapping: Boolean,
        occurrencesHighlight: Boolean,
        overviewRulerBorder: Boolean,
        parameterHints: Boolean,
        quickSuggestions: Boolean,
        renderControlCharacters: Boolean,
        renderIndentGuides: Boolean,
        roundedSelection: Boolean,
        scrollBeyondLastLine: Boolean,
        selectOnLineNumbers: Boolean,
        selectionClipboard: Boolean,
        selectionHighlight: Boolean,
        showUnused: Boolean,
        smoothScrolling: Boolean,
        suggestOnTriggerCharacters: Boolean,
        useTabStops: Boolean,
        wordBasedSuggestions: Boolean,
        wordWrapMinified: Boolean,

        codeActionsOnSaveTimeout: Number,
        cursorWidth: Number,
        fontSize: Number,
        letterSpacing: Number,
        lineHeight: Number,
        lineNumbersMinChars: Number,
        mouseWheelScrollSensitivity: Number,
        overviewRulerLanes: Number,
        quickSuggestionsDelay: Number,
        revealHorizontalRightPadding: Number,
        scrollBeyondLastColumn: Number,
        stopRenderingLineAfter: Number,
        suggestFontSize: Number,
        suggestLineHeight: Number,
        wordWrapColumn: Number,

        lineDecorationsWidth: CssSize,

        accessibilityHelpUrl: String,
        ariaLabel: String,
        extraEditorClassName: String,
        fontFamily: String,
        wordSeparators: String,
        wordWrapBreakAfterCharacters: String,
        wordWrapBreakBeforeCharacters: String,
        wordWrapBreakObtrusiveCharacters: String,
    });
})