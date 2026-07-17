'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log("Seeding agricultural guides into Pinecone via Sequelize seeder...");
    try {
      // Dynamically import ES modules in CommonJS seeder file
      const { default: vectorService } = await import('../services/vector.service.js');

      const guides = [
        {
          _id: "guide-tomato-mildew",
          text: "Tomato mildew (mildiou) is a highly destructive fungal disease causing dark brown spots on tomato leaves and stems. To treat and prevent it: 1) Ensure good spacing for ventilation, 2) Avoid watering foliage directly, and 3) Apply copper-based organic fungicides (Bouillie Bordelaise) early in the season or at the first sign of infection."
        },
        {
          _id: "guide-tomato-mildew-fr",
          text: "Le mildiou de la tomate est une maladie fongique courante au Maroc qui provoque des taches brunes et du duvet blanc sous les feuilles. Pour lutter contre le mildiou : favorisez une bonne aération entre les plants, évitez l'irrigation par aspersion directe sur le feuillage et appliquez des traitements préventifs à base de cuivre comme la bouillie bordelaise."
        },
        {
          _id: "guide-citrus-irrigation-souss",
          text: "For orange and citrus orchards in the Souss-Massa region of Morocco, drip irrigation (goutte-à-goutte) is critical due to water scarcity. Irrigation schedules should target 40-60 liters of water per tree daily during peak summer months (June to September), preferably early in the morning to minimize evaporation loss."
        },
        {
          _id: "guide-potato-storage",
          text: "To preserve potato harvests and prevent greening or premature sprouting, store potatoes in a dark, well-ventilated storage room maintained at 5°C to 10°C with 85% relative humidity. Never wash potatoes before storage, as residual moisture encourages rot and bacterial growth."
        },
        {
          _id: "guide-potato-storage-darija",
          text: "Bach t7afad 3la l-batata men l-khdoora w la t-nabt, khass tkhazenha f blassa dlam, fiha l-hawa barad (bin 5 w 10 darajat) w tkoon t-toba 3alya chwiya. Matghselch l-batata 9bel lkhazn bach matghmelch."
        },
        {
          _id: "guide-wheat-rust",
          text: "Wheat rust (rouille du blé) manifests as yellow, orange, or reddish-brown powder-like pustules on cereal leaves. If detected early in the Gharb or Saïs plains, apply triazole or strobilurin fungicides to prevent rapid spread and yield loss."
        },
        {
          _id: "guide-olive-fly-massa",
          text: "The olive fruit fly (mouche de l'olive) is the primary pest affecting Moroccan olive yields. Management includes hanging pheromone traps in spring to monitor populations, harvesting olives early in September to avoid peak infestation, and applying organic spinosad bait sprays if trap counts exceed thresholds."
        }
      ];

      await vectorService.upsertRecords("farming-guides", guides);
      console.log("Successfully seeded agricultural guides in Pinecone.");
    } catch (error) {
      console.error("Warning: Failed to seed Pinecone index during database seed run.", error.message);
      console.log("Skipping vector seeding failure to allow other database seeds to proceed.");
    }
  },

  async down(queryInterface, Sequelize) {
    console.log("Reverting agricultural guides from Pinecone...");
    try {
      const { pineconeIndex } = await import('../config/pinecone.js');
      if (pineconeIndex) {
        const ns = pineconeIndex.namespace("farming-guides");
        await ns.deleteAll();
        console.log("Successfully cleared agricultural guides namespace in Pinecone.");
      } else {
        console.warn("Pinecone index not initialized. Skipping deletion.");
      }
    } catch (error) {
      console.error("Failed to clear Pinecone namespace:", error.message);
    }
  }
};
