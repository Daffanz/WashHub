import { CheckCircle2 } from 'lucide-react'
import logoWashhub from '../../../assets/logo_washhub.png'

const benefits = [
  'End-to-end Data Processing',
  'Automated KPI Monitoring',
  'Real-time Outlet Managers',
]

const AboutSection = () => {
  return (
    <section id="about" style={{ padding: '80px 0', background: '#ffffff' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px' }}>
        <div className="about-grid">
          {/* Left — logo image */}
          <div
            style={{
              borderRadius: '16px',
              minHeight: '320px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px',
            }}
          >
            <img
              src={logoWashhub}
              alt="WashHub Logo"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>

          {/* Right — text */}
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0', lineHeight: 1.2 }}>
              Apa itu WashHub?
            </h2>
            <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.7, margin: '0 0 24px 0' }}>
              WashHub hadir sebagai solusi manajemen laundry yang komprehensif. Platform kami
              membantu Anda mengelola operasional, memantau kinerja, dan mengembangkan bisnis
              laundry dengan lebih efisien.
            </p>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#334155' }}
                >
                  <CheckCircle2 size={16} color="#1c52b8" style={{ flexShrink: 0 }} />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
        }
        @media (max-width: 768px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
        }
      `}</style>
    </section>
  )
}

export default AboutSection
