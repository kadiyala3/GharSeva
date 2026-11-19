import React, { useState, useContext, useRef } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Camera } from 'lucide-react';

const ProfilePictureUpload = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getProfileImage = () => {
    if (user?.profileImage) {
      return user.profileImage.startsWith('http') 
        ? user.profileImage 
        : `http://localhost:5000${user.profileImage}`;
    }
    return `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=4f46e5&color=fff`;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload a valid image file');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const { data } = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data.success) {
        toast.success('Profile picture updated successfully!');
        updateUser({ ...user, profileImage: data.imagePath }); 
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
      <div 
        style={{ 
          position: 'relative', 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          cursor: 'pointer',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          border: '4px solid white',
          overflow: 'hidden'
        }}
        onClick={handleImageClick}
        title="Click to upload new picture"
      >
        <img 
          src={getProfileImage()} 
          alt="Profile" 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        
        {/* Hover overlay with camera icon */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'rgba(0,0,0,0.6)',
          height: '40%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          transition: 'all 0.3s ease',
        }}>
          <Camera size={20} color="white" />
        </div>

        {uploading && (
          <div style={{
            position: 'absolute',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(255,255,255,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontWeight: 'bold',
            color: '#4f46e5'
          }}>
            Uploading...
          </div>
        )}
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/jpeg, image/png, image/jpg" 
        style={{ display: 'none' }}
      />
      
      <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
        Click image to upload new picture
      </p>
    </div>
  );
};

export default ProfilePictureUpload;
