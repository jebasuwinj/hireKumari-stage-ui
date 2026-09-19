import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, Select } from 'antd'
import { SearchOutlined, EnvironmentOutlined, AppstoreOutlined } from '@ant-design/icons'
import { useOptions } from '../hooks/useOptions.js'
import { useCategories } from '../hooks/useCategories.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import './SearchJobs.css'

function SearchJobs({ initialValues, onSearch, variant = 'hero' }) {
  const navigate = useNavigate()
  const { options } = useOptions()
  const { categories } = useCategories()
  const { t } = useLanguage()
  const [keyword, setKeyword] = useState(initialValues?.keyword ?? '')
  const [taluk, setTaluk] = useState(initialValues?.taluk ?? 'All Taluks')
  const [sector, setSector] = useState(initialValues?.sector ?? 'All Sectors')

  const talukOptions = [
    { value: 'All Taluks', label: t('search.location') },
    ...options.taluks.map((tl) => ({ value: tl, label: tl })),
  ]
  const sectorOptions = [
    { value: 'All Sectors', label: t('search.jobCategory') },
    ...categories.map((c) => ({ value: c.name, label: c.displayName })),
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    const values = { keyword, taluk, sector }
    if (onSearch) {
      onSearch(values)
      return
    }
    const params = new URLSearchParams()
    if (keyword) params.set('q', keyword)
    if (taluk && taluk !== 'All Taluks') params.set('taluk', taluk)
    if (sector && sector !== 'All Sectors') params.set('sector', sector)
    navigate(`/jobs?${params.toString()}`)
  }

  return (
    <form className={`search-jobs search-jobs--${variant}`} onSubmit={handleSubmit}>
      <div className="search-jobs__field search-jobs__field--keyword">
        <Input
          size="large"
          variant="borderless"
          prefix={<SearchOutlined className="search-jobs__icon" />}
          placeholder={t('search.keywordPlaceholder')}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>

      <div className="search-jobs__field">
        <EnvironmentOutlined className="search-jobs__icon" />
        <Select
          size="large"
          variant="borderless"
          className={taluk === 'All Taluks' ? 'search-jobs__select--placeholder' : ''}
          value={taluk}
          onChange={setTaluk}
          options={talukOptions}
          popupMatchSelectWidth={false}
        />
      </div>

      <div className="search-jobs__field">
        <AppstoreOutlined className="search-jobs__icon" />
        <Select
          size="large"
          variant="borderless"
          className={sector === 'All Sectors' ? 'search-jobs__select--placeholder' : ''}
          value={sector}
          onChange={setSector}
          options={sectorOptions}
          popupMatchSelectWidth={false}
        />
      </div>

      <button type="submit" className="btn btn-primary search-jobs__submit">
        {t('search.submit')} <span aria-hidden="true">→</span>
      </button>
    </form>
  )
}

export default SearchJobs
