const app = require('./app');
const connectDB = require('./config/db');
const { configureCloudinary } = require('./config/cloudinary');
const env = require('./config/env');

const start = async () => {
  // Connect to MongoDB
  await connectDB();

  // Configure Cloudinary (if env vars are set)
  configureCloudinary();

  // Start HTTP server
  app.listen(env.PORT, () => {
    console.log(`🚀 Server running on http://localhost:${env.PORT} in ${env.NODE_ENV} mode`);
    console.log(`📚 API available at http://localhost:${env.PORT}/api/v1`);
  });
};

start().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});
