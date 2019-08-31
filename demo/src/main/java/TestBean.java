
import com.github.blutorange.primefaces.config.monacoeditor.*;

import org.apache.commons.lang3.StringUtils;

import javax.annotation.PostConstruct;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.ViewScoped;
import java.io.Serializable;
import java.util.Arrays;
import java.util.Collection;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@ManagedBean(name="testBean")
@ViewScoped
public class TestBean implements Serializable {

    private String code;
    private String longCode;
    private String uiLanguage;
    private boolean rendered;
    private boolean rendered2;
    private TheEnum theEnum;
    private EditorOptions editorOptions;

    @PostConstruct
    private void init() {
        resetSettings();
    }

    public void resetSettings() {
        uiLanguage = "en";
        theEnum = TheEnum.Foo;
        code = "/**\n" + " * @param {number} x The first number.\n" + " * @param {number} y The second number.\n" + " * @return {number} The sum of the numbers\n" + " */\n" + "function testbar(x, y) {\n" + "\treturn x + y;\n" + "}\n" + "const z1 = testbar(5, 3);\n" + "const z2 = testbar(5, 3);\n" + "const z3 = testbar(5, 3);\n\n$(\".acc\").accordion(\"refresh\");";
        longCode = StringUtils.repeat(code, 20);
        editorOptions = new EditorOptions()
                .setLanguage(ELanguage.JAVASCRIPT)
                .setTheme(ETheme.VS)
                .setSuggest(new EditorSuggestOptions()
                    .addFilteredType("keyword", false)
                )
                .setSuggestSelection(ESuggestSelection.RECENTLY_USED)
                .setLineNumbers(ELineNumbers.ON)
                .setWordWrap(EWordWrap.ON)
                .addRuler(60, 100)
                .setFontSize(20);
    }

    public String getUiLanguage() {
        return uiLanguage;
    }

    public void setUiLanguage(String uiLanguage) {
        this.uiLanguage = uiLanguage;
    }

    public Collection<String> getAvailableLanguages() {
        return Arrays.asList("bg", "de", "en", "es", "fr", "hu", "it", "ja", "ko", "ps", "pt-br", "ru", "tr", "uk", "zh-hans", "zh-hant");
    }

    public String getCodeLanguage() {
        return editorOptions.getLanguage();
    }

    public void setCodeLanguage(final String codeLanguage) {
        editorOptions.setLanguage(codeLanguage);
    }

    public String getCode() {
        return code;
    }

    public void setCode(final String code) {
        this.code = code;
    }

    public String getLongCode() {
        return longCode;
    }

    public void setLongCode(final String longCode) {
        this.longCode = longCode;
    }

    public TheEnum getTheEnum() {
        return theEnum;
    }

    public void setTheEnum(TheEnum theEnum) {
        this.theEnum = theEnum;
    }

    public EditorOptions getEditorOptions() {
        return editorOptions;
    }

    public void setEditorOptions(EditorOptions editorOptions) {
        this.editorOptions = editorOptions;
    }
    
    public void setRendered(boolean rendered) {
      this.rendered = rendered;
    }
    
    public boolean isRendered() {
      return rendered;
    }
    
    public void toggleRendered() {
      rendered = !rendered;
    }

    public void setRendered2(boolean rendered2) {
        this.rendered2 = rendered2;
      }
      
      public boolean isRendered2() {
        return rendered2;
      }
      
      public void toggleRendered2() {
        rendered2 = !rendered2;
      }
}
