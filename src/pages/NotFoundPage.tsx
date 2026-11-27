import { Link } from 'react-router-dom';
import { Icon } from '../components/Icon';

export function NotFoundPage() {
  return (
    <div className="page">
      <div className="empty empty-lg">
        <Icon name="compass" size={34} />
        <h1>Page not found</h1>
        <p>This page doesn’t exist. Pick a week from the navigation or go back to the dashboard.</p>
        <Link to="/" className="btn btn-primary">
          <Icon name="arrowLeft" size={16} /> Back to dashboard
        </Link>
      </div>
    </div>
  );
}
