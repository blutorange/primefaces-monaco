package com.github.blutorange.primefaces.config.monacoeditor;

import org.primefaces.json.JSONObject;
import java.io.Serializable;

public class EditorOptions implements Serializable {
    private JSONObject obj = new JSONObject();

    public EditorFindOptions getFind() {
        return (EditorFindOptions) obj.get("find");
    }

    public EditorOptions setFind(final EditorFindOptions find) {
        obj.put("find", find);
        return this;
    }

    public EditorHoverOptions getHover() {
        return (EditorHoverOptions) obj.get("hover");
    }

    public EditorOptions setHover(final EditorHoverOptions hover) {
        obj.put("hover", hover);
        return this;
    }

    public EditorLightbulbOptions getLightbulb() {
        return (EditorLightbulbOptions) obj.get("lightbulb");
    }

    public EditorOptions setLightbulb(final EditorLightbulbOptions lightbulb) {
        obj.put("lightbulb", lightbulb);
        return this;
    }

    public EditorMinimapOptions getMinimap() {
        return (EditorMinimapOptions) obj.get("minimap");
    }

    public EditorOptions setMinimap(final EditorMinimapOptions minimap) {
        obj.put("minimap", minimap);
        return this;
    }

    public EditorScrollbarOptions getScrollbar() {
        return (EditorScrollbarOptions) obj.get("scrollbar");
    }

    public EditorOptions setScrollbar(final EditorScrollbarOptions scrollbar) {
        obj.put("scrollbar", scrollbar);
        return this;
    }

    public EditorSuggestOptions getSuggest() {
        return (EditorSuggestOptions) obj.get("suggest");
    }

    public EditorOptions setSuggest(final EditorSuggestOptions suggest) {
        obj.put("suggest", suggest);
        return this;
    }

    public String getAcceptSuggestionOnEnter() {
        return (String) obj.get("acceptSuggestionOnEnter");
    }

    public EditorOptions setAcceptSuggestionOnEnter(final EAcceptSuggestionOnEnter acceptSuggestionOnEnter) {
        obj.put("acceptSuggestionOnEnter", acceptSuggestionOnEnter != null ? acceptSuggestionOnEnter.toString() : null);
        return this;
    }

    public EditorOptions setAcceptSuggestionOnEnter(final String acceptSuggestionOnEnter) {
        obj.put("acceptSuggestionOnEnter", acceptSuggestionOnEnter);
        return this;
    }

    public String getAccessibilitySupport() {
        return (String) obj.get("accessibilitySupport");
    }

    public EditorOptions setAccessibilitySupport(final EAccessibilitySupport accessibilitySupport) {
        obj.put("accessibilitySupport", accessibilitySupport != null ? accessibilitySupport.toString() : null);
        return this;
    }

    public EditorOptions setAccessibilitySupport(final String accessibilitySupport) {
        obj.put("accessibilitySupport", accessibilitySupport);
        return this;
    }

    public String getCursorBlinking() {
        return (String) obj.get("cursorBlinking");
    }

    public EditorOptions setCursorBlinking(final ECursorBlinking cursorBlinking) {
        obj.put("cursorBlinking", cursorBlinking != null ? cursorBlinking.toString() : null);
        return this;
    }

    public EditorOptions setCursorBlinking(final String cursorBlinking) {
        obj.put("cursorBlinking", cursorBlinking);
        return this;
    }

    public String getCursorStyle() {
        return (String) obj.get("cursorStyle");
    }

    public EditorOptions setCursorStyle(final ECursorStyle cursorStyle) {
        obj.put("cursorStyle", cursorStyle != null ? cursorStyle.toString() : null);
        return this;
    }

    public EditorOptions setCursorStyle(final String cursorStyle) {
        obj.put("cursorStyle", cursorStyle);
        return this;
    }

    public String getFoldingStrategy() {
        return (String) obj.get("foldingStrategy");
    }

    public EditorOptions setFoldingStrategy(final EFoldingStrategy foldingStrategy) {
        obj.put("foldingStrategy", foldingStrategy != null ? foldingStrategy.toString() : null);
        return this;
    }

    public EditorOptions setFoldingStrategy(final String foldingStrategy) {
        obj.put("foldingStrategy", foldingStrategy);
        return this;
    }

    public String getFontWeight() {
        return (String) obj.get("fontWeight");
    }

    public EditorOptions setFontWeight(final EFontWeight fontWeight) {
        obj.put("fontWeight", fontWeight != null ? fontWeight.toString() : null);
        return this;
    }

    public EditorOptions setFontWeight(final String fontWeight) {
        obj.put("fontWeight", fontWeight);
        return this;
    }

    public String getLanguage() {
        return (String) obj.get("language");
    }

    public EditorOptions setLanguage(final ELanguage language) {
        obj.put("language", language != null ? language.toString() : null);
        return this;
    }

    public EditorOptions setLanguage(final String language) {
        obj.put("language", language);
        return this;
    }

    public String getLineNumbers() {
        return (String) obj.get("lineNumbers");
    }

    public EditorOptions setLineNumbers(final ELineNumbers lineNumbers) {
        obj.put("lineNumbers", lineNumbers != null ? lineNumbers.toString() : null);
        return this;
    }

    public EditorOptions setLineNumbers(final String lineNumbers) {
        obj.put("lineNumbers", lineNumbers);
        return this;
    }

    public String getMultiCursorModifier() {
        return (String) obj.get("multiCursorModifier");
    }

    public EditorOptions setMultiCursorModifier(final EMultiCursorModifier multiCursorModifier) {
        obj.put("multiCursorModifier", multiCursorModifier != null ? multiCursorModifier.toString() : null);
        return this;
    }

    public EditorOptions setMultiCursorModifier(final String multiCursorModifier) {
        obj.put("multiCursorModifier", multiCursorModifier);
        return this;
    }

    public String getRenderLineHighlight() {
        return (String) obj.get("renderLineHighlight");
    }

    public EditorOptions setRenderLineHighlight(final ERenderLineHighlight renderLineHighlight) {
        obj.put("renderLineHighlight", renderLineHighlight != null ? renderLineHighlight.toString() : null);
        return this;
    }

    public EditorOptions setRenderLineHighlight(final String renderLineHighlight) {
        obj.put("renderLineHighlight", renderLineHighlight);
        return this;
    }

    public String getRenderWhitespace() {
        return (String) obj.get("renderWhitespace");
    }

    public EditorOptions setRenderWhitespace(final ERenderWhitespace renderWhitespace) {
        obj.put("renderWhitespace", renderWhitespace != null ? renderWhitespace.toString() : null);
        return this;
    }

    public EditorOptions setRenderWhitespace(final String renderWhitespace) {
        obj.put("renderWhitespace", renderWhitespace);
        return this;
    }

    public String getShowFoldingControls() {
        return (String) obj.get("showFoldingControls");
    }

    public EditorOptions setShowFoldingControls(final EShowFoldingControls showFoldingControls) {
        obj.put("showFoldingControls", showFoldingControls != null ? showFoldingControls.toString() : null);
        return this;
    }

    public EditorOptions setShowFoldingControls(final String showFoldingControls) {
        obj.put("showFoldingControls", showFoldingControls);
        return this;
    }

    public String getSnippetSuggestions() {
        return (String) obj.get("snippetSuggestions");
    }

    public EditorOptions setSnippetSuggestions(final ESnippetSuggestions snippetSuggestions) {
        obj.put("snippetSuggestions", snippetSuggestions != null ? snippetSuggestions.toString() : null);
        return this;
    }

    public EditorOptions setSnippetSuggestions(final String snippetSuggestions) {
        obj.put("snippetSuggestions", snippetSuggestions);
        return this;
    }

    public String getSuggestSelection() {
        return (String) obj.get("suggestSelection");
    }

    public EditorOptions setSuggestSelection(final ESuggestSelection suggestSelection) {
        obj.put("suggestSelection", suggestSelection != null ? suggestSelection.toString() : null);
        return this;
    }

    public EditorOptions setSuggestSelection(final String suggestSelection) {
        obj.put("suggestSelection", suggestSelection);
        return this;
    }

    public String getTheme() {
        return (String) obj.get("theme");
    }

    public EditorOptions setTheme(final ETheme theme) {
        obj.put("theme", theme != null ? theme.toString() : null);
        return this;
    }

    public EditorOptions setTheme(final String theme) {
        obj.put("theme", theme);
        return this;
    }

    public String getWordWrap() {
        return (String) obj.get("wordWrap");
    }

    public EditorOptions setWordWrap(final EWordWrap wordWrap) {
        obj.put("wordWrap", wordWrap != null ? wordWrap.toString() : null);
        return this;
    }

    public EditorOptions setWordWrap(final String wordWrap) {
        obj.put("wordWrap", wordWrap);
        return this;
    }

    public String getWrappingIndent() {
        return (String) obj.get("wrappingIndent");
    }

    public EditorOptions setWrappingIndent(final EWrappingIndent wrappingIndent) {
        obj.put("wrappingIndent", wrappingIndent != null ? wrappingIndent.toString() : null);
        return this;
    }

    public EditorOptions setWrappingIndent(final String wrappingIndent) {
        obj.put("wrappingIndent", wrappingIndent);
        return this;
    }

    public java.util.List<Number> getRulers() {
        return (java.util.List<Number>) obj.get("rulers");
    }

    public EditorOptions setRulers(final java.util.List<Number> rulers) {
        obj.put("rulers", rulers);
        return this;
    }

    public java.util.List<String> getCodeActionsOnSave() {
        return (java.util.List<String>) obj.get("codeActionsOnSave");
    }

    public EditorOptions setCodeActionsOnSave(final java.util.List<String> codeActionsOnSave) {
        obj.put("codeActionsOnSave", codeActionsOnSave);
        return this;
    }

    public Boolean isAcceptSuggestionOnCommitCharacter() {
        return (Boolean) obj.get("acceptSuggestionOnCommitCharacter");
    }

    public EditorOptions setAcceptSuggestionOnCommitCharacter(final Boolean acceptSuggestionOnCommitCharacter) {
        obj.put("acceptSuggestionOnCommitCharacter", acceptSuggestionOnCommitCharacter);
        return this;
    }

    public Boolean isAutoClosingBrackets() {
        return (Boolean) obj.get("autoClosingBrackets");
    }

    public EditorOptions setAutoClosingBrackets(final Boolean autoClosingBrackets) {
        obj.put("autoClosingBrackets", autoClosingBrackets);
        return this;
    }

    public Boolean isAutoIndent() {
        return (Boolean) obj.get("autoIndent");
    }

    public EditorOptions setAutoIndent(final Boolean autoIndent) {
        obj.put("autoIndent", autoIndent);
        return this;
    }

    public Boolean isAutomaticLayout() {
        return (Boolean) obj.get("automaticLayout");
    }

    public EditorOptions setAutomaticLayout(final Boolean automaticLayout) {
        obj.put("automaticLayout", automaticLayout);
        return this;
    }

    public Boolean isCodeLens() {
        return (Boolean) obj.get("codeLens");
    }

    public EditorOptions setCodeLens(final Boolean codeLens) {
        obj.put("codeLens", codeLens);
        return this;
    }

    public Boolean isColorDecorators() {
        return (Boolean) obj.get("colorDecorators");
    }

    public EditorOptions setColorDecorators(final Boolean colorDecorators) {
        obj.put("colorDecorators", colorDecorators);
        return this;
    }

    public Boolean isContextmenu() {
        return (Boolean) obj.get("contextmenu");
    }

    public EditorOptions setContextmenu(final Boolean contextmenu) {
        obj.put("contextmenu", contextmenu);
        return this;
    }

    public Boolean isDisableLayerHinting() {
        return (Boolean) obj.get("disableLayerHinting");
    }

    public EditorOptions setDisableLayerHinting(final Boolean disableLayerHinting) {
        obj.put("disableLayerHinting", disableLayerHinting);
        return this;
    }

    public Boolean isDisableMonospaceOptimizations() {
        return (Boolean) obj.get("disableMonospaceOptimizations");
    }

    public EditorOptions setDisableMonospaceOptimizations(final Boolean disableMonospaceOptimizations) {
        obj.put("disableMonospaceOptimizations", disableMonospaceOptimizations);
        return this;
    }

    public Boolean isDragAndDrop() {
        return (Boolean) obj.get("dragAndDrop");
    }

    public EditorOptions setDragAndDrop(final Boolean dragAndDrop) {
        obj.put("dragAndDrop", dragAndDrop);
        return this;
    }

    public Boolean isEmptySelectionClipboard() {
        return (Boolean) obj.get("emptySelectionClipboard");
    }

    public EditorOptions setEmptySelectionClipboard(final Boolean emptySelectionClipboard) {
        obj.put("emptySelectionClipboard", emptySelectionClipboard);
        return this;
    }

    public Boolean isFixedOverflowWidgets() {
        return (Boolean) obj.get("fixedOverflowWidgets");
    }

    public EditorOptions setFixedOverflowWidgets(final Boolean fixedOverflowWidgets) {
        obj.put("fixedOverflowWidgets", fixedOverflowWidgets);
        return this;
    }

    public Boolean isFolding() {
        return (Boolean) obj.get("folding");
    }

    public EditorOptions setFolding(final Boolean folding) {
        obj.put("folding", folding);
        return this;
    }

    public Boolean isFontLigatures() {
        return (Boolean) obj.get("fontLigatures");
    }

    public EditorOptions setFontLigatures(final Boolean fontLigatures) {
        obj.put("fontLigatures", fontLigatures);
        return this;
    }

    public Boolean isFormatOnPaste() {
        return (Boolean) obj.get("formatOnPaste");
    }

    public EditorOptions setFormatOnPaste(final Boolean formatOnPaste) {
        obj.put("formatOnPaste", formatOnPaste);
        return this;
    }

    public Boolean isFormatOnType() {
        return (Boolean) obj.get("formatOnType");
    }

    public EditorOptions setFormatOnType(final Boolean formatOnType) {
        obj.put("formatOnType", formatOnType);
        return this;
    }

    public Boolean isGlyphMargin() {
        return (Boolean) obj.get("glyphMargin");
    }

    public EditorOptions setGlyphMargin(final Boolean glyphMargin) {
        obj.put("glyphMargin", glyphMargin);
        return this;
    }

    public Boolean isHideCursorInOverviewRuler() {
        return (Boolean) obj.get("hideCursorInOverviewRuler");
    }

    public EditorOptions setHideCursorInOverviewRuler(final Boolean hideCursorInOverviewRuler) {
        obj.put("hideCursorInOverviewRuler", hideCursorInOverviewRuler);
        return this;
    }

    public Boolean isHighlightActiveIndentGuide() {
        return (Boolean) obj.get("highlightActiveIndentGuide");
    }

    public EditorOptions setHighlightActiveIndentGuide(final Boolean highlightActiveIndentGuide) {
        obj.put("highlightActiveIndentGuide", highlightActiveIndentGuide);
        return this;
    }

    public Boolean isIconsInSuggestions() {
        return (Boolean) obj.get("iconsInSuggestions");
    }

    public EditorOptions setIconsInSuggestions(final Boolean iconsInSuggestions) {
        obj.put("iconsInSuggestions", iconsInSuggestions);
        return this;
    }

    public Boolean isLinks() {
        return (Boolean) obj.get("links");
    }

    public EditorOptions setLinks(final Boolean links) {
        obj.put("links", links);
        return this;
    }

    public Boolean isMatchBrackets() {
        return (Boolean) obj.get("matchBrackets");
    }

    public EditorOptions setMatchBrackets(final Boolean matchBrackets) {
        obj.put("matchBrackets", matchBrackets);
        return this;
    }

    public Boolean isMouseWheelZoom() {
        return (Boolean) obj.get("mouseWheelZoom");
    }

    public EditorOptions setMouseWheelZoom(final Boolean mouseWheelZoom) {
        obj.put("mouseWheelZoom", mouseWheelZoom);
        return this;
    }

    public Boolean isMultiCursorMergeOverlapping() {
        return (Boolean) obj.get("multiCursorMergeOverlapping");
    }

    public EditorOptions setMultiCursorMergeOverlapping(final Boolean multiCursorMergeOverlapping) {
        obj.put("multiCursorMergeOverlapping", multiCursorMergeOverlapping);
        return this;
    }

    public Boolean isOccurrencesHighlight() {
        return (Boolean) obj.get("occurrencesHighlight");
    }

    public EditorOptions setOccurrencesHighlight(final Boolean occurrencesHighlight) {
        obj.put("occurrencesHighlight", occurrencesHighlight);
        return this;
    }

    public Boolean isOverviewRulerBorder() {
        return (Boolean) obj.get("overviewRulerBorder");
    }

    public EditorOptions setOverviewRulerBorder(final Boolean overviewRulerBorder) {
        obj.put("overviewRulerBorder", overviewRulerBorder);
        return this;
    }

    public Boolean isParameterHints() {
        return (Boolean) obj.get("parameterHints");
    }

    public EditorOptions setParameterHints(final Boolean parameterHints) {
        obj.put("parameterHints", parameterHints);
        return this;
    }

    public Boolean isQuickSuggestions() {
        return (Boolean) obj.get("quickSuggestions");
    }

    public EditorOptions setQuickSuggestions(final Boolean quickSuggestions) {
        obj.put("quickSuggestions", quickSuggestions);
        return this;
    }

    public Boolean isRenderControlCharacters() {
        return (Boolean) obj.get("renderControlCharacters");
    }

    public EditorOptions setRenderControlCharacters(final Boolean renderControlCharacters) {
        obj.put("renderControlCharacters", renderControlCharacters);
        return this;
    }

    public Boolean isRenderIndentGuides() {
        return (Boolean) obj.get("renderIndentGuides");
    }

    public EditorOptions setRenderIndentGuides(final Boolean renderIndentGuides) {
        obj.put("renderIndentGuides", renderIndentGuides);
        return this;
    }

    public Boolean isRoundedSelection() {
        return (Boolean) obj.get("roundedSelection");
    }

    public EditorOptions setRoundedSelection(final Boolean roundedSelection) {
        obj.put("roundedSelection", roundedSelection);
        return this;
    }

    public Boolean isScrollBeyondLastLine() {
        return (Boolean) obj.get("scrollBeyondLastLine");
    }

    public EditorOptions setScrollBeyondLastLine(final Boolean scrollBeyondLastLine) {
        obj.put("scrollBeyondLastLine", scrollBeyondLastLine);
        return this;
    }

    public Boolean isSelectOnLineNumbers() {
        return (Boolean) obj.get("selectOnLineNumbers");
    }

    public EditorOptions setSelectOnLineNumbers(final Boolean selectOnLineNumbers) {
        obj.put("selectOnLineNumbers", selectOnLineNumbers);
        return this;
    }

    public Boolean isSelectionClipboard() {
        return (Boolean) obj.get("selectionClipboard");
    }

    public EditorOptions setSelectionClipboard(final Boolean selectionClipboard) {
        obj.put("selectionClipboard", selectionClipboard);
        return this;
    }

    public Boolean isSelectionHighlight() {
        return (Boolean) obj.get("selectionHighlight");
    }

    public EditorOptions setSelectionHighlight(final Boolean selectionHighlight) {
        obj.put("selectionHighlight", selectionHighlight);
        return this;
    }

    public Boolean isShowUnused() {
        return (Boolean) obj.get("showUnused");
    }

    public EditorOptions setShowUnused(final Boolean showUnused) {
        obj.put("showUnused", showUnused);
        return this;
    }

    public Boolean isSmoothScrolling() {
        return (Boolean) obj.get("smoothScrolling");
    }

    public EditorOptions setSmoothScrolling(final Boolean smoothScrolling) {
        obj.put("smoothScrolling", smoothScrolling);
        return this;
    }

    public Boolean isSuggestOnTriggerCharacters() {
        return (Boolean) obj.get("suggestOnTriggerCharacters");
    }

    public EditorOptions setSuggestOnTriggerCharacters(final Boolean suggestOnTriggerCharacters) {
        obj.put("suggestOnTriggerCharacters", suggestOnTriggerCharacters);
        return this;
    }

    public Boolean isUseTabStops() {
        return (Boolean) obj.get("useTabStops");
    }

    public EditorOptions setUseTabStops(final Boolean useTabStops) {
        obj.put("useTabStops", useTabStops);
        return this;
    }

    public Boolean isWordBasedSuggestions() {
        return (Boolean) obj.get("wordBasedSuggestions");
    }

    public EditorOptions setWordBasedSuggestions(final Boolean wordBasedSuggestions) {
        obj.put("wordBasedSuggestions", wordBasedSuggestions);
        return this;
    }

    public Boolean isWordWrapMinified() {
        return (Boolean) obj.get("wordWrapMinified");
    }

    public EditorOptions setWordWrapMinified(final Boolean wordWrapMinified) {
        obj.put("wordWrapMinified", wordWrapMinified);
        return this;
    }

    public Number getCodeActionsOnSaveTimeout() {
        return (Number) obj.get("codeActionsOnSaveTimeout");
    }

    public EditorOptions setCodeActionsOnSaveTimeout(final Number codeActionsOnSaveTimeout) {
        obj.put("codeActionsOnSaveTimeout", codeActionsOnSaveTimeout);
        return this;
    }

    public Number getCursorWidth() {
        return (Number) obj.get("cursorWidth");
    }

    public EditorOptions setCursorWidth(final Number cursorWidth) {
        obj.put("cursorWidth", cursorWidth);
        return this;
    }

    public Number getFontSize() {
        return (Number) obj.get("fontSize");
    }

    public EditorOptions setFontSize(final Number fontSize) {
        obj.put("fontSize", fontSize);
        return this;
    }

    public Number getLetterSpacing() {
        return (Number) obj.get("letterSpacing");
    }

    public EditorOptions setLetterSpacing(final Number letterSpacing) {
        obj.put("letterSpacing", letterSpacing);
        return this;
    }

    public Number getLineHeight() {
        return (Number) obj.get("lineHeight");
    }

    public EditorOptions setLineHeight(final Number lineHeight) {
        obj.put("lineHeight", lineHeight);
        return this;
    }

    public Number getLineNumbersMinChars() {
        return (Number) obj.get("lineNumbersMinChars");
    }

    public EditorOptions setLineNumbersMinChars(final Number lineNumbersMinChars) {
        obj.put("lineNumbersMinChars", lineNumbersMinChars);
        return this;
    }

    public Number getMouseWheelScrollSensitivity() {
        return (Number) obj.get("mouseWheelScrollSensitivity");
    }

    public EditorOptions setMouseWheelScrollSensitivity(final Number mouseWheelScrollSensitivity) {
        obj.put("mouseWheelScrollSensitivity", mouseWheelScrollSensitivity);
        return this;
    }

    public Number getOverviewRulerLanes() {
        return (Number) obj.get("overviewRulerLanes");
    }

    public EditorOptions setOverviewRulerLanes(final Number overviewRulerLanes) {
        obj.put("overviewRulerLanes", overviewRulerLanes);
        return this;
    }

    public Number getQuickSuggestionsDelay() {
        return (Number) obj.get("quickSuggestionsDelay");
    }

    public EditorOptions setQuickSuggestionsDelay(final Number quickSuggestionsDelay) {
        obj.put("quickSuggestionsDelay", quickSuggestionsDelay);
        return this;
    }

    public Number getRevealHorizontalRightPadding() {
        return (Number) obj.get("revealHorizontalRightPadding");
    }

    public EditorOptions setRevealHorizontalRightPadding(final Number revealHorizontalRightPadding) {
        obj.put("revealHorizontalRightPadding", revealHorizontalRightPadding);
        return this;
    }

    public Number getScrollBeyondLastColumn() {
        return (Number) obj.get("scrollBeyondLastColumn");
    }

    public EditorOptions setScrollBeyondLastColumn(final Number scrollBeyondLastColumn) {
        obj.put("scrollBeyondLastColumn", scrollBeyondLastColumn);
        return this;
    }

    public Number getStopRenderingLineAfter() {
        return (Number) obj.get("stopRenderingLineAfter");
    }

    public EditorOptions setStopRenderingLineAfter(final Number stopRenderingLineAfter) {
        obj.put("stopRenderingLineAfter", stopRenderingLineAfter);
        return this;
    }

    public Number getSuggestFontSize() {
        return (Number) obj.get("suggestFontSize");
    }

    public EditorOptions setSuggestFontSize(final Number suggestFontSize) {
        obj.put("suggestFontSize", suggestFontSize);
        return this;
    }

    public Number getSuggestLineHeight() {
        return (Number) obj.get("suggestLineHeight");
    }

    public EditorOptions setSuggestLineHeight(final Number suggestLineHeight) {
        obj.put("suggestLineHeight", suggestLineHeight);
        return this;
    }

    public Number getWordWrapColumn() {
        return (Number) obj.get("wordWrapColumn");
    }

    public EditorOptions setWordWrapColumn(final Number wordWrapColumn) {
        obj.put("wordWrapColumn", wordWrapColumn);
        return this;
    }

    public String getLineDecorationsWidth() {
        return (String) obj.get("lineDecorationsWidth");
    }

    public EditorOptions setLineDecorationsWidth(final Number lineDecorationsWidth) {
        obj.put("lineDecorationsWidth", lineDecorationsWidth != null ? lineDecorationsWidth.toString() + "px" : null);
        return this;
    }

    public EditorOptions setLineDecorationsWidth(final String lineDecorationsWidth) {
        obj.put("lineDecorationsWidth", lineDecorationsWidth);
        return this;
    }

    public String getAccessibilityHelpUrl() {
        return (String) obj.get("accessibilityHelpUrl");
    }

    public EditorOptions setAccessibilityHelpUrl(final String accessibilityHelpUrl) {
        obj.put("accessibilityHelpUrl", accessibilityHelpUrl);
        return this;
    }

    public String getAriaLabel() {
        return (String) obj.get("ariaLabel");
    }

    public EditorOptions setAriaLabel(final String ariaLabel) {
        obj.put("ariaLabel", ariaLabel);
        return this;
    }

    public String getExtraEditorClassName() {
        return (String) obj.get("extraEditorClassName");
    }

    public EditorOptions setExtraEditorClassName(final String extraEditorClassName) {
        obj.put("extraEditorClassName", extraEditorClassName);
        return this;
    }

    public String getFontFamily() {
        return (String) obj.get("fontFamily");
    }

    public EditorOptions setFontFamily(final String fontFamily) {
        obj.put("fontFamily", fontFamily);
        return this;
    }

    public String getWordSeparators() {
        return (String) obj.get("wordSeparators");
    }

    public EditorOptions setWordSeparators(final String wordSeparators) {
        obj.put("wordSeparators", wordSeparators);
        return this;
    }

    public String getWordWrapBreakAfterCharacters() {
        return (String) obj.get("wordWrapBreakAfterCharacters");
    }

    public EditorOptions setWordWrapBreakAfterCharacters(final String wordWrapBreakAfterCharacters) {
        obj.put("wordWrapBreakAfterCharacters", wordWrapBreakAfterCharacters);
        return this;
    }

    public String getWordWrapBreakBeforeCharacters() {
        return (String) obj.get("wordWrapBreakBeforeCharacters");
    }

    public EditorOptions setWordWrapBreakBeforeCharacters(final String wordWrapBreakBeforeCharacters) {
        obj.put("wordWrapBreakBeforeCharacters", wordWrapBreakBeforeCharacters);
        return this;
    }

    public String getWordWrapBreakObtrusiveCharacters() {
        return (String) obj.get("wordWrapBreakObtrusiveCharacters");
    }

    public EditorOptions setWordWrapBreakObtrusiveCharacters(final String wordWrapBreakObtrusiveCharacters) {
        obj.put("wordWrapBreakObtrusiveCharacters", wordWrapBreakObtrusiveCharacters);
        return this;
    }

    JSONObject getJSONObject() {
        return obj;
    }
    
    @Override
    public String toString() {
        return getJSONObject().toString();
    }
}