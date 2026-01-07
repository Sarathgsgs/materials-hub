import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, where } from 'firebase/firestore';
import { storage, db } from '../firebase/config';

// Upload file to Firebase Storage
export const uploadFile = async (file, metadata, onProgress) => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `materials/${metadata.subjectId}/${metadata.unitId}/${fileName}`);
    
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            
            // Save metadata to Firestore
            const fileData = {
              name: file.name,
              originalName: file.name,
              size: file.size,
              type: file.type,
              downloadURL,
              storagePath: uploadTask.snapshot.ref.fullPath,
              subjectId: metadata.subjectId,
              subjectName: metadata.subjectName,
              unitId: metadata.unitId,
              unitName: metadata.unitName,
              uploadedBy: metadata.uploadedBy,
              uploadedByEmail: metadata.uploadedByEmail,
              uploadDate: new Date().toISOString(),
              fileType: file.name.split('.').pop().toLowerCase()
            };

            const docRef = await addDoc(collection(db, 'files'), fileData);
            
            resolve({
              id: docRef.id,
              ...fileData
            });
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Upload file error:', error);
    throw error;
  }
};

// Get all files
export const getAllFiles = async () => {
  try {
    const q = query(collection(db, 'files'), orderBy('uploadDate', 'desc'));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Get files error:', error);
    throw error;
  }
};

// Get files by subject and unit
export const getFilesByUnit = async (subjectId, unitId) => {
  try {
    const q = query(
      collection(db, 'files'),
      where('subjectId', '==', subjectId),
      where('unitId', '==', unitId),
      orderBy('uploadDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Get files by unit error:', error);
    throw error;
  }
};

// Delete file
export const deleteFile = async (fileId, storagePath) => {
  try {
    // Delete from Storage
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);
    
    // Delete from Firestore
    await deleteDoc(doc(db, 'files', fileId));
    
    return { success: true };
  } catch (error) {
    console.error('Delete file error:', error);
    throw error;
  }
};

// Get upload history for a teacher
export const getUploadHistory = async (userEmail) => {
  try {
    const q = query(
      collection(db, 'files'),
      where('uploadedByEmail', '==', userEmail),
      orderBy('uploadDate', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Get upload history error:', error);
    throw error;
  }
};