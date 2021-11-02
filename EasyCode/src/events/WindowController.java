package events;

import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.concurrent.CopyOnWriteArrayList;

import commands.Command;
import commands.DoEverySeconds;
import data.Data;
import data.Keypress;
import data.Position;
import data.Sprite;
import graphics.DisplayWindow;
import main.Program;

public class WindowController implements MouseMotionListener,KeyListener,MouseListener{

	List<KeyDownListener> keyListeners=new ArrayList<KeyDownListener>();
	List<TimerListener> timerListeners=new ArrayList<TimerListener>();
	
	Program program;
	DisplayWindow window;
	
	public Sprite topEdge;
	public Sprite bottomEdge;
	public Sprite rightEdge;
	public Sprite leftEdge;
	
	public WindowController(Program p) {
		program=p;
	}
	public void connectToWindow(DisplayWindow w) {
		this.window=w;
		leftEdge=new Sprite(new Position(-25,w.height/2),50,w.height,w.program);
		rightEdge=new Sprite(new Position(w.width+25,w.height/2),50,w.height,w.program);
		topEdge=new Sprite(new Position(w.width/2,-25),w.width,50,w.program);
		bottomEdge=new Sprite(new Position(w.width/2,w.height+25),w.width,50,w.program);

	}
	//DRAWING STUFF
	List<DisplayText> textsToDisplay=new CopyOnWriteArrayList<DisplayText>();
	List<Sprite> sprites=new CopyOnWriteArrayList<Sprite>();
	public void doDrawing(Graphics2D g) {
		
		for(Sprite s:sprites) {
			
			s.draw(g, window);
			
		}
		for(DisplayText t:textsToDisplay) {
			
			t.draw(g, window);
			
		}
		
	}
	public void addSprite(Sprite s) {
		
		sprites.add(s);
		
		
	}
	
	public void removeSprite(Sprite s) {
		sprites.remove(s);
	}
	
	public void addDisplayText(Data thingToDisplay,Position pos) {
		textsToDisplay.add(new DisplayText(thingToDisplay, pos));
	}
	
	//KEY STUFF
	public void addKeyListener(String key,int startLine,int endLine,Command trigger) {
		keyListeners.add(new KeyDownListener(key, startLine, endLine,trigger));
	}
	
	
	@Override
	public void keyTyped(KeyEvent e) {
		// TODO Auto-generated method stub
	}

	@Override
	public void keyPressed(KeyEvent e) {
		int keyCode=e.getKeyCode();		
		for(KeyDownListener listener:keyListeners) {
			if(listener.matches(keyCode)) {
				program.setMemAt( Program.KEYPRESS_IND, new Keypress(keyCode));//TODO: Make mem ind specific to the routine. Have it be a return from the AddKeyHandler.
				program.addSubroutine(listener);
				
			}
			
		}
		//System.out.println(added);
		
	}

	@Override
	public void keyReleased(KeyEvent e) {
		// TODO Auto-generated method stub
		
	}
	//COLLISION STUFF
	public void addCollisionListener(int start, int end, Command trigger, Sprite collider, Sprite toBeHit) {
		addCollisionListener(start,end,trigger,collider,new Sprite[] {toBeHit});
	}
	public void addCollisionListener(int start, int end, Command trigger, Sprite collider, Sprite[] toBeHit) {
		program.getPhysics().addCollisionListener(new CollisionListener(collider,toBeHit,start,end,trigger));
	}
	
    //TIMER STUFF
	public void addTimerListener(int start, int end, Command trigger, int seconds, boolean repeat) {
		TimerListener listener=new TimerListener(start, end,trigger,program);
		timerListeners.add(listener);
		
		Timer t=new Timer();
		if(repeat) {
			t.scheduleAtFixedRate(listener, seconds, seconds);//wait seconds, then do every seconds
		}else {
			t.schedule(listener, seconds);
		}
		
	}
	//MOUSE STUFF TODO
	@Override
	public void mouseDragged(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void mouseMoved(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void mouseClicked(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void mousePressed(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void mouseReleased(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void mouseEntered(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void mouseExited(MouseEvent e) {
		// TODO Auto-generated method stub
		
	}
	

}
class DisplayText{
	Data thingToDisplay;
	Position pos;
	Color color=Color.BLACK;
	Font font;
	FontMetrics metrics=null;
	public DisplayText(Data thingToDisplay,Position pos) {
		this.thingToDisplay=thingToDisplay;
		this.pos=pos;
		this.font=new Font(Font.SANS_SERIF, Font.PLAIN, 30);
		
		
	}
	public void draw(Graphics2D g,DisplayWindow window) {
		g.setColor(color);
		if(g.getFont()!=font) {
			g.setFont(font);
		}
		if(metrics== null) {
			metrics=g.getFontMetrics(this.font);
		}
		
		String text=thingToDisplay.toText().getVal();
		
		int x=(int) pos.getX();
		int y=(int) pos.getY()+metrics.getAscent();
		
		
		g.drawString(text, x, y);
	}
}
