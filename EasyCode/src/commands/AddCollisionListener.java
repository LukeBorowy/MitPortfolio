package commands;

import compiler.FoundArgs;
import compiler.SentenceMatcher;
import data.Data;
import data.DataConversionException;
import data.DataTypes;
import data.Sprite;
import events.EventListener;
import events.WindowController;
import main.CodeRoutine;
import main.EasyCodeRuntimeException;
import main.Program;

public class AddCollisionListener implements Command {
	static final DataTypes[] inTypes={DataTypes.SPRITE,DataTypes.SPRITE,DataTypes.TEXT};//sprite, sprite, subroutine
	static final DataTypes[] outTypes={};
    static SentenceMatcher pattern=new SentenceMatcher("|[when;if] {0} |[hits;touches;collides with;bumps] {1}, {<2>}",inTypes.length);
    static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);
    
    static SentenceMatcher sidePattern= new SentenceMatcher("?[the ]|[left{0(left)};right{0(right)};top{0(top)};bottom{0(bottom)};side?[s]{0(any)}]?[ |[side;edge]]?[ of the |[screen;window]]",1);
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine ignored) {

		Sprite collidingSprite=input[0].toSprite();
		Sprite[] spritesToBeHit=null;
		
		if(input[1].getTypeName()==DataTypes.SPRITE) {
			spritesToBeHit=new Sprite[] {input[1].toSprite()};
		}else if(input[1].getTypeName()==DataTypes.TEXT) {
			FoundArgs matched=sidePattern.fitIntoPattern(input[1].toText().getVal());
			if(matched==null) {
				throw new DataConversionException("Cannot convert text '"+input[1].toText().getVal()+"' to Sprite");
			}
			
			String side=matched.getArgs().get(0).getText();
			if(side.equals("left")) {
				spritesToBeHit=new Sprite[] {p.getEventHandlers().leftEdge};
			}else if(side.equals("right")) {
				spritesToBeHit=new Sprite[] {p.getEventHandlers().rightEdge};
			}else if(side.equals("top")) {
				spritesToBeHit=new Sprite[] {p.getEventHandlers().topEdge};
			}else if(side.equals("bottom")){
				spritesToBeHit=new Sprite[] {p.getEventHandlers().bottomEdge};
			}else if(side.equals("any")){
				WindowController h=p.getEventHandlers();
				spritesToBeHit=new Sprite[] {h.bottomEdge,h.topEdge,h.leftEdge,h.rightEdge};
			}else {
				throw new EasyCodeRuntimeException("Side not found: "+side);
			}
		}else {
			throw new DataConversionException("Cannot convert '"+input[1].toText().getVal()+"' to Sprite");

		}
		
		
		int[] bounds=EventListener.getLinesFromString(input[2].toText().getVal());
		int start=bounds[0];
		int end=bounds[1];
		
		p.getEventHandlers().addCollisionListener(start, end, this, collidingSprite, spritesToBeHit);
		
		return new Data[] {};//no return data

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
		
		return "AddCollisionListener";
	}

	@Override
	public SentenceMatcher[] getReturnLabels(String[] ignored) {
		final SentenceMatcher[] label= {new SentenceMatcher("NONE")};
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
		return true;
	}

}
