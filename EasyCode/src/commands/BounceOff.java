package commands;

import compiler.SentenceMatcher;
import data.Data;
import data.DataTypes;
import data.Direction;
import data.Position;
import data.Sprite;
import events.CollisionListener;
import main.CodeRoutine;
import main.EasyCodeRuntimeException;
import main.Program;

public class BounceOff implements Command {


	static final DataTypes[] inTypes={DataTypes.SPRITE,DataTypes.POSITION};//var, pos
	static final DataTypes[] outTypes={};
    static SentenceMatcher pattern=new SentenceMatcher("?[|[make;have] ]|[it;{0}] bounce?[ |[off;away]]",inTypes.length);
    static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);
    
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine cause) {
		if(!cause.getTrigger().listenerType().equals("Collision")) {
			throw new EasyCodeRuntimeException("Bounce off of what?");
		}
		Sprite hitSprite=p.getMemAt(Program.SPIRTEHIT_IND).toSprite();
		Sprite bouncingSprite;
		if(input[0].getTypeName()==DataTypes.NONE) {
			bouncingSprite=((CollisionListener)cause.getTrigger()).getCollidingSprite();
		}else {
			bouncingSprite=input[0].toSprite();
		}
		
		double heading=bouncingSprite.getDirection().getDegrees();
		Position pos1=bouncingSprite.getPosition();
		Position pos2=hitSprite.getPosition();
		
		//TODO: This direction-getting stuff does not work. It needs to be added to the collision or even move parts in the PhysicsProcessor
		if(pos1.getY() <= pos2.getY() - (hitSprite.getHeight()/2)) {
			  //System.out.println("top");
			  
			  //pos1.setY(pos2.getY()-bouncingSprite.getHeight());
			  heading=180-heading;
			  //pos1.setY((pos2.getY()-hitSprite.getHeight()/2)-(bouncingSprite.getHeight()/2));//TODO: enable this once the above todo is done
			 

		}
		

		else if(pos1.getY() >= pos2.getY() + (hitSprite.getHeight()/2)) {
			//System.out.println("bottom");
			heading=180-heading;
			/*double targetY=(pos1.getY()+hitSprite.getHeight()/2+bouncingSprite.getHeight()/2+1);
			if(pos1.getY()<targetY) {
				  pos1.setY(pos1.getY());
				  System.out.println("tolow");
			  }*/


		}
		else if(pos1.getX() < pos2.getX()) {
			  //System.out.println("left");
			  heading=360-heading;
			  //bouncingSprite.getPosition().setX(pos1.getX()-hitSprite.getWidth()/2-bouncingSprite.getWidth()/2-1);

		}

		else if(pos1.getX() > pos2.getX()) {
			  //System.out.println("right");
			  heading=360-heading;
			  //bouncingSprite.getPosition().setX(pos1.getX()+hitSprite.getWidth()/2+bouncingSprite.getWidth()/2+1);

		}
		
		/*if(yPen>xPen) {
			System.out.println("a");
			heading=180-heading;
		}else {
			heading=heading;//TODO
			System.out.println("b");
		}*/
		bouncingSprite.setDirection(heading);//0=up
		
		
        Data[] dataList= {};
		return dataList;
	}
    
	@Override
	public DataTypes[] getNeededData() {
		
		return inTypes;
	}

	@Override
	public DataTypes[] getOutputData() {
		return outTypes;
	}

	@Override
	public SentenceMatcher getPattern() {
		
		return pattern;
	}
	@Override
	public String getName() {
		
		return "BounceOff";
	}

	@Override
	public SentenceMatcher[] getReturnLabels(String[] in) {
		SentenceMatcher[] label= {new SentenceMatcher("NONE")};
		return label;
	}

	@Override
	public int getDefaultReturnedData() {
		return -1;
	}

	@Override
	public SentenceMatcher getExpressionPattern() {
		return exprPattern;
	}

	@Override
	public boolean isStartOfBlock() {
		return false;
	}

}
