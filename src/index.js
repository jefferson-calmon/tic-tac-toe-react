import React from 'react'; 
import ReactDOM from 'react-dom';  
import './index.css';
import * as serviceWorker from './serviceWorker';

var status;
// point_x = 0, point_o = 0

function Square(props) {
  return (
    <button className="square" id={props.ind} onClick={props.onClick}>
      {props.value}
    </button>
  );
}



class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)
        }
        ind={i}
      />
    );
  }

  render() {
    return (
      <div className="board">
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  


  constructor() {
    super();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      point_x: 0,
      point_o: 0,
    };

    this.MarkPointPlayer = this.MarkPointPlayer.bind(this)
  }

  MarkPointPlayer = () => {
    let statX = this.state.point_x;
    let statO = this.state.point_o;
    let xIsNext = this.state.xIsNext;
    let stepNumber = this.state.stepNumber;
    let history = this.state.history;
    
    console.log(history)

    this.setState({
      history: history,
      stepNumber: stepNumber,
      xIsNext: xIsNext,
      point_x: statX,
      point_o: statO,
    })
  }
  

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    loadStatusPlayer(status)
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });

    restartPintura()

  }



  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let btnRestart = undefined;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Ir para jogada N°' + move :
        'Restart';
      
      if (desc === 'Restart'){
        
        btnRestart = <button className="restart" onClick={() => {this.jumpTo(move); restartPintura();}}>Restart</button>
        return null;
        
      } else {
        return (
          
          // <li key={move} className="jogadas">
            <button key={desc} className={"btn-jogadas"} onClick={() => {this.jumpTo(move); ShowHistory()}}>{desc}</button>
          // </li>
        );
      }
    });


    

    
    if (winner) {
      // pointState(winner)
      this.MarkPointPlayer(winner)
      status = `O Vencedor é: ${winner}`;
      
    } else {
      status = (this.state.xIsNext ? "X" : "O");
    }

    

    return (
      <div className="game" >

        <div className="top">
          <div className="jogador-x">
            <span className="point-x" id="point-x">{this.state.point_x}</span>
            <span id="jogador-x">X</span>
          </div>

          <button id="history-btn" onClick={() => ShowHistory()}>
            <i className="fas fa-outdent"></i>
          </button>

          <div className="jogador-o">
            <span className="point-o" id="point-o" >{this.state.point_o}</span>
            <span  id="jogador-o">O</span>
          </div>
        </div>

        <div className="game-board" >
          <div className="status">
            
          </div>
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
          {btnRestart}
        </div>

        <div id="menu-history" className="menu-history">
          <button className="close-history" onClick={() => ShowHistory()}>
            <i className="fas fa-times"></i>
          </button>
          <div className="grid">
            {moves}
          </div>

          <div className="creator">By <a href="https://www.linkedin.com/in/jefferson-f-b24248191/">Jefferson Ferrari</a></div>
        </div>
        
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

serviceWorker.unregister();

function loadStatusPlayer(status){
  let o = document.getElementById('jogador-o')
  let x = document.getElementById('jogador-x')

  if (status === "O") {
    o.style.textShadow = 'none'
    o.style.color = '#252e35'
    x.style.color = 'aqua'
    x.style.textShadow = '0 0 10px aqua'
  }
  if (status === "X") {
    o.style.textShadow = '0 0 10px aqua'
    o.style.color = 'aqua'
    x.style.color = '#252e35'
    x.style.textShadow = 'none'
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      
      pintarQuadrado(lines[i])
      return squares[a];
      
    }
  }
  return null;
}


function pintarQuadrado(sequencia){

  for (let i = 0; i < sequencia.length; i++){
    let seq = sequencia[i];
    let quad = document.getElementById(seq);
    quad.style.background = 'aqua';
    quad.style.color = '#16191B';
  }
}

function restartPintura() {

  for (let i = 0; i < 9; i++){
    let quad = document.getElementsByClassName('square')[i];
    quad.style.background = '#16191b'
    quad.style.color = 'aqua'
    
  }

  let o = document.getElementById('jogador-o')
  let x = document.getElementById('jogador-x')
  
  o.style.textShadow = 'none'
  o.style.color = '#252e35'
  x.style.color = 'aqua'
  x.style.textShadow = '0 0 10px aqua'
  
}
// var serialButton = false
function ShowHistory(){
  let btn = document.querySelectorAll('.btn-jogadas');
  
  
  if (btn.length > 0){

    let toggle = document.getElementById('menu-history')
    toggle.classList.toggle('active')

    for (let i = 0; i < btn.length; i++){
    let botao = document.getElementsByClassName('btn-jogadas')[i];
    botao.classList.toggle('active');
   }
   const timeButton = document.getElementById('history-btn');
   timeButton.classList.toggle('active');

  }

}


// function pointState(winner){
//   if (winner === 'X'){
//     point_x++
//     animationPoint('point-x')
//   }
//   if (winner === 'O'){
//     point_o++
//     animationPoint('point-o')
//   }

// }

function animationPoint(id){
  let element = document.getElementById(id)

  element.style.animation = 'animate .8s linear';
  setTimeout(() => {
    element.style.animation = 'none';
  }, 1000)
}