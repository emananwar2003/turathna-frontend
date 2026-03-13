import { useEffect, useState, useRef } from "react";
import { Button } from "@material-tailwind/react";

let googleTranslateLoaded = false;

export default function LanguageSwitcher() {
  const [lang, setLang] = useState("en");
  const translateSelectRef = useRef(null);
  const [ready, setReady] = useState(googleTranslateLoaded); 

  useEffect(() => {
    if (!googleTranslateLoaded) {
    
      if (!document.getElementById("google-translate-script")) {
        const script = document.createElement("script");
        script.id = "google-translate-script";
        script.src =
          "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        script.async = true;

     
        window.googleTranslateElementInit = () => {
          new window.google.translate.TranslateElement(
            { pageLanguage: "en" },
            "google_translate_element",
          );

          
          const interval = setInterval(() => {
            const select = document.querySelector(".goog-te-combo");
            if (select) {
              translateSelectRef.current = select;
              setReady(true);
              googleTranslateLoaded = true;
              clearInterval(interval);
            }
          }, 50);
        };

        document.body.appendChild(script);
      }
    } else {
     
      if (!translateSelectRef.current) {
        const interval = setInterval(() => {
          const select = document.querySelector(".goog-te-combo");
          if (select) {
            translateSelectRef.current = select;
            setReady(true);
            clearInterval(interval);
          }
        }, 50);
      }
    }
  }, []);

  const toggleLanguage = () => {
    if (!ready || !translateSelectRef.current) return;

    const newLang = lang === "en" ? "ar" : "en";
    setLang(newLang);

    translateSelectRef.current.value = newLang;
    translateSelectRef.current.dispatchEvent(new Event("change"));
  };

  return (
    <div className="flex items-center">
      <Button
        size="sm"
        variant="outlined"
        className="rounded-full px-4 border border-white bg-transparent text-white"
        onClick={toggleLanguage}
        disabled={!ready} 
      >
        {lang.toUpperCase()}
      </Button>

   
      <div id="google_translate_element" className="hidden"></div>
    </div>
  );
}
