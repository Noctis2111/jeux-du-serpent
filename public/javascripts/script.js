window.onload = function ()
{
    var canvasWidth = 900;
    var canvasHeight = 600;
    var blockSize = 30;
    var ctx;
    var delay = 100;
    var snakee;
    var applee;
    var widthinblock = canvasWidth/blockSize;
    var heightinblock = canvasHeight/blockSize;
    var score;
    var timeout;
    
    init();
    
    function init()
    {
        var canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        canvas.style.border = "30px solid grey";
        canvas.style.margin = "50px auto";
        canvas.style.display = "block";
        canvas.style.backgroundColor = "#ddd"
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        snakee = new snake([[6,4], [5,4], [4,4]], "right");
        applee = new apple([10,10]);
        score = 0;
        refreshcanvas();
    }
    
    function refreshcanvas()
    {
        snakee.advance();
        if (snakee.checkcollision())
            {
                GameOver();
            }
        else
            {
                if(snakee.IsEatingApple(applee))
                    {
                        score++;
                        snakee.ateapple = true;
                       do
                           {
                               applee.setnewposition();
                           }
                        while(applee.IsOnSnake(snakee))
                    }
                ctx.clearRect(0,0,canvasWidth, canvasHeight);
                drawscore();
                snakee.draw();
                applee.draw();
                timeout = setTimeout(refreshcanvas,delay);
            }
    }
    function GameOver()
    {
        ctx.save();
        ctx.font = "bold 70px sans-serif";
        ctx.fillStyle = "#000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        var centreX = canvasWidth/2;
        var centreY = canvasHeight/2;
        ctx.strokeText("Game Over", centreX, centreY - 180);
        ctx.fillText("Game Over", centreX, centreY - 180);
        ctx.font = "bold 30px sans-serif";
        ctx.strokeText("Appuyer sur la Touche Espace pour Rejouer", centreX, centreY - 120);
        ctx.fillText("Appuyer sur la Touche Espace pour Rejouer", centreX, centreY - 120)
        
        ctx.restore();
            
    }
    function restart()
        {
            snakee = new snake([[6,4], [5,4], [4,4]], "right");
            applee = new apple([10,10]);
            score = 0;
            clearTimeout(timeout)
            refreshcanvas();
        }
        
    function drawscore()
        {
            ctx.save();
            ctx.font = "bold 200px sans-serif";
            ctx.fillStyle = "grey";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var centreX = canvasWidth/2;
            var centreY = canvasHeight/2;
            ctx.fillText(score.toString(), centreX, centreY);
        
            ctx.restore();
            
        }
    function drawblock(ctx, position)
    {
        var x = position[0] * blockSize;
        var y = position[1] * blockSize;
        ctx.fillRect(x,y, blockSize, blockSize);
    }
    
    function snake(body, direction)
    {
        this.body = body;
        this.direction = direction;
        this.ateapple = false;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#ff0000";
            for(var i = 0; i< this.body.length; i++)
                {
                    drawblock(ctx,this.body[i]);
                }
            ctx.restore();
        };
        this.advance = function()
        {
            var nextposition = this.body[0].slice();
            switch(this.direction)
                {
                    case "left":
                        nextposition[0]--;
                        break;
                    case "right":
                        nextposition[0]++;
                        break;
                    case "down":
                        nextposition[1]++;
                        break;
                    case "up":
                        nextposition[1]--;
                        break;
                    default:
                        throw("Invalid Direction");
                }
            this.body.unshift(nextposition);
            if(!this.ateapple)
                this.body.pop();
            else
                this.ateapple = false;
        };
        this.setdirection = function(newdirection)
        {
            var alloweddirection;
            switch(this.direction)
                {
                    case "left":
                    case "right":
                        alloweddirection = ["up", "down"];
                        break;
                    case "down":
                    case "up":
                        alloweddirection = ["right", "left"];
                        break;
                    default:
                        throw("Invalid Direction");
                }
            if(alloweddirection.indexOf(newdirection) > -1 )
                {
                   this.direction = newdirection; 
                    
                }
        };
        
        this.checkcollision = function()
        {
            var wallcollision = false;
            var snakecollision = false;
            var head = this.body[0];
            var rest = this.body.slice(1);
            var snakeX = head[0];
            var snakeY = head[1];
            var minX = 0;
            var minY = 0;
            var maxX = widthinblock - 1;
            var maxY = heightinblock - 1;
            var IsNotBetweenHorizontalWaals = snakeX < minX || snakeX > maxX;
            var IsNotBetweenVerticalWaals = snakeY < minY || snakeY > maxY;
            
            if(IsNotBetweenHorizontalWaals ||IsNotBetweenVerticalWaals)
                {
                    wallcollision = true;
                }
            
            for(var i = 0; i < rest.length ; i++)
                {
                    if(snakeX === rest[i][0] && snakeY === rest[i][1])
                        {
                            snakecollision = true;
                        }
                }
            
            return wallcollision || snakecollision;
        };
        this.IsEatingApple = function (appleToEat)
        {
            var head = this.body[0];
            if(head[0] === appleToEat.position[0] && head[1] === appleToEat.position[1])
                return true;
            else
                return false;
        };
        
        
    }
    
    
    function apple(position)
    {
        this.position = position;
        this.draw = function()
        {
            ctx.save();
            ctx.fillStyle = "#33cc33";
            ctx.beginPath();
            var radius = blockSize/2;
            var x = this.position[0]*blockSize +radius;
            var y = this.position[1]*blockSize+radius;
            ctx.arc(x,y, radius, 0, Math.PI*2, true);
            ctx.fill();
            ctx.restore();
        };
        this.setnewposition = function()
        {
            var newX = Math.round(Math.random() *  (widthinblock - 1));
            var newY = Math.round(Math.random() *  (heightinblock - 1));
            this.position = [newX, newY];
        };
        this.IsOnSnake = function(SnakeToCheck)
        {
            var IsOnSnake = false;
            for(var i = 0; i< SnakeToCheck.body.length; i++)
                {
                    if(this.position[0] === SnakeToCheck.body[i][0] && SnakeToCheck.body[i][1])
                        {
                            IsOnSnake = true;
                        }
                    return IsOnSnake;
                }
        }
        
        
    }
    
    
    
    document.onkeydown = function handlekeydown(e)
    {
        var key = e.keyCode;
        var newdirection;
        switch(key)
        {
            case 37:
                newdirection = "left";
                break;
            case 38:
                newdirection = "up";
                break;
            case 39:
                newdirection = "right";
                break;
            case 40:
                newdirection = "down";
                break;
            case 32:
                restart();
                return;
             default:
                return;
        }
        snakee.setdirection(newdirection);
        
    }
}