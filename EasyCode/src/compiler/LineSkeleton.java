package compiler;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import commands.Command;
import compiler.FoundArgs.FoundArg;

public class LineSkeleton {

	Command command;
	public FoundArgs args;
	
	int subDepth;
	
	private int likelinessScore=0;
	
	public LineSkeleton(Command com,FoundArgs args) {
		command=com;
		this.args=args;
	}
	@Override
	public String toString() {
		String s=command.getName()+"(";
		for(int i=0;i<subDepth;i++) {
			s="\t"+s;
		}
		List<FoundArgs.FoundArg> argsText=args.getOrderedArgs();
		for(int i=0;i<argsText.size();i++) {
			String arg=argsText.get(i).getArg();
			s+=arg;
			if(i!=argsText.size()-1) {
				s+=",";
			}
		}
		s+=")";
		
		
		return s;
	}
	int getLikelinessScore() {
		return likelinessScore;
	}
	void setLikelinessScore(int likelinessScore) {
		this.likelinessScore = likelinessScore;
	}
	public List<List<FoundArgs.FoundArg>> getArgGroups(){
		List<List<FoundArgs.FoundArg>> argGroups=new ArrayList<List<FoundArgs.FoundArg>>();
		List<FoundArgs.FoundArg> currentGroup=new ArrayList<FoundArgs.FoundArg>();
		
		List<FoundArgs.FoundArg> argsText=args.args;
		for(int i=0;i<argsText.size();i++) {
			FoundArgs.FoundArg arg=argsText.get(i);
			currentGroup.add(arg);
			if(arg.spaceAfterArg) {
				
			}else {
				argGroups.add(currentGroup);
				currentGroup=new ArrayList<FoundArgs.FoundArg>();
			}
		}
		
		
		return argGroups;
	}
	/*public static void main(String[] args) {
		String[] arg= {"blue","circle","down"};
		boolean[] spaces= {false,true,false};
		LineSkeleton l=new LineSkeleton(null, arg, null, spaces);
		//List<String[]> result=l.getPossibleArgs(l.getArgGroups().get(0),3);
		List<String[]> result=l.getArgGroups();
		for(String[] s:result) {
			System.out.println(Arrays.toString(s));
		}
	}*/
	
	public static List<String[]> getPossibleArgs(String[] words,int numArgs){
	    int numWords=words.length;
	    int maxInd=numArgs-1;//arrays are 0-indexed
	    
	    List<int[]> possibleInds=new ArrayList<int[]>();
	    List<String[]> possibleArgCombos=new ArrayList<String[]>();
	    
	    int[] currInds=new int[numWords];
	    Arrays.fill(currInds, 0);
	    
	    boolean shouldEnd=false;
	    if(numArgs==1) {
	    	shouldEnd=true;
	    }
	    while(!shouldEnd){
	      if(isSorted(currInds)){
	          possibleInds.add(currInds.clone());
	      }
	      currInds[0]++;
	      
	      for(int i=0;i<currInds.length;i++){
	        int curr=currInds[i];
	        if(curr>maxInd){
	          currInds[i]=0;
	          currInds[i+1]+=1;
	        }
	      }
	      shouldEnd=true;
	      for(int i:currInds){
	        if(i!=maxInd){
	          shouldEnd=false;
	        }
	      }
	    }
	    possibleInds.add(currInds.clone());//add the final combo
	    
	    for(int[] inds:possibleInds){
	      String[] combo=new String[numArgs];
	      Arrays.fill(combo, "");
	      for(int i=0;i<inds.length;i++){
	        int ind=inds[i];
	        if(combo[ind].length()!=0) {
	        	combo[ind]+=" ";
	        }
	        combo[ind]+=words[i];
	      }
	      boolean gaps=false;
	      /*boolean textFound=false;//I think gaps might be okay?
	      for(int i=combo.length-1;i>-1;i--) {
	    	  String arg=combo[i];
	    	  int len=arg.length();
	    	  if(len!=0) {
	    		  textFound=true;
	    	  }else {
	    		  if(textFound) {
	    			  gaps=true;
	    		  }
	    	  }
	      }*/
	      if(gaps) {
	    	  
	      }else {
	    	  possibleArgCombos.add(combo);
	      }
	    }
	    
	    
	    /*for(String[] e:possibleArgCombos){
	      System.out.println(Arrays.toString(e));
	    }*/
	    
	    
		
		return possibleArgCombos;
	}
    public boolean isStartOfBlock() {
    	return args.getArgs().size()>0 && args.getOrderedArgs().get(args.args.size()-1).isCode();//if the command takes no args, it must not be a block, so short-circuit out.
    }
	public int getSubDepth() {
		return subDepth;
	}
	public void setSubDepth(int subDepth) {
		this.subDepth = subDepth;
	}
	public static boolean isSorted(int[] a) {
        for (int i = 0; i < a.length - 1; i++) {
            if (a[i] > a[i + 1]) {
                return false; // It is proven that the array is not sorted.
            }
        }
        return true; // If this part has been reached, the array must be sorted.
	}
	
	

}
