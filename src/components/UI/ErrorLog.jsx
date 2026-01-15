import { useGameStore } from '../../stores/useGameStore'
import { useState } from 'react'

export default function ErrorLog() {
    const errors = useGameStore((state) => state.errors)
    const clearErrors = useGameStore((state) => state.clearErrors)
    const [isOpen, setIsOpen] = useState(false)

    // Only show in dev mode
    if (!import.meta.env.DEV) return null

    return (
        <>
            {/* Toggle button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: errors.length > 0 ? '#ff4444' : '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    fontSize: '20px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold'
                }}
            >
                {errors.length > 0 ? `⚠️ ${errors.length}` : '📋'}
            </button>

            {/* Error panel */}
            {isOpen && (
                <div style={{
                    position: 'fixed',
                    bottom: '80px',
                    right: '20px',
                    width: '400px',
                    maxHeight: '400px',
                    background: 'rgba(0, 0, 0, 0.95)',
                    color: '#fff',
                    borderRadius: '8px',
                    padding: '16px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                    zIndex: 999,
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '12px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '12px',
                        borderBottom: '1px solid #444',
                        paddingBottom: '8px'
                    }}>
                        <h3 style={{ margin: 0, fontSize: '14px' }}>🐛 Error Log ({errors.length})</h3>
                        <button
                            onClick={clearErrors}
                            style={{
                                background: '#ff4444',
                                color: 'white',
                                border: 'none',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '11px'
                            }}
                        >
                            Clear
                        </button>
                    </div>

                    {errors.length === 0 ? (
                        <p style={{ color: '#888', textAlign: 'center' }}>No errors logged ✅</p>
                    ) : (
                        errors.slice().reverse().map((error) => (
                            <div key={error.id} style={{
                                background: '#1a1a1a',
                                padding: '8px',
                                marginBottom: '8px',
                                borderRadius: '4px',
                                borderLeft: '3px solid #ff4444'
                            }}>
                                <div style={{ color: '#ff8888', fontWeight: 'bold', marginBottom: '4px' }}>
                                    {error.message}
                                </div>
                                <div style={{ color: '#888', fontSize: '10px', marginBottom: '4px' }}>
                                    {new Date(error.timestamp).toLocaleTimeString()}
                                </div>
                                {error.data && (
                                    <pre style={{
                                        color: '#aaa',
                                        fontSize: '10px',
                                        margin: 0,
                                        overflow: 'auto',
                                        maxHeight: '100px'
                                    }}>
                                        {JSON.stringify(error.data, null, 2)}
                                    </pre>
                                )}
                            </div>
                        ))
                    )}
                </div>
            )}
        </>
    )
}
