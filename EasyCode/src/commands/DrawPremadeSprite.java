package commands;

import java.awt.Color;

import compiler.SentenceMatcher;
import data.Data;
import data.DataTypes;
import data.EasyCodeColor;
import data.Position;
import data.Sprite;
import main.CodeRoutine;
import main.Program;

public class DrawPremadeSprite implements Command {
//TODO: this file, sort of a replace for spritefromshape, use this sentancemather there as a exprPattern
	public DrawPremadeSprite() {
		
	}
	static final DataTypes[] inTypes={DataTypes.TEXT,DataTypes.POSITION,DataTypes.COLOR,DataTypes.NUMBER,DataTypes.NUMBER};//name, pos, color, width, height
	static final DataTypes[] outTypes={DataTypes.SPRITE,DataTypes.NUMBER,DataTypes.NUMBER, DataTypes.POSITION};//sprite,health,speed, position
    static SentenceMatcher pattern=new SentenceMatcher("?[ a] ?[{3}?[ ]|[by;x]?[ ]{4} ]?[{2} ]?[{3} by {4} ]{0}?[ that is ?[|[colored;the color of] ]{2}]?[ |[in;at;on] {1}]",inTypes.length);
    static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);
    
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine ignored) {
		String shape=input[0].toText().getVal();
		if(shape.equals("square")) {
			shape="rectangle";
		}
		Position pos=input[1].toPosition(p);
		EasyCodeColor color=input[2].toColor();
		int width=(int) input[3].toNumber().getValue();
		int height=(int) input[4].toNumber().getValue();
		Sprite s=new Sprite(pos,width, height, shape,null,color,p);
		
        Data[] dataList= {s,s.getHealth(),s.getSpeed(), s.getPosition()};
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
		
		return "SpriteFromShape";
	}

	@Override
	public SentenceMatcher[] getReturnLabels(String[] in) {
		String spriteLabel="?[the ]?["+in[2]+" ]"+in[0];
		String healthLabel="|[health;hitpoints]";
		String speedLabel="?[movement ]speed";
		String posLabel="|[position;location]";
		String propLabel=String.format("|["+spriteLabel+"'s %%1$s;?[the ]%%1$s of "+spriteLabel+"]");
		SentenceMatcher[] label= {new SentenceMatcher(spriteLabel),
				new SentenceMatcher(String.format(propLabel, healthLabel)),
				new SentenceMatcher(String.format(propLabel, speedLabel)),
				new SentenceMatcher(String.format(propLabel, posLabel))};
		return label;
	}

	@Override
	public int getDefaultReturnedData() {
		return 0;
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
