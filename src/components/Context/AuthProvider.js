import React, {useState, useEffect} from 'react'
import { auth } from '../firebase/config'
import { useHistory } from 'react-router-dom'
import { Spin } from 'antd'

export const AuthContext = React.createContext()

function AuthProvider({ children }) {
    const [user, setUser] = useState({})
    const history = useHistory()
    const [isLoading, setIsLoading] = useState(true)

    React.useEffect(() => {
        const unsubscribed = auth.onAuthStateChanged((user) => {
            console.log({ user })

            if (user) {
                const { displayName, email, uid, photoURL } = user
                setUser({ 
                    displayName, email, uid, photoURL 
                })
                setIsLoading(false)
                history.push('/')
            }
            else {
                history.push('/login')
            }
        })

        // clean function
        return () => {
            unsubscribed()
        }
    }, [history])


    return (
        <AuthContext.Provider value={{ user }}>
            { isLoading ? <Spin /> : children}
        </AuthContext.Provider>
    );
}

export default AuthProvider