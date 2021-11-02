package compiler;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import compiler.FoundArgs.FoundArg;
import data.DataTypes;
import main.CodeLine;
import main.Program;

public class Compiler {

	
	
	public static Program compile(List<String> lines) {
		List<CodeLine> codeLines=new ArrayList<CodeLine>();
		List<MemoryCell> memSkeleton=new ArrayList<MemoryCell>();
		List<Literal> literals=new ArrayList<Literal>();
		
		for(int i=0;i<lines.size();i++) {
			String l=lines.get(i);
			if(l.endsWith(".")) {
				lines.set(i, l.substring(0, l.length()-1));
			}
		}
		
		Parser parser=new Parser(lines);
		List<LineSkeleton> parsedLines=parser.parse();
		for(LineSkeleton l:parsedLines) {
			System.out.println(l.toString());
		}
		
		initiateSpecialIndices(memSkeleton, literals);
		
		for(int j=0;j<parsedLines.size();j++) {
			compileLine(codeLines, memSkeleton, literals, parsedLines, j);
			
		}
		System.out.println();//newline
		for(Literal l:literals) {
			System.out.println(l.toString());
		}
		for(CodeLine l:codeLines) {
			System.out.println(l.toString());
		}
		
		
		Program program=new Program(codeLines, memSkeleton.size()+literals.size(), literals);
		return program;
	}
	/**
	 * @param codeLines
	 * @param memSkeleton
	 * @param literals
	 * @param parsedLines
	 * @param j
	 */
	private static void compileLine(List<CodeLine> codeLines, List<MemoryCell> memSkeleton, List<Literal> literals,
			List<LineSkeleton> parsedLines, int j) {
		LineSkeleton line=parsedLines.get(j);
		
		List<Integer> outMem = storeOutputData(memSkeleton, j, line);
		
		
		
		List<Integer> inMem = findInputData(codeLines, memSkeleton, literals, j, line);
		
		CodeLine codeLine=new CodeLine(line.command,toIntArray(inMem),toIntArray(outMem),line.getSubDepth());
		codeLines.add(codeLine);
	}
	/**
	 * @param memSkeleton
	 * @param j
	 * @param line
	 * @return
	 */
	private static List<Integer> storeOutputData(List<MemoryCell> memSkeleton, int j, LineSkeleton line) {
		List<FoundArgs.FoundArg> orderedArgs=line.args.getOrderedArgs();
		String[] argsText=new String[orderedArgs.size()];
		for(int i=0;i<orderedArgs.size();i++) {
			argsText[i]=orderedArgs.get(i).getArg();
		}
		
		List<Integer> outMem = allocateMemory(memSkeleton, j, line, argsText);
		return outMem;
	}
	/**
	 * @param codeLines
	 * @param memSkeleton
	 * @param literals
	 * @param j
	 * @param line
	 * @return
	 */
	private static List<Integer> findInputData(List<CodeLine> codeLines, List<MemoryCell> memSkeleton,
			List<Literal> literals, int j, LineSkeleton line) {
		List<Integer> inMem=new ArrayList<Integer>();
		DataTypes[] inData=line.command.getNeededData();
					
		List<List<FoundArgs.FoundArg>> argGroups=line.getArgGroups();
		
		List<List<String>> wordGroups=new ArrayList<List<String>>();
		
		List<List<Integer>> argInds=new ArrayList<List<Integer>>();
		for(List<FoundArgs.FoundArg> group:argGroups) {
			List<String> words=new ArrayList<String>();
			
			List<Integer> inds=new ArrayList<Integer>();
			for(FoundArgs.FoundArg a:group) {
				inds.add(a.argInd);
				String[] argWords=a.getWords();
				for(String word:argWords) {
					words.add(word);
				}
			}
			wordGroups.add(words);
			argInds.add(inds);
		}
		
		List<ArgPossibility> bestPossibleArgs = determineBestArgCombo(memSkeleton, j, line, argGroups, wordGroups,
				argInds);
		
		String[] args=new String[line.command.getNeededData().length];
		Arrays.fill(args, "NOT_GIVEN");
		for(ArgPossibility arg:bestPossibleArgs) {
			for (int i = 0; i < arg.args.length; i++) {
				int ind=arg.argInds.get(i);
				if(ind!=-1) {
					String a=arg.args[i];
					if(a.length()>0) {
						args[ind]=a;
					}
				}
			}
		}//TODO: Have new mem cells generated when an event handler is re-triggered, so you can reference a different generated thing.
		determineMemoryReferences(codeLines, memSkeleton, literals, j, line, inMem, inData, args);
		return inMem;
	}
	/**
	 * @param memSkeleton
	 * @param j
	 * @param line
	 * @param argsText
	 * @return
	 */
	private static List<Integer> allocateMemory(List<MemoryCell> memSkeleton, int j, LineSkeleton line,
			String[] argsText) {
		SentenceMatcher[] patterns=line.command.getReturnLabels(argsText);
		
		
		DataTypes[] outData=line.command.getOutputData();
		List<Integer> outMem=new ArrayList<Integer>();
		for(int i=0;i<outData.length;i++) {
			DataTypes d=outData[i];
			int memInd=memSkeleton.size();
			outMem.add(memInd);
			memSkeleton.add(new MemoryCell(memInd,d,patterns[i],j));
		}
		return outMem;
	}
	/**
	 * @param codeLines
	 * @param memSkeleton
	 * @param literals
	 * @param j
	 * @param line
	 * @param inMem
	 * @param inData
	 * @param args
	 */
	private static void determineMemoryReferences(List<CodeLine> codeLines, List<MemoryCell> memSkeleton, List<Literal> literals,
			int j, LineSkeleton line, List<Integer> inMem, DataTypes[] inData, String[] args) {
		args=line.args.fillInDefaults(args);
		for(int k=0;k<args.length;k++) {
			String arg=args[k];
			if(arg.startsWith("SUB_START_UP_")) {
				int targetLine=j-Integer.parseInt(arg.substring(13));//13 because that is the length of SUB_START_UP_
				arg=targetLine+" "+(j-1);//j-1 because sub does not include the assigning line
				
			}
			int ref;
			if(arg.startsWith("REF_UP_")) {
				int targetLine=j-Integer.parseInt(arg.substring(7));//7 because that is the length of REF_UP_
				int targetArg=codeLines.get(targetLine).command.getDefaultReturnedData();
				ref=getMemIndForLine(targetLine, targetArg, codeLines);
				
			}else if(arg.equals("NOT_GIVEN")){
				ref=0;//0 is NOT_GIVEN for everything
			}
			else {
				
				int res;
				try {
					res = getMemIndFromString(arg, memSkeleton,j,inData[k]);
				} catch (UnclearReferenceException e) {
					res=-1;//TODO: figure out what to do here.
				}
				
				if(res==-1) {
					
					int ind=memSkeleton.size();
					DataTypes dType=inData[k];
					Literal literal=new Literal(ind,dType,arg);
					literals.add(literal);
					memSkeleton.add(new MemoryCell(literal, j));
					ref=ind;
				}else {
					ref=res;
				}
				
			}

			inMem.add(ref);
		}
	}
	/**
	 * @param memSkeleton
	 * @param j
	 * @param line
	 * @param argGroups
	 * @param wordGroups
	 * @param argInds
	 * @return
	 */
	private static List<ArgPossibility> determineBestArgCombo(List<MemoryCell> memSkeleton, int j, LineSkeleton line,
			List<List<FoundArgs.FoundArg>> argGroups, List<List<String>> wordGroups, List<List<Integer>> argInds) {
		List<ArgPossibility> bestPossibleArgs =new ArrayList<ArgPossibility>();//holds lists of possible args, for each arg group
		for(int i=0;i<wordGroups.size();i++) {
			List<String[]> possible=LineSkeleton.getPossibleArgs(wordGroups.get(i).toArray(new String[0]), argGroups.get(i).size());
			List<ArgPossibility> possibleArgs=new ArrayList<ArgPossibility>();
			for(int k=0;k<possible.size();k++) {
				String[] p=possible.get(k);
				ArgPossibility possibility=new ArgPossibility(p,argInds.get(i));
				int argScore=0;
				for(int ind=0;ind<possibility.args.length;ind++) {
					String a=possibility.args[ind];
					if(a.length()==0) {
						a="NOT_GIVEN";
					}
					int argInd=argInds.get(i).get(ind);
					if(a.startsWith("SUB_START_UP_")||a.startsWith("REF_UP_")||a.equals("NOT_GIVEN")) {
						argScore+=3;
						possibility.scoreReasons.add("Builtin");
					}else {
						DataTypes argType=line.command.getNeededData()[argInd];
						int res;
						try {
							res=getMemIndFromString(a, memSkeleton,j,argType);
						}catch(UnclearReferenceException e) {
							res=-1;//TODO: perhaps change score? ask user?
						}
						if(res!=-1) {
							argScore+=10;
							possibility.scoreReasons.add("Reference");
						}else {
							boolean canConvert=DataTypes.canConvert(a, argType);
							if(canConvert) {
								argScore+=5;
								possibility.scoreReasons.add("CanConvert");
							}
						}
					}
				}
				possibility.setArgScore(argScore);
				possibleArgs.add(possibility);
			}
			possibleArgs.sort((a, b) -> Integer.compare(a.argScore,b.argScore));//sort by argScore. we want the one with the most.
			ArgPossibility best=possibleArgs.get(possibleArgs.size()-1);//get the one with the most refs (last elem)
			if(possibleArgs.size()>1) {
		    	//Check if the second best has the same score. If so, it is unclear
				if(possibleArgs.get(possibleArgs.size()-2).argScore==best.argScore) {//-2 to to get the 2nd-best
		    		throw new UnclearCommandException("Multiple best args.");
		    	}
			}
			bestPossibleArgs.add(best);
			
		}
		return bestPossibleArgs;
	}
	/**
	 * @param memSkeleton 
	 * @param literals 
	 */
	private static void initiateSpecialIndices(List<MemoryCell> memSkeleton, List<Literal> literals) {
		literals.add(new Literal(0,DataTypes.NONE,"NOT_GIVEN"));//Initialize the not_given memory
		memSkeleton.add(new MemoryCell(0,DataTypes.NONE,new SentenceMatcher("NONE"),0));
		
		//Init the event variables.
		//key pressed
		memSkeleton.add(new MemoryCell(Program.KEYPRESS_IND,DataTypes.KEYPRESS,new SentenceMatcher("|[the ;which ]key ?[that ]?[|[was;got] ]|[pressed;typed]"),0));
		literals.add(new Literal(Program.KEYPRESS_IND,DataTypes.KEYPRESS,"[pressed key]"));
		//sprite collided
		memSkeleton.add(new MemoryCell(Program.SPIRTEHIT_IND,DataTypes.SPRITE,new SentenceMatcher("|[the ;which ]|[sprite;thing;object] ?[that ]?[|[was;got] ]|[hit;touched]"),0));
		literals.add(new Literal(Program.SPIRTEHIT_IND,DataTypes.SPRITE,"side"));
	}
	static int[] toIntArray(List<Integer> list)  {
	    int[] ret = new int[list.size()];
	    int i = 0;
	    for (Integer e : list)  
	        ret[i++] = e;
	    return ret;
	}
	static class ArgPossibility{
		String[] args;
        int argScore=0;
		List<Integer> argInds;
		public List<String> scoreReasons=new ArrayList<String>();
		public ArgPossibility(String[] args,List<Integer> argInds) {
			this.args=args;
			this.argInds=argInds;
			
		}
		public void setArgScore(int refs) {
			argScore=refs;
		}
		public String toString() {
			return Arrays.toString(args)+"(score "+argScore+")(Inds "+argInds+")";
		}
	}
	
    static class MemoryCell{
    	int index;
    	static List<Integer> usedInds=new ArrayList<Integer>();
    	DataTypes type;
    	SentenceMatcher pattern;
    	int fromLine;
    	boolean isFromCommand;
    	String literalText;
    	/**
    	 * This is a memory cell for data given to and returned from commands. 
    	 * 
    	 * @param index the memory index where this will be
    	 * @param type the datatype that this will hold
    	 * @param refPattern the pattern that future lines may refer to this as
    	 * @param fromLine the line that this is for or from
    	 * @param isFromCommand if this memory cell is for the output of a command
    	 * @param literalText if it is for a literal, this should be the literals's strValue. otherwise should be null
    	 */
    	private MemoryCell(int index,DataTypes type,SentenceMatcher refPattern,int fromLine,boolean isFromCommand,String literalText) {
    		assert(isFromCommand == (literalText==null));
    		
    		if(usedInds.contains(index)) {
    			throw new CompilerException("Index is already used for memory. Index:"+index);
    		}else {
    			usedInds.add(index);
    		}
    		this.index=index;
    		this.isFromCommand=isFromCommand;
    		this.type=type;
    		this.pattern=refPattern;
    		this.fromLine=fromLine;
    		this.literalText=literalText;
    		
    	}
    	public MemoryCell(int index,DataTypes type,SentenceMatcher refPattern,int fromLine) {
    		this(index,type,refPattern,fromLine,true,null);
    	}
    	public MemoryCell(Literal literal,int forLine) {
    		
    		this(literal.index,literal.type,new SentenceMatcher("NONE"),forLine,false,literal.strValue);
    	}
    	public String toString() {
    		String label;
    		if(isFromCommand) {
	    		if(this.pattern.isNone()) {
	    			label="NONE";
	    		}else {
	    			label=this.pattern.possibleStrings.get(0);
	    		}
	    		return label+" | Type "+this.type+" | From line "+this.fromLine;
    		}else {
    			return "Literal | "+this.literalText+" | Type "+this.type+" | For line "+this.fromLine;
    		}
    	}
    }
    
    public static class Literal{
    	int index;
    	static List<Integer> usedInds=new ArrayList<Integer>();
    	DataTypes type;
    	String strValue;
    	public Literal(int index,DataTypes type,String strValue) {
    		if(usedInds.contains(index)) {
    			throw new CompilerException("Index is already used for constant. Index:"+index);
    		}else {
    			usedInds.add(index);
    		}
    		this.index=index;
    		this.type=type;
    		this.strValue=strValue;
    		if(strValue.equals("NOT_GIVEN")) {
    			this.type=DataTypes.NONE;
    		    this.index=0;
    		}
    	}
    	
    	public int getIndex() {
			return index;
		}

		public DataTypes getType() {
			return type;
		}

		public String getStrValue() {
			return strValue;
		}

		@Override
    	public String toString() {
    		String s=strValue;
    		s=String.format("%-20s",s);
    		s+="--> ";
    	    s+=index;
    		return s;
    	}
    }
	static int getMemIndFromString(String text,List<MemoryCell> memory,int currLine,DataTypes targetType) {
		int ind=-1;
		int bestConvertScore=0;
		for(int i=0;i<memory.size();i++) {
			MemoryCell mem=memory.get(i);
		    if(mem.fromLine>=currLine) {
		    	continue;
		    }
			if(mem.pattern.matchesText(text)) {
				int convertScore=DataTypes.getConvertPossibilty(mem.type,targetType);
				if(convertScore>bestConvertScore) {//TODO: make it return convertScore as well.
					bestConvertScore=convertScore;
					if(ind==-1) {
						ind=i;
					}else {
						//TODO: Really, if the scores are different we should not throw exception.
						//throw new UnclearReferenceException(text);
					}
				}
			}
		}
		return ind;
	}
	static int getMemIndForLine(int line,int argInd,List<CodeLine> lines) {
		return lines.get(line).outMemPos[argInd];
	}
	
	

}
