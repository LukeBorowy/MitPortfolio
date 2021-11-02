package compiler;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import commands.Command;
import commands.CommandList;

public class Parser {
	List<String> lines;
	int currentLine=0;
	int currSubDepth=0;
	public Parser(List<String> lines) {
		this.lines=lines;
	}
	public List<LineSkeleton> parse() {
		
		List<LineSkeleton> parsedLines=new ArrayList<LineSkeleton>();
	
		while(currentLine<lines.size()) {
			
			String line=lines.get(currentLine);
			line=line.toLowerCase();
			if(line.length()>0) {
				parsedLines.addAll(getLineSkeleton(line,false));
			}
			currentLine++;
			
		}
		
		return parsedLines;
		
	}
	List<LineSkeleton> getLineSkeleton(String text,boolean expr) {
		List<LineSkeleton> parsedLines=new ArrayList<LineSkeleton>();
		
		LineSkeleton parsed = determineCommandAndArgs(text, expr);
		if(parsed==null) { // this will be entered if this is an expression and no command was found, AKA the text is a literal.
			if(!expr) {
				throw new CompilerException("This should never happen.");
			}
			return null;
		}
		int offset=0;
		List<FoundArgs.FoundArg> foundArgs=parsed.args.getArgs();
		for(int i=0;i<foundArgs.size();i++) {
			FoundArgs.FoundArg arg=foundArgs.get(i);
			boolean isCode=arg.isCode();
			
			if(isCode) {
				currSubDepth+=1;
				List<LineSkeleton> result=new ArrayList<LineSkeleton>();
				
				List<String> subLines=getSubLines(arg.getArg());
				
				
					
				for(int j=0;j<subLines.size();j++) {
					String subLine=subLines.get(j);
					String totalLine=String.join(". ", subLines.subList(j,subLines.size()));
					
					List<LineSkeleton> subParsed;
					try {
						subParsed = getLineSkeleton(totalLine,false);
						LineSkeleton mainLine=subParsed.get(subParsed.size()-1);
						if(mainLine.isStartOfBlock()) {
							//good, that means it should include all the rest of the line.
							j=subLines.size();
						}else {
							subParsed = getLineSkeleton(subLine,false);
						}
					} catch (UnknownCommandException e) {
						subParsed = getLineSkeleton(subLine,false);
					}
					
					for(LineSkeleton l:subParsed) {
						if(l.getSubDepth()<currSubDepth) {
							l.setSubDepth(currSubDepth);
						}
					}
					result.addAll(subParsed);
				}
					
				
				
				arg.setArg("SUB_START_UP_"+result.size());
				parsedLines.addAll(0,result);
				currSubDepth-=1;
				
				
				
			}else {
				List<LineSkeleton> result=getLineSkeleton(arg.getArg(),true);//if arg is not code, it is an expression
				if(result==null) {
					//if null, it is literal
				}else {
					
					arg.setArg("REF_UP_"+(1+offset));
					offset+=result.size();
					
					
					parsedLines.addAll(0, result);
				}
			
			}
			
		}
		
		parsedLines.add(parsed);//no matter what, the main line must be added
		return parsedLines;
		
	}
	/**
	 * @param text
	 * @param expr
	 * @return a LineSkeleton with the basic information filled in.
	 */
	private LineSkeleton determineCommandAndArgs(String text, boolean expr) {
		LineSkeleton parsed;
		LineSkeleton[] possible=CommandList.getCommand(text,expr);
		int len=possible.length;

		if(len==0) {
			if(!expr) {
				
				throw new UnknownCommandException(text);
				
			}else {
				return null;//if it's an expression, and no command found, it is literal
			}
		}else if(len==1) {
			parsed=possible[0];
		}else {
			Arrays.sort(possible,(a, b) -> Integer.compare(a.args.totalLength,b.args.totalLength));//sort by total size. we want the shortest one because that means that it does not include bits of the command in it.
			//TODO make this sort by the arg conversion possibility, similar to the thing in Compiler.
			parsed=possible[0];
			if(parsed.args.totalLength==possible[1].args.totalLength) {
				throw new UnclearCommandException(text);//if there is a tie for length, it is unclear.
			}
			
		}
		return parsed;
	}
	
   
   List<String> getSubLines(String line){
	   List<String> l=Arrays.asList(line.split("\\. "));
	   for(int i=0;i<l.size();i++) {
		   String part=l.get(i);
		   if(part.startsWith(" ")) {
			   l.set(i, part.replaceFirst(" ",""));
		   }
	   }
	   String lastPart=l.get(l.size()-1);
	   if(lastPart.endsWith(".")) {
		   l.set(l.size()-1, lastPart.substring(0, lastPart.length()-1));//remove final .
	   }
	   return l;
   }
	   
   

}
