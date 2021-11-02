package data;

import main.Program;

public class Text implements Data {

	String text;
	public Text(String t) {
		this.text=t;
	}
	
	public String getVal() {
		return text;
	}

	@Override
	public Number toNumber() {
		try {
			return new Number(Double.parseDouble(text));
		}catch(NumberFormatException e) {
			throw new DataConversionException("Cannot convert Text to Number: "+text);
		}
	}

	@Override
	public DataTypes getTypeName() {
		// TODO Auto-generated method stub
		return DataTypes.TEXT;
	}

	@Override
	public Text toText() {
		return this;
	}

	@Override
	public Sprite toSprite() {
		throw new DataConversionException("Cannot convert Text to Sprite: "+text);
	}
	
	@Override
	public Direction toDirection() {
		return new Direction(text);
	}

	@Override
	public EasyCodeColor toColor() {
		return new EasyCodeColor(text);
	}
	
	@Override
	public String toString() {
		return text;
	}
	@Override
	public Position toPosition(Program p) {
		return Position.posFromString(text,p);
	}

}
