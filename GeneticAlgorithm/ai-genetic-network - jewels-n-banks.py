import pygame
from mystuff import *
import math,copy,pickle,random,copy

class neuron():
    def __init__(self,weights,bias,activation):
        self.weights=weights
        self.activation=activation
        self.bias=bias
    def go(self,inputs):

        total=0
        for i in range(len(inputs)):

            total+=self.weights[i]*inputs[i]
        total+=self.bias
        r=self.activation(total)
        return r
class drawN():
    def __init__(self,n,res,pos):
        self.weights=n.weights
        self.bias=n.bias
        self.res=res
        self.pos=pos
def sig(x):
    return 1 / (1 + math.exp(-x))
def dsig(y):
	return y * (1 - y)
def step(x):
    return 1 if x>0 else -1
def lin(x):
    return x
class Animal():
    def __init__(self,brain,species,pos,color):




        if brain!="random":
            self.layers=brain
        else:
            self.layers=[]
            for i in range(len(layerNodes)):
                nodes=layerNodes[i]
                layer=[]
                if i==0:
                    inp=numIn
                else:
                    inp=layerNodes[i-1]

                for _ in range(nodes):
                    n=randomWeights(inp)
                    n=neuron(n,randomWeights(1)[0],sig)
                    layer.append(n)
                self.layers.append(layer)
        self.species=species
        self.health=100
        self.direction=random.randint(0,360)
        self.energy=0
        self.menergy=100
        self.pos=pos
        self.speed=1
        self.color=color
        self.doing="ready"
        self.delay=0
        self.diamond=0
        self.memory=[0]
        self.value=0
        self.dfound=0


    def move(self,angle,speed):
        m=moveangle(angle)

        ##self.energy-=0.018*abs(speed)

        self.pos[0]+=m[0]*speed
        self.pos[1]+=m[1]*speed
    def setdir(self,tar):
        self.direction=angle(self.pos,tar.pos)
        self.target=tar

    def reproduce(self,mut):

        newl=copy.deepcopy(self.layers)
        for l in newl:
            for n in l:
                for w in n.weights:
                    if random.random()<0.1:
                        n.weights[n.weights.index(w)]+=(random.random()-0.5)/2

                if random.random()<0.1:
                    n.bias+=(random.random()-0.5)/2
        new=Animal(newl,self.species,randompos(),self.color)
        return new

class Fruit(object):
    def __init__(self,pos,respawn,gives):
        self.pos=pos
        self.value=gives
        self.respawn=respawn
class Diamond(object):
    def __init__(self,pos,respawn,gives):
        self.pos=pos
        self.value=gives
        self.respawn=respawn
class Bank(object):
    def __init__(self,pos):
        self.pos=pos
class Poison(object):
    def __init__(self,pos,respawn,takes):
        self.pos=pos
        self.value=takes
        self.respawn=respawn
def randompos():
    return [random.randint(0,sizex),random.randint(0,sizey)]

def fdelete(self,rem):
    self.remove(rem)
    t=type(rem)
    if rem.respawn:self.append(t(randompos(),True,rem.value))

def randomWeights(inNum):
    return [(random.random()-0.5)*2 for x in range(inNum)]

animals=[]
poison=[]
diamonds=[]
fruits=[]
mutchance=1
sizex=1000
sizey=900
ticks=0
numIn=9
layerNodes=[5,3]
vis_dist=150
vis_ang=45
between=5
genLength=5000
lpos=[[]]
banks=[Bank([sizex/2,sizey/2])]
screen=pygame.display.set_mode([sizex+100*(len(layerNodes)+1),sizey])
"""OUTPUTS:
Turn Left
Turn Right
Speed
##Attack?(>0.5)
##Eat?(>0.5)
"""

"""INPUTS:
RightFood?
LeftFood?
RightPois?
LeftPois?
RightDia?
LeftDia?
RightBank?
LeftBank?
HasDiamond?
"""
numAnimals=20
for i in range(numAnimals):
    animals.append(Animal("random",random.random(),randompos(),[255,0,255]))

    ##[Behavior("energy<100","movetoward(near(food))"),Behavior("range(food)","eat(food)")]
for i in range(35):
    fruits.append(Fruit(randompos(),True,10))
for i in range(35):
    poison.append(Poison(randompos(),True,20))
for i in range(35):
    diamonds.append(Diamond(randompos(),True,20))

oldl=0

sincer=0

gen=0
pygame.init()
pygame.key.set_repeat(50,0)
font=pygame.font.Font(None,20)
selected=None
#poison=[]
def load():
    global animals
    with open('jewel.pickle', 'rb') as handle:
        animals = pickle.load(handle)
def save():
    with open('jewel.pickle', 'wb') as handle:
        pickle.dump(animals, handle, protocol=pickle.HIGHEST_PROTOCOL)
load()
delay=0

while 1:

    
    click=False
    for event in pygame.event.get():
        if event.type==pygame.QUIT:
            pygame.quit()
            sys.exit()

        elif event.type==pygame.KEYDOWN:
            if event.key==pygame.K_SPACE:
                print len(animals)
            if event.key==pygame.K_s:
                pygame.time.delay(100)
                ##genLength=999999
            if event.key == pygame.K_EQUALS:
                delay -= 1
                if delay==0:
                    between+=1
                between*=2
                print delay,between
            if event.key == pygame.K_MINUS:
                delay += 1
                between/=2
                print delay,between
            if delay<0:
                delay = 0
        elif event.type==pygame.MOUSEBUTTONUP:

            click=event.pos

    if sincer >= between:
        sincer = 0
        draw = True
    else:
        sincer += 1
        draw=False
    if delay>0: pygame.time.wait(delay)
    if draw:
        screen.fill([255, 255, 255])
    tor=[]
    for animal in animals:

        ##animal.energy-=0.0092

        if animal.pos[0] > sizex:
            animal.pos[0] = sizex
        if animal.pos[0] < 0:
            animal.pos[0] = 0
        if animal.pos[1] > sizey:
            animal.pos[1] = sizey
        if animal.pos[1] < 0:
            animal.pos[1] = 0

        if animal.direction< 0:
            animal.direction=360+animal.direction
        if animal.direction> 360:
            animal.direction=animal.direction-360

        inputs=[0,0,0,0,0,0,0,0]
        for f in fruits:
            dist=get_dist(f.pos,animal.pos)
            if dist<vis_dist:
                ang=angle(animal.pos,f.pos)
                ding=angleDiff(animal.direction,ang)

                if ding<vis_ang and ding>0:
                    inputs[0]=max((vis_dist-dist)/vis_dist,inputs[0])
                if ding>-vis_ang and ding<0:

                    inputs[1]=max((vis_dist-dist)/vis_dist,inputs[1])
        for p in poison:
            dist=get_dist(p.pos,animal.pos)
            if dist<vis_dist:
                ang=angle(animal.pos,p.pos)
                ding=angleDiff(animal.direction,ang)

                if ding<vis_ang and ding>0:
                    inputs[2]=max((vis_dist-dist)/vis_dist,inputs[2])
                if ding>-vis_ang and ding<0:

                    inputs[3]=max((vis_dist-dist)/vis_dist,inputs[3])

        for d in diamonds:
            dist=get_dist(d.pos,animal.pos)
            if dist<vis_dist:
                ang=angle(animal.pos,d.pos)
                ding=angleDiff(animal.direction,ang)

                if ding<vis_ang and ding>0:
                    inputs[4]=max((vis_dist-dist)/vis_dist,inputs[2])
                if ding>-vis_ang and ding<0:

                    inputs[5]=max((vis_dist-dist)/vis_dist,inputs[3])
        for b in banks:
            #dist=get_dist(b.pos,animal.pos)
            dist=0
            if dist<vis_dist:
                ang=angle(animal.pos,b.pos)
                ding=angleDiff(animal.direction,ang)

                if ding<vis_ang and ding>0:
                    inputs[6]=1
                if ding>-vis_ang and ding<0:

                    inputs[7]=1

        inputs.append(animal.diamond)
        prev_result=inputs
        l=0
        ldraw=draw and (animal is selected)
        if ldraw:
            lpos = []
            laypos=[]
            y = (sizey / 2) - ((len(inputs) * 90) / 2)
            for i in inputs:
                text = font.render(str(i), 0, [0, 0, 0])
                laypos.append([i, [sizex+30, y]])
                y += 90
            lpos.append(laypos)

        x = 150
        for layer in animal.layers:
            new_result=[]
            if ldraw:
                laypos=[]
                h = len(layer) * 105
                y = (sizey / 2) - (h / 2)
            for node in layer:
                res=node.go(prev_result)
                new_result.append(res)

                ##DrawLayers
                if ldraw:
                    laypos.append(drawN(node,res,[x,y]))
                    y += 105
            if ldraw:
                x += 100
                lpos.append(laypos)
            prev_result=new_result
            l+=1
            ##print "layer "+str(l)+":"+str(res[0])
        res=prev_result
        animal.direction+=res[0]*10
        animal.direction-=res[1]*10

        animal.speed = res[2]
        ##animal.memory[0]=res[3]




        animal.move(animal.direction,animal.speed)

        for f in fruits:
            if get_dist(f.pos,animal.pos)<10:
                fdelete(fruits,f)
                animal.energy+=f.value
        for d in diamonds:
            if get_dist(d.pos,animal.pos)<10:
                fdelete(diamonds,d)
                animal.diamond=1
        for p in poison:
            if get_dist(p.pos, animal.pos) < 10:
                fdelete(poison, p)
                animal.energy -= p.value
        for bank in banks:
            if get_dist(bank.pos, animal.pos) < 30:

                animal.dfound+=animal.diamond
                animal.diamond=0





        ##if animal.energy<1:
          ##  animal.health-=1
        ##if animal.energy>animal.menergy:
          ##  animal.energy=animal.menergy
        if animal.health<1:
            tor.append(animal)
        if animal.energy>50:
            ##animals.append(animal.reproduce(True))
            pass
        if click:
            if get_dist(click,animal.pos)<20:
                selected=animal
        animal.value = (animal.dfound + 1) * animal.energy
        if draw:
            col=[0,0,255] if animal is selected else (animal.color if animal.diamond==0 else [0,255,0])
            pygame.draw.circle(screen, col, [int(animal.pos[0]), int(animal.pos[1])], 5)

            pygame.draw.rect(screen, [0, 255, 0],[animal.pos[0] - 25, animal.pos[1] - 5, int(max(min(animal.health / float(100) * 50, 50), 0)),4])
            pygame.draw.rect(screen, [218, 165, 32], [animal.pos[0] - 25, animal.pos[1] - 10,int(max(min(animal.energy / float(animal.menergy) * 50, 50), 0)), 4])


            ##CenterRender
            pc = orbit([int(animal.pos[0]), int(animal.pos[1]) - vis_dist], [int(animal.pos[0]), int(animal.pos[1])],(90 - animal.direction))
            pygame.draw.line(screen, [0, 0, 0], animal.pos, pc)
            ##LeftRender
            pl = orbit([int(animal.pos[0]), int(animal.pos[1]) - vis_dist], [int(animal.pos[0]), int(animal.pos[1])],(90 - animal.direction)-vis_ang)
            col = [0, 0, 0] if inputs[3] > 0 else ([255, 0, 0] if inputs[1] == 0 else [0, 255, 0])
            pygame.draw.line(screen,col,animal.pos,pl)
            pygame.draw.line(screen, col, pc, pl)
            ##RightRender
            pr = orbit([int(animal.pos[0]), int(animal.pos[1]) - vis_dist], [int(animal.pos[0]), int(animal.pos[1])],(90 - animal.direction) + vis_ang)
            col = [0, 0, 0] if inputs[2] > 0 else ([255,0,0] if inputs[0]==0 else [0, 255, 0])
            pygame.draw.line(screen, col, animal.pos, pr)
            pygame.draw.line(screen, col, pc, pr)
            ##fruits.append(Fruit(r.pos,False,r.energy))

    if draw:
        for fruit in fruits:

            c=[255,0,0] if fruit.respawn else [150,139,105]
            pygame.draw.circle(screen,c,[int(fruit.pos[0]),int(fruit.pos[1])],5)
        for p in poison:
            c = [0, 0, 0]
            pygame.draw.circle(screen, c, [int(p.pos[0]), int(p.pos[1])], 5)
        for p in diamonds:
            c = [0, 0, 255]
            pygame.draw.circle(screen, c, [int(p.pos[0]), int(p.pos[1])], 5)
        for p in banks:

            pygame.draw.circle(screen, [150,150,150], [int(p.pos[0]), int(p.pos[1])], 30)



    for r in tor:
        animals.remove(r)
    l=len(animals)
    if l!=oldl:
        ##print l
        pass

    if draw:
        pygame.draw.rect(screen, [255, 200, 100], [sizex, 0, 100 * (len(layerNodes) + 1), sizey])
        if selected:

            
            for i in range(1,len(lpos),1):
                layer=lpos[i]
                prev = lpos[i - 1]
                for node in layer:
                    usepos = [sizex + node.pos[0], node.pos[1]]
                    for j in range(len(node.weights)):
                        w = node.weights[j]
                        wid =int(log(abs(w)*10)*3)
                        
                        ##wid=5
                        if i == 1:
                            r = lpos[0][j][0]
                        else:
                            r = prev[j].res
                        c = (255 * r)
                        if w <0:
                            c = 255-c
                        else:
                            pass
                        c = [int(c), int(c), int(c)]

                        if i == 1:
                            pos = lpos[0][j][1]
                        else:
                            pos = [sizex + prev[j].pos[0], prev[j].pos[1]]

                        pygame.draw.line(screen, c, usepos, pos, wid)
            for i in range(1,len(lpos),1):
                layer=lpos[i]
                for node in layer:
                    usepos=[sizex+node.pos[0],node.pos[1]]
                    pygame.draw.circle(screen, [255*node.res, 255*node.res, 255*node.res], usepos, 25)
                    text = font.render(str(round(node.res, 3)), 1, [0, 0, 0],[255,255,255])
                    screen.blit(text, [(sizex + node.pos[0]) - 15, node.pos[1] - 10])
            for i in lpos[0]:
                text = font.render(str(round(i[0], 3)), 1, [0, 0, 0], [255,255,255])
                screen.blit(text, [(i[1][0]) - 15,i[1][1] - 10])

            text = font.render("GenTimer: "+str(ticks), 1, [0, 0, 0], [255,255,255])
            screen.blit(text, [(sizex + 10), sizey-80])
            
            text = font.render("Value: "+str(selected.value), 1, [0, 0, 0], [255,255,255])
            screen.blit(text, [(sizex + 10), sizey-60])

            text = font.render("Food: " + str(selected.energy), 1, [0, 0, 0], [255,255,255])
            screen.blit(text, [(sizex + 10), sizey - 40])

            text = font.render("Diamonds: " + str(selected.dfound), 1, [0, 0, 0], [255,255,255])
            screen.blit(text, [(sizex + 10), sizey - 20])
        pygame.display.flip()
    ticks+=1
    if ticks>genLength:
        na=[]
        gen+=1


        animals.sort(key=lambda x: x.value,reverse=True)
        animals=animals[:10]
        ticks=0
        while len(na)!=numAnimals:
            animal=random.choice(animals)
            na.append(animal.reproduce(True))

        animals=na
        selected=None
        print gen
    elif l==0:
        pygame.quit()
        sys.exit()
    oldl=len(animals)
    ##pygame.time.delay(10)


