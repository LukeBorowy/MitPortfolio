package events;

import java.awt.event.KeyEvent;
import java.util.TimerTask;

import commands.Command;
import data.Keypress;
import main.Program;

public class TimerListener extends TimerTask implements EventListener {
	private int startLine;
	private int endLine;

	Command trigger;
	Program program;
	public TimerListener(int startLine, int endLine,Command trigger,Program p) {

		this.startLine=startLine;
		this.endLine=endLine;
		this.trigger=trigger;

		this.program=p;
	}

	@Override
	public String listenerType() {
		
		return "TimerListener";
	}

	@Override
	public Command getTrigger() {
		
		return trigger;
	}

	@Override
	public int getStartLine() {
		return startLine;
	}

	@Override
	public int getEndLine() {
		return endLine;
	}

	@Override
	public void run() {
		program.addSubroutine(this);
	}

}
