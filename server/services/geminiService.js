const axios = require('axios');

// Groq API - completely free with generous limits
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// Verify API key is loaded
if (!process.env.GROQ_API_KEY) {
  console.log('⚠️ GROQ_API_KEY not set. Get a free key at https://console.groq.com/keys');
  console.log('ℹ️ Will use fallback data for plant generation');
}

// Request Queue to prevent rate limiting
class AIRequestQueue {
  constructor(delayMs = 1000) {
    this.queue = [];
    this.processing = false;
    this.delayMs = delayMs;
  }

  async add(fn) {
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject });
      if (!this.processing) {
        this.process();
      }
    });
  }

  async process() {
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    
    while (this.queue.length > 0) {
      const { fn, resolve, reject } = this.queue.shift();
      
      try {
        const result = await fn();
        resolve(result);
      } catch (error) {
        reject(error);
      }
      
      // Wait before processing next request
      if (this.queue.length > 0) {
        await new Promise(r => setTimeout(r, this.delayMs));
      }
    }
    
    this.processing = false;
  }
}

// Create queue instance with 1 second delay between requests
const requestQueue = new AIRequestQueue(1000);

/**
 * Call Groq API (free and fast)
 */
async function callGroq(systemPrompt, userPrompt, maxTokens = 500) {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'gsk_free_api') {
    throw new Error('GROQ_API_KEY not configured. Get free key at https://console.groq.com/keys');
  }

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama-3.3-70b-versatile', // Fast and free model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: maxTokens,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    if (response.data?.choices?.[0]?.message?.content) {
      return response.data.choices[0].message.content.trim();
    }
    
    throw new Error('Invalid response format from Groq');
  } catch (error) {
    if (error.response?.status === 429) {
      console.log('⏳ Rate limit reached, waiting 5 seconds...');
      await new Promise(r => setTimeout(r, 5000));
      return callGroq(systemPrompt, userPrompt, maxTokens);
    }
    throw error;
  }
}

/**
 * Generate plant description using AI
 * @param {string} plantName - The name of the plant
 * @param {string} category - The category of the plant
 * @param {string} size - The size of the plant
 * @returns {Promise<string>} - Generated description
 */
exports.generatePlantDescription = async (plantName, category, size) => {
  try {
    const systemPrompt = "Tu es un expert en horticulture spécialisé dans le climat méditerranéen tunisien. Réponds toujours en français de manière professionnelle et concise.";
    
    const userPrompt = `Génère une description professionnelle pour cette plante (maximum 600 caractères):

Nom: ${plantName}
Catégorie: ${category}
Taille: ${size}

Inclus: introduction courte, caractéristiques, besoins (lumière/arrosage/température adaptés au climat tunisien), conseils d'entretien, et bienfaits. Texte fluide sans formatage markdown.`;

    const description = await callGroq(systemPrompt, userPrompt, 300);
    
    // Clean up any potential markdown or extra formatting
    return description
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/#{1,6}\s/g, '')
      .trim()
      .substring(0, 800);
  } catch (error) {
    console.error('Error generating description:', error.message);
    // Return a generic description as fallback
    return `${plantName} est une plante de ${category} de taille ${size}. Cette plante s'adapte bien au climat méditerranéen tunisien. Elle nécessite un arrosage régulier et une exposition appropriée à la lumière. Idéale pour embellir votre espace vert.`;
  }
};

/**
 * Generate care instructions for plant
 * @param {string} plantName - The name of the plant
 * @param {string} category - The category of the plant
 * @param {string} size - The size of the plant
 * @returns {Promise<Object>} - Care instructions
 */
exports.generateCareInstructions = async (plantName, category, size) => {
  try {
    const systemPrompt = "Tu es un expert en horticulture spécialisé dans le climat tunisien. Réponds UNIQUEMENT en JSON valide, sans texte supplémentaire.";
    
    const userPrompt = `Pour ${plantName} (catégorie: ${category}, taille: ${size}), donne les instructions de soin au format JSON exact:

{"watering":{"frequency":"fréquence","amount":"quantité"},"sunlight":{"exposure":"type","duration":"durée"},"temperature":{"ideal":"idéale","min":"min","max":"max"},"soil":"type de sol","fertilizer":"recommandations","tips":["conseil 1","conseil 2","conseil 3"]}

Adapte au climat méditerranéen tunisien.`;

    let text = await callGroq(systemPrompt, userPrompt, 400);
    
    // Extract JSON if wrapped in text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }
    
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    try {
      const careData = JSON.parse(text);
      return careData;
    } catch (parseError) {
      // Return fallback data if JSON parsing fails
      return {
        watering: { frequency: "2-3 fois par semaine en été", amount: "Modéré" },
        sunlight: { exposure: "Plein soleil à mi-ombre", duration: "6-8 heures" },
        temperature: { ideal: "18-24°C", min: "10°C", max: "35°C" },
        soil: "Sol bien drainé et riche",
        fertilizer: "Engrais équilibré mensuel",
        tips: ["Arrosage régulier sans excès", "Protection du soleil intense d'été", "Taille légère au printemps"]
      };
    }
  } catch (error) {
    console.error('Error generating care instructions:', error.message);
    // Return fallback data
    return {
      watering: { frequency: "2-3 fois par semaine", amount: "Modéré" },
      sunlight: { exposure: "Mi-ombre", duration: "4-6 heures" },
      temperature: { ideal: "20-25°C", min: "10°C", max: "35°C" },
      soil: "Sol bien drainé",
      fertilizer: "Engrais mensuel",
      tips: ["Arrosage régulier", "Protection solaire", "Entretien saisonnier"]
    };
  }
};

/**
 * Recommend price for plant based on Tunisian market
 * @param {string} plantName - The name of the plant
 * @param {string} category - The category of the plant
 * @param {string} size - The size of the plant
 * @returns {Promise<Object>} - Recommended price info in TND
 */
exports.recommendPlantPrice = async (plantName, category, size) => {
  try {
    const systemPrompt = "Tu es un expert du marché des plantes en Tunisie. Réponds UNIQUEMENT en JSON valide.";
    
    const userPrompt = `Pour ${plantName} (catégorie: ${category}, taille: ${size}), recommande un prix en dinars tunisiens (TND).

Réponds UNIQUEMENT avec ce JSON exact:
{"recommendedPrice": 45.5, "minPrice": 35.0, "maxPrice": 55.0, "explanation": "courte explication"}

Utilise des nombres décimaux.`;

    let text = await callGroq(systemPrompt, userPrompt, 200);
    
    // Extract JSON if wrapped in text
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      text = jsonMatch[0];
    }
    
    text = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    try {
      const priceData = JSON.parse(text);
      
      return {
        recommendedPrice: parseFloat(priceData.recommendedPrice) || 30.0,
        minPrice: parseFloat(priceData.minPrice) || 20.0,
        maxPrice: parseFloat(priceData.maxPrice) || 40.0,
        explanation: priceData.explanation || 'Prix basé sur le marché tunisien',
        currency: 'TND'
      };
    } catch (parseError) {
      // Fallback pricing based on size
      const fallbackPrices = {
        small: { min: 15, recommended: 20, max: 25 },
        medium: { min: 25, recommended: 35, max: 45 },
        large: { min: 50, recommended: 70, max: 90 }
      };
      
      const prices = fallbackPrices[size] || fallbackPrices.medium;
      
      return {
        recommendedPrice: prices.recommended,
        minPrice: prices.min,
        maxPrice: prices.max,
        explanation: 'Prix estimé basé sur la taille',
        currency: 'TND'
      };
    }
  } catch (error) {
    console.error('Error recommending price:', error.message);
    // Return a fallback price if AI fails
    const fallbackPrices = {
      small: { min: 15, recommended: 20, max: 25 },
      medium: { min: 25, recommended: 35, max: 45 },
      large: { min: 50, recommended: 70, max: 90 }
    };
    
    const prices = fallbackPrices[size] || fallbackPrices.medium;
    
    return {
      recommendedPrice: prices.recommended,
      minPrice: prices.min,
      maxPrice: prices.max,
      explanation: 'Prix estimé basé sur la taille (marché tunisien)',
      currency: 'TND'
    };
  }
};

/**
 * Generate both description, price recommendation, and care instructions
 * @param {string} plantName - The name of the plant
 * @param {string} category - The category of the plant
 * @param {string} size - The size of the plant
 * @returns {Promise<Object>} - Description, price info, and care instructions
 */
exports.generatePlantInfo = async (plantName, category, size) => {
  try {
    console.log(`🤖 Generating AI-powered information for: ${plantName}`);
    
    // Use request queue to avoid rate limits - sequential with delays
    const description = await requestQueue.add(() => 
      exports.generatePlantDescription(plantName, category, size)
    );
    
    const priceInfo = await requestQueue.add(() => 
      exports.recommendPlantPrice(plantName, category, size)
    );
    
    const careInstructions = await requestQueue.add(() => 
      exports.generateCareInstructions(plantName, category, size)
    );
    
    console.log(`✅ Successfully generated all info for: ${plantName}`);
    
    return {
      description,
      priceRecommendation: priceInfo,
      careInstructions
    };
  } catch (error) {
    console.error('Error generating plant info:', error);
    throw error;
  }
};
