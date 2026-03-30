// Substitua os valores abaixo pelos dados do seu projeto Firebase
const firebaseConfig = {
    apiKey: "SEU_API_KEY",
    authDomain: "SEU_PROJECT_ID.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_PROJECT_ID.appspot.com",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};

let auth, db, useLocalStorage = false;

// Se estiver usando valores placeholder do Firebase, força o fallback local
const firebaseConfigPlaceholder = Object.values(firebaseConfig).some(value => typeof value === 'string' && value.startsWith('SEU_'));
if (firebaseConfigPlaceholder) {
    console.warn('Configuração Firebase não fornecida. Usando localStorage como fallback.');
    useLocalStorage = true;
} else {
    // Tenta inicializar Firebase, se falhar usa localStorage como fallback
    try {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
    } catch (error) {
        console.warn('Firebase não configurado. Usando localStorage como fallback.', error);
        useLocalStorage = true;
    }
}

function onAuthStateChanged(callback) {
    if (!useLocalStorage) {
        auth.onAuthStateChanged(callback);
    } else {
        // Fallback: verificar localStorage a cada 500ms
        const checkAuth = () => {
            const loggedUser = localStorage.getItem('loggedInUser');
            const user = loggedUser ? { uid: loggedUser, email: loggedUser } : null;
            callback(user);
        };
        checkAuth();
        // Verificar mudanças periodicamente
        const interval = setInterval(checkAuth, 500);
        // Permitir cleanup
        return () => clearInterval(interval);
    }
}

function signUpFirebase(email, password) {
    if (!email || !password) {
        return Promise.reject(new Error('E-mail e senha são obrigatórios.'));
    }

    if (!useLocalStorage) {
        return auth.createUserWithEmailAndPassword(email, password);
    } else {
        // Fallback localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.email === email)) {
            return Promise.reject(new Error('E-mail já cadastrado.'));
        }
        users.push({ email, password });
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('loggedInUser', email);
        window.dispatchEvent(new Event('authChanged')); // sincroniza UI imediatamente
        return Promise.resolve({ user: { uid: email, email } });
    }
}

function loginFirebase(email, password) {
    if (!email || !password) {
        return Promise.reject(new Error('E-mail e senha são obrigatórios.'));
    }

    if (!useLocalStorage) {
        return auth.signInWithEmailAndPassword(email, password);
    } else {
        // Fallback localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (!user) {
            return Promise.reject(new Error('E-mail ou senha inválidos.'));
        }
        localStorage.setItem('loggedInUser', email);
        // Disparar evento de mudança
        window.dispatchEvent(new Event('authChanged'));
        return Promise.resolve({ user: { uid: email, email } });
    }
}

function logoutFirebase() {
    if (!useLocalStorage) {
        return auth.signOut();
    } else {
        // Fallback localStorage
        localStorage.removeItem('loggedInUser');
        window.dispatchEvent(new Event('authChanged'));
        return Promise.resolve();
    }
}

function subscribeNewsletterFirebase(email) {
    if (!useLocalStorage) {
        return db.collection('newsletter').doc(email).set({
            email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    } else {
        // Fallback localStorage
        const newsletter = JSON.parse(localStorage.getItem('newsletter') || '[]');
        if (!newsletter.includes(email)) {
            newsletter.push(email);
            localStorage.setItem('newsletter', JSON.stringify(newsletter));
        }
        return Promise.resolve();
    }
}

function saveUserProgress(userId, courseId, courseName, completedLessons, totalLessons) {
    if (!useLocalStorage) {
        return db.collection('users').doc(userId).collection('progress').doc(courseId).set({
            courseId,
            courseName,
            completedLessons,
            totalLessons,
            lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    } else {
        // Fallback localStorage
        const progress = JSON.parse(localStorage.getItem(`progress_${userId}`) || '{}');
        progress[courseId] = {
            courseId,
            courseName,
            completedLessons,
            totalLessons,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
        return Promise.resolve();
    }
}

function getUserProgress(userId, courseId) {
    if (!useLocalStorage) {
        return db.collection('users').doc(userId).collection('progress').doc(courseId).get();
    } else {
        // Fallback localStorage
        const progress = JSON.parse(localStorage.getItem(`progress_${userId}`) || '{}');
        const data = progress[courseId];
        return Promise.resolve({
            exists: !!data,
            data: () => data || null
        });
    }
}

function getAllUserProgress(userId) {
    if (!useLocalStorage) {
        return db.collection('users').doc(userId).collection('progress').get();
    } else {
        // Fallback localStorage
        const progress = JSON.parse(localStorage.getItem(`progress_${userId}`) || '{}');
        const docs = Object.values(progress).map((data, index) => ({
            id: Object.keys(progress)[index],
            data: () => data,
            exists: true
        }));
        return Promise.resolve({
            empty: docs.length === 0,
            forEach: (callback) => docs.forEach(callback),
            size: docs.length
        });
    }
}

function getUserProfileData(userId) {
    if (!useLocalStorage) {
        return db.collection('users').doc(userId).get();
    } else {
        // Fallback localStorage
        const profile = JSON.parse(localStorage.getItem(`profile_${userId}`) || '{}');
        return Promise.resolve({
            exists: Object.keys(profile).length > 0,
            data: () => profile || null
        });
    }
}

function updateUserProfileData(userId, data) {
    if (!useLocalStorage) {
        return db.collection('users').doc(userId).set(data, { merge: true });
    } else {
        // Fallback localStorage
        const profile = JSON.parse(localStorage.getItem(`profile_${userId}`) || '{}');
        const updated = { ...profile, ...data };
        localStorage.setItem(`profile_${userId}`, JSON.stringify(updated));
        return Promise.resolve();
    }
}

function getCurrentUser() {
    if (!useLocalStorage) {
        return auth.currentUser;
    } else {
        const loggedInUser = localStorage.getItem('loggedInUser');
        return loggedInUser ? { uid: loggedInUser, email: loggedInUser } : null;
    }
}

