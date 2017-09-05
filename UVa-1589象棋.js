/**
 * Created by Administrator on 2017/9/5.
 */
//棋盘
var chessBoard = [];
//映射上面的棋盘，记录该点能否被吃掉，设置该数组的作用是防止原来棋盘被覆盖
var killingPointsBoard = [];
//棋盘规模
var boardRow = 10,
    boardCol = 9;
//初始化象棋棋盘为空
for(var i=0;i<boardRow;i++){
    chessBoard[i]=[];
    killingPointsBoard[i]=[]
    for(var j=0;j<boardCol;j++){
        chessBoard[i][j] = 0;
        killingPointsBoard[i][j]=0;
    }
}
//红方数据,小写字母
var redData =[
    ['g',9,4],
    ['r',2,3],
    ['h',1,5],
    ['c',2,5],
    ['c',4,5]
]
//黑方数据只有一个帅，大写字母
var blackData = {
    'G':[0,4]
}
//黑方将位置
var bPosX = 0,bPosY = 4;
//黑方将可走的位置集合，一共九个点,key为横纵坐标
var blackCanGoPosList = {
    '03':['13','04'],
    '04':['03','05','14'],
    '05':['15','04'],

    '13':['03','23','14'],
    '14':['04','13','15','24'],
    '15':['25','14','05'],

    '23':['13','24'],
    '24':['23','14','25'],
    '25':['15','24']
}
//初始化红数据
for(var i=0;i<redData.length;i++){
    chessBoard[redData[i][1]][redData[i][2]] = redData[i][0];
}
//初始化黑数据
for(var key in blackData){
    chessBoard[blackData[key][0]][blackData[key][1]] = key;
}


function outputChessBoard(){
    for(var i=0;i<boardRow;i++){
        console.log('row:'+(i)+"    "+chessBoard[i].join("  "));
    }
    console.log('   ');
    for(var i=0;i<boardRow;i++){
        console.log('killing:'+(i)+"    "+killingPointsBoard[i].join("  "));
    }
}

function isBlackDie(){
    //找出黑方将可走之处,符合棋盘规则 且 位置上没有棋子
    var canGoPosNextList = [];
    var tempPosStr = bPosX.toString()+bPosY.toString();
    var blackNextStepTheoryList = blackCanGoPosList[tempPosStr];
    for(var i=0;i<blackNextStepTheoryList.length;i++){
        //棋盘上该位置为空
        if(chessBoard[blackNextStepTheoryList[i][0]][blackNextStepTheoryList[i][1]] === 0){
            canGoPosNextList.push([blackNextStepTheoryList[i][0],blackNextStepTheoryList[i][1]])
        }
    }
    //针对每个红方棋子遍历计算其在棋盘上的杀伤区域，若该位置可以下子，赋值为'x'
    for(var k=0;k<redData.length;k++){
        caculateRedChessKillingPoints(redData[k][0],redData[k][1],redData[k][2]);
    }
    //遍历canGoPosNextList数组，查看是否有位置可走，如果一个都没有，则被将死
    var isDie = true;
    for(var k=0;k<canGoPosNextList.length;k++){
        if(killingPointsBoard[canGoPosNextList[k][0]][canGoPosNextList[k][1]]===0){
            isDie = false;
            break;
        }
    }
    return isDie;
}
//判断该点是否在棋盘内
function isPointInBoard(x,y){
    return x>=0 && x<=9 && y>=0 && y<=8;
}
//计算每个红方棋子的杀伤区域函数
function caculateRedChessKillingPoints(chessType,chessPosX,chessPosY){
    switch (chessType){
        //车，横竖都吃,不能隔子走
        case 'r':
        {
            //从当前位置左右遍历，知道位置不为空或者出界
            var tempY = chessPosY-1;
            //左:在界内 且 为空
            while(tempY>=0 && (chessBoard[chessPosX][tempY]===0 || chessBoard[chessPosX][tempY]==='x')){
                killingPointsBoard[chessPosX][tempY]='x';
                tempY--;
            }
            //右
            tempY = chessPosY+1;
            while(tempY<=8 && (chessBoard[chessPosX][tempY]===0 || chessBoard[chessPosX][tempY]==='x')){
                killingPointsBoard[chessPosX][tempY]='x';
                tempY++;
            }

            //从当前位置上下遍历
            //下
            var tempX = chessPosX+1;
            while(tempX<=9 && (chessBoard[tempX][chessPosY]===0||chessBoard[tempX][chessPosY]==='x')){
                killingPointsBoard[tempX][chessPosY]='x';
                tempX++;
            }
            //上
            tempX = chessPosX-1;
            while(tempX>=0 && (chessBoard[tempX][chessPosY]===0||chessBoard[tempX][chessPosY]==='x')){
                killingPointsBoard[tempX][chessPosY]='x';
                tempX--;
            }
        }
            break;

        //炮,隔子打，隔的那个子之后的位置都可以吃子
        case 'c':
        {
            //横方向上计算
            //左
            var tempY = chessPosY-2;
            while(tempY>=0){
                var chessCount = 0;
                for(var j=tempY+1;j<chessPosY;j++){
                    if(chessBoard[chessPosX][j]!==0 && chessBoard[chessPosX][j]!=='x'){
                        chessCount++;
                    }
                }
                //该位置可以被吃掉
                if(chessCount === 1){
                    killingPointsBoard[chessPosX][tempY] = 'x';
                }
                tempY--;
            }
            //右
            var tempY = chessPosY+2;
            while(tempY<=8){
                var chessCount = 0;
                for(var j=chessPosY+1;j<tempY;j++){
                    if(chessBoard[chessPosX][j]!==0 && chessBoard[chessPosX][j]!=='x'){
                        chessCount++;
                    }
                }
                //该位置可以被吃掉
                if(chessCount === 1){
                    killingPointsBoard[chessPosX][tempY] = 'x';
                }
                tempY++;
            }
            //上
            var tempX = chessPosX -2;
            while(tempX>=0){
                var chessCount = 0;
                for(var j=chessPosX-1;j>tempX;j--){
                    if(chessBoard[j][chessPosY]!==0 && chessBoard[j][chessPosY]!=='x'){
                        chessCount++;
                    }
                }
                //该位置可以被吃掉
                if(chessCount === 1){
                    killingPointsBoard[tempX][chessPosY] = 'x';
                }
                tempX--;
            }
            //下
            var tempX = chessPosX + 2;
            while(tempX<=9){
                var chessCount = 0;
                for(var j=tempX-1;j>chessPosX;j--){
                    if(chessBoard[j][chessPosY]!==0 && chessBoard[j][chessPosY]!=='x'){
                        chessCount++;
                    }
                }
                //该位置可以被吃掉
                if(chessCount === 1){
                    killingPointsBoard[tempX][chessPosY] = 'x';
                }
                tempX++;
            }
        }
            break;
        //马
        case 'h':
        {
            //一共八种方向,下面数组是相对马那个点的位置，每组第一个数是马腿位置,后2个是可走位置
            var dir = [[[-1,0],[-2,-1],[-2,1]], [[0,-1],[-1,-2],[1,-2]],  [[1,0],[2,-1],[2,1]],  [[0,1],[-1,2],[1,2]]];
            //遍历8个方向
            for(var i=0;i<dir.length;i++){
                var horseLeg = dir[i][0];
                //如果在棋盘内 且 不是马腿才行
                if(isPointInBoard(chessPosX + horseLeg[0],chessPosY + horseLeg[1]) && chessBoard[chessPosX + horseLeg[0]][chessPosY + horseLeg[1]]===0){
                    //2个位置
                    for(var j=1;j<=2;j++){
                        var tempDir = dir[i][j];
                        //如果在棋盘内
                        if(isPointInBoard(chessPosX+tempDir[0],chessPosY+tempDir[1])){
                            killingPointsBoard[chessPosX+tempDir[0]][chessPosY+tempDir[1]] = 'x';
                        }
                    }

                }
            }
        }
            break;
        default:
            break;
    }
}


//代码测试
console.log(isBlackDie())
