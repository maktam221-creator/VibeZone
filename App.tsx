import React, { useState, useRef, useEffect } from 'react';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { HomePage } from './components/HomePage.js';
import { AdminPanel } from './components/admin/AdminPanel.js';
import { LoginPage } from './pages/LoginPage.js';
import { InfoModal } from './components/InfoModal.js';
import { BlogPostModal } from './components/BlogPostModal.js';
import { initialProducts, initialCoupons, initialSiteSettings } from './constants.js';
import { useAuth } from './context/AuthContext.js';
import { useLocalization } from './hooks/useLocalization.js';
import { InstallPWAButton } from './components/InstallPWAButton.js';

const App = () => {
  const { currentUser } = useAuth();
  const { t } = useLocalization();
  const [allProducts, setAllProducts] = useState(initialProducts);
  const [allCoupons, setAllCoupons] = useState(initialCoupons);
  const [siteSettings, setSiteSettings] = useState(initialSiteSettings);
  const [view, setView] = useState('home');
  const [wishlist, setWishlist] = useState([]);
  const categoriesRef = useRef(null);
  const blogRef = useRef(null);
  const [infoModalView, setInfoModalView] = useState(null);
  const [viewingPost, setViewingPost] = useState(null);
  const [installPromptEvent, setInstallPromptEvent] = useState(null);

  useEffect(() => {
    document.getElementById('adsense-script')?.remove();
    document.getElementById('facebook-pixel-script-1')?.remove();
    document.getElementById('facebook-pixel-script-2')?.remove();

    if (siteSettings.googleAdSenseId && siteSettings.googleAdSenseId !== 'ca-pub-XXXXXXXXXXXXXXXX') {
      const script = document.createElement('script');
      script.id = 'adsense-script';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteSettings.googleAdSenseId}`;
      script.async = true;
      script.crossOrigin = 'anonymous';
      document.head.appendChild(script);
    }

    if (siteSettings.facebookPixelId && siteSettings.facebookPixelId !== 'XXXXXXXXXXXXXXXX') {
      const script1 = document.createElement('script');
      script1.id = 'facebook-pixel-script-1';
      script1.innerHTML = `!function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${siteSettings.facebookPixelId}');
      fbq('track', 'PageView');`;
      document.head.appendChild(script1);
      
      const noscript = document.createElement('noscript');
      noscript.id = 'facebook-pixel-script-2';
      noscript.innerHTML = `<img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=${siteSettings.facebookPixelId}&ev=PageView&noscript=1"
      />`;
      document.head.appendChild(noscript);
    }

  }, [siteSettings.googleAdSenseId, siteSettings.facebookPixelId]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerSW = () => {
        navigator.serviceWorker.register('./sw.js')
          .then(registration => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          })
          .catch(err => {
            console.log('ServiceWorker registration failed: ', err);
          });
      };
      
      window.addEventListener('load', registerSW);
      
      return () => {
        window.removeEventListener('load', registerSW);
      };
    }
  }, []);

  const handleInstallClick = () => {
    if (!installPromptEvent) {
      return;
    }
    installPromptEvent.prompt();
    installPromptEvent.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
      } else {
        console.log('User dismissed the A2HS prompt');
      }
      setInstallPromptEvent(null);
    });
  };

  const handleSaveProduct = (productToSave) => {
    setAllProducts(prev => {
      const exists = prev.some(p => p.id === productToSave.id);
      if (exists) {
        return prev.map(p => p.id === productToSave.id ? productToSave : p);
      }
      const newProduct = { ...productToSave, id: Date.now() };
      return [...prev, newProduct];
    });
  };

  const handleDeleteProduct = (productId) => {
    setAllProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  const handleSaveCoupon = (couponToSave) => {
    setAllCoupons(prev => {
      const exists = prev.some(c => c.id === couponToSave.id);
      if (exists) {
        return prev.map(c => c.id === couponToSave.id ? couponToSave : c);
      }
      const newCoupon = { ...couponToSave, id: Date.now() };
      return [...prev, newCoupon];
    });
  };

  const handleDeleteCoupon = (couponId) => {
    setAllCoupons(prev => prev.filter(c => c.id !== couponId));
  };
  
  const handleSaveSiteSettings = (settings) => {
    setSiteSettings(settings);
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };
  
  const handleNavigate = (newView) => {
    if (newView === 'admin' && !currentUser) {
      setView('login');
      window.scrollTo(0, 0);
    } else if (newView === 'about' || newView === 'privacy') {
        setInfoModalView(newView);
    } else {
      setView(newView);
      setInfoModalView(null);
      window.scrollTo(0, 0);
    }
  };
  
  const handleGoToCategories = () => {
    if (view !== 'home') {
      setView('home');
      setTimeout(() => {
        categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      categoriesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const handleGoToBlog = () => {
    if (view !== 'home') {
      setView('home');
      setTimeout(() => {
        blogRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      blogRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const renderContent = () => {
    if (view === 'login') {
      return React.createElement(LoginPage, { onLoginSuccess: () => setView('admin') });
    }

    if (view === 'admin' && currentUser) {
      return React.createElement(AdminPanel, {
        products: allProducts,
        coupons: allCoupons,
        onSaveProduct: handleSaveProduct,
        onDeleteProduct: handleDeleteProduct,
        onSaveCoupon: handleSaveCoupon,
        onDeleteCoupon: handleDeleteCoupon,
        siteSettings: siteSettings,
        onSaveSiteSettings: handleSaveSiteSettings,
        onLogout: () => setView('home')
      });
    }

    return React.createElement(HomePage, {
      view: view,
      products: allProducts,
      coupons: allCoupons,
      wishlist: wishlist,
      toggleWishlist: toggleWishlist,
      setView: setView,
      categoriesRef: categoriesRef,
      blogRef: blogRef,
      siteSettings: siteSettings,
      onViewPost: setViewingPost
    });
  };

  return React.createElement("div", { className: "min-h-screen flex flex-col bg-primary" },
    React.createElement(Header, {
      wishlistCount: wishlist.length,
      onNavigate: handleNavigate,
      onGoToCategories: handleGoToCategories,
      onGoToBlog: handleGoToBlog,
      siteSettings: siteSettings
    }),
    React.createElement("main", { className: "flex-grow container mx-auto px-4 py-8" },
      renderContent()
    ),
    React.createElement(Footer, { onNavigate: handleNavigate, siteSettings: siteSettings }),
    infoModalView && React.createElement(InfoModal, {
      title: t(`footer.${infoModalView}`),
      content: infoModalView === 'about' ? siteSettings.aboutUs : siteSettings.privacyPolicy,
      onClose: () => setInfoModalView(null)
    }),
    viewingPost && React.createElement(BlogPostModal, {
      post: viewingPost,
      onClose: () => setViewingPost(null)
    }),
    installPromptEvent && React.createElement(InstallPWAButton, { onInstall: handleInstallClick })
  );
};

export default App;
