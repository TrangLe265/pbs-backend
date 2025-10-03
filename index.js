const express = require('express');
const cors = require('cors');
require('dotenv').config();


const app = express();
require('./swagger')(app);

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// Import endpoints
require('./endpoints/user')(app);
require('./endpoints/liftType')(app);
require('./endpoints/lift')(app);
require('./endpoints/dots')(app);
require('./endpoints/classification')(app);
require('./endpoints/coefficients')(app);

const port = process.env.PORT || 3000;
console.log('About to start server...');
app.listen(port, async () => {
  console.log(`Server started: Listening on port ${port}...`);
});
