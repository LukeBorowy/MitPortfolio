package main;

import java.util.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.io.*;

import compiler.*;
import compiler.Compiler;
import data.*;
import events.EventListener;
public class Main {
	public static List<String> readFileIntoList(String fileName){
	 
	    List<String> lines = Collections.emptyList();
	    try
	    {
	      lines = Files.readAllLines(Paths.get(fileName), StandardCharsets.UTF_8);
	    }
	 
	    catch (IOException e)
	    {
	 
	      // do something
	      e.printStackTrace();
	    }
	    return lines;
	}
	public static void main(String[] args) {
		String fileName=args[0];
		List<String> lines=readFileIntoList(fileName);
		
		
		Program compiledProgram=Compiler.compile(lines);
		System.out.println();//newline
		compiledProgram.run();
        /*
         * 
		 * 
		 * 
		 * clicking
		 * 
		 * webpage access
         */
		
		
		
		
		/*
		open a 500 by 300 game window
		draw a 70 by 10 rectangle at the bottom edge.
		start points at 0
		display points at the top of the screen
		when the left key is pressed, move the rectangle left
		when the right key is pressed, move the rectangle right
		make the rectangle move 5 faster.
		draw a 15 by 15 green circle in the center of the screen
		start the circle moving.
		make the circle go faster
		if the circle touches the rectangle, make the circle bounce off.
		if the circle touches the sides of the screen, make it bounce off.
		if the circle touches the top of the screen, make the circle go faster. gain a point.
		if the circle touches the bottom edge, display "You Lost" on screen. stop the circle. After 2 seconds, end the game.
		*/


	}

}
