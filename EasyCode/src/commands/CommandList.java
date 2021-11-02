package commands;

import java.util.ArrayList;
import java.util.List;

import compiler.FoundArgs;
import compiler.LineSkeleton;
import compiler.SentenceMatcher;

public class CommandList {
	public static Command[] commands= {
			new GetInput(),new Output(),new OpenWindow(),new AddKeyHandler(),new SpriteFromShape(),new MoveSprite(),new DoEverySeconds(),
			new MoveConstant(),new ChangeSpriteProp(),new DisplayVar(),new SetNumberVar(),new AddCollisionListener(), new BounceOff(), new EndProgram(),
			new ChangeNumberVar(), new StopMovement(), new RemoveSprite(), new WaitTime()
			};
	//public static Command[] commands= {new MoveConstant()};
    public static LineSkeleton[] getCommandFromText(String text) {
    	return getCommand(text,false);
    }
    public static LineSkeleton[] getExpressionFromText(String text) {
    	return getCommand(text,true);
    }
    
    public static LineSkeleton[] getCommand(String text,boolean expr) {
    	List<LineSkeleton> possible=new ArrayList<LineSkeleton>();
    	for(Command command:commands) {
    		SentenceMatcher pattern;
    		if(expr) {
    			pattern=command.getExpressionPattern();
    		}else {
    			pattern=command.getPattern();
    		}
    		FoundArgs fitted=pattern.fitIntoPattern(text);
    		
    		if(fitted==null) {
    			//okay, not this command
    		}else {
    			possible.add(new LineSkeleton(command,fitted));
    		}
    	}
    	return possible.toArray(new LineSkeleton[0]);
    }
	

}
