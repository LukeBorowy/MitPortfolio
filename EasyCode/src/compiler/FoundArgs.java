package compiler;

import java.util.ArrayList;
import java.util.List;

import compiler.FoundArgs.FoundArg;

/**
 * This class holds a list of {@link FoundArgs.FoundArg}. It has information about the args like order. It has methods for retrieving the args in order, etc.
 * @author Luke Borowy
 *
 */
public class FoundArgs{
	public static class FoundArg{
		private String arg;
		private boolean isCode;
		int argInd;
		boolean spaceAfterArg;
		boolean isDefault;
		int totalLength;
		public FoundArg(String arg, boolean isCode, int argInd,boolean spaceAfterArg,boolean isDefault) {
			this.setArg(arg);
			this.setIsCode(isCode);
			this.argInd = argInd;
			this.spaceAfterArg=spaceAfterArg;
			this.isDefault=isDefault;
			totalLength=arg.length();
		}
		
		public String[] getWords() {
			if(getArg().equals("PLACEHOLDER")) {
				return new String[]{};//if arg is a placeholder, it is not any words.
			}
			return getArg().split(" ");
		}
		public String getText() {
			return getArg();
		}
		public String toString() {
			return getArg();
		}

		public String getArg() {
			return arg;
		}

		public void setArg(String arg) {
			this.arg = arg;
		}

		public boolean isCode() {
			return isCode;
		}

		public void setIsCode(boolean isCode) {
			this.isCode = isCode;
		}
		
		
		
	}

	List<FoundArg> args=new ArrayList<FoundArg>();
	List<FoundArg> defaultArgs=new ArrayList<FoundArg>();
	public int totalLength;
	/**
	 * 
	 * @param textArgs the args
	 * @param isArgCode an array of booleans saying if each arg is code
	 * @param argOrder an array of ints saying where each arg should go in order
	 * @param spaces an array of booleans saying if each arg has a space after it
	 * @param extraArgs a list of ints listing inds of args that are optional, from an arg group
	 * @param defaultArgs a list of FoundArg that lists the default args
	 */
	public FoundArgs(String[] textArgs,boolean[] isArgCode,int[] argOrder,boolean[] spaces,List<Integer> extraArgs,List<FoundArg> defaultArgs) {
		this.defaultArgs=new ArrayList<FoundArg>(defaultArgs);//copy the initial default args. the list will be filtered out later, so this saves the original
		for(int extra:extraArgs) {
			textArgs[extra]="PLACEHOLDER";
		}
		
		int argNum=0;
		for(int j=0;j<textArgs.length;j++) {
			int argInd;
			if(textArgs[j].equals("NOT_GIVEN")) {
				argInd=-1;//AKA no order
			}else {
				argInd=argOrder[argNum];
				argNum++;
				
			}
			args.add(new FoundArg(textArgs[j], isArgCode[j], argInd,spaces[j],false));
		}
		
		for(FoundArg arg:args) {
			for(FoundArg defArg:defaultArgs) {
				if(arg.argInd==defArg.argInd) {
					defaultArgs.remove(defArg);//If a default arg has the same ind as the given arg, the default should be deleted. Given args always win over defaults
					break;
				}
			}
		}
		for(FoundArg defArg:defaultArgs) {

			for(int i=0;i<args.size();i++) {
				FoundArg a=args.get(i);
				if(a.getArg().equals("NOT_GIVEN")) {//any not_givens can be replaced with a default.
					args.set(i, defArg);
					break;//once a default arg is used, don't keep trying to put it somewhere
				}
			}
		}
		
		totalLength=0;
		for(String arg:textArgs) {
			if(arg.equals("NOT_GIVEN")) {continue;}
			totalLength+=arg.length();
		}
	}
	public FoundArgs(String[] args,boolean[] isArgCode,List<Integer> argOrder,boolean[] spaces,List<Integer> extraArgs,List<FoundArg> defaultArgs) {
		this(args,isArgCode,argOrder.stream().mapToInt(i->i).toArray(),spaces,extraArgs,defaultArgs);
	}
	public List<FoundArg> getArgs() {
		return args;
	}
	
	/**
	 * Gets the args, in order. Any NOT_GIVENs will fill in the blanks.
	 * @return A list of FoundArgs, in order
	 */
	public List<FoundArgs.FoundArg> getOrderedArgs() {
		FoundArgs.FoundArg[] asArr=new FoundArgs.FoundArg[args.size()];
		for(int j=0;j<args.size();j++) {
			FoundArgs.FoundArg a=args.get(j);
			if(a.argInd==-1) {//meaning it is a NOT_GIVEN
				for(int i=0;i<asArr.length;i++) {
					if(asArr[i]==null) {
						asArr[i]=a;
						break;
					}
				}
			}else {
				asArr[a.argInd]=a;
			}

		}
		List<FoundArgs.FoundArg> out=new ArrayList<FoundArgs.FoundArg>();
		for(FoundArgs.FoundArg a:asArr) {
			out.add(a);
		}
		return out;
	}
	
	public String toString() {
		return args.toString();
	}
	/**
	 * Replace NOT_GIVENS with the defaults. This is to be called after spaces have been shifted, to fill in any gaps that were created.
	 * @param args the args for the command
	 * @return the same args, but with defaults filled in
	 */
	public String[] fillInDefaults(String[] args) {
		for(int i=0;i<args.length;i++) {
			String arg=args[i];
			if(arg.equals("NOT_GIVEN")) {//if it's not given, fill it with a default
				for(FoundArg defArg:defaultArgs) {
					if(defArg.argInd==i) {
						args[i]=defArg.getArg();
					}
				}
			}
			//otherwise, leave it as-is
		}
		return args;
	}
	

}