package commands;

import compiler.SentenceMatcher;
import data.Data;
import data.DataTypes;
import data.Direction;
import data.Number;
import data.Sprite;
import main.CodeRoutine;
import main.Program;

public class ChangeSpriteProp implements Command {

	static final DataTypes[] inTypes={DataTypes.SPRITE,DataTypes.NUMBER,DataTypes.NUMBER,DataTypes.NUMBER};//sprite, statID, amnt, sign. StatID:health=0;speed=1;
	static final DataTypes[] outTypes={};
    static SentenceMatcher pattern=new SentenceMatcher("{2(1)}|[|[|[{1(0)}|[|[hurt;damage]{3(-1)};|[heal;regen]{3(1)}];{1(1)}|[|[speed?[ up];boost]{3(1)};slow?[ down]{3(-1)}]];|[{3(1)}|[increase;change];{3(-1)}|[decrease;reduce]] ?[the |[health{1(0)};speed{1(1)}] of ]]{0}?['s |[|[health;hitpoints]{1(0)};?[move?[ment] ]speed{1(1)}]]?[ ?[by ]{2}];{1(1)}|[make;have] {0} ?[|[go;move] ]?[{2} ]|[slower{3(-1)};faster{3(1)}]]",inTypes.length);
    static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);
    
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine routine) {
		Sprite sprite=input[0].toSprite();
		
		double changeBy=input[2].toNumber().getValue()*input[3].toNumber().getValue();
		
		int statID=(int) input[1].toNumber().getValue();

		Number prop=null;
		if(statID==0) {
			prop=sprite.getHealth();
		}else if (statID==1) {
			prop=sprite.getSpeed();
		}
		double val=prop.getValue();
		val+=changeBy;
		prop.setValue(val);
		
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
		
		return "ChangeSprite";
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
