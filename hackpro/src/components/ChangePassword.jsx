import React, { useState } from 'react';
import { useAuth } from './AuthContext'; // Import useAuth
import { toast } from 'react-toastify';

const ChangePassword = () => {
    const { updatePassword } = useAuth(); // Use updatePassword from AuthContext
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Basic form validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setError('All fields are required.');
            toast.error('All fields are required.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match.');
            toast.error('New password and confirm password do not match.');
            return;
        }

        if (newPassword.length < 8) {
            setError('New password must be at least 8 characters long.');
            toast.error('New password must be at least 8 characters long.');
            return;
        }

        console.log('Sending change password request:', { currentPassword, newPassword, confirmPassword });

        try {
            const result = await updatePassword({
                currentPassword,
                newPassword,
                confirmPassword
            });

            if (result.success) {
                setMessage(result.message || 'Password changed successfully!');
                toast.success(result.message || 'Password changed successfully!');
            } else {
                throw new Error(result.error || 'Failed to change password.');
            }
        } catch (err) {
            console.error('Change password failed:', err);
            setError(err.message || 'Failed to change password. Please try again.');
            toast.error(err.message || 'Failed to change password. Please try again.');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
            <h2>Change Password</h2>
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleChangePassword}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="current-password">Current Password:</label>
                    <input
                        type="password"
                        id="current-password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="new-password">New Password:</label>
                    <input
                        type="password"
                        id="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="confirm-password">Confirm New Password:</label>
                    <input
                        type="password"
                        id="confirm-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;