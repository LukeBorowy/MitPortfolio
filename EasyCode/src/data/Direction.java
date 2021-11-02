package data;

import main.Program;

public class Direction implements Data {

	static Direction UP=new Direction("up");
	static Direction DOWN=new Direction("down");
	static Direction RIGHT=new Direction("right");
	static Direction LEFT=new Direction("left");

	int heading;
	public Direction(int angle) {
		heading=angle;
	}
	public Direction(String dir) {
		heading=stringToHeading(dir);
	}

	int stringToHeading(String h) {
		h=h.toLowerCase();
		if(h.equals("up")) {
			return 0;
		}else if(h.equals("right")) {
			return 90;
		}else if(h.equals("down")) {
			return 180;
		}else if(h.equals("left")) {
			return 270;
		}else {
			throw new DataConversionException("Cannot convert string to direction:"+h);
		}
	}
	String headingToString(int heading) {
		int rounded=90*(Math.round(heading/90));
		if(rounded==0) {
			return "up";
		}else if(rounded==90) {
			return "right";
		}else if(rounded==180) {
			return "down";
		}else if(rounded==270) {
			return "left";
		}else {
			throw new DataConversionException("Cannot convert direction to string:"+heading);
		}
		
	}
	public double[] getVelocity() {
		double radians = (Math.PI / 180) * (heading-90); //-90 so that 0deg=up
		double[] vel= {Math.cos(radians),Math.sin(radians)};
	    return vel;
	}
	@Override
	public Number toNumber() {
		return new Number(heading);
	}

	@Override
	public Text toText() {
		return new Text(headingToString(heading));
	}

	@Override
	public Sprite toSprite() {
		throw new DataConversionException("Cannot convert Direction to Sprite");
	}

	@Override
	public DataTypes getTypeName() {
		return DataTypes.DIRECTION;
	}
	@Override
	public Direction toDirection() {
		return this;
	}
	@Override
	public EasyCodeColor toColor() {
		throw new DataConversionException("Cannot convert Direction to Color");
	}
	@Override
	public Position toPosition(Program ignored) {
		throw new DataConversionException("Cannot convert Direction to Position");
	}
	public double getDegrees() {
		return heading;
	}
	/**
	 * 
	 * @param degrees 0 is up
	 */
	public void setDegrees(double degrees) {
		heading=(int) degrees;
		
	}
	

}
