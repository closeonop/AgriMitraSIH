import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface CropPrice {
  crop: string
  currentPrice: number
  previousPrice: number
  change: number
  changePercent: number
  unit: string
  market: string
  icon: string
}

interface MarketTrend {
  period: string
  wheat: number
  rice: number
  corn: number
  tomato: number
}

interface MarketNews {
  id: string
  title: string
  summary: string
  impact: 'positive' | 'negative' | 'neutral'
  timestamp: string
  source: string
}

const MarketIntelligence = () => {
  const { t } = useTranslation()
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d')
  const [selectedMarket, setSelectedMarket] = useState('all')

  // Punjab crop prices (current market rates)
  const cropPrices: CropPrice[] = [
    {
      crop: 'Wheat',
      currentPrice: 2250,
      previousPrice: 2180,
      change: 70,
      changePercent: 3.21,
      unit: '₹/quintal',
      market: 'Ludhiana Mandi',
      icon: '🌾'
    },
    {
      crop: 'Basmati Rice',
      currentPrice: 4800,
      previousPrice: 4650,
      change: 150,
      changePercent: 3.23,
      unit: '₹/quintal',
      market: 'Amritsar Mandi',
      icon: '🍚'
    },
    {
      crop: 'Cotton',
      currentPrice: 6200,
      previousPrice: 6050,
      change: 150,
      changePercent: 2.48,
      unit: '₹/quintal',
      market: 'Bathinda Mandi',
      icon: '🌸'
    },
    {
      crop: 'Sugarcane',
      currentPrice: 380,
      previousPrice: 375,
      change: 5,
      changePercent: 1.33,
      unit: '₹/quintal',
      market: 'Jalandhar Mandi',
      icon: '🎋'
    },
    {
      crop: 'Maize',
      currentPrice: 1850,
      previousPrice: 1820,
      change: 30,
      changePercent: 1.65,
      unit: '₹/quintal',
      market: 'Patiala Mandi',
      icon: '🌽'
    },
    {
      crop: 'Mustard',
      currentPrice: 5400,
      previousPrice: 5250,
      change: 150,
      changePercent: 2.86,
      unit: '₹/quintal',
      market: 'Moga Mandi',
      icon: '🌻'
    },
    {
      crop: 'Basmati Rice',
      currentPrice: 4200,
      previousPrice: 4350,
      change: -150,
      changePercent: -3.45,
      unit: '₹/quintal',
      market: 'Delhi',
      icon: '🌾'
    },
    {
      crop: 'Corn',
      currentPrice: 1850,
      previousPrice: 1820,
      change: 30,
      changePercent: 1.65,
      unit: '₹/quintal',
      market: 'Mumbai',
      icon: '🌽'
    },
    {
      crop: 'Tomato',
      currentPrice: 3200,
      previousPrice: 2800,
      change: 400,
      changePercent: 14.29,
      unit: '₹/quintal',
      market: 'Bangalore',
      icon: '🍅'
    },
    {
      crop: 'Onion',
      currentPrice: 2500,
      previousPrice: 2650,
      change: -150,
      changePercent: -5.66,
      unit: '₹/quintal',
      market: 'Pune',
      icon: '🧅'
    },
    {
      crop: 'Potato',
      currentPrice: 1200,
      previousPrice: 1150,
      change: 50,
      changePercent: 4.35,
      unit: '₹/quintal',
      market: 'Agra',
      icon: '🥔'
    }
  ]

  // Punjab market trends (weekly data)
  const marketTrends: MarketTrend[] = [
    { period: 'Jan 1', wheat: 2100, rice: 4500, corn: 1750, tomato: 2800 },
    { period: 'Jan 8', wheat: 2150, rice: 4600, corn: 1780, tomato: 3000 },
    { period: 'Jan 15', wheat: 2180, rice: 4650, corn: 1820, tomato: 3100 },
    { period: 'Jan 22', wheat: 2250, rice: 4800, corn: 1850, tomato: 3200 }
  ]

  // Punjab agricultural news
  const marketNews: MarketNews[] = [
    {
      id: '1',
      title: 'Punjab Wheat Procurement Begins at MSP',
      summary: 'Government starts wheat procurement at Minimum Support Price of ₹2,275/quintal in Punjab mandis.',
      impact: 'positive',
      timestamp: '1 hour ago',
      source: 'Punjab Mandi Board'
    },
    {
      id: '2',
      title: 'Basmati Rice Export Demand Increases',
      summary: 'Strong international demand for Punjab Basmati rice pushes prices up by 3.2% this week.',
      impact: 'positive',
      timestamp: '3 hours ago',
      source: 'Export Council'
    },
    {
      id: '3',
      title: 'Cotton Prices Stable in Bathinda Mandi',
      summary: 'Cotton prices remain steady at ₹6,200/quintal with good quality arrivals in Bathinda.',
      impact: 'neutral',
      timestamp: '6 hours ago',
      source: 'Cotton Association'
    },
    {
      id: '4',
      title: 'Mustard Crop Outlook Positive in Punjab',
      summary: 'Good weather conditions expected to boost mustard yield, supporting current price levels.',
      impact: 'positive',
      timestamp: '1 day ago',
      source: 'Agricultural Department'
    }
  ]

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600 bg-green-50'
    if (change < 0) return 'text-red-600 bg-red-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getPriceChangeIcon = (change: number) => {
    if (change > 0) return '↗️'
    if (change < 0) return '↘️'
    return '→'
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200'
      case 'negative': return 'text-red-600 bg-red-50 border-red-200'
      case 'neutral': return 'text-gray-600 bg-gray-50 border-gray-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive': return '📈'
      case 'negative': return '📉'
      case 'neutral': return '📊'
      default: return '📰'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pt-20">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Market Intelligence
              </h1>
              <p className="text-lg text-gray-600">
                Real-time crop prices, market trends, and agricultural news
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Last updated</div>
              <div className="text-sm font-medium text-gray-700">5 minutes ago</div>
            </div>
          </div>
        </div>

        {/* Market Overview */}
        <div className="card-elegant p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Market Overview</h2>
            <div className="flex space-x-2">
              {['1d', '7d', '1m', '3m'].map((timeframe) => (
                <button
                  key={timeframe}
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedTimeframe === timeframe
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {timeframe}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cropPrices.map((crop, index) => (
              <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{crop.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-900">{crop.crop}</h3>
                      <p className="text-sm text-gray-600">{crop.market}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPriceChangeColor(crop.change)}`}>
                    {getPriceChangeIcon(crop.change)} {crop.changePercent > 0 ? '+' : ''}{crop.changePercent.toFixed(2)}%
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {crop.currentPrice.toLocaleString()} {crop.unit}
                  </div>
                  <div className="text-sm text-gray-600">
                    Previous: {crop.previousPrice.toLocaleString()} {crop.unit}
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${getPriceChangeColor(crop.change)}`}>
                  <div className="text-sm font-medium">
                    {crop.change > 0 ? '+' : ''}{crop.change} {crop.unit} change
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Price Trends Chart */}
          <div className="lg:col-span-2">
            <div className="card-elegant p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Price Trends</h2>
              
              {/* Simple trend visualization */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="text-center">
                    <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-sm font-medium text-gray-700">Wheat</div>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-sm font-medium text-gray-700">Rice</div>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-sm font-medium text-gray-700">Corn</div>
                  </div>
                  <div className="text-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
                    <div className="text-sm font-medium text-gray-700">Tomato</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {marketTrends.map((trend, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg">
                      <div className="font-medium text-gray-700">{trend.period}</div>
                      <div className="flex space-x-6 text-sm">
                        <span className="text-blue-600">₹{trend.wheat}</span>
                        <span className="text-green-600">₹{trend.rice}</span>
                        <span className="text-yellow-600">₹{trend.corn}</span>
                        <span className="text-red-600">₹{trend.tomato}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Market Analysis */}
            <div className="card-elegant p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Market Analysis</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-3xl">📈</div>
                    <div>
                      <h3 className="font-bold text-green-900">Top Gainers</h3>
                      <p className="text-green-700 text-sm">Best performing crops</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-green-800">Tomato</span>
                      <span className="font-bold text-green-600">+14.29%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-800">Potato</span>
                      <span className="font-bold text-green-600">+4.35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-800">Wheat</span>
                      <span className="font-bold text-green-600">+3.37%</span>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 p-6 rounded-xl border border-red-200">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="text-3xl">📉</div>
                    <div>
                      <h3 className="font-bold text-red-900">Top Losers</h3>
                      <p className="text-red-700 text-sm">Declining crop prices</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-red-800">Onion</span>
                      <span className="font-bold text-red-600">-5.66%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-800">Rice</span>
                      <span className="font-bold text-red-600">-3.45%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                <h3 className="font-bold text-blue-900 mb-3">Market Insights</h3>
                <ul className="space-y-2 text-blue-800 text-sm">
                  <li>• Vegetable prices showing high volatility due to weather conditions</li>
                  <li>• Grain markets remain stable with moderate upward trend</li>
                  <li>• Export demand driving wheat prices higher</li>
                  <li>• Seasonal factors affecting tomato and onion prices</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Market News & Alerts */}
          <div className="lg:col-span-1">
            {/* Market News */}
            <div className="card-elegant p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Market News</h3>
              
              <div className="space-y-4">
                {marketNews.map((news) => (
                  <div key={news.id} className={`p-4 rounded-lg border ${getImpactColor(news.impact)}`}>
                    <div className="flex items-start space-x-3">
                      <div className="text-xl">{getImpactIcon(news.impact)}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">{news.title}</h4>
                        <p className="text-sm mb-2">{news.summary}</p>
                        <div className="flex justify-between text-xs opacity-75">
                          <span>{news.source}</span>
                          <span>{news.timestamp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 btn-secondary text-sm">
                View All News
              </button>
            </div>

            {/* Price Alerts */}
            <div className="card-elegant p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Price Alerts</h3>
              
              <div className="space-y-3">
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">⚠️</span>
                    <span className="font-semibold text-yellow-800">Wheat Alert</span>
                  </div>
                  <p className="text-yellow-700 text-sm">Price reached your target of ₹2,100/quintal</p>
                </div>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">✅</span>
                    <span className="font-semibold text-green-800">Tomato Alert</span>
                  </div>
                  <p className="text-green-700 text-sm">Good selling opportunity - prices up 14%</p>
                </div>
              </div>

              <button className="w-full mt-4 btn-primary text-sm">
                Set New Alert
              </button>
            </div>

            {/* Quick Actions */}
            <div className="card-elegant p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full btn-secondary text-sm">
                  📊 Export Price Data
                </button>
                <button className="w-full btn-secondary text-sm">
                  📈 Compare Markets
                </button>
                <button className="w-full btn-secondary text-sm">
                  📱 SMS Price Updates
                </button>
                <button className="w-full btn-secondary text-sm">
                  🔔 Manage Alerts
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MarketIntelligence