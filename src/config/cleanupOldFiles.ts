
import * as cron from 'node-cron';
import { UploadModel } from '../data/mongo';

class CleanupOldFiles {
  static async #cleanupOldFiles(days: number) {
    try {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() - days);

      const result = await UploadModel.deleteMany({ uploadedAt: { $lt: expirationDate } });

      console.log(`Deleted ${result.deletedCount} old records.`);
      return result.deletedCount;
    } catch (error) {
      console.error('Error cleaning up old files:', error);
      throw error;
    }
  }

  static startCleanupTask(days = 4) {
    cron.schedule('0 0 */1 * *', async () => {
      console.log(`Starting cleanup of old files`);
      await CleanupOldFiles.#cleanupOldFiles(days);
      console.log('Cleanup of old files completed.');
    });

    CleanupOldFiles.#cleanupOldFiles(days)
      .then(() => console.log('Initial cleanup of old files completed.'))
      .catch(error => console.error('Error during initial cleanup:', error));
  }
}

export default CleanupOldFiles;