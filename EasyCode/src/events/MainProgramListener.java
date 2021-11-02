package events;

import commands.Command;

public class MainProgramListener implements EventListener {

	public MainProgramListener() {
		
	}

	@Override
	public String listenerType() {
		
		return "MainProgram";
	}

	@Override
	public Command getTrigger() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public int getStartLine() {
		// TODO Auto-generated method stub
		return 0;
	}

	@Override
	public int getEndLine() {
		// TODO Auto-generated method stub
		return 0;
	}

}
