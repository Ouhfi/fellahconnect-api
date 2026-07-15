const { Pinecone } = require('@pinecone-database/pinecone');
const logger = require('../utils/logger');

const apiKey = process.env.PINECONE_API_KEY;
const indexName = process.env.PINECONE_INDEX_NAME || 'fellahconnect-index';

let pinecone = null;
let pineconeIndex = null;

if (apiKey) {
  try {
    pinecone = new Pinecone({ apiKey });
    pineconeIndex = pinecone.index(indexName);
    logger.info(`Pinecone initialized with index: ${indexName}`);
  } catch (error) {
    logger.error('Failed to initialize Pinecone client:', error);
  }
} else {
  logger.warn('PINECONE_API_KEY is not defined in the environment. Pinecone features will be disabled.');
}

module.exports = {
  pinecone,
  pineconeIndex,
};
