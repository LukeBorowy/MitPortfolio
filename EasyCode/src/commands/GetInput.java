package commands;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

import compiler.SentenceMatcher;
import data.Data;
import data.DataTypes;
import main.CodeRoutine;
import main.Program;
import data.*;
public class GetInput implements Command {

	public GetInput() {
		
	}
	static final DataTypes[] inAndOutTypes={DataTypes.TEXT};//same type for in and out
    static SentenceMatcher pattern=new SentenceMatcher("|[ask;inquire] ?[the user ]?[|[\";']]{0}?[|[\";']]",inAndOutTypes.length);
    static SentenceMatcher exprPattern=new SentenceMatcher("?[the ]|[result of;response from;answer to] asking ?[|[\";']]{0}?[|[\";']]",inAndOutTypes.length);
	@Override
	public Data[] runCommand(Data[] input,Program p,CodeRoutine ignored) {
		BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        System.out.print(input[0].toText().getVal());
        String s = "";
        try {
			s = br.readLine();
		} catch (IOException e) {
			
			e.printStackTrace();
		}
        Data[] dataList= {new Text(s)};
		return dataList;
	}
    
	@Override
	public DataTypes[] getNeededData() {
		
		return inAndOutTypes;
	}

	@Override
	public DataTypes[] getOutputData() {
		return inAndOutTypes;
	}

	@Override
	public SentenceMatcher getPattern() {
		
		return pattern;
	}
	@Override
	public String getName() {
		
		return "GetInput";
	}

	@Override
	public SentenceMatcher[] getReturnLabels(String[] ignored) {
		final SentenceMatcher[] label= {new SentenceMatcher("?[the ]|[answer;response;result]")};
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
