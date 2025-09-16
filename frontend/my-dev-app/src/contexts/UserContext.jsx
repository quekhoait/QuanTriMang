import React, {  createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext({
    accessToken: '',
    setAccessToken: () => {},
    getUser: () => {},
})

export const UserProvider = ({children})=>{
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
    const [account, setAccount] = useState(null);
  //  const [userByEmail, setUserByEmail] = useState();

    const getUser = async(token)=>{
        try{
            if(!token){
            return;
            }
        const response = await fetch(`${process.env.REACT_APP_API_FRONTEND}/api/user/get-user`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        })
        if(response.ok){
            const dataUser = await response.json();
            setAccount(dataUser)
        }else{
            const responseRef = await fetch(`${process.env.REACT_APP_API_FRONTEND}/api/user/refreshToken`,{
                method: 'POST',
                credentials: 'include', // RẤT QUAN TRỌNG
            });
            if(responseRef.ok){
                const refreshData = await responseRef.json();
                const newAccessToken = refreshData.accessToken;
                setAccessToken(newAccessToken);
                localStorage.setItem('accessToken', newAccessToken);
                await getUser(newAccessToken)
            }else{
                setAccessToken('');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
          }
        }
        }catch (e) {
            console.error('Lỗi:', e.message);
            setAccount(null);
        }
    }

useEffect(() => {
  if (accessToken) {
    getUser(accessToken);
  }
}, [accessToken]);

  const getUserByEmail = async(email)=>{
        try{
        const response = await fetch(`${process.env.REACT_APP_API_FRONTEND}/api/user/getUserEmail/${email}`,{
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if(response.ok){
            const dataUser = await response.json();
            return dataUser.data;
        }else{
          alert("Lỗi API")
        }
        }catch (e) {
            console.error('Lỗi:', e.message);
        }
    }


  return (
    <UserContext.Provider value={{ account, accessToken, setAccessToken, getUser, getUserByEmail }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = ()=>useContext(UserContext)