package main;

import commands.Command;
import events.EventListener;

public class CodeRoutine {
    int subDepth;
    int startLine;
    int endLine;
    int currLine=0;
    private EventListener trigger;
	public CodeRoutine(int subDepth, int startLine, int endLine,EventListener trigger) {
		this.subDepth = subDepth;
		this.startLine = startLine;
		this.endLine = endLine;
		this.trigger=trigger;
		currLine=startLine;
	}
	
	public int getSubDepth() {
		return subDepth;
	}
	public int getStartLine() {
		return startLine;
	}
	public int getEndLine() {
		return endLine;
	}
	public boolean isComplete() {
		return currLine>=endLine;
	}

	public EventListener getTrigger() {
		return trigger;
	}


}
