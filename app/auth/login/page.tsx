'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '../../lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  async function handleLogin() {
    setLoading(true)
    setError('')

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (loginError) {
      setError(loginError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

      if (profile?.role === 'business') {
        router.push('/business/dashboard')
      } else {
        router.push('/worker/dashboard')
      }
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    padding: '0.85rem 1rem',
    color: 'var(--text)',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: "'DM Sans', sans-serif",
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
    }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.6rem', fontWeight: 800, color: 'var(--text)' }}>
              Talent<span style={{ color: 'var(--accent)' }}>gate</span>
            </span>
          </Link>
        </div>
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 20,
          padding: '2.5rem',
        }}>
          <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: '1.6rem', fontWeight: 800, marginBottom: '0.5rem' }}>Welcome back</h1>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>Log in to your Talentgate account.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>Email address</label>
              <input type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} style={inputStyle} />
            </div>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--muted)', display: 'block', marginBottom: '0.4rem' }}>Password</label>
              <input type="password" placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)} style={inputStyle} />
            </div>
            {error && (
              <div style={{
                background: 'rgba(255,80,80,0.1)', border: '1px solid rgba(255,80,80,0.3)',
                borderRadius: 8, padding: '0.75rem 1rem', color: '#ff5050', fontSize: '0.85rem'
              }}>{error}</div>
            )}
            <button
              onClick={handleLogin}
              disabled={loading}
              style={{
                background: 'var(--accent)', color: '#04080F',
                padding: '0.9rem', borderRadius: 10,
                fontWeight: 700, fontSize: '0.95rem',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                fontFamily: "'DM Sans', sans-serif",
                marginTop: '0.5rem',
              }}
            >{loading ? 'Logging in...' : 'Log in →'}</button>
          </div>
          <p style={{ textAlign: 'center', color: 'var(--muted)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
            Don't have an account?{' '}
            <Link href="/auth/signup" style=