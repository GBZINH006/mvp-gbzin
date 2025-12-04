let promise = null;
export function loadGoogleMaps(apiKey){
  if(!apiKey) return Promise.reject(new Error("NO_API_KEY"));
  if(promise) return promise;
  promise = new Promise((resolve, reject) => {
    if(window.google && window.google.maps) return resolve(window.google);
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true; script.defer = true;
    script.onload = () => window.google ? resolve(window.google) : reject(new Error("NO_GOOGLE_OBJ"));
    script.onerror = () => reject(new Error("SCRIPT_LOAD_ERROR"));
    document.head.appendChild(script);
  });
  return promise;
}
