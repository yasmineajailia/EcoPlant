# 🤖 AI Features Guide - Gemini Integration

## ✨ Overview

Your Pépinière e-commerce application now includes AI-powered features using Google's Gemini API to:
1. **Automatically generate plant descriptions** in French
2. **Recommend prices** based on the Tunisian market
3. Display all prices in **Tunisian Dinars (TND)**

## 🔧 Configuration

The Gemini API key has been added to your server/.env file:
```env
GEMINI_API_KEY=AIzaSyCRUQvLkD8WBX0lrsSUEboWpeHo541d5cM
```

## 🚀 How to Use AI Features

### For Admin Users - Adding Plants with AI

1. **Login as admin:**
   - Email: `admin@pepiniere.com`
   - Password: `admin123`

2. **Navigate to Admin Dashboard:**
   - Go to `/admin/plants`

3. **Click "Ajouter une plante"**

4. **Use AI Generation:**
   - Fill in:
     - **Nom** (Plant name) - e.g., "Cactus Aloe Vera"
     - **Catégorie** (Category) - e.g., "succulent"
     - **Taille** (Size) - e.g., "medium"
   
   - Click the **"✨ Générer avec l'IA"** button
   
   - Wait a few seconds while AI:
     - Generates a professional description in French
     - Recommends a price in TND based on Tunisian market
     - Shows price range (min-max)

5. **Review and Adjust:**
   - The AI fills in the description automatically
   - The recommended price is pre-filled
   - You can see the price recommendation box with:
     - Suggested price
     - Price range
     - Explanation

6. **Complete the form:**
   - Add images
   - Set stock quantity
   - Mark as featured or promotional if needed
   - Click "Ajouter"

## 💰 Currency Changes

All prices throughout the application are now displayed in **Tunisian Dinars (TND)**:

### Customer-Facing Pages:
- ✅ Plant catalog
- ✅ Plant details
- ✅ Shopping cart
- ✅ Checkout
- ✅ Order confirmation
- ✅ Order history

### Admin Pages:
- ✅ Plants management
- ✅ Orders management
- ✅ Dashboard statistics

## 🔍 What the AI Does

### Description Generation
The AI creates descriptions that include:
- Attractive introduction about the plant
- Main characteristics
- Growing conditions (light, watering, temperature)
- Care tips adapted to Tunisian climate
- Benefits and special features

**Example for "Cactus Aloe Vera":**
> *L'Aloe Vera est une plante succulente prisée pour ses nombreuses vertus médicinales et cosmétiques. Facile d'entretien, elle s'adapte parfaitement au climat tunisien...*

### Price Recommendation
The AI analyzes:
- Current Tunisian market prices
- Plant rarity
- Care difficulty
- General demand
- Specified size

**Example output:**
```
Prix suggéré: 35.00 TND
Fourchette: 25.00 - 45.00 TND
Explication: Prix adapté au marché tunisien pour une plante de taille moyenne
```

## 🛠️ Technical Details

### Backend Changes:
- **New Service:** `server/services/geminiService.js`
  - `generatePlantDescription()` - Creates descriptions
  - `recommendPlantPrice()` - Suggests prices in TND
  - `generatePlantInfo()` - Combines both features

- **New Endpoint:** `POST /api/admin/plants/generate-info`
  - Requires authentication and admin role
  - Input: `{ plantName, category, size }`
  - Output: `{ description, priceRecommendation }`

- **Updated Model:** `Plant` schema now includes `currency` field (default: "TND")

### Frontend Changes:
- **Enhanced Admin UI:** AI generation button with visual feedback
- **Price Recommendation Display:** Shows suggested price range and explanation
- **Currency Update:** All € symbols replaced with TND throughout the app

## 🎨 UI Improvements

### AI Helper Section (Admin)
- Gradient purple background
- Clear instructions
- Disabled state when required fields are empty
- Loading state during generation

### Price Recommendation Box
- Gradient orange background
- Highlighted suggested price
- Price range display
- AI explanation

## 📝 API Usage Example

```javascript
// Frontend call to generate AI info
const response = await API.post('/admin/plants/generate-info', {
  plantName: 'Cactus Aloe Vera',
  category: 'succulent',
  size: 'medium'
});

// Response format:
{
  "success": true,
  "data": {
    "description": "L'Aloe Vera est une plante...",
    "priceRecommendation": {
      "recommendedPrice": 35.00,
      "minPrice": 25.00,
      "maxPrice": 45.00,
      "explanation": "Prix adapté au marché tunisien...",
      "currency": "TND"
    }
  }
}
```

## 🔒 Security

- ✅ API key stored securely in .env file
- ✅ Endpoint protected by authentication middleware
- ✅ Admin-only access required
- ✅ Fallback prices if AI service fails

## 🚨 Troubleshooting

### AI not generating?
1. Check server logs for errors
2. Verify GEMINI_API_KEY in .env
3. Ensure server is running: `npm run dev`
4. Check internet connection (API calls external service)

### Wrong prices?
- AI bases recommendations on general Tunisian market data
- You can always override the suggested price
- Adjust based on your costs and margins

### Description in wrong language?
- Descriptions are generated in French by default
- Contact support to modify language settings

## 🎯 Next Steps

1. **Test the AI features** by adding a few plants
2. **Compare AI prices** with actual market prices
3. **Adjust descriptions** if needed (AI provides a great starting point)
4. **Update existing plants** to use TND currency

## 📞 Support

For issues or questions:
- Check server logs: Look for Gemini API errors
- Verify API key is valid
- Ensure npm packages are installed

---

**Pro Tip:** The AI works best when you provide clear, specific plant names (e.g., "Ficus Benjamina" instead of just "Ficus")
