window.onload=function(){
	//初始化游戏
	game.init();
	//onkeydown事件
	document.onkeydown=function(){
	//只有在游戏状态不是动画进行中的时候，按键才产生新的事件，不然会出现按键过多，动画卡住情况
		if(game.state!=game.animation_run){
			var event=window.event;
			//游戏没有结束时，按键生效
			if(game.state==game.isRun){	
				if(event.keyCode==37){
					game.Left_move();	
				}else if(event.keyCode==39){
					game.Right_move();	
				}
				else if(event.keyCode==38){
					game.Up_move();	
				}
				else if(event.keyCode==40){
					game.Down_move();	
				}
			}
		}
	}
	//实现手机触摸
    var touchOn = function(o){ 

        var that = this;
        this.config = o;
        this.control = false;
        this.sPos = {};
        this.mPos = {};
        this.dire;
        this.config.bind.addEventListener('touchstart', function(e){ return that.start(e); } ,false);
        this.config.bind.addEventListener('touchmove', function(e){ return that.move(e); } ,false);
        this.config.bind.addEventListener('touchend', function(e){ return that.end(e); } ,false);

    }
    touchOn.prototype.start = function(e){
         
         var point = e.touches ? e.touches[0] : e;
         this.sPos.x = point.screenX;
         this.sPos.y = point.screenY;
    }
    touchOn.prototype.move = function(e){  

        var point = e.touches ? e.touches[0] : e;
        this.control = true;
        this.mPos.x = point.screenX;
        this.mPos.y = point.screenY;
    }
    touchOn.prototype.end = function(e){

        this.config.dire_h  && (!this.control ? this.dire = null : this.mPos.x > this.sPos.x ? game.Right_move() : game.Left_move())
        this.config.dire_h  || (!this.control ? this.dire = null : this.mPos.y > this.sPos.y ? game.Down_move() : game.Up_move())

        this.control = false;
    }
    var touchDemo=new touchOn({bind:document.getElementById("touch"),
            dire_h:true,   
	})   	
}
//游戏对象
var game={
	data:[],//二维数组，存放数字
	score:0,//分数记录
	state:1,//游戏状态
	isRun:1,//未结束状态
	isOver:0,//结束状态
	animation_run:2,//动画正在进行
	init:function(){//初始化游戏
		this.data=[ [0,0,0,0],
					[0,0,0,0],
					[0,0,0,0],
					[0,0,0,0] ];	
		this.score=0;	
		this.state=this.isRun;
		//随机生成两个起始方块
		this.randomNum();
		this.randomNum();
		//渲染样式，画格子
		this.render();
		document.getElementById("gameOver").style.display="none";
		document.getElementById("success").style.display="none";
	},
	//判断方块是否已满，已满则不生成随机数
	isFull:function(){
		for(var row=0;row<4;row++){
			for(var col=0;col<4;col++){
				if(this.data[row][col]==0){
					return false;
				}	
			}
		}
		return true;	
	},
	//生成随机数，在起始和移动的时候产生新方块
	randomNum:function(){
		if(this.isFull()){return;}
		while(true){
			//此时的范围是[0,4)的整数
			var row=Math.floor(Math.random()*(3-0+1));
			var col=Math.floor(Math.random()*(3-0+1));
			if(this.data[row][col]==0){
				//Math.random()的范围是0-1，则小于0.5是一半可能
				this.data[row][col]=Math.random()<0.5?2:4;
				break;
			}			
		}
	},
	//渲染界面
	render:function(){
		for(var row=0;row<4;row++){
			for(var col=0;col<4;col++){
				//如果为0，则内容为空，不为0，内容为当前值
				document.getElementById("g"+row+col).innerHTML=this.data[row][col]==0?"":this.data[row][col];
				document.getElementById("g"+row+col).className=this.data[row][col]==0?"grid-cell":"grid-cell n"+this.data[row][col];
				document.getElementById("score").innerHTML=this.score;
			}
		}
		//游戏结束是渲染
		if(this.isGameOver()){
			this.state=this.isOver;
			var div=document.getElementById("gameOver");
			var finalSocre=document.getElementById("finalScore");
			finalSocre.innerHTML=this.score;
			div.style.display="block";
		}
		if(this.isGameSuccess()){
			this.state=this.isOver;
			var div=document.getElementById("success");
			var finalSocre=document.getElementById("finalScore");
			finalSocre.innerHTML=this.score;
			div.style.display="block";
		}
	},
	//判断游戏是否结束,检查每个元素右边和下边，是否有相等元素，不用单独考虑0的情况，已包含
	isGameOver:function(){
		if(!this.isFull()){return false;}
		for(var row=0;row<4;row++){
			for(var col=0;col<4;col++){
				if(col<3){
					if(this.data[row][col]==this.data[row][col+1]){
						return false;
					}
				}
				if(row<3){
					if(this.data[row][col]==this.data[row+1][col]){
						return false;
					}
				}
			}
		}
		return true;
	},
	//判断游戏是否成功
	isGameSuccess:function(){
		for(var row=0;row<4;row++){
			for(var col=0;col<4;col++){
					if(this.data[row][col]==2048){
						return true;
					}
				}
			}
		return false;		
		},
	//判断能否左移
	Left_can:function(){
		for(var row=0;row<4;row++){
			//注意列下标，此时不能为0，首行时不用判断
			for(var col=1;col<4;col++){
				if(this.data[row][col]!=0){
					if(this.data[row][col-1]==0||this.data[row][col]==this.data[row][col-1]){
						return true;
					}
				}
			}
		}
		return false;
	},
	//判断能否右移
	Right_can:function(){
		for(var row=0;row<4;row++){
			//注意列下标,此时最后一行不用考虑
			for(var col=0;col<3;col++){
				if(this.data[row][col]!=0){
					if(this.data[row][col+1]==0||this.data[row][col]==this.data[row][col+1]){
						return true;
					}
				}
			}
		}
		return false;
	},
	//判断能否上移
	Up_can:function(){
		//注意行下标，首行不用考虑
		for(var row=1;row<4;row++){
			for(var col=0;col<4;col++){
				if(this.data[row][col]!=0){
					if(this.data[row-1][col]==0||this.data[row][col]==this.data[row-1][col]){
						return true;
					}
				}
			}
		}
		return false;
	},
	//判断能否下移
	Down_can:function(){
		//注意行下标，最后一行不用考虑
		for(var row=0;row<3;row++){
			for(var col=0;col<4;col++){
				if(this.data[row][col]!=0){
					if(this.data[row+1][col]==0||this.data[row][col]==this.data[row+1][col]){
						return true;
					}
				}
			}
		}
		return false;
	},
	//每一行元素都左移
	Left_move:function(){
		if(this.Left_can()){
			for(var row=0;row<4;row++){
				this.Left_move_row(row);
			}
			this.state=this.animation_run;
			animation.init();
			//运动结束后，重新生成和渲染，间隔时间是animation.times*animation.interval
			setTimeout(function(){
				game.state=game.isRun;
				game.randomNum();
			    game.render();	
			
			},animation.times*animation.interval);
			
		}
	},
	//每一行元素都右移
	Right_move:function(){
		if(this.Right_can()){
			for(var row=0;row<4;row++){
				this.Right_move_row(row);
			}
			this.state=this.animation_run;
			animation.init();
			setTimeout(function(){
				game.state=game.isRun;
				game.randomNum();
			    game.render();	
			
			},animation.times*animation.interval);
		}
	},
	//每一列元素都上移
	Up_move:function(){
		if(this.Up_can()){
		for(var col=0;col<4;col++){
				this.Up_move_col(col);
			}
			this.state=this.animation_run;
			animation.init();
			setTimeout(function(){
				game.state=game.isRun;
				game.randomNum();
			    game.render();	
			
			},animation.times*animation.interval);
		}
	},
	//每一列元素都下移
	Down_move:function(){
		if(this.Down_can()){
			for(var col=0;col<4;col++){
				this.Down_move_col(col);
			}
			this.state=this.animation_run;
			animation.init();
			setTimeout(function(){
				game.state=game.isRun;
				game.randomNum();
			    game.render();	
			
			},animation.times*animation.interval);
		}
	},
	//在行中左移
	Left_move_row:function(row){
		for(var col=0;col<=2;col++){
			//得到右侧第一个不为0的数，进行判断
			var nextCol=this.getRight(row,col);
			if(nextCol==-1){
				break;
			}else{
				//如果当前值为0，则和nextCol交换值
				if(this.data[row][col]==0){
					this.data[row][col]=this.data[row][nextCol];
					this.data[row][nextCol]=0;
					//为动画添加任务，传入始元素的下标和目标元素的下标
					animation.addTask(""+row+nextCol,""+row+col);
					//此时目标元素移动，则下标跟随变化
					col--;
				//如果两个值相等，则当前值翻倍
				}else if(this.data[row][col]==this.data[row][nextCol]){
					this.data[row][col]*=2;
					this.score+=this.data[row][col];
					this.data[row][nextCol]=0;
					animation.addTask(""+row+nextCol,""+row+col);
				}
			}
		}
	},
	//得到右边不为0的元素
	getRight:function(row,col){
		for(var i=col+1;i<4;i++){
			if(this.data[row][i]!=0){
				return i;	
			}	
		}		
		return -1;	
	},
	Right_move_row:function(row){
		for(var col=3;col>0;col--){
			var nextCol=this.getLeft(row,col);
			if(nextCol==-1){
				break;
			}else{
				if(this.data[row][col]==0){
					this.data[row][col]=this.data[row][nextCol];
					this.data[row][nextCol]=0;
					animation.addTask(""+row+nextCol,""+row+col);
					col++;
				}else if(this.data[row][col]==this.data[row][nextCol]){
					this.data[row][col]*=2;
					this.score+=this.data[row][col];
					this.data[row][nextCol]=0;
					animation.addTask(""+row+nextCol,""+row+col);
				}
			}
		}
	},
	getLeft:function(row,col){
		for(var i=col-1;i>=0;i--){
			if(this.data[row][i]!=0){
				return i;	
			}	
		}		
		return -1;	
	},
	Up_move_col:function(col){
		for(var row=0;row<3;row++){
			var nextRow=this.getDown(row,col);
			if(nextRow==-1){
				break;
			}else{
				if(this.data[row][col]==0){
					this.data[row][col]=this.data[nextRow][col];
					this.data[nextRow][col]=0;
					animation.addTask(""+nextRow+col,""+row+col);
					row--;
				}else if(this.data[row][col]==this.data[nextRow][col]){
					this.data[row][col]*=2;
					this.score+=this.data[row][col];
					this.data[nextRow][col]=0;
					animation.addTask(""+nextRow+col,""+row+col);
				}
			}
		}
	},
	getDown:function(row,col){
		for(var i=row+1;i<4;i++){
			if(this.data[i][col]!=0){
					return i;
			}
		}
		return -1;
	},
	Down_move_col:function(col){
		for(var row=3;row>0;row--){
			var nextRow=this.getUp(row,col);
			if(nextRow==-1){
				break;
			}else{
				if(this.data[row][col]==0){
					this.data[row][col]=this.data[nextRow][col];
					this.data[nextRow][col]=0;
					animation.addTask(""+nextRow+col,""+row+col);
					row++;
				}else if(this.data[row][col]==this.data[nextRow][col]){
					this.data[row][col]*=2;
					this.score+=this.data[row][col];
					this.data[nextRow][col]=0;
					animation.addTask(""+nextRow+col,""+row+col);
				}
			}
		}
	},
	getUp:function(row,col){
		for(var i=row-1;i>=0;i--){
			if(this.data[i][col]!=0){
				return i;	
			}	
		}		
		return -1;	
	},
}

// 构造一个移动命令函数
function Task(obj,topStep,leftStep){
	this.obj=obj;
	//y轴移动
	this.topStep=topStep;
	//x轴移动
	this.leftStep=leftStep;
}
//添加元素的移动方法，因为每个元素的移动方法不同，从而使用prototype扩展
Task.prototype.moveStep=function(){
	//getComputed可以得到当前元素的所有样式属性
	var style=getComputedStyle(this.obj,null);	
	var top=parseInt(style.top);
	var left=parseInt(style.left);
	//通过改变定位宽和高，来使得元素看起来移动
	this.obj.style.top=top+this.topStep+"px";
	this.obj.style.left=left+this.leftStep+"px";
}
//清除命令产生任务中的样式
Task.prototype.clear=function(){
	this.obj.style.left="";
	this.obj.style.top="";
}
var animation={
	times:20,//每个动画20步完成
	interval:20,//20毫秒迈一步	
	timer:null,//定时对象，每一步的移动
	tasks:[],//键盘命令带来的所有移动的任务
	
	addTask:function(source,target){
		console.log(source+","+target);
		var sourceDiv=document.getElementById("g"+source);
		var targetDiv=document.getElementById("g"+target);
		var sourceStyle=getComputedStyle(sourceDiv);
		var targetStyle=getComputedStyle(targetDiv);
		var topStep=(parseInt(targetStyle.top)-parseInt(sourceStyle.top))/this.times;
		var leftStep=(parseInt(targetStyle.left)-parseInt(sourceStyle.left))/this.times;
		var task=new Task(sourceDiv,topStep,leftStep);
		this.tasks.push(task);
	},
	
	init:function(){
		this.timer=setInterval(function(){
			for(var i=0;i<animation.tasks.length;i++){
				animation.tasks[i].moveStep();	
			}	
			animation.times--;
			if(animation.times==0){
				//当运动完成后，清除当前命令的任务数组中的样式
				for(var i=0;i<animation.tasks.length;i++){
				animation.tasks[i].clear();	
				}
				clearInterval(animation.timer);
				animation.timer=null;
				animation.tasks=[];
				animation.times=10;	
			}
		},this.interval);
	}
}