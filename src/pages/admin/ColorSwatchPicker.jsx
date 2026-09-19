import { COLOR_PRESETS } from '../../data/adminMockData'
import './ColorSwatchPicker.css'

function ColorSwatchPicker({ value, onChange }) {
  return (
    <div className="color-swatch-picker" role="radiogroup" aria-label="Color">
      {COLOR_PRESETS.map((color) => (
        <button
          key={color}
          type="button"
          role="radio"
          aria-checked={value === color}
          aria-label={color}
          className={`color-swatch ${value === color ? 'is-active' : ''}`}
          style={{ background: color }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  )
}

export default ColorSwatchPicker
