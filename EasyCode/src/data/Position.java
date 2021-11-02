package data;

import java.util.List;

import compiler.FoundArgs;
import compiler.FoundArgs.FoundArg;
import compiler.SentenceMatcher;
import graphics.DisplayWindow;
import main.Program;

public class Position implements Data {

	double x=0;
	double y=0;
	
	public Position(double d, double e) {
		this.x=d;
		this.y=e;
	}
	
	
	/**
	 * 
	 * @param place the string describing location, like "0,4". It could be "center of the screen"
	 * @param p
	 */
	public static Position posFromString(String place,Program p) {
		SentenceMatcher cooridinateNotation=new SentenceMatcher("?[(]{0},?[ ]{1}?[)]",2);
		
		FoundArgs args=cooridinateNotation.fitIntoPattern(place);
		if(args==null) {
			SentenceMatcher describePos=new SentenceMatcher("?[the ]|[|[center;middle]{0(middle)}{1(middle)};top{0(top)}{1(middle)};bottom{0(bottom)}{1(middle)};left{0(middle)}{1(left)};right{0(middle)}{1(right)}]?[ |[side;edge]]?[ of the |[screen;window]]",2);//top, bottom, middle | left, right, middle
			List<FoundArg> position;
			try {
				position=describePos.fitIntoPattern(place).getOrderedArgs();
			}catch (NullPointerException e){
				throw new DataConversionException("Cannot get Position from text: "+place);
			}
			DisplayWindow window=p.getWindow();
			int windowHeight=window.height;
			int windowWidth=window.width;
			int x = 0;
			int y= 0;
			String vertPos=position.get(0).getText();
			String horPos=position.get(1).getText();
			/*System.out.println(vertPos);
			System.out.println(horPos);*/
			
			if(vertPos.equals("top")) {
				y=0;
			}else if(vertPos.equals("middle")) {
				y=windowHeight/2;
			}else if(vertPos.equals("bottom")) {
				y=windowHeight;
			}
			
			if(horPos.equals("right")) {
				x=windowWidth;
			}else if(horPos.equals("middle")) {
				x=windowWidth/2;
			}else if(horPos.equals("left")) {
				x=0;
			}
			
			return new Position(x,y);
				
			
			
			
		}else {
			int x=Integer.parseInt(args.getArgs().get(0).getText());
			int y=Integer.parseInt(args.getArgs().get(1).getText());

			return new Position(x, y);
		}
		
	}
	
	public double[] getPos() {
		double[] v=  {this.x,this.y};
		return v;
	}
	public double getX() {
		return x;
	}
	public double getY() {
		return y;
	}
	
	@Override
	public Number toNumber() {
		throw new DataConversionException();
		//return null;
	}
    
	@Override
	public DataTypes getTypeName() {
		return DataTypes.POSITION;
	}

	@Override
	public Text toText() {
		return new Text("("+x+","+y+")");
	}

	@Override
	public Sprite toSprite() {
		throw new DataConversionException();
	}

	@Override
	public Direction toDirection() {
		throw new DataConversionException("Cannot convert Position to Direction");
	}

	@Override
	public EasyCodeColor toColor() {
		throw new DataConversionException("Cannot convert Position to Color");
	}
	@Override
	public Position toPosition(Program ignored) {
		return this;
	}


	public void setPos(double x, double y) {
		
		this.x=x;
		this.y=y;
		
	}
	
	public void setX(double x) {
		this.x=x;
	}
	
	public void setY(double y) {
		this.y=y;
	}

}
