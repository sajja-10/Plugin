import { App, Notice } from 'obsidian';

export async function createQuarterlyReview(app: App) {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const quarter = getQuarter(currentDate); // Calculate the current quarter

  const formattedDate = formatDate(currentDate);
  const noteTitle = ` Quarter ${quarter} ${year}`;


 const quarterlyReviewFolderPath = '/quarterly_review';

  const quarterlyReviewPath = `${quarterlyReviewFolderPath}/${noteTitle}.md`;

  const fs = app.vault.adapter;
  const folderExists = await fs.exists(quarterlyReviewFolderPath);
  if (!folderExists) {
    await fs.mkdir(quarterlyReviewFolderPath);
  }

  const quarterlyreview = await fs.exists(quarterlyReviewPath);
  if (!quarterlyreview) {
    app.vault.create(quarterlyReviewPath, '');
    new Notice(`Quarterly review created: ${noteTitle}`);
  } else {
    const endOfQuarterDate = getEndOfQuarterDate(year, quarter);
    const endOfQuarterDateString = formatDate(endOfQuarterDate);
    new Notice(`A quarterly review already exists for this quarter. You can create one until ${endOfQuarterDateString}.`);
  }
}

function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1;
}

function getEndOfQuarterDate(year: number, quarter: number): Date {
  const month = (quarter - 1) * 3 + 2; // Get the last month of the quarter
  return new Date(year, month, new Date(year, month, 0).getDate());
}

function formatDate(date: Date): string {
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}
