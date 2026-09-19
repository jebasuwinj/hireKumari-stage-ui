import collectorPhoto from '../assets/districtCollector.png'
import './CollectorSpotlight.css'

function CollectorSpotlight() {
  return (
    <section className="section collector-spotlight">
      <div className="container collector-spotlight__inner">
        <div className="collector-spotlight__figure">
          <img src={collectorPhoto} alt="Thiru. M. Prathap, I.A.S., District Collector, Kanniyakumari" />
        </div>

        <div className="collector-spotlight__content">
          <span className="section-eyebrow">A District Administration Initiative</span>
          <h2>
            A Step Towards a More Connected <span>Kanniyakumari</span>
          </h2>
          <blockquote className="collector-spotlight__quote">
            &ldquo;Connecting talent with opportunity can create stronger pathways for the people and businesses of
            our district&rdquo;
          </blockquote>
          <div className="collector-spotlight__attribution">
            <strong>— Thiru. M. Prathap, I.A.S.</strong>
            <span>District Collector, Kanniyakumari</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CollectorSpotlight
