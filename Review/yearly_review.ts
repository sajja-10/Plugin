import { App, Notice } from 'obsidian';

export async function createYearlyReview(app: App) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const noteTitle = `${year}`;

  
  const yearlyReviewFolderPath = '/yearly_review';

  const yearlyReviewPath = `${yearlyReviewFolderPath}/${noteTitle}.md`;

  const fs = app.vault.adapter;
  const folderExists = await fs.exists(yearlyReviewFolderPath);
  if (!folderExists) {
    await fs.mkdir(yearlyReviewFolderPath);
  }
  

  const yearlyreview = await fs.exists(yearlyReviewPath);
  if (!yearlyreview) {
    app.vault.create(yearlyReviewPath, '');
    new Notice(`Yearly review created: ${noteTitle}`);
  } else {
    new Notice('Yearly review already exists for this year.');
  }
}




