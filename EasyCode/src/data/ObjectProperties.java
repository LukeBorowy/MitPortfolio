package data;

import java.util.ArrayList;
import java.util.List;

import compiler.SentenceMatcher;

public class ObjectProperties {

	public List<Property> properties=new ArrayList<Property>();
	public ObjectProperties() {
		
	}
	
	public Data getDataForLabel(String label) {
		for(Property p:properties) {
			if(p.labelMatches(label)) {
				return p.getData();
			}
		}
		return null;//if nothing matches, return null
	}
	
	
	public void addProp(Data prop,SentenceMatcher matcher) {
		properties.add(new Property(prop,matcher));
	}
	
	public void addProp(Data prop,String matcher) {
		addProp(prop,new SentenceMatcher(matcher));
	}
	
	
	

}
class Property{
	Data data;
	SentenceMatcher label;
	
	public Property(Data data, SentenceMatcher label) {
		this.data = data;
		this.label = label;
	}
	
	public Data getData() {
		return data;
	}
	
	public boolean labelMatches(String s) {
		return label.matchesText(s);
	}
	
}
