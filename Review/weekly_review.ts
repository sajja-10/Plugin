
import { App, Notice } from 'obsidian';

let lastWeeklyNoteCreated: string | null = null;

export async function createWeeklyReview(app: App) {
  const currentDate = new Date();
  const currentDay = currentDate.getDay(); // 0 (Sunday) to 6 (Saturday)
  const month =  currentDate.toLocaleString('default', { month: 'long' });
  
  

  


  // If the last weekly note was created this month, or if it's the first day of a new month, reset the flag
  if (lastWeeklyNoteCreated && isSameMonth(currentDate, new Date(lastWeeklyNoteCreated))) {
    lastWeeklyNoteCreated = null;
  }

  // If it's a new month and we haven't created a note this month
  if (!lastWeeklyNoteCreated) {
    lastWeeklyNoteCreated = currentDate.toISOString();
    const week= getMonthWeekTitle(currentDate);
    const noteTitle = `Week ${week}, ${month}`
    const weeklyReviewFolderPath = '/weekly_review';

    const weeklyReviewPath = `${weeklyReviewFolderPath}/${noteTitle}.md`;
    const fs = app.vault.adapter;
    const folderExists = await fs.exists(weeklyReviewFolderPath);
    if (!folderExists) {
      await fs.mkdir(weeklyReviewFolderPath);
    }
    const weeklyreview = await fs.exists(weeklyReviewPath);
    if (!weeklyreview) {
    app.vault.create(weeklyReviewPath, '');
    new Notice(`Weekly review created: ${noteTitle}`);
  } else {
    new Notice(`This week's weekly review already exists in the ${weeklyReviewFolderPath} folder.`);
  }


    
  }
}

function isSameMonth(date1: Date, date2: Date): boolean {
  return date1.getMonth() === date2.getMonth() && date1.getFullYear() === date2.getFullYear();
}

function getMonthWeekTitle(date: Date): string {
  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'long' });
  const weekNumber = getMonthWeekNumber(date);
  const day = date.getDate();
  
  return `${weekNumber}`;
}

function getMonthWeekNumber(date: Date): number {
  
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const daysUntilDate = Math.floor((date.getTime() - firstDayOfMonth.getTime()) / (24 * 60 * 60 * 1000));

  const weekNumber = Math.ceil((daysUntilDate + 1) / 7);
  return weekNumber;
}
