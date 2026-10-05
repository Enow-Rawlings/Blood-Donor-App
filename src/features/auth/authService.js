import { auth, db } from '../../services/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, writeBatch } from 'firebase/firestore';

/**
 * Register a new user and create their profile in Firestore
 */
export const signUp = async (email, password, profileData) => {
  try {
    const verificationUrl = profileData.medicalReportUrl || profileData.prescriptionUrl;
    if (!verificationUrl) {
      return { user: null, error: 'A verification document is required.' };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    const userProfile = { ...profileData };
    delete userProfile.medicalReportUrl;
    delete userProfile.prescriptionUrl;
    
    // Send email verification
    await sendEmailVerification(user);

    const batch = writeBatch(db);
    const userRef = doc(db, 'users', user.uid);
    batch.set(userRef, {
      uid: user.uid,
      email: email,
      status: 'pending',
      hasVerificationDocument: Boolean(verificationUrl),
      createdAt: new Date().toISOString(),
      ...userProfile
    });

    if (verificationUrl) {
      batch.set(doc(db, 'verificationDocuments', user.uid), {
        ownerId: user.uid,
        subjectType: 'user',
        documentUrl: verificationUrl,
        createdAt: serverTimestamp()
      });
    }

    if (userProfile.role === 'donor') {
      batch.set(doc(db, 'donorDirectory', user.uid), {
        uid: user.uid,
        role: 'donor',
        fullName: userProfile.fullName,
        bloodType: userProfile.bloodType,
        city: userProfile.city,
        profilePicUrl: userProfile.profilePicUrl || '',
        status: 'pending',
        availabilityStatus: userProfile.availabilityStatus || 'inactive'
      });
    }

    await batch.commit();
    return { user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

/**
 * Log in an existing user
 */
export const logIn = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error) {
    return { user: null, error: error.message };
  }
};

/**
 * Log out the current user
 */
export const logOut = () => signOut(auth);

/**
 * Send password reset email
 */
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);

/**
 * Update user profile in Firestore
 */
export const updateUserProfile = async (uid, data) => {
  const userRef = doc(db, "users", uid);
  const userSnapshot = await getDoc(userRef);
  if (!userSnapshot.exists()) throw new Error('User profile does not exist');

  const batch = writeBatch(db);
  batch.update(userRef, data);

  if (userSnapshot.data().role === 'donor') {
    const donorProfile = {};
    for (const field of ['fullName', 'city', 'profilePicUrl']) {
      if (field in data) donorProfile[field] = data[field];
    }
    if (Object.keys(donorProfile).length > 0) {
      batch.update(doc(db, 'donorDirectory', uid), donorProfile);
    }
  }

  return batch.commit();
};
