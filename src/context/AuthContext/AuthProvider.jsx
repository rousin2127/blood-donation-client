import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, reload, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';
import { auth } from '../../firebase/firebase.init';
import axios from 'axios';




const googleProvider = new GoogleAuthProvider()

const AuthProvider = ({children}) => {

    const[user, setUser]=  useState(null)
    const[loading, setLoading] = useState(true)
    const[roleLoading, setRoleLoading] = useState(true)
    const [role, setRole]= useState('')
    // null = not loaded yet; 'active' | 'blocked' from DB; 'missing' = no DB row; 'error' = fetch failed
    const [userStatus, setUserStatus] = useState(null);
    /** Bumps after reload(authUser) so UI re-reads displayName/photoURL (same object ref would skip React update). */
    const [authRevision, setAuthRevision] = useState(0);
    const registerUser= (email, password)=>{
        setLoading(true)
        return createUserWithEmailAndPassword(auth, email, password)
        
    }


    const signInUser = (email,password)=>{
        setLoading(true)
        return signInWithEmailAndPassword(auth,email, password)
        
    }

    const signInGoogle = () =>{
        setLoading(true)
        return signInWithPopup(auth, googleProvider)
    }

    const logOut = () =>{
        setLoading(true);
        return signOut(auth)
    }

    const updateUserProfile = (profile)=>{

        return updateProfile(auth.currentUser, profile)
    }

    /** Call after saving profile so Navbar / dashboard read fresh displayName & photoURL from Firebase. */
    const refreshAuthUser = async () => {
        const u = auth.currentUser;
        if (!u) return;
        try {
            await reload(u);
            setAuthRevision((r) => r + 1);
            setUser(u);
        } catch (e) {
            console.error(e);
        }
    }



    useEffect( ()=> {
        const unSubscribe = onAuthStateChanged(auth, (currentUser)=>{
             setUser(currentUser);
             setLoading(false);
        })
        return ()=>{
            unSubscribe();
        }
    }, [])


    useEffect(() => {
        if (!user) {
            setRole('');
            setUserStatus(null);
            setRoleLoading(false);
            return;
        }

        setRoleLoading(true);
        const safeEmail = encodeURIComponent(user.email || '');
        axios
            .get(`https://blood-donation-server-tm6c.onrender.com/users/role/${safeEmail}`)
            .then((res) => {
                const doc = res.data;
                if (!doc) {
                    setRole('');
                    setUserStatus('missing');
                    return;
                }
                setRole(doc.role ?? '');
                setUserStatus(doc.status ?? 'active');
            })
            .catch(() => {
                setRole('');
                setUserStatus('error');
            })
            .finally(() => {
                setRoleLoading(false);
            });
    }, [user]);

   // console.log(role);
    

    const authInfo= {
        user,
        loading,
        registerUser,
        signInUser,
        signInGoogle,
        logOut,
        updateUserProfile,
        refreshAuthUser,
        authRevision,
        role,
        roleLoading,
        userStatus
    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;