// AWS S3 SDK Configuration: The AWS.S3() object initializes the SDK with the necessary credentials and region. You don't need to worry about signing requests or specifying headers.
// upload() Method: The upload() method handles all the complexities of uploading a file, including multipart uploads if the file is large. It also automatically retries on errors.
// Error Handling: Since the SDK returns a Promise, you can use async/await or .then() chaining to handle success or failure.
// Using Multiple Buckets: You can specify the target bucket in the Bucket parameter of the upload() method, allowing you to upload files to different buckets easily.




cconst AWS = require('aws-sdk');
const fs = require('fs');

class S3Utility {
    constructor() {
        // Initialize S3 client from AWS SDK
        this.s3 = new AWS.S3();
    }

    // Method to upload a file to an S3 bucket
    async uploadFile(bucketName, filePath, fileKey) {
        const fileStream = fs.createReadStream(filePath);

        const params = {
            Bucket: bucketName,
            Key: fileKey,
            Body: fileStream,
            ContentType: 'application/octet-stream',
        };

        try {
            const result = await this.s3.upload(params).promise();
            console.log(`File uploaded successfully to ${bucketName}/${fileKey}`);
            return result;
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    }

    // Method to download a file from an S3 bucket
    async downloadFile(bucketName, fileKey, downloadPath) {
        const params = {
            Bucket: bucketName,
            Key: fileKey,
        };

        try {
            const data = await this.s3.getObject(params).promise();
            fs.writeFileSync(downloadPath, data.Body);
            console.log(`File downloaded successfully from ${bucketName}/${fileKey} to ${downloadPath}`);
        } catch (error) {
            console.error('Error downloading file:', error);
            throw error;
        }
    }

    // Method to list files in an S3 bucket
    async listFiles(bucketName, prefix = '') {
        const params = {
            Bucket: bucketName,
            Prefix: prefix, // Optionally filter files by prefix
        };

        try {
            const data = await this.s3.listObjectsV2(params).promise();
            console.log('Files in bucket:', data.Contents.map(item => item.Key));
            return data.Contents;
        } catch (error) {
            console.error('Error listing files:', error);
            throw error;
        }
    }
}

// Example usage of the S3Utility class
(async () => {
    const s3Util = new S3Utility();
    const bucketName = 'your-bucket-name';
    const filePath = 'path/to/your/file.txt';
    const fileKey = 'your-file-key';
    const downloadPath = 'path/to/download/file.txt';

    // Upload a file
    await s3Util.uploadFile(bucketName, filePath, fileKey);

    // Download a file
    await s3Util.downloadFile(bucketName, fileKey, downloadPath);

    // List files in a bucket
    await s3Util.listFiles(bucketName, '');
})();

// reuse these methods across different components of your cookbook platform, 
// for example, when uploading recipe files, downloading images, or listing user-uploaded files:
// await s3Util.uploadFile(bucketName, filePath, fileKey);
// await s3Util.downloadFile(bucketName, fileKey, downloadPath);
// await s3Util.listFiles(bucketName, prefix);

