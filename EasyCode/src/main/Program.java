package main;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import commands.Command;
import data.Data;
import data.None;
import data.Text;
import events.EventListener;
import events.MainProgramListener;
import events.WindowController;
import graphics.DisplayWindow;

import static compiler.Compiler.Literal;
public class Program {
    
	public static final int KEYPRESS_IND=1;
	public static final int SPIRTEHIT_IND=2;

	public Random random=new Random();
	private List<CodeLine> lines=new ArrayList<CodeLine>(100);
	private List<Data> memory=new ArrayList<Data>(100);
	private List<CodeRoutine> activeRoutines=new ArrayList<CodeRoutine>();
	private List<CodeRoutine> newRoutines=new ArrayList<CodeRoutine>();
	private DisplayWindow window=null;
	RuntimeException endingException=null;//this is set by the throwException method of this class
	WindowController eventHandlers=new WindowController(this);
	PhysicsProcesser physicsProcesser=new PhysicsProcesser(this);
	private boolean shouldRun=true;
	public Program(List<CodeLine> lines,int memAmount,List<Literal> literals) {
		
		this.lines=lines;
		allocateMemory(memAmount);
		for(Literal c:literals) {
			String strVal=c.getStrValue();
			Data d=new Text(strVal);
			if(strVal.equals("NOT_GIVEN")) {
				d=new None();
			}
			setMemAt(c.getIndex(), d);
		}
		
		activeRoutines.add(new CodeRoutine(0,0,lines.size()-1,new MainProgramListener()));
		
	}
	public void run() {
		List<CodeRoutine> doneR=new ArrayList<CodeRoutine>();
		while(shouldRun) {//always loop while running
			
			if(endingException!=null) {
				throw endingException;
			}
			for(CodeRoutine routine:activeRoutines) {
				CodeLine line=lines.get(routine.currLine);
				if(line.subDepth==routine.subDepth) {
					//try {
						line.run(this,routine);
					//} catch (Exception e) {
						//throw new EasyCodeRuntimeException("Error on parsed line: "+(routine.currLine+1),e);
					//}
				}
				
				if(routine.isComplete()) {
					doneR.add(routine);
				}
				routine.currLine++;
			}
			//System.out.println(activeRoutines.size());
			if(doneR.size()>0) {
				activeRoutines.removeAll(doneR);
				doneR.clear();
			}
			synchronized (newRoutines) {//stops newRoutines from being erased before they can run
				
			
				if(newRoutines.size()>0) {
					activeRoutines.addAll(newRoutines);
					newRoutines.clear();
				}
			}
			
			Thread.yield();//allow other threads CPU time
			
			
		}
		System.exit(0);
		
	}
	
	public void connectToWindow(DisplayWindow d) {
		if(window==null) {
			window=d;
			eventHandlers.connectToWindow(d);
		}else {
			throw new EasyCodeRuntimeException("Window already open!");
		}
	}
	public DisplayWindow getWindow() {
		if(window==null) {
			throw new EasyCodeRuntimeException("No window open!");
		}else {
			return window;
		}
	}
	public WindowController getEventHandlers() {
		return eventHandlers;
	}
	
	public void addLine(CodeLine line,int index) {
		lines.add(index,line);
	}
	public void addLine(CodeLine line) {
		lines.add(line);
	}
	
	public void addSubroutine(CodeRoutine r) {
		synchronized(newRoutines) {
			newRoutines.add(r);
		}
		
	}
	
	public void addSubroutine(int start,int end,int subDepth,EventListener trigger) {
	    addSubroutine(new CodeRoutine(subDepth, start, end,trigger));
	}
	public void addSubroutine(int start,int end,EventListener trigger) {
	    addSubroutine(new CodeRoutine(lines.get(end).subDepth, start, end,trigger));
	}
	public void addSubroutine(EventListener because) {
		addSubroutine(because.getStartLine(), because.getEndLine(),because);
	}
	
	public int getNextAvailableMem() {
		return memory.size();
	}
	public void allocateMemory(int numMem) {
		for (int i=0;i<numMem;i++) {
			memory.add(null);
		}
	}
	
	public Data getMemAt(int index) {
		Data val=memory.get(index);
		if(val==null) {
			throw new NullMemoryException("Trying to access at index: "+Integer.toString(index));
		}
		return val;
	}
	public void setMemAt(int index,Data val) {
		memory.set(index, val);
	}
	public PhysicsProcesser getPhysics() {
		
		return physicsProcesser;
	}
	
	public void throwException(RuntimeException e) {
		
		endingException=e;
		
	}
	
	public void endProgram() {
		shouldRun=false;
	}
	
	
	
	

}
