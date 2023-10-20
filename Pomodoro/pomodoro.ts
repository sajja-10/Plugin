import { Notice, moment, TFolder, TFile } from 'obsidian';
import { MyPluginSettings } from '../main';
import MyPlugin from '../main';


const MILLISECS_IN_MINUTE = 60 * 1000;

function setStatusBarText(title: string, content: string): void {
    const notificationContent = document.createElement('div');
    notificationContent.innerHTML = content;

    
}

export const enum Mode {
	Pomo,
	NoTimer
}


export class Timer {
	plugin: MyPlugin;
	settings: MyPluginSettings;
	startTime: moment.Moment; /*when currently running timer started*/
	endTime: moment.Moment;   /*when currently running timer will end if not paused*/
	mode: Mode;
	pausedTime: number;  /*time left on paused timer, in milliseconds*/
	paused: boolean;
	autoPaused: boolean;
	autoStartAfterManualStop: boolean;

	constructor(plugin: MyPlugin) {
		this.plugin = plugin;
		this.settings = plugin.settings;
		this.mode = Mode.NoTimer;
		this.paused = false;
		this.autoStartAfterManualStop = false;

	}


	onRibbonIconClick() {
		if (this.autoStartAfterManualStop) {
			this.startTimer(Mode.Pomo);
			this.autoStartAfterManualStop = false;
		} else if (this.mode === Mode.NoTimer) {
			this.startTimer(Mode.Pomo);
		} else { //if timer exists, pause or unpause
			this.togglePause();
		}
	}


	/*Set status bar to remaining time or empty string if no timer is running*/
	//handling switching logic here, should spin out
	async setStatusBarText(): Promise<string> {
		if (this.mode !== Mode.NoTimer) {
		  let timer_type_symbol = "";
	
		  if (this.paused === true) {
			return timer_type_symbol + millisecsToString(this.pausedTime);
		  } else if (moment().isSameOrAfter(this.endTime)) {
			await this.handleTimerEnd();
		  }
		  return timer_type_symbol + millisecsToString(this.getCountdown());
		} else {
		  return "";
		}
	  }

	async handleTimerEnd() {
		let remainingTime = millisecsToString(this.getCountdown());
		let notificationMessage = `Pomodoro completed!\nTime remaining: ${remainingTime}`;
	
		// Display plugin notification
		if (this.mode === Mode.Pomo) {
			this.quitTimer();
			new Notice("Timer stopped.")
			}
		
		

		}
	
	async quitTimer(): Promise<void> {
		this.mode = Mode.NoTimer;
		this.startTime = moment(0);
		this.endTime = moment(0);
		this.paused = false;

		
	}

	pauseTimer(): void {
		this.paused = true;
		this.pausedTime = this.getCountdown();
	}

	togglePause() {
		if (this.paused === true) {
			this.resumeTimer();
		} else if (this.mode !== Mode.NoTimer) { //if some timer running
			this.pauseTimer();
			new Notice("Timer paused.")
		} else if (this.mode == Mode.NoTimer) { //if some timer running
			this.quitTimer();
			
		}
	}

	resumeTimer(): void {

		this.setStartAndEndTime(this.pausedTime);
		this.moderesumingNotification();
		this.paused = false;
	}

	startTimer(mode: Mode = 0): void {
		this.setupTimer(mode);
		this.paused = false; //do I need this?


		this.modeStartingNotification();


	}

	private setupTimer(mode: Mode = 0) {
		if (mode === null) { //no arg -> start next mode in cycle
			if (this.mode === Mode.Pomo) {

			}
		} else { //starting a specific mode passed to func
			this.mode = mode;
		}

		this.setStartAndEndTime(this.getTotalModeMillisecs());
	}


	setStartAndEndTime(millisecsLeft: number): void {
		this.startTime = moment(); //start time to current time
		this.endTime = moment().add(millisecsLeft, 'milliseconds');
	}

	/*Return milliseconds left until end of timer*/
	getCountdown(): number {
		let endTimeClone = this.endTime.clone(); //rewrite with freeze?
		return endTimeClone.diff(moment());
	}

	getTotalModeMillisecs(): number {
		switch (this.mode) {
			case Mode.Pomo: {
				return this.settings.pomo * MILLISECS_IN_MINUTE;
			}

			case Mode.NoTimer: {
				throw new Error("Mode NoTimer does not have an associated time value");
			}
		}
	}



	/**************  Notifications  **************/
	/*Sends notification corresponding to whatever the mode is at the moment it's called*/
	modeStartingNotification(): void {
		let time = this.getTotalModeMillisecs();
		let unit: string;

		if (time >= MILLISECS_IN_MINUTE) { /*display in minutes*/
			time = Math.floor(time / MILLISECS_IN_MINUTE);
			unit = 'minute';
		} else { /*less than a minute, display in seconds*/
			time = Math.floor(time / 1000); //convert to secs
			unit = 'second';
		}

		switch (this.mode) {
			case (Mode.Pomo): {
				new Notice(`Starting ${time} ${unit} pomodoro.`);
				break;
		
			}
		}
	}
	moderesumingNotification(): void {
		switch (this.mode) {
			case (Mode.Pomo): {
				new Notice(`Resuming pomodoro.`);
				break;
			}

		}
	}


}
	




/*Returns [HH:]mm:ss left on the current timer*/
function millisecsToString(millisecs: number): string {
	let formattedCountDown: string;

	if (millisecs >= 60 * 60 * 1000) { /* >= 1 hour*/
		formattedCountDown = moment.utc(millisecs).format('HH:mm:ss');
	} else {
		formattedCountDown = moment.utc(millisecs).format('mm:ss');
	}

	return formattedCountDown.toString();
}














