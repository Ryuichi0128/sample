"use strict";

const WIDTH         = 480;          // 画面サイズ幅
const HEIGHT        = 320;          // 画面サイズ高さ
const MOVE_MAX      = 15;           // プレイヤー移動量MAX値
const SPD_WALK      = 3;            // 歩行速度定義
const SPD_RUN       = 7;            // 走行速度定義

// ■■■　画像関連　■■■
let MarioL;                         // マリオ左向き
let MarioR;                         // マリオ右向き
// ■■■　値　■■■
let playerX     = WIDTH / 2;        // プレイヤー位置X
let playerSizeX = 70;               // プレイヤーサイズ幅
let playerSizeY = 70;               // プレイヤーサイズ高さ
let moveFlg     = [false, false];   // プレイヤー移動フラグ[walk, run]
let moveDire    = "Nothing";        // プレイヤー移動向き["" or ""]
let moveCnt     = 0;                // プレイヤー移動量カウンタ
let mousePosX   = 0;                // マウスカーソル座標X
let mousePosY   = 0;                // マウスカーソル座標Y
let clickX;                         // クリック座標X
let clickY;                         // クリック座標Y
let VCanvas;                        // 仮想画面（描画用）


// ****************************************************************************
// **********　開始処理　*********************
window.onload = function(){
    let canvas = document.getElementById('main');       // キャンバス取得
    canvas.width = WIDTH;                               // キャンバス幅設定
    canvas.height = HEIGHT;                             // キャンバス高さ設定

    VCanvas = document.createElement( "canvas" )        // 仮想画面作成
    VCanvas.width = WIDTH;                              // 仮想画面の幅設定
    VCanvas.height = HEIGHT;                            // 仮想画面の高さ設定

    // 画像ロード
    LoadingImages();

    // ----- イベント発火（マウス移動） --------------------------------------
    canvas.addEventListener('mousemove', function (evt) {
        var mousePos = getMousePosition(canvas, evt);
        mousePosX = mousePos.x;             // マウスカーソルX位置取得
        mousePosY = mousePos.y;             // マウスカーソルY位置取得
    }, false);
    // ----------------------------------------------------------------------
    // ----- イベント発火（マウスクリック） -----------------------------------
    canvas.addEventListener('click', function(evt){
        var mousePos = getMousePosition(canvas, evt);
        clickX = mousePos.x;                // マウスカーソルX位置をクリックX位置に設定
        clickY = mousePos.y;                // マウスカーソルY位置をクリックY位置に設定

        // 走行スイッチ
        if (moveFlg[0] && !moveFlg[1] || moveFlg[1]){      // プレイヤー移動フラグ（walk）ON（run）OFF、もしくは(run)ONの場合
            moveFlg[0] = false;             // プレイヤー移動（walk）フラグOFF
            moveFlg[1] = true;              // プレイヤー移動（run）フラグON
            moveCnt = 0;                    // プレイヤー移動カウンタ初期化
        }
        // 歩行スイッチ
        if (!moveFlg[0] && !moveFlg[1]){   // プレイヤー移動フラグ（walk）OFF（run）OFFの場合
            moveFlg[0] = true;             // クリックフラグ（１回目）ON
            moveFlg[0] = true;              // プレイヤー移動（walk）フラグON
        }
        // 反対向きにクリック時
        if ((moveDire == "Right" && clickX < (playerX + playerSizeX / 2)) || (moveDire == "Left" && clickX >= (playerX + playerSizeX / 2))){
            moveCnt = 0;
            moveDire = "Nothing";
            moveFlg = [false, false];
        }
    }, false);
    // ----------------------------------------------------------------------

    // 20ms間隔でMainLoop()を呼び出す（50fps）
    setInterval( function() { MainLoop() },  20 );

}
// ****************************************************************************

// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ■■■　画像読み込み処理　■■■
function LoadingImages() {
    MarioL = new Image(); MarioL.src = "img/mario_left.png";  // マリオ画像読み込み
    MarioR = new Image(); MarioR.src = "img/mario_right.png"; // マリオ画像読み込み
}
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ■■■　マウスカーソル位置取得処理　■■■
function getMousePosition(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left, X: evt.clientX - rect.left,
        y: evt.clientY - rect.top, Y: evt.clientY - rect.top
    };
}
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ■■■　仮想画面描画処理　■■■
function DrawMain(){
    const Vcon = VCanvas.getContext("2d");                  // 仮想画面指定

    Vcon.clearRect(0, 0, VCanvas.width, VCanvas.height);    // 画面初期化
    Vcon.strokeRect(0, 0, VCanvas.width, VCanvas.height);   // 画面枠描画

    // プレイヤー描画
    if (mousePosX < playerX + playerSizeX / 2){
        // 左向き
        Vcon.drawImage(MarioL, 0, 140, 70, 70, playerX, VCanvas.height - playerSizeY, playerSizeX, playerSizeY);
    }else{
        // 右向き
        Vcon.drawImage(MarioR, 148, 140, 70, 70, playerX, VCanvas.height - playerSizeY, playerSizeX, playerSizeY);
    }
/*        // プレイヤー中心線
        Vcon.fillStyle = "red";
        Vcon.beginPath();
            Vcon.lineTo(playerX + playerSizeX / 2, 0);
            Vcon.lineTo(playerX + playerSizeX / 2, VCanvas.height);
        Vcon.stroke();
*/

    // 詳細表示
    Vcon.fillStyle = 'red';
    Vcon.font = '10pt "MSゴシック"';
    Vcon.fillText("カーソル座標", 10, 20);
        Vcon.fillText("X:" + mousePosX, 10, 35);
        Vcon.fillText("Y:" + mousePosY, 10, 50);
    Vcon.fillText("クリック座表", 100, 20);
        Vcon.fillText("X:" + clickX, 100, 35);
        Vcon.fillText("Y:" + clickY, 100, 50);
    Vcon.fillText("歩く：" + moveFlg[0], 10, 80);
    Vcon.fillText("走る：" + moveFlg[1], 10, 95);
    Vcon.fillText("移動カウンタ:" + moveCnt, 10, 110);
    Vcon.fillText("プレイヤー", 240, 20);
        Vcon.fillText("X:" + playerX, 240, 35);
}
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ■■■　プレイヤー処理　■■■
function playerProcess(){
    // クリック時移動方向設定
    if (moveFlg[0] == true && moveDire == "Nothing"){
        if (clickX <= playerX + playerSizeX / 2){
            // 左移動フラグ設定
            moveDire = "Left";
        }else{
            // 右移動フラグ設定
            moveDire = "Right";
        }
    }

    let speed;                          // 移動速度定義
    if (moveFlg[0]) speed = SPD_WALK    // 歩行速度
    if (moveFlg[1]) speed = SPD_RUN     // 走行速度

    // 移動処理
    switch (moveDire) {
        case "Left":
            playerX -= speed;
            moveCnt ++;
            break;
        case "Right":
            playerX += speed;
            moveCnt ++;
            break;
        default:
    }

    // 移動処理初期化
    if (moveCnt >= MOVE_MAX){
        moveCnt = 0;
        moveDire = "Nothing";
        moveFlg = [false, false];
    }
}
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■


// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ■■■　■■■　■■■　■■■　■■■　■■■　メインループ　■■■　■■■　■■■　■■■　■■■　■■■　■■■
function MainLoop() {
    // プレイヤー処理
    playerProcess();

    // 仮想画面描画処理
    DrawMain();

    // 実画面指定
    var canvas = document.getElementById('main');
    var context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(VCanvas, 0, 0, VCanvas.width, VCanvas.height,
                               0, 0, canvas.width, canvas.height);
}
// ■■■　■■■　■■■　■■■　■■■　■■■　メインループ　■■■　■■■　■■■　■■■　■■■　■■■　■■■
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
// ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
