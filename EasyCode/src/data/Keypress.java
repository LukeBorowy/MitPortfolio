package data;

import java.awt.event.KeyEvent;

import main.Program;

public class Keypress implements Data {

	int keyCode;
	public Keypress(int keyCode) {
		this.keyCode=keyCode;
	}

	@Override
	public Number toNumber() {
		//TODO make it return the number if keypress was a number key
		return new Number(keyCode);
	}

	@Override
	public Text toText() {
		
		return new Text(KeyEvent.getKeyText(keyCode));
	}

	@Override
	public Sprite toSprite() {
		throw new DataConversionException("Can't convert Keypress to Sprite");
		
	}

	@Override
	public DataTypes getTypeName() {
		return DataTypes.KEYPRESS;
	}

	@Override
	public Direction toDirection() {
		return new Direction(KeyEvent.getKeyText(keyCode));
	}

	@Override
	public EasyCodeColor toColor() {
		throw new DataConversionException("Can't convert Keypress to Color");
	}
	@Override
	public Position toPosition(Program ignored) {
		throw new DataConversionException("Cannot convert Keypress to Position");
	}

}
