package compiler;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class SentenceMatcher {
	
	final static char MAYBE='?';
	final static char OR='|';
	final static String specialChars=""+OR+MAYBE;
	
	    
	List<String> possibleStrings=new ArrayList<String>();
	List<CommandPattern> possiblePatterns=new ArrayList<CommandPattern>();
	int[] argStartInds;
	public SentenceMatcher(String matcher) {
		this(matcher,0);//default is 0 args
	}
	
	
	public SentenceMatcher(String matcher,int numArgs,boolean printCombos) {
		
		    if(matcher.equals("NONE")) {
		    	//no combos
		    }else {
		    	
		    
			    possibleStrings=getCombinations(matcher);
			    for(String pattern :possibleStrings) {
			    	possiblePatterns.add(new CommandPattern(pattern,numArgs,printCombos));
			    }
		    }
		    for (String pattern:possibleStrings) {
		    	if(pattern.contains("  ")) {
		    		System.out.println("Warning: double spaces in pattern :"+pattern);
		    	}
		    	if(pattern.startsWith(" ")) {
		    		System.out.println("Warning: pattern starts with space :"+pattern);
		    	}
		    	if(pattern.endsWith(" ")) {
		    		System.out.println("Warning: pattern ends with space :"+pattern);
		    	}
		    }
		    if(printCombos) {
		    	for(String s:possibleStrings) {
		    		System.out.println(s);
		    	}
		    }
	}
	public SentenceMatcher(String matcher,int numArgs) {
		this(matcher,numArgs,false);
	}
	
	
	static class CommandPattern{
		String pattern;
		List<String> argSections;
		int trueNumArgs=0;
		int presentArgs;
		boolean[] isArgCode;
		boolean[] isSpaceAfterArg;
		List<FoundArgs.FoundArg> defaultArgs=new ArrayList<FoundArgs.FoundArg>();
		List<Integer> extraArgs=new ArrayList<Integer>();// from arg groups like {0 1 2}
		
		List<Integer> argOrder=new ArrayList<Integer>();
		public CommandPattern(String pattern,int numArgs,boolean printParts){
			trueNumArgs=numArgs;
			this.pattern=pattern;
			int lastInd=0;
			
			isArgCode=new boolean[trueNumArgs];
			isSpaceAfterArg=new boolean[trueNumArgs];
			Arrays.fill(isArgCode,false);
			Arrays.fill(isSpaceAfterArg,false);
			argSections=new ArrayList<String>();
			
			for(int i=0;i<pattern.length();i++) {
				char c=pattern.charAt(i);
				if(c=='{') {
					
					
					
					int endInd=pattern.indexOf("}", i);
					String argSpot=pattern.substring(i+1, endInd);//+1 to not include {	
					
				    String seperator=pattern.substring(lastInd, i);
				    
	
					
					
					boolean argIsCode=false;//false by default
					int offset=0;
					if(argSpot.charAt(0)=='<') {
					    offset=1;
					    argIsCode=true;
					}
					boolean isDefault=argSpot.contains("(");
                    String trueArgSpot=argSpot.substring(offset,argSpot.length()-offset);
                    
                    String[] argsInGroup;
                    if(isDefault) {
                    	argsInGroup=new String[] {trueArgSpot};//if it is a default arg, do not try to find it's arg spots. Just have it as a single arg
                    }else {
                    	argsInGroup=trueArgSpot.split(" ");//split into the individual args, {0 1 2} becomes [0 ,1 ,2]
                    }
					
					String arg=argsInGroup[0];
					int num;
					if(isDefault) {//that means it is just a default arg
						int defStart=arg.indexOf("(");
						int defEnd=arg.indexOf(")");
						num=Integer.parseInt(arg.substring(0,defStart));
						
						String defArg=arg.substring(defStart+1, defEnd);//+1 to exclude (
						defaultArgs.add(new FoundArgs.FoundArg(defArg, argIsCode, num, false,true));//false=no space after arg. we don't want the default to mix with the real args.
						
						
						
					}else {
						num=Integer.parseInt(arg);

					    
					    seperator=removeDefaultArgs(seperator);
					    
					    					    
					    argSections.add(seperator);//only add it to argsections if it is an actual space for an arg
						argOrder.add(num);
					    
					}
					
					
					isArgCode[num]=argIsCode;//still mark if it is code even if it is a default
					
					
					
					//the matcher will contain 1 arg spot, but it will add extra PLACEHOLDERs that will be filled in by the compiler when it shifts spaces
					for(int j=0;j<argsInGroup.length;j++) {
						int argInd=argOrder.size()+j;
						
						if(j!=argsInGroup.length-1) {
							
							extraArgs.add(argInd);
						}
						if(j!=0) {//if 0, it's already been handled
							int argOrd=Integer.parseInt(argsInGroup[j]);
							isArgCode[argOrd]=argIsCode;
							argOrder.add(argOrd);
							//boolean[] isArgCode,int[] argOrder
						}
						
					}

					
					
					if(isDefault) {
						//if it is a default, keep adding in to the argsection, don't reset lastInd
						
					}else {
						lastInd=endInd+1;//+1 to skip over }
					}
										
				}
			}
			for(int i=1;i<argSections.size();i++) {//start at 1 because the first argsection cannot be space, and it is not after any arg
				String seperator=argSections.get(i);
			
				if(seperator.equals(" ")) {
					isSpaceAfterArg[i-1]=true;//there IS a space after this arg. -1 to correct starting i at 1
				}
				
			}
			
			for(Integer i:extraArgs) {
				isSpaceAfterArg[i-1]=true;//put spaces after the args in groups so that they can shift around
			}
			
			argSections.add(removeDefaultArgs(pattern.substring(lastInd, pattern.length())));//add in the final argsection
			
			
			presentArgs=argSections.size()-1;
			
			if(printParts) {
				for(String section:argSections) {
			
					System.out.println(section);
					//System.out.println("ARG");
				}
				System.out.println();//newline*/
			}
		
			
			
		}
		private String removeDefaultArgs(String seperator) {
			return seperator.replaceAll("\\{.*?\\}", "");//remove all default args from the string (anything that matches {...};
		}
		FoundArgs fitIntoPattern(String sentence) {
			String[] asArr = new String[trueNumArgs];
			Arrays.fill(asArr, "NOT_GIVEN");
			if(presentArgs==0) {
				if(sentence.equals(argSections.get(0))) {
					
				}else {
					return null;
				}
			}else if (presentArgs==1) {
				int argInd=argOrder.get(0);
				asArr[argInd]=fitWithOneArg(sentence);
				if(asArr[argInd]==null) {
					return null;
				}else {
				}
				
			}else {
				int totalLength=0;
				for(String section:argSections) {
					totalLength+=section.length();
				}
				totalLength+=presentArgs-extraArgs.size();//each arg must be at least one long, but extraArgs might not exist
				if(sentence.length()<totalLength) {//if it is too short, it can't match
					//System.out.print("length");
					return null;
				}
				
				if(!sentence.startsWith(argSections.get(0))) {
					//System.out.print("nostart");
					return null;
				}
				if(!sentence.endsWith(argSections.get(presentArgs))) {
					//System.out.print("noend");
					return null;
				}
				
				int argStart=argSections.get(0).length();
				List<String> args= new ArrayList<String>();
				int i=1;//so it skips the first argpart, since there cannot be any arg before it.
				for(i=1;i<argSections.size();i++) {
					String part=argSections.get(i);
					
					int ind=sentence.indexOf(part,argStart);
					
					
					
					
					if(ind==-1) {
						//System.out.print("notfound:");
						//System.out.println(part);
						return null;
					}
					String arg=sentence.substring(argStart,ind);
					if(part.length()==0 && i==argSections.size()-1) {
						arg=sentence.substring(argStart);
					}
					if(arg.length()==0) {return null;}
					args.add(arg);
					argStart=ind+part.length();
				}
				
				
				for(int j=0;j<args.size();j++){
					asArr[j]=args.get(j);
				}
				
				
				

			}
			return new FoundArgs(asArr,isArgCode,argOrder,isSpaceAfterArg,extraArgs,defaultArgs);
		}
		private String fitWithOneArg(String sentence) {
			if(sentence.length()<1+argSections.get(0).length()+argSections.get(1).length()) {
            	return null;
            }
			if(!sentence.startsWith(argSections.get(0))) {
				return null;
			}
			if(!sentence.endsWith(argSections.get(1))) {
				return null;
			}
			return sentence.substring(
					argSections.get(0).length(),
					sentence.length()-argSections.get(1).length()
					);
		}
		
		public String toString() {
			return this.pattern;
		}
		
		
	}
	public static List<String> getCombinations(String matcher){
		String soFar="";
		List<String> combos=new ArrayList<String>();
		for (int i = 0; i < matcher.length(); i++){
		    char c = matcher.charAt(i);
		    if(specialChars.contains(Character.toString(c))) {//is it a special char?
		    	List<String> parts=getBetweenBrackets(matcher,i+2);//+2 so it skips the start bracket and the |
		    	String restOfString=parts.remove(parts.size()-1);//pop last element
		    	List<String> foundCombos = new ArrayList<String>();
		    	if(c==OR) {
			    	for(String part : parts) {
			    		foundCombos.addAll(getCombinations(part+restOfString));
			    	}
		    	}else if(c==MAYBE) {
		    		foundCombos.addAll(getCombinations(restOfString));
		    		foundCombos.addAll(getCombinations(parts.get(0)+restOfString));
		    		
		    	}
		    	for (String combo:foundCombos) {
		    			combos.add(soFar+combo);
		    	}
		    	return combos;
		    	
		    	
		    	
		    }

		    soFar+=c;
		    
		}
		
		combos.add(soFar);//if no special stuff found, just add the text
		
		
		return combos;
		
	}
	
	static List<String> getBetweenBrackets(String text,int startInd){
		text=text.substring(startInd, text.length());
		List<String> parts=new ArrayList<String>();
		int bracketBalence=1;//get to 0 means other bracket found
		String currentPart="";
		int i=0;
		for (i = 0; i < text.length(); i++){
		    char c = text.charAt(i);
		    boolean validChar=true;
		    if(c=='[') {
		    	bracketBalence++;
		    	validChar=bracketBalence!=1;//as long as we are nested, special characters don't matter and should be literal
		    }else if (c==']') {
		    	bracketBalence--;
		    	validChar=bracketBalence!=0;
		    }else if (c==';') {
		    	if(bracketBalence==1) {
			    	parts.add(currentPart);
			    	currentPart="";
		    	}
		    	validChar=bracketBalence!=1;
		    }
            if (validChar) {
		    	
		    	currentPart+=c;
		    	validChar=bracketBalence!=1;
		    		
		    }
		    if(bracketBalence==0) {
		    	parts.add(currentPart);
		    	break;
		    }
		    
		}
		parts.add(text.substring(i+1,text.length()));//Add the remainder of the text to the end. +1 so it doesn't include ]
		return parts;
	}
	public Boolean matchesText(String text) {
		return possibleStrings.contains(text);
	}
	/**
	 * Parses a string into {@link FoundArgs}
	 * @param sentence The plain text to parse
	 * @return FoundArgs with the parsed args. null if the sentence does not match.
	 */
	public FoundArgs fitIntoPattern(String sentence) {
		List<FoundArgs> possibleVersions=new ArrayList<FoundArgs>();
		for(CommandPattern pattern:possiblePatterns) {
			FoundArgs args=pattern.fitIntoPattern(sentence);
			if(args==null) {
				//just go to the next pattern
			}else {
				possibleVersions.add(args);
			}
		}
		if(possibleVersions.isEmpty()) {
			return null;//if nothing works, return null, meaning none
		}else {
			possibleVersions.sort((a, b) -> Integer.compare(a.totalLength,b.totalLength));//sort by total size. we want the shortest one because that means that it does not include bits of the command in it.
			return possibleVersions.get(0);
		}
		
	}


	public boolean isNone() {
		return possiblePatterns.isEmpty();
	}
	
	/*public static void main(String[] args) {
		String[] arr=new SentenceMatcher("|[ask;inquire] ?[the user ]?[|[\";']]{0}?[|[\";']]",1).fitIntoPattern("ask the user 'who are you?'");
		if(arr==null) {
			System.out.println("null");
		}else {
			System.out.println(Arrays.asList(arr));
		}
        
    }*/
	
	
	

}
