package graphics;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.EventQueue;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.util.Random;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.Timer;

import events.WindowController;
import main.Program;

class Surface extends JPanel implements ActionListener {

    WindowController controller;
    public Surface(WindowController controller,int width, int height) {
        setPreferredSize(new Dimension(width,height));
    	this.controller=controller;
    }


    @Override
    public void paintComponent(Graphics g) {

        super.paintComponent(g);
        //System.out.println("thing");
        controller.doDrawing((Graphics2D) g);
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        repaint();

    }
}


public class DisplayWindow extends JFrame {

	public WindowController eventListeners;
	public Surface surface;
	public Program program;
	public int width;
	public int height;
    public DisplayWindow(int width,int height,String name,Program program) {

    	this.width=width;
    	this.height=height;
    	
    	eventListeners=program.getEventHandlers();
    	this.program=program;
    	program.connectToWindow(this);
    	
    	addMouseListener(eventListeners);
        addMouseMotionListener(eventListeners);
        addKeyListener(eventListeners);
        validate();

        initUI(width,height,name);
        setPreferredSize(new Dimension(width,height));
        

        setFocusable(true);
        this.setVisible(true);
        
       
        // ask the timer to call me every 60 times a second so every 16 ms

        new Timer(16, surface).start();
    }

    private void initUI(int width,int height,String name) {

        surface = new Surface(eventListeners,width,height);
        add(surface);
        pack();

        setTitle(name);

        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
    }

}