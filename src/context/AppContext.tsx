const cleanEmail = fbUser.email.toLowerCase();
const isAdmin = cleanEmail === 'moussawague062@gmail.com';

const userObj: User = {
  id: fbUser.uid,
  name: fbUser.displayName || (isAdmin ? 'Moussa Wagué (Admin)' : cleanEmail.split('@')[0]),
  email: cleanEmail,
  role: isAdmin ? 'admin' : 'user',
  phoneNumber: isAdmin ? '+221 77 705 91 02' : undefined,
  createdAt: Date.now(),
};