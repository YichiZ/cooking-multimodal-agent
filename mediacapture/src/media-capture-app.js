import React, { useState, useRef, useCallback } from 'react';
import { Camera, Mic, Square, Play, Pause, Download, Trash2, Image, Volume2, Upload } from 'lucide-react';

const MediaCaptureApp = () => {
  const [isPhotoMode, setIsPhotoMode] = useState(true);
  const [stream, setStream] = useState(null);
  const [capturedPhotos, setCapturedPhotos] = useState([]);
  const [audioRecordings, setAudioRecordings] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const fileInputRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%)',
      padding: '1rem',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    maxWidth: {
      maxWidth: '64rem',
      margin: '0 auto'
    },
    title: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      textAlign: 'center',
      color: '#1f2937',
      marginBottom: '2rem'
    },
    modeToggle: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '2rem'
    },
    toggleContainer: {
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      padding: '0.25rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    toggleButton: {
      display: 'flex',
      alignItems: 'center',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.375rem',
      transition: 'all 0.2s',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem'
    },
    toggleButtonActive: {
      backgroundColor: '#3b82f6',
      color: 'white',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    },
    toggleButtonInactive: {
      color: '#4b5563',
      backgroundColor: 'transparent'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '0.75rem',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      padding: '1.5rem',
      marginBottom: '2rem'
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '1rem',
      textAlign: 'center'
    },
    error: {
      backgroundColor: '#fef2f2',
      border: '1px solid #fca5a5',
      color: '#b91c1c',
      padding: '0.75rem 1rem',
      borderRadius: '0.25rem',
      marginBottom: '1.5rem'
    },
    uploadSection: {
      marginBottom: '1.5rem',
      padding: '1rem',
      backgroundColor: '#f9fafb',
      borderRadius: '0.5rem'
    },
    uploadTitle: {
      fontSize: '1.125rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.75rem'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      transition: 'all 0.2s',
      border: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      margin: '0 auto'
    },
    primaryButton: {
      backgroundColor: '#3b82f6',
      color: 'white'
    },
    primaryButtonHover: {
      backgroundColor: '#2563eb'
    },
    purpleButton: {
      backgroundColor: '#8b5cf6',
      color: 'white'
    },
    purpleButtonHover: {
      backgroundColor: '#7c3aed'
    },
    greenButton: {
      backgroundColor: '#10b981',
      color: 'white'
    },
    greenButtonHover: {
      backgroundColor: '#059669'
    },
    redButton: {
      backgroundColor: '#ef4444',
      color: 'white'
    },
    redButtonHover: {
      backgroundColor: '#dc2626'
    },
    grayButton: {
      backgroundColor: '#6b7280',
      color: 'white'
    },
    grayButtonHover: {
      backgroundColor: '#4b5563'
    },
    submitButton: {
      backgroundColor: '#059669',
      color: 'white',
      fontSize: '1.125rem',
      fontWeight: '600'
    },
    submitButtonHover: {
      backgroundColor: '#047857'
    },
    submitButtonDisabled: {
      backgroundColor: '#9ca3af',
      cursor: 'not-allowed'
    },
    submitSection: {
      textAlign: 'center',
      padding: '1.5rem',
      backgroundColor: '#f8fafc',
      borderRadius: '0.5rem',
      border: '2px dashed #cbd5e1'
    },
    submitTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1f2937',
      marginBottom: '0.5rem'
    },
    submitDescription: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '1rem'
    },
    helpText: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginTop: '0.5rem',
      textAlign: 'center'
    },
    borderTop: {
      borderTop: '1px solid #e5e7eb',
      paddingTop: '1.5rem'
    },
    video: {
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      maxWidth: '100%',
      height: 'auto'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1rem',
      marginTop: '1rem'
    },
    recordingTime: {
      fontSize: '1.5rem',
      fontFamily: 'monospace',
      color: '#ef4444',
      marginBottom: '1rem',
      textAlign: 'center'
    },
    gallery: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1rem'
    },
    photoCard: {
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      overflow: 'hidden'
    },
    photoImage: {
      width: '100%',
      height: '12rem',
      objectFit: 'cover'
    },
    photoInfo: {
      padding: '0.75rem',
      backgroundColor: '#f9fafb'
    },
    photoHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.5rem'
    },
    timestamp: {
      fontSize: '0.875rem',
      color: '#4b5563'
    },
    badge: {
      fontSize: '0.75rem',
      padding: '0.25rem 0.5rem',
      borderRadius: '0.25rem',
      fontWeight: '500'
    },
    uploadedBadge: {
      backgroundColor: '#f3e8ff',
      color: '#7c3aed'
    },
    capturedBadge: {
      backgroundColor: '#dbeafe',
      color: '#2563eb'
    },
    filename: {
      fontSize: '0.75rem',
      color: '#6b7280',
      marginBottom: '0.5rem',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },
    photoActions: {
      display: 'flex',
      gap: '0.5rem'
    },
    smallButton: {
      padding: '0.25rem 0.75rem',
      borderRadius: '0.25rem',
      fontSize: '0.875rem',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    flexOne: {
      flex: 1
    },
    audioCard: {
      border: '1px solid #e5e7eb',
      borderRadius: '0.5rem',
      padding: '1rem',
      marginBottom: '1rem'
    },
    audioHeader: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '0.75rem'
    },
    audioInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    audioActions: {
      display: 'flex',
      gap: '0.5rem'
    },
    audioPlayer: {
      width: '100%',
      marginTop: '0.5rem'
    },
    hiddenInput: {
      display: 'none'
    },
    icon: {
      width: '1.25rem',
      height: '1.25rem',
      marginRight: '0.5rem'
    },
    smallIcon: {
      width: '1rem',
      height: '1rem',
      marginRight: '0.25rem'
    },
    titleIcon: {
      width: '1.25rem',
      height: '1.25rem',
      marginRight: '0.5rem'
    }
  };

  // Start camera for photo capture
  const startCamera = useCallback(async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Failed to access camera: ' + err.message);
    }
  }, []);

  // Start microphone for audio recording
  const startMicrophone = useCallback(async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
      setStream(mediaStream);
    } catch (err) {
      setError('Failed to access microphone: ' + err.message);
    }
  }, []);

  // Stop media stream
  const stopMediaStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  // Upload photos from file picker
  const handlePhotoUpload = useCallback((event) => {
    const files = Array.from(event.target.files);
    
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newPhoto = {
            id: Date.now() + Math.random(),
            url: e.target.result,
            timestamp: new Date().toLocaleString(),
            filename: file.name,
            isUploaded: true
          };
          setCapturedPhotos(prev => [...prev, newPhoto]);
        };
        reader.readAsDataURL(file);
      }
    });
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Trigger file picker
  const triggerPhotoUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Capture photo
  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob);
      const newPhoto = {
        id: Date.now(),
        url,
        timestamp: new Date().toLocaleString(),
        isUploaded: false
      };
      setCapturedPhotos(prev => [...prev, newPhoto]);
    }, 'image/jpeg', 0.9);
  }, []);

  // Start audio recording
  const startRecording = useCallback(() => {
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    const chunks = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      const newRecording = {
        id: Date.now(),
        url,
        timestamp: new Date().toLocaleString(),
        duration: recordingTime
      };
      setAudioRecordings(prev => [...prev, newRecording]);
      setRecordingTime(0);
    };

    mediaRecorder.start();
    setIsRecording(true);
    
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, [stream, recordingTime]);

  // Stop audio recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(recordingIntervalRef.current);
    }
  }, [isRecording]);

  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Submit media to server
  const submitMedia = async () => {
    if (capturedPhotos.length === 0 && audioRecordings.length === 0) {
      setError('Please capture or upload at least one photo or audio recording before submitting.');
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSubmitSuccess(false);

    try {
      const formData = new FormData();

      // Add photos to form data
      for (let i = 0; i < capturedPhotos.length; i++) {
        const photo = capturedPhotos[i];
        
        // Convert data URL to blob for captured photos
        if (!photo.isUploaded) {
          const response = await fetch(photo.url);
          const blob = await response.blob();
          formData.append('files', blob, `captured-photo-${photo.id}.jpg`);
        } else {
          // For uploaded photos, we need to convert the data URL back to blob
          const response = await fetch(photo.url);
          const blob = await response.blob();
          formData.append('files', blob, photo.filename || `uploaded-photo-${photo.id}.jpg`);
        }
      }

      // Add audio recordings to form data
      for (let i = 0; i < audioRecordings.length; i++) {
        const recording = audioRecordings[i];
        const response = await fetch(recording.url);
        const blob = await response.blob();
        formData.append('files', blob, `recording-${recording.id}.webm`);
      }

      // Send to server
      const response = await fetch('http://127.0.0.1:8000/upload-multiple', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Upload successful:', result);
      
      setSubmitSuccess(true);
      
      // Optional: Clear media after successful upload
      // setCapturedPhotos([]);
      // setAudioRecordings([]);
      
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Failed to upload media: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Download media
  const downloadMedia = (url, filename) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Delete media
  const deletePhoto = (id) => {
    setCapturedPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const deleteRecording = (id) => {
    setAudioRecordings(prev => prev.filter(recording => recording.id !== id));
  };

  // Switch modes
  const switchToPhotoMode = () => {
    stopMediaStream();
    setIsPhotoMode(true);
    setError('');
  };

  const switchToAudioMode = () => {
    stopMediaStream();
    setIsPhotoMode(false);
    setError('');
  };

  return (
    <div style={styles.container}>
      <div style={styles.maxWidth}>
        <h1 style={styles.title}>
          Media Capture Studio
        </h1>

        {/* Mode Toggle */}
        <div style={styles.modeToggle}>
          <div style={styles.toggleContainer}>
            <button
              onClick={switchToPhotoMode}
              style={{
                ...styles.toggleButton,
                ...(isPhotoMode ? styles.toggleButtonActive : styles.toggleButtonInactive)
              }}
              onMouseEnter={(e) => {
                if (!isPhotoMode) e.target.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                if (!isPhotoMode) e.target.style.backgroundColor = 'transparent';
              }}
            >
              <Camera style={styles.icon} />
              Photos
            </button>
            <button
              onClick={switchToAudioMode}
              style={{
                ...styles.toggleButton,
                ...(!isPhotoMode ? styles.toggleButtonActive : styles.toggleButtonInactive)
              }}
              onMouseEnter={(e) => {
                if (isPhotoMode) e.target.style.backgroundColor = '#f3f4f6';
              }}
              onMouseLeave={(e) => {
                if (isPhotoMode) e.target.style.backgroundColor = 'transparent';
              }}
            >
              <Mic style={styles.icon} />
              Audio
            </button>
          </div>
        </div>

        {error && (
          <div style={styles.error}>
            {error}
          </div>
        )}

        {/* Photo Mode */}
        {isPhotoMode && (
          <div style={styles.card}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={styles.cardTitle}>Photo Capture & Upload</h2>
              
              {/* Upload Photos Section */}
              <div style={styles.uploadSection}>
                <h3 style={styles.uploadTitle}>Upload Existing Photos</h3>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  style={styles.hiddenInput}
                />
                <button
                  onClick={triggerPhotoUpload}
                  style={{ ...styles.button, ...styles.purpleButton }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.purpleButtonHover.backgroundColor}
                  onMouseLeave={(e) => e.target.style.backgroundColor = styles.purpleButton.backgroundColor}
                >
                  <Upload style={styles.icon} />
                  Choose Photos
                </button>
                <p style={styles.helpText}>Select one or multiple photos from your device</p>
              </div>

              {/* Camera Section */}
              <div style={styles.borderTop}>
                <h3 style={styles.uploadTitle}>Or Capture New Photos</h3>
                {!stream ? (
                  <button
                    onClick={startCamera}
                    style={{ ...styles.button, ...styles.primaryButton }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.primaryButtonHover.backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = styles.primaryButton.backgroundColor}
                  >
                    <Camera style={styles.icon} />
                    Start Camera
                  </button>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        style={styles.video}
                      />
                    </div>
                    <div style={styles.buttonGroup}>
                      <button
                        onClick={capturePhoto}
                        style={{ ...styles.button, ...styles.greenButton }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.greenButtonHover.backgroundColor}
                        onMouseLeave={(e) => e.target.style.backgroundColor = styles.greenButton.backgroundColor}
                      >
                        <Camera style={styles.icon} />
                        Capture Photo
                      </button>
                      <button
                        onClick={stopMediaStream}
                        style={{ ...styles.button, ...styles.redButton }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.redButtonHover.backgroundColor}
                        onMouseLeave={(e) => e.target.style.backgroundColor = styles.redButton.backgroundColor}
                      >
                        <Square style={styles.icon} />
                        Stop Camera
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <canvas ref={canvasRef} style={styles.hiddenInput} />
          </div>
        )}

        {/* Audio Mode */}
        {!isPhotoMode && (
          <div style={styles.card}>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <h2 style={styles.cardTitle}>Audio Recording</h2>
              
              {!stream ? (
                <button
                  onClick={startMicrophone}
                  style={{ ...styles.button, ...styles.primaryButton }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = styles.primaryButtonHover.backgroundColor}
                  onMouseLeave={(e) => e.target.style.backgroundColor = styles.primaryButton.backgroundColor}
                >
                  <Mic style={styles.icon} />
                  Enable Microphone
                </button>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  {isRecording && (
                    <div style={styles.recordingTime}>
                      🔴 REC {formatTime(recordingTime)}
                    </div>
                  )}
                  
                  <div style={styles.buttonGroup}>
                    {!isRecording ? (
                      <button
                        onClick={startRecording}
                        style={{ ...styles.button, ...styles.redButton }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.redButtonHover.backgroundColor}
                        onMouseLeave={(e) => e.target.style.backgroundColor = styles.redButton.backgroundColor}
                      >
                        <Mic style={styles.icon} />
                        Start Recording
                      </button>
                    ) : (
                      <button
                        onClick={stopRecording}
                        style={{ ...styles.button, ...styles.grayButton }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.grayButtonHover.backgroundColor}
                        onMouseLeave={(e) => e.target.style.backgroundColor = styles.grayButton.backgroundColor}
                      >
                        <Square style={styles.icon} />
                        Stop Recording
                      </button>
                    )}
                    
                    <button
                      onClick={stopMediaStream}
                      style={{ ...styles.button, ...styles.redButton }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = styles.redButtonHover.backgroundColor}
                      onMouseLeave={(e) => e.target.style.backgroundColor = styles.redButton.backgroundColor}
                    >
                      <Square style={styles.icon} />
                      Stop Microphone
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Submit Section */}
        {(capturedPhotos.length > 0 || audioRecordings.length > 0) && (
          <div style={styles.card}>
            <div style={styles.submitSection}>
              <h3 style={styles.submitTitle}>Submit Media</h3>
              <p style={styles.submitDescription}>
                Upload {capturedPhotos.length} photo{capturedPhotos.length !== 1 ? 's' : ''} 
                {capturedPhotos.length > 0 && audioRecordings.length > 0 ? ' and ' : ''}
                {audioRecordings.length > 0 && `${audioRecordings.length} audio recording${audioRecordings.length !== 1 ? 's' : ''}`} 
                to the server
              </p>
              <button
                onClick={submitMedia}
                disabled={isSubmitting || (capturedPhotos.length === 0 && audioRecordings.length === 0)}
                style={{
                  ...styles.button,
                  ...(isSubmitting || (capturedPhotos.length === 0 && audioRecordings.length === 0) 
                    ? styles.submitButtonDisabled 
                    : styles.submitButton
                  )
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting && (capturedPhotos.length > 0 || audioRecordings.length > 0)) {
                    e.target.style.backgroundColor = styles.submitButtonHover.backgroundColor;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting && (capturedPhotos.length > 0 || audioRecordings.length > 0)) {
                    e.target.style.backgroundColor = styles.submitButton.backgroundColor;
                  }
                }}
              >
                <Upload style={styles.icon} />
                {isSubmitting ? 'Uploading...' : 'Submit All Media'}
              </button>
            </div>
          </div>
        )}

        {/* Captured Photos Gallery */}
        {capturedPhotos.length > 0 && (
          <div style={styles.card}>
            <h3 style={{ ...styles.cardTitle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image style={styles.titleIcon} />
              Captured Photos ({capturedPhotos.length})
            </h3>
            <div style={styles.gallery}>
              {capturedPhotos.map((photo) => (
                <div key={photo.id} style={styles.photoCard}>
                  <img 
                    src={photo.url} 
                    alt="Captured" 
                    style={styles.photoImage}
                  />
                  <div style={styles.photoInfo}>
                    <div style={styles.photoHeader}>
                      <p style={styles.timestamp}>{photo.timestamp}</p>
                      <span style={{
                        ...styles.badge,
                        ...(photo.isUploaded ? styles.uploadedBadge : styles.capturedBadge)
                      }}>
                        {photo.isUploaded ? 'Uploaded' : 'Captured'}
                      </span>
                    </div>
                    {photo.filename && (
                      <p style={styles.filename}>{photo.filename}</p>
                    )}
                    <div style={styles.photoActions}>
                      <button
                        onClick={() => downloadMedia(
                          photo.url, 
                          photo.filename || `photo-${photo.id}.jpg`
                        )}
                        style={{
                          ...styles.smallButton,
                          ...styles.flexOne,
                          backgroundColor: '#3b82f6',
                          color: 'white'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                      >
                        <Download style={styles.smallIcon} />
                        Download
                      </button>
                      <button
                        onClick={() => deletePhoto(photo.id)}
                        style={{
                          ...styles.smallButton,
                          backgroundColor: '#ef4444',
                          color: 'white'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                      >
                        <Trash2 style={{ width: '1rem', height: '1rem' }} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audio Recordings */}
        {audioRecordings.length > 0 && (
          <div style={styles.card}>
            <h3 style={{ ...styles.cardTitle, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Volume2 style={styles.titleIcon} />
              Audio Recordings ({audioRecordings.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {audioRecordings.map((recording) => (
                <div key={recording.id} style={styles.audioCard}>
                  <div style={styles.audioHeader}>
                    <div style={styles.audioInfo}>
                      <p style={styles.timestamp}>{recording.timestamp}</p>
                      <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Duration: {formatTime(recording.duration)}</p>
                    </div>
                    <div style={styles.audioActions}>
                      <button
                        onClick={() => downloadMedia(recording.url, `recording-${recording.id}.webm`)}
                        style={{
                          ...styles.smallButton,
                          backgroundColor: '#3b82f6',
                          color: 'white'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
                      >
                        <Download style={styles.smallIcon} />
                        Download
                      </button>
                      <button
                        onClick={() => deleteRecording(recording.id)}
                        style={{
                          ...styles.smallButton,
                          backgroundColor: '#ef4444',
                          color: 'white'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = '#ef4444'}
                      >
                        <Trash2 style={{ width: '1rem', height: '1rem' }} />
                      </button>
                    </div>
                  </div>
                  <audio controls style={styles.audioPlayer}>
                    <source src={recording.url} type="audio/webm" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaCaptureApp;