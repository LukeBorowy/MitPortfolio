package data;

import main.Program;

public interface Data {
	public Number toNumber();
	
	public Text toText();
	
	public Sprite toSprite();
	
	public Direction toDirection();
	
	public EasyCodeColor toColor();
	
	/**
	 * Convert to position
	 * @param p the program. Needed if the position is something like "the center of the screen"
	 * @return
	 */
	public Position toPosition(Program p);
	
	public DataTypes getTypeName();
	
	
}
