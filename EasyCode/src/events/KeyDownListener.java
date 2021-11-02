package events;

import java.awt.event.KeyEvent;
import java.util.ArrayList;
import java.util.List;

import commands.Command;

public class KeyDownListener implements EventListener{
	List<Integer> keyCodes=new ArrayList<Integer>();
	private int startLine;
	private int endLine;
	boolean allKeys=false;
	Command trigger;
	public KeyDownListener(String key, int startLine, int endLine,Command trigger) {
		
		
		if(key.length()==1) {
			keyCodes.add(KeyEvent.getExtendedKeyCodeForChar(key.charAt(0)));
		}else {
			if(key.equals("space")) {
				keyCodes.add(KeyEvent.VK_SPACE);
			}else if(key.equals("alt")) {
				keyCodes.add(KeyEvent.VK_ALT);
			}else if(key.equals("arrows")) {
				keyCodes.add(KeyEvent.VK_RIGHT);
				keyCodes.add(KeyEvent.VK_LEFT);
				keyCodes.add(KeyEvent.VK_UP);
				keyCodes.add(KeyEvent.VK_DOWN);
				
			}else if (key.equals("left arrow")){
				keyCodes.add(KeyEvent.VK_LEFT);
			}else if (key.equals("right arrow")){
				keyCodes.add(KeyEvent.VK_RIGHT);
			}else if (key.equals("up arrow")){
				keyCodes.add(KeyEvent.VK_UP);
			}else if (key.equals("down arrow")){
				keyCodes.add(KeyEvent.VK_DOWN);
				
			}else if(key.equals("any")) {
				allKeys=true;
			}
		}
		
		
		this.startLine=startLine;
		this.endLine=endLine;
		this.trigger=trigger;
	}
	public boolean matches(int keyCode) {
		return keyCodes.contains(keyCode) || allKeys;
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
	public String listenerType() {
		
		return "KeyDown";
	}
	@Override
	public Command getTrigger() {
		return trigger;
	}
	
	
}