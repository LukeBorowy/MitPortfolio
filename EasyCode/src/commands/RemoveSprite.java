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

public class RemoveSprite implements Command {

	public RemoveSprite() {
		
	}
	static final DataTypes[] inTypes={DataTypes.SPRITE, DataTypes.NUMBER};//thing, [destroy, hide, or show]
	static final DataTypes[] outTypes={};
    static SentenceMatcher pattern=new SentenceMatcher("|[|[|[delete;destroy;remove]{1(0)};|[hide;cover]{1(1)};|[show;unhide;reveal;uncover]{1(2)}] {0};make {0} |[|[go away;die;disappear]{1(0)};?[be ]|[invisible;hidden;clear]{1(1)};|[visible;shown;uncovered]{1(2)}]]",inTypes.length) ;
    static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);
    
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine ignored) {
		Sprite sprite=input[0].toSprite();
		int mode=(int) input[1].toNumber().getValue(); //[destroy, hide, or show]
		if(mode==0) {
	        sprite.delete();
		}else if (mode==1) {
			sprite.setVisible(false);
		}else if (mode==2) {
			sprite.setVisible(true);;
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
		
		return "RemoveSprite";
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
