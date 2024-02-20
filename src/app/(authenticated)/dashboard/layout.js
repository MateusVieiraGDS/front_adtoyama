import DashboardAppBar from '../../../components/dashboard/DashboardAppBar'

export default function DashboardLayout({children}) {
  return (
      <DashboardAppBar notificationsCount={0}>
        {children} 
      </DashboardAppBar>
  );
}