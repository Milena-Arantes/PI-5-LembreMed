import { router } from "expo-router"
import {
    createUserWithEmailAndPassword,
    getAuth,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    User
} from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"
import { app } from "../services/firebase"
import { syncService } from "../services/sincronizacao"

interface IAuthContext {
  user: User | null
  handleLogin: (email?: string, password?: string) => Promise<void>
  handleRegister: (email?: string, password?: string) => Promise<void>
  setCredentials: (email: string, password: string) => void
  syncStatus: 'idle' | 'syncing' | 'success' | 'error' //estado inicial - sincronizando / sincronizado / nao deu pra sincronizar
}

interface IAuthProviderProps {
    children: React.ReactNode
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export const AuthProvider: React.FC<IAuthProviderProps> = ({ children }) => {
    const auth = getAuth(app)

    const [user, setUser] = useState<User | null>(null)
    const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'error'>('idle') //mesma coisa aquii

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    function setCredentials(email: string, password: string) {
        setEmail(email)
        setPassword(password)
    }

    // observer pra sincronizacao 
    useEffect(() => {
        const syncObserver = {
            onSyncStart: () => {
                //console.log("sincronização iniciada")
                setSyncStatus('syncing')
            },
            onSyncComplete: (success: boolean, error?: any) => {
                //console.log("sincronização finalizada:", success ? 'sucesso' : 'erro')
                setSyncStatus(success ? 'success' : 'error')
                
                //isso aqui é pra mensagem nao ficar travada na tela, qunado volta pro neutro ela some
                setTimeout(() => {
                    setSyncStatus('idle')
                }, 3000)
            },
            onItemSynced: (item: any, operation: 'create' | 'delete') => {
                console.log(`Item sincronizado: ${item.nomeMedicamento} (${operation})`)
            }
        }

        syncService.addObserver(syncObserver)

        return () => {
            syncService.removeObserver(syncObserver)
        }
    }, [])

    // "observa" alterações no login, tipo usuario entrou, usuario saiu, serve pro sistema saber o status do usuário automaticamente
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser)

            if (firebaseUser) {
                console.log("Usuário autenticado:", firebaseUser.uid)
            } else {
                console.log("Nenhum usuário logado")
            }
        })

        return unsubscribe
    }, [])

    async function handleLogin(emailParam?: string, passwordParam?: string) {
        const finalEmail = emailParam ?? email
        const finalPassword = passwordParam ?? password

        if (!finalEmail || !finalPassword) {
            alert("Preencha todos os campos")
            return
        }

        try {
            await signInWithEmailAndPassword(auth, finalEmail, finalPassword)
            router.push("./home")
        } catch {
            alert("Erro ao fazer login")
        }
    }

    async function handleRegister(emailParam?: string, passwordParam?: string) {
        const finalEmail = emailParam ?? email
        const finalPassword = passwordParam ?? password

        if (!finalEmail || !finalPassword) {
            alert("Preencha todos os campos")
            return
        }

        try {
            await createUserWithEmailAndPassword(auth, finalEmail, finalPassword)
            alert("Cadastro realizado com sucesso!")
            router.replace("/")
        } catch (error: any) {
            alert("Erro ao cadastrar: " + error.message)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                setCredentials,
                handleLogin,
                handleRegister,
                syncStatus
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
