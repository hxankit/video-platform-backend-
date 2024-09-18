// import jwt from 'jsonwebtoken';

// const tokenToVerify = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmU0M2MzY2JhODExZmU0ODMzYWJkMzYiLCJlbWFpbCI6Im9ub29AZ21haWwuY29tIiwidXNlcm5hbWUiOiJhbmtpdCIsImZ1bGxOYW1lIjoia2ZuYWdhbGtkbiIsImlhdCI6MTcyNjYyNzM0NSwiZXhwIjoxNzI2NjMwOTQ1fQ.CyJVCJ4rP9jNkj-3ywKctjgCurEoo-PJS9a9wfXE4iY';
// const secret = 'darkon'; // Make sure this matches what you used to sign

// try {
//     const decoded = jwt.verify(tokenToVerify, secret);
//     console.log('Decoded Token:', decoded);
// } catch (err) {
//     console.error('Token verification failed:', err.message);
// }


import jwt from 'jsonwebtoken';

// Secret used to sign the token
const secret = 'darkon'; // Ensure this matches exactly

// Create a payload
const payload = {
    _id: '66e43c3cba811fe4833abd36',
    email: 'onoo@gmail.com',
    username: 'ankit',
    fullName: 'kfnagalkdn',
};

// Sign the token
const token = jwt.sign(payload, secret, { expiresIn: '1h' });
console.log('Signed Token:', token);

// Verify the token
try {
    const decoded = jwt.verify(token, secret);
    console.log('Decoded Token:', decoded);
} catch (err) {
    console.error('Token verification failed:', err.message);
}
