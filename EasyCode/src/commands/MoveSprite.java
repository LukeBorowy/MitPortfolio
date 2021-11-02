package commands;

import java.awt.Color;

import compiler.SentenceMatcher;
import data.Data;
import data.DataTypes;
import data.Direction;
import data.Sprite;
import main.CodeRoutine;
import main.Program;

public class MoveSprite implements Command {

	public MoveSprite() {
		
	}

	static final DataTypes[] inTypes={DataTypes.SPRITE,DataTypes.DIRECTION,DataTypes.NUMBER};//sprite, direction, distance
	static final DataTypes[] outTypes={};
    static SentenceMatcher pattern=new SentenceMatcher("move ?[the ]{0 1 2}",inTypes.length);
    static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);
    
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine routine) {
		Sprite sprite=input[0].toSprite();
		
		int dist=-1;//aka sprite default
		Direction dir=null;
		if(input[1].getTypeName()!=DataTypes.NONE) {
			dir=input[1].toDirection();
		}else {
			if(routine.getTrigger().listenerType().equals("KeyDown")) {
				dir=p.getMemAt(p.KEYPRESS_IND).toDirection();
			}
		}
		if(input[2].getTypeName()!=DataTypes.NONE) {
			dist=(int)Math.round(input[2].toNumber().getValue());
		}
		if(dist==-1) {
			
			sprite.move(dir);
		}else {
			sprite.move(dir,dist);
		}

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
		
		return "MoveSprite";
	}

	@Override
	public SentenceMatcher[] getReturnLabels(String[] in) {
		final SentenceMatcher[] label= {};
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
