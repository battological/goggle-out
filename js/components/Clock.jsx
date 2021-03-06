var Clock = React.createClass({
  getDefaultProps() {
    return({
      lookAwayMsg: 'Time for an eye break!',
      lookBackMsg: 'You can look back, now!',
      screenClockTime: 20*60*1000,  // 20 min * 60 sec * 1000 millisec
      awayClockTime: 20*1000  // 20 sec * 1000 millisec
    });
  },

  getInitialState() {
    return ({
      currentClockTime: this.props.screenClockTime,
      currentClock: this.formatMilliseconds(this.props.screenClockTime),
      mode: 1,  // 1 for screen, 0 for away
      clockStatus: null
    });
  },

  handleClick(time, text) {
    if (this.state.clockStatus) {  // If we're counting down (either mode)
      this.stopCountdown();
    } else {  // If the clock's not counting down
      this.countdown(this.state.currentClockTime, this.props.lookAwayMsg);
    }
  },

  /**
   * Updates the clock with a countdown for a specified amount of time
   * @param time {number} - Initial clock time in milliseconds
   * @param text {string} - The text of the alert to appear at the end of the countdown
   */
  countdown(time, text) {
    // Update clock if time differs from current state
    if (time != this.state.currentClockTime) {
      this.updateClock(time);
    }

    // Countdown the clock by 1 second
    this.setState({
      clockStatus: setTimeout(function() {
        var newTime = this.state.currentClockTime-1000;
        this.updateClock(newTime);

        // If the clock has reached zero, sound the alarm
        if (!this.state.currentClockTime) {
          this.soundAlarm(text);
        } else {  // Otherwise repeat
          this.countdown(this.state.currentClockTime, text);
        }
      }.bind(this), 1000)
    });
  },

  stopCountdown() {
    clearTimeout(this.state.clockStatus);  // Stop the clock
    this.setState({ clockStatus: null });
    this.updateClock(this.props.screenClockTime);  // Reset the clock
  },

  /**
   * Alerts the user to something
   * @param {string} text - The text of the alert
   */
  soundAlarm(text) {
    var alarm = new Audio('public/audio/alert.wav');
    alarm.play();
    alert(text);

    
    this.toggleMode();
    if (!this.state.mode) {  // If we just ended screen mode
      this.countdown(this.state.currentClockTime, this.props.lookBackMsg);
    } else {  // If we just ended away mode
      this.countdown(this.state.currentClockTime, this.props.lookAwayMsg);
    }
  },

  toggleMode() {
    this.setState({ mode: !this.state.mode });

    // Set the clock time and the clock for the new mode
    var cct = this.props.screenClockTime;
    if (!this.state.mode) {
      cct = this.props.awayClockTime;
    }
    this.updateClock(cct);
  },
    
  /**
   * Updates the state of the clock
   * @param {number} newClockTime - The new clock time in milliseconds
   */
  updateClock(newClockTime) {
    this.setState({ 
      currentClockTime: newClockTime,
      currentClock: this.formatMilliseconds(newClockTime)
    });
  },

  /**
   * Convert milliseconds into a clock
   * @params {number} ms - Number of milliseconds
   * @return {string} - The formatted clock
   */
  formatMilliseconds(ms) {
    var d = new Date(ms);
    var hour = (d.getHours() < 9 ? '0' : '')+d.getHours();
    var min = (d.getMinutes() <= 9 ? '0' : '')+d.getMinutes();
    var sec = (d.getSeconds() <= 9 ? '0' : '')+d.getSeconds();
    return min+':'+sec;
  },

  render() {
    return(
      <div className="clock-container">
        <div className="clock">
	  {this.state.currentClock}
  	</div>
        <button 
  	  className="start-clock" 
	  onClick={this.handleClick}>
	  {this.state.clockStatus ? 'Stop' : 'Start' }
	</button>
      </div>
    );
  }
});

module.exports = Clock;
