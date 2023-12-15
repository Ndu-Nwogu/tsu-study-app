import React, { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../database/firebaseConfig';

const useAuth = () => {
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth, user=>{
            console.log('got user, ', user);
            if(user){
                setUser(user);
            } else{
                setUser(null)
            }
        });
        return unsub;
    },[])
  return {user}
}

export default useAuth;
