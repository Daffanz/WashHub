const Footer = () => {
  const year = new Date().getFullYear()

  const links = {
    Product: ['Features', 'Pricing', 'Changelog', 'Roadmap'],
    Company: ['About', 'Blog', 'Careers', 'Press'],
    Support: ['Documentation', 'Help Center', 'Contact', 'Status'],
  }

  return (
    <footer style={{ background: '#ffffff', borderTop: '1px solid #f1f5f9' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px 24px' }}>
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
              WashHub
            </p>
            <p
              style={{
                fontSize: '12px',
                color: '#94a3b8',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '260px',
              }}
            >
              Smart Laundry Management System untuk bisnis laundry modern yang efisien.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#0f172a',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  margin: '0 0 14px 0',
                }}
              >
                {category}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {items.map((item) => (
                  <li key={item} style={{ marginBottom: '8px' }}>
                    <a
                      href="#"
                      style={{
                        fontSize: '12px',
                        color: '#64748b',
                        textDecoration: 'none',
                        transition: 'color 0.15s',
                      }}
                      onMouseEnter={(e) => (e.target.style.color = '#0f172a')}
                      onMouseLeave={(e) => (e.target.style.color = '#64748b')}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          style={{
            borderTop: '1px solid #f1f5f9',
            paddingTop: '20px',
            marginTop: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
            © {year} WashHub. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <a href="#" style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'none' }}>
              Privacy Policy
            </a>
            <a href="#" style={{ fontSize: '11px', color: '#94a3b8', textDecoration: 'none' }}>
              Terms of Service
            </a>
          </div>
        </div>
      </div>
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
        }
        @media (max-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer
