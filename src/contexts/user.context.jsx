import { createContext, useState, useEffect } from 'react';

import { onAuthStateChangedListener, createUserDocumentFromAuth } from '../utils/firebase/firebase.utils'

// Erişilmek istenilen gerçek değerler
export const UserContext = createContext({
  currentUser: null,
  setCurrentUser: () => null,
});

// Erişmek istediğimiz kompnentleri sarmak için kullanacağımız provider
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const value = {currentUser, setCurrentUser}

  useEffect(() => {
    // auth instance'ını dinlemeye başlar.
    const unsubscribe = onAuthStateChangedListener((user) => {
      // Auth instance'nda user bilgisini kontrol eder
      if(user){
        // Eğer user bilgisi var ise documana kullanıcı kayıt eder.
        createUserDocumentFromAuth(user);
      }
      //Güncel durumu context üzerinde günceller.
      setCurrentUser(user)
    })

    // aboneliği sonlandırır.
    return unsubscribe
  }, [])

  // Provider ile alt komponentlere value şeklinde değerleri göndermemiz gerekmektedir.
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
