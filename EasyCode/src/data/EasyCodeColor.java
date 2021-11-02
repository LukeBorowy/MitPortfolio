package data;

import java.awt.Color;

import main.Program;

public class EasyCodeColor implements Data {

	String colorName;
	Color color;
	public EasyCodeColor(String color) {
		color=color.toLowerCase();
		colorName=color;
		if(color.equals("blue")){
			this.color=Color.BLUE;
		}else if(color.equals("green")){
			this.color=Color.GREEN;
		}else if(color.equals("red")){
			this.color=Color.RED;
		}else if(color.equals("yellow")){
			this.color=Color.YELLOW;
		}else if(color.equals("purple")){
			this.color=new Color(125,0,255);
		}else if(color.equals("black")){
			this.color=Color.BLACK;
		}else if(color.equals("orange")){
			this.color=new Color(255,140,0);
		}else {
			throw new DataConversionException("Cannot get Color from name: "+color);
		}
	}
	
	public Color getColor() {
		return color;
	}

	@Override
	public Number toNumber() {
		throw new DataConversionException("Cannot convert Color to Number: "+colorName);
	}

	@Override
	public Text toText() {
		return new Text(colorName);
	}

	@Override
	public Sprite toSprite() {
		throw new DataConversionException("Cannot convert Color to Sprite: "+colorName);
	}

	@Override
	public DataTypes getTypeName() {
		return DataTypes.COLOR;
	}
	@Override
	public Direction toDirection() {
		throw new DataConversionException("Cannot convert Color to Direction: "+colorName);	
	}

	@Override
	public EasyCodeColor toColor() {
		return this;
	}
	@Override
	public Position toPosition(Program ignored) {
		throw new DataConversionException("Cannot convert Color to Position");
	}

}
