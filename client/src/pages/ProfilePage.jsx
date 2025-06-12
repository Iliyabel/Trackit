import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from "./ProfilePage.module.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from '../components/AuthProvider'; 
import { getUserProfile, postUserProfile } from '../util/ApiProvider';

function ProfilePage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext); // Get user from AuthContext

    const [profileData, setProfileData] = useState(null);
    const [formData, setFormData] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {

        const fetchProfile = async () => {
            if (!user || !user.token) {
                setError("User not authenticated. Please log in.");
                setIsLoading(false);
                navigate('/login');
                return;
            }
            try {
                setIsLoading(true);
                setError(null);
                console.log('AccountPage: Fetching profile...');
                const data = await getUserProfile(user.token);
                console.log('AccountPage: Fetched profile data:', data);
                setProfileData(data);
                setFormData(data || {}); // Initialize form data with fetched profile
            } catch (err) {
                console.error("Error fetching user profile:", err);
                setError(err.message || "Failed to load profile.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };

    const toggleEditMode = () => {
        if (isEditing) { // Switching from Edit to View
            setFormData(profileData || {}); // Revert formData to original profileData
        } else { // Switching from View to Edit
            setFormData(profileData || {}); // Ensure formData is based on the current profileData
        }
        setIsEditing(!isEditing);
        setError(null); // Clear errors when toggling mode
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!user || !user.token) {
            setError("Authentication required to save profile.");
            return;
        }
        setIsLoading(true);
        setError(null);
        try {
            // The backend PostProfile.java uses the userId from the auth token, so send the editable fields.
            await postUserProfile(user.token, formData);
            setProfileData(formData);
            setFormData(formData); // Update formData as well
            setIsEditing(false);
        } catch (err) {
            console.error("Error saving user profile:", err);
            setError(err.message || "Failed to save profile.");
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && !profileData) { // Show loading only if profileData is not yet available
        return (
            <div className={styles.container}>
                <Header />
                <div className={styles.card}>
                    <p className={styles.loadingMessage}>Loading account details...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Header />
                <div className={styles.card}>
                    <h1 className={styles.title}>Account Information</h1>

                    {error && <p className={styles.errorMessage}>{error}</p>}
                    
                    {profileData ? (
                        <div className={styles.profileForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email || ''}
                                    readOnly // Email is always read-only
                                    className={styles.readOnlyInput}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="firstName">First Name</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName || ''}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    className={!isEditing ? styles.readOnlyInput : ''}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="lastName">Last Name</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName || ''}
                                    onChange={handleInputChange}
                                    readOnly={!isEditing}
                                    className={!isEditing ? styles.readOnlyInput : ''}
                                />
                            </div>

                            <div className={styles.formActions}>
                                {isEditing ? (
                                    <>
                                        <button  className={styles.primaryButton} onClick={handleSaveProfile} disabled={isLoading}>
                                            {isLoading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                        <button  className={styles.secondaryButton} onClick={toggleEditMode} disabled={isLoading}>
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button className={styles.primaryButton} onClick={toggleEditMode}>
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        !isLoading && <p>No profile data found. You might need to create a profile.</p>
                    )}
                </div>
            <Footer />
        </div>
    );
}

export default ProfilePage;