const Minio = require('minio')
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];

const minioClient = new Minio.Client({
    endPoint: config.minio.endpoint,
    useSSL: true,
    accessKey: config.minio.accessKey,
    secretKey: config.minio.secretKey
});

module.exports = minioClient