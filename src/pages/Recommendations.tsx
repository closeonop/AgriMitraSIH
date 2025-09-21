import { useTranslation } from 'react-i18next'
import { SmartRecommendations } from '../components/SmartRecommendations'

const Recommendations = () => {
  const { t } = useTranslation()
  
  // Using our new SmartRecommendations component
  return <SmartRecommendations />
}

export default Recommendations