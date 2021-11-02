package events;

import commands.Command;

public interface EventListener {
	
	public String listenerType();
	

	public Command getTrigger();
	
	public int getStartLine();
	
	public int getEndLine();
	
	public static int[] getLinesFromString(String s) {
		String[] bounds=s.split(" ");
		int start=Integer.parseInt(bounds[0]);
		int end=Integer.parseInt(bounds[1]);
		return new int[] {start,end};
		
	}
}
