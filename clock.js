class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      break: 5,
      session: 25,
      displayMinutes: "25",
      displaySeconds: "00",
      timerLabel: "SESSION",
      start: false
    }
    this.breakDecrement = this.breakDecrement.bind(this)
    this.breakIncrement = this.breakIncrement.bind(this)
    this.sessionDecrement = this.sessionDecrement.bind(this)
    this.sessionIncrement = this.sessionIncrement.bind(this)
    this.syncDisplay = this.syncDisplay.bind(this)
    this.handleStartStop = this.handleStartStop.bind(this)
    this.reset = this.reset.bind(this)
  }
  //sync display with minutes
  syncDisplay(minutes) {
    minutes = minutes.toString().split("")
    if (minutes.length===1){
      minutes.unshift("0")
    }
    minutes = minutes.join("")
    this.setState({
      displayMinutes: minutes,
      displaySeconds: "00"
    })
    return minutes
  }

  //increment/decrement
  breakDecrement() {
    if (this.state.break>1 && !this.state.start){   
      this.setState({
        break: this.state.break - 1
      })
    }
  }
  breakIncrement() {
    if(this.state.break<60 && !this.state.start){
      this.setState({
        break: this.state.break + 1
      })
    }
  }
  sessionDecrement() {
    if (this.state.session>1 && !this.state.start){   
      let session = this.state.session - 1
      this.setState({
        session: session
      })
    this.syncDisplay(session)
    }
  }
  sessionIncrement() {
    if(this.state.session<60 && !this.state.start){
      let session = this.state.session + 1
      this.setState({
        session: session
      })
      this.syncDisplay(session)
    }
  }

  //start/stop
  handleStartStop() {
    this.setState({
      start: !this.state.start
    })
  }
  //reset
  reset() {
    document.getElementById("progress-bar").style.width = "0px";
    document.getElementById("beep").load();
    this.setState({
      break: 5,
      session: 25,
      displayMinutes: "25",
      displaySeconds: "00",
      timerLabel: "SESSION",
      start: false
    })
  }
  //timer
  componentDidMount() {
    setInterval(() => {
      let sec = parseInt(this.state.displaySeconds)
      let min = parseInt(this.state.displayMinutes)
      if(this.state.start){
        if(sec === 1 && min === 0){
          document.getElementById("beep").play()}
        if (sec === 0 && min !== 0){
          min -= 1
          sec = 59
        }
        else if (sec === 0 && min === 0){
          if (this.state.timerLabel == "SESSION"){
            min = this.syncDisplay(this.state.break)
            sec = "00"
            this.setState({
              timerLabel: "BREAK"
            })
          }
          else{
            min = this.syncDisplay(this.state.session)
            sec = "00"
            this.setState({
              timerLabel: "SESSION"
            })
          }
        }
        else {
          sec -= 1
        }
        sec = sec.toString().split("")
        min = min.toString().split("")
        if (sec.length<2){sec.unshift("0")}
        if (min.length<2){min.unshift("0")}
        min = min.join("")
        sec = sec.join("")
        this.setState({
          displayMinutes: min,
          displaySeconds: sec
        })

        //progress bar
        let y = parseInt(this.state.displayMinutes)*60 + parseInt(this.state.displaySeconds);
        let x;
        let percent;
        let windowWidth = window.innerWidth;
        if (this.state.timerLabel == "SESSION") {
          x = this.state.session*60;
          percent = 1-y/x;
        }
        else {
          x = this.state.break*60;
          percent = y/x;
        }
        if (this.state.session == this.state.displayMinutes && this.state.displaySeconds == "00" && this.state.timerLabel == "SESSION") {
        }
        else if (this.state.break == this.state.displayMinutes && this.state.displaySeconds == "00" && this.state.timerLabel == "BREAK") {
        }
        else {
          let color = `hsl(24, 100%, ${Math.floor((1-percent)*50)+50}%)`;
          let width = `${Math.floor(percent*windowWidth)}px`;
          document.getElementById("progress-bar").style.width = width;
          document.getElementById("progress-bar").style.backgroundColor = color;
          console.log(width, color)
        }}
    }, 1000)
  }

  render() {
    return(
      <div id="clock">
        <div id="controls">
          <div id="start_stop" className="button" onClick={this.handleStartStop}>{this.state.start ? <div><i className="fas fa-pause"></i><div id="pause-text">PAUSE</div></div>:<div><i className="fas fa-play"></i><div id="pause-text">RESUME</div></div>}</div>
          <div id="reset" className="button" onClick={this.reset}><div><i id="hourglass" className="fas fa-undo-alt"></i><div id="reset-text">RESET</div></div></div>
        </div>
        <div id="display">
          <div id="break">
            <div id="break-label" className = "session-break">BREAK</div>
            <div id="break-length" className = "session-break display-length">{this.state.break}</div>
            <div id="break-decrement" onClick={this.breakDecrement} className = "session-break button"><i className="fas fa-caret-square-down"></i></div>
            <div id="break-increment" onClick={this.breakIncrement} className = "session-break button"><i className="fas fa-caret-square-up"></i></div>
          </div>
          <div id="session">
            <div id="session-label" className = "session-break">SESSION</div>
            <div id="session-length" className = "session-break display-length">{this.state.session}</div>
            <div id="session-decrement" onClick={this.sessionDecrement} className = "session-break button"><i className="fas fa-caret-square-down"></i></div>
            <div id="session-increment" onClick={this.sessionIncrement} className = "session-break button"><i className="fas fa-caret-square-up"></i></div>
          </div>
          <div id="timer">
            <div id="timer-label">{this.state.timerLabel}<div id="progress-bar"></div></div>
            <div id="time-left">{this.state.displayMinutes}:{this.state.displaySeconds}</div>
          </div>
          <audio id="beep" src="coin.mp3" />
        </div>
      </div>
    )
  }
  
}

ReactDOM.render(<App />, document.getElementById("root"))
