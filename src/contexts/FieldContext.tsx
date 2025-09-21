import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Field } from '../types/field'
import { getAllFields } from '../services/fieldService'

interface FieldContextType {
  fields: Field[]
  selectedField: Field | null
  setSelectedField: (field: Field | null) => void
  loading: boolean
  refreshFields: () => Promise<void>
}

const FieldContext = createContext<FieldContextType | undefined>(undefined)

interface FieldProviderProps {
  children: ReactNode
}

export const FieldProvider: React.FC<FieldProviderProps> = ({ children }) => {
  const [fields, setFields] = useState<Field[]>([])
  const [selectedField, setSelectedField] = useState<Field | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshFields = async () => {
    try {
      setLoading(true)
      const fieldsData = await getAllFields()
      setFields(fieldsData)
      
      // Auto-select first field if none selected
      if (!selectedField && fieldsData.length > 0) {
        setSelectedField(fieldsData[0])
      }
    } catch (error) {
      // Silently handle error to avoid console spam
      setFields([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshFields()
  }, [])

  const value: FieldContextType = {
    fields,
    selectedField,
    setSelectedField,
    loading,
    refreshFields
  }

  return (
    <FieldContext.Provider value={value}>
      {children}
    </FieldContext.Provider>
  )
}

export const useField = () => {
  const context = useContext(FieldContext)
  if (!context) {
    throw new Error('useField must be used within a FieldProvider')
  }
  return context
}