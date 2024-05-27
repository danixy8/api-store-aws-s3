// awsConfig.ts
import AWS from 'aws-sdk';
import { envs } from './envs';

export const configureAWS = () => {
    AWS.config.update({
        accessKeyId: envs.ACCESS_KEY_ID,
        secretAccessKey: envs.SECRET_ACCESS_KEY,
        region: envs.AWS_REGION,
        s3ForcePathStyle: true
    });
};

configureAWS();

export default AWS;

