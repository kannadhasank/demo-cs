import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import './Dashboard.css';

const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);

  const stats = [
    {
      title: 'Total Projects',
      value: '24',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
        </svg>
      ),
      color: '#2196f3',
    },
    {
      title: 'Data Modules',
      value: '156',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2" />
        </svg>
      ),
      color: '#4caf50',
    },
    {
      title: 'Active Users',
      value: '48',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeWidth="2" />
          <circle cx="9" cy="7" r="4" strokeWidth="2" />
        </svg>
      ),
      color: '#ff9800',
    },
    {
      title: 'Publications',
      value: '32',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" strokeWidth="2" />
        </svg>
      ),
      color: '#9c27b0',
    },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Welcome back, {user?.name}!</h1>
          <p className="dashboard-subtitle">Here's what's happening with your projects today.</p>
        </div>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <p className="stat-title">{stat.title}</p>
              <h2 className="stat-value">{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3 className="card-title">Recent Projects</h3>
          <div className="card-content">
            <div className="project-list">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="project-item">
                  <div className="project-info">
                    <h4>AirbusA3200</h4>
                    <p className="project-desc">Maintenance manual</p>
                  </div>
                  <span className="project-status status-active">Active</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="card-title">Recent Activity</h3>
          <div className="card-content">
            <div className="activity-list">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="activity-item">
                  <div className="activity-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="activity-content">
                    <p className="activity-text">Data module updated</p>
                    <span className="activity-time">2 hours ago</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
