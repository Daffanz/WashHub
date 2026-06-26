import { Outlet } from 'react-router-dom'
import LandingNavbar from '../components/navbar/LandingNavbar'

const MainLayout = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <LandingNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default MainLayout
