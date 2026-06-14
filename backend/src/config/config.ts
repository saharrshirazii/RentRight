
require('dotenv').config();

const requiredVars = [
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'NODE_ENV',
];

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    console.error(
      'Missing environment variable:',
      varName
    );

    process.exit(1); // Terminate the application
  }
}

module.exports = {
  port: parseInt(process.env.PORT, 10),
  mongoUri: process.env.MONGODB_URI,
  jwtSecret: process.env.JWT_SECRET,
  nodeEnv: process.env.NODE_ENV,
};