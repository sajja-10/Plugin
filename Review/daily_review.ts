import { App, Notice } from 'obsidian';

export async function createDailyReview(app: App) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
  const day = currentDate.getDate().toString().padStart(2, '0');
  const noteTitle = `${year}-${month}-${day} DR`;


  const dailyReviewFolderPath = '/daily_review';

  const dailyReviewPath = `${dailyReviewFolderPath}/${noteTitle}.md`;

  const fs = app.vault.adapter;
  const folderExists = await fs.exists(dailyReviewFolderPath);
  if (!folderExists) {
    await fs.mkdir(dailyReviewFolderPath);
  }

  const dailyreview = await fs.exists(dailyReviewPath);
  if (!dailyreview) {
    app.vault.create(dailyReviewPath, '');
    new Notice(`Daily review created: ${noteTitle}`);
  } else {
    new Notice(`Today's daily review already exists in the ${dailyReviewFolderPath} folder.`);
  }

}
