import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import landingImage from '../../../assets/washhub_landingpage.jpg'

const HeroSection = () => {
  return (
    <section
      id="home"
      style={{
        paddingTop: '120px',
        paddingBottom: '60px',
        background: '#ffffff',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '0 24px',
          textAlign: 'center',
        }}
      >
        {/* Headline */}
        <h1
          style={{
            fontSize: 'clamp(28px, 5vw, 44px)',
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1.15,
            margin: '0 0 20px 0',
            letterSpacing: '-0.02em',
          }}
        >
          Smart Franchise Laundry<br />
          Management System 
        </h1>

        {/* Subheadline */}
        <p
          style={{
            fontSize: '14px',
            color: '#64748b',
            maxWidth: '520px',
            margin: '0 auto 28px',
            lineHeight: 1.6,
          }}
        >
          Menghadirkan sistem manajemen laundry berbasis teknologi untuk menjaga kualitas layanan, mempermudah operasional, dan meningkatkan kepuasan pelanggan.
        </p>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            marginBottom: '56px',
            flexWrap: 'wrap',
          }}
        >
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button
              style={{
                height: '40px',
                padding: '0 22px',
                background: '#1c52b8',
                color: '#ffffff',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1742a3')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#1c52b8')}
            >
              Get Started Free
              <ArrowRight size={14} />
            </button>
          </Link>
          <a href="#features" style={{ textDecoration: 'none' }}>
            <button
              style={{
                height: '40px',
                padding: '0 22px',
                background: '#ffffff',
                color: '#475569',
                fontSize: '13px',
                fontWeight: 500,
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
            >
              Learn More
            </button>
          </a>
        </div>

        {/* Hero Image */}
        <div
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 50px rgba(15, 23, 42, 0.18)',
            background: '#f1f5f9',
          }}
        >
          <img
            src={landingImage}
            alt="WashHub Smart Laundry Management"
            style={{
              display: 'block',
              width: '100%',
              height: 'auto',
              maxHeight: '520px',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
    </section>
  )
}

export default HeroSection
