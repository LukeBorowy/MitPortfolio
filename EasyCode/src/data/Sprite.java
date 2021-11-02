package data;

import java.awt.Color;
import java.awt.Graphics;
import java.awt.Image;
import java.awt.MediaTracker;
import java.awt.Toolkit;
import java.util.Arrays;
import java.util.List;

import compiler.FoundArgs;
import compiler.FoundArgs.FoundArg;
import compiler.SentenceMatcher;
import graphics.DisplayWindow;
import main.EasyCodeRuntimeException;
import main.Program;

public class Sprite implements Data {
	static SentenceMatcher shapeFilter=new SentenceMatcher("{1(30)}{2(30)}?[{1} by {2} ]{0}",3);

	
	
    Program program;
	Number health;
	
	Number speed;
	boolean currentlyMoving=false;
	Direction heading;
	Position pos;
	
	Color color;
	Image image;
	int width;
	int height;
	String shape=null;
	boolean isShape;
	boolean visible=true;
	ObjectProperties properties=new ObjectProperties();
	public Sprite(Position pos,int width,int height,String shape,Image image,EasyCodeColor color,Program p,boolean isRealObject) {
		
		
		program=p;
		this.pos=pos;
		this.width=width;
	    this.height=height;
	    if(isRealObject) {
			this.color=color.getColor();
	    	
		    health=new Number(100,false);
			speed=new Number(1,false);
			heading=new Direction(p.random.nextInt(360));//start with a random heading
		    assert(pos!=null);
			
			if((shape==null)!=(image==null)) {//check if both are null
				//good; exactly one is given
			}else {
				throw new EasyCodeRuntimeException("Sprite should have either shape or image given, but not both or none");
			}
			isShape=image==null;//if image is null, it must be a shape
			if(isShape) {
				this.shape=shape;
			}else {
		        String fileName = "F:\\Python27\\Legomon Squares\\MutationMap.jpg";
		        Toolkit toolkit = Toolkit.getDefaultToolkit();
		        //MediaTracker tracker = new MediaTracker();//for checking if image is valid
		        image = toolkit.createImage(fileName);
		        /*tracker.addImage(image, 0);
		        try
		        {
		            tracker.waitForID(0);
		        }
		        catch(InterruptedException ie)
		        {
		            System.out.println("interrupt: " + ie.getMessage());
		        }*/
			}
			
			properties.addProp(health, "|[health;hitpoints]");
			properties.addProp(speed, "?[movement ]speed");
			
			p.getWindow().eventListeners.addSprite(this);//add myself to the drawing loop
			p.getPhysics().addSprite(this);//add sprite to physics loop
	    }
	    
	}
    public Sprite(int x,int y,int width,int height,String shape,Image image,EasyCodeColor color,Program p) {
    	this(new Position(x,y),width,height,shape,image,color,p);
    	
    }
	public Sprite(Position pos,int width,int height,String shape,Image image,EasyCodeColor color,Program p) {
		this(pos,width,height,shape,image,color,p,true);
	}
	public Sprite(Position pos, int width,int height, Program p) {
		this(pos,width,height,null,null,null,p,false);
	}

	@Override
	public Number toNumber() {
		throw new DataConversionException("Cannot convert sprite to number");
	}

	@Override
	public Text toText() {
		
		return new Text(shape);
	}

	@Override
	public DataTypes getTypeName() {
		
		return DataTypes.SPRITE;
	}

	@Override
	public Sprite toSprite() {
		return this;
	}
	@Override
	public Direction toDirection() {
		throw new DataConversionException("Cannot convert Sprite to Direction");
	}
	
	public static boolean canTextBeSprite(String text) {
		return shapeFilter.fitIntoPattern(text)!=null;
	}
	public void move(Direction dir,double speed ) {
		if(dir==null) {
			dir=heading;
		}
		double[] v=dir.getVelocity();
		pos.x+=v[0]*speed;
		pos.y+=v[1]*speed;
	}
	
	public void move(Direction dir) {
		move(dir,speed.getValue());
	}
	public void move() {
		move(heading);
	}
	public void draw(Graphics g,DisplayWindow window) {
		if(!visible) {return;}
		int xPos=(int)pos.x-width/2;
		int yPos=(int)pos.y-height/2;
		if(isShape) {
			g.setColor(color);
			if(shape.equals("circle")) {
				g.fillArc(xPos, yPos, width, height, 0, 360);
			}else if (shape.equals("rectangle")){
			    g.fillRect(xPos, yPos, width, height);
			}
			else {
				window.program.throwException(new DataConversionException("Unknown shape: "+shape));
			}
		}else {
			g.drawImage(image, xPos,yPos,window.surface);
		}
        
	}
	
	public void delete() {
		program.getWindow().eventListeners.removeSprite(this);//remove myself from the drawing loop
		program.getPhysics().removeSprite(this);//remove sprite from physics loop
	}
	
	public boolean isVisible() {
		return visible;
	}

	public void setVisible(boolean visible) {
		this.visible = visible;
	}
	
	public void setDirection(Direction dir) {
		this.heading=dir;
	}
	/**
	 * 
	 * @param degrees 0 is up
	 */
	public void setDirection(double degrees) {
		this.heading.setDegrees(degrees);
		
	}
	
	public Number getHealth() {
		return health;
	}

	public void setHealth(Number health) {
		this.health = health;
	}

	public Number getSpeed() {
		return speed;
	}

	public void setSpeed(Number speed) {
		this.speed = speed;
	}

	public void setMoving(boolean moving) {
		this.currentlyMoving=moving;
	}
	public boolean isMoving() {
		return currentlyMoving;
	}
	public double[] getRect() {
		return new double[] {pos.getX(),pos.getY(),width,height};
	}
	public Direction getDirection() {
		return heading;
	}
	public Position getPosition() {
		return this.pos;
	}
	public double getWidth() {
		return width;
	}
	public double getHeight() {
		return height;
	}
	


	@Override
	public EasyCodeColor toColor() {
		throw new DataConversionException("Cannot convert Sprite to Color");
	}
	@Override
	public Position toPosition(Program ignored) {
		return this.pos;
	}
	public void setPosition(double x, double y) {
		this.pos.setPos(x,y);
		
	}



}