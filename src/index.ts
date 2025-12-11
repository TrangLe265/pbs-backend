import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import swagger from './swagger';
import userRoute from './endpoints/user';
import liftTypeRoute from './endpoints/liftType';
import liftRoute from './endpoints/lift';
import dotsRoute from './endpoints/dots';
import classificationRoute from './endpoints/classification';
import coefficientsRoute from './endpoints/coefficients';


dotenv.config();

const app = express();
swagger(app);

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Import endpoints
userRoute(app);
liftTypeRoute(app);
liftRoute(app);
dotsRoute(app);
classificationRoute(app);
coefficientsRoute(app);

const port = process.env.PORT || 3000;
console.log('About to start server...');
app.listen(port, async () => {
  console.log(`Server started: Listening on port ${port}...`);
});
