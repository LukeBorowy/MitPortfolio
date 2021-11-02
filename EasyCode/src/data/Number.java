package data;

import main.Program;

public class Number implements Data {

	double value;
	boolean canBeNegative;
	boolean hasBeenDecimal=false;
	public Number(double val,boolean canBeNegative) {
	    this.canBeNegative=canBeNegative;
	    if(val<0) {
	    	canBeNegative=true;
	    }
	    this.setValue(val);
	}
	public Number(double val) {
		this(val,true);
	}
	public double getValue() {
		return value;
	}
	
	public void setValue(double val) {
		if(!canBeNegative) {
			if(val<0) {
				val=0;
			}
		}
		if(!hasBeenDecimal) {
			hasBeenDecimal=value != Math.floor(value);
		}
		this.value=val;
	}
	@Override
	public Text toText() {
		
		String s;
		if(hasBeenDecimal) {
			s=Double.toString(value);
		}else {
			s=Integer.toString((int)value);
			
			
		}
		return new Text(s);
	}

	@Override
	public DataTypes getTypeName() {
		return DataTypes.NUMBER;
	}
	@Override
	public Number toNumber() {
		return this;
	}
	@Override
	public Sprite toSprite() {
		throw new DataConversionException("Cannot convert Number to Sprite: "+value);
	}
	
	@Override
	public Direction toDirection() {
		return new Direction((int) value);
	}
	@Override
	public EasyCodeColor toColor() {
		throw new DataConversionException("Cannot convert Number to Color: "+value);
	}
	@Override
	public Position toPosition(Program ignored) {
		throw new DataConversionException("Cannot convert Number to Position: "+value);
	}
	public void changeValue(double amount) {
		setValue(value+amount);
		
	}
}
