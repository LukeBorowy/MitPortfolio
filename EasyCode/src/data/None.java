package data;

import main.Program;

public class None implements Data {

	public None() {
		// TODO Auto-generated constructor stub
	}

	@Override
	public Number toNumber() {
		throw new DataConversionException("Converting None (an ungiven arg)");
	}

	@Override
	public Text toText() {
		throw new DataConversionException("Converting None (an ungiven arg)");
	}

	@Override
	public DataTypes getTypeName() {
		
		return DataTypes.NONE;
	}

	@Override
	public Sprite toSprite() {
		throw new DataConversionException("Converting None (an ungiven arg)");
	}

	@Override
	public Direction toDirection() {
		throw new DataConversionException("Converting None (an ungiven arg)");
	}
	
	@Override
	public EasyCodeColor toColor() {
		throw new DataConversionException("Converting None (an ungiven arg)");
	}
	@Override
	public Position toPosition(Program ignored) {
		throw new DataConversionException("Converting None (an ungiven arg)");
	}

}
