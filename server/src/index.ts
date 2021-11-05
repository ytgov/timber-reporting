import { port } from './config';
import { app } from './app';

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
