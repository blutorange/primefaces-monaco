import javax.faces.component.UIComponent;
import javax.faces.context.FacesContext;
import javax.faces.convert.EnumConverter;
import javax.faces.convert.FacesConverter;

@FacesConverter(value = "TheEnumConverter")
public class TheEnumConverter extends EnumConverter {
    public TheEnumConverter() {
        super(TheEnum.class);
    }
}