import React, { useState, useContext } from 'react';
import { MyContext } from './MyContext'; 

const Auth = () => {
    const { setUserToken, setUserEmail } = useContext(MyContext);
    const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup modes
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
        // Base API URL configuration
        const BASE_URL = 'https://lumina-z6qm.onrender.com'; 

        try {
            const response = await fetch(`${BASE_URL}${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            if (isLogin) {
                // On successful login, save credentials globally
                setUserToken(data.token);
                setUserEmail(data.email);
            } else {
                // On successful signup, prompt user to toggle to login screen
                setMessage(data.message);
                setIsLogin(true);
                setPassword('');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#1e1e2e', color: '#cdd6f4', fontFamily: 'sans-serif' }}>
            <div style={{ background: '#313244', padding: '40px', borderRadius: '12px', width: '350px', boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '24px', color: '#cba6f7' }}>
                    {isLogin ? 'Login to Lumina' : 'Create Account'}
                </h2>

                {error && <div style={{ background: '#f38ba8', color: '#11111b', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>{error}</div>}
                {message && <div style={{ background: '#a6e3a1', color: '#11111b', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '14px' }}>{message}</div>}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Email Address</label>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #45475a', background: '#1e1e2e', color: '#cdd6f4', boxSizing: 'border-box' }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Password</label>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #45475a', background: '#1e1e2e', color: '#cdd6f4', boxSizing: 'border-box' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ width: '100%', padding: '12px', borderRadius: '6px', border: 'none', background: '#cba6f7', color: '#11111b', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}
                    >
                        {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#a6adc8' }}>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <span 
                        onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} 
                        style={{ color: '#cba6f7', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Auth;