package main;

import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.util.ArrayList;
import java.util.List;
import java.util.TimerTask;
import java.util.Timer;
import data.Sprite;
import events.CollisionListener;

public class PhysicsProcesser extends TimerTask {
    Program program;
    List<Sprite> sprites=new ArrayList<Sprite>();
	List<Sprite> newSprites=new ArrayList<Sprite>();
	List<Sprite> removeSprites=new ArrayList<Sprite>();

	List<CollisionListener> collisionListeners=new ArrayList<CollisionListener>();
	List<CollisionListener> newCollisionListeners=new ArrayList<CollisionListener>();

	public PhysicsProcesser(Program p) {
		program=p;
		Timer timer=new Timer();
		timer.scheduleAtFixedRate(this, 0, 30);
	}
	public void doStep() {
		for(Sprite s:sprites) {
			if(s.isMoving()){
				s.move();
			}
		}
		synchronized (newSprites) {
			if(newSprites.size()>0) {
				sprites.addAll(newSprites);
				newSprites.clear();
			}
		}
		synchronized (removeSprites) {
			if(removeSprites.size()>0) {
				sprites.removeAll(removeSprites);
				removeSprites.clear();
			}
		}
		for(CollisionListener listener:collisionListeners) {
			listener.checkForCollision(program);
			
		}
		synchronized (newCollisionListeners) {
			if(newCollisionListeners.size()>0) {
				collisionListeners.addAll(newCollisionListeners);
				newCollisionListeners.clear();
			}
		}
	}
	public void addSprite(Sprite s) {
		synchronized (newSprites) {
			newSprites.add(s);
		}
	}
	public void removeSprite(Sprite s) {
		synchronized (removeSprites) {
			removeSprites.add(s);
		}
		
	}
	public void addCollisionListener(CollisionListener listener) {
		synchronized (newCollisionListeners) {
			newCollisionListeners.add(listener);
		}
		
	}
	
	@Override
	public void run() {
		doStep();
		
	}

}
