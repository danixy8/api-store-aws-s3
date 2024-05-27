// awsConfig.ts
import AWS from 'aws-sdk';
import { envs } from './envs';

export const configureAWS = () => {
    AWS.config.update({
        accessKeyId: envs.AWS_ACCESS_KEY_ID,
        secretAccessKey: envs.AWS_SECRET_ACCESS_KEY,
        region: envs.AWS_REGION,
        s3ForcePathStyle: true
    });
};

configureAWS();

export default AWS;

