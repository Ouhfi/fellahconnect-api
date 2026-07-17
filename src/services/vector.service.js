import { pineconeIndex } from "../config/pinecone.js";
import logger from "../utils/logger.js";

class VectorService {
  /**
   * Generic method to upsert records into a specific namespace in Pinecone.
   * @param {string} namespace The Pinecone namespace.
   * @param {Array<Object>} records Array of records to upsert, each containing _id and text.
   */
  async upsertRecords(namespace, records) {
    if (!pineconeIndex) {
      logger.warn("Pinecone index is not initialized. Skipping upsert.");
      return;
    }

    try {
      const ns = pineconeIndex.namespace(namespace);
      logger.info(`Upserting ${records.length} records to Pinecone namespace: ${namespace}`);
      await ns.upsertRecords({ records });
      logger.info(`Successfully upserted records to namespace: ${namespace}`);
    } catch (error) {
      logger.error(`Failed to upsert records to Pinecone namespace: ${namespace}`, error);
      throw error;
    }
  }

  /**
   * Generic method to search records in a specific namespace.
   * @param {string} namespace The Pinecone namespace.
   * @param {string} queryText The text query.
   * @param {number} limit Number of results to retrieve.
   * @returns {Promise<Array>} Array of matched documents with their scores.
   */
  async searchRecords(namespace, queryText, limit = 3) {
    if (!pineconeIndex) {
      logger.warn("Pinecone index is not initialized. Returning empty search results.");
      return [];
    }

    try {
      const ns = pineconeIndex.namespace(namespace);
      logger.info(`Searching Pinecone namespace "${namespace}" for: "${queryText}"`);

      const response = await ns.searchRecords({
        query: {
          inputs: { text: queryText },
          topK: limit
        }
      });

      const hits = response?.result?.hits || [];
      
      // Sort hits descending by score to ensure correct order
      const sortedHits = [...hits].sort((a, b) => (b._score || 0) - (a._score || 0));

      return sortedHits.map(hit => ({
        id: hit._id,
        score: hit._score,
        text: hit.fields?.text || "",
        metadata: { ...hit.fields, text: undefined } // any extra fields returned
      }));
    } catch (error) {
      logger.error(`Error searching Pinecone namespace: ${namespace}`, error);
      return [];
    }
  }

  /**
   * Search specifically for agricultural guides.
   * @param {string} query The search query.
   * @param {number} limit The max number of guides to return.
   */
  async searchGuides(query, limit = 3) {
    return await this.searchRecords("farming-guides", query, limit);
  }
}

export default new VectorService();
