import { Pinecone } from '@pinecone-database/pinecone';
import logger from '../utils/logger.js';
import env from './env.js';

const apiKey = env.PINECONE_API_KEY;
const indexName = env.PINECONE_INDEX_NAME || 'fellahconnect-index';
const indexHost = env.PINECONE_HOST ? env.PINECONE_HOST.replace(/^https?:\/\//, '') : undefined;

let pinecone = null;
let pineconeIndex = null;

if (apiKey) {
  try {
    pinecone = new Pinecone({ apiKey });
    pineconeIndex = pinecone.index(indexName, indexHost);
    logger.info(`Pinecone initialized with index: ${indexName}${indexHost ? ` at host ${indexHost}` : ''}`);
  } catch (error) {
    logger.error('Failed to initialize Pinecone client:', error);
  }
} else {
  logger.warn('PINECONE_API_KEY is not defined in the environment. Pinecone features will be disabled.');
}

export {
  pinecone,
  pineconeIndex,
};
