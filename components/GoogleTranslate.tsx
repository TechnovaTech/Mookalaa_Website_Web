"use client"

import { useEffect } from 'react'

declare global {
  interface Window {
    google: any
    googleTranslateElementInit: () => void
  }
}

const GoogleTranslate = () => {
  useEffect(() => {
    const addScript = () => {
      if (!document.getElementById('google-translate-script')) {
        const script = document.createElement('script')
        script.id = 'google-translate-script'
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit'
        script.async = true
        document.body.appendChild(script)
      }
    }

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'bn,brx,doi,gu,hi,kn,ks,gom,mai,ml,mni,mr,ne,or,pa,sa,sat,sd,ta,te,ur',
          layout: window.google.translate.TranslateElement.InlineLayout.DROPDOWN,
          multilanguagePage: true,
          gaTrack: true,
          gaId: 'UA-XXXXX-X'
        },
        'google_translate_element'
      )
      
      // Remove banner elements after initialization
      setTimeout(() => {
        const banner = document.querySelector('.goog-te-banner-frame')
        if (banner) banner.remove()
        
        // Fix dropdown functionality
        const combo = document.querySelector('.goog-te-combo')
        if (combo) {
          combo.addEventListener('change', function() {
            setTimeout(() => {
              const banner = document.querySelector('.goog-te-banner-frame')
              if (banner) banner.remove()
            }, 100)
          })
        }
      }, 500)
    }

    addScript()
    
    // Additional banner removal on page load
    const observer = new MutationObserver(() => {
      const banner = document.querySelector('.goog-te-banner-frame')
      if (banner) banner.remove()
    })
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
    
    return () => observer.disconnect()
  }, [])

  return (
    <div className="fixed top-2 right-2 z-50 rounded-lg shadow-lg p-1 max-w-[100px] xs:max-w-[120px] sm:max-w-[150px] md:max-w-[180px] lg:max-w-[200px]" style={{backgroundColor: '#124972'}}>
      <div id="google_translate_element"></div>
      <style jsx global>{`
        .goog-te-gadget {
          font-family: inherit !important;
        }
        .goog-te-gadget-simple {
          background-color: transparent !important;
          border: none !important;
          font-size: 10px !important;
          width: 100% !important;
        }
        @media (min-width: 375px) {
          .goog-te-gadget-simple {
            font-size: 11px !important;
          }
        }
        @media (min-width: 480px) {
          .goog-te-gadget-simple {
            font-size: 12px !important;
          }
        }
        @media (min-width: 640px) {
          .goog-te-gadget-simple {
            font-size: 13px !important;
          }
        }
        @media (min-width: 768px) {
          .goog-te-gadget-simple {
            font-size: 14px !important;
          }
        }
        @media (min-width: 1024px) {
          .goog-te-gadget-simple {
            font-size: 15px !important;
          }
        }
        .goog-te-gadget-simple .goog-te-menu-value {
          color: white !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value:hover {
          text-decoration: none !important;
        }
        .goog-te-banner-frame {
          display: none !important;
        }
        .goog-te-menu-frame {
          max-height: 250px !important;
          overflow-y: auto !important;
          width: auto !important;
          min-width: 100px !important;
          right: 0 !important;
          left: auto !important;
        }
        @media (min-width: 375px) {
          .goog-te-menu-frame {
            max-height: 280px !important;
            min-width: 120px !important;
          }
        }
        @media (min-width: 480px) {
          .goog-te-menu-frame {
            max-height: 300px !important;
            min-width: 140px !important;
          }
        }
        @media (min-width: 640px) {
          .goog-te-menu-frame {
            max-height: 350px !important;
            min-width: 160px !important;
          }
        }
        @media (min-width: 768px) {
          .goog-te-menu-frame {
            max-height: 400px !important;
            min-width: 180px !important;
          }
        }
        @media (min-width: 1024px) {
          .goog-te-menu-frame {
            max-height: 450px !important;
            min-width: 200px !important;
          }
        }
        body {
          top: 0 !important;
        }
        #google_translate_element .skiptranslate {
          display: block !important;
        }
        .goog-logo-link {
          display: none !important;
        }
        .goog-te-gadget .goog-te-combo {
          margin: 0 !important;
        }
        .goog-te-gadget-icon {
          display: none !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value span {
          color: white !important;
        }
        .goog-te-gadget img {
          display: none !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value span[style*="color: rgb(155, 155, 155)"] {
          display: none !important;
        }
        .goog-te-banner-frame.skiptranslate {
          display: none !important;
        }
        .goog-te-banner-frame {
          display: none !important;
        }
        #goog-gt-tt {
          display: none !important;
        }
        .goog-tooltip {
          display: none !important;
        }
        .goog-tooltip:hover {
          display: none !important;
        }
        .goog-text-highlight {
          background: none !important;
          box-shadow: none !important;
        }
        .goog-te-banner-frame.skiptranslate {
          visibility: hidden !important;
          display: none !important;
        }
        .goog-te-banner-frame {
          visibility: hidden !important;
          display: none !important;
        }
        .VIpgJd-ZVi9od-ORHb-OEVmcd {
          display: none !important;
        }
        .VIpgJd-ZVi9od-xl07Ob-OEVmcd {
          display: none !important;
        }
        .skiptranslate > iframe {
          visibility: hidden !important;
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
        }
        iframe.skiptranslate {
          visibility: hidden !important;
          position: absolute !important;
          left: -9999px !important;
          top: -9999px !important;
        }
        body > .skiptranslate {
          display: none !important;
        }
        html > body > .skiptranslate {
          display: none !important;
        }
        .goog-te-spinner-pos {
          display: none !important;
        }
        .goog-te-menu2 {
          max-height: 250px !important;
          overflow-y: auto !important;
          border: 1px solid #ccc !important;
          border-radius: 4px !important;
          width: auto !important;
          min-width: 100px !important;
          right: 0 !important;
          left: auto !important;
        }
        @media (min-width: 375px) {
          .goog-te-menu2 {
            max-height: 280px !important;
            min-width: 120px !important;
          }
        }
        @media (min-width: 480px) {
          .goog-te-menu2 {
            max-height: 300px !important;
            min-width: 140px !important;
          }
        }
        @media (min-width: 640px) {
          .goog-te-menu2 {
            max-height: 350px !important;
            min-width: 160px !important;
          }
        }
        @media (min-width: 768px) {
          .goog-te-menu2 {
            max-height: 400px !important;
            min-width: 180px !important;
          }
        }
        @media (min-width: 1024px) {
          .goog-te-menu2 {
            max-height: 450px !important;
            min-width: 200px !important;
          }
        }
        .goog-te-menu2-item {
          padding: 4px 6px !important;
          font-size: 10px !important;
          color: #333 !important;
          display: block !important;
        }
        @media (min-width: 375px) {
          .goog-te-menu2-item {
            padding: 5px 7px !important;
            font-size: 11px !important;
          }
        }
        @media (min-width: 480px) {
          .goog-te-menu2-item {
            padding: 6px 8px !important;
            font-size: 12px !important;
          }
        }
        @media (min-width: 640px) {
          .goog-te-menu2-item {
            padding: 7px 10px !important;
            font-size: 13px !important;
          }
        }
        @media (min-width: 768px) {
          .goog-te-menu2-item {
            padding: 8px 12px !important;
            font-size: 14px !important;
          }
        }
        @media (min-width: 1024px) {
          .goog-te-menu2-item {
            padding: 9px 14px !important;
            font-size: 15px !important;
          }
        }
        .goog-te-menu2-item:hover {
          background-color: #f5f5f5 !important;
        }
        .goog-te-menu2-item-selected {
          background-color: #e3f2fd !important;
        }
        .goog-te-combo {
          padding: 3px 4px !important;
          border: 1px solid #ccc !important;
          border-radius: 4px !important;
          background: #124972 !important;
          color: white !important;
          font-size: 10px !important;
          min-width: 80px !important;
          width: 100% !important;
          box-sizing: border-box !important;
        }
        @media (min-width: 375px) {
          .goog-te-combo {
            padding: 4px 5px !important;
            font-size: 11px !important;
            min-width: 100px !important;
          }
        }
        @media (min-width: 480px) {
          .goog-te-combo {
            padding: 5px 6px !important;
            font-size: 12px !important;
            min-width: 120px !important;
          }
        }
        @media (min-width: 640px) {
          .goog-te-combo {
            padding: 6px 8px !important;
            font-size: 13px !important;
            min-width: 140px !important;
          }
        }
        @media (min-width: 768px) {
          .goog-te-combo {
            padding: 8px 12px !important;
            font-size: 14px !important;
            min-width: 150px !important;
          }
        }
        @media (min-width: 1024px) {
          .goog-te-combo {
            padding: 10px 14px !important;
            font-size: 15px !important;
            min-width: 180px !important;
          }
        }
        .goog-te-gadget-simple a {
          display: none !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value > span:first-child {
          display: none !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value > span:last-child {
          display: none !important;
        }
        .goog-te-gadget-simple .goog-te-menu-value:before {
          content: 'Lang' !important;
          color: white !important;
        }
        @media (min-width: 480px) {
          .goog-te-gadget-simple .goog-te-menu-value:before {
            content: 'Language' !important;
          }
        }
      `}</style>
    </div>
  )
}

export default GoogleTranslate