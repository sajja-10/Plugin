import { App, Notice } from 'obsidian';

export async function createDailyNote(app: App) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const noteTitle = `${year}-${month}-${day}`;
  
  // Specify the daily folder path
  const dailyFolderPath = '/daily_note'; // Replace with the actual path

  // Create the full path for the daily note
  const dailyNotePath = `${dailyFolderPath}/${noteTitle}.md`;

  const fs = app.vault.adapter;
  const folderExists = await fs.exists(dailyFolderPath);
  if (!folderExists) {
    await fs.mkdir(dailyFolderPath);
  }

  const dailynote = await fs.exists(dailyNotePath);
  if (!dailynote) {
    app.vault.create(dailyNotePath, '');
    new Notice(`Daily note created: ${noteTitle}`);
  } else {
    new Notice(`Today's daily note already exists in the ${dailyFolderPath} folder.`);
  }
}


