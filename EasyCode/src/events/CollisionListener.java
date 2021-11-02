package events;

import commands.Command;
import data.Sprite;
import main.Program;

public class CollisionListener implements EventListener {

	Command trigger;
	Sprite sprite;
	Sprite[] otherSprites;
	int startLine;
	int endLine;
	public CollisionListener(Sprite sprite1,Sprite[] otherSprites, int startLine, int endLine,Command trigger) {
		this.trigger=trigger;
		this.sprite=sprite1;
		this.otherSprites=otherSprites;
		this.startLine=startLine;
		this.endLine=endLine;
	}

	@Override
	public String listenerType() {
		return "Collision";
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

	/**
	 * Checks if the sprites are touching. If so, triggers the subroutine for this listener.
	 * @param program the program running, that the subroutine should be added to.
	 */
	public void checkForCollision(Program program) {
		double[] rect1=sprite.getRect();
		for(Sprite otherSprite:otherSprites) {
			double[] rect2=otherSprite.getRect();
			if(Math.abs(rect1[0]-rect2[0])<(rect1[2]+rect2[2])/2) {
				if(Math.abs(rect1[1]-rect2[1])<(rect1[3]+rect2[3])/2) {
					program.addSubroutine(this);
					program.setMemAt(program.SPIRTEHIT_IND, otherSprite);
					
				}
			}
		}
		
	}

	public Sprite getCollidingSprite() {
		return sprite;
	}

}
