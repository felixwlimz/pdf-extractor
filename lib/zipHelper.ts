import archiver from 'archiver';
import { dir } from 'console';
import fs from 'fs';
import path from 'path';

export async function zipUploadsDirectory(dirPath: string) {
  const uploadPath = dirPath + "/" + path.basename(dirPath)

  const outputZipPath = `${uploadPath}.zip`; // Path for the output zip file

  return new Promise((resolve, reject) => {
    // Create a write stream for the output zip file
    const output = fs.createWriteStream(outputZipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`Archive created with ${archive.pointer()} total bytes`);
      resolve(outputZipPath);
    });

    archive.on('error', (err) => reject(err));

    // Pipe the archive data to the file
    archive.pipe(output);
    // Append files from the specified directory
    archive.glob('**/*', {
      cwd: dirPath,
      ignore: ['**/*.zip']
    });
    // Finalize the archive
    archive.finalize();
  });
}