import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Desplaza la página al inicio cada vez que cambia la ruta.
 * Colócalo dentro de <Router> en App.jsx.
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
