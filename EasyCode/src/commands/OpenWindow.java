package commands;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import compiler.SentenceMatcher;
import data.Data;
import data.DataTypes;
import data.Text;
import graphics.DisplayWindow;
import main.CodeRoutine;
import main.Program;

public class OpenWindow implements Command {

	public OpenWindow() {
		
	}

	static final DataTypes[] inTypes={DataTypes.NUMBER,DataTypes.NUMBER,DataTypes.TEXT};
	static final DataTypes[] outTypes={};
    static SentenceMatcher pattern=new SentenceMatcher("|[open;create;start;make] a ?[new ]?[{0}?[ ]|[x;by]?[ ]{1} ]?[|[display;drawing;game] ]|[window;frame;box;area]?[ |[called;named;titled] ?[|[\";']]{2}?[|[\";']]]?[ ?[that is ]?[sized ]{0}?[ ]|[x;by]?[ ]{1}]",inTypes.length);
    static SentenceMatcher exprPattern=new SentenceMatcher("NONE",inTypes.length);
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine ignored) {
		int width=350;
		int height=350;
		String name="Display";
		if(input[0].getTypeName()!=DataTypes.NONE) {//TODO: replace with built-in defaults in pattern
			width=(int)Math.round(input[0].toNumber().getValue());
		}
		if(input[1].getTypeName()!=DataTypes.NONE) {
			height=(int)Math.round(input[1].toNumber().getValue());
		}
		if(input[2].getTypeName()!=DataTypes.NONE) {
			name=input[2].toText().getVal();
		}
		DisplayWindow d=new DisplayWindow(width, height, name,p);
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
		
		return "OpenWindow";
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
		return false;
	}

}
