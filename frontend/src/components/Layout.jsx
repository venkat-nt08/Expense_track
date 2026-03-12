import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main style={{
                flex: 1,
                marginLeft: '240px', // Sidebar width (220) + left margin (1rem/16px) approx
                padding: '2rem',
                width: 'calc(100% - 240px)'
            }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
