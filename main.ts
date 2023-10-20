import { App, Editor, MarkdownView, Modal, Notice, Plugin,  PluginSettingTab, Setting} from 'obsidian';
import { Mode, Timer } from './Pomodoro/pomodoro';
import { createDailyNote } from './Review/daily';
import { createDailyReview } from './Review/daily_review';
import { createWeeklyReview } from './Review/weekly_review';
import { createMonthlyReview } from './Review/monthly_review';
import { createQuarterlyReview } from './Review/quarterly_review';
import { createYearlyReview } from './Review/yearly_review';
// Remember to rename these classes and interfaces!

export interface MyPluginSettings {
	mySetting: string;
	pomodoroInterval: number;
    pomo: number;
}

export const DEFAULT_SETTINGS: MyPluginSettings = {
	mySetting: 'default',
	pomodoroInterval: 1,
    pomo: 5,

}

export default class MyPlugin extends Plugin {
	settings: MyPluginSettings;
  statusBar: HTMLElement;
	timer: Timer;


	async onload() {
		await this.loadSettings();

    this.addRibbonIcon('clock', 'Pomodoro', (evt: MouseEvent) => {
			this.timer.onRibbonIconClick();
		});

		// This creates an icon in the left ribbon.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Pomodoro time');
		this.statusBar = this.addStatusBarItem();
		this.timer = new Timer(this);


		this.registerInterval(window.setInterval(async () =>
			this.statusBar.setText(await this.timer.setStatusBarText()), 500));


	
		this.addCommand({
			id: 'start-pomo-timer',
			name: 'Start pomodoro timer',
			checkCallback: (checking: boolean) => {
				if (this.timer.mode !== Mode.Pomo) {
					if (!checking) {
						this.timer.startTimer();
					}
					return true;
				}
				return false;
			}
		});


		this.addCommand({
			id: 'quit-statusbar-pomo',
			name: 'Quit pomodoro timer',
			checkCallback: (checking: boolean) => {
				if (this.timer.mode !== Mode.NoTimer) {
					if (!checking) {
						this.timer.quitTimer();
					}
					return true;
				}
				return false;
			}
		});


		// ... (daily note)

		this.addCommand({
			id: 'create-daily-note',
			name: 'Create Daily Note',
			callback: () => {
				createDailyNote(this.app);
			},
		});


        //daily review
		this.addCommand({
			id: 'create-daily-review',
			name: 'Create Daily Review',
			callback: () => {
				createDailyReview(this.app);
			},
		});

        //weekly review
		this.addCommand({
			id: 'create-weekly-review',
			name: 'Create Weekly Review',
			callback: () => {
				createWeeklyReview(this.app);
			},
		});

        //monthly review
		this.addCommand({
			id: 'create-monthly-review',
			name: 'Create Monthly Review',
			callback: () => {
				createMonthlyReview(this.app);
			},
		});

        //quarterly review
		this.addCommand({
			id: 'Quarterly Review',
			name: 'Create Quarterly Review',
			callback: () => {
				createQuarterlyReview(this.app);
			},
		});

        //yearly review
		this.addCommand({
			id: 'Yearly Review',
			name: 'Create Yearly Review',
			callback: () => {
				createYearlyReview(this.app);
			},
		});





		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
			console.log('click', evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}


	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText('Woah!');
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: MyPlugin;


	constructor(app: App, plugin: MyPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();
		containerEl.createEl('h3', { text: 'Pomodoro' });

		/**************  Pomodoro settings **************/

		const pomodoroInterval = new Setting(containerEl)
			.setName('Pomodoro interval')
			.setDesc(`${this.plugin.settings.pomo} minutes`)
			.addSlider(slider => {
				slider
					.setValue(this.plugin.settings.pomo)
					.setLimits(0, 500, 1) // Adjust the limits as needed
					.onChange(async (value) => {
						this.plugin.settings.pomo = value;
						await this.plugin.saveSettings();
						pomodoroInterval.descEl.setText(`${value} minutes`);
					});
			});	 

	}

}

