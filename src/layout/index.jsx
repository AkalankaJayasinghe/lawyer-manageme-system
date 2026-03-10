import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

const MainLayout = ({ children }) => {
    return (
        <div>
            <Header />
            <main>{children}</main>
            <Footer />
        </div>
    );
};

export { MainLayout };