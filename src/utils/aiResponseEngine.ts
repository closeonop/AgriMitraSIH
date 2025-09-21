export interface AIResponse {
  text: string;
  confidence: number;
  category: string;
  followUpQuestions?: string[];
  actionItems?: string[];
}

export interface ConversationContext {
  previousMessages: Array<{ text: string; isUser: boolean; timestamp: Date }>;
  userPreferences: {
    language: string;
    farmingType?: string;
    location?: string;
    experience?: string;
  };
  sessionData: {
    topicsDiscussed: string[];
    questionsAsked: number;
    lastInteraction: Date;
  };
}

export class AdvancedAIResponseEngine {
  private knowledgeBase: Map<string, any>;
  private conversationHistory: ConversationContext;

  constructor() {
    this.knowledgeBase = new Map();
    this.conversationHistory = {
      previousMessages: [],
      userPreferences: { language: 'en' },
      sessionData: {
        topicsDiscussed: [],
        questionsAsked: 0,
        lastInteraction: new Date()
      }
    };
    this.initializeKnowledgeBase();
  }

  private initializeKnowledgeBase() {
    // Crop Management Knowledge
    this.knowledgeBase.set('crops', {
      wheat: {
        seasons: ['rabi'],
        soilType: ['loamy', 'clay'],
        waterRequirement: 'moderate',
        fertilizers: ['NPK', 'urea', 'DAP'],
        commonDiseases: ['rust', 'blight', 'smut'],
        harvestTime: '4-6 months',
        tips: 'Sow in November-December for best results'
      },
      rice: {
        seasons: ['kharif'],
        soilType: ['clay', 'alluvial'],
        waterRequirement: 'high',
        fertilizers: ['NPK', 'urea'],
        commonDiseases: ['blast', 'blight', 'sheath rot'],
        harvestTime: '3-4 months',
        tips: 'Requires standing water during growth'
      },
      cotton: {
        seasons: ['kharif'],
        soilType: ['black', 'alluvial'],
        waterRequirement: 'moderate',
        fertilizers: ['NPK', 'potash'],
        commonDiseases: ['bollworm', 'whitefly', 'jassid'],
        harvestTime: '5-6 months',
        tips: 'Requires warm climate and adequate drainage'
      }
    });

    // Weather Impact Knowledge
    this.knowledgeBase.set('weather', {
      temperature: {
        high: 'Increase irrigation frequency, provide shade for sensitive crops',
        low: 'Protect crops from frost, delay planting if necessary',
        optimal: 'Monitor for pest activity, maintain regular care'
      },
      rainfall: {
        excess: 'Ensure proper drainage, watch for fungal diseases',
        deficit: 'Implement water conservation, consider drought-resistant varieties',
        adequate: 'Perfect for most crops, maintain soil health'
      },
      humidity: {
        high: 'Increase ventilation, monitor for fungal infections',
        low: 'Increase irrigation, consider mulching',
        moderate: 'Ideal conditions for most crops'
      }
    });

    // Pest and Disease Management
    this.knowledgeBase.set('pests', {
      aphids: {
        symptoms: 'Yellowing leaves, sticky honeydew',
        treatment: 'Neem oil spray, introduce ladybugs',
        prevention: 'Regular monitoring, companion planting'
      },
      whitefly: {
        symptoms: 'White flying insects, yellowing leaves',
        treatment: 'Yellow sticky traps, insecticidal soap',
        prevention: 'Remove weeds, use reflective mulch'
      },
      bollworm: {
        symptoms: 'Holes in bolls, damaged fruits',
        treatment: 'Bt spray, pheromone traps',
        prevention: 'Crop rotation, early detection'
      }
    });

    // Soil Management
    this.knowledgeBase.set('soil', {
      types: {
        clay: { drainage: 'poor', fertility: 'high', crops: ['rice', 'wheat'] },
        sandy: { drainage: 'excellent', fertility: 'low', crops: ['groundnut', 'millet'] },
        loamy: { drainage: 'good', fertility: 'high', crops: ['most crops'] },
        black: { drainage: 'moderate', fertility: 'high', crops: ['cotton', 'sugarcane'] }
      },
      health: {
        indicators: ['pH level', 'organic matter', 'nutrient content', 'microbial activity'],
        improvement: ['composting', 'crop rotation', 'cover crops', 'reduced tillage']
      }
    });
  }

  public generateAdvancedResponse(userMessage: string, context?: ConversationContext): AIResponse {
    const message = userMessage.toLowerCase();
    this.updateConversationContext(userMessage, context);

    // Analyze message intent and extract keywords
    const intent = this.analyzeIntent(message);
    const keywords = this.extractKeywords(message);
    const category = this.categorizeQuery(keywords);

    // Generate contextual response
    let response = this.generateContextualResponse(intent, keywords, category);
    
    // Add personalization based on conversation history
    response = this.personalizeResponse(response, this.conversationHistory);

    // Calculate confidence score
    const confidence = this.calculateConfidence(keywords, category, intent);

    // Generate follow-up questions and action items
    const followUpQuestions = this.generateFollowUpQuestions(category, keywords);
    const actionItems = this.generateActionItems(category, keywords);

    return {
      text: response,
      confidence,
      category,
      followUpQuestions,
      actionItems
    };
  }

  private analyzeIntent(message: string): string {
    const intents = {
      question: ['how', 'what', 'when', 'where', 'why', 'which', 'कैसे', 'क्या', 'कब', 'कहाँ', 'क्यों', 'ਕਿਵੇਂ', 'ਕੀ', 'ਕਦੋਂ'],
      problem: ['problem', 'issue', 'disease', 'pest', 'dying', 'समस्या', 'बीमारी', 'कीट', 'ਸਮੱਸਿਆ', 'ਬਿਮਾਰੀ'],
      advice: ['suggest', 'recommend', 'advice', 'help', 'सुझाव', 'सलाह', 'मदद', 'ਸੁਝਾਅ', 'ਸਲਾਹ', 'ਮਦਦ'],
      information: ['tell', 'explain', 'about', 'information', 'बताओ', 'जानकारी', 'ਦੱਸੋ', 'ਜਾਣਕਾਰੀ']
    };

    for (const [intent, words] of Object.entries(intents)) {
      if (words.some(word => message.includes(word))) {
        return intent;
      }
    }
    return 'general';
  }

  private extractKeywords(message: string): string[] {
    const keywords = [];
    const keywordMap = {
      // Crops
      'wheat': ['wheat', 'गेहूं', 'ਕਣਕ'],
      'rice': ['rice', 'चावल', 'ਚਾਵਲ'],
      'cotton': ['cotton', 'कपास', 'ਕਪਾਹ'],
      'corn': ['corn', 'maize', 'मक्का', 'ਮੱਕੀ'],
      
      // Farming activities
      'irrigation': ['water', 'irrigation', 'पानी', 'सिंचाई', 'ਪਾਣੀ', 'ਸਿੰਚਾਈ'],
      'fertilizer': ['fertilizer', 'nutrients', 'खाद', 'उर्वरक', 'ਖਾਦ'],
      'pest': ['pest', 'insect', 'bug', 'कीट', 'ਕੀੜੇ'],
      'disease': ['disease', 'infection', 'बीमारी', 'ਬਿਮਾਰੀ'],
      'soil': ['soil', 'earth', 'मिट्टी', 'ਮਿੱਟੀ'],
      'weather': ['weather', 'climate', 'rain', 'मौसम', 'बारिश', 'ਮੌਸਮ'],
      'yield': ['yield', 'production', 'harvest', 'उत्पादन', 'फसल', 'ਪੈਦਾਵਾਰ'],
      'market': ['market', 'price', 'sell', 'बाजार', 'कीमत', 'ਮਾਰਕੀਟ']
    };

    for (const [key, variations] of Object.entries(keywordMap)) {
      if (variations.some(variation => message.includes(variation))) {
        keywords.push(key);
      }
    }

    return keywords;
  }

  private categorizeQuery(keywords: string[]): string {
    const categories = {
      'crop_management': ['wheat', 'rice', 'cotton', 'corn', 'yield'],
      'water_management': ['irrigation', 'water'],
      'soil_health': ['soil', 'fertilizer', 'nutrients'],
      'pest_disease': ['pest', 'disease'],
      'weather_climate': ['weather', 'climate'],
      'market_economics': ['market', 'price', 'sell']
    };

    for (const [category, categoryKeywords] of Object.entries(categories)) {
      if (keywords.some(keyword => categoryKeywords.includes(keyword))) {
        return category;
      }
    }
    return 'general';
  }

  private generateContextualResponse(intent: string, keywords: string[], category: string): string {
    let response = '';

    switch (category) {
      case 'crop_management':
        response = this.generateCropManagementResponse(keywords);
        break;
      case 'water_management':
        response = this.generateWaterManagementResponse(keywords);
        break;
      case 'soil_health':
        response = this.generateSoilHealthResponse(keywords);
        break;
      case 'pest_disease':
        response = this.generatePestDiseaseResponse(keywords);
        break;
      case 'weather_climate':
        response = this.generateWeatherResponse(keywords);
        break;
      case 'market_economics':
        response = this.generateMarketResponse(keywords);
        break;
      default:
        response = this.generateGeneralResponse(intent, keywords);
    }

    return response;
  }

  private generateCropManagementResponse(keywords: string[]): string {
    const crops = this.knowledgeBase.get('crops');
    const cropKeywords = keywords.filter(k => crops.hasOwnProperty(k));
    
    if (cropKeywords.length > 0) {
      const crop = cropKeywords[0];
      const cropInfo = crops[crop];
      return `For ${crop} cultivation: Best grown in ${cropInfo.seasons.join('/')} season in ${cropInfo.soilType.join(' or ')} soil. Water requirement is ${cropInfo.waterRequirement}. Use ${cropInfo.fertilizers.join(', ')} fertilizers. Watch out for ${cropInfo.commonDiseases.join(', ')}. Harvest time: ${cropInfo.harvestTime}. Pro tip: ${cropInfo.tips}`;
    }
    
    return "For optimal crop management, focus on selecting the right variety for your soil and climate, maintaining proper spacing, regular monitoring for pests and diseases, and following a balanced fertilization schedule.";
  }

  private generateWaterManagementResponse(keywords: string[]): string {
    return "Efficient water management is crucial for sustainable farming. Consider drip irrigation for water conservation, monitor soil moisture levels regularly, and water during early morning or evening to reduce evaporation. Mulching can help retain soil moisture.";
  }

  private generateSoilHealthResponse(keywords: string[]): string {
    return "Healthy soil is the foundation of productive farming. Test your soil pH regularly (ideal range 6.0-7.5), add organic matter through composting, practice crop rotation, and avoid over-tillage. Consider cover crops to improve soil structure and fertility.";
  }

  private generatePestDiseaseResponse(keywords: string[]): string {
    return "Integrated Pest Management (IPM) is the best approach. Regular field monitoring, use of beneficial insects, crop rotation, and targeted application of organic pesticides when necessary. Early detection is key to preventing major outbreaks.";
  }

  private generateWeatherResponse(keywords: string[]): string {
    return "Weather significantly impacts crop growth and yield. Monitor temperature, rainfall, and humidity patterns. Use weather forecasts for planning irrigation, fertilization, and harvesting. Consider climate-resilient varieties for your region.";
  }

  private generateMarketResponse(keywords: string[]): string {
    return "Market timing is crucial for profitability. Monitor price trends, consider value-added processing, explore direct-to-consumer sales, and maintain good post-harvest handling to reduce losses and improve quality.";
  }

  private generateGeneralResponse(intent: string, keywords: string[]): string {
    return "I'm here to help with all your farming questions! Whether you need advice on crop management, irrigation, soil health, pest control, or market strategies, feel free to ask specific questions for more detailed guidance.";
  }

  private personalizeResponse(response: string, context: ConversationContext): string {
    // Add personalization based on user preferences and history
    const { language, farmingType, experience } = context.userPreferences;
    
    if (experience === 'beginner') {
      response += " As you're starting out, I recommend taking small steps and consulting with local agricultural experts.";
    } else if (experience === 'advanced') {
      response += " Given your experience, you might also consider implementing precision agriculture techniques.";
    }

    return response;
  }

  private calculateConfidence(keywords: string[], category: string, intent: string): number {
    let confidence = 0.5; // Base confidence
    
    // Increase confidence based on keyword matches
    confidence += keywords.length * 0.1;
    
    // Increase confidence for specific categories
    if (category !== 'general') confidence += 0.2;
    
    // Increase confidence for clear intents
    if (intent !== 'general') confidence += 0.1;
    
    return Math.min(confidence, 0.95); // Cap at 95%
  }

  private generateFollowUpQuestions(category: string, keywords: string[]): string[] {
    const questions: { [key: string]: string[] } = {
      'crop_management': [
        "What's your current crop rotation schedule?",
        "Have you considered intercropping for better yield?",
        "What's your soil type and pH level?"
      ],
      'water_management': [
        "What irrigation method are you currently using?",
        "Have you tested your water quality recently?",
        "What's your average rainfall in the growing season?"
      ],
      'soil_health': [
        "When did you last test your soil?",
        "Are you using any organic amendments?",
        "What's your current fertilization schedule?"
      ],
      'pest_disease': [
        "Have you identified the specific pest or disease?",
        "What control methods have you tried so far?",
        "Are you practicing crop rotation?"
      ]
    };

    return questions[category] || [
      "What specific farming challenge are you facing?",
      "What's your farming experience level?",
      "What region are you farming in?"
    ];
  }

  private generateActionItems(category: string, keywords: string[]): string[] {
    const actions: { [key: string]: string[] } = {
      'crop_management': [
        "Conduct soil test before next planting season",
        "Plan crop rotation schedule",
        "Monitor weather forecasts regularly"
      ],
      'water_management': [
        "Install soil moisture sensors",
        "Consider drip irrigation system",
        "Implement water conservation practices"
      ],
      'soil_health': [
        "Test soil pH and nutrient levels",
        "Add organic compost to soil",
        "Plan cover crop planting"
      ],
      'pest_disease': [
        "Set up regular field monitoring schedule",
        "Research beneficial insects for your area",
        "Prepare organic pest control solutions"
      ]
    };

    return actions[category] || [
      "Consult with local agricultural extension office",
      "Keep detailed farming records",
      "Connect with other farmers in your area"
    ];
  }

  private updateConversationContext(userMessage: string, context?: ConversationContext) {
    if (context) {
      this.conversationHistory = context;
    }
    
    this.conversationHistory.previousMessages.push({
      text: userMessage,
      isUser: true,
      timestamp: new Date()
    });

    this.conversationHistory.sessionData.questionsAsked++;
    this.conversationHistory.sessionData.lastInteraction = new Date();

    // Extract topics from message
    const keywords = this.extractKeywords(userMessage);
    keywords.forEach(keyword => {
      if (!this.conversationHistory.sessionData.topicsDiscussed.includes(keyword)) {
        this.conversationHistory.sessionData.topicsDiscussed.push(keyword);
      }
    });
  }

  public getConversationSummary(): string {
    const { topicsDiscussed, questionsAsked } = this.conversationHistory.sessionData;
    return `In this session, you've asked ${questionsAsked} questions about ${topicsDiscussed.join(', ')}. I'm here to help with any other farming questions you might have!`;
  }
}