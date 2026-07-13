const axios = require('axios');

async function seed() {
  try {
    const res = await axios.post('http://localhost:5000/api/auth/send-otp', { mobileNum: '8210160012' });
    const otp = res.data.message.match(/\d{4}/)[0];
    await axios.post('http://localhost:5000/api/auth/verify-otp', { mobileNum: '8210160012', otpVal: otp });
    const reg = await axios.post('http://localhost:5000/api/auth/register', { mobile: '8210160012', role: 'transporter', firstName: 'Rahul', password: 'password123' });
    console.log('Seed success:', reg.data);
  } catch (err) {
    console.log('Seed error:', err.response ? err.response.data : err.message);
  }
}
seed();
