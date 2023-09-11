import { App, Notice } from 'obsidian';

export async function createMonthlyReview(app: App) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.toLocaleString('default', { month: 'long' });
  const noteTitle = `${month} ${year}`;

  const monthlyReviewFolderPath = '/monthly_review';

  const monthlyReviewPath = `${monthlyReviewFolderPath}/${noteTitle}.md`;

  const fs = app.vault.adapter;
  const folderExists = await fs.exists(monthlyReviewFolderPath);
  if (!folderExists) {
    await fs.mkdir(monthlyReviewFolderPath);
  }

  const monthlyreview = await fs.exists(monthlyReviewPath);
  if (!monthlyreview) {
    app.vault.create(monthlyReviewPath, '');
    new Notice(`monthly review created: ${noteTitle}`);
  } else {
    new Notice(`This month's review already exists in the ${monthlyReviewFolderPath} folder.`);
  }

}